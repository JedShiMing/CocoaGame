(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/utils/af-platform.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'caf33uIqhhAX4GqAKuT1wUx', 'af-platform', __filename);
// framework/utils/af-platform.js

'use strict';

/**
 * 设备平台相关的
 */

var serverKey = require('../config/serverKey.js');
var serverVer = require('../config/serverVer.js');
var serverUrl = require('../config/serverUrl.js');

var platform = {
    init: function init() {
        this.WX_GAME_ENV = false; //微信平台
        this.WX_GAME_DEVTOOLS = false; //微信模拟器
        this.QQ_GAME_ENV = false; //QQ平台

        if ('undefined' !== typeof wx) {
            this.WX_GAME_ENV = true;

            var info = wx.getSystemInfoSync();

            if (info.platform == "devtools") {
                this.WX_GAME_DEVTOOLS = true;
            }
        } else if ('undefined' !== typeof BK) {
            this.QQ_GAME_ENV = true;
        }

        this.isStart = false;
    },

    start: function start(isVideoAdOpen) {
        if (AF.platform.isStart) {
            return;
        }

        AF.platform.isStart = true;

        if (AF.platform.isWxApp()) {
            var isWxPhone = AF.platform.isWxPhone();
            AF.wxHelper.init(isWxPhone, isVideoAdOpen);
        } else if (AF.platform.isQQApp()) {
            AF.qqHelper.init(isVideoAdOpen);
        }
    },

    getSrc: function getSrc() {
        return AF.platform.getServerUrl().src;
    },

    isWxApp: function isWxApp() {
        return AF.platform.WX_GAME_ENV;
    },

    isQQApp: function isQQApp() {
        return AF.platform.QQ_GAME_ENV;
    },

    isWxPhone: function isWxPhone() {
        if (AF.platform.WX_GAME_ENV && !AF.platform.WX_GAME_DEVTOOLS) {
            return true;
        } else {
            return false;
        }
    },

    getSystemInfo: function getSystemInfo() {
        var info = {};

        info.windowWidth = 0;
        info.windowHeight = 0;

        if (AF.platform.isWxApp()) {
            var data = wx.getSystemInfoSync();
            info.windowWidth = data.windowWidth;
            info.windowHeight = data.windowHeight;
        }

        return info;
    },

    getServerKey: function getServerKey() {
        var key = AF.platform.getQueryValue("server") || serverKey;
        var urls = serverUrl.getUrls();

        if (key == "") {
            key = "test";
        }

        if (!urls[key]) {
            key = "test";
        }

        // console.log("serverKey", key);

        return key;
    },

    getServerUrl: function getServerUrl() {
        var urls = serverUrl.getUrls();

        return urls[AF.platform.getServerKey()];
    },

    getCdnUrl: function getCdnUrl() {
        return AF.platform.getServerUrl().cdn;
    },

    getApiUrl: function getApiUrl() {
        return AF.platform.getServerUrl().api;
    },

    getDisplayVersion: function getDisplayVersion() {
        var num = serverVer.version * 100 + serverVer.hotfix;
        var str = serverVer.displayVersion + " (" + num + ")";
        return str;
    },

    getQueryValue: function getQueryValue(key) {
        if (AF.platform.isWxApp()) {
            return wx.getLaunchOptionsSync().query[key] || "";
        } else {
            var query = AF.util.GetRequest();
            return query[key] || "";
        }
    },

    isHairScreen: function isHairScreen() {
        if (cc.winSize.height / cc.winSize.width >= 2) {
            return true;
        } else {
            return false;
        }
    },

    setKeepScreenOn: function setKeepScreenOn() {
        if (AF.platform.isWxPhone()) {
            wx.setKeepScreenOn({ keepScreenOn: true });
            console.log("wx设置屏幕常亮");
        }
    },

    request: function request(obj) {
        if (obj.method && obj.method === "POST") {
            AF.http.post(obj.url, null, obj.data, function (err, result, status) {
                if (status) {
                    obj.success && obj.success({ data: result, statusCode: status });
                } else {
                    obj.fail && obj.fail({ data: result, statusCode: status });
                }
            });
        } else {
            AF.http.get(obj.url, obj.data, function (err, result, status) {
                if (status) {
                    obj.success && obj.success({ data: result, statusCode: status });
                } else {
                    obj.fail && obj.fail({ data: result, statusCode: status });
                }
            });
        }
    }
};

platform.init();

module.exports = (window.AF = window.AF || {}).platform = platform;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=af-platform.js.map
        