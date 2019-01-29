/**
 * 设备平台相关的
 */

var serverKey = require('../config/serverKey.js')
var serverVer = require('../config/serverVer.js')
var serverUrl = require('../config/serverUrl.js')

var platform = {
    init: function () {
        this.WX_GAME_ENV = false;       //微信平台
        this.WX_GAME_DEVTOOLS = false;  //微信模拟器
        this.QQ_GAME_ENV = false;       //QQ平台

        if ('undefined' !== typeof (wx)) {
            this.WX_GAME_ENV = true;

            var info =  wx.getSystemInfoSync();

            if (info.platform == "devtools") {
                this.WX_GAME_DEVTOOLS = true;
            }
        } else if ('undefined' !== typeof (BK)) {
            this.QQ_GAME_ENV = true;
        }

        this.isStart = false;
    },

    start: function (isVideoAdOpen) {
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

    getSrc: function () {
        return AF.platform.getServerUrl().src;
    },

    isWxApp: function () {
        return AF.platform.WX_GAME_ENV;
    },

    isQQApp: function () {
        return AF.platform.QQ_GAME_ENV;
    },

    isWxPhone: function () {
        if (AF.platform.WX_GAME_ENV && !AF.platform.WX_GAME_DEVTOOLS) {
            return true;
        } else {
            return false;
        }
    },

    getSystemInfo: function () {
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

    getServerKey: function () {
        var key =  AF.platform.getQueryValue("server") || serverKey;
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

    getServerUrl: function () {
        var urls = serverUrl.getUrls();

        return urls[AF.platform.getServerKey()];
    },

    getCdnUrl: function () {
        return AF.platform.getServerUrl().cdn;
    },

    getApiUrl: function () {
        return AF.platform.getServerUrl().api;
    },

    getDisplayVersion: function () {
        var num = serverVer.version * 100 + serverVer.hotfix;
        var str = serverVer.displayVersion + " (" + num + ")";
        return str;
    },

    getQueryValue: function (key) {
        if (AF.platform.isWxApp()) {
            return wx.getLaunchOptionsSync().query[key] || "";
        } else {
            var query = AF.util.GetRequest();
            return query[key] || "";
        }
    },

    isHairScreen: function () {
        if (cc.winSize.height / cc.winSize.width >= 2) {
            return true;
        } else {
            return false;
        }
    },

    setKeepScreenOn: function () {
        if (AF.platform.isWxPhone()) {
            wx.setKeepScreenOn({ keepScreenOn: true });
            console.log("wx设置屏幕常亮");
        }
    },

    request: function (obj) {
        if (obj.method && obj.method === "POST") {
            AF.http.post(obj.url, null, obj.data, (err, result, status) => {
                if (status) {
                    obj.success && obj.success({ data: result, statusCode: status });
                } else {
                    obj.fail && obj.fail({ data: result, statusCode: status });
                }
            });
        } else {
            AF.http.get(obj.url, obj.data, (err, result, status) => {
                if (status) {
                    obj.success && obj.success({ data: result, statusCode: status });
                } else {
                    obj.fail && obj.fail({ data: result, statusCode: status });
                }
            });
        }
    },
};

platform.init();

module.exports = (window.AF = window.AF || {}).platform = platform;