(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/platformListener.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd02d0hSfhBM1bRXF67mCWN3', 'platformListener', __filename);
// hall/platformListener.js

"use strict";

var EventDispatcher = require("af-event-dispatcher");
var Const = require("af-const");

var views = {};
//游戏界面已通关好友
EventDispatcher.on('ShowFriendPassed', function (pointId) {
    // if (AF.platform.isQQApp()) {
    if (views.FriendPassedView) return;
    cc.loader.loadRes('hall/prefabs/platformViews/FriendPassedView', function (err, prefab) {
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().addChild(node);
            node.zIndex = Const.DIALOG_Z_ORDER + 1; //显示在UI最上层
            views.FriendPassedView = node;

            EventDispatcher.emit('UpdateFriendPassed', pointId);
        }
    });
    // }
});

EventDispatcher.on('HideFriendPassed', function () {
    if (views.FriendPassedView) {
        views.FriendPassedView.destroy();
        views.FriendPassedView = null;
    }
    AF.util.postMessage(0, {});
});
//结算页面已通关好友
EventDispatcher.on('ShowBalancePassed', function (info) {
    // if (AF.platform.isQQApp()) {
    if (views.BalancePassedView) {
        return;
    }
    cc.loader.loadRes('hall/prefabs/platformViews/BalancePassedView', function (err, prefab) {
        if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().addChild(node);
            node.zIndex = Const.DIALOG_Z_ORDER + 1;
            views.BalancePassedView = node;

            EventDispatcher.emit('UpdateBalancePassed', info);
        }
    });
    // }
    // AF.util.postMessage(4, info);
});

EventDispatcher.on('HideBalancePassed', function () {
    if (views.BalancePassedView) {
        views.BalancePassedView.destroy();
        views.BalancePassedView = null;
    }
    AF.util.postMessage(0, {});
});

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
        //# sourceMappingURL=platformListener.js.map
        