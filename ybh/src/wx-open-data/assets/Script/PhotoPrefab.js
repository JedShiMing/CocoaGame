cc.Class({
    extends: cc.Component,

    properties: {
        photo: {
            default: null,
            type: cc.Node,
            displayName: "头像",
        },
    },

    onLoad: function () {

    },

    setPhoto: function (url) {

        this.photo.active = true;

        this.loadPhoto(this.photo, url);
    },
    clearPhoto(){
        let photo =  this.photo.getChildByName("photo") || this.photo.getChildByName("mask").getChildByName("photo");
        photo.getComponent(cc.Sprite).spriteFrame = null
    },

    loadPhoto: function (photoNode, url) {
        if (!url) {
            return;
        }
        var photo =  photoNode.getChildByName("photo") || photoNode.getChildByName("mask").getChildByName("photo");
        var photoSprite = photo.getComponent(cc.Sprite);
        cc.loader.load({ url: url, type: "jpg" }, (err, res) => {
            if (err) {
                console.log("err: PhotoPrefab.js loadPhoto ", err);
                return;
            }
            if (photoSprite && photoSprite.spriteFrame !== undefined) {
                photoSprite.spriteFrame = new cc.SpriteFrame(res);
            } else {
                cc.error('头像加载失败', err);
            }
        });
    },
});