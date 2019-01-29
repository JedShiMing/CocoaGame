(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/logic/af-game-data.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '13ce4JOj5dCULOm1rHjyfd3', 'af-game-data', __filename);
// framework/logic/af-game-data.js

"use strict";

/**
 * 游戏配置
 */

var GameData = {

    init: function init() {
        this.userId = ""; //我的uid
        this.userName = ""; //我的微信名
        this.headUrl = ""; //我的头像Url
        this.time = { remote: 0, local: 0 };

        this.players = [];
        this.player_index = {};

        this.myObjects = {};
        this.dialogOnce = {};
    },

    getDialogOnce: function getDialogOnce(key) {
        if (this.dialogOnce[key]) {
            return this.dialogOnce[key];
        } else {
            return 0;
        }
    },

    setDialogOnce: function setDialogOnce(key) {
        this.dialogOnce[key] = AF.util.getCurrTime();
    },

    initDialogOnce: function initDialogOnce() {
        this.dialogOnce = {};
    },

    initGold: function initGold() {
        AF.EventDispatcher.emit(AF.Event.USER_INFO_UPDATE);
    },

    setMyObject: function setMyObject(key, data) {
        this.myObjects[key] = data;
    },

    getMyObject: function getMyObject(key) {
        return this.myObjects[key];
    },

    setTime: function setTime(remoteTime) {
        this.time.remote = Math.floor(remoteTime / 1000);
        this.time.local = AF.util.getCurrTimeOfSecond();
    },

    getServerTime: function getServerTime() {
        var d = 0;
        var localTime = AF.util.getCurrTimeOfSecond();
        if (localTime > this.time.local) {
            d = localTime - this.time.local;
        }
        return this.time.remote + d;
    },

    getPastTime: function getPastTime(remoteTime) {

        var currentTime = AF.GameData.getServerTime();
        if (currentTime <= remoteTime) {
            return 0;
        }

        return currentTime - remoteTime;
    },

    setUserId: function setUserId(userId) {
        this.userId = userId;
    },

    getUserId: function getUserId() {
        return this.userId;
    },

    setUserName: function setUserName(userName) {
        this.userName = userName;
    },


    getUserName: function getUserName() {
        return this.userName;
    },

    setHeadUrl: function setHeadUrl(headUrl) {
        this.headUrl = headUrl;
    },

    getHeadUrl: function getHeadUrl() {
        return this.headUrl;
    },

    getMyPlayerData: function getMyPlayerData() {
        if (this.playerData) {
            return this.playerData;
        }

        this.playerData = {
            // preScore: 0,//存储当前分数
            // playCount: 0,//存储次数
            // totalScore: 0,//存储总分数
            // bestScore: 0,//存储最高分
            pointId: 0,
            gold: 0
        };
        var playerDataStr = AF.util.getStorage('player_data');
        if (playerDataStr) {
            this.playerData = JSON.parse(playerDataStr);
        }
        return this.playerData;
    },

    setMyPlayerData: function setMyPlayerData(playerData) {
        this.playerData = playerData;
    },

    savePlayerData: function savePlayerData() {
        var playerDataStr = JSON.stringify(this.playerData);
        AF.util.setStorage("player_data", playerDataStr);
    }
};

GameData.init();

AF.GameData = module.exports = GameData;

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
        //# sourceMappingURL=af-game-data.js.map
        