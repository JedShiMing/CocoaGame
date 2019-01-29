(window.AF = window.AF || {}).AudioClip = cc.Class({
    name: 'AFAudioClip',
    properties: {
        clip: {
            type: cc.AudioClip,
            default: null,
            displayName: '音频',
        },
        _volume: undefined,
        volume: {
            get: function () {
                return this._volume ? this._volume : 1;
            },
            set: function (value) {
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
    play: function (loop, volume) {
        if (!this.clip) return;
        if (this.mute) return;
        if (!cc.js.isNumber(volume) || volume > 0 || volume <= 1) {
            volume = this._volume;
        } 
        //AF.audio.play(this.clip);
    },

    clone: function() {
        return new AF.AudioClip();
    }
});

AF.AudioClip.DEFAULT = function() { return new AF.AudioClip(); };