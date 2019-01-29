(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/widget/SpriteFontPrefab.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1e548pfGlND6blTdnX2dyeL', 'SpriteFontPrefab', __filename);
// hall/ui/widget/SpriteFontPrefab.js

"use strict";

var HORIZONTAL_ALIGNMENT = cc.Enum({
    LEFT: -1,
    CENTER: -1,
    RIGHT: -1
});
var VERTICAL_ALIGNMENT = cc.Enum({
    TOP: -1,
    CENTER: -1,
    BOTTOM: -1
});

var spriteFilename = {
    "default": "hall/font/spriteNum"
};

cc.Class({
    extends: cc.Component,

    properties: {
        spriteFonts: cc.SpriteAtlas
    },

    onLoad: function onLoad() {
        this.spriteFrameArray = [];
    },

    createNewLabel: function createNewLabel(contentText, fileName, hAlignment, vAlignment) {
        var _this = this;

        var spriteAtlasPath = spriteFilename[fileName] || spriteFilename['default'];
        this.hAlignment = hAlignment || HORIZONTAL_ALIGNMENT.CENTER;
        this.vAlignment = vAlignment || this.hAlignment;

        if (this.spriteAtlasPath === spriteAtlasPath) {

            if (this.contentText === contentText) {
                return;
            }

            this.contentText = contentText;
            this.node.destroyAllChildren();

            if (this.contentText.length < 0) {
                return;
            }

            this.initUI();
            return;
        }

        this.spriteAtlasPath = spriteAtlasPath;
        this.contentText = contentText;
        this.node.destroyAllChildren();

        if (this.contentText.length < 0) {
            return;
        }

        this.loadAtlas(this.spriteAtlasPath).then(function (spriteFrameArray) {
            _this.spriteFrameArray = spriteFrameArray;
            _this.initUI();
        });
    },

    loadAtlas: function loadAtlas(spriteAtlasPath) {
        return new Promise(function (resolve, reject) {
            cc.loader.loadRes(spriteAtlasPath, cc.SpriteAtlas, function (err, atlas) {
                if (err) {
                    reject('Could not load image at ' + spriteAtlasPath);
                    return;
                }
                //精灵帧数组
                var resArray = atlas.getSpriteFrames();
                var spriteFrameArray = [];
                for (var i = 0; i < resArray.length; i++) {
                    var spriteFrame = resArray[i];
                    spriteFrameArray[spriteFrame.name] = spriteFrame;
                }
                resolve(spriteFrameArray);
            });
        });
    },

    initUI: function initUI() {
        var width = 0;
        var height = 0;

        var contentNode = new cc.Node('contentNode');
        contentNode.setAnchorPoint(0, 0.5);
        this.node.addChild(contentNode);

        for (var i = 0; i < this.contentText.length; i++) {
            var a = this.contentText.charAt(i);
            var key = a;
            if ('/' == key) {
                key = 'chu';
            }
            var node = new cc.Node('Sprite' + i);
            var sp = node.addComponent(cc.Sprite);
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
        //# sourceMappingURL=SpriteFontPrefab.js.map
        