"use strict";
cc._RF.push(module, '24f1afQcQpIU79ln66UBfMN', 'LogoAnimation');
// hall/ui/widget/LogoAnimation.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        cloudUp: cc.Node,
        cloudDown: cc.Node,
        logoNode: cc.Node,
        goldNode: cc.Node,
        playerNode: cc.Node,

        playerFrames: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // playerNode;
        // var kjrwEffect = cc.instantiate(this.effectPre);
        // this.playerNode.addChild(kjrwEffect, 1, 'kjrwEffect');
        // var kjrwEffectScript = kjrwEffect.getComponent('EffectPrefab');
        // kjrwEffectScript.doStart('kjrw', 1, Infinity);
    },

    onEnable: function onEnable() {
        this.goldAction();
        // this.cloudDown.active = false;
        // this.cloudUp.active = false;
        this.addMoveEffect(this.cloudDown);
        this.addMoveEffect(this.cloudUp);
        this.playKjrwAnimation();
    },

    playKjrwAnimation: function playKjrwAnimation() {
        var self = this;
        var actions = [];

        var _loop = function _loop(i) {
            // playerNode
            actions.push(cc.callFunc(function () {
                self.playerNode.getComponent(cc.Sprite).spriteFrame = self.playerFrames[i];
            }));
            actions.push(cc.delayTime(1 / 60 * 7 + i * 1 / 60 * 7));
        };

        for (var i = 0; i < this.playerFrames.length; i++) {
            _loop(i);
        }
        this.playerNode.runAction(cc.repeatForever(cc.sequence(actions)));
    },

    goldAction: function goldAction() {
        var actions = [];
        actions.push(cc.moveBy(0.5, 0, 16));
        actions.push(cc.moveBy(1.0, 0, -32));
        actions.push(cc.moveBy(0.5, 0, 16));
        this.goldNode.runAction(cc.repeatForever(cc.sequence(actions)));
    },

    addCloudEffect: function addCloudEffect(node) {
        var dxAndDts = [];
        for (var i = 1; i <= 4; i++) {
            var dx = i * 10 + cc.random0To1() * 20;
            var dt1 = i * 1 + cc.random0To1() * 1;
            var dt2 = i * 1 + cc.random0To1() * 1;
            dxAndDts.push({ dx: dx, dt: dt1 });
            dxAndDts.push({ dx: 0 - dx, dt: dt2 });
        }
        var actions = [];
        while (true) {
            if (!dxAndDts.length) {
                break;
            }
            var index = Math.floor(Math.random() * dxAndDts.length);
            var actionInfo = dxAndDts.splice(index, 1);
            actions.push(cc.moveBy(actionInfo[0].dt, actionInfo[0].dx, 0));
        }
        var action = cc.repeatForever(cc.sequence(actions));
        node.runAction(action);
    },

    addMoveEffect: function addMoveEffect(node) {
        if (node === null) {
            return;
        }
        var actionName = 'MoveActionName';

        var moveActionInfo = {};
        moveActionInfo.speed_min = 10;
        moveActionInfo.speed_max = 30;
        moveActionInfo.currSpeed = 0;
        moveActionInfo.init_x = 0;
        moveActionInfo.diff_x = 0;

        moveActionInfo.target = node;
        moveActionInfo.init_x = node.getPositionX();

        moveActionInfo.target[actionName] = function (dt) {
            node.x += moveActionInfo.currSpeed * dt;
            var currPosX = node.getPositionX();
            var currdiffX = currPosX - moveActionInfo.init_x;
            var direction = Math.ceil(Math.random() * 1000) % 2 ? -1 : 1;
            if (moveActionInfo.currSpeed <= 0 && currdiffX <= moveActionInfo.diff_x || moveActionInfo.currSpeed >= 0 && currdiffX >= moveActionInfo.diff_x) {
                moveActionInfo.diff_x = direction * cc.winSize.width * 0.5 * Math.random();
                moveActionInfo.currSpeed = direction * (moveActionInfo.speed_min + Math.random() * (moveActionInfo.speed_max - moveActionInfo.speed_min));
                return;
            }
            var currWorldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
            if (currWorldPos.x + node.width / 2 * node.scale >= 640) {
                direction = -1;
                moveActionInfo.diff_x = direction * cc.winSize.width * 0.5 * Math.random();
                moveActionInfo.currSpeed = direction * (moveActionInfo.speed_min + Math.random() * (moveActionInfo.speed_max - moveActionInfo.speed_min));
                return;
            }
            if (currWorldPos.x - node.width / 2 * node.scale <= 0) {
                direction = 1;
                moveActionInfo.diff_x = direction * cc.winSize.width * 0.5 * Math.random();
                moveActionInfo.currSpeed = direction * (moveActionInfo.speed_min + Math.random() * (moveActionInfo.speed_max - moveActionInfo.speed_min));
                return;
            }
        };
        this.schedule(moveActionInfo.target[actionName], 0);
    }

    // update (dt) {},
});

cc._RF.pop();