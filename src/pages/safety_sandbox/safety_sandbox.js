'use strict';
app.controller('Safety_sandboxController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $scope.get_list();
    };
    // 上传文件
    $(function () {
        var $list = $("#thelist_sandbox"); //这几个初始化全局的百度文档上没说明，好蛋疼。
        var $btn = $("#ctlBtn"); //开始上传
        var uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: false,
            chunkSize: 20242880,
            // swf文件路径
            swf: './webuploader-0.1.5/Uploader.swf',
            threads: 1, //上传并发数。允许同时最大上传进程数。
            // 文件接收服务端。
            server: './yiiapi/sandbox/upload',
            // duplicate:true,
            // fileSizeLimit: 100 * 1024 * 1024, // 文件总大小限制在50M
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker_sandbox',
            // formData:{id:'11'}, //文件上传请求的参数表，每次发送都会发送此对象中的参数。
            chunked: true, //开启分片上传
            threads: 1, //上传并发数
            fileNumLimit: 1, //验证文件总数量, 超出则不允许加入队列。
            duplicate: false, //去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
            method: 'POST',
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            $scope.loading = zeroModal.loading(4);
            console.log(file);
            if (file.size > 100 * 1024 * 1024) {
                zeroModal.error('允许最大上传文件为100M');
                zeroModal.close($scope.loading);
                return;
            }
            $list.empty();
            // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
            $list.append('<div id="' + file.id + '" class="item" style="margin: 0 0 20px 10px;">' +
                '<h4 class="info" style="font-size:16px">' + file.name + '</h4>' +
                '<p class="state">等待上传...</p>' +
                '</div>');
            $scope.filename = file;
            uploader.upload();
        });
        // 当有文件被移除后触发
        uploader.on('fileDequeued', function (file) {});
        //当uploader被重置时候触发
        uploader.on('reset', function (file) {});
        //当文件上传成功时触发。接收返回值
        uploader.on('uploadSuccess', function (file, response) {
            if (typeof (response) == 'string') {
                response = JSON.parse(response);
            };
            if (response.status == 0) {
                $http({
                    method: 'get',
                    url: './yiiapi/sandbox/move-file',
                    params: {
                        upload_name: file.name
                    }
                }).success(function (data) {
                    zeroModal.success('上传成功');
                    zeroModal.close($scope.loading);
                    $scope.get_list();
                }).error(function () {})
            } else {
                zeroModal.error(response.msg);
            }
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            $('#' + file.id).addClass('upload-state-done');
            $scope.updata_click = false;
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
        });
        $('#picker_sandbox').on('click', function () {
            uploader.reset(); //重置uploader。目前只重置了队列。
        });
    });
    // 获取列表
    $scope.get_list = function (pageNow) {
        pageNow = pageNow ? pageNow : 1
        $scope.page_now = pageNow;
        $http({
            method: 'get',
            url: './yiiapi/sandbox/list',
            params: {
                page: pageNow,
                rows: 10
            }
        }).success(function (data) {
            console.log(data);
            if (data.status == 0) {
                $scope.sandbox_data = data.data
                angular.forEach($scope.sandbox_data.data, function (item) {
                    switch (item.result) {
                        case '0':
                            item.result_cn = '发现威胁'
                            break;
                        case '1':
                            item.result_cn = '未发现威胁'
                            break;
                        case '2':
                            item.result_cn = ''
                            break;
                        default:
                            break;
                    }
                    switch (item.status) {
                        case '1':
                            item.disable = false
                            break;
                        case '2':
                            item.disable = true
                            break;
                        default:
                            break;
                    }
                })
            }
        }).error(function () {})
    }
    // 删除
    $scope.del = function (item) {
        $http({
            method: 'delete',
            url: './yiiapi/sandbox/del',
            data: {
                id: item.id,
            }
        }).success(function (data) {
            console.log(data);
            if (data.status == 1) {
                zeroModal.error(data.msg);
            } else {
                zeroModal.success('删除成功');
                $scope.get_list($scope.page_now);
            }
        }).error(function () {})
    }
    // 下载
    $scope.download = function (item) {
        if (item.status == '1') {
            zeroModal.error('正在扫描，请稍后重试');
        } else if (item.status == '2') {
            window.open('/yiiapi/sandbox/download-file?id=' + item.id);
        }
    }
    $scope.init();
}]);