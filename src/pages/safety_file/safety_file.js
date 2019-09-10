'use strict';
/* Controllers */
app.controller('Safety_fileController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $scope.content_show = false;
        $rootScope.pageNow = 0;
        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
            rows: 10
        };
        $scope.file = {
            start_time: moment().subtract(1, 'days').unix(),
            end_time: moment().unix(),
            file_name: '',
            md5: '',
            host_ip: '',
        };
        $scope.timerange(); // 时间插件初始化
    };
    // 获取数据
    $scope.getPage = function (pageNow) {
        $scope.content_show = true;
        pageNow = pageNow ? pageNow : 1;
        $scope.index_num = (pageNow - 1) * 10;
        $scope.params_data = {
            file_name: $scope.file.file_name,
            md5: $scope.file.md5,
            host_ip: $scope.file.host_ip,
            start_time: $scope.file.start_time,
            end_time: $scope.file.end_time,
            current_page: pageNow,
            per_page_count: '10'
        };
        if (pageNow > 1000) {
            zeroModal.error('数据超过一万条,请缩小搜索条件');
        } else {
            var loading = zeroModal.loading(4);
            $http({
                method: 'get',
                url: './yiiapi/investigate/file-investigation',
                params: $scope.params_data,
            }).success(function (data) {
                if (data.status == 0) {
                    $scope.pages = data.data;
                }
                if (data.status == 1) {
                    zeroModal.error(data.msg);
                }
                if (data.status == 401) {
                    zeroModal.error(data.msg);
                }else if(data.status==600){
                    zeroModal.error(data.msg);
                    console.log(data.msg);
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
        if ($scope.file.file_name == '' && $scope.file.host_ip == '' && $scope.file.md5 == '') {
            zeroModal.error('至少选择时间范围以及另外一项搜索条件');
        } else {
            $scope.getPage(1);
        }
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
                            pathInfo: 'investigate/investigation-download-test'
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
            url: './yiiapi/investigate/investigation-download-test',
            params: {
                function: 'FileSearch',
                file_name: $scope.params_data.file_name,
                md5: $scope.params_data.md5,
                host_ip: $scope.params_data.host_ip,
                start_time: $scope.params_data.start_time,
                end_time: $scope.params_data.end_time,
                current_page: 0,
                per_page_count: 0,
            }
        }).success(function (data) {
            if (data.status == 0) {
                download_now();
            }else{
                zeroModal.error(data.msg);
            }
        }).error(function (error) {
            console.log(error);
        })

        function download_now() {
            var tt = new Date().getTime();
            var url = './yiiapi/investigate/file-investigation-export';

            var form = $("<form>"); //定义一个form表单
            form.attr("style", "display:none");
            form.attr("target", "");
            form.attr("method", "get"); //请求类型
            form.attr("action", url); //请求地址
            $("body").append(form); //将表单放置在web中

            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("name", "file_name");
            input1.attr("value", $scope.params_data.file_name);
            form.append(input1);

            var input2 = $("<input>");
            input2.attr("type", "hidden");
            input2.attr("name", "md5");
            input2.attr("value", $scope.params_data.md5);
            form.append(input2);

            var input3 = $("<input>");
            input3.attr("type", "hidden");
            input3.attr("name", "host_ip");
            input3.attr("value", $scope.params_data.host_ip);
            form.append(input3);

            var input4 = $("<input>");
            input4.attr("type", "hidden");
            input4.attr("name", "start_time");
            input4.attr("value", $scope.params_data.start_time);
            form.append(input4);

            var input5 = $("<input>");
            input5.attr("type", "hidden");
            input5.attr("name", "end_time");
            input5.attr("value", $scope.params_data.end_time);
            form.append(input5);

            var input9 = $("<input>");
            input9.attr("type", "hidden");
            input9.attr("name", "current_page");
            input9.attr("value", 0);
            form.append(input9);

            var input0 = $("<input>");
            input0.attr("type", "hidden");
            input0.attr("name", "per_page_count");
            input0.attr("value", 0);
            form.append(input0);

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
            $scope.file.start_time = start.unix();
            $scope.file.end_time = end.unix();
        });
    };
    $scope.init();
}]);