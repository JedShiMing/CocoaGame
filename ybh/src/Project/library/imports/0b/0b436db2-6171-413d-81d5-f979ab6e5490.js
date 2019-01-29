"use strict";
cc._RF.push(module, '0b4362yYXFBPYHV+XmrblSQ', 'AFAdjustAllScreen');
// framework/ui/component/AFAdjustAllScreen.js

"use strict";

var AdjustSide = cc.Enum({
    TOP: -1,
    BOTTOM: -1,
    LEFT: -1,
    RIGHT: -1
});
cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFAdJustAllScreen'
    },

    properties: {
        adjustSide: {
            default: AdjustSide.TOP,
            type: AdjustSide
        }
    },

    onLoad: function onLoad() {},

    start: function start() {
        if (!AF.util.isAllScreen()) return;
        var widget = this.getComponent("cc.Widget");
        if (!widget) return;
        switch (this.adjustSide) {
            case AdjustSide.TOP:
                {
                    if (!widget.isAbsoluteTop) {
                        widget.top = widget.top + 44 / 2436;
                    } else {
                        widget.top = widget.top + 44;
                    }
                }break;
            case AdjustSide.BOTTOM:
                {
                    if (!widget.isAlignBottom) {
                        widget.bottom = widget.bottom + 44 / 2436;
                    } else {
                        widget.bottom = widget.bottom + 44;
                    }
                }break;
            case AdjustSide.LEFT:
                {
                    if (!widget.isAlignLeft) {
                        widget.left = widget.left + 44 / 2436;
                    } else {
                        widget.left = widget.left + 44;
                    }
                }break;
            case AdjustSide.RIGHT:
                {
                    if (!widget.isAlignRight) {
                        widget.right = widget.right + 44 / 2436;
                    } else {
                        widget.right = widget.right + 44;
                    }
                }break;
        }

        widget.updateAlignment();
    }
});

cc._RF.pop();