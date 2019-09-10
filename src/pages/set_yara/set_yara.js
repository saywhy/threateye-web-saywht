/* Controllers */
app.controller('Set_yaraController', ['$scope', '$http', '$state', '$rootScope', '$filter', function ($scope, $http, $state, $rootScope, $filter) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        $scope.get_date() //获取数据
    };
    $scope.yara_replace = function () {
        $("input[type='file']").trigger('click');
    };
    $("#avatar").change(function (target) {
        $("#avatval").val($(this).val());
        $http({
            method: 'get',
            url: './yiiapi/site/check-auth-exist',
            params: {
                pathInfo: 'yararule/upload'
            }
        }).success(function (data) {
            if (data.status == 0) {
                if (target.target.value) {
                    if (target.target.value.split('.')[1].indexOf('txt') == -1 && target.target.value.split('.')[1].indexOf('yar') == -1) {
                        zeroModal.error(' 请重新选择.yar格式的文件上传');
                    } else {
                    $scope.upload()
                    }
                }
            }
            if (data.status == 401) {
                zeroModal.error(data.msg);
            }
    
        }).error(function (error) {
            console.log(error);
        })
  
    });
    $scope.number_filter = function (params) {
        if (params < 1024) {
            return params + ' B'
        }
        if (params >= 1024 && params < 1024 * 1024) {
            return $filter('number')(params / 1024, 2) + ' KB';
        }
        if (params >= 1024 * 1024 && params < 1024 * 1024 * 1024) {
            return $filter('number')(params / (1024 * 1024), 2) + ' MB';
        }
        if (params >= 1024 * 1024 * 1024) {
            return $filter('number')(params / (1024 * 1024 * 1024), 2) + ' GB';
        }
    };
    //获取数据
    $scope.get_date = function (download) {
        var loading = zeroModal.loading(4);
        $http({
            method: 'get',
            url: './yiiapi/yararule/get'
        }).success(function (data) {
             if(data.status == 1){
                $scope.yara_file = false;
            }
            if (data.status == 0) {
                $scope.yara_data = data.data;
                $scope.yara_data.file_size = $scope.number_filter($scope.yara_data.file_size);
                $scope.yara_file = true;
            }
            if(data.status == 600){
                zeroModal.error(data.msg);
            }
            if(download =='download'){
                if($scope.yara_file){
                    $scope.download();
                }
            }
            zeroModal.close(loading);
        }).error(function (error) {
            console.log(error);
            zeroModal.close(loading);
        })
    };
    // 下载
    $scope.download = function () {
        $http({
            method: 'get',
            url: './yiiapi/site/check-auth-exist',
            params: {
                pathInfo: 'yararule/download'
            }
        }).success(function (data) {
            if (data.status == 0) {
                var tt = new Date().getTime();
                var url = './yiiapi/yararule/download';
                var form = $("<form>"); //定义一个form表单
                form.attr("style", "display:none");
                form.attr("target", "");
                form.attr("method", "get"); //请求类型
                form.attr("action", url); //请求地址
                $("body").append(form); //将表单放置在web中
                var input1 = $("<input>");
                input1.attr("type", "hidden");
                form.append(input1);
                form.submit(); //表单提交
            }
            if (data.status == 401) {
                zeroModal.error(data.msg);
            }

        }).error(function (error) {
            console.log(error);
        })
     
    };
    // 上传文件
    $scope.upload = function () {
        var form = document.getElementById('upload'),
            formData = new FormData(form);
        $.ajax({
            url: "./yiiapi/yararule/upload",
            type: "post",
            data: formData,
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.onprogress = function (progress) {
                        if (progress.lengthComputable) {
                            // console.log(progress.lengthComputable);
                            // console.log(progress.loaded );
                            // console.log(progress.total);
                        }
                    };
                    xhr.upload.onloadstart = function () {
                        // console.log('started...');
                    };
                }
                return xhr;
            },
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function (res) {
                // res = JSON.parse(res);
                if(typeof(res) == 'string'){
                    res = JSON.parse(res);
               };
                if (res.status == 0) {
                    $("#upload")[0].reset();
                    zeroModal.success('上传成功');
                    $scope.get_date();
                }else if(res.status==600){
                    console.log(res.msg);
                } else {
                    zeroModal.error(res.msg);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    };
    //删除
    $scope.del = function(){
        var loading = zeroModal.loading(4);
        $http({
            method: 'get',
            url: './yiiapi/yararule/del'
        }).success(function (data) {
            // console.log(data); 
            $("#upload")[0].reset();
            zeroModal.success('删除成功'); 
            $scope.get_date();
            zeroModal.close(loading);
        }).error(function (error) {
            console.log(error);
            zeroModal.close(loading);
        })
    };
    $scope.init();
}]);