// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFLoadingAnim'
    },

    properties: {
        inAnimClip: {
            default: null,
            type: cc.AnimationClip,
            displayName: '开始动画'
        },
        endAnimClip: {
            default: null,
            type: cc.AnimationClip,
            displayName: '结束动画'
        }
    },

    onLoad: function() {
        this._anim = this.getComponent(cc.Animation);
        this._anim.on('finished', this.onAnimEndListener, this)
    },

    onEnable: function () {
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;
    },

    onDestroy: function () {
        this._anim && this._anim.off('finished', this.onAnimEndListener, this)
    },

    playInAnim: function (cb) {
        let self = this
        if (self._anim && self.inAnimClip) {
            self.node.active = true;
            self.inAnimClipState1 = self._anim.play(this.inAnimClip.name);
            self.playoutflag = true
            cb && cb();
        }
    },

    playOutAnim: function () {
        let self = this
        self.playoutflag = false
        if (self.inAnimClipState1 && !self.inAnimClipState1.isPlaying) {
            self._anim.play(self.endAnimClip.name);
        }
    },

    onAnimEndListener: function (e, v) {
        let self = this
        if (v._clip.name === self.inAnimClip.name) { // 开始动画结束
            if (!this.playoutflag) {
                self._anim.play(self.endAnimClip.name);
            }
        } else if (v._clip.name === self.endAnimClip.name) { // 结束动画结束
            self.node.active = false;
        }
    }
});
