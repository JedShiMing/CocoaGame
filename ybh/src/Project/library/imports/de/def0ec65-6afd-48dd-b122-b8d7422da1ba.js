"use strict";
cc._RF.push(module, 'def0exlav1I3bEiuNdCLaG6', 'AFBtnSpriteCheck');
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