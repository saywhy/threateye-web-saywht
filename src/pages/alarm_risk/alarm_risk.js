/* Controllers */
app.controller('Alarm_riskController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        $scope.crumbOptions = [{
            "href": "",
            "title": "总览"
        },{
            "href": "",
            "title": "风险资产"
        }];
        $scope.statusData = [{
            num: 1,
            type: '告警总数',
            sort_type: "alert_count"
        }, {
            num: 0,
            type: '风险指数',
            sort_type: "count"
        }];
        $scope.searchData = {
            sort_type: 'count', //默认风险指数排序
            asset_ip: '',
        };

        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
        };
        $scope.getPage(); // 获取用户列表
    };
    // 获取风险资产列表
    $scope.getPage = function (pageNow) {
        var loading = zeroModal.loading(4);
        pageNow = pageNow ? pageNow : 1;
        $scope.pageNowCookies = pageNow; // 记录页码
        $scope.index_num = (pageNow - 1) * 10;
        $scope.params_data = {
            page: pageNow,
            rows: 10,
            asset_ip: $scope.searchData.asset_ip,
            sort_type: $scope.searchData.sort_type
        };
        $http({
            method: 'get',
            url: './yiiapi/alert/risk-asset',
            params: $scope.params_data,
        }).success(function (data) {
            // console.log(data);
            if (data.status == 0) {
                $scope.pages = data.data;
                angular.forEach($scope.pages.data, function (item) {
                    item.style = {
                        width: item.indicator + '%',
                        borderRadius: '5px',
                    }
                    if (item.indicator >= 90) {
                        item.style.backgroundColor = $scope.colorType.rgbaHigh8
                    }
                    if (item.indicator >= 70 && item.indicator < 90) {
                        item.style.backgroundColor = 'rgba(254,127,0,.8)'
                    }
                    if (item.indicator >= 50 && item.indicator < 70) {
                        item.style.backgroundColor = '#FE9B20'
                    }
                    if (item.indicator >= 30 && item.indicator < 50) {
                        item.style.backgroundColor = '#FEBB11'
                    }
                    if (item.indicator < 30) {
                        item.style.backgroundColor = '#FECC01'
                    }
                });
            } else if(data.status==600){
                console.log(data.msg);
                zeroModal.error(data.msg);
            }else {
                zeroModal.error(data.msg);
            }
            zeroModal.close(loading);
        }).error(function () {
            zeroModal.close(loading);
        })
    };
    // 搜索
    $scope.search = function () {
        // console.log($scope.searchData);
        $scope.getPage();
    };
    // 导出
    $scope.export_alarm = function () {
        zeroModal.confirm({
            content: "确定下载告警列表吗？",
            okFn: function () {

                $http({
                    method: 'get',
                    url: './yiiapi/site/check-auth-exist',
                    params: {
                        pathInfo: 'alert/risk-asset-export'
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data.status == 0) {
                        var url = './yiiapi/alert/risk-asset-export';
                        var form = $("<form>"); //定义一个form表单
                        form.attr("style", "display:none");
                        form.attr("target", "");
                        form.attr("method", "get"); //请求类型
                        form.attr("action", url); //请求地址
                        $("body").append(form); //将表单放置在web中
        
                        var input1 = $("<input>");
                        input1.attr("type", "hidden");
                        input1.attr("name", "sort_type");
                        input1.attr("value", $scope.searchData.sort_type);
                        form.append(input1);
        
                        form.submit(); //表单提交
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
    };
    // 排序
    $scope.sort = function(params){
        if(params == 'risk'){
            $scope.searchData.sort_type='count', //默认风险指数排序
            $scope.getPage($scope.pageNowCookies );
        }
        if(params == 'count'){
            $scope.searchData.sort_type='alert_count', //默认风险指数排序
            $scope.getPage($scope.pageNowCookies ); 
        }
    }
    // 跳转
    $scope.countGo = function (item) {
            $state.go('app.alarm_risk_detail', {
                data: JSON.stringify({
                    asset_ip: item.asset_ip,
                    degree: ''
                })
            });
    };
    $scope.highGo = function (item) {
        if (item.high_count != '0') {
            $state.go('app.alarm_risk_detail', {
                data: JSON.stringify({
                    asset_ip: item.asset_ip,
                    degree: 'high'
                })
            });
        }
    };
    $scope.midGo = function (item) {
        if (item.medium_count != '0') {
            $state.go('app.alarm_risk_detail', {
                data: JSON.stringify({
                    asset_ip: item.asset_ip,
                    degree: 'medium'
                })
            });
        }
    };
    $scope.lowGO = function (item) {
        if (item.low_count != '0') {
            $state.go('app.alarm_risk_detail', {
                data: JSON.stringify({
                    asset_ip: item.asset_ip,
                    degree: 'low'
                })
            });
        }
    };

    $scope.init();
}]);