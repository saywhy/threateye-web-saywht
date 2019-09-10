/* Controllers */
app.controller('Set_netController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        clearInterval($rootScope.insideInterval);
        clearInterval($rootScope.startInterval);
        clearInterval($rootScope.getUpdataStatus);
        // $scope.select_disabled = false;
        $rootScope.pageNow = 0;
        $scope.net = {};
        $scope.net_detail = {
            // role:'guanli'
            BOOTPROTO: '',
            IPADDR: '',
            MASK: '',
            GATEWAY: '',
            DNS1: '',
            DNS2: ''
        };
        $scope.net_names = [];
        $scope.ip_type = [{
                num: 0,
                name: '自动获取',
                type: 'dhcp'
            },
            {
                num: 1,
                name: '手动获取',
                type: 'static'
            }
        ];
        $scope.role = [{
                num: 0,
                name: '管理口',
                type: 1
            },
            {
                num: 1,
                name: '通讯口',
                type: 2
            },
            {
                num: 3,
                name: '沙箱口',
                type: 4
            }
        ];
        $scope.get_network(); //获取网络配置
        $scope.getProxy(); //获取网络代理
    };
    //获取网络配置
    $scope.get_network = function () {
        var loading = zeroModal.loading(4);
        $http({
            method: 'get',
            url: './yiiapi/seting/get-network'
        }).success(function (data) {
            $scope.get_data = {};
            // $scope.select_disabled = false;
            if (data.status == 0) {
                $scope.net_names = [];
                $scope.net_info_array = data.data.data;
                angular.forEach($scope.net_info_array, function (item) {
                    $scope.net_names.push(item.NAME);
                });
                $scope.get_data = JSON.stringify($scope.net_info_array);
                // 默认初始值
                $scope.net.index = $scope.net_names[0];
                $scope.net_detail = $scope.net_info_array[0];
                // $scope.net_detail.role = '1';
            }
            if (data.status == 1) {
                zeroModal.error(data.msg);
            }
            zeroModal.close(loading);
        }).error(function (error) {
            console.log(error);
            zeroModal.close(loading);
        })
    };
    // 网卡切换
    $scope.net_card = function (name) {
        // 默认初始值
        angular.forEach($scope.net_info_array, function (item, index) {
            if (name == item.NAME) {
                $scope.net_detail = JSON.parse($scope.get_data)[index];
                // $scope.net_detail = item;
            }
        });
    };
    // 角色改变
    $scope.role_change = function (parmas) {
    //  console.log(121);
    };
    $scope.set_net = function(){
        var loading = zeroModal.loading(4);
        $http({
            method: 'put',
            url: './yiiapi/seting/set-network',
            data: {
                NAME: $scope.net.index,
                ONBOOT: $scope.net_detail.ONBOOT,
                BOOTPROTO: $scope.net_detail.BOOTPROTO,
                IPADDR: $scope.net_detail.IPADDR,
                MASK: $scope.net_detail.MASK,
                GATEWAY: $scope.net_detail.GATEWAY,
                DNS1: $scope.net_detail.DNS1,
                DNS2: $scope.net_detail.DNS2,
                PORT: $scope.net_detail.PORT
            }
        }).success(function (data) {
            if (data.status == 0) {
                $scope.get_network(); //获取网络配置
                zeroModal.success('网络配置成功');
            }
            if (data.status == 1) {
                zeroModal.error(data.msg);
            }
            if (data.status == 401) {
                zeroModal.error(data.msg);
            }
            zeroModal.close(loading);
        }).error(function (error) {
            console.log(error);
            zeroModal.close(loading);
        })
    };
    //设置网络配置
    $scope.set_network = function () {
        $scope.port_only = false;
        // console.log($scope.net_detail);
        if ($scope.net_detail.PORT == 0) {
            zeroModal.error('请选择角色');
        } else {
            angular.forEach(JSON.parse($scope.get_data), function (item,index) {
                if (item.PORT == 3) {
                    $scope.item_item = item;
                    $scope.port_only = true;
                }
            });
            if($scope.port_only){
                if($scope.item_item.NAME == $scope.net_detail.NAME){
                    $scope.set_net();
                }else{
                    if($scope.net_detail.PORT ==3){
                        // console.log($scope.net_detail);
                        zeroModal.error('网卡中只允许配置一个镜像口！');
                    }else{
                        $scope.set_net();
                    }
                }
            }else{
                $scope.set_net();
            }
        }
    };
    //获取代理设置
    $scope.getProxy = function (params) {
        var loading = zeroModal.loading(4);
        $http({
            method: 'get',
            url: './yiiapi/seting/get-proxy-server'
        }).success(function (data) {
            // console.log(data.data.data[0]);
            if (data.data.data[0].HTTP_PROXY || data.data.data[0].HTTPS_PROXY) {
                $scope.httpsModel = data.data.data[0].HTTPS_PROXY
                $scope.httpModel = data.data.data[0].HTTP_PROXY
            } else {
                $scope.httpsModel = '';
                $scope.httpModel = '';
            }
            zeroModal.close(loading);
        }).error(function (error) {
            console.log(error);
            zeroModal.close(loading);
        })
    };
    //设置代理服务器
    $scope.saveHttps = function () {
        var loading = zeroModal.loading(4);
        $http({
            method: 'put',
            url: './yiiapi/seting/set-proxy-server',
            data: {
                HTTPS_PROXY: $scope.httpsModel,
                HTTP_PROXY: $scope.httpModel
            }
        }).success(function (data) {
            console.log(data);
            zeroModal.close(loading);
            if(data.status == 0){
                zeroModal.success("保存成功!");
            }else{
                zeroModal.error(data.msg);
            }
        }).error(function (error) {
            console.log(error);
            zeroModal.close(loading);
        })
    };
    $scope.init();
}]);