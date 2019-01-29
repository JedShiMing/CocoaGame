var AFBtnSpriteCheck = cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFBtnSpriteCheck'
    },

    properties: {
        img: cc.Sprite,
        
        sfOn: cc.SpriteFrame,
        sfOff: cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        this.setCheck(false);
    },
    
    setCheck: function(isCheck) {
        this.img.spriteFrame = isCheck ? this.sfOn : this.sfOff;
    }
});