"use strict";
cc._RF.push(module, '84d2cTpPWpKfqJ61MNZ7Q5f', 'BalancePassedView');
// hall/ui/platformViews/BalancePassedView.js

'use strict';

var itemWidth = 90;

cc.Class({
    extends: cc.Component,

    properties: {
        qqCon: cc.Node,
        heads: [cc.Node],
        label_time: [cc.Label],
        wxDisplay: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function onLoad() {
        AF.EventDispatcher.on('UpdateBalancePassed', this.updatePoint, this);

        this.qqCon.active = false;
    },
    onDestroy: function onDestroy() {
        AF.EventDispatcher.off('UpdateBalancePassed', this.updatePoint, this);
    },

    updatePoint: function updatePoint(_ref) {
        var _this = this;

        var pointId = _ref.pointId,
            costTime = _ref.costTime;

        this.pointId = pointId;
        this.costTime = costTime;
        if (AF.platform.isWxApp()) {
            AF.util.postMessage(4, { pointId: pointId, costTime: costTime });
        } else if (AF.platform.isQQApp()) {
            this.qqCon.active = true;
            AF.util.getRankList(function (ranklist) {
                if (ranklist) {
                    var selfId = 0;
                    for (var i = 0; i < ranklist.length; i++) {
                        if (ranklist[i].selfFlag === 1) {
                            selfId = i;
                            break;
                        }
                    }
                    _this.list = [];
                    if (selfId === 0) {
                        _this.list = [ranklist[selfId], ranklist[selfId + 1], ranklist[selfId + 2]];
                    } else if (selfId === ranklist.length - 1) {
                        _this.list = [ranklist[selfId - 2], ranklist[selfId - 1], ranklist[selfId]];
                    } else {
                        _this.list = [ranklist[selfId - 1], ranklist[selfId], ranklist[selfId + 1]];
                    }
                    _this.updateHeads();
                }
            });
        }
    },

    updateHeads: function updateHeads() {
        for (var i = 0; i < 3; i++) {
            this.heads[i].active = true;
            this.heads[i].getComponent("PhotoPrefab").setPhoto(this.list[i].url);
            this.label_time[i].string = this.list[i].score + '关';
        }
    }
});

cc._RF.pop();