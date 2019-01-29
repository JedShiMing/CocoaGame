(window.AF = window.AF || {}).AFNetSpriteBase = cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        this.listenDownload = false;
        this.listenNetSprite = false;
        this.listenDownloadFilename = "";
        this.listenNetSpriteFilename = "";
        this.isLoaded = false;

    },

    setFileName: function (filename) {
        
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


    onFileDownloaded: function (filename, url) {
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


    onFrameLoaded: function (filename, spriteFrame, succ) {
        if (this.listenNetSpriteFilename !== filename) return;

        if (!succ || !spriteFrame) return;
        this.creatSprite(spriteFrame);
    },

    creatSprite: function (spriteFrame) {
        this.clearListen();
        this.node.opacity = 255;
        if(!this.sprite){
            this.sprite = this.node.getComponent(cc.Sprite);
        }
        if(this.sprite){
            this.sprite.spriteFrame = spriteFrame;
        }
        this.isLoaded = true;
    },

    clearListen: function () {
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


    onDestroy: function () {
        this.clearListen();
    },

    checkLoaded: function () {
        return this.isLoaded;
    },
});