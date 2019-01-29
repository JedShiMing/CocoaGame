cc.Class({
    extends: cc.Component,

    properties: {
        goldNumLabel: {
            default: null,
            type: cc.Label,
            displayName: "金币Label",
        },
    },

    onLoad: function () {
        this.schedule(this.onUserInfoUpdate, 1, this);
        AF.EventDispatcher.on(AF.Event.USER_INFO_UPDATE, this.onUserInfoUpdate, this);
    },
    onDestroy: function () {
        AF.EventDispatcher.off(AF.Event.USER_INFO_UPDATE, this.onUserInfoUpdate, this);
    },

    onEnable: function () {
        if (AF.platform.isHairScreen()) {
            this.node.y = cc.winSize.height - 72;
        } else {
            this.node.y = cc.winSize.height - 16;
        }

        this.onUserInfoUpdate();
    },

    onUserInfoUpdate: function () {

        function widgetIsActive(node) {
            var active = true;
            while (node) {
                if (!node) { break; }
                if (!node.parent) { break; }
                active = node.active;
                if (!active) { break; }
                node = node.parent;
            }
            return active;
        }

        if (!widgetIsActive(this.node)) { return; }

        this.goldNumLabel.string = AF.util.formatNumber(0);
    },

    //-------------按钮回调函数-------------
    onGoldAddButtonClick(event, custom) {
    },
});
