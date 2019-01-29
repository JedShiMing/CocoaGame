"use strict";
cc._RF.push(module, '73fdaHGyAxFIKt6pZDC0OdI', 'HallBalanceDialog');
// hall/ui/dialog/HallBalanceDialog.js

'use strict';

var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        node_light: cc.Node,
        node_starCon: cc.Node,
        node_next: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function onLoad() {
        DialogBase.prototype.onLoad.call(this);
    },

    onEnable: function onEnable() {
        var _this = this;

        DialogBase.prototype.onEnable.call(this);
        this.params = AF.DIALOG_PARAMS();
        var pointId = AF.GameData.getMyPlayerData().pointId;
        if (this.params.pointId % 25 === 0 && this.params.over) {
            this.scheduleOnce(function () {
                return AF.openDialog("HallGiftDialog", { costTime: _this.params.costTime, pointId: _this.params.pointId });
            }, 0.1);
        } else {
            this.scheduleOnce(function () {
                return AF.EventDispatcher.emit('ShowBalancePassed', { pointId: _this.params.pointId, costTime: _this.params.costTime });
            }, 0.5);
        }

        this.startAnimation();
    },
    startAnimation: function startAnimation() {
        var animation = this.node.getComponent(cc.Animation);
        animation.setCurrentTime(0);
        animation.play('balance', 0);

        this.node_light.rotation = 0;
        this.node_light.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(1, 90), cc.rotateTo(1, 180), cc.rotateTo(1, 270), cc.rotateTo(1, 0))));

        this.node_starCon.children.forEach(function (node) {
            node.scale = 1;
            node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.6, 1.2, 1.2), cc.scaleTo(0.6, 1, 1))));
        });
        this.node_next.scale = 1;
        this.node_next.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.6, 0.9, 0.9), cc.scaleTo(0.6, 1, 1))));
        // this.node_buttons.active = false
        // this.node_light.scale = 0
        // this.node_starCon.scale = 0
        // this.node_win.scale = 2
        //
        // this.node_win.runAction(cc.scaleTo(0.2, 1, 1))
    },

    onDisable: function onDisable() {
        DialogBase.prototype.onDisable.call(this);
        AF.EventDispatcher.emit('HideBalancePassed');

        this.node_light.stopAllActions();
        this.node_next.stopAllActions();
        this.node_starCon.children.forEach(function (node) {
            node.stopAllActions();
        });
    },
    next: function next() {
        this.close();
        this.params.next();
    },
    goToHome: function goToHome() {
        this.close();
        this.params.close();
    },
    challenge: function challenge() {
        AF.util.shareAppMessage(null, function () {
            console.log('suc');
        }, function () {
            console.log('fail');
        }, { score: this.params.pointId }, 'challenge');
    }
});

cc._RF.pop();