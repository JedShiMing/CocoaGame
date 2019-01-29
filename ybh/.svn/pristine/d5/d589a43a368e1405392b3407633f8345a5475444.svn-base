const HORIZONTAL_ALIGNMENT = cc.Enum({
    LEFT: -1,
    CENTER: -1,
    RIGHT: -1,
});
const VERTICAL_ALIGNMENT = cc.Enum({
    TOP: -1,
    CENTER: -1,
    BOTTOM: -1,
});

const spriteFilename = {
    "default": "hall/font/spriteNum"
};

cc.Class({
    extends: cc.Component,

    properties: {
        spriteFonts: cc.SpriteAtlas,
    },

    onLoad: function () {
        this.spriteFrameArray = [];
    },

    createNewLabel: function (contentText, fileName, hAlignment, vAlignment) {

        var spriteAtlasPath = spriteFilename[fileName] || spriteFilename['default'];
        this.hAlignment = hAlignment || HORIZONTAL_ALIGNMENT.CENTER;
        this.vAlignment = vAlignment || this.hAlignment;

        if (this.spriteAtlasPath === spriteAtlasPath) {

            if (this.contentText === contentText) { return; }

            this.contentText = contentText;
            this.node.destroyAllChildren();

            if (this.contentText.length < 0) { return; }

            this.initUI();
            return;
        }

        this.spriteAtlasPath = spriteAtlasPath;
        this.contentText = contentText;
        this.node.destroyAllChildren();

        if (this.contentText.length < 0) { return; }

        this.loadAtlas(this.spriteAtlasPath).then((spriteFrameArray) => {
            this.spriteFrameArray = spriteFrameArray;
            this.initUI();
        });

    },

    loadAtlas: function (spriteAtlasPath) {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(spriteAtlasPath, cc.SpriteAtlas, function (err, atlas) {
                if (err) {
                    reject('Could not load image at ' + spriteAtlasPath);
                    return;
                }
                //精灵帧数组
                var resArray = atlas.getSpriteFrames();
                var spriteFrameArray = [];
                for (let i = 0; i < resArray.length; i++) {
                    let spriteFrame = resArray[i];
                    spriteFrameArray[spriteFrame.name] = spriteFrame;
                }
                resolve(spriteFrameArray);
            });
        });
    },

    initUI: function () {
        var width = 0;
        var height = 0;

        let contentNode = new cc.Node('contentNode');
        contentNode.setAnchorPoint(0, 0.5);
        this.node.addChild(contentNode);

        for (let i = 0; i < this.contentText.length; i++) {
            let a = this.contentText.charAt(i);
            let key = a;
            if ('/' == key) {
                key = 'chu';
            }
            let node = new cc.Node('Sprite' + i);
            let sp = node.addComponent(cc.Sprite);
            sp.trim = false;
            sp.sizeMode = 2;
            contentNode.addChild(node);
            sp.spriteFrame = this.spriteFrameArray[key];
            node.x = width + node.width / 2;
            width = node.x + node.width / 2;
            height = node.height;
        }
        contentNode.width = width;
        contentNode.height = height;
        contentNode.setPosition(width * (contentNode.anchorX - this.node.anchorX), height * (0.5 - contentNode.anchorY));
        this.node.width = width;
        this.node.height = height;
    },

});