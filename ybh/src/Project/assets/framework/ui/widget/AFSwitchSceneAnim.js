cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFSwitchSceneAnim'
    },

    properties: {
        inAnimClip: {
            default: null,
            type: cc.AnimationClip,
            displayName: '进入动画'
        },
        loopAnimClip: {
            default: null,
            type: cc.AnimationClip,
            displayName: '循环动画'
        },
        outAnimClip: {
            default: null,
            type: cc.AnimationClip,
            displayName: '淡出动画'
        },
    },

    onLoad: function () {
        this._anim = this.getComponent(cc.Animation);
        this._anim && this._anim.on('finished', this.onAnimCompleted, this);
        this._inAnimCallback = null;
    },

    onDestroy: function () {
        if (this._anim) {
            this._anim.off('finished', this.onAnimCompleted, this);
        }
    },

    onEnable: function () {
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;
    },

    playInAnim: function (cb) {
        this._inAnimCallback = cb;
        if (this._anim && this.inAnimClip) {
            this.node.active = true;
            this._anim.play(this.inAnimClip.name);
        } else {
            this._inAnimCallback = null;
            cb && cb();
        }
    },

    playOutAnim: function() {
        if (this._anim && this.outAnimClip) {
            this._anim.play(this.outAnimClip.name);
        }
    },

    onAnimCompleted: function (event, animationState) {
        var state = animationState;
        if (this.inAnimClip && state.name === this.inAnimClip.name) {
            if (this._inAnimCallback) {
                this._inAnimCallback();
                this._inAnimCallback = null;
            }
            if (this.loopAnimClip) {
                this._anim.play(this.loopAnimClip.name);
            }
        } else if (this.outAnimClip && state.name === this.outAnimClip.name) {
            this.node.active = false;
        }
    }
});