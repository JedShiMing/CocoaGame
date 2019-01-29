(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/component/AFBtnSpriteCheck.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'def0exlav1I3bEiuNdCLaG6', 'AFBtnSpriteCheck', __filename);
// framework/ui/component/AFBtnSpriteCheck.js

'use strict';

var AFBtnSpriteCheck = cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFBtnSpriteCheck'
    },

    properties: {
        img: cc.Sprite,

        sfOn: cc.SpriteFrame,
        sfOff: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.setCheck(false);
    },

    setCheck: function setCheck(isCheck) {
        this.img.spriteFrame = isCheck ? this.sfOn : this.sfOff;
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
        //# sourceMappingURL=AFBtnSpriteCheck.js.map
        