(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/platform/af-wx-helper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0391fr7FKlEx4lxfRHbhnDk', 'af-wx-helper', __filename);
// framework/platform/af-wx-helper.js


"use strict";

var self;

var videoConfig = {
    power: {
        adUnitId: 'adunit-b8725e85334ae519'
    },
    unlock: {
        adUnitId: 'adunit-591765348646c1a1'
    },
    openbox: {
        adUnitId: 'adunit-35001cd5627726da'
    },
    friend: {
        adUnitId: 'adunit-d3b7efcbbc23a0bb'
    },
    castle: {
        adUnitId: 'adunit-feb26727984a74e3'
    }
};

var bannerConfig = {
    main: {
        adUnitId: 'adunit-01e7fa530d116c13'
    },
    battle: {
        adUnitId: 'adunit-51e4a64bbcb539f8'
    }
};

var shareTemplates;

var infoButton;

var startShareInfo = {};

self = module.exports = AF.wxHelper = {

    init: function init(isWxPhone, isVideoAdOpen) {

        self.lastShareEventId = 0;

        self.userInfo = {
            openId: self.getStorage('wxOpenId'),
            nickName: self.getStorage('wxNickName') || '要上天啦你',
            avatarUrl: self.getStorage('wxAvatarUrl') || ''
            // avatarUrl: self.getStorage('avatarUrl') || 'https://res.pixel08.com/robot/10000.jpg',
        };

        // self.shareInfo = startShareInfo


        self.initShareData();

        if (isWxPhone && isVideoAdOpen) {
            self.loadAllVideoAds();
        }

        wx.showShareMenu({
            withShareTicket: true
        });

        wx.onShareAppMessage(function () {
            return {
                title: "要上天啦你",
                imageUrl: "http://manager.pixel08.com/api/public/uploads/c8bc86484b28748830bf1a30b43385951534220948325.jpg",
                query: ""
            };
        });
    },

    initShareData: function initShareData() {
        self.shareData = {
            id: 0,
            status: 0,
            time: 0
        };
    },

    onShow: function onShow(res) {
        if (self.shareData && self.shareData.id > 0) {
            if (self.shareData.status != 0) {
                self.initShareData();
            } else {
                var now = new Date().getTime();
                if (now >= self.shareData.time + 3000) {
                    self.shareData.status = 1;
                } else {
                    self.shareData.status = 2;
                }
            }
        }
        console.log('微信onshowwwwwwww', res.query['type'], res.query['data']);
        var type = res.query['type'];
        var data = res.query['data'];
        self.setShareInfo(type, data);
        // res.scene && (self.shareInfo.scene = res.scene);
        // res.shareTicket && (self.shareInfo.scene = res.shareTicket);
        // res.query['sharerOpenId'] && (self.shareInfo.sharerOpenId = res.query['sharerOpenId']);
        // res.query['sharerNickName'] && (self.shareInfo.sharerNickName = res.query['sharerNickName']);
        // res.query['sharerAvatarUrl'] && (self.shareInfo.sharerAvatarUrl = res.query['sharerAvatarUrl']);
        // res.query['score'] && (self.shareInfo.score = res.query['score']);
        // console.warn('分享者信息', self.shareInfo);
    },

    onHide: function onHide(res) {},

    getShareInfo: function getShareInfo() {
        return self.shareInfo;
    },

    setShareInfo: function setShareInfo(type, data) {
        console.log('设置分享内容', type, data);

        self.shareInfo = {};
        if (type && data) {
            console.log('设置分享内容', type, data);

            self.shareInfo[type] = data;
        }
    },

    getShareStatus: function getShareStatus(eventId) {
        if (eventId != self.shareData.id) {
            return -1;
        }

        return self.shareData.status;
    },

    getStorage: function getStorage(key) {
        return wx.getStorageSync(key);
    },

    setStorage: function setStorage(key, value) {
        wx.setStorageSync(key, value);
    },

    setClipboardData: function setClipboardData(str) {
        wx.setClipboardData({ data: str });
    },

    shareAppMessage: function shareAppMessage(scene, query) {

        self.initShareData();

        /*
        if (!shareTemplates) {
            onFail();
            return;
        }
          if (!shareTemplates[scene]) {
            onFail();
            return;
        }
          var len = shareTemplates[scene].length;
          if (len <= 0) {
            onFail();
            return;
        }
          var idx = 0;
          if (len > 1) {
            idx = Math.floor(len * Math.random());
        }
        */

        self.lastShareEventId++;
        self.shareData.id = self.lastShareEventId;
        self.shareData.status = 0;
        self.shareData.time = new Date().getTime();

        wx.shareAppMessage({
            title: "哈哈哈",
            imageUrl: "http://manager.pixel08.com/api/public/uploads/c8bc86484b28748830bf1a30b43385951534220948325.jpg",
            query: query
        });

        return self.shareData.id;
    },

    createBannerAd: function createBannerAd(tag) {
        if (!bannerConfig[tag]) {
            return false;
        }

        if (bannerConfig[tag].bannerAd) {
            return true;
        }

        var systemInfo = AF.platform.getSystemInfo();

        var w = cc.winSize.width;

        if (AF.platform.isHairScreen()) {
            w = Math.floor(cc.winSize.width * 0.6);
        }

        var width = w / cc.winSize.width;

        bannerConfig[tag].bannerAd = wx.createBannerAd({
            adUnitId: bannerConfig[tag].adUnitId,
            style: {
                left: 0,
                top: systemInfo.windowHeight,
                width: Math.floor(width * systemInfo.windowWidth)
            }
        });

        bannerConfig[tag].bannerAd.show();
        bannerConfig[tag].res = null;

        bannerConfig[tag].bannerAd.onResize(function (res) {
            bannerConfig[tag].res = res;
            bannerConfig[tag].bannerAd.style.left = Math.floor((systemInfo.windowWidth - res.width) / 2);
        });

        return true;
    },

    hideBannerAd: function hideBannerAd(tag) {
        if (!bannerConfig[tag]) {
            return;
        }

        if (bannerConfig[tag].bannerAd) {
            bannerConfig[tag].bannerAd.destroy();
            bannerConfig[tag].bannerAd = null;
            bannerConfig[tag].res = null;
        }
    },

    moveBannerAd: function moveBannerAd(tag, y) {
        if (!bannerConfig[tag]) {
            return;
        }

        var systemInfo = AF.platform.getSystemInfo();

        var top = (cc.winSize.height - y) / cc.winSize.height;

        if (bannerConfig[tag].bannerAd) {
            bannerConfig[tag].bannerAd.style.top = Math.floor(top * systemInfo.windowHeight);
        }
    },
    getBannerAdHeight: function getBannerAdHeight(tag) {
        if (!bannerConfig[tag]) {
            return 0;
        }

        if (!bannerConfig[tag].bannerAd) {
            return 0;
        }

        if (!bannerConfig[tag].res) {
            return 0;
        }

        var systemInfo = AF.platform.getSystemInfo();

        var height = Math.floor(bannerConfig[tag].res.height / systemInfo.windowHeight * cc.winSize.height);

        if (AF.platform.isHairScreen()) {
            height += 40;
        }

        return height;
    },
    showInfoButton: function showInfoButton(left, top, width, height, cb) {

        console.log("showInfoButton", left, top, width, height);

        if (infoButton) {
            return;
        }

        var systemInfo = AF.platform.getSystemInfo();
        infoButton = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#ff000000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });

        if (!infoButton) {
            return;
        }

        infoButton.onTap(function (res) {
            if (res.userInfo) {
                self.userInfo.nickName = res.userInfo.nickName;
                self.userInfo.avatarUrl = res.userInfo.avatarUrl;

                self.setStorage('wxNickName', self.userInfo.nickName);
                self.setStorage('wxAvatarUrl', self.userInfo.avatarUrl);
                cb && cb(self.userInfo);
            }
        });
    },
    hideInfoButton: function hideInfoButton() {
        if (infoButton) {
            infoButton.destroy();
            infoButton = null;
        }
    },

    loadAllVideoAds: function loadAllVideoAds() {
        for (var tag in videoConfig) {
            self.createVideoAd(tag);
        }
    },

    createVideoAd: function createVideoAd(tag) {
        var obj = videoConfig[tag];

        if (obj.videoAd) {
            return;
        }

        obj.videoAd = wx.createRewardedVideoAd({
            adUnitId: obj.adUnitId
        });

        obj.adLoaded = false;

        obj.videoAd.onLoad(function () {
            obj.adLoaded = true;
            console.log('激励视频 广告加载成功');
        });

        obj.videoAd.onError(function (err) {
            console.log('激励视频 广告加载失败，重新加载');
            obj.videoAd.load();
        });
    },

    showVideoAd: function showVideoAd(tag, onFinish) {
        if (!self.isVideoAdLoaded(tag)) {
            return;
        }

        // 关闭声音
        AF.audio.onGameEnterBackground();

        var obj = videoConfig[tag];

        obj.videoAd.onClose(function (res) {
            // 用户点击了【关闭广告】按钮

            // 开启声音
            AF.audio.onGameEnterForeground();

            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (!res || res.isEnded) {
                // 正常播放结束，可以下发游戏奖励
                onFinish(true);
            } else {
                // 播放中途退出，不下发游戏奖励
                onFinish(false);
            }

            obj.videoAd.offClose();
            obj.videoAd.load();
        });

        obj.adLoaded = false;
        obj.videoAd.show();
    },

    isVideoAdLoaded: function isVideoAdLoaded(tag) {
        if (!videoConfig[tag]) {
            return false;
        }

        return videoConfig[tag].adLoaded === true;
    },

    request: function request(obj) {
        var result;
        var status;

        wx.request({
            url: obj.url,
            data: obj.data,
            success: function success(res) {
                status = res.statusCode;
                result = res.data;
            },
            fail: function fail(res) {
                status = res.statusCode;
                result = res.data;
            },
            complete: function complete() {
                if (result && status == 200) {
                    obj.success && obj.success({ data: result, statusCode: status });
                } else {
                    obj.fail && obj.fail({ data: result, statusCode: status });
                }
            }
        });
    },

    getUserInfo: function getUserInfo() {
        return self.userInfo;
    },

    login: function login(success, fail, complete) {
        var onLoginSucc = function onLoginSucc(res) {
            if (res.code) {
                success && success(res.code);
                // success(self.guid());
                // var wxcode = res.code;
                // var authUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${config['wx.appId']}&secret=${config['wx.secret']}&js_code=${wxcode}&grant_type=authorization_code`;
                // // 发起网络请求
                // wx.request({
                //     url: authUrl,
                //     data: null,
                //     success: (res) => {
                //         console.error('获取 openid 成功' + res);
                //         var openid = res.data.openid;
                //         wx.setStorageSync('openId', openid);
                //         success && success(openid);
                //     },
                //     fail: (err) => {
                //         console.error('获取 openid 失败' + err);
                //         fail && fail('获取 openid 失败');
                //     },
                //     complete: complete,
                // });
            } else {
                console.error('登录失败' + err.errMsg);
                fail && fail('登录失败');
            }
        };

        var onLoginFail = function onLoginFail(err) {
            console.error('登录失败', err.errMsg);
            fail && fail('登录失败');
        };

        wx.login({
            timeout: 10000,
            success: onLoginSucc,
            fail: onLoginFail,
            complete: complete
        });
    },

    upScore: function upScore(data) {
        wx.setUserCloudStorage({
            KVDataList: [{ key: "score", value: JSON.stringify(data) }]
        });
    },

    postMessage: function postMessage(cmd, data) {
        wx.getOpenDataContext().postMessage({
            cmd: cmd,
            data: data
        });
    }
};

if (window.wx !== undefined) {
    wx.onShow(function (res) {
        self.onShow(res);
    });

    wx.onHide(function (res) {
        self.onHide(res);
    });
}

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
        //# sourceMappingURL=af-wx-helper.js.map
        