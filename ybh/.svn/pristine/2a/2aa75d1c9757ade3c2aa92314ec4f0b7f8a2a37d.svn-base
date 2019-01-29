var AFPlayEffect = cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFPlayEffect'
    },

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);

        this.hide();
    },

    show: function(clipName, cb) {
        this.node.active = true;

        if(this._hiding) {
            this.unschedule(this._hide);
            this._hiding = false;
        }

        var clip = clipName || this.anim.defaultClip.name;
        this.anim.play(clip);
        
        if (cb) {
            this.anim.targetOff(this);
            this.anim.on('finished',  function(){
                cb && cb();
                cb = undefined;
            }, this);
        }
    },

    _onAnimFinished: function () {

    },

    hide: function(clipName) {
        if(this.node.active) {
            var clip = clipName || this.anim.defaultClip.name;

            this.anim.play(clip);
            this.anim.setCurrentTime(0);
            this.anim.sample();
            this.anim.stop();
            if (!this._hiding) {
                this._hiding = true;
                this.scheduleOnce(this._hide, 0);
            }
        }
    },

    gotoTime: function (time, clipName) {
        this.anim.play(clipName);
        this.anim.setCurrentTime(time, clipName);
        this.anim.sample();
        this.anim.stop();
    },

    gotoLastFrame: function (clipName) {
        var clip;
        if (clipName === undefined) {
            clip = this.anim.currentClip  || this.anim.defaultClip;
        } else {
            var clips = this.anim.getClips();
            for (var i = 0; i < clips.length; ++i) {
                if (clips[i].name == clipName) {
                    clip = clips[i];
                    break;
                }
            }
        }
        if (!clip) return;
        this.anim.play(clip.name);
        this.anim.setCurrentTime(clip.duration, clip.name);
        this.anim.sample();
        this.anim.stop();
    },

    _hide: function() {
        this.node.active = false;
        this._hiding = false;
    }
});