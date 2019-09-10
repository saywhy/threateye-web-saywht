/* Controllers */
app.controller('Set_syslogController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        $scope.UserIDList = [];
        $scope.userList = {};
        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
        };
        $scope.getPage(); // 获取用户列表
    };
    // 获取syslog 列表
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
            url: './yiiapi/syslog/list',
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
    // 添加SYSLOG配置
    $scope.add = function () {
        var W = 540;
        var H = 300;
        var box = null;
        $scope.syslog = {
            type: 1,
            trans: 3,
            port: 514,
            ip: '',
            ONBOOT: '0'
        }
        box = zeroModal.show({
            title: '添加SYSLOG配置',
            content: newUser,
            width: W + "px",
            height: H + "px",
            ok: true,
            cancel: true,
            okFn: function () {
                $scope.addsyslog();
            },
            onCleanup: function () {
                hideenBox.appendChild(newUser);
            }
        });
    };
    $scope.addsyslog = function () {
        if ($scope.syslog.trans == 3) {
            $scope.syslog.protocol = 'udp';
        } else {
            $scope.syslog.protocol = 'tcp';
        };
        rqs_data = {
            server_ip: $scope.syslog.ip,
            server_port: $scope.syslog.port,
            protocol: $scope.syslog.protocol,
            status: $scope.syslog.ONBOOT,
        };
        var loading = zeroModal.loading(4);
        $http.post("./yiiapi/syslog/add-conf", rqs_data).then(function success(rsp) {
            zeroModal.close(loading);
            if (rsp.data.status == 0) {
                zeroModal.success('添加成功');
                $scope.getPage();
            } else if(rsp.data.status==600){
                console.log(rsp.data.msg);
            }else {
                zeroModal.error(rsp.data.msg)
            }
        }, function err(rsp) {
            zeroModal.close(loading);
        });
    };
    // 删除SYSLOG配置
    $scope.del = function (item) {
        zeroModal.confirm({
            content: '确定删除 "' + item.server_ip + '" 吗？',
            okFn: function () {
                rqs_data = {
                    id: item.id
                };
                var loading = zeroModal.loading(4);
                $http({
                    method: 'delete',
                    url: './yiiapi/syslog/del-conf',
                    data: rqs_data,
                }).success(function (req) {
                    zeroModal.close(loading);
                    if (req.status == 0) {
                        zeroModal.success('删除成功');
                        $scope.getPage();
                    } else if(req.data.status==600){
                        console.log(req.data.msg);
                    }else {
                        zeroModal.error(req.msg);
                    }
                }).error(function () {
                    zeroModal.close(loading);
                })
            },
            cancelFn: function () {}
        });
    };
    //修改
    $scope.modify = function (item) {
        var W = 540;
        var H = 300;
        var box = null;
        $scope.syslog = {
            port: item.server_port,
            ip: item.server_ip,
            ONBOOT: item.status,
            protocol: item.protocol
        };
        if ($scope.syslog.protocol == 'udp') {
            $scope.syslog.trans = 3;
        } else {
            $scope.syslog.trans = 4;
        };
        box = zeroModal.show({
            title: '修改SYSLOG配置',
            content: newUser,
            width: W + "px",
            height: H + "px",
            ok: true,
            cancel: true,
            okFn: function () {
                rqs_data = {
                    id: item.id,
                    server_ip: $scope.syslog.ip,
                    server_port: $scope.syslog.port,
                    protocol: $scope.syslog.protocol,
                    status: $scope.syslog.ONBOOT,
                };
                var loading = zeroModal.loading(4);
                if ($scope.syslog.trans == 3) {
                    $scope.syslog.protocol = 'udp';
                } else {
                    $scope.syslog.protocol = 'tcp';
                };
                $http({
                    method: 'PUT',
                    url: './yiiapi/syslog/edit-conf',
                    data: rqs_data,
                }).success(function (req) {
                    zeroModal.close(loading);
                    if (req.status == 0) {
                        zeroModal.success('修改成功');
                        $scope.getPage();
                    } else if(req.status==600){
                        console.log(req.msg);
                    }else {
                        zeroModal.error(req.msg);
                    }
                }).error(function () {
                    zeroModal.close(loading);
                })
            },
            onCleanup: function () {
                hideenBox.appendChild(newUser);
            }
        });

    };
    $scope.init();
}]);