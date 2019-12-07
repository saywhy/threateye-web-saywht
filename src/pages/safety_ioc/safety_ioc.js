'use strict';
/* Controllers */
app.controller('Safety_iocController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $scope.content_show = false;
        $scope.btn_disabled = true;
        $rootScope.pageNow = 0;
        $scope.upload_true = true; //初始化禁用提交按钮
        $("#avatval").click(function () {
            $("#avatar").trigger('click');
            $scope.$apply(function () {
                $('#progress')[0].style = 'width:0%';
                $scope.progress_if = false;
            })
        });
        $("#avatar").change(function (target) {
            var file = document.getElementById('avatar').files[0];
            $("#avatval").val(file.name);
            console.log('222');
            $http({
                method: 'get',
                url: './yiiapi/site/check-auth-exist',
                params: {
                    pathInfo: 'investigate/upload-file'
                }
            }).success(function (data) {
                console.log('111');
                console.log(data);
                if (data.status == 0) {
                    if (target.target.value) {
                        if (target.target.value.split('.')[1].indexOf('txt') == -1 && target.target.value.split('.')[1].indexOf('ioc') == -1) {
                            zeroModal.error(' 请重新选择.txt或.ioc格式的文件上传');
                            $scope.upload_true = true;
                        } else {
                            $scope.upload_true = false;
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
        $scope.progress_if = false;
        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
        };
        $scope.getPage();
    };
    //获取数据
    $scope.getPage = function (pageNow) {
        $scope.content_show = true;
        // var loading = zeroModal.loading(4);
        pageNow = pageNow ? pageNow : 1;
        $scope.index_num = (pageNow - 1) * 10;
        $scope.params_data = {
            page: pageNow,
            rows: 10
        };
        if (pageNow > 1000) {
            zeroModal.error('数据超过一万条,请缩小搜索条件');
        } else {
            $http({
                method: 'get',
                url: './yiiapi/investigate/ioc-scanning-list',
                params: $scope.params_data
            }).success(function (data) {
                if (data.status == 0) {
                    $scope.pages = data.data;
                    if ($scope.pages.data.length != 0) {
                        angular.forEach($scope.pages.data, function (item, index) {
                            item.create_percent = item.create_percent + '%';
                        });
                    }
                } else if (data.status == 600) {
                    console.log(data.msg);
                    zeroModal.error(data.msg);
                } else {
                    zeroModal.error(data.msg);
                }
            }).error(function () {
                // zeroModal.close(loading);
            })
        }
    };

    $scope.download_temp = function () {
        if ($scope.pages.count > 1000) {
            zeroModal.error('下载数据不能超出1000条！')
        } else {
            zeroModal.confirm({
                content: "确定下载列表吗？",
                okFn: function () {
                    $http({
                        method: 'get',
                        url: './yiiapi/site/check-auth-exist',
                        params: {
                            pathInfo: 'investigate/download-ioc-template-test'
                        }
                    }).success(function (data) {
                        if (data.status == 0) {
                            $scope.download_list();
                        }
                        if (data.status == 401) {
                            zeroModal.error(data.msg);
                        }

                    }).error(function (error) {
                        console.log(error);
                    })

                },
                cancelFn: function () {}
            });
        }
    };
    // 下载模版
    $scope.download_list = function () {
        $http({
            method: 'get',
            url: './yiiapi/investigate/download-ioc-template-test',
            // url: './yiiapi/whitelist/download-ioc-template-test',
        }).success(function (data) {
            console.log(data);
            if (data.status == 0) {
                download_now();
            } else if (data.status == 600) {
                console.log(data.msg);
            } else {
                zeroModal.error(data.msg);
            }
        }).error(function (error) {
            console.log(error);
        })

        function download_now() {
            var tt = new Date().getTime();
            var url = './yiiapi/investigate/download-ioc-template';
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
    };



    // 上传文件
    $scope.uploadPic = function () {
        $scope.progress_if = true;
        var form = document.getElementById('upload'),
            formData = new FormData(form);
        $.ajax({
            url: "./yiiapi/investigate/upload-file",
            type: "post",
            data: formData,
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.onprogress = function (progress) {
                        if (progress.lengthComputable) {
                            $('#progress')[0].style = 'width:' + parseInt(progress.loaded / progress.total * 100) + '%';
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
                if (typeof (res) == 'string') {
                    res = JSON.parse(res);
                };
                if (res.status == 0) {
                    zeroModal.success('上传成功');
                    $scope.$apply(function () {
                        $scope.btn_disabled = false;
                        $scope.upload_true = true;
                        $scope.progress_if = false;
                        $("#upload")[0].reset();
                    })
                    $scope.getPage();
                    for (var i = 0; i < 10; i++) {
                        setTimeout(function () {
                            $scope.getPage();
                        }, i * 5000);
                    }
                } else if (data.status == 600) {
                    console.log(data.msg);
                } else {
                    zeroModal.error(res.msg);
                }
            },
            error: function (err) {
                $('#progress')[0].style = 'width:0%';
                $scope.progress_if = false;
            }
        })
    };
    //搜索
    $scope.search = function () {
        $scope.getPage();
    };
    //下载列表文件
    $scope.download = function (item) {
        if (item.create_status != '1') {
            // 未成功
            zeroModal.error('文件未搜索完毕，不能进行下载或删除操作，请稍后再试！');
        } else {
            zeroModal.confirm({
                content: "确定下载吗？",
                okFn: function () {
                    $http({
                        method: 'get',
                        url: './yiiapi/investigate/ioc-scanning-download-test',
                        params: {
                            'id': item.id
                        }
                    }).success(function (data) {
                        // console.log(data);
                        if (data.status == 0) {
                            var tt = new Date().getTime();
                            var url = './yiiapi/investigate/ioc-scanning-download';
                            var form = $("<form>"); //定义一个form表单
                            form.attr("style", "display:none");
                            form.attr("target", "");
                            form.attr("method", "get"); //请求类型
                            form.attr("action", url); //请求地址
                            $("body").append(form); //将表单放置在web中
                            var input1 = $("<input>");
                            input1.attr("type", "hidden");
                            input1.attr("name", "id");
                            input1.attr("value", item.id);
                            form.append(input1);
                            form.submit(); //表单提交
                        } else if (data.status == 600) {
                            console.log(data.msg);
                        } else {
                            zeroModal.error(data.msg);
                        }
                    }).error(function (error) {
                        console.log(error);
                    })
                },
                cancelFn: function () {}
            });
        }
    };
    //删除列表数据
    $scope.del = function (item) {
        if (item.create_status != '1') {
            // 未成功
            zeroModal.error('文件未搜索完毕，不能进行下载或删除操作，请稍后再试！');
        } else {
            zeroModal.confirm({
                content: "确定删除吗？",
                okFn: function () {
                    var loading = zeroModal.loading(4);
                    $http({
                        method: 'delete',
                        url: './yiiapi/investigate/ioc-scanning-del',
                        data: {
                            'id': item.id
                        }
                    }).success(function (data) {
                        // console.log(data);
                        if (data.status == 0) {
                            zeroModal.success('删除成功');
                            $scope.getPage();
                        } else if (data.status == 600) {
                            console.log(data.msg);
                        } else {
                            zeroModal.error(data.msg);
                        }
                        zeroModal.close(loading);
                    }).error(function () {
                        zeroModal.close(loading);
                        zeroModal.error('删除失败');
                    })
                },
                cancelFn: function () {}
            });
        }
    };

    $scope.init();
}]);