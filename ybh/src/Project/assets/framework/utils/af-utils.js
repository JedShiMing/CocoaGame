const Polyglot = require('polyglot');
let polyInst = null;

const REMOTE_DIR = "remote/";

const wxShareOpen = require('../config/wx/wxShare.js')
const wxVideoAdOpen = require('../config/wx/wxVideoAd.js')
const wxBannerAdOpen = require('../config/wx/wxBannerAd.js')
const qqShareOpen = require('../config/qq/qqShare.js')
const qqVideoAdOpen = require('../config/qq/qqVideoAd.js')
const qqBannerAdOpen = require('../config/qq/qqBannerAd.js')

function initPolyglot(data) {
    if (data) {
        if (polyInst) {
            polyInst.replace(data);
        } else {
            polyInst = new Polyglot({ phrases: data, allowMissing: true });
        }
    }
}

var utils = {
    getSchemeParam: function (url, scheme) {
        var prefix = scheme + '://';
        var str = url.substring(prefix.length);
        var param = {};
        try {
            str = decodeURIComponent(str);
            str = AF.util.base64Decode(str);
            param = JSON.parse(str);
        } catch (e) { }
        return param;
    },

    // 是否是全面屏
    isAllScreen: function () {
        var sz = cc.view.getFrameSize();
        var r = sz.width > sz.height ? sz.width / sz.height : sz.height / sz.width;
        return r > 1.85;
    },

    isLandscape: function () {
        var sz = cc.view.getFrameSize();
        return sz.width > sz.height;
    },

    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },

    gotoGameScene: function (sceneName, params) {
        AF.gotoScene(sceneName, params);
    },
    isZipFile: function (filename) {
        return '' !== AF.util.getZipFilename(filename);
    },
    getZipFilename: function (filename) {
        var leng = filename.length;
        if (leng > 4 && filename.lastIndexOf(".zip") === leng - 4) {
            return filename.substr(0, leng - 4);
        } else {
            return '';
        }
    },
    getFilePath: function (filename) {
        var leng = filename.length;
        var index = filename.lastIndexOf("/");
        if (index >= 1 && index < leng) {
            return filename.substr(0, index);
        } else {
            return '';
        }
    },
    getFramName: function (filename) {
        var leng = filename.length;
        var index = filename.lastIndexOf("/");
        if (index >= 1 && index < leng) {
            return filename.substr(index + 1, leng - index - 1);
        } else {
            return '';
        }
    },
    deepCopy: function (obj, c) {
        var c = c || {};
        for (var key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                if (obj[key].constructor === Array) {
                    c[key] = [];
                } else {
                    c[key] = {};
                }
                AF.util.deepCopy(obj[key], c[key]);
            } else {
                c[key] = obj[key];
            }
        }
        return c;
    },

    spliceByChar: function (str, s) {
        var nums = [];
        while (true) {
            let i = str.indexOf(s);
            if (-1 === i) {
                nums.push(Number(str));
                return nums;
            }
            nums.push(Number(str.substr(0, i)));
            str = str.substr(i + 1, str.length - i);
        }
    },

    replaceAToB: function (str, a, b) {
        b = b || '';
        var re = new RegExp(a, "g");
        return str.replace(re, b);
    },

    parseNums: function (str) {//str {num1,mun2}
        str = AF.util.replaceAToB(str, "{");
        str = AF.util.replaceAToB(str, "}");
        var nums = AF.util.spliceByChar(str, ",");
        return nums;
    },

    createPrefabNode: function (prefab) {
        return cc.instantiate(prefab);
    },

    printTime: function (key) {

        var t = (new Date()).getTime();

        if (this.lastTime) {
            console.log(key, ": ", t, " [", t - this.lastTime, "]");
        } else {
            console.log(key, ": ", t);
        }

        this.lastTime = t;
    },

    getCurrTime: function () {
        return new Date().getTime();
    },

    getCurrTimeOfSecond: function () {
        return Math.round(this.getCurrTime() / 1000);
    },

    queryObject: function (key) {
        AF.GameData.setMyObject(key, false);

        AF.EventDispatcher.emit(AF.Event.QUERY_OBJECT, key);

        var has = AF.GameData.getMyObject(key);

        return has;
    },

    getMinAndSec: function (sec) {
        var minute = 0;

        while (sec >= 60) {
            minute += 1;
            sec -= 60;
        }

        var str = "";

        if (minute < 10) {
            str += "0";
        }

        str += cc.js.formatStr("%d", minute);

        str += ":";

        if (sec < 10) {
            str += "0";
        }

        str += cc.js.formatStr("%d", sec);

        return str;
    },

    formatNumber: function (value) {

        value = Math.floor(value);

        var prefix = "";

        if (value < 0) {
            prefix = "-";
        }

        value = Math.abs(value);

        var strValue = Number(value).toString();
        var suffix = "";
        var strNum = "";
        var strDot = "";

        if (strValue.length >= 7) {
            suffix = "M";
            strNum = strValue.substring(0, strValue.length - 6);
            strDot = strValue.substring(strValue.length - 6, strValue.length - 4);
        } else if (strValue.length >= 5) {
            suffix = "K";
            strNum = strValue.substring(0, strValue.length - 3);
            strDot = strValue.substring(strValue.length - 3, strValue.length - 2);
        } else {
            strNum = strValue;
        }

        if (strDot != "") {
            strNum = strNum + "." + strDot;
        }

        strNum = prefix + strNum;
        strNum = strNum + suffix;

        return strNum;
    },

    //time的单位秒
    formatPastTime: function (seconds) {
        if (seconds > 60 * 60 * 24 * 30) {
            return Math.floor(seconds / (60 * 60 * 24 * 30)) + "月"
        }
        if (seconds > 60 * 60 * 24) {
            return Math.floor(seconds / (60 * 60 * 24)) + "天"
        }
        if (seconds > 60 * 60) {
            return Math.floor(seconds / (60 * 60)) + "小时"
        }
        if (seconds > 60) {
            return Math.floor(seconds / 60) + "分钟"

        }
        if (seconds > 0) {
            return seconds + "秒"
        }
        if (seconds < 0) {
            return (1 + Math.floor(Math.random() * 58)) + "秒"
        }
    },

    //time的单位秒
    formatTimeToHHMMSS: function (seconds) {
        if (seconds > 60 * 60 * 24) {
            return Math.floor(seconds / (60 * 60 * 24)) + "天"
        }
        var ss = 0;
        var mm = 0;
        var hh = 0;
        ss = Math.floor(seconds % 60);
        mm = Math.floor(seconds / 60);
        if (mm > 60) {
            mm = Math.floor(mm % 60);
            hh = Math.floor(seconds / (60 * 60));
        }

        return ('00' + hh).slice(-2) + ':' + ('00' + mm).slice(-2) + ':' + ('00' + ss).slice(-2);
    },
    GetRequest: function () {
        var theRequest = {};
        if (!cc.sys.isNative) {
            var url = location.search; //获取url中"?"符后的字串
            theRequest.href = window.location.href;

            if (url && url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
            }
        }
        return theRequest;
    },

    openDialogOnce: function (name, params, callback) {
        var value = AF.GameData.getDialogOnce(name);
        var now = AF.util.getCurrTime();

        if (value + 1000 > now) {
            if (callback) {
                callback();
            }
            return;
        }

        AF.GameData.setDialogOnce(name);

        AF.openDialog(name, params, function (err, node) {
            callback && callback();
        });
    },

    sortFunc: function (arr, key) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                // var condition =
                if (arr[j][key] < arr[j + 1][key]) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    },

    cutstr: function (str, len) {
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            let a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于len
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                if (i < str_len - 1) {
                    str_cut = str_cut.concat("...");
                }
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
            return str;
        }
    },

    isShareOpen: function () {
        //分享开关打开
        var src = AF.platform.getSrc();

        if (src == "wx") {
            if (AF.platform.isWxApp()) {
                return wxShareOpen;
            }
            else {
                //模拟分享
                return true;
            }
        } else if (src == "qq") {
            if (AF.platform.isQQApp()) {
                return qqShareOpen;
            }
            else {
                //模拟分享
                return true;
            }
        } else {
            return false;
        }
    },

    isBannerAdOpen: function () {
        if (AF.platform.isWxPhone()) {
            return wxBannerAdOpen;
        }
        else if (AF.platform.isQQApp()) {
            return qqBannerAdOpen;
        }

        return false;
    },

    getAdQuery(q) {
        var sb = [];
        for (let k in q) {
            sb.push(k + '=' + q[k])
        }
        return sb.join('&');
    },

    showUserInfoButton: function (left, top, width, height, cb) {
        if (AF.platform.isWxApp()) {
            var systemInfo = AF.platform.getSystemInfo();
            AF.wxHelper.showInfoButton(
                Math.floor((left / cc.winSize.width) * systemInfo.windowWidth),
                Math.floor((top / cc.winSize.height) * systemInfo.windowHeight),
                Math.floor((width / cc.winSize.width) * systemInfo.windowWidth),
                Math.floor((height / cc.winSize.height) * systemInfo.windowHeight),
                cb
            );
        }
    },

    hideUserInfoButton: function () {
        if (AF.platform.isWxApp()) {
            AF.wxHelper.hideInfoButton();
        }
    },

    //分享
    shareAppMessage: function (scene, success, fail, queryData, type, content) {
        if (!AF.util.isShareOpen()) {
            fail && fail();
            return;
        }

        function onSuccess() {
            success && success("success");
            AF.CLOSE_LOADING_LAYER();
        }

        function onFail() {
            fail && fail();
            AF.CLOSE_LOADING_LAYER();
        }

        function simulateShare() {
            if (AF.Random.getChance(50)) {
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } else {
                setTimeout(() => {
                    onFail();
                }, 1000);
            }
        }

        AF.LOADING_LAYER();
        var userInfo = AF.util.getUserInfo();
        queryData = Object.assign({
            sharerOpenId: userInfo.openId,
            sharerNickName: userInfo.nickName,
            sharerAvatarUrl: userInfo.avatarUrl,
        }, queryData);
        var query = {
            type: type || 'share',
            data: JSON.stringify(queryData),
        };
        var queryStr = AF.util.getAdQuery(query);
        if (AF.platform.isWxPhone()) {
            var eventId = AF.wxHelper.shareAppMessage(scene, queryStr);

            if (eventId <= 0) {
                onFail();
                return;
            }

            var _tickHandle;

            function onFetchShareStatus() {
                var status = AF.wxHelper.getShareStatus(eventId);
                console.log('微信分享结果status = ', status, status == 1 ? '成功' : '失败')
                if (status == -1) {
                    clearInterval(_tickHandle);
                    onFail();
                    return;
                }

                if (status == 1) {
                    clearInterval(_tickHandle);
                    onSuccess();
                    return;
                }

                if (status == 2) {
                    clearInterval(_tickHandle);
                    onFail();
                    return;
                }
            }

            _tickHandle = setInterval(onFetchShareStatus, 1000);
            return;
        } else if (AF.platform.isQQApp()) {
            AF.qqHelper.shareAppMessage(scene, onSuccess, onFail, queryStr, content);
        }

        simulateShare();
    },

    isVideoAdOpen: function () {

        if (!AF.platform.isWxApp() && !AF.platform.isQQApp()) {
            return true;
        }

        if (AF.platform.isWxPhone()) {
            return wxVideoAdOpen;
        } else if (AF.platform.isQQApp()) {
            return qqVideoAdOpen;
        } else {
            return false;
        }
    },

    //看视频
    showVideoAd: function (tag, finish) {
        if (!AF.platform.isWxApp() && !AF.platform.isQQApp()) {
            if (AF.Random.getChance(50)) {
                finish && finish(true);
            } else {
                finish && finish(false);
            }

            return;
        }

        if (!AF.util.isVideoAdLoaded()) {
            finish && finish(false);
            return;
        }

        function onFinish(res) {
            finish && finish(res);
        }

        if (AF.platform.isWxPhone()) {
            AF.wxHelper.showVideoAd(tag, onFinish);
        } else if (AF.platform.isQQApp()) {
            AF.qqHelper.showVideoAd(onFinish);
        }
    },

    isVideoAdLoaded: function (tag) {

        if (!AF.platform.isWxApp() && !AF.platform.isQQApp()) {
            return true;
        }

        if (AF.platform.isWxPhone()) {
            return AF.wxHelper.isVideoAdLoaded(tag);
        } else if (AF.platform.isQQApp()) {
            return AF.qqHelper.isVideoAdLoaded();
        }

        return false;
    },

    //Banner广告
    showBannerAd: function (tag) {
        if (!AF.util.isBannerAdOpen()) {
            return;
        }

        if (AF.platform.isQQApp()) {
            AF.qqHelper.showBannerAd();
            return;
        }

        if (!AF.platform.isWxPhone()) {
            return;
        }

        var created = AF.wxHelper.createBannerAd(tag);

        if (!created) {
            return;
        }

        var _tickHandle;

        function onShowBannerAd() {
            var height = AF.wxHelper.getBannerAdHeight(tag);

            if (height <= 0) {
                return;
            }

            clearInterval(_tickHandle);

            AF.wxHelper.moveBannerAd(tag, height);
        }

        _tickHandle = setInterval(onShowBannerAd, 1000);
    },

    hideBannerAd: function (tag) {
        if (AF.platform.isWxPhone()) {
            AF.wxHelper.hideBannerAd(tag);
        } else if (AF.platform.isQQApp()) {
            AF.qqHelper.hideBannerAd();
        }
    },

    upScore: function (data) {
        // var score = data.score;
        // const scoreCount = AF.GameData.getScoreInfo();
        // if (score < scoreCount.best) {
        //     return;
        // }
        if (AF.platform.isWxApp()) {
            AF.wxHelper.upScore(data);
        } else if (AF.platform.isQQApp()) {
            AF.qqHelper.upScore(data);
        }
    },

    postMessage: function (cmd, data) {
        if (AF.platform.isWxApp()) {
            AF.wxHelper.postMessage(cmd, data);
        }
    },

    getRankList: function (cb) {
        if (AF.platform.isWxApp()) {
            // AF.wxHelper.data(data);
        } else if (AF.platform.isQQApp()) {
            return AF.qqHelper.getRankList(cb)
        } else {
            let nickName = [
                '送舟行', '狂奔蜗牛', '献世礼', '庸颜', '违心', '↘锁芯ラ', '枝桠',
                '实习生', '半衾梦', '舟遥客', '書生', '满栀', '遮云壑', '枕花眠',
                '暗中', '盗琴', '佞臣', '世佛', '孤凫', '三生路', '赠佳期',
            ];
            let rankList = [];
            let length = Math.ceil(20 * Math.random());
            let selfFlag = Math.floor(length * Math.random());
            for (let i = 1; i <= length; i++) {
                let playerInfo = {
                    url: 'https://res.pixel08.com/robot/' + (100 + i) + '.jpg',
                    nick: nickName[i],
                    score: 5 + (i - 1) * 100,
                    selfFlag: false,
                };
                rankList.push(playerInfo);
            }
            rankList[selfFlag].selfFlag = true;
            cb && cb(rankList.reverse());
        }
    },

    getMyUserInfo: function () {
        var data = {}

        if (AF.platform.isQQApp()) {
            data.qq = AF.qqHelper.getUserInfo();
        }

        return data;
    },

    setButtonInteractable: function (node, flag, specialButton) {
        var btns = node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btns.length; i++) {
            if (specialButton && specialButton === btns[i]) {
                continue;
            }
            btns[i].interactable = flag;
        }

    },

    checkShareMsg: function (msg) {
        if ('exceedTheLimit' === msg) {
            AF.ToastMessage.show("【同一个群一天只能分享一次】");
            return false;
        } else if ('notGroup' === msg) {
            AF.ToastMessage.show("【分享到群后解锁】");
            return false;
        } else if ('exceedTheDayLimit' === msg) {
            AF.ToastMessage.show("【今天的分享额度已经用完！】");
            return false;
        }
        return true;
    },

    getText: function (key, opt, defaultStr) {
        if (!polyInst) {
            initPolyglot(AF.GameConfig.getTextData());
        }

        let has = polyInst.has(key);
        if (!has) {
            return defaultStr ? defaultStr : '';
        }
        return polyInst.t(key, opt);
    },

    getStorage: function (key) {
        if (AF.platform.isWxApp()) {
            return AF.wxHelper.getStorage(key);
        } else if (AF.platform.isQQApp()) {
            return AF.qqHelper.getStorage(key);
        } else {
            return cc.sys.localStorage.getItem(key);
        }
    },

    setStorage: function (key, value) {
        if (AF.platform.isWxApp()) {
            AF.wxHelper.setStorage(key, value);
        } else if (AF.platform.isQQApp()) {
            AF.qqHelper.setStorage(key, value);
        } else {
            cc.sys.localStorage.setItem(key, value);
        }
    },

    setClipboardData: function (str) {
        if (AF.platform.isWxApp()) {
            AF.wxHelper.setClipboardData(str);
            return;
        }
    },

    requestServerApi: function (api, data, success, fail) {
        api = api || "";
        data = data || {};

        var url = AF.platform.getApiUrl();
        url += api;
        data.ts = new Date().getTime();

        var obj = {};
        obj.url = url;
        obj.data = data;
        obj.success = success;
        obj.fail = fail;

        if (AF.platform.isWxApp()) {
            AF.wxHelper.request(obj);
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

    getMoveTime: function (distance, velocity, acceleration) {
        // var distance = Math.abs(distance);
        if (0 === distance) {
            return 0;
        }
        if (0 === acceleration) {
            if (0 === velocity) {
                return 0;
            }
            return Math.abs(distance / velocity);
        }
        if ((velocity * velocity + 2 * acceleration * distance) < 0) {
            return NaN;
        }
        var t1 = (-velocity + (Math.sqrt(velocity * velocity + 2 * acceleration * distance))) / (acceleration);
        var t2 = (-velocity - (Math.sqrt(velocity * velocity + 2 * acceleration * distance))) / (acceleration);
        if (t1 < 0 && t2 < 0) {
            return NaN;
        } else if (t1 > 0 && t2 > 0) {
            return Math.min(t1, t2);
        }
        return Math.max(t1, t2);
    },

    getDestination: function (posY, velocity, acceleration, time) {
        return posY + velocity * time + 0.5 * acceleration * time * time;
    },

    login: function (success, fail) {
        var openId = AF.util.guid();
        if (AF.platform.isWxApp()) {
            AF.wxHelper.login(success, fail);
        } else if (AF.platform.isQQApp()) {
            openId = GameStatusInfo.openId;
            AF.util.setStorage('openId', openId);
            success(openId);
        } else {
            AF.util.setStorage('webOpenId', openId);
            success(openId);
        }
    },

    getUserInfo: function () {
        var userInfo;

        if (AF.platform.isWxApp()) {
            userInfo = AF.wxHelper.getUserInfo();
        } else if (AF.platform.isQQApp()) {
            userInfo = AF.qqHelper.getUserInfo();
        } else {
            userInfo = {
                openId: AF.util.getStorage('webOpenId') || "",
                nickName: AF.util.getStorage('webNickName') || "",
                avatarUrl: AF.util.getStorage('webAvatarUrl') || "",
            };
        }
        return userInfo;
    },

    /*getAvatarUrl: function (openId, cb) {
        if (AF.platform.isQQApp()) {
            AF.qqHelper.getAvatarUrl(openId, cb);
            return;
        }
        else if (AF.platform.isWxApp()) {
            userInfo = AF.wxHelper.getUserInfo(cb);
        } else {

        }
        var userInfo = {
            openId: AF.util.getStorage('openId'),
            nickName: AF.util.getStorage('nickName'),
            avatarUrl: AF.util.getStorage('avatarUrl'),
        };

        cb(openId, userInfo.avatarUrl);
    },*/

    getShareUserInfo: function (cb) {
        var shareInfo = AF.util.getShareInfo();
        if (!shareInfo) {
            cb('Sharer information is null!', shareInfo);
            return;
        }
        if (AF.platform.isWxApp()) {
            shareInfo = AF.wxHelper.getShareInfo();
            cb(null, shareInfo);
        } else if (AF.platform.isQQApp()) {
            AF.qqHelper.getAvatarUrl(openId, function (openId, avatarUrl) {
                if (openId !== shareInfo['sharerOpenId']) {
                    cb('Sharer avatarurl is null!', shareInfo);
                    return;
                }
                shareInfo['shareravatarurl'] = avatarUrl;
                if (sharerNickName) {
                    cb(null, shareInfo);
                    return;
                }
                AF.qqHelper.getNickName(openId, function (openId, nickName) {
                    if (openId !== shareInfo['sharerOpenId']) {
                        cb('Sharer nickName is null!', shareInfo);
                        return;
                    }
                    shareInfo['sharerNickName'] = nickName;
                    cb(null, shareInfo);
                    return;
                });
            });
        } else {
            cb(null, shareInfo);
        }
    },

    getShareInfo: function () {
        var shareInfo = null;
        if (AF.platform.isWxApp()) {
            shareInfo = AF.wxHelper.getShareInfo();
        } else if (AF.platform.isQQApp()) {
            shareInfo = AF.qqHelper.getShareInfo();
        } else {
            shareInfo = null;
        }
        return shareInfo;
    },

    getMusicUrl: function (filename) {
        var name = "sfx/music/" + filename + ".mp3";

        if (AF.util.isLocalFileExist(name)) {
            return AF.util.getLocalFilePath(name);
        } else {
            return AF.util.getRemoteUrl(name);
        }
    },

    getSoundUrl: function (filename) {
        var name = "sfx/sound/" + filename + ".mp3";

        if (AF.util.isLocalFileExist(name)) {
            return AF.util.getLocalFilePath(name);
        } else {
            return AF.util.getRemoteUrl(name);
        }
    },

    isSoundExist: function (filename) {
        var name = "sfx/sound/" + filename + ".mp3";

        return AF.util.isLocalFileExist(name);
    },

    getRemoteUrl: function (filename) {
        var url = AF.platform.getCdnUrl() + REMOTE_DIR + filename;
        url += "?ts=" + (new Date()).getTime();
        return url;
    },

    isLocalFileExist: function (filename) {
        return AF.util.isLocalFileExist2(REMOTE_DIR + filename);
    },

    isLocalFileExist2: function (filename) {
        var localPath = AF.util.getLocalFilePath2(filename);

        if (AF.platform.isWxApp()) {
            var fs = wx.getFileSystemManager();
            var ret = false;
            try {
                if (fs.accessSync(localPath)) {
                    ret = false;
                } else {
                    ret = true;
                }
            } catch (err) {
                console.log("isLocalFileExist2 err ", err);
                ret = false;
            }
            return ret;
        } else if (AF.platform.isQQApp()) {
            return BK.fileSystem.accessSync(localPath);
        } else {
            return false;
        }
    },

    getLocalFilePath: function (filename) {
        return AF.util.getLocalFilePath2(REMOTE_DIR + filename);
    },

    getLocalFilePath2: function (filename) {
        if (AF.platform.isWxApp()) {
            return wx.env.USER_DATA_PATH + '/' + filename;
        } else if (AF.platform.isQQApp()) {
            return "GameSandBox://" + filename;
        } else {
            return filename;
        }
    },

    makesureLocalPath: function (filename) {
        filename = REMOTE_DIR + filename;
        return AF.util.makesureLocalPath2(filename);
    },

    makesureLocalPath2: function (filename) {
        if (filename.length <= 1) {
            return true;
        }
        var index = filename.lastIndexOf('/');
        if (index < 0 || index >= filename.length) {
            return true;
        }
        function mkDir(path) {
            if (!AF.util.isLocalFileExist2(path)) {
                var localPath = AF.util.getLocalFilePath2(path);
                if (AF.platform.isWxApp()) {
                    try {
                        var fs = wx.getFileSystemManager();
                        fs.mkdirSync(localPath, true);
                    } catch (err) {
                        console.log("mkDir:", err);
                    }
                }
                else if (AF.platform.isQQApp()) {
                    BK.fileSystem.makeDirSync(localPath);
                }
            }
            return AF.util.isLocalFileExist2(path);
        }
        var dirPath = filename.substr(0, index);
        var dirArr = dirPath.split('/');
        var path = '';
        for (let i = 0; i < dirArr.length; i++) {
            if (i > 0) {
                path += '/';
            }
            path += dirArr[i];
            if (!mkDir(path)) {
                return false;
            }
        }
        return true;
    },

    saveLocalFile: function (srcFile, dstFile) {
        if (AF.platform.isWxApp()) {
            var fs = wx.getFileSystemManager();
            fs.saveFileSync(srcFile, dstFile);
        } else if (AF.platform.isQQApp()) {
            BK.fileSystem.copyFileSync(srcFile, dstFile);
        }
    },

    copyLocalFile: function (srcFile, dstFile) {
        if (AF.platform.isWxApp()) {
            var fs = wx.getFileSystemManager();
            fs.copyFileSync(srcFile, dstFile);
        } else if (AF.platform.isQQApp()) {
            BK.fileSystem.copyFileSync(srcFile, dstFile);
        }
    },

    checkShareGift() {
        let shareInfo = AF.util.getShareInfo()
        console.log('分享信息111', JSON.stringify(shareInfo || {}))
        if (shareInfo && shareInfo.gift) {
            try {
                shareInfo.gift = JSON.parse(shareInfo.gift)
            } catch (e) {
                console.log('分享信息json解析失败');
            }
            console.log('分享信息222', JSON.stringify(shareInfo.gift || {}))

            let playerData = AF.GameData.getMyPlayerData();
            if (playerData && playerData.giftTag === shareInfo.gift.giftTag) {
                if (!playerData.gold) {
                    playerData.gold = 600
                } else {
                    playerData.gold += 600
                }
                playerData.giftTag = ''
                AF.GameData.savePlayerData(playerData);
                AF.ToastMessage.show('获取分享双倍奖励，600金币');
                AF.EventDispatcher.emit('GoldRefresh');
            }
        }
    },
};

var AF = window.AF = window.AF || {};
AF.util = AF.util || {};
cc.js.mixin(AF.util, utils);


module.exports = utils;