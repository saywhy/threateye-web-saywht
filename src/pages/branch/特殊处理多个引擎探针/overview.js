'use strict';
// overview controller
app.controller('OverViemController', ['$scope', '$http', '$state', '$modal', '$rootScope', function ($scope, $http, $state, $modal, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $scope.computer_base64 = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADI0lEQVR4Xu2bS0iUURTH/2fGZhwrMZKKIpMis4fZRFhEhElFmwoX4ioQylpkD2mosAcWswkJJXuQzkaSFmZt3BX5oNA2YSoobRyDalMjKc2o8zlzwqJoopp7x28eznc/mNX3v/ee8/vOPfdc7h2CwR8yuP9QAFQEANiw5+R2E9MBwDgREWR6PthV/4LyCk/tBfEzI0ZCgIMltKmwwkGEmhkAW/PWoMCeA6LkTQ2fR8fxqO3lj+/N7PwFYPP6bDTfOWeIQDh9uQGd3QOhAEoO7sKVylJDALjlaoPr4VMFIGQKqAhQU0DlAJUE1SqglkFVB6hC6F8EtCBjdCogBSjDYobVnHj7iogqQe90EMPjfikAqxZYkG4xSbWJhVgBUHsBtRmS3w1OBhgfvVpUpugiqxkzv1g9McsBog4tsaVgqS1FVD5rXUQADB8Bs8aeQB1EFAGRFEKyPpuJkJka/VwQEYBICiFZAPNMhNwMq2wzab0CoAohVQjJF0LSEy2BG0SUAxLYH2nTFACVBFUSVElQHY6q0+E/jscP7S+A8+IR6SVlLjaoufsED1o7Qu8HLJxvQ0vjBaxYtngu+iRsc//QCCqvuvDJMxYKQLiHZBL+fkcomfwS9mUGQPHxG06L1XJJuFESCTVt+jY97nlbvzYnqyIefo24P8A/pSEnNzsew8M9/L6Z+jw+B4G+3xOM9VPlqIXPO4G6e1WxHvrneE4a8EwcZcAVDwuGBt3w+/3I37IuHsODwA5yM6d+9UzcZNBGvazwabzSN82rRfob806CBYRpFvP48nRrr4BUSMLAkJVTz0fl7Pp69xcHgYWmVdfgOwQ5PILMdFtPS2nuTiHvJEQKgAQsYamKADUFVA4wcBKsZtO+rP77AOwiSYODSBP5ow4xRkYD2uHXJ7bpeklB91WgqKG3DoQzIs7Lahho6ii3l8m2+59eVwBFjb1nAdTqaeBf+rrWXm6v1msM3QAUNbwpBrgVhKjfiwsSyjqP2Zv0gKALgMLGvh3EgXYisulhVLg+mFljMu/uLM9/FU4b7r0uAMINksjvFYBE/jqxsM3wEfANeS54DOvPkoIAAAAASUVORK5CYII=';
        $scope.oracle_base64 = 'image://data:image/png;base64,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';
        $scope.router_base64 = 'image://data:image/png;base64,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';
        clearInterval($rootScope.insideInterval);
        clearInterval($rootScope.startInterval);
        clearInterval($rootScope.getUpdataStatus);
        $rootScope.pageNow = 0;
        // 第一排
        $scope.sysState();
        $scope.file_flow_info(); // 中间 文件/流量信息
        $scope.safetyequipment(); // 右边 图表
        // 第二排
        $scope.alarmNum(); //告警数量
        $scope.threaten_type(); //威胁类型
        // 第三排
        $scope.top_threaten(); //top 威胁
        $scope.risk_property(); //top 风险资产
        $scope.untreatedAlarm(); //第二排中间未处理告警
        // 第四排
        $scope.new_alarm(); //最新告警
        $scope.flow_echarts = true;
    };
    // 第一排 左边图表--系统状态
    $scope.sysState = function (params) {
        $http({
            method: 'GET',
            url: './yiiapi/alert/system-state'
        }).success(function (data) {
            console.log(data);
            if (data.status == 0) {
                $scope.sysState_data = data.data;
                // $scope.sysState_data = {
                //     dev_info: [{
                //             dev_ip: "127.0.1.1",
                //             dev_type: "3",
                //             status: 1
                //         },
                //         {
                //             dev_ip: "127.0.2.1",
                //             dev_type: "3",
                //             status: 1
                //         },
                //         {
                //             dev_ip: "127.0.3.1",
                //             dev_type: "3",
                //             status: 1
                //         }
                //     ],
                //     healthy_count: 3,
                //     offline_count: 0,
                //     warning_count: 0,
                // }
                console.log($scope.sysState_data.dev_info);
                $scope.system = [{
                        name: '预警',
                        color: 'box-block-red',
                        num: $scope.sysState_data.warning_count
                    },
                    {
                        name: '健康',
                        color: 'box-block-green',
                        num: $scope.sysState_data.healthy_count
                    },
                    {
                        name: '离线',
                        color: 'box-block-gray',
                        num: $scope.sysState_data.offline_count
                    }
                ];
                var myChart = echarts.init(document.getElementById('sys'));
                var option = {
                    series: [{
                            name: '',
                            type: "pie",
                            silent: 'true', //不响应hover事件
                            radius: ["50%", "75%"],
                            center: ["50%", "50%"],
                            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
                            legendHoverLink: false, //是否启用图例 hover 时的联动高亮。
                            hoverOffset: 0, //高亮扇区的偏移距离。
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: "center"
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [{
                                    value: $scope.sysState_data.warning_count,
                                    name: '预警',
                                    itemStyle: {
                                        normal: {
                                            color: $scope.colorType.rgbaHigh8
                                        }
                                    }
                                },
                                {
                                    value: $scope.sysState_data.healthy_count,
                                    name: '健康',
                                    itemStyle: {
                                        normal: {
                                            color: 'rgba(131,186,174,.8)'
                                        }
                                    }
                                },
                                {
                                    value: $scope.sysState_data.offline_count,
                                    name: '离线',
                                    itemStyle: {
                                        normal: {
                                            color: '#666'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name: '姓名',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '50%'],
                            silent: 'true', //不响应hover事件
                            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
                            legendHoverLink: false, //是否启用图例 hover 时的联动高亮。
                            hoverOffset: 0, //高亮扇区的偏移距离。
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [11],
                            itemStyle: {
                                normal: {
                                    color: 'rgba(131,186,174,1)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);


            }
        }).error(function (err) {
            console.log(err);
        })
    };
    // 弹窗内容拓扑图
    $scope.change_password = function (size) {
        console.log('1111');
        $scope.showpop = true; //  显示弹窗
        setTimeout(function () {
            if ($scope.sysState_data.dev_info) {
                $scope.graph_echart();
            }
        }, 100);
    };
    // 第一排 中间图表--流量文件信息
    //文件 流量信息
    $scope.file_flow_info = function (params) {
        $http({
            method: 'GET',
            url: './yiiapi/alert/flow-file-statistics'
        }).success(function (data) {
            // console.log(data);
            $scope.flow_file = {};
            if (data.status == 0) {
                $scope.flow_file = data.data;
                //获取文件数量
                var myChart_file = echarts.init(document.getElementById('flowinfo'));
                var option_file = {
                    grid: {
                        left: 45,
                        right: 30,
                        top: 15,
                        bottom: 25
                    },
                    xAxis: {
                        type: 'category',
                        data: $scope.flow_file.statistics_time,
                        boundaryGap: false,
                        splitLine: {
                            show: false,
                            interval: 'auto', //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                            maxInterval: 3600 * 24 * 1000,
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 5,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 5,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    series: [{
                        name: '文件',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        symbol: 'circle',
                        symbolSize: 6,
                        data: $scope.flow_file.file_count_diff,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: $scope.colorType.rgbaHigh8
                                }, {
                                    offset: 1,
                                    color: $scope.colorType.rgbaHigh2
                                }], false)
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: $scope.colorType.rgbaHigh10
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 3
                            }
                        }
                    }]
                };
                myChart_file.setOption(option_file);
                var myChart_flow = echarts.init(document.getElementById('flowtotal'));
                var option_flow = {
                    grid: {
                        left: 45,
                        right: 30,
                        top: 15,
                        bottom: 25
                    },
                    xAxis: {
                        type: 'category',
                        data: $scope.flow_file.statistics_time,
                        boundaryGap: false,
                        splitLine: {
                            show: false,
                            interval: 'auto', //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                            maxInterval: 3600 * 24 * 1000,
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 5,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 5,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    series: [{
                        name: '流量',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        symbol: 'circle',
                        symbolSize: 6,
                        data: $scope.flow_file.flow_diff,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: $scope.colorType.rgbaLow8
                                }, {
                                    offset: 1,
                                    color: $scope.colorType.rgbaLow2
                                }], false)
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: $scope.colorType.rgbaLow10
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 3
                            }
                        }
                    }]
                };
                myChart_flow.setOption(option_flow);
            }
            if (data.status == 1) {
                zeroModal.error(data.msg);
            }
        }).error(function (err) {
            console.log(err);
        })

    };
    // hhtp
    // HTTPS
    // Dns  ssh  ftp 
    // 第一排右边 图表 协议统计
    $scope.safetyequipment = function (params) {
        $http({
            method: 'GET',
            url: './yiiapi/alert/protocol-flow-statistics'
        }).success(function (data) {
            // console.log(data);
            if (data.status == 0) {
                $scope.flow_statistics = {
                    item: {},
                    items: [],
                    title: [],
                    time: [],
                    http: [],
                    https: [],
                    ssh: [],
                    ftp: [],
                    dns: [],
                    imap: [],
                    smb: [],
                    pop3: [],
                    smtp: [],
                    // dhcp: [],
                };
                for (var k in data.data) {
                    $scope.flow_statistics.title.push(k);
                }
                // console.log(data.data.http);
                // ["http","https","ssh","ftp","dns","imap","smb","pop3","smtp","dhcp"]
                angular.forEach(data.data.http, function (item, index) {
                    $scope.flow_statistics.time.unshift(item.statistics_time);
                    $scope.flow_statistics.http.unshift(item.flow);
                })
                angular.forEach(data.data.https, function (item, index) {
                    $scope.flow_statistics.https.unshift(item.flow);
                })
                angular.forEach(data.data.ssh, function (item, index) {
                    $scope.flow_statistics.ssh.unshift(item.flow);
                })
                angular.forEach(data.data.ftp, function (item, index) {
                    $scope.flow_statistics.ftp.unshift(item.flow);
                })
                angular.forEach(data.data.dns, function (item, index) {
                    $scope.flow_statistics.dns.unshift(item.flow);
                })
                angular.forEach(data.data.imap, function (item, index) {
                    $scope.flow_statistics.imap.unshift(item.flow);
                })
                angular.forEach(data.data.smb, function (item, index) {
                    $scope.flow_statistics.smb.unshift(item.flow);
                })
                angular.forEach(data.data.pop3, function (item, index) {
                    $scope.flow_statistics.pop3.unshift(item.flow);
                })
                angular.forEach(data.data.smtp, function (item, index) {
                    $scope.flow_statistics.smtp.unshift(item.flow);
                })
                // angular.forEach(data.data.dhcp, function (item, index) {
                //     $scope.flow_statistics.dhcp.unshift(item.flow);
                // })
                angular.forEach($scope.flow_statistics.title, function (item, index) {
                    if (item == 'http') {
                        $scope.flow_statistics.item = {
                            name: 'HTTP',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.http,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(199, 237, 250,0.5)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(199, 237, 250,0.2)'
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f7b851'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'https') {
                        $scope.flow_statistics.item = {
                            name: 'HTTPS',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.https,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(216, 244, 247,1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(216, 244, 247,1)'
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#58c8da'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'ssh') {
                        $scope.flow_statistics.item = {
                            name: 'SSH',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.ssh,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: $scope.colorType.rgbaHigh8
                                    }, {
                                        offset: 1,
                                        color: $scope.colorType.rgbaHigh2
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: $scope.colorType.rgbaHigh10
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'ftp') {
                        $scope.flow_statistics.item = {
                            name: 'FTP',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.ftp,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(255,128,0,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(255,128,0,0.2)'
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(255,128,0,0.9)'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'dns') {
                        $scope.flow_statistics.item = {
                            name: 'DNS',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.dns,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: $scope.colorType.rgbaLow8
                                    }, {
                                        offset: 1,
                                        color: $scope.colorType.rgbaLow2
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: $scope.colorType.rgbaLow10
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'imap') {
                        $scope.flow_statistics.item = {
                            name: 'IMAP',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.imap,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(0,0,255,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(0,0,255,0.2)'
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(0,0,255,0.9)'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'smb') {
                        $scope.flow_statistics.item = {
                            name: 'SMB',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.imap,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(204,204,153,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(204,204,153,0.2)'
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(204,204,153,0.9)'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'pop3') {
                        $scope.flow_statistics.item = {
                            name: 'POP3',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.imap,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(51,153,153,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(51,153,153,0.2)'
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(51,153,153,0.9)'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                    if (item == 'smtp') {
                        $scope.flow_statistics.item = {
                            name: 'SMTP',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.flow_statistics.imap,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(102,102,153,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(102,102,153,0.2)'
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(102,102,153,0.9)'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }
                        $scope.flow_statistics.items.push($scope.flow_statistics.item);
                    }
                })
                // console.log($scope.flow_statistics);
                var myChart = echarts.init(document.getElementById('safetyequipment'));
                var option = {
                    grid: {
                        left: 50,
                        right: 40,
                        top: 6,
                        bottom: 80
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        backgroundColor: 'rgba(255,255,255,1)',
                        padding: [5, 10],
                        textStyle: {
                            color: '#7588E4',
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                    },
                    legend: {
                        bottom: 5,
                        left: 5,
                        orient: 'horizontal',
                        textStyle: {
                            fontSize: 12
                        },
                        selected: {
                            // 选中'系列1'
                            'HTTP': true,
                            'HTTPS': true,
                            'SSH': true,
                            // 不选中'系列2'
                            'DNS': false,
                            'FTP': false,
                            'IMAP': false,
                            'SMB': false,
                            'POP3': false,
                            'SMTP': false,
                            // 'DHCP': false,

                        },
                        data: ['HTTP', 'HTTPS', 'SSH', 'DNS', 'FTP', 'IMAP', 'SMB', 'POP3', 'SMTP']
                    },
                    xAxis: {
                        type: 'category',
                        data: $scope.flow_statistics.time.map(function (str) {
                            return str.replace(' ', '\n')
                        }),
                        boundaryGap: false,
                        splitLine: {
                            show: false,
                            interval: 'auto',
                            lineStyle: {
                                color: ['#D4DFF5']
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },

                    yAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                color: ['#D4DFF5']
                            }
                        },
                        axisTick: {
                            show: true
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                fontSize: 10
                            },
                            // formatter: '{value} (M/s)'
                        }
                    },
                    series: $scope.flow_statistics.items
                };
                myChart.setOption(option);
            }
            if (data.status == 1) {
                zeroModal.error(data.msg);
            }
        }).error(function (err) {
            console.log(err);
        })

    };
    // 第二排 右边图表 - 威胁类型
    $scope.threaten_type = function (params) {
        $http({
            method: 'get',
            url: './yiiapi/alert/threat-type'
        }).success(function (data) {
            // console.log(data);
            if (data.status == 0) {
                $scope.threaten_type = {};
                $scope.threaten_type.type = [];
                $scope.threaten_type.num = [];
                angular.forEach(data.data, function (item) {
                    $scope.threaten_type.type.push(item.alert_type);
                    $scope.threaten_type.num.push(item.total_count);
                });
                var myChart = echarts.init(document.getElementById('threaten_type'));
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            // lineStyle: {
                            //     color: '#ddd'
                            // }
                        },
                        backgroundColor: 'rgba(255,255,255,1)',
                        padding: [5, 10],
                        textStyle: {
                            color: '#7588E4',
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: '4%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: $scope.threaten_type.type,
                        axisTick: {
                            show: false
                        }
                    },
                    series: [{
                        name: '',
                        type: 'bar',
                        stack: '总量',
                        data: $scope.threaten_type.num,
                        barWidth: 20,
                        itemStyle: {
                            normal: {
                                barBorderRadius: [4, 4, 4, 4], //柱形图圆角，初始化效果
                            }
                        }
                    }]
                };
                myChart.setOption(option);
            }
        }).error(function (err) {
            console.log(err);
        })
    };
    // 第二排 中间 -- 未处理告警
    $scope.untreatedAlarm = function (params) {
        $http({
            method: 'get',
            url: './yiiapi/alert/untreated-alarm-type'
        }).success(function (data) {
            // console.log(data);
            if (data.status == 0) {
                $scope.untreated_alarm = {};
                angular.forEach(data.data, function (item, index) {
                    if (item.degree == 'low') {
                        $scope.untreated_alarm.low = item.total_count
                    }
                    if (item.degree == 'medium') {
                        $scope.untreated_alarm.medium = item.total_count
                    }
                    if (item.degree == 'high') {
                        $scope.untreated_alarm.high = item.total_count
                    }
                })
                var myChart = echarts.init(document.getElementById('untreatedalarm'));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}:{c}({d}%)"
                    },
                    grid: {
                        show: true,
                        left: 'center',
                        right: 'center',
                        top: 'center',
                        bottom: 'center'
                    },
                    series: [{
                        name: '未处理告警',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
                        hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
                        hoverOffset: 0, //高亮扇区的偏移距离。
                        selectedMode: 'single',
                        data: [{
                                value: $scope.untreated_alarm.high,
                                name: '高',
                                itemStyle: {
                                    normal: {
                                        color: $scope.colorType.high
                                    }
                                }
                            },
                            {
                                value: $scope.untreated_alarm.medium,
                                name: '中',
                                itemStyle: {
                                    normal: {
                                        color: $scope.colorType.mid
                                    }
                                }
                            },
                            {
                                value: $scope.untreated_alarm.low,
                                name: '低',
                                itemStyle: {
                                    normal: {
                                        color: $scope.colorType.low
                                    }
                                }
                            }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{b} : {c} \n ({d}%)'
                                },
                                labelLine: {
                                    show: true
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                myChart.setOption(option);
            }
        }).error(function (err) {
            console.log(err);
        })
    };
    // 第二排左边边图表 -  告警数量
    $scope.alarmNum = function (params) {
        $http({
            method: 'get',
            url: './yiiapi/alert/get-last7-days-alarm'
        }).success(function (data) {
            if (data.status == 0) {
                $scope.last7_alarm = {};
                $scope.last7_alarm.date = [];
                $scope.last7_alarm.high = [];
                $scope.last7_alarm.low = [];
                $scope.last7_alarm.medium = [];
                angular.forEach(data.data, function (item, index) {
                    $scope.last7_alarm.date.push(item.statistics_time);
                    $scope.last7_alarm.high.push(item.alert_count_details.high);
                    $scope.last7_alarm.low.push(item.alert_count_details.low);
                    $scope.last7_alarm.medium.push(item.alert_count_details.medium);
                });
                var myChart = echarts.init(document.getElementById('alarm_number'));
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                            // lineStyle: {
                            //     color: '#ddd'
                            // }
                        },
                        backgroundColor: 'rgba(255,255,255,1)',
                        padding: [5, 10],
                        textStyle: {
                            color: '#7588E4',
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: $scope.last7_alarm.date,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 5,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: [{
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 5,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    }],
                    series: [{
                            name: '高',
                            type: 'bar',
                            barWidth: 20,
                            stack: '搜索引擎',
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [0, 0, 4, 4], //柱形图圆角，初始化效果
                                    color: $scope.colorType.high
                                }
                            },
                            data: $scope.last7_alarm.high
                        },
                        {
                            name: '中',
                            type: 'bar',
                            stack: '搜索引擎',
                            itemStyle: {
                                normal: {
                                    color: $scope.colorType.mid
                                }
                            },
                            data: $scope.last7_alarm.medium
                        },
                        {
                            name: '低',
                            type: 'bar',
                            stack: '搜索引擎',
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [4, 4, 0, 0], //柱形图圆角，初始化效果
                                    color: $scope.colorType.low
                                }
                            },
                            data: $scope.last7_alarm.low
                        }
                    ]
                };
                myChart.setOption(option);
            }
        }).error(function (err) {
            console.log(err);
        })
    };
    // 第三排
    // top5威胁
    $scope.top_threaten = function () {
        $http({
            method: 'get',
            url: './yiiapi/alert/threat-top5'
        }).success(function (data) {
            // console.log(data);
            if (data.status == 0) {
                $scope.top_threaten_data = data.data
            }
        }).error(function (err) {
            console.log(err);
        })
    };
    //top风险资产
    $scope.risk_property = function () {
        $http({
            method: 'get',
            url: './yiiapi//alert/risk-asset-top5'
        }).success(function (data) {
            if (data.status == 0) {
                $scope.risk_property_data = [];
                angular.forEach(data.data, function (item, index) {
                    $scope.item_risk_propety = {
                        client_ip: item.asset_ip,
                        style: {
                            width: item.count + '%',
                            borderRadius: '5px',
                        }
                    }
                    if (index == 0) {
                        $scope.item_risk_propety.style.backgroundColor = $scope.colorType.rgbaHigh8;
                    }
                    if (index == 1) {
                        $scope.item_risk_propety.style.backgroundColor = 'rgba(254,127,0,.8)';
                    }
                    if (index == 2) {
                        $scope.item_risk_propety.style.backgroundColor = '#FE9B20';
                    }
                    if (index == 3) {
                        $scope.item_risk_propety.style.backgroundColor = '#FEBB11';
                    }
                    if (index == 4) {
                        $scope.item_risk_propety.style.backgroundColor = '#FECC01';
                    }
                    $scope.risk_property_data.push($scope.item_risk_propety);
                })

            }
        }).error(function (err) {
            console.log(err);
        })
    };
    //最新告警
    $scope.new_alarm = function () {
        $scope.params_data = {
            start_time: moment().subtract(365, 'days').unix(),
            end_time: moment().unix(),
            src_ip: '',
            dest_ip: '',
            status: '',
            page: 1,
            rows: '5'
        };
        $http({
            method: 'get',
            url: './yiiapi/alert/list',
            params: $scope.params_data,
        }).success(function (data) {
            // console.log(data);
            if (data.status == 0) {
                $scope.new_alarm_data = data.data.data;
            }
        }).error(function (err) {
            console.log(err);
        })
    };
    // 第四排 ——流量统计
    $scope.popfasle = function () {
        $scope.showpop = false; //  隐藏弹窗
    };
    $scope.ito_popfasle = function () {
        $scope.iotcontent = false; //  隐藏弹窗
    };
    // 拓扑图
    $scope.graph_echart = function () {
        $scope.graph_echart_array = [];
        $scope.graph_echart_array_item = {};
        // 探针数组
        $scope.probe_array = [];
        // 引擎数组
        $scope.engine_array = [];
        // 引擎和探针的关系
        $scope.links_array = [];
        angular.forEach($scope.sysState_data.dev_info, function (item, index) {
            if (item.status == 0) {
                item.status = '离线'
            } else if (item.status == 1) {
                item.status = '在线'
            }
            // 判断类型
            if (item.dev_type == '1') {
                $scope.only_one = true;
                $scope.probe_array.push(item);
            }
            if (item.dev_type == '2') {
                $scope.only_one = true;
                $scope.engine_array.push(item);
            }
            if (item.dev_type == "3") {
              $scope.only_one = false;
                  $scope.graph_echart_array_item = {
                    name: "引擎/探针" + index,
                    names: "引擎/探针",
                    dev_ip: item.dev_ip,
                    status: item.status,
                    x: 300,
                    y: 150,
                    symbol: $scope.computer_base64,
                    //节点上面的文字
                    label: {
                      normal: {
                        position: "bottom",
                        show: true,
                        textStyle: {
                          fontSize: 12,
                          color: "#666",
                          align: "center",
                        },
                        formatter: "引擎/探针",
                      },
                    },
                  };
              switch (index) {
                case 0:
                  $scope.graph_echart_array_item.x = 200;
                  $scope.graph_echart_array_item.y = 300;
                  break;
                case 1:
                  $scope.graph_echart_array_item.x = 150;
                  $scope.graph_echart_array_item.y = 300;
                  break;
                case 2:
                  $scope.graph_echart_array_item.x = 250;
                  $scope.graph_echart_array_item.y = 300;
                  break;
                case 3:
                  $scope.graph_echart_array_item.x = 100;
                  $scope.graph_echart_array_item.y = 300;
                  break;
                case 4:
                  $scope.graph_echart_array_item.x = 300;
                  $scope.graph_echart_array_item.y = 300;
                  break;
                case 5:
                  $scope.graph_echart_array_item.x = 350;
                  $scope.graph_echart_array_item.y = 300;
                  break;
                default:
                  break;
              }
              $scope.graph_echart_array.push(
                $scope.graph_echart_array_item
              );
            }
        });
        console.log($scope.probe_array);
        console.log($scope.engine_array);
        console.log($scope.graph_echart_array);
        if ($scope.only_one) {
            console.log(1231231);
            // 2 一台引擎模版
            $scope.data_item0 = {
                name: '节点0',
                x: 350,
                y: 200,
                symbol: $scope.oracle_base64,
                names: '引擎',
                dev_ip: $scope.engine_array[0].dev_ip,
                status: $scope.engine_array[0].status,
                //节点上面的文字	
                label: {
                    normal: {
                        position: "bottom",
                        show: true,
                        textStyle: {
                            fontSize: 12,
                            color: '#666',
                            align: 'center',
                        },
                        formatter: '引擎'
                    }
                }
            };
            // 一台引擎
            if ($scope.engine_array.length == 1) {
                $scope.graph_echart_array.push($scope.data_item0);
            };
            // 多个探针 模版
            angular.forEach($scope.probe_array, function (item, index) {
                $scope.data_item1 = {
                    name: '节点1',
                    x: 300,
                    y: 100,
                    symbol: $scope.router_base64,
                    names: '探针',
                    dev_ip: item.dev_ip,
                    status: item.status,
                    //节点上面的文字	
                    label: {
                        normal: {
                            position: "bottom",
                            show: true,
                            textStyle: {
                                fontSize: 12,
                                color: '#666',
                                align: 'center',
                            },
                            formatter: '探针'
                        }
                    }
                };
                $scope.links_item = {
                    source: '节点0',
                    target: '节点1',
                    dev_ip: item.dev_ip,
                    status: item.status,
                    names: '探针'
                };
                switch (index) {
                    case 0:
                        $scope.data_item1.name = '节点1';
                        $scope.links_item.target = '节点1';
                        $scope.data_item1.x = 100;
                        $scope.data_item1.y = 200;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    case 1:
                        $scope.data_item1.name = '节点2';
                        $scope.links_item.target = '节点2';
                        $scope.data_item1.x = 100;
                        $scope.data_item1.y = 100;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    case 2:
                        $scope.data_item1.name = '节点3';
                        $scope.links_item.target = '节点3';
                        $scope.data_item1.x = 100;
                        $scope.data_item1.y = 300;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    case 3:
                        $scope.data_item1.name = '节点4';
                        $scope.links_item.target = '节点4';
                        $scope.data_item1.x = 600;
                        $scope.data_item1.y = 200;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    case 4:
                        $scope.data_item1.name = '节点5';
                        $scope.links_item.target = '节点5';
                        $scope.data_item1.x = 600;
                        $scope.data_item1.y = 100;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    case 5:
                        $scope.data_item1.name = '节点6';
                        $scope.links_item.target = '节点6';
                        $scope.data_item1.x = 600;
                        $scope.data_item1.y = 300;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    case 6:
                        $scope.data_item1.name = '节点7';
                        $scope.links_item.target = '节点7';
                        $scope.data_item1.x = 300;
                        $scope.data_item1.y = 100;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    case 7:
                        $scope.links_item.target = '节点8';
                        $scope.data_item1.name = '节点8';
                        $scope.data_item1.x = 300;
                        $scope.data_item1.y = 300;
                        $scope.graph_echart_array.push($scope.data_item1);
                        $scope.links_array.push($scope.links_item);
                        break;
                    default:
                        break;
                };
            })
        }

        console.log($scope.graph_echart_array);
        console.log($scope.links_array);
        // $("#pop").html('<div id="graph"</div>');
        var myChart = echarts.init(document.getElementById('graph'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params, trigger) {
                    return '设备：' + params.data.names + '</br>' + 'IP地址：' + params.data.dev_ip + '</br>' + '状态：' + params.data.status
                }
            },
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'quinticInOut',
            series: [{
                type: 'graph',
                layout: 'none',
                symbolSize: 50,
                roam: true,
                label: {
                    normal: {
                        show: false
                    }
                },
                focusNodeAdjacenc: true, //是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点
                edgeSymbol: ['arrow', 'arrow'],
                edgeSymbolSize: [7, 7],
                edgeLabel: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        textStyle: {
                            fontSize: 30 //边节点显示的字体大小
                        }
                    }
                },
                data: $scope.graph_echart_array,
                links: $scope.links_array,
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            }]
        };
        console.log('6666');
        
        myChart.clear(); //只是清理画布，而不会删除 生成的元素节点
        myChart.setOption(option);
        //添加点击事件
        myChart.off("click"); //防止累计触发
        myChart.on('click', function (params) {
            // 弹窗打印数据的名称
            // console.log(params);
            $scope.iot_detail_title = params;
            if (params.dataType == "node") {
                $scope.iotcontent = true;
                setTimeout(function () {
                    $scope.iot_detail_top($scope.iot_detail_title); //iot具体cpu/内存/硬盘/流量
                }, 600);
            }
        });
    };
    // iot_detail - 
    $scope.iot_detail_top = function (params) {
        // console.log(params);
        if (params.data.names == "引擎") {
            $scope.flow_echarts = false;
            $("#iot_detail_top").css('height', '400px');
        } else {
            $scope.flow_echarts = true;
            $("#iot_detail_top").css('height', '200px');
        }
        var loading = zeroModal.loading(4);
        $scope.sys_detail_cpu = [];
        $scope.sys_detail_mem = [];
        $scope.sys_detail_disk = [];
        $scope.sys_detail_time = [];
        $scope.sys_detail_flow = [];
        $http({
            method: 'get',
            url: './yiiapi/alert/dev-state',
            params: {
                ip: params.data.dev_ip
            }
        }).success(function (data) {
            zeroModal.close(loading);
            // console.log(data);
            if (data.status == 0) {
                angular.forEach(data.data, function (item, index) {
                    $scope.sys_detail_cpu.unshift(item.cpu);
                    $scope.sys_detail_mem.unshift(item.mem);
                    $scope.sys_detail_disk.unshift(item.disk);
                    $scope.sys_detail_flow.unshift(item.flow);
                    $scope.sys_detail_time.unshift(item.statistics_time);
                })
                // iot具体cpu/内存/硬盘
                var myChart = echarts.init(document.getElementById('iot_detail_top'));
                var option = {
                    grid: {
                        left: 40,
                        right: 20,
                        top: 15,
                        bottom: 85
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        backgroundColor: 'rgba(255,255,255,1)',
                        padding: [5, 10],
                        textStyle: {
                            color: '#7588E4',
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                    },
                    legend: {
                        bottom: 20,
                        left: 20,
                        orient: 'horizontal',
                        selected: {
                            // 选中'系列1'
                            'CPU': true,
                            // 不选中'系列2'
                            '内存': true,
                            '硬盘': true,

                        },
                        data: ['CPU', '内存', '硬盘']
                    },
                    xAxis: {
                        type: 'category',
                        data: $scope.sys_detail_time,
                        boundaryGap: false,
                        splitLine: {
                            show: false,
                            interval: 'auto',
                            lineStyle: {
                                color: ['#D4DFF5']
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                color: ['#D4DFF5']
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#666'
                            }
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                fontSize: 10
                            }
                        }
                    },
                    visualMap: [{
                        show: false,
                        type: 'piecewise',
                        seriesIndex: 0,
                        pieces: [{
                            gt: 85,
                            color: $scope.colorType.rgbaHigh10
                        }, {
                            gt: 0,
                            lte: 85,
                            color: $scope.colorType.rgbaMid
                        }]
                    }, {
                        show: false,
                        type: 'piecewise',
                        seriesIndex: 1,
                        pieces: [{
                            gt: 85,
                            color: $scope.colorType.rgbaHigh10
                        }, {
                            gt: 0,
                            lte: 85,
                            color: '#58c8da'
                        }]
                    }, {
                        show: false,
                        type: 'piecewise',
                        seriesIndex: 2,
                        pieces: [{
                            gt: 90,
                            color: $scope.colorType.rgbaHigh10
                        }, {
                            gt: 0,
                            lte: 90,
                            color: $scope.colorType.rgbaLow10
                        }]
                    }],
                    series: [{
                        name: 'CPU',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        symbol: 'circle',
                        symbolSize: 6,
                        data: $scope.sys_detail_cpu,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: $scope.colorType.rgbaMid8
                                }, {
                                    offset: 1,
                                    color: $scope.colorType.rgbaMid2
                                }], false)
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: $scope.colorType.rgbaMid
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 3
                            }
                        }
                    }, {
                        name: '内存',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        symbol: 'circle',
                        symbolSize: 6,
                        data: $scope.sys_detail_mem,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(216, 244, 247,1)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(216, 244, 247,1)'
                                }], false)
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#58c8da'
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 3
                            }
                        }
                    }, {
                        name: '硬盘',
                        type: 'line',
                        smooth: true,
                        showSymbol: false,
                        symbol: 'circle',
                        symbolSize: 6,
                        data: $scope.sys_detail_disk,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: $scope.colorType.rgbaLow8
                                }, {
                                    offset: 1,
                                    color: $scope.colorType.rgbaLow2
                                }], false)
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: $scope.colorType.rgbaLow10
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 3
                            }
                        }
                    }]
                };
                myChart.setOption(option);
                myChart.resize();
                if ($scope.flow_echarts) {
                    // iot具体流量
                    var myChart_detail_flow = echarts.init(document.getElementById('iot_detail_bom'));
                    var option_detail_flow = {
                        grid: {
                            left: 40,
                            right: 20,
                            top: 15,
                            bottom: 85
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            backgroundColor: 'rgba(255,255,255,1)',
                            padding: [5, 10],
                            textStyle: {
                                color: '#7588E4',
                            },
                            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                        },
                        legend: {
                            bottom: 20,
                            left: 20,
                            orient: 'horizontal',
                            selected: {
                                // 选中'系列1'
                                '流量': true
                            },
                            data: ['流量']
                        },
                        xAxis: {
                            type: 'category',
                            data: $scope.sys_detail_time,
                            boundaryGap: false,
                            splitLine: {
                                show: false,
                                interval: 'auto',
                                lineStyle: {
                                    color: ['#D4DFF5']
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#666'
                                }
                            },
                            axisLabel: {
                                margin: 10,
                                textStyle: {
                                    fontSize: 10
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {
                                lineStyle: {
                                    color: ['#D4DFF5']
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#666'
                                }
                            },
                            axisLabel: {
                                margin: 10,
                                textStyle: {
                                    fontSize: 10
                                }
                            }
                        },
                        series: [{
                            name: '流量',
                            type: 'line',
                            smooth: true,
                            showSymbol: false,
                            symbol: 'circle',
                            symbolSize: 6,
                            data: $scope.sys_detail_flow,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: $scope.colorType.rgbaLow8
                                    }, {
                                        offset: 1,
                                        color: $scope.colorType.rgbaLow2
                                    }], false)
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: $scope.colorType.rgbaLow10
                                }
                            },
                            lineStyle: {
                                normal: {
                                    width: 3
                                }
                            }
                        }]
                    };
                    myChart_detail_flow.setOption(option_detail_flow);
                }
            }
            if (data.status == 1) {
                zeroModal.error(data.msg);
            }
        }).error(function (err) {
            zeroModal.close(loading);
            console.log(err);
        })
    };
    //弹窗系统状态图表
    $scope.sysEchart = function (params) {
        // console.log(params);
    };
    $scope.init();
}]);