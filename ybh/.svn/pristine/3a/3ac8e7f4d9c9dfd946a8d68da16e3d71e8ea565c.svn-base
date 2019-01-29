/**
 * 游戏配置
 */

var quickSort = function (arr, comp) {
    if (arr.length <= 1) { return arr; }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        let change = comp && comp(arr[i], pivot);

        if (change) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left, comp).concat([pivot], quickSort(right, comp));
};

var GameConfig = {

    init: function () {

        this.modelCfg = null;
        this.playerCfg = null;
        this.pointCfg = null;

        this.maxPointId = 0;
        this.playerIds = [];
    },

    setGameConfig: function (name, res) {
        if (name == "player") {
            //英雄表
            this.setPlayerCfg(res);
        } else if (name == "model") {
            this.setModelCfg(res);
        } else if (name == "point") {
            this.setPointCfg(res);
        }
    },

    setPlayerCfg: function (res) {
        if (this.playerCfg) {
            return;
        }

        this.playerCfg = {};
        this.playerIds = [];

        for (let i = 0; i < res.length; i++) {
            var id = res[i].id;
            this.playerCfg[id] = res[i];
            this.playerIds.push(id);
        }
    },

    getPlayerInfo: function (key) {
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

    setPointCfg: function (res) {
        console.log(res);

        if (this.pointCfg) {
            return;
        }

        this.pointCfg = {};

        for (let i = 0; i < res.length; i++) {
            var pointId = i + 1;

            this.pointCfg[pointId] = res[i];
        }
    },

    getPointInfo: function (pointId) {
        return this.pointCfg[pointId];
    },

    getMaxPointNum: function () {
        return this.maxPointId;
    },

    getRandomPlayerId: function () {
        var index = AF.Random.getRandomIn(1, this.playerIds.length);

        return this.playerIds[index - 1];
    },

    setModelCfg: function (res) {
        if (this.modelCfg) {
            return;
        }

        this.modelCfg = {};
        for (let i = 0; i < res.length; i++) {
            var id = res[i].id;
            this.modelCfg[id] = res[i];
        }
    },

    getModelInfo: function (key) {
        return this.modelCfg[key];
    },
};

GameConfig.init();

AF.GameConfig = module.exports = GameConfig;

