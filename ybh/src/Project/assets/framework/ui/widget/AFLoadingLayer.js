var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    editor: {
        menu: 'ApplicationFramework/AFLoadingLayer'
    },

    properties: {
        tips: {
            default: null,
            type: cc.Label,
            displayName: 'tips文本标签'
        }
    },

    // use this for initialization
    onLoad: function () {
        DialogBase.prototype.onLoad.call(this);
        this.regEvent(AF.Event.CLOSE_DIALOG_BY_NAME, this.dialogCloseEvent);
    },

    dialogCloseEvent: function (dialogName) {
        if (dialogName === 'LOADING_LAYER') {
            cc.log("CLOSE_DIALOG_BY_NAME AFLoadingLayer close");
            this.closeImmediate();
        }
    },

    onEnable: function () {
        DialogBase.prototype.onEnable.call(this);

        var anim = this.getComponent(cc.Animation);
        if (anim) {
            var animState = anim.play();

            animState.wrapMode = cc.WrapMode.Loop;
            animState.repeatCount = Infinity;
        }

        this.show(false);
        this.scheduleOnce(function () {
            this.show(true);
        }.bind(this), 1.0);
    },

    onDisable: function () {
        DialogBase.prototype.onDisable.call(this);
    },

    onDestroy: function () {
        DialogBase.prototype.onDestroy.call(this);
    },

    setTips: function (tips) {
        if (!this.tips) return;
        this.tips.string = tips;
    },
    show: function (isShow) {
        var panel = this.node.getChildByName("panel");
        panel.opacity = isShow ? 255 : 0;
    }
});
