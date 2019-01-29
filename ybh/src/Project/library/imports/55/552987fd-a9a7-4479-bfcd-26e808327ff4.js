"use strict";
cc._RF.push(module, '55298f9qadEeb/NJugIMn/0', 'AFNetSpriteBase');
// framework/ui/base/AFNetSpriteBase.js

"use strict";

(window.AF = window.AF || {}).AFNetSpriteBase = cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this.listenDownload = false;
        this.listenNetSprite = false;
        this.listenDownloadFilename = "";
        this.listenNetSpriteFilename = "";
        this.isLoaded = false;
    },

    setFileName: function setFileName(filename) {

        this.node.opacity = 0;

        this.clearListen();
        this.isLoaded = false;
        if (AF.util.isLocalFileExist(filename)) {
            if (!this.listenNetSprite) {
                AF.EventDispatcher.on(AF.Event.FILE_LOADNETSPRITE, this.onFrameLoaded, this);
                this.listenNetSprite = true;
            }
            this.listenNetSpriteFilename = filename;
            AF.NetSpriteloader.startLoadNetSprite(filename);
        } else {
            if (!this.listenDownload) {
                AF.EventDispatcher.on(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded, this);
                this.listenDownload = true;
            }
            this.listenDownloadFilename = filename;
            AF.Downloader.startDownloadFile(filename);
        }
    },

    onFileDownloaded: function onFileDownloaded(filename, url) {
        if (this.listenDownloadFilename !== filename) {
            return;
        } else {
            this.clearListen();
            if (!this.listenNetSprite) {
                AF.EventDispatcher.on(AF.Event.FILE_LOADNETSPRITE, this.onFrameLoaded, this);
                this.listenNetSprite = true;
            }
            this.listenNetSpriteFilename = filename;
            AF.NetSpriteloader.startLoadNetSprite(filename);
        }
    },

    onFrameLoaded: function onFrameLoaded(filename, spriteFrame, succ) {
        if (this.listenNetSpriteFilename !== filename) return;

        if (!succ || !spriteFrame) return;
        this.creatSprite(spriteFrame);
    },

    creatSprite: function creatSprite(spriteFrame) {
        this.clearListen();
        this.node.opacity = 255;
        if (!this.sprite) {
            this.sprite = this.node.getComponent(cc.Sprite);
        }
        if (this.sprite) {
            this.sprite.spriteFrame = spriteFrame;
        }
        this.isLoaded = true;
    },

    clearListen: function clearListen() {
        if (this.listenDownload) {
            AF.EventDispatcher.off(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded, this);
            this.listenDownload = false;
            this.listenDownloadFilename = "";
        }
        if (this.listenNetSprite) {
            AF.EventDispatcher.off(AF.Event.FILE_LOADNETSPRITE, this.onFrameLoaded, this);
            this.listenNetSprite = false;
            this.listenNetSpriteFilename = "";
        }
    },

    onDestroy: function onDestroy() {
        this.clearListen();
    },

    checkLoaded: function checkLoaded() {
        return this.isLoaded;
    }
});

cc._RF.pop();