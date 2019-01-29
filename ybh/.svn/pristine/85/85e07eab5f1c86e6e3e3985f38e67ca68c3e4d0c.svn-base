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
        fontGray: cc.Font,
    },

    // use this for initialization
    onLoad: function () {
        this.setEnabled(true);
    },
    
    setEnabled: function(isEnabled) {
        this.img.spriteFrame = isEnabled ? this.sfNormal : this.sfGray;
        this.text.font = isEnabled ? this.fontNormal : this.fontGray;

        this.btn.interactable = isEnabled;
    },

    setText: function(text) {
        this.text.string = text;
    }
});