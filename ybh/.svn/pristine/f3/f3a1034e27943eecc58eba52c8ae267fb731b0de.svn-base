cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this.listen = false;
        this.listenFilename = "";
        this.sprite = this.node.addComponent(cc.Sprite);
    },

    setItemId: function (id) {
        var localFilename = "StoreUI/dicebox/" + id + ".png";
        this.setFileName(localFilename);
    },

    setMapId: function (mapId) {
        var localFilename = "map/" + (Array(2).join(0) + mapId).slice(-2) + ".jpg";
        this.setFileName(localFilename);
    },

    // setCloudId: function (cloudId) {
    //     var localFilename = "map/" + (Array(2).join(0) + mapId).slice(-2) + ".png";
    //     this.setFileName(localFilename);
    // },

    init: function () {
        if (!this.listen) {
            AF.EventDispatcher.on(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded, this);
            AF.EventDispatcher.on(AF.Event.FILE_LOADNETSPRITE, this.onFrameLoaded, this);
            this.listen = true;
        }
    },

    setFileName: function (filename) {
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

    clearUI: function () {
        this.listenFilename = "";
        this.node.active = false;
    },

    onDestroy: function () {
        if (this.listen) {
            this.listen = false;
            this.listenFilename = "";
            AF.EventDispatcher.off(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded, this);
            AF.EventDispatcher.off(AF.Event.FILE_LOADNETSPRITE, this.onFrameLoaded, this);
        }
    },

    onFileDownloaded: function (filename, url) {
        if (this.listenFilename !== filename) {
            return;
        }
        AF.NetSpriteloader.startLoadNetSprite(filename);
    },

    onFrameLoaded: function (filename, spriteFrame, succ) {
        if (this.listenFilename !== filename) return;

        if (!succ || !spriteFrame) return;
        this.creatSprite(spriteFrame);
    },

    creatSprite: function (spriteFrame) {
        this.node.active = true;
        this.sprite.spriteFrame = spriteFrame;
        this.listenFilename = "";
        this.isLoaded = true;
    },
    checkLoaded: function () {
        return this.isLoaded;
    },
});
