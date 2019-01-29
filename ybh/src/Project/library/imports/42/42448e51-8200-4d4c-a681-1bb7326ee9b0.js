"use strict";
cc._RF.push(module, '424485RggBNTKaBG7cybumw', 'LoadingLayer');
// hall/ui/widget/LoadingLayer.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {

        panel: cc.Node,

        actionTag: {
            default: 1298,
            visible: false
        },

        tips: {
            default: null,
            type: cc.RichText
        },

        defaultHideTime: {
            default: 10
        }
    },

    onLoad: function onLoad() {
        // cc.game.addPersistRootNode(this.node);
        this.node.zIndex = AF.Const.LOADING_LAYER_Z_ORDER;

        this.panel.width = cc.winSize.width;
        this.panel.height = cc.winSize.height;

        AF.EventDispatcher.on(AF.Event.SHOW_LOADING_LAYER, this.show, this);
        AF.EventDispatcher.on(AF.Event.HIDE_LOADING_LAYER, this.hide, this);
    },

    onDestroy: function onDestroy() {

        AF.EventDispatcher.off(AF.Event.SHOW_LOADING_LAYER, this.show, this);
        AF.EventDispatcher.off(AF.Event.HIDE_LOADING_LAYER, this.hide, this);
    },

    setTips: function setTips(tips) {
        if (!tips) {
            return;
        }

        if (!this.tips) return;
        this.tips.string = tips;
    },

    show: function show(params) {
        this.node.opacity = 0;
        this.node.active = true;
        this.node.zIndex = AF.Const.LOADING_LAYER_Z_ORDER;

        var delayTiem = 1;
        if (params) {
            delayTiem = params.hideTime || this.defaultHideTime;
            this.setTips(params.tips);
        }
        delayTiem = Math.max(1, delayTiem - 0.5);

        var self = this;
        var node = this.node;
        node.stopActionByTag(this.actionTag);
        var seq = cc.sequence(cc.delayTime(0.2), cc.fadeIn(0.3), cc.delayTime(delayTiem), cc.callFunc(function () {
            self.hide();
        }));
        seq.setTag(self.actionTag);
        node.runAction(seq);
    },

    hide: function hide() {
        this.node.stopActionByTag(this.actionTag);
        this.node.active = false;
        this.node.opacity = 0;
    }
});

cc._RF.pop();