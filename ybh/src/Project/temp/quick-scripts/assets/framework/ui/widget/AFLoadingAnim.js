(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/widget/AFLoadingAnim.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'daa4b0LNVtKh5Shxvu6skbT', 'AFLoadingAnim', __filename);
// framework/ui/widget/AFLoadingAnim.js

'use strict';

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

    onLoad: function onLoad() {
        this._anim = this.getComponent(cc.Animation);
        this._anim.on('finished', this.onAnimEndListener, this);
    },

    onEnable: function onEnable() {
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;
    },

    onDestroy: function onDestroy() {
        this._anim && this._anim.off('finished', this.onAnimEndListener, this);
    },

    playInAnim: function playInAnim(cb) {
        var self = this;
        if (self._anim && self.inAnimClip) {
            self.node.active = true;
            self.inAnimClipState1 = self._anim.play(this.inAnimClip.name);
            self.playoutflag = true;
            cb && cb();
        }
    },

    playOutAnim: function playOutAnim() {
        var self = this;
        self.playoutflag = false;
        if (self.inAnimClipState1 && !self.inAnimClipState1.isPlaying) {
            self._anim.play(self.endAnimClip.name);
        }
    },

    onAnimEndListener: function onAnimEndListener(e, v) {
        var self = this;
        if (v._clip.name === self.inAnimClip.name) {
            // 开始动画结束
            if (!this.playoutflag) {
                self._anim.play(self.endAnimClip.name);
            }
        } else if (v._clip.name === self.endAnimClip.name) {
            // 结束动画结束
            self.node.active = false;
        }
    }
});

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
        //# sourceMappingURL=AFLoadingAnim.js.map
        