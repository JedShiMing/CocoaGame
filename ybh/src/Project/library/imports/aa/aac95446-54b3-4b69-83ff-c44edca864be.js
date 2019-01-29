"use strict";
cc._RF.push(module, 'aac95RGVLNLaYP/xE7cqGS+', 'PhotoPrefab');
// hall/ui/widget/PhotoPrefab.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        photo: {
            default: null,
            type: cc.Node,
            displayName: "头像"
        }
    },

    onLoad: function onLoad() {},

    setPhoto: function setPhoto(url) {

        this.photo.active = true;

        this.loadPhoto(this.photo, url);
    },
    clearPhoto: function clearPhoto() {
        var photo = this.photo.getChildByName("photo") || this.photo.getChildByName("mask").getChildByName("photo");
        photo.getComponent(cc.Sprite).spriteFrame = null;
    },


    loadPhoto: function loadPhoto(photoNode, url) {
        if (!url) {
            return;
        }
        var photo = photoNode.getChildByName("photo") || photoNode.getChildByName("mask").getChildByName("photo");
        var photoSprite = photo.getComponent(cc.Sprite);
        cc.loader.load({ url: url, type: "jpg" }, function (err, res) {
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
    }
});

cc._RF.pop();