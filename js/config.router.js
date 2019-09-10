'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider
                    .otherwise('/signin');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/app.html'
                    })
                    .state('signin', {
                        url: '/signin',
                        templateUrl: 'src/pages/signin/signin.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['src/pages/signin/signin.js']);
                                }
                            ]
                        }
                    })
                    // 总览页面
                    .state('app.overview', {
                        url: '/overview',
                        templateUrl: 'src/pages/overview/overview.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/overview/overview.js']);
                                }
                            ]
                        }
                    })
                    // 告警页面
                    .state('app.alarm', {
                        url: '/alarm',
                        params: {
                            'data': null,
                            'pageNow':null,
                            'url':null
                        },
                        templateUrl: 'src/pages/alarm/alarm.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/alarm/alarm.js']);
                                }
                            ]
                        },
                    })
                    // 风险资产
                    .state('app.alarm_risk', {
                        url: '/alarm_risk',
                        params: {
                            'data': null
                        },
                        templateUrl: 'src/pages/alarm_risk/alarm_risk.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/alarm_risk/alarm_risk.js']);
                                }
                            ]
                        },
                    })
                    // 风险资产详情
                    .state('app.alarm_risk_detail', {
                        url: '/alarm_risk_detail',
                        params: {
                            'data': null
                        },
                        templateUrl: 'src/pages/alarm_risk_detail/alarm_risk_detail.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/alarm_risk_detail/alarm_risk_detail.js']);
                                }
                            ]
                        },
                    })
                    // 告警页面-详情
                    .state('app.alarm_detail', {
                        url: '/alarm_detail',
                        params: {
                            'data': null,
                            'url': null,
                            'params': null,
                            'title': null,
                            'pageNow': null,
                        },
                        templateUrl: 'src/pages/alarm_detail/alarm_detail.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/alarm_detail/alarm_detail.js']);
                                }
                            ]
                        },
                    })
                    // 安全调查
                    .state('app.safety', {
                        url: '/safety',
                        templateUrl: 'src/pages/safety/safety.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety/safety.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-dns
                    .state('app.safety_dns', {
                        url: '/safety_dns',
                        templateUrl: 'src/pages/safety_dns/safety_dns.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_dns/safety_dns.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-IP/URL通讯调查
                    .state('app.safety_url', {
                        url: '/safety_url',
                        templateUrl: 'src/pages/safety_url/safety_url.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_url/safety_url.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-用户调查
                    .state('app.safety_user', {
                        url: '/safety_user',
                        templateUrl: 'src/pages/safety_user/safety_user.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_user/safety_user.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-文件调查
                    .state('app.safety_file', {
                        url: '/safety_file',
                        templateUrl: 'src/pages/safety_file/safety_file.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_file/safety_file.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-流量大小及时长调查
                    .state('app.safety_size', {
                        url: '/safety_size',
                        templateUrl: 'src/pages/safety_size/safety_size.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_size/safety_size.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-流量方向调查
                    .state('app.safety_direction', {
                        url: '/safety_direction',
                        templateUrl: 'src/pages/safety_direction/safety_direction.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_direction/safety_direction.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-主机调查
                    .state('app.safety_host', {
                        url: '/safety_host',
                        templateUrl: 'src/pages/safety_host/safety_host.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_host/safety_host.js']);
                                }
                            ]
                        }
                    })
                    // 安全调查-IOC扫描器
                    .state('app.safety_ioc', {
                        url: '/safety_ioc',
                        templateUrl: 'src/pages/safety_ioc/safety_ioc.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/safety_ioc/safety_ioc.js']);
                                }
                            ]
                        }
                    })
                    // 报表
                    .state('app.reportform', {
                        url: '/reportform',
                        templateUrl: 'src/pages/reportform/reportform.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/reportform/reportform.js']);
                                }
                            ]
                        }
                    })
                    // 设置
                    .state('app.set', {
                        url: '/set',
                        templateUrl: 'src/pages/set/set.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set/set.js']);
                                }
                            ]
                        }
                    })
                    // 设置-yara
                    .state('app.set_yara', {
                        url: '/set_yara',
                        templateUrl: 'src/pages/set_yara/set_yara.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_yara/set_yara.js']);
                                }
                            ]
                        }
                    })
                    // 设置-内部网络IP段
                    .state('app.set_net_ip', {
                        url: '/set_net_ip',
                        templateUrl: 'src/pages/set_net_ip/set_net_ip.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_net_ip/set_net_ip.js']);
                                }
                            ]
                        }
                    })
                    // 设置-黑白名单
                    .state('app.set_black_list', {
                        url: '/set_black_list',
                        templateUrl: 'src/pages/set_black_list/set_black_list.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_black_list/set_black_list.js']);
                                }
                            ]
                        }
                    })
                    // 设置-用户管理
                    .state('app.set_user', {
                        url: '/set_user',
                        templateUrl: 'src/pages/set_user/set_user.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_user/set_user.js']);
                                }
                            ]
                        }
                    })
                    // 设置-网络设置
                    .state('app.set_net', {
                        url: '/set_net',
                        templateUrl: 'src/pages/set_net/set_net.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_net/set_net.js']);
                                }
                            ]
                        }
                    })
                    // 设置-规则库更新
                    .state('app.set_rule', {
                        url: '/set_rule',
                        templateUrl: 'src/pages/set_rule/set_rule.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_rule/set_rule.js']);
                                }
                            ]
                        }
                    })
                    // 设置-邮件通知
                    .state('app.set_email', {
                        url: '/set_email',
                        templateUrl: 'src/pages/set_email/set_email.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_email/set_email.js']);
                                }
                            ]
                        }
                    })
                    // 设置-许可证
                    .state('app.set_licence', {
                        url: '/set_licence',
                        templateUrl: 'src/pages/set_licence/set_licence.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['src/pages/set_licence/set_licence.js']);
                                }
                            ]
                        }
                    })
                        // 设置-审计日志
                        .state('app.set_log', {
                            url: '/set_log',
                            templateUrl: 'src/pages/set_log/set_log.html',
                            resolve: {
                                deps: ['$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load(['src/pages/set_log/set_log.js']);
                                    }
                                ]
                            }
                        })
                        // 设置-syslog
                        .state('app.set_syslog', {
                            url: '/set_syslog',
                            templateUrl: 'src/pages/set_syslog/set_syslog.html',
                            resolve: {
                                deps: ['$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load(['src/pages/set_syslog/set_syslog.js']);
                                    }
                                ]
                            }
                        })
                        // 设置-测试上传
                        .state('app.set_basic', {
                            url: '/set_basic',
                            templateUrl: 'src/pages/set_basic/set_basic.html',
                            resolve: {
                                deps: ['$ocLazyLoad',
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load(['src/pages/set_basic/set_basic.js']);
                                    }
                                ]
                            }
                        })
                    .state('app.dashboard-v1', {
                        url: '/dashboard-v1',
                        templateUrl: 'tpl/app_dashboard_v1.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/controllers/chart.js']);
                                }
                            ]
                        }
                    })
                    .state('app.dashboard-v2', {
                        url: '/dashboard-v2',
                        templateUrl: 'tpl/app_dashboard_v2.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/controllers/chart.js']);
                                }
                            ]
                        }
                    })
                    .state('app.ui', {
                        url: '/ui',
                        template: '<div ui-view class="fade-in-up"></div>'
                    })
                    .state('app.ui.buttons', {
                        url: '/buttons',
                        templateUrl: 'tpl/ui_buttons.html'
                    })
                    .state('app.ui.icons', {
                        url: '/icons',
                        templateUrl: 'tpl/ui_icons.html'
                    })
                    .state('app.ui.grid', {
                        url: '/grid',
                        templateUrl: 'tpl/ui_grid.html'
                    })
                    .state('app.ui.widgets', {
                        url: '/widgets',
                        templateUrl: 'tpl/ui_widgets.html'
                    })
                    .state('app.ui.bootstrap', {
                        url: '/bootstrap',
                        templateUrl: 'tpl/ui_bootstrap.html'
                    })
                    .state('app.ui.sortable', {
                        url: '/sortable',
                        templateUrl: 'tpl/ui_sortable.html'
                    })
                    .state('app.ui.portlet', {
                        url: '/portlet',
                        templateUrl: 'tpl/ui_portlet.html'
                    })
                    .state('app.ui.timeline', {
                        url: '/timeline',
                        templateUrl: 'tpl/ui_timeline.html'
                    })
                    .state('app.ui.tree', {
                        url: '/tree',
                        templateUrl: 'tpl/ui_tree.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/tree.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.ui.toaster', {
                        url: '/toaster',
                        templateUrl: 'tpl/ui_toaster.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('toaster').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/toaster.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.ui.jvectormap', {
                        url: '/jvectormap',
                        templateUrl: 'tpl/ui_jvectormap.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/controllers/vectormap.js');
                                }
                            ]
                        }
                    })
                    .state('app.ui.googlemap', {
                        url: '/googlemap',
                        templateUrl: 'tpl/ui_googlemap.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load([
                                        'js/app/map/load-google-maps.js',
                                        'js/app/map/ui-map.js',
                                        'js/app/map/map.js'
                                    ]).then(
                                        function () {
                                            return loadGoogleMaps();
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.chart', {
                        url: '/chart',
                        templateUrl: 'tpl/ui_chart.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load('js/controllers/chart.js');
                                }
                            ]
                        }
                    })
                    // table
                    .state('app.table', {
                        url: '/table',
                        template: '<div ui-view></div>'
                    })
                    .state('app.table.static', {
                        url: '/static',
                        templateUrl: 'tpl/table_static.html'
                    })
                    .state('app.table.datatable', {
                        url: '/datatable',
                        templateUrl: 'tpl/table_datatable.html'
                    })
                    .state('app.table.footable', {
                        url: '/footable',
                        templateUrl: 'tpl/table_footable.html'
                    })
                    .state('app.table.grid', {
                        url: '/grid',
                        templateUrl: 'tpl/table_grid.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngGrid').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/grid.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    // form
                    .state('app.form', {
                        url: '/form',
                        template: '<div ui-view class="fade-in"></div>',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load('js/controllers/form.js');
                                }
                            ]
                        }
                    })
                    .state('app.form.elements', {
                        url: '/elements',
                        templateUrl: 'tpl/form_elements.html'
                    })
                    .state('app.form.validation', {
                        url: '/validation',
                        templateUrl: 'tpl/form_validation.html'
                    })
                    .state('app.form.wizard', {
                        url: '/wizard',
                        templateUrl: 'tpl/form_wizard.html'
                    })
                    .state('app.form.fileupload', {
                        url: '/fileupload',
                        templateUrl: 'tpl/form_fileupload.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularFileUpload').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/file-upload.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.form.imagecrop', {
                        url: '/imagecrop',
                        templateUrl: 'tpl/form_imagecrop.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ngImgCrop').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/imgcrop.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.form.select', {
                        url: '/select',
                        templateUrl: 'tpl/form_select.html',
                        controller: 'SelectCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('ui.select').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/select.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.form.slider', {
                        url: '/slider',
                        templateUrl: 'tpl/form_slider.html',
                        controller: 'SliderCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('vr.directives.slider').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/slider.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.form.editor', {
                        url: '/editor',
                        templateUrl: 'tpl/form_editor.html',
                        controller: 'EditorCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('textAngular').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/editor.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    // pages
                    .state('app.page', {
                        url: '/page',
                        template: '<div ui-view class="fade-in-down"></div>'
                    })
                    .state('app.page.profile', {
                        url: '/profile',
                        templateUrl: 'tpl/page_profile.html'
                    })
                    .state('app.page.post', {
                        url: '/post',
                        templateUrl: 'tpl/page_post.html'
                    })
                    .state('app.page.search', {
                        url: '/search',
                        templateUrl: 'tpl/page_search.html'
                    })
                    .state('app.page.invoice', {
                        url: '/invoice',
                        templateUrl: 'tpl/page_invoice.html'
                    })
                    .state('app.page.price', {
                        url: '/price',
                        templateUrl: 'tpl/page_price.html'
                    })
                    .state('app.docs', {
                        url: '/docs',
                        templateUrl: 'tpl/docs.html'
                    })
                    // others
                    .state('lockme', {
                        url: '/lockme',
                        templateUrl: 'tpl/page_lockme.html'
                    })
                    .state('access', {
                        url: '/access',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    .state('access.signup', {
                        url: '/signup',
                        templateUrl: 'tpl/page_signup.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/signup.js']);
                                }
                            ]
                        }
                    })
                    .state('access.forgotpwd', {
                        url: '/forgotpwd',
                        templateUrl: 'tpl/page_forgotpwd.html'
                    })
                    .state('access.404', {
                        url: '/404',
                        templateUrl: 'tpl/page_404.html'
                    })

                    // fullCalendar
                    .state('app.calendar', {
                        url: '/calendar',
                        templateUrl: 'tpl/app_calendar.html',
                        // use resolve to load other dependences
                        resolve: {
                            deps: ['$ocLazyLoad', 'uiLoad',
                                function ($ocLazyLoad, uiLoad) {
                                    return uiLoad.load(
                                        ['vendor/jquery/fullcalendar/fullcalendar.css',
                                            'vendor/jquery/fullcalendar/theme.css',
                                            'vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                                            'vendor/libs/moment.min.js',
                                            'vendor/jquery/fullcalendar/fullcalendar.min.js',
                                            'js/app/calendar/calendar.js'
                                        ]
                                    ).then(
                                        function () {
                                            return $ocLazyLoad.load('ui.calendar');
                                        }
                                    )
                                }
                            ]
                        }
                    })

                    // mail
                    .state('app.mail', {
                        abstract: true,
                        url: '/mail',
                        templateUrl: 'tpl/mail.html',
                        // use resolve to load other dependences
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/mail/mail.js',
                                        'js/app/mail/mail-service.js',
                                        'vendor/libs/moment.min.js'
                                    ]);
                                }
                            ]
                        }
                    })
                    .state('app.mail.list', {
                        url: '/inbox/{fold}',
                        templateUrl: 'tpl/mail.list.html'
                    })
                    .state('app.mail.detail', {
                        url: '/{mailId:[0-9]{1,4}}',
                        templateUrl: 'tpl/mail.detail.html'
                    })
                    .state('app.mail.compose', {
                        url: '/compose',
                        templateUrl: 'tpl/mail.new.html'
                    })

                    .state('layout', {
                        abstract: true,
                        url: '/layout',
                        templateUrl: 'tpl/layout.html'
                    })
                    .state('layout.fullwidth', {
                        url: '/fullwidth',
                        views: {
                            '': {
                                templateUrl: 'tpl/layout_fullwidth.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/layout_footer_fullwidth.html'
                            }
                        },
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/vectormap.js']);
                                }
                            ]
                        }
                    })
                    .state('layout.mobile', {
                        url: '/mobile',
                        views: {
                            '': {
                                templateUrl: 'tpl/layout_mobile.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/layout_footer_mobile.html'
                            }
                        }
                    })
                    .state('layout.app', {
                        url: '/app',
                        views: {
                            '': {
                                templateUrl: 'tpl/layout_app.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/layout_footer_fullwidth.html'
                            }
                        },
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/tab.js']);
                                }
                            ]
                        }
                    })
                    .state('apps', {
                        abstract: true,
                        url: '/apps',
                        templateUrl: 'tpl/layout.html'
                    })
                    .state('apps.note', {
                        url: '/note',
                        templateUrl: 'tpl/apps_note.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/note/note.js',
                                        'vendor/libs/moment.min.js'
                                    ]);
                                }
                            ]
                        }
                    })
                    .state('apps.contact', {
                        url: '/contact',
                        templateUrl: 'tpl/apps_contact.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/contact/contact.js']);
                                }
                            ]
                        }
                    })
                    .state('app.weather', {
                        url: '/weather',
                        templateUrl: 'tpl/apps_weather.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        name: 'angular-skycons',
                                        files: ['js/app/weather/skycons.js',
                                            'vendor/libs/moment.min.js',
                                            'js/app/weather/angular-skycons.js',
                                            'js/app/weather/ctrl.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
                    .state('music', {
                        url: '/music',
                        templateUrl: 'tpl/music.html',
                        controller: 'MusicCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'com.2fdevs.videogular',
                                        'com.2fdevs.videogular.plugins.controls',
                                        'com.2fdevs.videogular.plugins.overlayplay',
                                        'com.2fdevs.videogular.plugins.poster',
                                        'com.2fdevs.videogular.plugins.buffering',
                                        'js/app/music/ctrl.js',
                                        'js/app/music/theme.css'
                                    ]);
                                }
                            ]
                        }
                    })
                    .state('music.home', {
                        url: '/home',
                        templateUrl: 'tpl/music.home.html'
                    })
                    .state('music.genres', {
                        url: '/genres',
                        templateUrl: 'tpl/music.genres.html'
                    })
                    .state('music.detail', {
                        url: '/detail',
                        templateUrl: 'tpl/music.detail.html'
                    })
                    .state('music.mtv', {
                        url: '/mtv',
                        templateUrl: 'tpl/music.mtv.html'
                    })
                    .state('music.mtvdetail', {
                        url: '/mtvdetail',
                        templateUrl: 'tpl/music.mtv.detail.html'
                    })
                    .state('music.playlist', {
                        url: '/playlist/{fold}',
                        templateUrl: 'tpl/music.playlist.html'
                    })
            }
        ]
    );