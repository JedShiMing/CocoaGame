(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/widget/EffectPrefab.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0fdc9ObS0VIobmZMFvQzAys', 'EffectPrefab', __filename);
// hall/ui/widget/EffectPrefab.js

"use strict";

var EFFECT_TYPE = {
    COUNT: 1, //计次
    TIME: 2, //计时
    MAP: 3, //地图
    CUSTOM: 4 //自定义
};

cc.Class({
    extends: cc.Component,

    properties: {
        aniNode: cc.Node
    },

    onLoad: function onLoad() {
        this.aniName = "";
        this.listenFilename = "";
        this.moveInfo = null;
        this.rate = 10;
        this.delayTime = 0;
        this.sp = this.aniNode.getComponent(cc.Sprite);
        this.ani = this.aniNode.getComponent(cc.Animation);
        this.ani.on('finished', this.onFinished, this);
        this.isLoaded = false;
        this.working = false;
        this.effectKey = "";
        AF.EventDispatcher.on(AF.Event.FILE_LOADFRAME, this.onLoadFrameEnded, this);

        this.isStart = false;
    },

    // 该特效接口 自动播放
    // name 特效名
    // type 1计次 2计时 3 地图特效 4 自定义特效
    // params 0=> repeatCount 1=> playTime  重复次数和播放时间
    // rate 帧数/s
    // moveInfo null || {dest,speedType} 移动信息 {目标点,速度类型0匀速 1加速 2减速 }
    // delaytime 延迟时间
    doStart: function doStart(name, type, params, rate, moveInfo, delayTime) {
        this.stopState = false;

        if (!name) {
            cc.error('特效预制件doStart参数name错误', name);
            // this.node.destroy();
            return;
        }
        // console.log("特效 创建", name);

        if (!this.node) {
            console.warn('该节点已经被销毁');
            return;
        }

        if (!this.node.parent) {
            console.warn('该节点的父节点已经被销毁');
            return;
        }

        this.isLoaded = false;

        this.node.active = true;
        this.aniNode.active = false;

        this.working = true;

        this.node.name = name;
        this.type = type;
        this.params = params;
        this.rate = rate || 10;
        this.moveInfo = moveInfo;
        this.delayTime = delayTime || 0;

        if (this.delayTime) {
            var act = cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
                this.isStart = true;
                this.isLoaded = this.tryPlayEffect(name);
                if (!this.isLoaded) {
                    this.listenFilename = name;
                    AF.Frameloader.startLoadFile(this.listenFilename, 1);
                }
            }, this));
            this.node.runAction(act);
        } else {
            this.isStart = true;
            this.isLoaded = this.tryPlayEffect(name);
            if (!this.isLoaded) {
                this.listenFilename = name;
                AF.Frameloader.startLoadFile(this.listenFilename, 1);
            }
        }
    },

    setNodeName: function setNodeName(name) {
        if (this.node) {
            this.node.name = name;
        }
    },

    tryPlayEffect: function tryPlayEffect(name) {
        if (!this.checkAnimationExist(name)) {
            return false;
        }
        if (this.moveInfo) {
            this.doMoveAction();
        } else {
            this.node.rotation = 0;
        }
        this.aniName = name;
        return this.playAniByName(this.aniName);
    },

    setMapEffect: function setMapEffect(name) {
        if (this.aniName === name) {
            return;
        }
        this.aniName = "";
        var clips = this.ani.getClips();
        for (var i = 0; i < clips.length; i++) {
            var clip = clips[i];
            if (name === clip.name) {
                this.aniName = name;
                break;
            }
        }
        if (this.aniName) {
            this.ani.play(this.aniName);
            return;
        }
        this.rate = 10;
        this.type = EFFECT_TYPE.MAP;
        this.listenFilename = name;

        AF.Frameloader.startLoadFile(this.listenFilename, 1);
    },

    checkAnimationExist: function checkAnimationExist(name) {
        if (!this.ani) {
            return false;
        }
        var clips = this.ani.getClips();
        for (var i = 0; i < clips.length; i++) {
            var clip = clips[i];
            if (name === clip.name) {
                return true;
            }
        }
        return false;
    },

    addAnimation: function addAnimation(name, type, params, rate) {

        if (this.playAniByName(name)) {
            return;
        }
        this.rate = rate || 10;
        this.type = type;
        this.params = params;
        this.listenFilename = name;
        AF.Frameloader.startLoadFile(this.listenFilename, 1);
    },

    playAniByName: function playAniByName(name) {
        if (!this.checkAnimationExist(name)) {
            return false;
        }
        // console.log('正在播放', name);
        this.aniNode.active = true;
        this.node.active = true;
        this.ani.play(name);
        return true;
    },
    stopAniByName: function stopAniByName(name) {
        this.stopState = true;
        this.aniNode.active = false;
        this.node.active = false;

        if (!this.checkAnimationExist(name)) {
            return false;
        }
        this.ani.stop(name);
        return true;
    },


    setFlipX: function setFlipX(flipX) {
        if (flipX) {
            this.aniNode.scaleX = Math.abs(this.aniNode.scaleX) * -1;
        } else {
            this.aniNode.scaleX = Math.abs(this.aniNode.scaleX);
        }
    },

    setEffectKey: function setEffectKey(effectKey) {
        this.effectKey = effectKey;
    },

    checkLoaded: function checkLoaded() {
        return this.isLoaded;
    },

    checkWorking: function checkWorking() {
        return this.working;
    },

    onFinished: function onFinished(event) {
        if (EFFECT_TYPE.COUNT === this.type) {

            if (this.params > 0 && this.params != Infinity) {
                this.params--;
            }

            if (this.params > 0 || this.params == Infinity) {
                this.ani.play(this.aniName);
            }
            return;
        }
        if (EFFECT_TYPE.TIME === this.type) {
            this.ani.play(this.aniName);
            return;
        }
        if (EFFECT_TYPE.MAP === this.type) {
            var self = this;
            if (!self.aniName) {
                return;
            }
            var delayTime = 1 + Math.floor(Math.random() * 5);
            self.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
                self.ani.play(self.aniName);
            })));
            return;
        }
    },

    onLoadFrameEnded: function onLoadFrameEnded(name, frames, succ) {
        if (this.listenFilename !== "" && this.listenFilename === name) {
            if (!succ) {
                console.warn('特效预帧动画' + name + '加载失败');
                // this.node.destroy();
                return;
            }
        } else {
            return;
        }
        this.listenFilename = "";
        if (frames[0].length <= 0) {
            console.warn('特效预帧动画' + name + '加载失败');
            // this.node.destroy();
            return;
        }
        // console.log('特效加载成功', name);
        this.createAni(name, frames);

        this.isLoaded = true;
        if (this.stopState) {
            this.aniNode.active = false;
            this.node.active = false;
            return;
        }

        if (this.moveInfo) {
            this.doMoveAction();
        } else {
            this.node.rotation = 0;
        }
        this.playAniByName(this.aniName);
    },

    createAni: function createAni(name, frames) {
        this.aniName = name;
        this.sp.spriteFrame = frames[0][0];
        this.node.width = this.aniNode.width;
        this.node.height = this.aniNode.height;
        var clip = cc.AnimationClip.createWithSpriteFrames(frames[0], this.rate);

        clip.name = name;
        clip.wrapMode = cc.WrapMode.Normal;
        clip.sample = 10;
        clip.speed = 1;
        this.ani.addClip(clip, name);
    },

    doMoveAction: function doMoveAction() {
        this.node.active = true;
        this.aniNode.active = true;
        var mt;
        //rotation
        if (this.moveInfo.rotation) {
            var dt = cc.pSub(this.node.position, this.moveInfo.dest);
            //计算角度
            var radian = Math.atan2(dt.x, dt.y);
            var dir = Math.abs(this.aniNode.scaleX) / this.aniNode.scaleX;
            if (-1 === dir) {
                this.node.rotation = (180 * radian / Math.PI + 270) % 360;
            } else {
                this.node.rotation = (180 * radian / Math.PI + 90) % 360;
            }
        }

        if (1 === this.moveInfo.speedType) {
            mt = cc.moveTo(this.params, this.moveInfo.dest).easing(cc.easeSineIn());
        } else if (2 === this.moveInfo.speedType) {
            mt = cc.moveTo(this.params, this.moveInfo.dest).easing(cc.easeSineOut());
        } else {
            mt = cc.moveTo(this.params, this.moveInfo.dest);
        }
        this.node.runAction(mt);
    },

    onDestroy: function onDestroy() {
        // console.log("特效 销毁", this.aniName);
        this.ani.off('finished', this.onFinished, this);
        AF.EventDispatcher.off(AF.Event.FILE_LOADFRAME, this.onLoadFrameEnded, this);
    },

    update: function update(dt) {
        if (!this.isStart) return;

        if (EFFECT_TYPE.COUNT === this.type) {

            if (this.params == Infinity) {
                return;
            }

            if (this.params <= 0) {
                this.aniNode.active = false;
                this.node.active = false;
                this.working = false;
            }
            return;
        }
        if (EFFECT_TYPE.TIME === this.type) {
            this.params -= dt;
            if (this.params <= 0) {
                this.aniNode.active = false;
                this.node.active = false;
                this.working = false;
            }
            return;
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
        //# sourceMappingURL=EffectPrefab.js.map
        