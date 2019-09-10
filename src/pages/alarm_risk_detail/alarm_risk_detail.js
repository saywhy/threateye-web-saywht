/* Controllers */
app.controller('Alarm_risk_detailController', ['$scope', '$http','$stateParams', '$state', '$rootScope', function ($scope, $http,$stateParams, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        if(JSON.parse($stateParams.data).degree  == ''){
            $scope.risk_title = '告警总数'
        }
        if(JSON.parse($stateParams.data).degree  == 'low'){
            $scope.risk_title = '低危告警'
        }
        if(JSON.parse($stateParams.data).degree  == 'medium'){
            $scope.risk_title = '中危告警'
        }
        if(JSON.parse($stateParams.data).degree  == 'high'){
            $scope.risk_title = '高危告警'
        }
        $scope.crumbOptions = [{
            "href": "",
            "title": "总览"
        },{
            "href": "#/app/alarm_risk",
            "title": "风险资产"
        }, {
            "href": '',
            "title":  $scope.risk_title
        }];
        // console.log($scope.crumbOptions);
        
        $scope.status_str = [{
            css: 'success',
            label: '新告警'
        }, {
            css: 'danger',
            label: '未解决'
        }, {
            css: 'default',
            label: '已解决'
        }];
        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
        };
        $scope.getPage(); // 获取用户列表
    };
    // 获取风险资产告警列表
    $scope.getPage = function (pageNow) {
        var loading = zeroModal.loading(4);
        pageNow = pageNow ? pageNow : 1;
        $scope.index_num = (pageNow - 1) * 10;
        $scope.params_data = {
            page: pageNow,
            rows: 10,
            asset_ip:JSON.parse($stateParams.data).asset_ip,
            degree:JSON.parse($stateParams.data).degree,
            status:0
        };
        $http({
            method: 'get',
            url: './yiiapi/alert/list',
            params: $scope.params_data,
        }).success(function (data) {
            if (data.status == 0) {
                $scope.pages = data.data;
            }else if(data.status==600){
                console.log(data.msg);
                zeroModal.error(data.msg);
            } else {
                zeroModal.error(data.msg);
            }
            zeroModal.close(loading);
        }).error(function () {
            zeroModal.close(loading);
        })
    };
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
      // 操作 已解决
      $scope.update = function (item) {
        var loading = zeroModal.loading(4);
        var dataJson = {
            id: item.id,
            status: '2'
        };
        $http({
            method: 'put',
            url: './yiiapi/alert/do-alarm',
            data: dataJson,
        }).success(function (data) {
            zeroModal.close(loading);
            if (data.status == 0) {
                $scope.getPage();
            }
        }).error(function (err) {
            zeroModal.close(loading);
            console.log(err);
        })
    };
    // 跳转详情页面
    $scope.detail = function (params) {
        $state.go('app.alarm_detail', {
            data: params.id,
            url:'alarm_risk_detail',
            params:$stateParams.data,
            title:$scope.risk_title
        });
    };
    $scope.init();
}]);