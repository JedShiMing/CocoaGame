var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        bg: cc.Node,
        effectPre: cc.Prefab,
    },
    onLoad: function () {
        DialogBase.prototype.onLoad.call(this);
        AF.EventDispatcher.on(AF.Event.CLOSE_WAIT_DIALOG, this.doCloseAction, this);
    },

    onDestroy: function () {
        DialogBase.prototype.onDestroy.call(this);
        AF.EventDispatcher.off(AF.Event.CLOSE_WAIT_DIALOG, this.doCloseAction, this);
    },

    doCloseAction: function () {
        var self = this;
        this.bg.runAction(cc.sequence(
            cc.fadeOut(2),
            cc.callFunc(function () {
                self.close();
            })));
    },
});
