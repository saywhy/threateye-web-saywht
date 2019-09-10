'use strict';
/* Controllers */
app.controller('Safety_hostController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $scope.content_show = false;
        $rootScope.pageNow = 0;
        $scope.host = {
            host_ip: '',
            start_time: moment().subtract(1, 'days').unix(),
            end_time: moment().unix()
        };
        $scope.pages_network = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
            rows: 10
        };
        $scope.pages_file = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
            rows: 10
        };
        $scope.pages_user = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
            rows: 10
        };
        $scope.timerange(); // 时间插件初始化
        $scope.tab_data = [{
                name: '网络通讯',
                content_th: [{
                    name: '序号'
                }, {
                    name: '时间'
                }, {
                    name: '源IP'
                }, {
                    name: '源端口'
                }, {
                    name: '目的地址'
                }, {
                    name: '目的端口'
                }, {
                    name: 'Email地址'
                }, {
                    name: '应用'
                }],
                value: []
            },
            {
                name: '文件',
                content_th: [{
                    name: '序号'
                }, {
                    name: '文件名'
                }, {
                    name: '哈希值'
                }, {
                    name: '来源'
                }, {
                    name: '主机IP'
                }, {
                    name: '应用'
                }],
                value: []
            },
            {
                name: '用户',
                content_th: [{
                    name: '序号'
                }, {
                    name: '用户名'
                }, {
                    name: '主机IP'
                }, {
                    name: '应用'
                }],
                value: []
            }
        ];
        $scope.selected = 0;
    };
    // 主机网络调查
    $scope.getPage_network = function (pageNow) {
        $scope.content_show = true;
        pageNow = pageNow ? pageNow : 1;
        $scope.params_data = {
            host_ip: $scope.host.host_ip,
            start_time: $scope.host.start_time,
            end_time: $scope.host.end_time,
            current_page: pageNow,
            per_page_count: '10'
        };
        if (pageNow > 1000) {
            zeroModal.error('数据超过一万条,请缩小搜索条件');
        } else {
            var loading = zeroModal.loading(4);
            $http({
                method: 'get',
                url: './yiiapi/investigate/host-network-investigation',
                params: $scope.params_data,
            }).success(function (data) {
                if (data.status == 0) {
                    $scope.tab_data[0].value = [];
                    angular.forEach(data.data.data.data, function (item, index) {
                        var item_network = {
                            index: index + 1 + (pageNow - 1) * 10,
                            time: item.timestamp,
                            Ip: item.src_ip,
                            source_port: item.src_port,
                            addr: item.dest_ip,
                            port: item.dest_port,
                            email: item.email,
                            application: item.application
                        }
                        $scope.tab_data[0].value.push(item_network);
                    });
                    $scope.pages_network = data.data;
                }
                if (data.status == 1) {
                    zeroModal.error(data.msg);
                }else if(data.status==600){
                    console.log(data.msg);
                    zeroModal.error(data.msg);
                }
                zeroModal.close(loading);
            }).error(function (error) {
                console.log(error);
                zeroModal.close(loading);
            })
        }
    };
    // 主机文件调查
    $scope.getPage_file = function (pageNow) {
        $scope.content_show = true;
        pageNow = pageNow ? pageNow : 1;
        $scope.params_data = {
            host_ip: $scope.host.host_ip,
            start_time: $scope.host.start_time,
            end_time: $scope.host.end_time,
            current_page: pageNow,
            per_page_count: '10'
        };
        if (pageNow > 1000) {
            zeroModal.error('数据超过一万条,请缩小搜索条件');
        } else {
            var loading = zeroModal.loading(4);
            $http({
                method: 'get',
                url: './yiiapi/investigate/host-file-investigation',
                params: $scope.params_data,
            }).success(function (data) {
                if (data.status == 0) {
                    $scope.tab_data[1].value = [];
                    angular.forEach(data.data.data.data, function (item, index) {
                        var item_network = {
                            index: index + 1 + (pageNow - 1) * 10,
                            name: item.file_name,
                            hash: item.md5,
                            source: item.source,
                            host_ip: item.host_ip,
                            application: item.application
                        }
                        $scope.tab_data[1].value.push(item_network);
                    });
                    $scope.pages_file = data.data;
                }
                if (data.status == 1) {
                    zeroModal.error(data.msg);
                }
                if (data.status == 401) {
                    zeroModal.error(data.msg);
                }else if(data.status==600){
                    console.log(data.msg);
                }
                zeroModal.close(loading);
            }).error(function (error) {
                console.log(error);
                zeroModal.close(loading);
            })
        }
    };
    // 主机用户调查
    $scope.getPage_user = function (pageNow) {
        $scope.content_show = true;
        pageNow = pageNow ? pageNow : 1;
        $scope.params_data = {
            host_ip: $scope.host.host_ip,
            start_time: $scope.host.start_time,
            end_time: $scope.host.end_time,
            current_page: pageNow,
            per_page_count: '10'
        };
        if (pageNow > 1000) {
            zeroModal.error('数据超过一万条,请缩小搜索条件');
        } else {
            var loading = zeroModal.loading(4);
            $http({
                method: 'get',
                url: './yiiapi/investigate/host-user-investigation',
                params: $scope.params_data,
            }).success(function (data) {
                if (data.status == 0) {
                    $scope.tab_data[2].value = [];
                    angular.forEach(data.data.data.data, function (item, index) {
                        var item_network = {
                            index: index + 1 + (pageNow - 1) * 10,
                            user_name: item.username,
                            host_ip: item.host_ip,
                            application: item.application
                        }
                        $scope.tab_data[2].value.push(item_network);
                    });
                    $scope.pages_user = data.data;
                }
                if (data.status == 1) {
                    zeroModal.error(data.msg);
                }else if(data.status==600){
                    console.log(data.msg);
                }
                zeroModal.close(loading);
            }).error(function (error) {
                console.log(error);
                zeroModal.close(loading);
            })
        }
    };
    //tab栏切换
    $scope.show = function (params) {
        $scope.selected = params;
        if ($scope.selected == 0) {
            $scope.getPage_network();
        }
        if ($scope.selected == 1) {
            $scope.getPage_file();
        }
        if ($scope.selected == 2) {
            $scope.getPage_user();
        }
    };
    // 搜索
    $scope.search = function (params) {
        if ($scope.host.host_ip == '') {
            zeroModal.error('至少选择时间范围以及另外一项搜索条件');
        } else {
            if ($scope.selected == 0) {
                $scope.getPage_network();
            }
            if ($scope.selected == 1) {
                $scope.getPage_file();
            }
            if ($scope.selected == 2) {
                $scope.getPage_user();
            }
        }
    };
    // 下载报表
    $scope.download = function () {
        if ($scope.selected == 0) {
            if ($scope.pages_network.count > 1000) {
                zeroModal.error('下载数据不能超出1000条！')
            } else {
                zeroModal.confirm({
                    content: "确定下载列表吗？",
                    okFn: function () {
                        $scope.download_list({
                            testUrl: "./yiiapi/investigate/investigation-download-test",
                            url: "./yiiapi/investigate/host-network-investigation-export",
                            name: 'HostNetWork'
                        });
                    },
                    cancelFn: function () {}
                });
            }
        }
        if ($scope.selected == 1) {
            if ($scope.pages_file.count > 1000) {
                zeroModal.error('下载数据不能超出1000条！')
            } else {
                zeroModal.confirm({
                    content: "确定下载列表吗？",
                    okFn: function () {
                        $scope.download_list({
                            testUrl: "./yiiapi/investigate/investigation-download-test",
                            url: "./yiiapi/investigate/host-file-investigation-export",
                            name: 'HostFile'
                        });
                    },
                    cancelFn: function () {}
                });
            }
        }
        if ($scope.selected == 2) {
            if ($scope.pages_user.count > 1000) {
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
                                $scope.download_list({
                                    testUrl: "./yiiapi/investigate/investigation-download-test",
                                    url: "./yiiapi/investigate/host-user-investigation-export",
                                    name: 'HostUser'
                                });

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
        }
    };
    //下载列表
    $scope.download_list = function (item) {
        $http({
            method: 'get',
            url: item.testUrl,
            params: {
                function: item.name,
                host_ip: $scope.params_data.host_ip,
                start_time: $scope.params_data.start_time,
                end_time: $scope.params_data.end_time,
                current_page: 0,
                per_page_count: 0,
            }
        }).success(function (data) {
            if (data.status == 0) {
                download_now(item);
            }else if(data.status==600){
                console.log(data.msg);
            }else{
                zeroModal.error(data.msg);
            }
        }).error(function (error) {
            console.log(error);
        })

        function download_now(item) {
            var tt = new Date().getTime();
            var url = item.url;
            var form = $("<form>"); //定义一个form表单
            form.attr("style", "display:none");
            form.attr("target", "");
            form.attr("method", "get"); //请求类型
            form.attr("action", url); //请求地址
            $("body").append(form); //将表单放置在web中

            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("name", "host_ip");
            input1.attr("value", $scope.params_data.host_ip);
            form.append(input1);

            var input3 = $("<input>");
            input3.attr("type", "hidden");
            input3.attr("name", "start_time");
            input3.attr("value", $scope.params_data.start_time);
            form.append(input3);

            var input4 = $("<input>");
            input4.attr("type", "hidden");
            input4.attr("name", "end_time");
            input4.attr("value", $scope.params_data.end_time);
            form.append(input4);

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
            $scope.host.start_time = start.unix();
            $scope.host.end_time = end.unix();
        });
    };
    $scope.init();
}]);