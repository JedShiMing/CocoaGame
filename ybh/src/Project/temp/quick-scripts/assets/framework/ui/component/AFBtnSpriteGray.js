(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/component/AFBtnSpriteGray.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5b09fXkj8dD9K27uB3M2794', 'AFBtnSpriteGray', __filename);
// framework/ui/component/AFBtnSpriteGray.js

'use strict';

var AFBtnSpriteGray = cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFBtnSpriteGray'
    },

    properties: {
        btn: cc.Button,
        img: cc.Sprite,
        text: cc.Label,

        sfNormal: cc.SpriteFrame,
        sfGray: cc.SpriteFrame,

        fontNormal: cc.Font,
        fontGray: cc.Font
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.setEnabled(true);
    },

    setEnabled: function setEnabled(isEnabled) {
        this.img.spriteFrame = isEnabled ? this.sfNormal : this.sfGray;
        this.text.font = isEnabled ? this.fontNormal : this.fontGray;

        this.btn.interactable = isEnabled;
    },

    setText: function setText(text) {
        this.text.string = text;
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
        //# sourceMappingURL=AFBtnSpriteGray.js.map
        