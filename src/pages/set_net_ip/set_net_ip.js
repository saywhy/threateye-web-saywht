/* Controllers */
app.controller('Set_net_ipController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
        };
        $scope.getPage();
        $scope.reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    };
    // 获取网络IP段列表
    $scope.getPage = function (pageNow) {
        var loading = zeroModal.loading(4);
        pageNow = pageNow ? pageNow : 1;
        $scope.index_num = (pageNow - 1) * 10;
        $scope.params_data = {
            page: pageNow,
            rows: 10
        };
        $http({
            method: 'get',
            url: './yiiapi/ipsegment/list',
            params: $scope.params_data,
        }).success(function (data) {
            if (data.status == 0) {
                $scope.pages = data.data;
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
    //添加网络ip
    $scope.add = function () {
        if ($scope.reg.test($scope.net_ip)) {
            var loading = zeroModal.loading(4);
            $http({
                method: 'post',
                url: './yiiapi/ipsegment/set-ip-segment',
                data: {
                    "ip_segment": $scope.net_ip,
                    "net_mask": $scope.net_ip_mask
                },
            }).success(function (data) {
                if (data.status == 0) {
                    zeroModal.success('设置成功！');
                    $scope.net_ip = '',
                        $scope.net_ip_mask = '',
                        $scope.getPage();
                }else if(data.status==600){
                    console.log(data.msg);
                } else {
                    zeroModal.error(data.msg);
                }
                zeroModal.close(loading);
            }).error(function () {
                zeroModal.close(loading);
                zeroModal.error('设置失败！');
            })
        } else {
            zeroModal.error('IP格式不正确');
        }
    };
    // 删除网络ip
    $scope.del = function (id) {
        var loading = zeroModal.loading(4);
        $http({
            method: 'DELETE',
            url: './yiiapi/ipsegment/del',
            data: {
                "id": id
            },
        }).success(function (data) {
            if (data.status == 0) {
                zeroModal.success('删除成功！');
                $scope.getPage();
            } else if(data.status==600){
                console.log(data.msg);
            }else {
                zeroModal.error(data.msg);
            }
            zeroModal.close(loading);
        }).error(function () {
            zeroModal.close(loading);
            zeroModal.error('删除失败！');
        })
    };
    $scope.init();
}]);