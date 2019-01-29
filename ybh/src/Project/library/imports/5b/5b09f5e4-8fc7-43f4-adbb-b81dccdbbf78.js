"use strict";
cc._RF.push(module, '5b09fXkj8dD9K27uB3M2794', 'AFBtnSpriteGray');
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