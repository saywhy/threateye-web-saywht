/* Controllers */
app.controller('Set_logController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
        };
        $scope.log = {
            start_time: moment().subtract(1, 'days').unix(),
            end_time: moment().unix(),
            username: '',
        };
        $scope.timerange(); // 时间插件初始化
        $scope.getPage(); // 获取日志列表
    };
    // 获取日志列表
    $scope.getPage = function (pageNow) {
        pageNow = pageNow ? pageNow : 1;
        $scope.index_num = (pageNow - 1) * 10;
        $scope.params_data = {
            username: $scope.log.username,
            start_time: $scope.log.start_time,
            end_time: $scope.log.end_time,
            page: pageNow,
            rows: 10
        };
        if (pageNow > 1000) {
            zeroModal.error('数据超过一万条,请缩小搜索条件');
        } else {
            var loading = zeroModal.loading(4);
            $http({
                method: 'get',
                url: './yiiapi//userlog/page',
                params: $scope.params_data,
            }).success(function (data) {
                if (data.status == 0) {
                    $scope.pages = data.data;
                }else if(data.status==600){
                    console.log(data.msg);
                    zeroModal.error(data.msg);
                }else{
                    zeroModal.error(data.msg);
                }
                zeroModal.close(loading);
            }).error(function (error) {
                console.log(error);
                zeroModal.close(loading);
            })
        }
    };
    //搜索
    $scope.search = function () {
        $scope.getPage(1);
    };
    // 下载报表
    $scope.download = function () {
        if ($scope.pages.count > 1000) {
            zeroModal.error('下载数据不能超出1000条！')
        } else {
            zeroModal.confirm({
                content: "确定下载列表吗？",
                okFn: function () {
                    $http({
                        method: 'get',
                        url: './yiiapi/site/check-auth-exist',
                        params: {
                            pathInfo: 'userlog/export-test'
                        }
                    }).success(function (data) {
                        if (data.status == 0) {
                            $scope.download_list();
                        }
                        if (data.status == 401) {
                            zeroModal.error(data.msg);
                        }
    
                    }).error(function (error) {
                        console.log(error);
                    })
                },
                cancelFn: function () {}
            });
        }
    };
    //下载列表
    $scope.download_list = function () {
        $http({
            method: 'get',
            url: './yiiapi/userlog/export-test',
            params: {
                username: $scope.params_data.username,
                start_time: $scope.params_data.start_time,
                end_time: $scope.params_data.end_time
            }
        }).success(function (data) {
            if (data.status == 0) {
                 download_now();
            }else if(data.status==600){
                console.log(data.msg);
            }else{
                zeroModal.error(data.msg);
            }
        }).error(function (error) {
            console.log(error);
        })

        function download_now() {
            var tt = new Date().getTime();
            var url = './yiiapi/userlog/export';
            var form = $("<form>"); //定义一个form表单
            form.attr("style", "display:none");
            form.attr("target", "name");
            form.attr("id", "form1");
            form.attr("method", "get"); //请求类型
            form.attr("action", url); //请求地址
            $("body").append(form); //将表单放置在web中

            // var iframe = $("<iframe>"); //定义一个iframe
            // form.attr("name", "name");
            // form.attr("id", "iframe1");
            // $("body").append(iframe); //将表单放置在web中

            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("username", "src_ip");
            input1.attr("value", $scope.params_data.username);
            form.append(input1);

            var input6 = $("<input>");
            input6.attr("type", "hidden");
            input6.attr("name", "start_time");
            input6.attr("value", $scope.params_data.start_time);
            form.append(input6);

            var input7 = $("<input>");
            input7.attr("type", "hidden");
            input7.attr("name", "end_time");
            input7.attr("value", $scope.params_data.end_time);
            form.append(input7);

            // var input9 = $("<input>");
            // input9.attr("type", "hidden");
            // input9.attr("name", "current_page");
            // input9.attr("value", 0);
            // form.append(input9);

            // var input0 = $("<input>");
            // input0.attr("type", "hidden");
            // input0.attr("name", "per_page_count");
            // input0.attr("value", 0);
            // form.append(input0);

            form.submit(); //表单提交
        }
    };

    // 时间插件
    $scope.timerange = function (params) {
        $('.timerange').daterangepicker({
            timePicker: true,
            // timePickerIncrement: 10,
            startDate: moment().subtract(1, 'days'),
            endDate: moment(),
            locale: {
                applyLabel: '确定',
                cancelLabel: '取消',
                format: 'YYYY-MM-DD HH:mm',
                customRangeLabel: '指定时间范围'
            },
            ranges: {
                '今天': [moment().startOf('day'), moment().endOf('day')],
                '7日内': [moment().startOf('day').subtract(7, 'days'), moment().endOf('day')],
                '本月': [moment().startOf('month'), moment().endOf('day')],
                '今年': [moment().startOf('year'), moment().endOf('day')],
            }
        }, function (start, end, label) {
            $scope.log.start_time = start.unix();
            $scope.log.end_time = end.unix();
        });
    };
    $scope.init();
}]);