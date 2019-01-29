
"use strict";

var self;

var videoAdObj = {
    videoAd: null,
    status: 0,
};

var bannerAd = null;

var infoButton;

self = module.exports = AF.qqHelper = {
    init: function (isVideoAdOpen) {
        if (isVideoAdOpen) {
            self.createVideoAd();
        }

        self.userInfo = {
            openId: self.getStorage('qqOpenId'),
            nickName: self.getStorage('qqNickName') || '',
            avatarUrl: self.getStorage('qqAvatarUrl') || '',
        };

        self.shareInfo = {

        };
        
        self.userInfo.openId = GameStatusInfo.openId;
        self.setStorage('qqOpenId', self.userInfo.openId);
        self.getNickName(self.userInfo.openId, function (openId, nickName) {
            if(openId !== self.userInfo.openId){
                return;
            }
            self.userInfo.nickName = nickName;
            self.setStorage('qqNickName', self.userInfo.nickName);
        });
        self.getAvatarUrl(self.userInfo.openId, function (openId, avatarUrl) {
            if(openId !== self.userInfo.openId){
                return;
            }
            self.userInfo.avatarUrl = avatarUrl;
            self.setStorage('qqAvatarUrl', self.userInfo.avatarUrl);
        });

        BK.onEnterBackground(() => {
            BK.Console.log('onEnterBackground ');
            self.onEnterBackground();
        });

        BK.onEnterForeground(() => {
            BK.Console.log('onEnterForeground ');
            self.onEnterForeground();
        });

        self._getShareInfo();
        
    },
    
    onEnterBackground: function (app) {
        BK.Console.log('游戏进入后台');
    },

    onEnterForeground: function (app) {
        BK.Console.log('游戏进入前台');
        self._getShareInfo();
    },

    _getShareInfo: function () {
        var type = NaN;
        var data = '';
        var str = GameStatusInfo.gameParam;
        BK.Console.log('分享信息 gameParam', str);
        if (!str) {
            self.setShareInfo(type, data);
            return;
        }
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            let key = strs[i].split("=")[0];
            if ('type' === key) {
                type = (strs[i].split("=")[1]);
            } else if ('data' === key) {
                data = strs[i].split("=")[1]
            }
        }
        self.setShareInfo(type, data);

    },

    getShareInfo: function () {
        return self.shareInfo;
    },

    setShareInfo: function (type, data) {
        self.shareInfo = {};
        if (type && data) {
            self.shareInfo[type] = data;
        }
    },

    getStorage: function (key) {
        return BK.localStorage.getItem(key);
    },

    setStorage: function (key, value) {
        BK.localStorage.setItem(key, value);
    },

    shareAppMessage: function (scene, onSuccess, onFail, extendInfo, content) {

        var is_success = false;

        BK.Share.share({
            qqImgUrl: 'http://manager.pixel08.com/api/public/uploads/c8bc86484b28748830bf1a30b43385951534220948325.jpg',
            isToFriend: true,
            summary: (content && content.summary) || 'O(∩_∩)O，我跳了90分，我打赌你肯定超不过我',
            extendInfo: extendInfo,
            success: function (succObj) {
                BK.Console.log('分享成功', succObj.code, JSON.stringify(succObj.data));
                is_success = true;
            },
            fail: function (failObj) {
                BK.Console.log('分享失败', failObj.code, JSON.stringify(failObj.msg));
            },
            complete: () => {
                BK.Console.log('分享完成，不论成功失败');
                if (is_success) {
                    onSuccess();
                } else {
                    onFail();
                }
            }
        });
    },

    createVideoAd: function () {
        var obj = videoAdObj;

        if (obj.videoAd) {
            return;
        }

        if (obj.status != 0) {
            return;
        }

        obj.videoAd = BK.Advertisement.createVideoAd();
        obj.status = 1;

        obj.videoAd.onLoad(function () {
            obj.status = 2;
        });

        obj.videoAd.onError(function (err) {
            obj.videoAd = null;
            obj.status = 0;

            self.createVideoAd();
        });

        obj.videoAd.onPlayFinish(function () {
            obj.status = 4;
        });
    },

    showVideoAd: function (onFinish) {
        if (!self.isVideoAdLoaded()) {
            return;
        }

        AF.audio.onGameEnterBackground();

        var obj = videoAdObj;

        obj.status = 3;

        obj.videoAd.onClose(function () {
            // 用户点击了【关闭广告】按钮
            // 开启声音 
            AF.audio.onGameEnterForeground();

            onFinish(obj.status == 4);

            obj.videoAd = null;
            obj.status = 0;

            self.createVideoAd();
        });

        obj.videoAd.show();
    },

    isVideoAdLoaded: function () {
        var obj = videoAdObj;

        if (!obj.videoAd) {
            return false;
        }

        if (obj.status != 2) {
            return false;
        }

        return true;
    },

    showBannerAd: function () {

        if (true) {
            return;
        }

        if (bannerAd) {
            return;
        }

        bannerAd = BK.Advertisement.createBannerAd({
            viewId:1001,
        });

        bannerAd.onLoad(function () {
            AF.ToastMessage.show("onLoad");
            bannerAd.show();
        });
    },

    hideBannerAd: function () {

    },

    upScore:function({startTime,endTime,score}) {
        BK.Script.logToConsole = 1
        BK.Script.log(1,1,'上传分数' + JSON.stringify({startTime,endTime,score}));
        var data = {
            userData: [
                {
                    openId: GameStatusInfo.openId,
                    startMs: startTime.toString(),    //必填，游戏开始时间，单位为毫秒，字符串类型
                    endMs: endTime.toString(),  //必填，游戏结束时间，单位为毫秒，字符串类型
                    scoreInfo: {score},
                },
            ],
            attr: {
                score: {
                    type: 'rank',
                    order: 1,
                },
            },
        };
        BK.QQ.uploadScoreWithoutRoom(1, data, function(errCode, cmd, data) {
            // 返回错误码信息
            if (errCode !== 0) {
                BK.Script.log(1,1,'上传分数失败!错误码：' + errCode);
            }
            BK.Script.log(1,1,"上传分数" + cmd + " errCode:" + errCode + "  data:" + JSON.stringify(data));
        });
    },
    // 排行榜
    getRankList: function(cb){
        var attr = "score";//使用哪一种上报数据做排行，可传入score，a1，a2等
        var order = 1;     //排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
        var rankType = 0; //要查询的排行榜类型，0: 好友排行榜
        // 必须配置好周期规则后，才能使用数据上报和排行榜功能
        BK.QQ.getRankListWithoutRoom(attr, order, rankType, function(errCode, cmd, data) {
            // 返回错误码信息
            if (errCode !== 0) {
                BK.Script.log(1,1,'获取排行榜数据失败!错误码：' + errCode);
                cb()
                return
            }
            // 解析数据
            if (data) {
                cb(data.data.ranking_list)
                return
            }
            cb()
        });
    },

    getUserInfo: function () {
        return self.userInfo;
    },

    getNickName: function (openId, cb) {
        BK.MQQ.Account.getNick(openId, (currOpenId, nickName) => {
            cb && cb(currOpenId, nickName);
        });
    },

    getAvatarUrl: function (openId, cb) {
        BK.MQQ.Account.getHeadEx(openId, (currOpenId, avatarUrl) => {
            cb && cb(currOpenId, avatarUrl);
        });
    },
}