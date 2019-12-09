"use strict";
// Alarm Detail controller
app.controller("Alarm_detailController", [
    "$scope",
    "$http",
    "$stateParams",
    "$state",
    "$rootScope",
    "$filter",
    function ($scope, $http, $stateParams, $state, $rootScope, $filter) {
        // 初始化
        $scope.init = function (params) {
            if ($stateParams.url == "alarm") {
                $scope.crumbOptions = [{
                        href: "",
                        title: "总览",
                    },
                    {
                        href: "#/app/alarm?pageNow=" + $stateParams.pageNow,
                        title: "告警",
                    },
                    {
                        href: "",
                        title: "告警详情",
                    },
                ];
            }
            if ($stateParams.url == "alarm_risk_detail") {
                $scope.crumbOptions = [{
                        href: "",
                        title: "总览",
                    },
                    {
                        href: "#/app/alarm_risk",
                        title: "风险资产",
                    },
                    {
                        href: "#/app/alarm_risk_detail?data=" + encodeURI($stateParams.params),
                        title: $stateParams.title,
                    },
                    {
                        href: "",
                        title: "告警详情",
                    },
                ];
            }
            if ($stateParams.url == "overview") {
                $scope.crumbOptions = [{
                        href: "",
                        title: "总览",
                    },
                    {
                        href: "",
                        title: "告警详情",
                    },
                ];
            }
            $scope.detail_data_id = $stateParams.data;
            $scope.selected = 0;
            $scope.threat = {}; //威胁情报
            $scope.network_events = {}; //网络事件
            $scope.pages = {
                data: [],
                count: 0,
                maxPage: "...",
                pageNow: 1,
            };
            $scope.pages1 = {
                data: [],
                count: 0,
                maxPage: "...",
                pageNow: 1,
            };
            $scope.tab_data = [{
                    name: "当前告警资产",
                    content: "11111",
                },
                {
                    name: "历史告警资产",
                    content: "22222",
                },
            ];
            $scope.li_index = 0;
            $scope.get_data(); //获取基础详细信息
        };
        //获取基础详细信息
        $scope.get_data = function () {
            var loading = zeroModal.loading(4);
            $http({
                    method: "get",
                    url: "./yiiapi/alert/alert-details",
                    params: {
                        id: $scope.detail_data_id,
                    },
                })
                .success(function (data) {
                    zeroModal.close(loading);
                    if (data.status == 0) {
                        $scope.alert_details = data.data;
                        $scope.getPage(); // 当前告警资产
                        $scope.getPage1(); //历史告警资产
                        // 检测时间轴数据
                        $scope.time_type = [{
                            time: $scope.alert_details.alert_time,
                            type: $scope.alert_details.detect_engine,
                            content: $scope.alert_details.alert_description,
                            description_type: $scope.alert_details.description_type,
                            network_event: $scope.alert_details.network_event,
                        }, ];
                        if ($scope.alert_details.alert_description != null) {
                            $scope.switch_type(
                                $scope.alert_details.description_type,
                                $scope.alert_details.alert_description
                            );
                        }
                        $scope.switch_network($scope.alert_details.network_event); //网络事件匹配
                        $scope.payload_text = $scope.alert_details.network_event.payload;
                        // 追加告警处理
                        if (
                            $scope.alert_details.alarm_merger &&
                            $scope.alert_details.alarm_merger.length != 0
                        ) {
                            $scope.alert_details.alarm_merger_item = {};
                            angular.forEach($scope.alert_details.alarm_merger, function (
                                item
                            ) {
                                $scope.alert_details.alarm_merger_item = {
                                    time: item.alert_time,
                                    type: item.detect_engine,
                                    content: item.alert_description,
                                    description_type: item.description_type,
                                    network_event: item.network_event,
                                };
                                $scope.time_type.push($scope.alert_details.alarm_merger_item);
                            });
                        }
                        $scope.this_time = {};
                    }
                    if (data.status == 1) {
                        zeroModal.error(data.msg);
                    } else if (data.status == 600) {
                        zeroModal.error(data.msg);
                    }
                })
                .error(function (err) {
                    zeroModal.close(loading);
                    console.log(err);
                });
        };
        // 匹配情报类型
        $scope.switch_type = function (params, content) {
            $scope.whois_list = [];
            $scope.urls_if = false;
            $scope.whois_if = false;
            $scope.sandbox_if = false;
            $scope.IPReputation_if = false;
            $scope.BotnetCAndCURL_if = false;
            $scope.RansomwareURL_if = false;
            switch (params) {
                case "BotnetCAndCURL": //1
                    $scope.BotnetCAndCURL_if = true;
                    $scope.BotnetCAndCURL_list = [];
                    if (content.files) {
                        $scope.files_md5 = [];
                        angular.forEach(content.files, function (item) {
                            $scope.files_md5.push(item.MD5);
                        });
                        $scope.BotnetCAndCURL_list.push({
                            key: "僵尸样本信息",
                            value: $scope.files_md5,
                        });
                    }
                    if (content.urls) {
                        $scope.urls_url = [];
                        angular.forEach(content.urls, function (item) {
                            $scope.urls_url.push(item.url);
                        });
                        $scope.BotnetCAndCURL_list.push({
                            key: "僵尸样本下载URL",
                            value: $scope.urls_url,
                        });
                    }
                    if (content.whois) {
                        $scope.whois_if = true;
                        for (var key in content.whois) {
                            $scope.whois_item = {
                                key: key,
                                value: content.whois[key],
                            };
                            $scope.whois_list.push($scope.whois_item);
                        }
                    }
                    $scope.threat.BotnetCAndCURL = [{
                            key: "URL",
                            value: content.mask,
                        },
                        {
                            key: "威胁类型",
                            value: content.category, //content.category
                        },
                        {
                            key: "威胁细分",
                            value: content.threat,
                        },
                        {
                            key: "全球首次发现时间",
                            value: content.first_seen,
                        },
                        {
                            key: "流行度",
                            value: content.popularity,
                        },
                        {
                            key: "主要受影响地区",
                            value: content.geo,
                        },
                    ];
                    $scope.detail_infos = $scope.threat.BotnetCAndCURL;
                    break;
                case "RansomwareURL": //1
                    $scope.RansomwareURL_if = true;
                    $scope.RansomwareURL_list = [];
                    if (content.files) {
                        $scope.files_md5 = [];
                        angular.forEach(content.files, function (item) {
                            $scope.files_md5.push(item.MD5);
                        });
                        $scope.RansomwareURL_list.push({
                            key: "关联样本信息",
                            value: $scope.files_md5,
                        });
                    }
                    if (content.urls) {
                        $scope.urls_url = [];
                        angular.forEach(content.urls, function (item) {
                            $scope.urls_url.push(item.url);
                        });
                        $scope.RansomwareURL_list.push({
                            key: "僵尸样本下载URL",
                            value: $scope.urls_url,
                        });
                    }
                    if (content.whois) {
                        $scope.whois_if = true;
                        for (var key in content.whois) {
                            $scope.whois_item = {
                                key: key,
                                value: content.whois[key],
                            };
                            $scope.whois_list.push($scope.whois_item);
                        }
                    }
                    $scope.threat.RansomwareURL = [{
                            key: "URL",
                            value: content.mask,
                        },
                        {
                            key: "威胁类型",
                            value: content.category, //content.category
                        },
                        {
                            key: "全球首次发现时间",
                            value: content.first_seen,
                        },
                        {
                            key: "流行度",
                            value: content.popularity,
                        },
                        {
                            key: "IP",
                            value: content.IP,
                        },
                    ];
                    $scope.detail_infos = $scope.threat.RansomwareURL;
                    break;
                case "IPReputation": //2
                    if (content.ip_whois) {
                        $scope.whois_if = true;
                        for (var key in content.ip_whois) {
                            $scope.whois_item = {
                                key: key,
                                value: content.ip_whois[key],
                            };
                            $scope.whois_list.push($scope.whois_item);
                        }
                    }
                    if (content.files) {
                        $scope.BotnetCAndCURL_list = [];
                        $scope.files_md5 = [];
                        $scope.BotnetCAndCURL_if = true;
                        angular.forEach(content.files, function (item) {
                            $scope.files_md5.push(item.MD5);
                        });
                        $scope.BotnetCAndCURL_list.push({
                            key: "相关联恶意文件",
                            value: $scope.files_md5,
                        });
                    }
                    $scope.threat.IPReputation = [{
                            key: "IP",
                            value: content.ip,
                        },
                        {
                            key: "威胁类型",
                            value: content.category,
                        },
                        {
                            key: "全球首次发现时间",
                            value: content.first_seen,
                        },
                        {
                            key: "流行度",
                            value: content.popularity,
                        },
                        {
                            key: "主要受影响地区",
                            value: content.geo,
                        },
                        {
                            key: "相关联域名",
                            value: content.domains,
                        },
                    ];
                    $scope.detail_infos = $scope.threat.IPReputation;
                    break;
                case "MaliciousHash": // 3
                    if (content.urls) {
                        $scope.urls = [];
                        $scope.urls_if = true;
                        angular.forEach(content.urls, function (item) {
                            $scope.urls.push(item.url);
                        });
                    }
                    if (content.file_size) {
                        if (content.file_size < 1024) {
                            content.file_size = content.file_size + "B";
                        }
                        if (content.file_size >= 1024 && content.file_size < 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / 1024, 2) + "KB";
                        }
                        if (content.file_size >= 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / (1024 * 1024), 2) + "MB";
                        }
                    }
                    $scope.threat.MaliciousHash = [{
                            key: "MD5",
                            value: content.MD5,
                        },
                        {
                            key: "SHA256",
                            value: content.SHA256,
                        },
                        {
                            key: "文件大小",
                            value: content.file_size,
                        },
                        {
                            key: "文件类型",
                            value: content.file_type,
                        },
                        {
                            key: "常见文件名",
                            value: content.file_name,
                        },
                        {
                            key: "威胁类型",
                            value: content.category, ////content.category
                        },
                        {
                            key: "威胁细分",
                            value: content.threat,
                        },
                        {
                            key: "全球首次发现时间",
                            value: content.first_seen,
                        },
                        {
                            key: "流行度",
                            value: content.popularity,
                        },
                        {
                            key: "主要受影响地区",
                            value: content.geo,
                        },
                        {
                            key: "样本下载IP地址",
                            value: content.IP,
                        },
                    ];
                    $scope.detail_infos = $scope.threat.MaliciousHash;
                    break;

                case "MaliciousURL": // 4
                    if (content.whois) {
                        $scope.whois_if = true;
                        for (var key in content.whois) {
                            $scope.whois_item = {
                                key: key,
                                value: content.whois[key],
                            };
                            $scope.whois_list.push($scope.whois_item);
                        }
                    }
                    $scope.threat.MaliciousURL = [{
                            key: "URL",
                            value: content.mask,
                        },
                        {
                            key: "威胁类型",
                            value: content.category,
                        },
                        {
                            key: "全球首次发现时间",
                            value: content.first_seen,
                        },
                        {
                            key: "流行度",
                            value: content.popularity,
                        },
                        {
                            key: "主要受影响地区",
                            value: content.geo,
                        },
                        {
                            key: "相关联恶意文件",
                            value: content.file,
                        },
                    ];
                    $scope.detail_infos = $scope.threat.MaliciousURL;
                    break;
                case "PhishingURL": // 5
                    if (content.whois) {
                        $scope.whois_if = true;
                        for (var key in content.whois) {
                            $scope.whois_item = {
                                key: key,
                                value: content.whois[key],
                            };
                            $scope.whois_list.push($scope.whois_item);
                        }
                    }
                    $scope.threat.PhishingURL = [{
                            key: "URL",
                            value: content.mask,
                        },
                        {
                            key: "威胁类型",
                            value: content.category,
                        },
                        {
                            key: "全球首次发现时间",
                            value: content.first_seen,
                        },
                        {
                            key: "流行度",
                            value: content.popularity,
                        },
                        {
                            key: "主要受影响地区",
                            value: content.geo,
                        },
                        {
                            key: "被钓鱼IP",
                            value: content.IP,
                        },
                    ];
                    $scope.detail_infos = $scope.threat.PhishingURL;
                    break;
                case "MobileMaliciousHash": // 6
                    if (content.file_size) {
                        if (content.file_size < 1024) {
                            content.file_size = content.file_size + "B";
                        }
                        if (content.file_size >= 1024 && content.file_size < 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / 1024, 2) + "KB";
                        }
                        if (content.file_size >= 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / (1024 * 1024), 2) + "MB";
                        }
                    }
                    $scope.threat.MobileMaliciousHash = [{
                            key: "MD5",
                            value: content.MD5,
                        },
                        {
                            key: "SHA256",
                            value: content.SHA256,
                        },
                        {
                            key: "文件大小",
                            value: content.file_size,
                        },
                        {
                            key: "威胁类型",
                            value: content.category,
                        },
                        {
                            key: "威胁细分",
                            value: content.threat,
                        },
                        {
                            key: "全球首次发现时间",
                            value: content.first_seen,
                        },
                        {
                            key: "流行度",
                            value: content.popularity,
                        },
                        {
                            key: "主要受影响地区",
                            value: content.geo,
                        },
                    ];
                    $scope.detail_infos = $scope.threat.MobileMaliciousHash;
                    break;
                case "sdk": // 二当告警来源是SDK的时候
                    if (content.file_size) {
                        if (content.file_size < 1024) {
                            content.file_size = content.file_size + "B";
                        }
                        if (content.file_size >= 1024 && content.file_size < 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / 1024, 2) + "KB";
                        }
                        if (content.file_size >= 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / (1024 * 1024), 2) + "MB";
                        }
                    }
                    $scope.threat.sdk = [{
                            key: "威胁类型",
                            value: content.category,
                        },
                        {
                            key: "文件名",
                            value: content.file_name,
                        },
                        {
                            key: "文件大小",
                            value: content.file_size,
                        },
                        {
                            key: "文件哈希值",
                            value: content.md5,
                        },
                        {
                            key: "SDK检测威胁",
                            value: content.threat,
                        },
                    ];
                    if (content.category == '恶意程序') {
                        $scope.threat.sdk.push({
                            key: "文件下载",
                            value: '点击下载',
                            md5: content.md5
                        })
                    }
                    $scope.detail_infos = $scope.threat.sdk;
                    break;
                case "sandbox": // 三 当告警来源是沙箱的时候
                    $scope.sandbox_if = true;
                    if (content.size) {
                        if (content.size < 1024) {
                            content.size = content.size + "B";
                        }
                        if (content.size >= 1024 && content.size < 1024 * 1024) {
                            content.size =
                                $filter("number")(content.size / 1024, 2) + "KB";
                        }
                        if (content.size >= 1024 * 1024) {
                            content.size =
                                $filter("number")(content.size / (1024 * 1024), 2) + "MB";
                        }
                    }
                    $scope.threat.sandbox = [{
                            key: "威胁类型",
                            value: content.category,
                        },
                        {
                            key: "文件名",
                            value: content.filename,
                        },
                        {
                            key: "文件大小",
                            value: content.size,
                        },
                        {
                            key: "文件类型",
                            value: content.type,
                        },
                        {
                            key: "MD5",
                            value: content.md5,
                        },
                        {
                            key: "SHA1",
                            value: content.sha1,
                        },
                        {
                            key: "SHA256",
                            value: content.sha256,
                        },
                        {
                            key: "taskID",
                            value: content.taskID,
                        },
                    ];
                    if (content.category == '恶意程序') {
                        $scope.threat.sandbox.push({
                            key: "文件下载",
                            value: '点击下载',
                            md5: content.md5
                        })
                    }
                    $scope.threat.sandboxSignatures = content.Signatures;
                    $scope.detail_infos = [];
                    break;
                case "yara": // 四 当告警来源是YARA的时候
                    console.log('yara');
                    if (content.file_size) {
                        if (content.file_size < 1024) {
                            content.file_size = content.file_size + "B";
                        }
                        if (content.file_size >= 1024 && content.file_size < 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / 1024, 2) + "KB";
                        }
                        if (content.file_size >= 1024 * 1024) {
                            content.file_size =
                                $filter("number")(content.file_size / (1024 * 1024), 2) + "MB";
                        }
                    }
                    $scope.threat.yara = [{
                            key: "文件名",
                            value: content.file_name,
                        },
                        {
                            key: "文件大小",
                            value: content.file_size,
                        },
                        {
                            key: "文件哈希值",
                            value: content.md5,
                        },
                        {
                            key: "Yara规则名称",
                            value: content.rule_name,
                        },
                    ];
                    if (content.file_type == '恶意程序') {
                        $scope.threat.yara.push({
                            key: "文件下载",
                            value: '点击下载',
                            md5: content.md5
                        })
                    }
                    $scope.detail_infos = $scope.threat.yara;
                    break;
                case "IDS": // 五 当告警来源是IDS的时候
                    $scope.threat.IDS = [{
                            key: "告警类型",
                            value: content.category,
                        },
                        {
                            key: "告警描述",
                            value: content.threat,
                        },
                        {
                            key: "PayLoad信息",
                            value: "点击下载",
                        },
                    ];
                    $scope.detail_infos = $scope.threat.IDS;
                    break;
                default:
                    break;
            }
        };

        $scope.download_payload = function (item) {
            if (item.value == "点击下载" && item.key == "PayLoad信息") {
                var funDownload = function (content, filename) {
                    // 创建隐藏的可下载链接
                    var eleLink = document.createElement("a");
                    eleLink.download = filename;
                    eleLink.style.display = "none";
                    // 字符内容转变成blob地址
                    var blob = new Blob([content]);
                    eleLink.href = URL.createObjectURL(blob);
                    // 触发点击
                    document.body.appendChild(eleLink);
                    eleLink.click();
                    // 然后移除
                    document.body.removeChild(eleLink);
                };
                funDownload($scope.payload_text, "payload.dat");
            }
            if (item.value == "点击下载" && item.key == '文件下载') {
                window.open('/yiiapi/alert/get-file?md5=' + item.md5);
            }
        };
        $scope.download_sandbox = function (data) {
            console.log(data);
            angular.forEach(data, function (item) {
                if (item.key == 'MD5') {
                    $scope.md5_signature = item.value
                }
                if (item.key == "taskID") {
                    $scope.taskID_signature = item.value
                }
            })
            window.open('/yiiapi/alert/get-signature?md5=' + $scope.md5_signature + '&id=' + $scope.taskID_signature);
        }
        // 匹配网络事件
        $scope.switch_network = function (network_events) {
            $scope.network_events.smtp_if = false;
            $scope.network_events.http_if = false;
            $scope.network_events.ftp_data_if = false;
            $scope.network_events.imap_if = false;
            $scope.network_events.pop3_if = false;
            $scope.network_events.smb_if = false;
            $scope.network_events.ssh_if = false;
            $scope.network_events.ftp_if = false;
            $scope.network_events.https_if = false;
            $scope.network_events.dns_if = false;
            $scope.network_events.krb5_if = false;
            $scope.network_events.http_if = false;
            $scope.network_events.default_if = false;
            switch (network_events.event_type) {
                case "fileinfo":
                    if (network_events.app_proto == "smtp") {
                        // smtp
                        $scope.network_events.smtp_if = true;
                        $scope.network_events.smtp = network_events;
                        if ($scope.network_events.smtp.email.to.length > 1) {
                            $scope.network_events.smtp.email.to = $scope.network_events.smtp.email.to.join(
                                ","
                            );
                        }
                    } else if (network_events.app_proto == "http") {
                        // http
                        $scope.network_events.http_if = true;
                        $scope.network_events.http = network_events;
                    } else if (network_events.app_proto == "ftp-data") {
                        // ftp-data
                        $scope.network_events.ftp_data_if = true;
                        $scope.network_events.ftp_data = network_events;
                    } else if (network_events.app_proto == "imap") {
                        // imap
                        $scope.network_events.imap_if = true;
                        $scope.network_events.imap = network_events;
                        $scope.network_events.imap.email.to = $scope.network_events.imap.email.to.join(
                            ","
                        );
                    } else if (network_events.app_proto == "pop3") {
                        // pop3
                        $scope.network_events.pop3_if = true;
                        $scope.network_events.pop3 = network_events;
                        if ($scope.network_events.pop3.email.to.length > 1) {
                            $scope.network_events.pop3.email.to = $scope.network_events.pop3.email.to.join(
                                ","
                            );
                        }
                    } else if (network_events.app_proto == "smb") {
                        // smb
                        $scope.network_events.smb_if = true;
                        $scope.network_events.smb = network_events;
                    } else {
                        //默认
                        $scope.network_events.default_if = true;
                        $scope.network_events.default = network_events;
                        if (!$scope.network_events.default.app_proto) {
                            $scope.network_events.default.app_proto =
                                $scope.network_events.default.proto;
                        }
                        if (
                            $scope.network_events.default.app_proto == "failed" ||
                            $scope.network_events.default.app_proto == ""
                        ) {
                            $scope.network_events.default.app_proto =
                                $scope.network_events.default.proto;
                        }
                    }
                    break;
                case "flow":
                    if (network_events.app_proto == "ftp") {
                        $scope.network_events.ftp_if = true;
                        $scope.network_events.ftp = network_events;
                    } else {
                        $scope.network_events.default_if = true;
                        $scope.network_events.default = network_events;
                        if (!$scope.network_events.default.app_proto) {
                            $scope.network_events.default.app_proto =
                                $scope.network_events.default.proto;
                        }
                        if (
                            $scope.network_events.default.app_proto == "failed" ||
                            $scope.network_events.default.app_proto == ""
                        ) {
                            $scope.network_events.default.app_proto =
                                $scope.network_events.default.proto;
                        }
                    }
                    break;
                case "smb":
                    $scope.network_events.smb_if = true;
                    $scope.network_events.smb = network_events;
                    $scope.network_events.smb.app_proto = network_events.event_type;
                    break;
                case "ssh":
                    $scope.network_events.ssh_if = true;
                    $scope.network_events.ssh = network_events;
                    break;
                case "tls":
                    $scope.network_events.https_if = true;
                    $scope.network_events.https = network_events;
                    if ($scope.network_events.https.tls.subject) {
                        $scope.network_events.https.tls.Authorizing = $scope.network_events.https.tls.subject.substring(
                            $scope.network_events.https.tls.subject.indexOf("CN=") + 3
                        );
                    }
                    break;
                case "dns":
                    $scope.network_events.dns_if = true;
                    $scope.network_events.dns = network_events;
                    if ($scope.network_events.dns.dns.grouped) {
                        $scope.network_events.dns.dns.HostAddr = $scope.network_events.dns.dns.grouped.A.join(
                            ","
                        );
                    }
                    angular.forEach($scope.network_events.dns.dns.answers, function (
                        item
                    ) {
                        if ($scope.network_events.dns.dns.rrname == item.rrname) {
                            $scope.network_events.dns.dns.ttl = item.ttl;
                            $scope.network_events.dns.dns.rrtype = item.rrtype;
                        }
                    });
                    break;
                case "krb5":
                    $scope.network_events.krb5_if = true;
                    $scope.network_events.krb5 = network_events;
                    break;
                case "http":
                    $scope.network_events.http_if = true;
                    $scope.network_events.http = network_events;
                    break;
                case "alert":
                    if (network_events.app_proto == "tls") {
                        $scope.network_events.https_if = true;
                        $scope.network_events.https = network_events;
                        if ($scope.network_events.https.tls.subject) {
                            $scope.network_events.https.tls.Authorizing = $scope.network_events.https.tls.subject.substring(
                                $scope.network_events.https.tls.subject.indexOf("CN=") + 3
                            );
                        }
                    } else if (network_events.app_proto == "http") {
                        $scope.network_events.http_if = true;
                        $scope.network_events.http = network_events;
                    } else {
                        $scope.network_events.default_if = true;
                        $scope.network_events.default = network_events;
                        if (!$scope.network_events.default.app_proto) {
                            $scope.network_events.default.app_proto =
                                $scope.network_events.default.proto;
                        }
                        if (
                            $scope.network_events.default.app_proto == "failed" ||
                            $scope.network_events.default.app_proto == ""
                        ) {
                            $scope.network_events.default.app_proto =
                                $scope.network_events.default.proto;
                        }
                    }
                    break;
                default:
                    $scope.network_events.default_if = true;
                    $scope.network_events.default = network_events;
                    if (!$scope.network_events.default.app_proto) {
                        $scope.network_events.default.app_proto =
                            $scope.network_events.default.proto;
                    }
                    if (
                        $scope.network_events.default.app_proto == "failed" ||
                        $scope.network_events.default.app_proto == ""
                    ) {
                        $scope.network_events.default.app_proto =
                            $scope.network_events.default.proto;
                    }
                    break;
            }
        };
        // 当前告警资产
        $scope.getPage = function (pageNow) {
            pageNow = pageNow ? pageNow : 1;
            $http({
                    method: "get",
                    url: "./yiiapi/alert/get-same-indicator-alert",
                    params: {
                        indicator: $scope.alert_details.indicator,
                        // 'id': $scope.alert_details.id,
                        is_deal: 0,
                        page: pageNow,
                        row: 10,
                    },
                })
                .success(function (data) {
                    if (data.status == 0) {
                        $scope.pages = data.data;
                    } else if (data.status == 600) {
                        console.log(data.msg);
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        };
        // 历史告警资产
        $scope.getPage1 = function (pageNow) {
            pageNow = pageNow ? pageNow : 1;
            $http({
                    method: "get",
                    url: "./yiiapi/alert/get-same-indicator-alert",
                    params: {
                        indicator: $scope.alert_details.indicator,
                        is_deal: 2,
                        page: pageNow,
                        row: 10,
                    },
                })
                .success(function (data) {
                    if (data.status == 0) {
                        $scope.pages1 = data.data;
                    } else if (data.status == 600) {
                        console.log(data.msg);
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        };
        // 告警资产tab切换
        $scope.show = function (params) {
            $scope.selected = params;
        };
        //  检测时间轴点击切换
        $scope.isActive = function (item, index) {
            $scope.li_index = index;
            $scope.switch_type(item.description_type, item.content);
            $scope.switch_network(item.network_event);
            $scope.payload_text = item.network_event.payload;
        };
        // 获取时间轴详细数据
        $scope.get_time_data = function () {};
        $scope.init();
    },
]);