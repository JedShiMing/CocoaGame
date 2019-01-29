var EventDispatcher = require("af-event-dispatcher");
var Const = require("af-const");

let views = {}
//游戏界面已通关好友
EventDispatcher.on('ShowFriendPassed', (pointId) => {
    // if (AF.platform.isQQApp()) {
        if (views.FriendPassedView)
            return
        cc.loader.loadRes('hall/prefabs/platformViews/FriendPassedView', (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab)
                cc.director.getScene().addChild(node);
                node.zIndex = Const.DIALOG_Z_ORDER + 1;//显示在UI最上层
                views.FriendPassedView = node

                EventDispatcher.emit('UpdateFriendPassed', pointId)
            }
        })
    // }
});

EventDispatcher.on('HideFriendPassed', () => {
    if (views.FriendPassedView) {
        views.FriendPassedView.destroy()
        views.FriendPassedView = null
    }
    AF.util.postMessage(0, {});

})
//结算页面已通关好友
EventDispatcher.on('ShowBalancePassed', (info) => {
    // if (AF.platform.isQQApp()) {
        if (views.BalancePassedView) {
            return
        }
        cc.loader.loadRes('hall/prefabs/platformViews/BalancePassedView', (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab)
                cc.director.getScene().addChild(node);
                node.zIndex = Const.DIALOG_Z_ORDER + 1;
                views.BalancePassedView = node

                EventDispatcher.emit('UpdateBalancePassed', info)
            }
        })
    // }
    // AF.util.postMessage(4, info);

});

EventDispatcher.on('HideBalancePassed', () => {
    if (views.BalancePassedView) {
        views.BalancePassedView.destroy()
        views.BalancePassedView = null
    }
    AF.util.postMessage(0, {});

})
