(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/misc/af-audio-controller.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5a164I1AKZItoozXySvTfMm', 'af-audio-controller', __filename);
// framework/misc/af-audio-controller.js

"use strict";

/**
 * 音频控制器
 */

var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");

var JS = cc.js;

var AudioMgr = {};

AudioMgr.init = function () {

    this.sounds = {};

    this.musicPlayer = null;

    this.bgmAudioID = -1;

    this.qqSounds = {};

    this.nextBGM = "";
    this.currentBGM = "";
    // 监听游戏切换到前后台
    EventDispatcher.on(Event.GMAE_ON_HIDE, this.onGameEnterBackground, this);
    EventDispatcher.on(Event.GAME_ON_SHOW, this.onGameEnterForeground, this);
    EventDispatcher.on(Event.GAME_ON_BGM, this.onGameBGM, this);
};

AudioMgr.playEffect = function (name) {
    if (AF.platform.isWxApp()) {
        this.wxPlayEffect(name);
    } else if (AF.platform.isQQApp()) {
        this.qqPlayEffect(name);
    } else {
        cc.audioEngine.play(AF.util.getSoundUrl(name), false, 1);
    }
};

AudioMgr.wxPlayEffect = function (name) {
    var list = this.sounds[name];

    if (!list) {
        list = [];
        this.sounds[name] = list;
    }

    if (list.length >= 16) {
        list[0].stop();
        list[0].destroy();
        list.splice(0, 1);
    }

    var wxAudioContext = wx.createInnerAudioContext();
    wxAudioContext.src = AF.util.getSoundUrl(name);
    wxAudioContext.play();

    list.push(wxAudioContext);

    // console.log("new: ", list.length);
};

AudioMgr.qqPlayEffect = function (name) {

    if (!AF.util.isSoundExist(name)) {
        return;
    }

    var url = AF.util.getSoundUrl(name);

    var list = this.qqSounds[name];

    if (!list) {
        list = [];
        this.qqSounds[name] = list;
    }

    var obj = null;

    for (var i = 0; i < list.length; i++) {
        if (list[i].id == 0) {
            obj = list[i];
            break;
        }
    }

    if (!obj) {
        if (list.length >= 32) {
            return;
        }

        var context = BK.createAudioContext({ 'type': 'effect', 'src': url });

        obj = {
            context: context,
            id: 0
        };

        list.push(obj);
    }

    obj.id = -1;

    obj.context.play({ complete: function complete(result) {
            obj.id = 0;
        } });
};

// 播放音效
AudioMgr.play = function (name) {
    this.playEffect(name);
};

AudioMgr.wxPlayMusic = function () {
    if (this.musicPlayer) {
        this.musicPlayer.stop();
        this.musicPlayer.destroy();
        this.musicPlayer = null;
    }

    this.musicPlayer = wx.createInnerAudioContext();

    this.musicPlayer.src = AF.util.getMusicUrl(this.nextBGM);
    this.musicPlayer.loop = true;
    this.musicPlayer.volume = 1;
    this.musicPlayer.play();

    this.currentBGM = this.nextBGM;
    this.nextBGM = "";
};

AudioMgr.qqPlayMusic = function () {
    /*
    if (this.musicPlayer) {
        this.musicPlayer.stop();
        this.musicPlayer.destroy();
        this.musicPlayer = null;
    }
      this.musicPlayer = wx.createInnerAudioContext();
      this.musicPlayer.src = AF.util.getMusicUrl(this.nextBGM);
    this.musicPlayer.loop = true;
    this.musicPlayer.volume = 1;
    this.musicPlayer.play();
      this.currentBGM = this.nextBGM;
    this.nextBGM = "";
    */
};

// 设置背景音乐
AudioMgr.playBGM = function (name) {
    this.nextBGM = name;
};

AudioMgr.stopBGM = function () {
    if (AF.platform.isWxApp()) {
        if (this.musicPlayer) {
            this.musicPlayer.stop();
            this.musicPlayer.destroy();
            this.musicPlayer = null;
        }
        return;
    }

    if (this.bgmAudioID != -1) {
        cc.audioEngine.stop(this.bgmAudioID);
        this.bgmAudioID = -1;
    }
};

AudioMgr.pauseBGM = function () {
    if (AF.platform.isWxApp()) {
        if (this.musicPlayer) {
            this.musicPlayer.pause();
        }
        return;
    }

    if (this.bgmAudioID != -1) {
        cc.audioEngine.pause(this.bgmAudioID);
    }
};

AudioMgr.resumeBGM = function () {
    if (AF.platform.isWxApp()) {
        if (this.musicPlayer) {
            this.musicPlayer.play();
        }
        return;
    }

    if (this.bgmAudioID != -1) {
        cc.audioEngine.resume(this.bgmAudioID);
    }
};

AudioMgr.onGameBGM = function () {

    if (this.nextBGM == "") {
        return;
    }

    if (AF.platform.isWxApp()) {
        this.wxPlayMusic();
        //} else if (AF.platform.isQQApp()) {
        //    this.qqPlayMusic();
    } else {
        if (this.bgmAudioID != -1) {
            var state = cc.audioEngine.getState(this.bgmAudioID);
            //console.log("state = ", state);
            if (state == 0) {
                return;
            } else if (state == 1) {
                cc.audioEngine.stop(this.bgmAudioID);
            } else if (state == 2) {
                cc.audioEngine.resume(this.bgmAudioID);
                return;
            } else {
                this.bgmAudioID = -1;
            }
        }

        if (this.bgmAudioID != -1) {
            return;
        }

        var audio = AF.util.getMusicUrl(this.nextBGM);
        this.bgmAudioID = cc.audioEngine.play(audio, true, 1);
        this.currentBGM = this.nextBGM;
        this.nextBGM = "";
    }
};

AudioMgr.playDefaultBGM = function () {
    this.playBGM("bgm");
};

AudioMgr.playButtonEffect = function (name) {
    var auidoName = name || "button";
    this.play(auidoName);
};

AudioMgr.playDialogPopOutEffect = function () {};

AudioMgr.onGameEnterBackground = function () {
    AF.audio.pauseBGM();

    // if (AF.platform.isWxApp()) {
    //     if (this.musicPlayer) {
    //         this.musicPlayer.pause();
    //     }
    //     return;
    // }

    // if (this.bgmAudioID != -1) {
    //     cc.audioEngine.pause(this.bgmAudioID);
    // }
};

AudioMgr.onGameEnterForeground = function () {
    AF.audio.resumeBGM();
    // if (AF.platform.isWxApp()) {
    //     if (this.musicPlayer) {
    //         this.musicPlayer.play();
    //     }
    //     return;
    // }

    // if (this.bgmAudioID != -1) {
    //     cc.audioEngine.resume(this.bgmAudioID);
    // }
};

AudioMgr.init();

module.exports = (window.AF = window.AF || {}).audio = AudioMgr;

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
        //# sourceMappingURL=af-audio-controller.js.map
        