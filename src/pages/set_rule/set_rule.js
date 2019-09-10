/* Controllers */
app.controller('Set_ruleController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        clearInterval($rootScope.insideInterval);
        clearInterval($rootScope.startInterval);
        $rootScope.pageNow = 0;
        $scope.upload_true = true;
        $scope.online_text = '更新';
        $scope.disabledUpdata = false;
        $scope.choosefile = true;
        $scope.updataText = '';
        $scope.offline_update_button = true;
        $scope.updataStatus();
        $scope.updata_click = false; //不可以上传
    };
    $scope.rule_setinterval=setInterval(function () {
        $scope.updataStatus();
    }, 2000);
    $scope.$on("$destroy", function() {
        clearInterval($scope.rule_setinterval);
    })
    $scope.updataStatus = function () {
        $http({
            method: 'get',
            url: './yiiapi/rulebase/get-update-status'
        }).success(function (data) {
            if (data.status == 0) {
                $scope.offline_data = data.data;
                //默认可以更新
                $scope.disabledUpdata = false;
                $scope.online_text = '更新';
                angular.forEach($scope.offline_data, function (item) {
                    if(!item.key == "online"){
                     $scope.item_online = true;
                    }
                    // 在线更新
                    if (item.update_type == '1') {
                        if (item.status == '1') {
                            $scope.disabledUpdata = true;
                            $scope.online_text = '更新中';
                        } 
                    }
                    // 离线更新
                    if (item.update_type == '2' &&item.status == '1') {
                        // $scope.disabledUpdata = false;
                        // $scope.online_text = '更新';
                    }
                });
            } else if(data.status==600){
                console.log(data.msg);
            }else {
                zeroModal.error(data.msg);
                clearInterval($scope.rule_setinterval);
            }
        }).error(function () {
            console.log('获取更新状态失败！');
        })
    };

    // 实时更新
    $scope.real_time_update = function () {
        $scope.offline_item_status= true;
        angular.forEach($scope.offline_data, function (item) {
            if(item.status=="1"&&item.update_type == '2'){
                $scope.offline_item_status= false;
            }
        })
      if( $scope.offline_item_status){
        var loading = zeroModal.loading(4);
        $http({
            method: 'post',
            url: './yiiapi/rulebase/realtime-update'
        }).success(function (data) {
            if (data.status == 0) {
                zeroModal.success('开始更新！');
                $scope.updataStatus();
            } else if(data.status==600){
                console.log(data.msg);
                zeroModal.error(data.msg);
            }else {
                zeroModal.error(data.msg);
            }
            zeroModal.close(loading);
        }).error(function () {
            zeroModal.close(loading);
            // zeroModal.error('更新失败！');
        })
      }else{
        zeroModal.error('正在离线更新中，请稍后再试。');
      }
      
    };
    // 离线更新
    $scope.offline_update = function () {
        var loading = zeroModal.loading(4);
        $http({
            method: 'post',
            url: './yiiapi/rulebase/offline-updating'
        }).success(function (data) {
            zeroModal.close(loading);
            if (data.status == 0) {
                zeroModal.success('更新成功！');
            } else if(data.status==600){
                console.log(data.msg);
            }else {
                zeroModal.error(data.msg);
            }
        }).error(function () {
            zeroModal.close(loading);
            zeroModal.error('更新失败！');
        })
    };

    // 上传文件
    $(function () {
        var $list = $("#thelist"); //这几个初始化全局的百度文档上没说明，好蛋疼。
        var $btn = $("#ctlBtn"); //开始上传

        var uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: false,
            chunkSize: 20242880,
            // swf文件路径
            swf: './webuploader-0.1.5/Uploader.swf',
            threads: 1, //上传并发数。允许同时最大上传进程数。
            // 文件接收服务端。
            server: './yiiapi/rulebase/upload-package',
            // duplicate:true,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',
            // formData:{id:'11'}, //文件上传请求的参数表，每次发送都会发送此对象中的参数。
            chunked: true, //开启分片上传
            threads: 1, //上传并发数
            // fileNumLimit:1,//验证文件总数量, 超出则不允许加入队列。
            duplicate: false, //去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
            method: 'POST',
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            $list.empty();
            // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
            $list.append('<div id="' + file.id + '" class="item" style="margin: 0 0 20px 10px;">' +
                '<h4 class="info" style="font-size:16px">' + file.name + '</h4>' +
                '<p class="state">等待上传...</p>' +
                '</div>');
            $scope.filename = file;
            // $scope.updataStatus();
            $http({
                method: 'get',
                url: './yiiapi/site/check-auth-exist',
                params: {
                    pathInfo: 'rulebase/get-update-status'
                }
            }).success(function (data) {
                if (data.status == 0) {
                    $http({
                        method: 'get',
                        url: './yiiapi/rulebase/get-update-status'
                    }).success(function (data) {
                        if (data.status == 0) {
                            $scope.offline_data = data.data;
                            //默认可以更新
                            $scope.disabledUpdata = false;
                            $scope.online_text = '更新';
                            angular.forEach($scope.offline_data, function (item) {
                                if(!item.key == "online"){
                                 $scope.item_online = true;
                                }
                                // 在线更新
                                if (item.update_type == '1') {
                                    if (item.status == '1') {
                                        $scope.disabledUpdata = true;
                                        $scope.online_text = '更新中';
                                    } 
                                }
                                // 离线更新
                                if (item.update_type == '2' &&item.status == '1') {
                                    // $scope.disabledUpdata = false;
                                    // $scope.online_text = '更新';
                                }
                            });
                            if ($scope.filename.name.split('.')[1] != 'tgz') {
                                $scope.updata_click = false;
                                zeroModal.error('请上传文件名为sdk.tgz、ids.tgz、df.tgz、sandbox.tgz或yara.tgz的文件');
                            } else if ($scope.filename.name.split('.')[0] != 'sdk' && $scope.filename.name.split('.')[0] != 'ids' &&
                                $scope.filename.name.split('.')[0] != 'sandbox' && $scope.filename.name.split('.')[0] != 'yara' &&
                                $scope.filename.name.split('.')[0] != 'df') {
                                $scope.updata_click = false;
                                zeroModal.error('请上传文件名为sdk.tgz、ids.tgz、df.tgz、sandbox.tgz或yara.tgz的文件');
                            } else {
                                $scope.updata_click = true;
                                angular.forEach($scope.offline_data, function (item) {
                                    if(item.update_type == '2'){
                                        if ($scope.filename.name.split('.')[0] == item.key && item.status == '1') {
                                            $scope.$apply(function () {
                                                $scope.updata_click = false;
                                            })
                                            zeroModal.error(item.key + '正在更新中，请稍后再试！');
                                        }
                                    }
                                })
                            }
        
        
                        } else if(data.status==600){
                            console.log(data.msg);
                        }else {
                            zeroModal.error(data.msg);
                            clearInterval($scope.rule_setinterval);
                        }
                    }).error(function () {
                        console.log('获取更新状态失败！');
                    })
               

                }
                if (data.status == 401) {
                    zeroModal.error(data.msg);
                }
        
            }).error(function (error) {
                console.log(error);
            })
          
        });
        // 当有文件被移除后触发
        uploader.on('fileDequeued', function (file) {
            // console.log('del');
        });
        //当uploader被重置时候触发
        uploader.on('reset', function (file) {
            // console.log('reset');
        });
        //当文件上传成功时触发。接收返回值
        uploader.on('uploadSuccess', function (file, response) {
            // console.log(response);
            if (typeof (response) == 'string') {
                response = JSON.parse(response);
            };
            if (response.status == 0) {
                zeroModal.success('上传成功');
            } else {
                zeroModal.error(response.msg);
            }
            zeroModal.close($scope.loading);
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            $('#' + file.id).addClass('upload-state-done');
            $scope.updata_click = false;
            // console.log(file.id);
            // console.log(uploader.getStats());//获取文件统计信息。
            //successNum 上传成功的文件数,progressNum 上传中的文件数,cancelNum 被删除的文件数
            //invalidNum 无效的文件数,uploadFailNum 上传失败的文件数,.queueNum 还在队列中的文件数,interruptNum 被暂停的文件数
            // uploader.destroy();//销毁 webuploader 实例
            uploader.removeFile(file, true);
            uploader.reset(); //重置uploader。目前只重置了队列。
            // $list.empty(); 
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                    '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                    '</div>' +
                    '</div>').appendTo($li).find('.progress-bar');
            }
            $li.find('p.state').text('上传中...' + Math.floor(percentage * 100) + '%');
            $percent.css('width', percentage * 100 + '%');
        });
        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('p.state').text('上传出错');
        });
        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
            $('#' + file.id).find('p.state').text('已上传');
        });
        $btn.on('click', function () {
            // console.log('开始上传');
            if ($(this).hasClass('disabled')) {
                return false;
            }
            $scope.online_item_status = true;
            angular.forEach($scope.offline_data, function (item) {
                if(item.update_type == '1'&&item.status == '1'){
                    $scope.online_item_status = false;
                }
            })
            if($scope.online_item_status){
                $scope.loading = zeroModal.loading(4);
                uploader.upload($scope.filename);
            }else{
                zeroModal.error('正在实时更新中，请稍后再试。');
            }
        });
        $('#picker').on('click', function () {
            // console.log('选择文件');
            uploader.reset(); //重置uploader。目前只重置了队列。
        });
    });
    $scope.init();
}]);