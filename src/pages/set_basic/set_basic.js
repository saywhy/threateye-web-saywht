/* Controllers */
app.controller('Set_basicController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    // 初始化
    $scope.init = function (params) {
        $scope.filename=""
    }
    $(function(){
        var $list=$("#thelist");   //这几个初始化全局的百度文档上没说明，好蛋疼。
        var $btn =$("#ctlBtn");   //开始上传
 
        var uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: false,
            chunkSize:20242880,
            // swf文件路径
            swf: './webuploader-0.1.5/Uploader.swf',
            threads:1,//上传并发数。允许同时最大上传进程数。
            // 文件接收服务端。
            server: './yiiapi/rulebase/upload-package-bak',
            // duplicate:true,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',
            // formData:{id:'11'}, //文件上传请求的参数表，每次发送都会发送此对象中的参数。
            chunked: true,//开启分片上传
            threads: 1,//上传并发数
            // fileNumLimit:1,//验证文件总数量, 超出则不允许加入队列。
            duplicate:false,//去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
            method:'POST',
        });
        // 当有文件添加进来的时候
        uploader.on( 'fileQueued', function( file ) {
            $list.empty();
            // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
            $list.append( '<div id="' + file.id + '" class="item">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">等待上传...</p>' +
                '</div>' );
            $scope.filename = file;
            // console.log( $list[0].children);
        });
        // 当有文件被移除后触发
        uploader.on( 'fileDequeued', function( file ) {
            // console.log('del');
        });
        //当uploader被重置时候触发
        uploader.on( 'reset', function( file ) {
            // console.log('reset');
        });
        //当文件上传成功时触发。接收返回值
        uploader.on( 'uploadSuccess', function( file,response ) {
            // console.log(response);
            if(response.status ==1){
                zeroModal.error(response.msg);
            }
            if(response.status ==0){
                zeroModal.success('上传成功');
            }
              // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            $( '#'+file.id ).addClass('upload-state-done');
            // console.log(file.id);
            // console.log(uploader.getStats());//获取文件统计信息。
            //successNum 上传成功的文件数,progressNum 上传中的文件数,cancelNum 被删除的文件数
            //invalidNum 无效的文件数,uploadFailNum 上传失败的文件数,.queueNum 还在队列中的文件数,interruptNum 被暂停的文件数
            // uploader.destroy();//销毁 webuploader 实例
            uploader.removeFile(file, true); 
            uploader.reset();//重置uploader。目前只重置了队列。
            $list.empty();
        });
        
        // 文件上传过程中创建进度条实时显示。
        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if ( !$percent.length ) {
                $percent = $('<div class="progress progress-striped active">' +
                    '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                    '</div>' +
                    '</div>').appendTo( $li ).find('.progress-bar');
            }
            $li.find('p.state').text('上传中');
            $percent.css( 'width', percentage * 100 + '%' );
        });
 
 
        // 文件上传失败，显示上传出错。
        uploader.on( 'uploadError', function( file ) {
            $( '#'+file.id ).find('p.state').text('上传出错');
        });
 
        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').remove();
            $( '#'+file.id ).find('p.state').text('已上传');
        });
        $btn.on( 'click', function() {
            // console.log('开始上传');
            if ($(this).hasClass('disabled')) {
                // console.log('12121212121');
                return false;
            }
            // console.log($scope.filename);
           
            if($scope.filename.name.split('.')[1]!='tgz'){
                zeroModal.error('请上传名为sdk.tgz、ips.tgz、sandbox.tgz或yara.tgz的文件');
            }else if($scope.filename.name.split('.')[0]!='sdk'&&$scope.filename.name.split('.')[0]!='ips'&&$scope.filename.name.split('.')[0]!='sandbox'&&$scope.filename.name.split('.')[0]!='yara'){
                zeroModal.error('请上传名为sdk.tgz、ips.tgz、sandbox.tgz或yara.tgz的文件');
            }else{
                uploader.upload( $scope.filename );
            }
        });
        $('#picker').on('click', function() {
            // console.log('选择文件');
            uploader.reset();//重置uploader。目前只重置了队列。
        });


    });


    $scope.init();
}]);