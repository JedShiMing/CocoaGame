cc.Class({
    extends: cc.Component,

    properties: {
        goldNode: {
            default: null,
            type: cc.Node,
            displayName: "金币节点"
        },

        goldNum: {
            default: null,
            type: cc.Label,
            displayName: "金币数目"
        },

        crystalNode: {
            default: null,
            type: cc.Node,
            displayName: "水晶节点"
        },

        crystalNum: {
            default: null,
            type: cc.Label,
            displayName: "水晶数目"
        },

        expNum: {
            default: null,
            type: cc.Label,
            displayName: "经验值"
        },

        levelUp: {
            default: null,
            type: cc.Node,
            displayName: "升级"
        },

        expProgress: {
            default: null,
            type: cc.ProgressBar,
            displayName: "进度条"
        },
    },

    onLoad: function () {
        this.init();
    },

    init: function () {
        this.index = 0;
        this.step = -1;

        this.listInfo = [];
        this.expNode = this.expNum.node;

        this.levelUp.scale = 0;
        this.expNode.scale = 0;
        this.goldNode.scale = 0;
        this.crystalNode.scale = 0;

        this.levelUp.active = false;
        this.expNode.active = false;
        this.goldNode.active = false;
        this.crystalNode.active = false;
        this.expProgress.node.active = false;

        this.intervalTime = 0.05;
        this.durationTime = 0;
    },

    setExpProgressY: function (posY) {
        this.expProgress.node.y = posY;
    },

    showGain: function (gainInfo) {

        this.expNum.string = "+" + gainInfo.expAdd + "经验";
        var pos = 0;
        if (gainInfo.goldAdd) {
            this.goldNum.string = "+" + gainInfo.goldAdd;
            pos = 1
            this.goldNode.active = true;
        }
        if (gainInfo.crystalAdd) {
            this.crystalNum.string = "+" + gainInfo.crystalAdd;
            this.crystalNode.y = 120 + pos * 40;
            this.crystalNode.active = true;
        }
        this.node.active = true;
        this.expProgress.node.active = false;

        this.index = 0;
        this.step = 1;
        var self = this;

        this.expNum.node.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.callFunc(function () {
                self.goldNode.active = false;
                self.crystalNode.active = false;
            })));
    },

    showExp: function (listInfo) {
        this.listInfo = listInfo;
        this.index = 0;
        this.step = 1;

        var self = this;

        self.expNode.active = true;
        self.expNode.scale = 0;
        this.showAction(this.expNode, function () {
            self.expProgress.node.active = true;
            self.durationTime = self.intervalTime;
        });
    },

    showAction: function (node, callBack) {
        node.active = true;
        node.scale = 0;

        var self = this;
        var act = cc.sequence(
            cc.callFunc(function (target) {
                self.step = 1;
            }),
            cc.spawn(
                cc.scaleTo(0.6, 1).easing(cc.easeBackOut()),
                cc.delayTime(0.6),
            ),
            cc.delayTime(0.4),
            cc.callFunc(function (target) {
                self.step = 2;
                node.scale = 0;
                callBack && callBack();
            }),
        );
        node.runAction(act);
    },

    update: function (dt) {
        if (this.step !== 2) { return; }

        this.durationTime += dt;
        if (this.durationTime < this.intervalTime) { return; }

        this.durationTime = 0;
        if (this.index >= this.listInfo.length) { return; }

        let percent = this.listInfo[this.index];
        if (1 === percent) {
            this.node.parent.getComponent('PlayerPrefab').playLevelupAni();
            this.showAction(this.levelUp);
        }
        this.expProgress.progress = percent;
        this.index++;
    },

});
