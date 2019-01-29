/**
 * 单张图片加载管理函数
 */

function loadResourcesFile(url) {
    return new Promise(function (resolve, rejec) {
        cc.loader.load(url, function (err, res) {
            if (err) {
                rejec(err);
                return;
            }
            resolve(res);
        });
    });
}


var NetSpriteloader = {
    init: function () {
        this.allNeedLoadFiles = new Array();
        this.currLoadFileInfo = null;
        this.loadingFiles = {};
    },

    startLoadNetSprite: function (filename) {

        if (this.loadingFiles[filename]) { return; }

        this.loadingFiles[filename] = { name: filename };
        this.processLoadFile(filename);
    },

    getUrl: function (filename) {
        var url = '';
        if (AF.platform.isWxApp() || AF.platform.isQQApp()) {
            url = AF.util.getLocalFilePath(filename);

            if (!AF.util.isLocalFileExist(filename)) {
                url = AF.util.getRemoteUrl(filename);
            }
        }
        else {
            url = AF.util.getRemoteUrl(filename);
        }
        return url;
    },

    processLoadFile: function (filename) {

        var pictureUrl = this.getUrl(filename);
        var self = this;
        loadResourcesFile(pictureUrl).then((res) => {
            var spriteFrame = new cc.SpriteFrame(res);
            self.emitLoadEnded(filename, spriteFrame, true);
        }, (err) => {
            self.emitLoadEnded(filename, null, false);

        });
    },

    emitLoadEnded: function (filename, spriteFrame, succ) {
        this.loadingFiles[filename] = null;
        AF.EventDispatcher.emit(AF.Event.FILE_LOADNETSPRITE, filename, spriteFrame, succ);
    },

};

NetSpriteloader.init();

AF.NetSpriteloader = module.exports = NetSpriteloader;
