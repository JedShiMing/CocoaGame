(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/dialog/LinkItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b5402nJWKtIAJRHQt4E6w5e', 'LinkItem', __filename);
// hall/ui/dialog/LinkItem.js

'use strict';

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        spSelect: cc.Node,
        spTip: cc.Node,

        straight: cc.Sprite,
        corner: cc.Sprite,
        end: cc.Sprite
    },

    updateSelectLink: function updateSelectLink(lastPos, selected) {
        if (!!selected) {
            var rotation = 0;
            switch (lastPos) {
                case 'left':
                    rotation = 0;
                    break;
                case 'top':
                    rotation = 90;
                    break;
                case 'right':
                    rotation = 180;
                    break;
                case 'bottom':
                    rotation = -90;
                    break;
                default:
                    return;
            }
            this.spSelect.active = true;
            this.spSelect.rotation = rotation;
        } else {
            this.spSelect.active = false;
        }
    },
    updateTipLink: function updateTipLink(lastPos, nextPos) {
        if (/top|bottom/.test(lastPos) && /top|bottom/.test(nextPos) || /left|right/.test(lastPos) && /left|right/.test(nextPos)) {
            this.spTip.active = true;
            this.straight.node.active = true;
            this.corner.node.active = false;
            this.end.node.active = false;
            var rotation = 0;
            switch (lastPos) {
                case 'left':
                    rotation = 0;
                    break;
                case 'top':
                    rotation = 90;
                    break;
                case 'right':
                    rotation = 180;
                    break;
                case 'bottom':
                    rotation = -90;
                    break;
            }
            this.spTip.rotation = rotation;
        } else if (lastPos && nextPos) {
            var _rotation = 0;
            var scaleY = 1;
            this.spTip.active = true;
            this.straight.node.active = false;
            this.corner.node.active = true;
            this.end.node.active = false;
            if (lastPos === 'left') {
                if (nextPos === 'top') {
                    scaleY = -1;
                }
            } else if (lastPos === 'top') {
                _rotation = 90;
                if (nextPos === 'right') {
                    scaleY = -1;
                }
            } else if (lastPos === 'right') {
                _rotation = 180;
                if (nextPos === 'bottom') {
                    scaleY = -1;
                }
            } else if (lastPos === 'bottom') {
                _rotation = -90;
                if (nextPos === 'left') {
                    scaleY = -1;
                }
            }
            this.spTip.scaleY = scaleY;
            this.spTip.rotation = _rotation;
        } else if (!nextPos) {
            this.spTip.active = true;
            this.straight.node.active = false;
            this.corner.node.active = false;
            this.end.node.active = true;
            var _rotation2 = 0;
            switch (lastPos) {
                case 'left':
                    _rotation2 = 0;
                    break;
                case 'top':
                    _rotation2 = 90;
                    break;
                case 'right':
                    _rotation2 = 180;
                    break;
                case 'bottom':
                    _rotation2 = -90;
                    break;
            }
            this.spTip.rotation = _rotation2;
        }
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
        //# sourceMappingURL=LinkItem.js.map
        