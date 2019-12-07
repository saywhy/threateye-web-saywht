"use strict";
/* Controllers */
// Alarm controller
app.controller("AlarmController", [
    "$scope",
    "$http",
    "$state",
    "$filter",
    "$rootScope",
    "$stateParams",
    function ($scope, $http, $state, $filter, $rootScope, $stateParams) {
        // 初始化
        $scope.init = function (params) {
            clearInterval($rootScope.getUpdataStatus);
            $scope.searchActive = false;
            // 默认时间
            $scope.timepicker();
            $scope.searchData = {
                startTime: moment()
                    .subtract(365, "days")
                    .unix(),
                endTime: moment().unix(),
                src_ip: "",
                dest_ip: "",
                category: "",
                indicator: "",
            };
            $scope.crumbOptions = [{
                    href: "",
                    title: "总览",
                },
                {
                    href: "",
                    title: "告警",
                },
            ];
            $scope.statusData = [{
                    num: 3,
                    type: "所有",
                },
                {
                    num: 2,
                    type: "已解决",
                },
                {
                    num: 0,
                    type: "未解决",
                },
            ];
            $scope.degreeData = [{
                    num: "",
                    type: "所有",
                },
                {
                    num: "high",
                    type: "高",
                },
                {
                    num: "medium",
                    type: "中",
                },
                {
                    num: "low",
                    type: "低",
                },
            ];

            $scope.selectedName = 0;
            $scope.selectedDegree = "";
            $scope.pages = {
                data: [],
                count: 0,
                maxPage: "...",
                pageNow: 1,
            };
            // 总览页面传递参数
            if ($stateParams.data) {
                if ($stateParams.data == "high") {
                    $scope.selectedDegree = "high";
                }
                if ($stateParams.data == "medium") {
                    $scope.selectedDegree = "medium";
                }
                if ($stateParams.data == "low") {
                    $scope.selectedDegree = "low";
                }
            }
            if ($stateParams.pageNow) {
                $scope.pages.pageNow = $stateParams.pageNow;
            }
            //强制更新时间
            $scope.frist = function () {
                $http({
                    method: "get",
                    url: "./yiiapi/alert/get-last-alert-timestamp",
                }).success(function (data) {
                    $scope.searchData.endTime = data.data - 0; //更新时间
                    $scope.search($scope.pages.pageNow); //刷新页面
                });
            };
            $scope.frist();
            $scope.alarmEchart(); // 折线图表
            $scope.IntervalgetPage();
            $rootScope.startInterval = setInterval(function () {
                $scope.IntervalgetPage();
            }, 5000);
        };
        $scope.$on("$destroy", function () {
            // console.log('离开告警页面');
            clearInterval($rootScope.startInterval);
            clearInterval($rootScope.insideInterval);
        });
        $scope.dataTime = "frist";
        $scope.IntervalgetPage = function () {
            if ($scope.searchActive) {
                // 不刷新
                // console.log('停止刷新');
                clearInterval($rootScope.startInterval);
                $rootScope.insideInterval = setInterval(function () {
                    // console.log('内部循环');
                    if (!$scope.searchActive) {
                        // console.log('开启循环刷新');
                        clearInterval($rootScope.insideInterval);
                        // 开始循环
                        $rootScope.startInterval = setInterval(function () {
                            $scope.IntervalgetPage();
                        }, 5000);
                    }
                }, 5000);
            } else {
                // console.log('数据更新111');
                $http({
                        method: "get",
                        url: "./yiiapi/alert/get-last-alert-timestamp",
                    })
                    .success(function (data) {
                        $scope.searchData.endTime = data.data - 0; //更新时间
                        if ($scope.dataTime == "frist") {
                            $scope.dataTime = data.data;
                            // console.log('第一次请求111');
                        } else {
                            // console.log('本地赋值'+$scope.dataTime);
                            // console.log('获取时间'+data.data );
                            if (data.data != $scope.dataTime) {
                                // console.log('数据更新');
                                $scope.dataTime = data.data;
                                $scope.searchData.endTime = data.data - 0; //更新时间
                                $scope.getPage($scope.pages.pageNow);
                                $scope.alarmEchart(); // 折线图表
                            } else {
                                $scope.dataTime = data.data;
                                // console.log('数据无变化');
                            }
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            }
        };
        // 告警列表
        $scope.getPage = function (pageNow) {
            pageNow = pageNow ? pageNow : 1;
            $scope.pages.pageNow = pageNow;
            $scope.index_num = (pageNow - 1) * 10;
            $scope.params_data = {
                start_time: $scope.searchData.startTime,
                end_time: $scope.searchData.endTime,
                src_ip: $scope.searchData.src_ip,
                dest_ip: $scope.searchData.dest_ip,
                category: $scope.searchData.category,
                indicator: $scope.searchData.indicator,
                status: $scope.selectedName,
                degree: $scope.selectedDegree,
                page: $scope.pages.pageNow,
                rows: "10",
            };
            $http({
                    method: "get",
                    url: "./yiiapi/alert/list",
                    params: $scope.params_data,
                })
                .success(function (data) {
                    // console.log( JSON.parse(data.data.data[0].alert_description));
                    if (data.status == 0) {
                        $scope.pages = data.data;
                        // console.log($scope.pages.data);
                    } else if (data.status == 600) {
                        zeroModal.error(data.msg);
                        console.log(data.msg);
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        };
        $scope.status_str = [{
                css: "success",
                label: "新告警",
            },
            {
                css: "danger",
                label: "未解决",
            },
            {
                css: "default",
                label: "已解决",
            },
        ];
        // 默认是未解决
        $scope.setAriaID = function (item, $event) {
            $event.stopPropagation();
            if ($scope.ariaID == item.id) {
                $scope.ariaID = null;
            } else {
                $scope.ariaID = item.id;
            }
        };
        $scope.delAriaID = function ($event) {
            $event.stopPropagation();
            setTimeout(function () {
                $scope.ariaID = null;
            }, 10);
        };
        // 搜索按钮
        $scope.search = function (pageNow) {
            if ($scope.searchData.src_ip != "" || $scope.searchData.dest_ip != "") {
                // 不刷新
                $scope.searchActive = true;
            } else {
                // 刷新
                $scope.searchActive = false;
            }
            if (pageNow) {
                $scope.getPage(pageNow);
            } else {
                $scope.getPage(1);
            }
        };
        // 操作 已解决
        $scope.update = function (item) {
            var loading = zeroModal.loading(4);
            var dataJson = {
                id: item.id,
                status: "2",
            };
            $http({
                    method: "put",
                    url: "./yiiapi/alert/do-alarm",
                    data: dataJson,
                })
                .success(function (data) {
                    zeroModal.close(loading);
                    if (data.status == 0) {
                        $scope.getPage($scope.pages.pageNow);
                    } else if (data.status == 600) {
                        console.log(data.msg);
                    }
                })
                .error(function (err) {
                    zeroModal.close(loading);
                    console.log(err);
                });
        };
        // 折线图表
        $scope.alarmEchart = function (params) {
            $http({
                    method: "get",
                    url: "./yiiapi/alert/alert-trend",
                })
                .success(function (data) {
                    if (data.status == 0) {
                        console.log(data.data);

                        $scope.alarmEchart_time = [];
                        $scope.alarmEchart_data = [];
                        angular.forEach(data.data, function (item, index) {
                            $scope.alarmEchart_time.unshift(item.statistics_time);
                            $scope.alarmEchart_data.unshift(item.alert_count);
                        });
                        var myChart = echarts.init(document.getElementById("alarm_echart"));
                        var option = {
                            grid: {
                                bottom: 80,
                                top: 50,
                                left: 50,
                                right: 50,
                            },
                            tooltip: {
                                trigger: "axis",
                                axisPointer: {
                                    lineStyle: {
                                        color: "#ddd",
                                    },
                                },
                                backgroundColor: "rgba(255,255,255,1)",
                                padding: [5, 10],
                                textStyle: {
                                    color: "#7588E4",
                                },
                                extraCssText: "box-shadow: 0 0 5px rgba(0,0,0,0.3)",
                            },
                            dataZoom: [{
                                    show: true,
                                    realtime: true,
                                    start: 80,
                                    end: 100,
                                },
                                {
                                    type: "inside",
                                    realtime: true,
                                    start: 80,
                                    end: 100,
                                },
                            ],
                            xAxis: [{
                                type: "category",
                                boundaryGap: false,
                                axisLine: {
                                    onZero: false,
                                },
                                data: $scope.alarmEchart_time.map(function (str) {
                                    return str.replace(" ", "\n");
                                }),
                                axisTick: {
                                    show: false,
                                },
                            }, ],
                            yAxis: [{
                                name: "告警",
                                type: "value",
                                axisTick: {
                                    show: false,
                                },
                            }, ],
                            series: [{
                                name: "告警",
                                type: "line",
                                smooth: true,
                                showSymbol: false,
                                symbol: "circle",
                                symbolSize: 3,
                                areaStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0,
                                            0,
                                            0,
                                            1,
                                            [{
                                                    offset: 0,
                                                    color: "rgba(150,33,22,.8)",
                                                },
                                                {
                                                    offset: 1,
                                                    color: "rgba(150,33,22,.5)",
                                                },
                                            ],
                                            false
                                        ),
                                    },
                                },
                                animation: true,
                                lineStyle: {
                                    normal: {
                                        width: 3,
                                    },
                                },
                                data: $scope.alarmEchart_data,
                            }, ],
                        };
                        myChart.setOption(option);
                    } else if (data.status == 600) {
                        console.log(data.msg);
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        };
        // 时间插件初始化
        $scope.timepicker = function (params) {
            $(".timerange").daterangepicker({
                    timePicker: true,
                    // timePickerIncrement: 10,
                    startDate: moment().subtract(365, "days"),
                    endDate: moment(),
                    locale: {
                        applyLabel: "确定",
                        cancelLabel: "取消",
                        format: "YYYY-MM-DD HH:mm",
                        customRangeLabel: "指定时间范围",
                    },
                    ranges: {
                        今天: [moment().startOf("day"), moment().endOf("day")],
                        "7日内": [
                            moment()
                            .startOf("day")
                            .subtract(7, "days"),
                            moment().endOf("day"),
                        ],
                        本月: [moment().startOf("month"), moment().endOf("day")],
                        今年: [moment().startOf("year"), moment().endOf("day")],
                    },
                },
                function (start, end, label) {
                    $scope.searchData.startTime = start.unix();
                    $scope.searchData.endTime = end.unix();
                }
            );
        };
        // 跳转详情页面
        $scope.detail = function (params) {
            $state.go("app.alarm_detail", {
                data: params.id,
                url: "alarm",
                pageNow: $scope.pages.pageNow,
            });
        };
        //导出告警列表
        $scope.export_alarm = function () {
            zeroModal.confirm({
                content: "确定下载告警列表吗？",
                okFn: function () {
                    $http({
                            method: "get",
                            url: "./yiiapi/site/check-auth-exist",
                            params: {
                                pathInfo: "alert/export-alerts-test",
                            },
                        })
                        .success(function (data) {
                            console.log(data);
                            if (data.status == 0) {
                                $scope.test_download();
                            }
                            if (data.status == 401) {
                                zeroModal.error(data.msg);
                            }
                        })
                        .error(function (error) {
                            console.log(error);
                        });
                },
                cancelFn: function () {},
            });
        };
        $scope.test_download = function () {
            // console.log($scope.params_data);
            $http({
                    method: "get",
                    url: "./yiiapi/alert/export-alerts-test",
                    params: {
                        src_ip: $scope.params_data.src_ip,
                        dest_ip: $scope.params_data.dest_ip,
                        status: $scope.params_data.status,
                        start_time: $scope.params_data.start_time,
                        end_time: $scope.params_data.end_time,
                        category: $scope.params_data.category,
                        indicator: $scope.params_data.indicator,
                        degree: $scope.params_data.degree,
                    },
                })
                .success(function (data) {
                    if (data.status == 0) {
                        $scope.download_alarm();
                    } else if (rdata.status == 600) {
                        console.log(data.msg);
                    } else {
                        zeroModal.error(data.msg);
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        };
        $scope.download_alarm = function () {
            var url = "./yiiapi/alert/export-alerts";
            /**
             * 使用form表单来发送请求
             * 1.method属性用来设置请求的类型——post还是get
             * 2.action属性用来设置请求路径。
             */
            var form = $("<form>"); //定义一个form表单
            form.attr("style", "display:none");
            form.attr("target", "");
            form.attr("method", "get"); //请求类型
            form.attr("action", url); //请求地址
            $("body").append(form); //将表单放置在web中
            /**
             * input标签主要用来传递请求所需的参数：
             * 1.name属性是传递请求所需的参数名.
             * 2.value属性是传递请求所需的参数值.
             * 3.当为get类型时，请求所需的参数用input标签来传递，直接写在URL后面是无效的。
             * 4.当为post类型时，queryString参数直接写在URL后面，formData参数则用input标签传递
             * 有多少数据则使用多少input标签
             */
            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("name", "start_time");
            input1.attr("value", $scope.params_data.start_time);
            form.append(input1);
            var input2 = $("<input>");
            input2.attr("type", "hidden");
            input2.attr("name", "end_time");
            input2.attr("value", $scope.params_data.end_time);
            form.append(input2);
            var input3 = $("<input>");
            input3.attr("type", "hidden");
            input3.attr("name", "src_ip");
            input3.attr("value", $scope.params_data.src_ip);
            form.append(input3);
            var input4 = $("<input>");
            input4.attr("type", "hidden");
            input4.attr("name", "dest_ip");
            input4.attr("value", $scope.params_data.dest_ip);
            form.append(input4);
            var input5 = $("<input>");
            input5.attr("type", "hidden");
            input5.attr("name", "status");
            input5.attr("value", $scope.params_data.status);
            form.append(input5);

            var input6 = $("<input>");
            input6.attr("type", "hidden");
            input6.attr("name", "category");
            input6.attr("value", $scope.params_data.category);
            form.append(input6);
            var input7 = $("<input>");
            input7.attr("type", "hidden");
            input7.attr("name", "indicator");
            input7.attr("value", $scope.params_data.indicator);
            form.append(input7);

            var input8 = $("<input>");
            input8.attr("type", "hidden");
            input8.attr("name", "degree");
            input8.attr("value", $scope.params_data.degree);
            form.append(input8);
            form.submit(); //表单提交
        };
        $scope.init();
    },
]);