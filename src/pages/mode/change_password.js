'use strict';
angular.module('app')
    // overview controller
    .controller('Modal_change_passwordCtrl', ['$scope', '$http', '$state', '$modalInstance', 'data', function ($scope, $http, $state, $modalInstance, data) {
        $scope.data = data;
        $scope.init = function () {
            $scope.getPwdLength();
        }
        // 获取密码长度
        $scope.getPwdLength = function () {
            $http({
                method: 'get',
                url: './yiiapi/site/get-passwd-length'
            }).then(function successCallback(data) {
                $scope.pwdLength = data.data.data
            }, function errorCallback(data) {});
        }
        //在这里处理要进行的操作
        $scope.password_rexp = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/;
        $scope.ok = function () {
            var loading = zeroModal.loading(4);
            if (!$scope.data.new || !$scope.data.old || !$scope.data.repeat) {
                zeroModal.error('密码不能为空');
                zeroModal.close(loading);
            } else if (!$scope.password_rexp.test($scope.data.new)) {
                zeroModal.error('密码必须包含大写字母、小写字母、数字、特殊字符');
                zeroModal.close(loading);
            } else if ($scope.data.new != $scope.data.repeat) {
                zeroModal.error('密码不一致');
                zeroModal.close(loading);
            } else if($scope.data.old==$scope.data.new){
                zeroModal.error('新密码与原密码不能相同');
                zeroModal.close(loading);
            } else {
                $http({
                    method: 'POST',
                    url: './yiiapi/site/reset-self-password?token=' + $scope.data.token,
                    data: {
                        "ResetPasswordForm": {
                            "password": $scope.data.new
                        },
                        "old_password": $scope.data.old
                    }
                }).then(function successCallback(data) {
                    // console.log(data);
                    if (data.data.status == 0) {
                        zeroModal.close(loading);
                        $modalInstance.close();
                        zeroModal.success('密码修改成功！');
                        $state.go('app.signin');
                    } else if (data.data.status == 600) {
                        console.log(data.data.msg);
                    } else {
                        zeroModal.close(loading);
                        zeroModal.error(data.data.msg);
                    }
                }, function errorCallback(data) {
                    console.log(data);
                    zeroModal.close(loading);
                });
            }
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.init();
    }]);