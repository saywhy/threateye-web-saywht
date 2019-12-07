/* Controllers */
app.controller('Set_userController', ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
    // 初始化
    $scope.init = function (params) {
        $rootScope.pageNow = 0;
        $scope.UserIDList = [];
        $scope.userList = {};
        $scope.policy = {};
        $scope.addRole = {

        };
        $scope.testIP_type = false;;
        $scope.policy.disabled = true;
        $scope.selectValue = 'admin'; //默认选择角色admin权限
        $scope.strategy = '1';
        $scope.pages = {
            data: [],
            count: 0,
            maxPage: "...",
            pageNow: 1,
        };
        $scope.selected = '0'; //默认用户管理
        $scope.tab_data = [{
            name: '用户管理'
        }, {
            name: '角色管理'
        }, {
            name: '用户安全策略'
        }];
        $scope.userRole = {
            'admin': '管理员',
            'user': '普通用户',
            'share': '共享用户'
        }
        // 数据类型如下
        $scope.list = [{
            permissionList: [{
                name: '总览',
                isSelected: false,
                id: '1'
            }],
            type: "总览"
        }, {
            permissionList: [{
                    name: '威胁告警',
                    isSelected: false,
                    id: '12'
                },
                {
                    name: '风险资产',
                    isSelected: false,
                    id: '20'
                }
            ],
            type: "告警"
        }, {
            permissionList: [{
                    name: 'DNS调查',
                    isSelected: false,
                    id: '28'
                },
                {
                    name: 'IP/URL通讯',
                    isSelected: false,
                    id: '32'
                },
                {
                    name: '用户调查',
                    isSelected: false,
                    id: '36'
                },
                {
                    name: '文件调查',
                    isSelected: false,
                    id: '40'
                }, {
                    name: '数据传输调查',
                    isSelected: false,
                    id: '44'
                }, {
                    name: '流量方向调查',
                    isSelected: false,
                    id: '48'
                }, {
                    name: '主机调查',
                    isSelected: false,
                    id: '52'
                }, {
                    name: 'IOC扫描器',
                    isSelected: false,
                    id: '60'
                }, {
                    name: '沙箱',
                    isSelected: false,
                    id: '154'
                }
            ],
            type: "安全调查"
        }, {
            permissionList: [{
                name: '报表',
                isSelected: false,
                id: '68'
            }],
            type: "报表"
        }, {
            permissionList: [{
                    name: '内网IP段',
                    isSelected: false,
                    id: '75'
                },
                {
                    name: '白名单',
                    isSelected: false,
                    id: '79'
                },
                {
                    name: '用户管理',
                    isSelected: false,
                    id: '114'
                },
                {
                    name: '网络设置',
                    isSelected: false,
                    id: '86'
                }, {
                    name: '规则库更新',
                    isSelected: false,
                    id: '91'
                }, {
                    name: 'YARA规则',
                    isSelected: false,
                    id: '95'
                }, {
                    name: '邮件通知',
                    isSelected: false,
                    id: '100'
                }, {
                    name: 'SYSLOG配置',
                    isSelected: false,
                    id: '104'
                }, {
                    name: '许可证',
                    isSelected: false,
                    id: '125'
                }, {
                    name: '审计日志',
                    isSelected: false,
                    id: '109'
                }

            ],
            type: "设置"
        }];
        // 获取数据
        $scope.todolist = $scope.list;
        $scope.getPage(); // 获取用户列表
        $scope.getRoleList(); // 获取角色列表
        $scope.getSecurityPolicy();
        $scope.getPwdLength(); //获取密码长度
    };
    //tab栏切换
    $scope.show = function (params) {
        $scope.selected = params;
        if ($scope.selected == 0) {}
        if ($scope.selected == 1) {}
        if ($scope.selected == 2) {}
    };
    // 获取用户列表
    $scope.getPage = function (pageNow) {
        var loading = zeroModal.loading(4);
        pageNow = pageNow ? pageNow : 1;
        $scope.index_num = (pageNow - 1) * 10;
        if (pageNow > 1000) {
            zeroModal.error('数据超过一万条');
        } else {
            $http.post('./yiiapi/user/page', {
                page: pageNow
            }).then(function success(rsp) {
                zeroModal.close(loading);
                if (rsp.data.status == 0) {
                    $scope.pages = rsp.data.data;
                    angular.forEach($scope.pages.data, function (item) {
                        if (item.allow_ip != '' && item.allow_ip_segment != '') {
                            item.allow = item.allow_ip + ';' + item.allow_ip_segment
                        }
                        if (item.allow_ip == '') {
                            item.allow = item.allow_ip_segment
                        }
                        if (item.allow_ip_segment == '') {
                            item.allow = item.allow_ip
                        }

                    })
                    console.log($scope.pages.data);
                } else if (rsp.data.status == 600) {
                    zeroModal.error(rsp.data.msg);
                    console.log(rsp.data.msg);
                } else {
                    zeroModal.error(rsp.data.msg);
                }
            }, function err(rsp) {
                zeroModal.close(loading);
            });
        }
    };
    // 添加用户
    $scope.add = function () {
        $scope.testIP_type = false;
        $scope.nameerror = false;
        $scope.passworderror = false;
        $scope.repassworderror = false;
        $scope.addRoleList = $scope.roleList;
        $scope.selectValue = 'admin';
        var W = 540;
        var H = 580;
        var box = null;
        // 初始化
        $scope.newUser = {
            username: '',
            password: '',
            role: 'user',
            allow_ip: '',
            allow: ''
        }
        box = zeroModal.show({
            title: '添加用户',
            content: newUser,
            width: W + "px",
            height: H + "px",
            ok: true,
            cancel: true,
            okFn: function () {
                var username = $scope.newUser.username;
                var flag = true;
                if (username == null || username.length == 0 || !/^[a-z0-9_-]{2,16}$/.test(username)) {
                    flag = false;
                    $scope.nameerror = true;
                } else {
                    $scope.nameerror = false;
                }
                var password = $scope.newUser.password;
                var pattern = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/;
                if (!pattern.test(password)) {
                    flag = false;
                    $scope.passworderror = true;
                } else {
                    $scope.passworderror = false;
                }
                if (password != $scope.newUser.repassword) {
                    flag = false;
                    $scope.repassworderror = true;
                } else {
                    $scope.repassworderror = false;
                }
                $scope.$apply();
                if (!flag) {
                    return false;
                }
                if ($scope.newUser.allow_ip.split(";")) {
                    angular.forEach($scope.newUser.allow_ip.split(";"), function (item) {
                        console.log(item);
                    })
                }
                if ($scope.newUser.allow_ip != '') {
                    if ($scope.newUser.allow_ip.charAt($scope.newUser.allow_ip.length - 1) == ';') {
                        $scope.newUser.allow_ip = $scope.newUser.allow_ip.substr(0, $scope.newUser.allow_ip.length - 1);
                    }
                    angular.forEach($scope.newUser.allow_ip.split(";"), function (item) {
                        console.log(item);
                        if (item.indexOf('/') > 0) {
                            $scope.testIP(item.split("/")[0]);
                        } else {
                            $scope.testIP(item);
                        }
                    })
                    console.log($scope.testIP_type);
                    if ($scope.testIP_type) {
                        zeroModal.error('请填写有效的IP地址！');
                        return false;
                    }
                }

                $scope.sendUser();
            },
            onCleanup: function () {
                hideenBox.appendChild(newUser);
            }
        });
    };
    $scope.sendUser = function (id, $event) {
        rqs_data = {
            username: $scope.newUser.username,
            password: $scope.newUser.password,
            role: $scope.selectValue,
            allow_ip: $scope.newUser.allow_ip,
            page: $scope.pages.pageNow
        };
        console.log(rqs_data);

        var str = JSON.stringify(rqs_data)
        var loading = zeroModal.loading(4);
        $http.post("./yiiapi/user/user-add", rqs_data).then(function success(rsp) {
            zeroModal.close(loading);
            if (rsp.data.status == 0) {
                $scope.pages = rsp.data.data;
                $scope.getPage();
            } else if (rsp.data.status == 1) {
                zeroModal.error({
                    content: '用户添加失败',
                    contentDetail: rsp.data.msg
                });
            } else if (rsp.data.status == 600) {
                console.log(rsp.data.msg);
            } else {
                zeroModal.error(rsp.data.msg);
            }
        }, function err(rsp) {
            zeroModal.close(loading);
        });
    };
    // 删除用户
    $scope.del = function (item) {
        zeroModal.confirm({
            content: '确定删除' + '"' + item.username + '"吗？',
            okFn: function () {
                rqs_data = {
                    id: item.id,
                    page: $scope.pages.pageNow
                };
                var loading = zeroModal.loading(4);
                $http({
                    method: 'delete',
                    url: './yiiapi/user/user-del',
                    data: rqs_data,
                }).success(function (req) {
                    zeroModal.close(loading);
                    if (req.status == 0) {
                        $scope.getPage();
                    } else if (req.status == 600) {
                        console.log(req.msg);
                    } else {
                        zeroModal.error(req.msg);
                    }
                }).error(function () {
                    zeroModal.close(loading);
                })
            },
            cancelFn: function () {}
        });
    };
    // 添加角色
    $scope.addRoles = function () {
        $scope.addRole = {
            name: '',
            description: '',
            permissions_id: '',

        };
        $scope.selectAll = [];
        $scope.add_alarm = false;
        $scope.add_safety = false;
        $scope.add_set = false;
        for (var i = 0; i < $scope.todolist.length; i++) {
            angular.forEach($scope.todolist[i].permissionList, function (i) {
                i.isSelected = false;
            })
        }
        var W = 700;
        var H = 630;
        var box = null;
        box = zeroModal.show({
            title: '添加角色',
            content: newRole,
            width: W + "px",
            height: H + "px",
            ok: true,
            cancel: true,
            okFn: function () {
                $scope.addRole.permissionsList = [];
                angular.forEach($scope.todolist, function (item) {
                    angular.forEach(item.permissionList, function (i) {
                        if (i.isSelected) {
                            $scope.addRole.permissionsList.push(i.id)
                        }
                    })
                })
                if ($scope.addRole.permissionsList.indexOf('12') > -1 || $scope.addRole.permissionsList.indexOf('20') > -1) {
                    $scope.add_alarm = true;
                }
                if ($scope.addRole.permissionsList.indexOf('28') > -1 ||
                    $scope.addRole.permissionsList.indexOf('32') > -1 ||
                    $scope.addRole.permissionsList.indexOf('36') > -1 ||
                    $scope.addRole.permissionsList.indexOf('40') > -1 ||
                    $scope.addRole.permissionsList.indexOf('44') > -1 ||
                    $scope.addRole.permissionsList.indexOf('48') > -1 ||
                    $scope.addRole.permissionsList.indexOf('52') > -1 ||
                    $scope.addRole.permissionsList.indexOf('154') > -1 ||
                    $scope.addRole.permissionsList.indexOf('60') > -1) {
                    $scope.add_safety = true;
                }
                if ($scope.addRole.permissionsList.indexOf('75') > -1 ||
                    $scope.addRole.permissionsList.indexOf('79') > -1 ||
                    $scope.addRole.permissionsList.indexOf('86') > -1 ||
                    $scope.addRole.permissionsList.indexOf('91') > -1 ||
                    $scope.addRole.permissionsList.indexOf('95') > -1 ||
                    $scope.addRole.permissionsList.indexOf('100') > -1 ||
                    $scope.addRole.permissionsList.indexOf('104') > -1 ||
                    $scope.addRole.permissionsList.indexOf('109') > -1 ||
                    $scope.addRole.permissionsList.indexOf('125') > -1 ||
                    $scope.addRole.permissionsList.indexOf('114') > -1) {
                    $scope.add_set = true;
                }
                if ($scope.add_alarm) {
                    $scope.addRole.permissionsList.push('11');
                }
                if ($scope.add_safety) {
                    $scope.addRole.permissionsList.push('27');
                }
                if ($scope.add_set) {
                    $scope.addRole.permissionsList.push('74');
                }
                var post_data = {
                    name: $scope.addRole.name,
                    description: $scope.addRole.description,
                    permissions_id: $scope.addRole.permissionsList.join(',')
                };
                $http({
                    method: 'post',
                    url: './yiiapi/user/add-role',
                    data: post_data,
                }).success(function (data) {
                    if (data.status == 0) {
                        // 添加成功，更新角色列表
                        $scope.getRoleList();
                    } else if (data.status == 600) {
                        console.log(data.msg);
                    } else {
                        zeroModal.error(data.msg);
                    }
                }).error(function () {})
            },
            onCleanup: function () {
                hideenroleBox.appendChild(newRole);
            }
        });
    };
    // 验证Ip格式
    $scope.testIP = function (item) {
        var reg = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
        var re = new RegExp(reg);
        if (!re.test(item)) {
            console.log(item);
            $scope.testIP_type = true;
        }
    }
    // 修改角色
    $scope.modRole = function (item) {
        // 打开清空之前的数据
        $scope.selectAll = [true, true, true, true, true];
        for (var i = 0; i < $scope.todolist.length; i++) {
            angular.forEach($scope.todolist[i].permissionList, function (i) {
                i.isSelected = false;
            })
        }
        // 获取点击的对象数据
        $scope.mod_role = {
            name: item.name,
            description: item.description
        };
        if (item.permissions_id != '') {
            angular.forEach(item.permissions_id.split(','), function (num) {
                angular.forEach($scope.todolist, function (item, index) {
                    $scope.selectAll_index = index;
                    angular.forEach(item.permissionList, function (i) {
                        if (num == i.id) {
                            i.isSelected = true;
                        }
                    })
                })
            })
        }
        angular.forEach($scope.todolist, function (item, index) {
            $scope.selectAll_index = index;
            angular.forEach(item.permissionList, function (i) {
                if ($scope.selectAll_index == 0 && !i.isSelected) {
                    $scope.selectAll[0] = false;
                }
                if ($scope.selectAll_index == 1 && !i.isSelected) {
                    $scope.selectAll[1] = false;
                }
                if ($scope.selectAll_index == 2 && !i.isSelected) {
                    $scope.selectAll[2] = false;
                }
                if ($scope.selectAll_index == 3 && !i.isSelected) {
                    $scope.selectAll[3] = false;
                }
                if ($scope.selectAll_index == 4 && !i.isSelected) {
                    $scope.selectAll[4] = false;
                }
            })
        })

        var W = 700;
        var H = 630;
        var box = null;
        box = zeroModal.show({
            title: '修改角色',
            content: modRole,
            width: W + "px",
            height: H + "px",
            ok: true,
            cancel: true,
            okFn: function () {
                $scope.addRole.permissionsList = [];
                $scope.add_alarm = false;
                $scope.add_safety = false;
                $scope.add_set = false;
                angular.forEach($scope.todolist, function (item) {
                    angular.forEach(item.permissionList, function (i) {
                        if (i.isSelected) {
                            $scope.addRole.permissionsList.push(i.id)
                        }
                    })
                })


                if ($scope.addRole.permissionsList.indexOf('12') > -1 || $scope.addRole.permissionsList.indexOf('20') > -1) {
                    $scope.add_alarm = true;
                    console.log('2323');

                }
                if ($scope.addRole.permissionsList.indexOf('28') > -1 ||
                    $scope.addRole.permissionsList.indexOf('32') > -1 ||
                    $scope.addRole.permissionsList.indexOf('36') > -1 ||
                    $scope.addRole.permissionsList.indexOf('40') > -1 ||
                    $scope.addRole.permissionsList.indexOf('44') > -1 ||
                    $scope.addRole.permissionsList.indexOf('48') > -1 ||
                    $scope.addRole.permissionsList.indexOf('52') > -1 ||
                    $scope.addRole.permissionsList.indexOf('154') > -1 ||
                    $scope.addRole.permissionsList.indexOf('60') > -1) {
                    $scope.add_safety = true;
                }
                if ($scope.addRole.permissionsList.indexOf('75') > -1 ||
                    $scope.addRole.permissionsList.indexOf('79') > -1 ||
                    $scope.addRole.permissionsList.indexOf('86') > -1 ||
                    $scope.addRole.permissionsList.indexOf('91') > -1 ||
                    $scope.addRole.permissionsList.indexOf('95') > -1 ||
                    $scope.addRole.permissionsList.indexOf('100') > -1 ||
                    $scope.addRole.permissionsList.indexOf('104') > -1 ||
                    $scope.addRole.permissionsList.indexOf('109') > -1 ||
                    $scope.addRole.permissionsList.indexOf('125') > -1 ||
                    $scope.addRole.permissionsList.indexOf('114') > -1) {
                    $scope.add_set = true;
                }
                if ($scope.add_alarm) {
                    console.log('112');

                    $scope.addRole.permissionsList.push('11');
                }
                if ($scope.add_safety) {
                    $scope.addRole.permissionsList.push('27');
                }
                if ($scope.add_set) {
                    $scope.addRole.permissionsList.push('74');
                }
                console.log($scope.addRole.permissionsList);
                $http({
                    method: 'post',
                    url: './yiiapi/user/edit-role',
                    data: {
                        id: item.id,
                        old_name: item.name,
                        name: $scope.mod_role.name,
                        description: $scope.mod_role.description,
                        permissions_id: $scope.addRole.permissionsList.join(',')
                    },
                }).success(function (data) {
                    if (data.status == 0) {
                        // 修改成功，更新角色列表
                        $scope.getRoleList();
                    } else if (data.status == 600) {
                        console.log(data.msg);
                    } else {
                        zeroModal.error(data.msg);
                    }

                }).error(function () {

                })

            },
            onCleanup: function () {
                modRoleBox.appendChild(modRole);
            }
        });

    };
    // 删除角色
    $scope.delRole = function (item) {
        zeroModal.confirm({
            content: '确定删除 ' + '"' + item.name + '"吗？',
            okFn: function () {
                $http({
                    method: 'delete',
                    url: './yiiapi/user/del-role',
                    data: {
                        'role_name': item.name
                    },
                }).success(function (data) {
                    if (data.status == 0) {
                        // 删除成功，更新角色列表
                        $scope.getRoleList();
                    } else if (data.status == 600) {
                        console.log(data.msg);
                    } else {
                        zeroModal.error(data.msg);
                    }

                }).error(function () {

                })

            },
            cancelFn: function () {}
        });

    };
    //修改用户-修改密码
    $scope.resetPassword = function (user) {
        var loading = zeroModal.loading(4);
        $scope.testIP_type = false;
        console.log(user);
        $scope.getPwdLength();
        $scope.resetRoleList = $scope.roleList;
        $scope.resetSelectValue = user.role;
        $scope.resetUser_passworderror = false;
        $scope.resetUser_repassworderror = false;
        $scope.resetUser = {
            password: ''
        };
        $scope.resetUser.allow_ip = user.allow;
        $http.get("./yiiapi/user/get-password-reset-token?id=" + user.id).then(function success(rsp) {
            zeroModal.close(loading);
            if (rsp.data.status == 0) {
                var W = 540;
                var H = 500;
                zeroModal.show({
                    title: '重置[' + user.username + ']的密码',
                    content: resetPassword,
                    width: W + "px",
                    height: H + "px",
                    ok: true,
                    cancel: true,
                    okFn: function () {
                        if ($scope.resetUser.password != '') {
                            var flag = true;
                            var password = $scope.resetUser.password;
                            var pattern = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/;
                            if (!pattern.test(password)) {
                                flag = false;
                                $scope.resetUser_passworderror = true;
                            } else {
                                $scope.resetUser_passworderror = false;
                            }
                            if (password != $scope.resetUser.repassword) {
                                flag = false;
                                $scope.resetUser_repassworderror = true;
                            } else {
                                $scope.resetUser_repassworderror = false;
                            }
                            $scope.$apply();
                            if (!flag) {
                                return false;
                            }
                        }
                        if ($scope.resetUser.allow_ip != '') {
                            if ($scope.resetUser.allow_ip.charAt($scope.resetUser.allow_ip.length - 1) == ';') {
                                $scope.resetUser.allow_ip = $scope.resetUser.allow_ip.substr(0, $scope.resetUser.allow_ip.length - 1);
                            }
                            angular.forEach($scope.resetUser.allow_ip.split(";"), function (item) {
                                if (item.indexOf('/') > 0) {
                                    $scope.testIP(item.split("/")[0]);
                                } else {
                                    $scope.testIP(item);
                                }
                            })
                            if ($scope.testIP_type) {
                                zeroModal.error('请填写有效的IP地址！');
                                return false;
                            }
                        }
                        console.log($scope.resetUser.allow_ip);

                        var post_data = {
                            'ResetPasswordForm': {
                                'password': password,
                                "allow_ip": $scope.resetUser.allow_ip,
                                "role": $scope.resetSelectValue
                            }
                        };
                        loading = zeroModal.loading(4);
                        $http({
                            method: 'put',
                            url: './yiiapi/user/reset-password?token=' + rsp.data.data.token,
                            data: post_data,
                        }).success(function (data) {
                            if (data.status == 0) {
                                zeroModal.success('修改成功！');
                                $scope.getPage();
                            } else if (data.status == 600) {
                                console.log(data.msg);
                            }
                            zeroModal.close(loading);
                        }).error(function () {
                            zeroModal.close(loading);

                        })
                    },
                    onCleanup: function () {
                        hideenBox.appendChild(resetPassword);
                    }
                });
            }
        }, function err(rsp) {
            zeroModal.close(loading);
        });
    };
    // 获取密码长度
    $scope.getPwdLength = function () {
        $http({
            method: 'get',
            url: './yiiapi/site/get-passwd-length'
        }).then(function successCallback(data) {
            $scope.pwdLength = data.data.data
        }, function errorCallback(data) {});
    }
    // 这里初始化数组 上来全为空
    $scope.selectAll = [];
    //      对于对象进行操作的时候(点击)，会执行funcChange  
    //      判断对象数组中isSelected 是否为 true或false，在决定select是否为true  
    $scope.changeAll = function (index) { //全选/取消全选      
        angular.forEach($scope.todolist[index].permissionList, function (v, k) {
            v.isSelected = $scope.selectAll[index];
        })
    };
    $scope.funcChange = function (index) { // 当所有都选中时  
        $scope.selectAll[index] = true;
        angular.forEach($scope.todolist[index].permissionList, function (v, k) {
            $scope.selectAll[index] = $scope.selectAll[index] && v.isSelected;
        });
    }
    // 获取角色管理
    $scope.getRoleList = function () {
        var loading = zeroModal.loading(4);
        $http({
            method: 'get',
            url: './yiiapi/user/role-list'
        }).then(function successCallback(data) {
            $scope.roleList = data.data.data;
            zeroModal.close(loading);
        }, function errorCallback(data) {
            zeroModal.close(loading);
        });
    }
    $scope.checkPwdReset = function () {
        $http({
            method: 'get',
            url: './yiiapi/site/check-passwd-reset'
        }).then(function successCallback(data) {
            console.log(data);
            if (data.data.status == 600) {
                console.log(data.data.msg)
            }
        }, function errorCallback(data) {});
    }
    $scope.checkPwdReset();
    // 安全策略
    $scope.getSecurityPolicy = function () {
        var loading = zeroModal.loading(4);
        $http({
            method: 'get',
            url: './yiiapi/securitypolicy/get-security-policy'
        }).then(function successCallback(data) {
            zeroModal.close(loading);
            $scope.policy.minPasswd = data.data.data.min_passwd_len - 0;
            $scope.policy.maxPasswd = data.data.data.max_passwd_len - 0;
            $scope.policy.adminFaildLogon = data.data.data.admin_faild_logon_time - 0;
            $scope.policy.adminLogonDelay = data.data.data.admin_logon_delay_time - 0;
            $scope.policy.adminOnlineCount = data.data.data.admin_online_count - 0;
            $scope.policy.passwdRegular = data.data.data.passwd_regular_edit_time - 0;
            $scope.policy.sessionTimeout = data.data.data.session_timeout - 0;
            $scope.strategy = data.data.data.status;
            $scope.getPwdLength(); //重新获取密码长度规则
        }, function errorCallback(data) {
            zeroModal.close(loading);
        });
    }
    // 启用安全策略
    $scope.strategyChange = function (data) {
        console.log(data);
        $scope.strategy = data;
        if (data == '1') {
            $scope.policy.disabled = true;
            var loading = zeroModal.loading(4);
            if ($scope.policy.passwdRegular == 'undefined') {
                $scope.policy.passwdRegular = 0;
            }
            console.log($scope.policy.passwdRegular);
            $http({
                method: 'put',
                url: './yiiapi/securitypolicy/set-security-policy',
                data: {
                    min_passwd_len: $scope.policy.minPasswd,
                    max_passwd_len: $scope.policy.maxPasswd,
                    passwd_regular_edit_time: $scope.policy.passwdRegular,
                    admin_faild_logon_time: $scope.policy.adminFaildLogon,
                    admin_logon_delay_time: $scope.policy.adminLogonDelay,
                    session_timeout: $scope.policy.sessionTimeout,
                    admin_online_count: $scope.policy.adminOnlineCount,
                    status: $scope.strategy
                },
            }).success(function (data) {
                zeroModal.close(loading);
                if (data.status == 0) {
                    zeroModal.success('启用成功');
                } else if (data.status == 401) {
                    zeroModal.error(data.msg);
                }
            }).error(function (err) {
                zeroModal.close(loading);
                console.log(err);
            })
        } else {
            $scope.policy.disabled = false;
        }
    }
    // 安全策略检测数值
    $scope.strategy_num_test = function () {
        console.log($scope.policy.minPasswd);
        if ($scope.policy.minPasswd == null || $scope.policy.minPasswd < 8) {
            $scope.policy.minPasswd = 8;
        } else if ($scope.policy.minPasswd > 11) {
            $scope.policy.minPasswd = 11;
        }
        if ($scope.policy.maxPasswd == null || $scope.policy.maxPasswd < 11) {
            $scope.policy.maxPasswd = 11;
        } else if ($scope.policy.maxPasswd > 30) {
            $scope.policy.maxPasswd = 30;
        }
        if ($scope.policy.passwdRegular == null || $scope.policy.passwdRegular < 0) {
            $scope.policy.passwdRegular = 0;
        } else if ($scope.policy.passwdRegular > 90) {
            $scope.policy.passwdRegular = 90;
        }
        if ($scope.policy.adminFaildLogon == null || $scope.policy.adminFaildLogon < 1) {
            $scope.policy.adminFaildLogon = 1;
        } else if ($scope.policy.adminFaildLogon > 5) {
            $scope.policy.adminFaildLogon = 5;
        }
        if ($scope.policy.adminLogonDelay == null || $scope.policy.adminLogonDelay < 1) {
            $scope.policy.adminLogonDelay = 1;
        } else if ($scope.policy.adminLogonDelay > 3600) {
            $scope.policy.adminLogonDelay = 3600;
        }
        if ($scope.policy.sessionTimeout == null || $scope.policy.sessionTimeout < 1) {
            $scope.policy.sessionTimeout = 1;
        } else if ($scope.policy.sessionTimeout > 480) {
            $scope.policy.sessionTimeout = 480;
        }
        if ($scope.policy.adminOnlineCount == null || $scope.policy.adminOnlineCount < 1) {
            $scope.policy.adminOnlineCount = 1;
        } else if ($scope.policy.adminOnlineCount > 5) {
            $scope.policy.adminOnlineCount = 5;
        }
    }
    $scope.init();
}]);