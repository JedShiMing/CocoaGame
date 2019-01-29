cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFToastMessage'
    },

    properties: {
        msgPanel: {
            default: null,
            type: cc.Node,
            displayName: "消息底框",
        },
        msgLabel: {
            default: null,
            type: cc.RichText,
            displayName: "消息文本标签",
        },

        defaultDuration: {
            default: 3,
            displayName: "默认持续时间",
            range: [1, 10]
        },
        
    },

    // use this for initialization
    onLoad: function () {
        this.node.opacity = 255;
    },

    showMessage: function(msg, duration, cb) {
        if (!this.msgLabel) {
            cc.error("not found toast message text label.");
            return;
        }
        
        this.msgLabel.string = msg || "";
        
        this.msgLabel.node.opacity = 0;
        this.scheduleOnce(this._resizeTextPanel.bind(this), 0);

        this._showPopoutAnimation(duration, cb);
    },

    _resizeTextPanel: function() {
        if (!this.msgPanel) {
            cc.error("not found toast message text panel.");
            return;
        }

        var sz = this.msgLabel.node.getContentSize();

        var maxWidth = cc.winSize.width - 160;
        if (sz.width > maxWidth) {
            this.msgLabel.maxWidth = maxWidth;
            this.scheduleOnce(this._resizeTextPanel.bind(this), 0);
            return;
        }
        this.msgLabel.node.opacity = 255;
        this.msgPanel.setContentSize(sz.width + 40, sz.height + 30);
    },

    _showPopoutAnimation: function(duration, cb) {
        var node = this.node;
        var offsetY = this.node.height/2 > 100 ? this.node.height/2 + 20 : 100;
        var act = cc.sequence(
            cc.fadeTo(0.1, 255),
            cc.delayTime(duration ? duration : this.defaultDuration),
            cc.spawn(
                cc.moveBy(0.5, cc.v2(0, offsetY)),
                cc.fadeTo(0.5, 0.1),
                cc.sequence(
                    cc.delayTime(0.45),
                    cc.callFunc(function(){
                        cb && cb();
                        node.zIndex -= 1;
                    })
                )
            ),
            cc.callFunc(function(){
                node.destroy();
            })
        );
        node.runAction(act);
    },
});