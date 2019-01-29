(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/widget/AFDiceBoxItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '78e4eDt9CpGpbDX/y/Mic9I', 'AFDiceBoxItem', __filename);
// framework/ui/widget/AFDiceBoxItem.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this.listen = false;
        this.listenFilename = "";
        this.sprite = this.node.addComponent(cc.Sprite);
    },

    setItemId: function setItemId(id) {
        var localFilename = "StoreUI/dicebox/" + id + ".png";
        this.setFileName(localFilename);
    },

    setMapId: function setMapId(mapId) {
        var localFilename = "map/" + (Array(2).join(0) + mapId).slice(-2) + ".jpg";
        this.setFileName(localFilename);
    },

    // setCloudId: function (cloudId) {
    //     var localFilename = "map/" + (Array(2).join(0) + mapId).slice(-2) + ".png";
    //     this.setFileName(localFilename);
    // },

    init: function init() {
        if (!this.listen) {
            AF.EventDispatcher.on(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded, this);
            AF.EventDispatcher.on(AF.Event.FILE_LOADNETSPRITE, this.onFrameLoaded, this);
            this.listen = true;
        }
    },

    setFileName: function setFileName(filename) {
        this.clearUI();
        this.init();
        this.isLoaded = false;

        this.listenFilename = filename;

        if (AF.util.isLocalFileExist(filename)) {
            AF.NetSpriteloader.startLoadNetSprite(filename);
        } else {
            AF.Downloader.startDownloadFile(filename);
        }
    },

    clearUI: function clearUI() {
        this.listenFilename = "";
        this.node.active = false;
    },

    onDestroy: function onDestroy() {
        if (this.listen) {
            this.listen = false;
            this.listenFilename = "";
            AF.EventDispatcher.off(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded, this);
            AF.EventDispatcher.off(AF.Event.FILE_LOADNETSPRITE, this.onFrameLoaded, this);
        }
    },

    onFileDownloaded: function onFileDownloaded(filename, url) {
        if (this.listenFilename !== filename) {
            return;
        }
        AF.NetSpriteloader.startLoadNetSprite(filename);
    },

    onFrameLoaded: function onFrameLoaded(filename, spriteFrame, succ) {
        if (this.listenFilename !== filename) return;

        if (!succ || !spriteFrame) return;
        this.creatSprite(spriteFrame);
    },

    creatSprite: function creatSprite(spriteFrame) {
        this.node.active = true;
        this.sprite.spriteFrame = spriteFrame;
        this.listenFilename = "";
        this.isLoaded = true;
    },
    checkLoaded: function checkLoaded() {
        return this.isLoaded;
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
        //# sourceMappingURL=AFDiceBoxItem.js.map
        