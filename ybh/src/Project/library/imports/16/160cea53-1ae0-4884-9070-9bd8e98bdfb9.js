"use strict";
cc._RF.push(module, '160cepTGuBIhJBwm9jpi9+5', 'AFAudioClip');
// framework/ui/component/AFAudioClip.js

'use strict';

(window.AF = window.AF || {}).AudioClip = cc.Class({
    name: 'AFAudioClip',
    properties: {
        clip: {
            type: cc.AudioClip,
            default: null,
            displayName: '音频'
        },
        _volume: undefined,
        volume: {
            get: function get() {
                return this._volume ? this._volume : 1;
            },
            set: function set(value) {
                value = cc.clamp01(value);
                this._volume = value;
                return value;
            },
            displayName: '音量'
        },
        mute: {
            default: false,
            displayName: 'Mute',
            tooltip: '禁用该音乐'
        }
    },

    // use this for initialization
    play: function play(loop, volume) {
        if (!this.clip) return;
        if (this.mute) return;
        if (!cc.js.isNumber(volume) || volume > 0 || volume <= 1) {
            volume = this._volume;
        }
        //AF.audio.play(this.clip);
    },

    clone: function clone() {
        return new AF.AudioClip();
    }
});

AF.AudioClip.DEFAULT = function () {
    return new AF.AudioClip();
};

cc._RF.pop();