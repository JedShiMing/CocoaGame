/**
 * 游戏配置
 */

var GameData = {

    init: function () {
        this.userId = "";          //我的uid
        this.userName = "";        //我的微信名
        this.headUrl = "";         //我的头像Url
        this.time = { remote: 0, local: 0 };

        this.players = [];
        this.player_index = {};

        this.myObjects = {};
        this.dialogOnce = {};
    },

    getDialogOnce: function (key) {
        if (this.dialogOnce[key]) {
            return this.dialogOnce[key];
        } else {
            return 0;
        }
    },

    setDialogOnce: function (key) {
        this.dialogOnce[key] = AF.util.getCurrTime();
    },

    initDialogOnce: function () {
        this.dialogOnce = {};
    },

    initGold: function () {
        AF.EventDispatcher.emit(AF.Event.USER_INFO_UPDATE);
    },

    setMyObject: function (key, data) {
        this.myObjects[key] = data;
    },

    getMyObject: function (key) {
        return this.myObjects[key];
    },

    setTime: function (remoteTime) {
        this.time.remote = Math.floor(remoteTime / 1000);
        this.time.local = AF.util.getCurrTimeOfSecond();
    },

    getServerTime: function () {
        var d = 0;
        var localTime = AF.util.getCurrTimeOfSecond();
        if (localTime > this.time.local) {
            d = localTime - this.time.local;
        }
        return this.time.remote + d;
    },

    getPastTime: function (remoteTime) {

        var currentTime = AF.GameData.getServerTime();
        if (currentTime <= remoteTime) {
            return 0;
        }

        return currentTime - remoteTime;
    },

    setUserId: function (userId) {
        this.userId = userId;
    },

    getUserId: function () {
        return this.userId;
    },

    setUserName(userName) {
        this.userName = userName;
    },

    getUserName: function () {
        return this.userName;
    },

    setHeadUrl: function (headUrl) {
        this.headUrl = headUrl;
    },

    getHeadUrl: function () {
        return this.headUrl;
    },

    getMyPlayerData: function () {
        if (this.playerData) {
            return this.playerData;
        }

        this.playerData = {
            // preScore: 0,//存储当前分数
            // playCount: 0,//存储次数
            // totalScore: 0,//存储总分数
            // bestScore: 0,//存储最高分
            pointId: 0,
            gold: 0,
        };
        var playerDataStr = AF.util.getStorage('player_data');
        if (playerDataStr) {
            this.playerData = JSON.parse(playerDataStr);
        }
        return this.playerData;
    },

    setMyPlayerData: function (playerData) {
        this.playerData = playerData;
    },

    savePlayerData: function () {
        let playerDataStr = JSON.stringify(this.playerData);
        AF.util.setStorage("player_data", playerDataStr);
    },
};

GameData.init();

AF.GameData = module.exports = GameData;
