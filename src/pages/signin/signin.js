'use strict';
// signin controller
app.controller('SigninFormController', ['$scope', '$rootScope', '$modal', '$http', '$state', function ($scope, $rootScope, $modal, $http, $state) {
    $scope.init = function () {
        $scope.login_show = false;
        $scope.code_error = false;
        $scope.user = {};
        $scope.creat = {
            username: '',
            password: '',
            repassword: ''
        };
        $scope.NumCode = '';
        $scope.passwd = {
            max: '',
            min: ''
        }
        $scope.pwsd_check = {
            reg: false,
            length: false,
        }
        $scope.tooltip_pop_if = false;
        // $scope.user.inputNumCode = ''; 
        $scope.getPwdLength();
        $scope.frist_login();
        setTimeout(function () {
            $scope.verCode();
        }, 200)
        $scope.focusInput();
        $rootScope.menuListShow = {
            overview: true,
            alarm_all: true,
            alarm: true,
            alarm_risk: true,
            safety: true,
            safety_dns: true,
            safety_url: true,
            safety_user: true,
            safety_file: true,
            safety_size: true,
            safety_direction: true,
            safety_host: true,
            safety_ioc: true,
            safety_sandbox: true,
            reportform: true,
            set: true,
            set_net_ip: true,
            set_black_list: true,
            set_net: true,
            set_rule: true,
            set_yara: true,
            set_email: true,
            set_syslog: true,
            set_log: true,
            set_licence: true,
            set_user: true
        };
    };
    // 第一次登录判断有无用户
    $scope.frist_login = function () {
        var loading = zeroModal.loading(4);
        $http({
            method: 'POST',
            url: './yiiapi/site/login'
        }).then(function successCallback(data) {
            console.log(data);
            if (data.data.status == 207) {
                // console.log('未注册');
                zeroModal.close(loading);
                $scope.login_show = true;
            } else if (data.data.status == 202) {
                // console.log('已登陆');
                // $state.go('app.overview');
                zeroModal.close(loading);
            } else {
                zeroModal.close(loading);
                $scope.login_show = false;
            }
        }, function errorCallback(data) {
            console.log(data);
            zeroModal.close(loading);
        });
    };
    // 创建管理员
    $scope.creat_admin = function () {
        var loading = zeroModal.loading(4);
        $scope.password_rexp = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/;
        if (!$scope.password_rexp.test($scope.creat.password)) {
            zeroModal.error('密码8-30位必须包含大写字母、小写字母、数字、特殊字符');
            zeroModal.close(loading);
        } else if ($scope.creat.password != $scope.creat.repassword) {
            zeroModal.error('密码不一致');
            zeroModal.close(loading);
        } else {
            $http({
                method: 'POST',
                url: './yiiapi/site/login',
                data: {
                    "LoginForm": {
                        "username": $scope.creat.username,
                        "password": $scope.creat.password,
                        'repassword': $scope.creat.repassword
                    },
                    "login-button": ""
                }
            }).then(function successCallback(data) {
                zeroModal.close(loading);
                console.log(data);
                // 创建成功，显示登录页面登录
                if (data.data.status == 0) {
                    zeroModal.success('创建管理员成功!');
                    localStorage.setItem('username_admin', $scope.creat.username);
                    $scope.app.username_admin = $scope.creat.username;
                } else if (data.data.status == 202) {
                    $http({
                        method: 'get',
                        url: './yiiapi/site/menu'
                    }).then(function successCallback(data) {
                        $rootScope.menuList = [];
                        angular.forEach(data.data.data, function (item) {
                            $rootScope.menuList.push(item.permissions_id);
                            if (item.child_menu.length != 0) {
                                angular.forEach(item.child_menu, function (key) {
                                    $rootScope.menuList.push(key.permissions_id);
                                })
                            }
                        })
                        angular.forEach($rootScope.menuList, function (item) {
                            switch (item) {
                                case '1':
                                    $rootScope.menuListShow.overview = true;
                                    break;
                                case '11':
                                    $rootScope.menuListShow.alarm_all = true;
                                    break;
                                case '12':
                                    $rootScope.menuListShow.alarm = true;
                                    break;
                                case '20':
                                    $rootScope.menuListShow.alarm_risk = true;
                                    break;
                                case '27':
                                    $rootScope.menuListShow.safety = true;
                                    break;
                                case '28':
                                    $rootScope.menuListShow.safety_dns = true;
                                    break;
                                case '32':
                                    $rootScope.menuListShow.safety_url = true;
                                    break;
                                case '36':
                                    $rootScope.menuListShow.safety_user = true;
                                    break;
                                case '40':
                                    $rootScope.menuListShow.safety_file = true;
                                    break;
                                case '44':
                                    $rootScope.menuListShow.safety_size = true;
                                    break;
                                case '48':
                                    $rootScope.menuListShow.safety_direction = true;
                                    break;
                                case '52':
                                    $rootScope.menuListShow.safety_host = true;
                                    break;
                                case '60':
                                    $rootScope.menuListShow.safety_ioc = true;
                                    break;
                                case '154':
                                    $rootScope.menuListShow.safety_sandbox = true;
                                    break;
                                case '68':
                                    $rootScope.menuListShow.reportform = true;
                                    break;
                                case '74':
                                    $rootScope.menuListShow.set = true;
                                    break;
                                case '75':
                                    $rootScope.menuListShow.set_net_ip = true;
                                    break;
                                case '79':
                                    $rootScope.menuListShow.set_black_list = true;
                                    break;
                                case '86':
                                    $rootScope.menuListShow.set_net = true;
                                    break;
                                case '91':
                                    $rootScope.menuListShow.set_rule = true;
                                    break;
                                case '95':
                                    $rootScope.menuListShow.set_yara = true;
                                    break;
                                case '100':
                                    $rootScope.menuListShow.set_email = true;
                                    break;
                                case '104':
                                    $rootScope.menuListShow.set_syslog = true;
                                    break;
                                case '109':
                                    $rootScope.menuListShow.set_log = true;
                                    break;
                                case '125':
                                    $rootScope.menuListShow.set_licence = true;
                                    break;
                                case '114':
                                    $rootScope.menuListShow.set_user = true;
                                    break;
                                default:
                                    break;
                            }
                        })
                        localStorage.setItem("menu", 'true'); //储存菜单
                        $scope.login_show = false;
                        $state.go('app.overview');
                    }, function errorCallback(data) {});
                }
            }, function errorCallback(data) {
                zeroModal.close(loading);
            });
        }
    };
    // 登录
    $scope.login = function () {
        if (!$scope.user.inputNumCode) {
            $scope.code_error = true;
            $scope.code_error_msg = '请输入验证码！'
            return;
        }
        if ($scope.user.inputNumCode.toUpperCase() != $scope.NumCode) {
            $scope.code_error = true;
            $scope.code_error_msg = '验证码输入不正确'
        } else {
            var loading = zeroModal.loading(4);
            $http({
                method: 'POST',
                url: './yiiapi/site/login',
                data: {
                    "LoginForm": {
                        "username": $scope.user.username,
                        "password": $scope.user.password
                    },
                    "login-button": ""
                }
            }).then(function successCallback(data) {
                // 登陆成功
                if (data.data.status == 0 || data.data.status == 202) {
                    localStorage.setItem('username_admin', $scope.user.username);
                    $scope.app.username_admin = $scope.user.username;
                    $state.go('app.overview');
                    // 获取用户菜单权限
                    $http({
                        method: 'get',
                        url: './yiiapi/site/menu'
                    }).then(function successCallback(data) {
                        // console.log(data);
                        $rootScope.menuList = [];
                        angular.forEach(data.data.data, function (item) {
                            $rootScope.menuList.push(item.permissions_id);
                            if (item.child_menu.length != 0) {
                                angular.forEach(item.child_menu, function (key) {
                                    $rootScope.menuList.push(key.permissions_id);
                                })
                            }
                        })
                        angular.forEach($rootScope.menuList, function (item) {
                            switch (item) {
                                case '1':
                                    $rootScope.menuListShow.overview = true;
                                    break;
                                case '11':
                                    $rootScope.menuListShow.alarm_all = true;
                                    break;
                                case '12':
                                    $rootScope.menuListShow.alarm = true;
                                    break;
                                case '20':
                                    $rootScope.menuListShow.alarm_risk = true;
                                    break;
                                case '27':
                                    $rootScope.menuListShow.safety = true;
                                    break;
                                case '28':
                                    $rootScope.menuListShow.safety_dns = true;
                                    break;
                                case '32':
                                    $rootScope.menuListShow.safety_url = true;
                                    break;
                                case '36':
                                    $rootScope.menuListShow.safety_user = true;
                                    break;
                                case '40':
                                    $rootScope.menuListShow.safety_file = true;
                                    break;
                                case '44':
                                    $rootScope.menuListShow.safety_size = true;
                                    break;
                                case '48':
                                    $rootScope.menuListShow.safety_direction = true;
                                    break;
                                case '52':
                                    $rootScope.menuListShow.safety_host = true;
                                    break;
                                case '60':
                                    $rootScope.menuListShow.safety_ioc = true;
                                    break;
                                case '154':
                                    $rootScope.menuListShow.safety_sandbox = true;
                                    break;
                                case '68':
                                    $rootScope.menuListShow.reportform = true;
                                    break;
                                case '74':
                                    $rootScope.menuListShow.set = true;
                                    break;
                                case '75':
                                    $rootScope.menuListShow.set_net_ip = true;
                                    break;
                                case '79':
                                    $rootScope.menuListShow.set_black_list = true;
                                    break;
                                case '86':
                                    $rootScope.menuListShow.set_net = true;
                                    break;
                                case '91':
                                    $rootScope.menuListShow.set_rule = true;
                                    break;
                                case '95':
                                    $rootScope.menuListShow.set_yara = true;
                                    break;
                                case '100':
                                    $rootScope.menuListShow.set_email = true;
                                    break;
                                case '104':
                                    $rootScope.menuListShow.set_syslog = true;
                                    break;
                                case '109':
                                    $rootScope.menuListShow.set_log = true;
                                    break;
                                case '125':
                                    $rootScope.menuListShow.set_licence = true;
                                    break;
                                case '114':
                                    $rootScope.menuListShow.set_user = true;
                                    break;
                                default:
                                    break;
                            }
                        })
                        localStorage.setItem("menu", 'true'); //储存菜单
                        zeroModal.close(loading);
                        if (data.data.data[0].function_name == '总览') {
                            $state.go('app.overview');
                        } else if (data.data.data[0].function_name == '报表') {
                            $state.go('app.reportform');
                        } else {
                            console.log(data.data.data[0].child_menu[0].permissions_id);
                            switch (data.data.data[0].child_menu[0].permissions_id) {
                                case '12':
                                    $state.go('app.alarm');
                                    break;
                                case '20':
                                    $state.go('app.alarm_risk');
                                    break;
                                case '28':
                                    $state.go('app.safety_dns');
                                    break;
                                case '32':
                                    $state.go('app.safety_url');
                                    break;
                                case '36':
                                    $state.go('app.safety_user');
                                    break;
                                case '40':
                                    $state.go('app.safety_file');
                                    break;
                                case '44':
                                    $state.go('app.safety_size');
                                    break;
                                case '48':
                                    $state.go('app.safety_direction');
                                    break;
                                case '52':
                                    $state.go('app.safety_host');
                                    break;
                                case '60':
                                    $state.go('app.safety_ioc');
                                    break;
                                case '154':
                                    $state.go('app.safety_sandbox');
                                    break;
                                case '75':
                                    $state.go('app.set_net_ip');
                                    break;
                                case '79':
                                    $state.go('app.set_black_list');
                                    break;
                                case '86':
                                    $state.go('app.set_net');
                                    break;
                                case '91':
                                    $state.go('app.set_rule');
                                    break;
                                case '95':
                                    $state.go('app.set_yara');
                                    break;
                                case '100':
                                    $state.go('app.set_email');
                                    break;
                                case '104':
                                    $state.go('app.set_syslog');
                                    break;
                                case '109':
                                    $state.go('app.set_log');
                                    break;
                                case '125':
                                    $state.go('app.set_licence');
                                    break;
                                case '114':
                                    $state.go('app.set_user');
                                    break;
                                default:
                                    break;
                            }
                        }
                    }, function errorCallback(data) {});
                    $scope.checkPwdReset();
                } else if (data.data.status == 1) {
                    zeroModal.close(loading);
                    $scope.verCode();
                    if (data.data.msg.username) {
                        $scope.msg_error = data.data.msg.username[0];
                    };
                    if (data.data.msg.password) {
                        $scope.msg_error = data.data.msg.password[0];
                    };
                    if (data.data.msg.allow_ip) {
                        $scope.msg_error = data.data.msg.allow_ip
                    }
                }
                // $scope.$apply();
            }, function errorCallback(data) {
                // console.log(data);
                zeroModal.close(loading);
            });
        }

    };
    $scope.focusInput = function () {
        $scope.code_error = false;
        $scope.code_error_msg = '';
        $scope.msg_error = '';
    }
    $scope.checkPwdReset = function () {
        $http({
            method: 'get',
            url: './yiiapi/site/check-passwd-reset'
        }).then(function successCallback(data) {
            if (data.data.status == 0) {} else if (data.data.status == 600) {
                console.log(data.data.msg);
                zeroModal.error(data.data.msg)
            }
        }, function errorCallback(data) {});
    }
    //背景canvas 插件
    $scope.particvle = function (params) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 100,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
    $scope.verCode = function () {
        var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ];
        var str = '';
        var verVal = drawCode();
        // 绘制验证码
        function drawCode(str) {
            var canvas = document.getElementById("verifyCanvas"); //获取HTML端画布
            var context = canvas.getContext("2d"); //获取画布2D上下文
            context.fillStyle = "cornflowerblue"; //画布填充色
            context.fillRect(0, 0, canvas.width, canvas.height); //清空画布
            context.fillStyle = "white"; //设置字体颜色
            context.font = "25px Arial"; //设置字体
            var rand = new Array();
            var x = new Array();
            var y = new Array();
            for (var i = 0; i < 4; i++) {
                rand.push(rand[i]);
                rand[i] = nums[Math.floor(Math.random() * nums.length)]
                x[i] = i * 20 + 10;
                y[i] = Math.random() * 20 + 20;
                context.fillText(rand[i], x[i], y[i]);
            }
            str = rand.join('').toUpperCase();
            $scope.NumCode = str;
            //画3条随机线
            for (var i = 0; i < 3; i++) {
                drawline(canvas, context);
            }
            // 画30个随机点
            for (var i = 0; i < 30; i++) {
                drawDot(canvas, context);
            }
            convertCanvasToImage(canvas);
            return str;
        }
        // 随机线
        function drawline(canvas, context) {
            context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
            context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
            context.lineWidth = 0.5; //随机线宽
            context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
            context.stroke(); //描边，即起点描到终点
        }
        // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
        function drawDot(canvas, context) {
            var px = Math.floor(Math.random() * canvas.width);
            var py = Math.floor(Math.random() * canvas.height);
            context.moveTo(px, py);
            context.lineTo(px + 1, py + 1);
            context.lineWidth = 0.2;
            context.stroke();

        }
        // 绘制图片
        function convertCanvasToImage(canvas) {
            document.getElementById("verifyCanvas").style.display = "none";
            var image = document.getElementById("code_img");
            image.src = canvas.toDataURL("image/png");
            return image;
        }

        // 点击图片刷新
        document.getElementById('code_img').onclick = function () {
            resetCode();
        }

        function resetCode() {
            $('#verifyCanvas').remove();
            $('#code_img').before('<canvas width="100" height="40" id="verifyCanvas"></canvas>')
            verVal = drawCode();
        }
    }

    $scope.getPwdLength = function () {
        $http({
            method: 'get',
            url: './yiiapi/site/get-passwd-length'
        }).then(function successCallback(data) {
            $scope.passwd.max = data.data.data.max_passwd_len;
            $scope.passwd.min = data.data.data.min_passwd_len;
        }, function errorCallback(data) {});
    }
    $scope.passwd_focus = function () {
        $scope.tooltip_pop_if = true;
        $scope.checkpwsd_length($scope.creat.password);
        $scope.checkpwsd($scope.creat.password);
    }
    $scope.passwd_blur = function () {
        $scope.tooltip_pop_if = false;
        $scope.checkpwsd_length($scope.creat.password);
        $scope.checkpwsd($scope.creat.password);
    }
    $scope.change_passwd = function () {
        $scope.checkpwsd_length($scope.creat.password);
        $scope.checkpwsd($scope.creat.password);
    }
    $scope.checkpwsd = function (pwsd) {
        var reg = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/;
        if (reg.test(pwsd)) {
            $scope.pwsd_check.reg = true;
        } else {
            $scope.pwsd_check.reg = false;
        }
    }
    $scope.checkpwsd_length = function (pwsd) {
        if (pwsd == '' || pwsd == undefined) {
            $scope.pwsd_check.length = false;
            return false;
        }
        if ($scope.passwd.min < pwsd.length && $scope.passwd.max > pwsd.length) {
            $scope.pwsd_check.length = true;
        } else {
            $scope.pwsd_check.length = false;
        }
    }
    $scope.init();
}]);