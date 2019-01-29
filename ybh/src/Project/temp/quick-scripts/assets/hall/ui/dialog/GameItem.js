(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/dialog/GameItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fd307aFzJlPVKVCS0goRoK9', 'GameItem', __filename);
// hall/ui/dialog/GameItem.js

"use strict";

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Sprite,
        label: cc.Label
    },
    _active: false,
    _zero: false,
    _selected: false,
    // LIFE-CYCLE CALLBACKS:

    setLabel: function setLabel(l) {
        this.label.string = l;
    },

    setZero: function setZero(v) {
        this._zero = !!v;
    },


    setActive: function setActive(v) {
        this._active = !!v;
        this.bg.node.active = !!v;
    },

    getActive: function getActive() {
        return this._active;
    },

    animateScale: function animateScale() {
        var anim1 = cc.scaleTo(0.15, 1.2, 1.2);
        var anim2 = cc.scaleTo(0.15, 1.0, 1.0);
        this.node.runAction(cc.sequence(anim1, anim2));
    },

    setSelected: function setSelected(v) {
        if (this._selected === !!v) {
            return;
        }
        var animation = this.bg.getComponent(cc.Animation);
        if (v) {
            animation.play();
            this.animateScale();
        } else {
            animation.play();
            animation.setCurrentTime(0);
            animation.stop();
        }
        this._selected = !!v;
    },

    getSelected: function getSelected() {
        return this._selected;
    }
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
        //# sourceMappingURL=GameItem.js.map
        