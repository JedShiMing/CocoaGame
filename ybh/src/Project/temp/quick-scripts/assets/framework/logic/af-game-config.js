(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/logic/af-game-config.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15c5eduFM1AY7AEJ3Vrmt80', 'af-game-config', __filename);
// framework/logic/af-game-config.js

"use strict";

/**
 * 游戏配置
 */

var quickSort = function quickSort(arr, comp) {
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        var change = comp && comp(arr[i], pivot);

        if (change) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left, comp).concat([pivot], quickSort(right, comp));
};

var GameConfig = {

    init: function init() {

        this.modelCfg = null;
        this.playerCfg = null;
        this.pointCfg = null;

        this.maxPointId = 0;
        this.playerIds = [];
    },

    setGameConfig: function setGameConfig(name, res) {
        if (name == "player") {
            //英雄表
            this.setPlayerCfg(res);
        } else if (name == "model") {
            this.setModelCfg(res);
        } else if (name == "point") {
            this.setPointCfg(res);
        }
    },

    setPlayerCfg: function setPlayerCfg(res) {
        if (this.playerCfg) {
            return;
        }

        this.playerCfg = {};
        this.playerIds = [];

        for (var i = 0; i < res.length; i++) {
            var id = res[i].id;
            this.playerCfg[id] = res[i];
            this.playerIds.push(id);
        }
    },

    getPlayerInfo: function getPlayerInfo(key) {
        var info = this.playerCfg[key];

        if (!info) {
            return info;
        }

        if (!info.actions) {
            var modelInfo = this.getModelInfo(info.model);
            info.head = modelInfo.head;
            info.chest = modelInfo.chest;
            info.actions = modelInfo.actions;
        }

        if (!info.actions.revive) {
            info.actions.revive = {};
            info.actions.revive.x = info.actions.dead.x;
            info.actions.revive.y = info.actions.dead.y;
            info.actions.revive.rate = info.actions.dead.rate;
        }

        return info;
    },

    setPointCfg: function setPointCfg(res) {
        console.log(res);

        if (this.pointCfg) {
            return;
        }

        this.pointCfg = {};

        for (var i = 0; i < res.length; i++) {
            var pointId = i + 1;

            this.pointCfg[pointId] = res[i];
        }
    },

    getPointInfo: function getPointInfo(pointId) {
        return this.pointCfg[pointId];
    },

    getMaxPointNum: function getMaxPointNum() {
        return this.maxPointId;
    },

    getRandomPlayerId: function getRandomPlayerId() {
        var index = AF.Random.getRandomIn(1, this.playerIds.length);

        return this.playerIds[index - 1];
    },

    setModelCfg: function setModelCfg(res) {
        if (this.modelCfg) {
            return;
        }

        this.modelCfg = {};
        for (var i = 0; i < res.length; i++) {
            var id = res[i].id;
            this.modelCfg[id] = res[i];
        }
    },

    getModelInfo: function getModelInfo(key) {
        return this.modelCfg[key];
    }
};

GameConfig.init();

AF.GameConfig = module.exports = GameConfig;

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
        //# sourceMappingURL=af-game-config.js.map
        