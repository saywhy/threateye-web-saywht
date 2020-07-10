/* Controllers */
app.controller('Set_licenceController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        $scope.license_array = [];
        $scope.get_license(); // 获取证书列表

    };
    $scope.get_license = function () {
        $http({
            method: 'get',
            url: './yiiapi/license/get'
        }).then(function successCallback(data) {
            $scope.key = data.data.data.key;
            if (data.data.status == 0) {
                for (key in data.data.data.license.list) {
                    $scope.license_array.push(data.data.data.license.list[key]);
                }
            } else if (data.data.status == 600) {
                zeroModal.error(data.data.msg);
            }
        }, function errorCallback(data) {
            // console.log(data);
        });
    };
    // 在线激活
    $scope.online = function () {
        var W = 480;
        var H = 250;
        zeroModal.show({
            title: '在线激活',
            content: inputSN,
            width: W + "px",
            height: H + "px",
            overlayClose: true,
            cancel: true,
            ok: true,
            okTitle: '激活',
            okFn: function () {
                if ($scope.SN) {
                    var post_data = {
                        SN: $scope.SN,
                        key: $scope.key
                    }
                    $http.post('./yiiapi/license/online', post_data).then(function success(rsp) {
                        if (rsp.data.status == 'success') {
                            $scope.importBin(rsp.data.bin);
                        } else if (rsp.data.errorMessage == 'License does not exist') {
                            zeroModal.error({
                                content: '验证失败！',
                                contentDetail: '序列号校验失败，请确认您输入的序列号！',
                            });
                        } else if (rsp.data.errorMessage == 'Key error') {
                            zeroModal.error({
                                content: '验证失败！',
                                contentDetail: '此序列号已被替他设备使用，请购买新的许可证！',
                            });
                        } else {
                            zeroModal.error(rsp.data.msg);
                        }
                    }, function err(rsp) {
                        zeroModal.error({
                            content: '验证失败！',
                            contentDetail: '请检查网络，确保服务器可以流畅访问互联网！',
                        });
                    });
                } else {
                    zeroModal.error('请填写序列号');
                }
            },
            onCleanup: function () {
                hide_box.appendChild(inputSN);
            }
        });
    };
    // 导入许可证
    $scope.import = function () {
        $('#LicenseFile').click();
    };
    $scope.importBin = function (bin) {
        if (/^[0-1]*$/.test(bin)) {
            $http.post('./yiiapi/license/import', {
                bin: bin
            }).then(function success(rsp) {
                $scope.repeat_license = true;
                if (rsp.data.status == 0) {
                    angular.forEach($scope.license_array, function (item, index) {
                        if (item.SN == rsp.data.data.SN) {
                            zeroModal.success('许可证已存在，无需重复导入!');
                            $scope.repeat_license = false;
                        }
                    });
                    if ($scope.repeat_license) {
                        $scope.license_array.unshift(rsp.data.data.license.list[rsp.data.data.SN]);
                        zeroModal.success('许可证导入成功!');

                    }
                    $scope.get_license();
                } else if (rsp.data.status == 600) {
                    console.log(rsp.data.msg);
                } else {
                    zeroModal.error(rsp.data.msg);
                }
            }, function err(rsp) {
                zeroModal.error('许可证导入失败!');
            });
        } else {
            zeroModal.error('许可证无效!');
        }
    };
    $('#LicenseFile').change(function () {
        var file = this.files[0];
        if (file && file.size < 1024 * 1024) {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (f) {
                var bin = reader.result.trim();
                $scope.importBin(bin);
            }
        } else {
            zeroModal.error('许可证无效!');
        }
    });
    $scope.init();
}]);