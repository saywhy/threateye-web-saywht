'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope','$translate', '$localStorage', '$window', '$modal', '$http', '$state',
        function ($scope,$rootScope, $translate, $localStorage, $window, $modal, $http, $state) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

            // config
            $scope.app = {
                name: 'ThreatEye高级威胁检测系统',
                title: 'ThreatEye',
                version: '1.0.0',
                http: 'http://192.168.1.253',
                https: 'http://192.168.1.253',
            };
            $scope.colorType = {
                high: '#962116',
                mid: '#F5BF41',
                low: '#4AA46E',
                rgbaHigh10: 'rgba(150,33,22,1)',
                rgbaHigh8: 'rgba(150,33,22,.8)',
                rgbaHigh2: 'rgba(150,33,22,.2)',
                rgbaMid: 'rgba(245,191,65,1)',
                rgbaMid8: 'rgba(245,191,65,.8)',
                rgbaMid2: 'rgba(245,191,65,.2)',
                rgbaLow10: 'rgba(74,164,110,1)',
                rgbaLow8: 'rgba(74,164,110,.8)',
                rgbaLow2: 'rgba(74,164,110,.2)',
            };
        
            // save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }
            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

            // angular translate
            $scope.lang = {
                isopen: false
            };
            $scope.langs = {
                en: 'English',
                de_DE: 'German',
                it_IT: 'Italian'
            };
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
            $scope.setLang = function (langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }
            //-------------------------------------------------------
            $scope.init_main = function () {
                $scope.new_data_info = 0;
                // 默认参数
                $scope.app.settings = {
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: true
                };
                $rootScope.menuListShow= {
                    overview:false,
                    alarm_all:false,
                    alarm:false,
                    alarm_risk:false,
                    safety:false,
                      safety_dns :false,
                    safety_url :false,
                    safety_user :false,
                    safety_file :false,
                    safety_size :false,
                    safety_direction :false,
                    safety_host :false,
                    safety_ioc :false,
                    reportform :false,
                    set:false,
                    set_net_ip :false,
                    set_black_list :false,
                    set_net :false,
                    set_rule :false,
                    set_yara  :false,
                    set_email :false,
                    set_syslog :false,
                    set_log :false,
                    set_licence :false,
                    set_user :false
                };
            
            };
            if( localStorage.getItem("menu")&&localStorage.getItem("menu") == 'true'){
                $http({
                    method: 'get',
                    url: './yiiapi/site/menu'
                }).then(function successCallback(data) {
                    console.log(data);
                    $rootScope.menuList=[];
                    angular.forEach(data.data.data,function(item){
                        $rootScope.menuList.push(item.permissions_id);
                        if(item.child_menu.length!=0){
                            angular.forEach(item.child_menu,function(key){
                                $rootScope.menuList.push(key.permissions_id);
                            })
                        }
                    })
                    console.log($rootScope.menuList);
                    console.log($rootScope.menuListShow);
                    angular.forEach($rootScope.menuList,function(item){
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
                            $rootScope.menuListShow.alarm_risk= true;
                            break;
                            case '27':
                            $rootScope.menuListShow.safety= true;
                            break;
                            case '28':
                            $rootScope.menuListShow.safety_dns= true;
                            break;
                            case '32':
                            $rootScope.menuListShow.safety_url= true;
                            break;
                            case '36':
                            $rootScope.menuListShow.safety_user= true;
                            break;
                            case '40':
                            $rootScope.menuListShow.safety_file= true;
                            break;
                            case '44':
                            $rootScope.menuListShow.safety_size= true;
                            break;
                            case '48':
                            $rootScope.menuListShow.safety_direction= true;
                            break;
                            case '52':
                            $rootScope.menuListShow.safety_host= true;
                            break;
                            case '60':
                            $rootScope.menuListShow.safety_ioc= true;
                            break;
                            case '68':
                            $rootScope.menuListShow.reportform= true;
                            break;
                            case '74':
                            $rootScope.menuListShow.set= true;
                            break;
                            case '75':
                            $rootScope.menuListShow.set_net_ip= true;
                            break;
                            case '79':
                            $rootScope.menuListShow.set_black_list= true;
                            break;
                            case '86':
                            $rootScope.menuListShow.set_net= true;
                            break;
                            case '91':
                            $rootScope.menuListShow.set_rule= true;
                            break;
                            case '95':
                            $rootScope.menuListShow.set_yara= true;
                            break;
                            case '100':
                            $rootScope.menuListShow.set_email= true;
                            break;
                            case '104':
                            $rootScope.menuListShow.set_syslog= true;
                            break;
                            case '109':
                            $rootScope.menuListShow.set_log= true;
                            break;
                            case '125':
                            $rootScope.menuListShow.set_licence= true;
                            break;
                            case '114':
                            $rootScope.menuListShow.set_user= true;
                            break;
                            default:
                                break;
                        }
                    })
                    $scope.$apply();
                }, function errorCallback(data) {
                });
            }
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // console.log(toState);
                if (toState.url == '' || toState.url == '/signin') {
                    $http({
                        method: 'POST',
                        url: './yiiapi/site/login'
                    }).then(function successCallback(data) {
                        // console.log(data.data);
                        if (data.data.status == 202) {
                            // console.log('已登陆');
                            $state.go('app.overview');
                        }
                    }, function errorCallback(data) {

                    });
                } else {
                }
            });
            $scope.items = ['item1', 'item2', 'item3'];
            //修改密码
            $scope.change_password = function (size) {
                $scope.data = {};
                var data = '传递数据';
                console.log('lg');
                var modalInstance = $modal.open({
                    templateUrl: 'modal.html',
                    controller: 'Modal_change_passwordCtrl',
                    size: size,
                    backdrop: 'static',
                    resolve: {
                        data: function () { //data作为modal的controller传入的参数
                            $scope.reset_token();
                            return $scope.data; //用于传递数据
                        }
                    }
                });
            };
            $scope.reset_token = function () {
                console.log('reset_token');
                $http({
                    method: 'get',
                    url: './yiiapi/site/get-self-password-reset-token'
                }).then(function successCallback(data) {
                    if (data.data.status == 0) {
                        $scope.data.token = data.data.data.data.token;
                    }
                }, function errorCallback(data) {
                    console.log(data);
                });
            };
             //修改密码
             $rootScope.passwdRegular = function (size) {
                $scope.data = {};
                var data = '传递数据';
                console.log('lg');
                var modal_regular = $modal.open({
                    templateUrl: 'passwdRegular.html',
                    controller: 'passwdRegularCtrl',
                    size: size,
                    backdrop: 'static',
                    resolve: {
                        data: function () { //data作为modal的controller传入的参数
                            $scope.passwdRegular_reset_token();
                            return $scope.data; //用于传递数据
                        }
                    }
                });
            };
            $scope.passwdRegular_reset_token = function () {
                $http({
                    method: 'get',
                    url: './yiiapi/site/get-self-password-reset-token'
                }).then(function successCallback(data) {
                    if (data.data.status == 0) {
                        $scope.data.token = data.data.data.data.token;
                    }
                }, function errorCallback(data) {
                    console.log(data);
                });
            };
            // 退出
            $scope.sign_out = function () {
                var loading = zeroModal.loading(4);
                $http({
                    method: 'get',
                    url: './yiiapi/site/logout'
                }).then(function successCallback(data) {
                    // 退出成功
                    if (data.data.status == 0) {
                        zeroModal.close(loading);
                        $scope.sign_out_news = true;
                        $state.go('signin');
                    }
                }, function errorCallback(data) {
                    console.log(data);
                });
            };
          
            $scope.showNews = function (item) {
                // console.log(item);
                var W = 480;
                var H = 200;
                zeroModal.show({
                    title: item.title,
                    content: item.content,
                    width: W + "px",
                    height: H + "px",
                    onCleanup: function (data) {
                        // console.log(data);
                    },
                    buttons: [{
                            className: 'zeromodal-btn zeromodal-btn-default',
                            name: '关闭',
                            fn: function () {}
                        },
                        {
                            className: 'zeromodal-btn zeromodal-btn-success',
                            name: '已查看',
                            fn: function () {
                                // console.log(item);
                                $http({
                                    method: 'post',
                                    url: './yiiapi/news/update',
                                    data: {
                                        id: item.id
                                    }
                                }).success(function (data) {
                                    // console.log(data);
                                    if (data.status == 0) {
                                    }
                                }).error(function (err) {
                                    console.log(err);

                                })
                            }
                        }
                    ]
                });
            }
            $scope.init_main();
        }
    ])
    .directive("custBreadcrumb", function() {
        return {
          restrict: 'E',
          replace: true,
          scope: {
            options:'@'
          },
          link: function(scope, elem, attrs) {
            // console.log(elem);
            // var parentNode = elem.parent();
            var crumbString = '<ol class="breadcrumb">';
            angular.forEach(scope.$eval(scope.options), function(item) {
                // console.log(item);
              if (item["href"] != "") {
                var tempString = '<li><a href="' + item["href"] + '">' + item["title"] + '</a></li>'; 
                crumbString += tempString;
              } else {
                var tempString = '<li class="active">' + item["title"] + '</li>'; 
                crumbString += tempString;
              }
            });
    
            crumbString += "</ol>";
            elem.append(angular.element(crumbString));
            // console.log(parentNode);
            // console.log(crumbString);
          }
        };
      });
  