/**
 * 散图加载管理器函数
 */
var RESOURCES_TYPE = {
    EFFECT: 0,
    PLAYER: 0,
    SCENE: 0,
};

var baseKey = 0;
for (var k in RESOURCES_TYPE) {
    RESOURCES_TYPE[k] = ++baseKey;
}

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

var Frameloader = {
    init: function () {
        this.loadingFiles = {};
    },

    startLoadFile: function (name, type) {
        //type 1 effect 2 player 3 scene

        if (this.loadingFiles[name]) { return; }

        this.loadingFiles[name] = { name: name, type: type };

        switch (type) {
            case RESOURCES_TYPE.EFFECT:
                this.processLoadEffectFile(name);
                break;
            case RESOURCES_TYPE.PLAYER:
                this.processLoadPlayerFile(name);
                break;
            case RESOURCES_TYPE.SCENE:
                this.processLoadSceneFile(name);
                break;
            default:
                break;
        }
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
    
    processLoadEffectFile: function (name) {
        var pictureUrl = this.getUrl('effect/' + name + '.png');
        var plistUrl = this.getUrl('effect/' + name + '.plist');
        var self = this;
        Promise.all([loadResourcesFile(pictureUrl), loadResourcesFile(plistUrl)]).then((res) => {
            var picture = res[0];
            var plist = res[1];
            var frames = self.getFrames(picture, plist, name, 0);
            self.emitLoadEnded(name, frames, true);
        }, (err) => {
            self.emitLoadEnded(name, [], false);
        });
    },

    processLoadPlayerFile: function (name) {
        var pictureUrl = this.getUrl('player/' + name + '.png');
        var plistUrl = this.getUrl('player/' + name + '.plist');
        var self = this;
        Promise.all([loadResourcesFile(pictureUrl), loadResourcesFile(plistUrl)]).then((res) => {
            var picture = res[0];
            var plist = res[1];
            var frames = self.getFrames(picture, plist, name, 1);
            self.emitLoadEnded(name, frames, true);
        }, (err) => {
            self.emitLoadEnded(name, [], false);
        });
    },

    processLoadSceneFile: function (name) {
        var pictureUrl = this.getUrl('scene/' + name + '.png');
        var plistUrl = this.getUrl('scene/' + name + '.plist');
        var self = this;
        Promise.all([loadResourcesFile(pictureUrl), loadResourcesFile(plistUrl)]).then((res) => {
            var picture = res[0];
            var plist = res[1];
            var frames = self.getFrameOfScene(picture, plist, name, 1);
            self.emitLoadEnded(name, frames, true);
        }, (err) => {
            self.emitLoadEnded(name, {}, false);
        });
    }, 

    getFrames: function (sourcePicture, sourcePlist, name, startActionIndex) {
        var actionIndex = startActionIndex;
        var index = 1;
        var frames = [[], []];

        while (true) {
            var actionName = AF.Const.ActionName[actionIndex];

            var filename = name;
            if (actionName !== '') {
                filename += '_';
                filename += actionName;
            }
            filename += '_';
            filename += (Array(4).join(0) + index).slice(-4);
            filename += '.png';
            
            if (!frames[actionIndex]) {
                frames[actionIndex] = [];
            }

            if (!sourcePlist.frames.hasOwnProperty(filename)) {
                if (actionIndex > 0 && actionIndex < AF.Const.ActionName.length - 1) {
                    actionIndex++;
                    index = 1;
                    continue;
                } else {
                    break;
                }
            }
            var sp = this.createSpriteFrame(sourcePicture, sourcePlist.frames[filename]);
            frames[actionIndex].push(sp);
            index++;
        }
        return frames;
    },

    createSpriteFrame: function (sourcePicture, frameInfo) {
        var frame = AF.util.parseNums(frameInfo.frame);
        var rotated = frameInfo.rotated;
        var offset = AF.util.parseNums(frameInfo.offset);
        var sourceSize = AF.util.parseNums(frameInfo.sourceSize);

        var rect = cc.rect(frame[0], frame[1], frame[2], frame[3]);
        var pos = cc.v2(offset[0], offset[1]);
        var size = cc.size(sourceSize[0], sourceSize[1]);
        return new cc.SpriteFrame(sourcePicture, rect, rotated, pos, size);
    },

    getFrameOfScene: function (sourcePicture, sourcePlist) {
        var frames = {};
        var keys = Object.keys(sourcePlist.frames);
        for (let i = 0; i < keys.length; i++) {
            var filename = keys[i];
            var sp = this.createSpriteFrame(sourcePicture, sourcePlist.frames[filename]);
            frames[filename] = sp;
        }
        return frames;
    },

    emitLoadEnded: function (filename, frames, succ) {
        this.loadingFiles[filename] = null;
        AF.EventDispatcher.emit(AF.Event.FILE_LOADFRAME, filename, frames, succ);
    },

};

Frameloader.init();

AF.Frameloader = module.exports = Frameloader;