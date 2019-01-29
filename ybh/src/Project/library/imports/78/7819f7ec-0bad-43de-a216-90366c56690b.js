"use strict";
cc._RF.push(module, '7819ffsC61D3qIWkDZsVmkL', 'FriendPassedView');
// hall/ui/platformViews/FriendPassedView.js

'use strict';

var itemWidth = 90;

cc.Class({
    extends: cc.Component,

    properties: {
        qqCon: cc.Node,
        heads: [cc.Node],
        wxDisplay: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function onLoad() {
        var self = this;
        self.qqCon.active = false;
    },
    onEnable: function onEnable() {
        AF.EventDispatcher.on('UpdateFriendPassed', this.updatePoint, this);
    },
    onDisable: function onDisable() {
        AF.EventDispatcher.off('UpdateFriendPassed', this.updatePoint, this);
    },
    updatePoint: function updatePoint(pointId) {
        var _this = this;

        var self = this;
        if (AF.platform.isWxApp()) {
            AF.util.postMessage(3, { pointId: pointId, isAllScreen: AF.util.isAllScreen(), height: cc.winSize.height });
        } else if (AF.platform.isQQApp()) {
            this.qqCon.active = true;
            AF.util.getRankList(function (list) {
                if (list) {
                    _this.list = list;
                    _this.updateHeads(pointId);
                }
            });
        }
    },
    updateHeads: function updateHeads(pointId) {
        if (!this.node || !this.node.active) {
            return;
        }
        for (var i = 0; i < 3 && i < this.list.length; i++) {
            if (this.list[i].score >= pointId) {
                this.heads[i].active = true;
                this.heads[i].getComponent("PhotoPrefab").setPhoto(this.list[i].url);
            } else {
                break;
            }
        }
    }
});

cc._RF.pop();