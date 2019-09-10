/* Controllers */
app.controller('Set_emailController', ['$scope', '$http', '$state','$rootScope', function ($scope, $http, $state,$rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow= 0;
        $scope.item = {};
        $scope.get_email();
    };
    $scope.validate = function(type){
        var flag = false;
        if(type == 'test'){
          flag = ($scope.item.username && $scope.item.alertEmail);
        }else if(type == 'save'){
          flag = ($scope.item.username && (!$scope.item.send || $scope.item.alertEmail));
        }
        return flag;
      };
    //获取邮件配置
    $scope.get_email = function () {
        var loading = zeroModal.loading(4);
        $http({
            method: 'get',
            url: './yiiapi/email/get'
        }).success(function (data) {
            if (data.status == 0) {
                if (data.data.port && data.data.port !='') {
                    data.data.port = parseInt(data.data.port);
                };
                $scope.item = data.data;
            }else if(data.status==600){
                console.log(data.msg);
                zeroModal.error(data.msg);
            }else{
                zeroModal.error(data.msg);
            }
            zeroModal.close(loading);
        }).error(function () {
            zeroModal.close(loading);
        })
    };
    //    测试邮件
    $scope.test_email = function () {
        if (!$scope.validate('test')) {
            zeroModal.error('请输入有效的邮箱!');
            return;
        };
        if ($scope.item.password == '') {
            zeroModal.error('请输入邮箱密码');
            return;
        };
        rqs_data = $scope.item;
        var loading = zeroModal.loading(4);
        $http.post("./yiiapi/email/test", rqs_data).then(function success(rsp) {
            zeroModal.close(loading);
            if (rsp.data.status == 0) {
                zeroModal.success('邮件发送成功!');
            } else if(rsp.data.status==600){
                console.log(rsp.data.msg);
            }else {
                zeroModal.error(rsp.data.msg);
            }
        }, function err(rsp) {
            zeroModal.close(loading);
            zeroModal.error('邮件发送失败!');
        });
    };
    //保存配置
    $scope.save = function () {
        if(!$scope.validate('save')){
          zeroModal.error('请输入有效的邮箱!');
          return;
        }
        rqs_data = $scope.item;
        var loading = zeroModal.loading(4);
        $http.post("./yiiapi/email/save", rqs_data).then(function success(rsp) {
            zeroModal.close(loading);
            if (rsp.data.status == 0) {
                zeroModal.success('保存成功!');
            }else if(rsp.data.status==600){
                console.log(rsp.data.msg);
            } else {
                zeroModal.error(rsp.data.msg);
            }
        }, function err(rsp) {
            zeroModal.close(loading);
            zeroModal.error('保存失败!');
        });
    };
    $scope.search = function (params) {
        // console.log($scope.item);
    };
    $scope.init();
}]);