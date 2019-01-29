cc.Class({
    extends: cc.Component,

    properties: {
        heroShadow: {
            default: null,
            type: cc.Node,
            displayName: "英雄影子"
        },
        userTips: {
            default: null,
            type: cc.Node,
            displayName: "头上标签"
        },
        loadEffectNode: {
            default: null,
            type: cc.Node,
            displayName: "加载节点"
        },
        playerNode: {
            default: null,
            type: cc.Node,
            displayName: "英雄动画节点"
        },
        effectNode: {
            default: null,
            type: cc.Node,
            displayName: "特效挂载点"
        },
        effectBgNode: {
            default: null,
            type: cc.Node,
            displayName: "特效挂载点(背面)"
        },
        hudunNode: {
            default: null,
            type: cc.Node,
            displayName: "hudun挂载点"
        },
        faintNode: {
            default: null,
            type: cc.Node,
            displayName: "faint挂载点"
        },
        nickNameNode: {
            default: null,
            type: cc.Node,
            displayName: "昵称"
        },

        effectPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: "特效预制件"
        },
        defaultDuration: {
            default: 0.8,
            displayName: "持续时间",
            range: [0.5, 1.5]
        },
        loadEffect: {
            default: false,
            displayName: "启用/关闭加载效果",
            tooltip: "启用/关闭 加载效果",
        },
        rolename: cc.Label,
        floatNode: cc.Node,

        expProgressPre: cc.Prefab,
    },

    onLoad: function () {
        this.listen = false;
        this.listenFilename = "";

        this._isMoving = false;
        this.durationTime = 0;

        this.zOrderDelegate = null;

        this.runAudioDuration = 0;
        this.runAudioInterval = (0.8 + (Math.random() * 3) / 10);

        this.tPos = cc.v2(0, 0);

        this._isLoaded = false;
        this.flipX = false;
        this.playerScale = 1;

        this.defaultAction = { actionType: "wait", repeatCount: Infinity, frameIndex: 0, as: 100 };
        this.currentActionIndex = 0;
        this.currentActionLoop = 1;

        this.actionList = [];//{actionType: 动作名,repeatCount:次数, frameIndex: 静态图帧数设定 从1开始 }
        this.actionLoop = false;


        this.floatLabel = [];
        this.labelInitX = 0;
        this.labelXArr = [10, 20];

        this.actions = {};
        this.sprPlayer = this.playerNode.getComponent(cc.Sprite);
        this.aniAction = this.playerNode.getComponent(cc.Animation);
        this.anistate;

        this.dead = false;

        this.aniAction.on('finished', this.onFinished, this);


        this._loadFontRes();
        this.schedule(this._updatePos, 0, this);
        this.schedule(this._updateFloatLabel, 0, this);
        this.schedule(this._updateLarge, 0.03, this);
        this.loadEffectNode.active = this.loadEffect;

        this.last_float_ms = 0;

        this.currentLarge = 0;
        this.nextLarge = -1;

        this.hudunEffect = null;

        this.faintEffect = null;

        AF.EventDispatcher.on(AF.Event.FILE_LOADFRAME, this.onLoadFrameEnded, this);
    },

    _loadFontRes: function () {
        var self = this;
        cc.loader.loadRes("hall/font/FontRoomSmall", cc.BitmapFont, function (err, bmFont) {
            self.fontRoomSmall = bmFont;
        });
        cc.loader.loadRes("hall/font/FontWin", cc.BitmapFont, function (err, bmFont) {
            self.fontWin = bmFont;
        });
    },

    doMove: function (duration, tPos) {
        this.durationTime += duration;
        this.tPos = tPos;
        if (this.anistate && "run" === this.anistate.name) {
        } else if (!this.isMoving()) {
            this.playAction("run", true);
        }
        this._isMoving = true;
    },

    createEffect: function (isBg) {
        var effect = AF.util.createPrefabNode(this.effectPrefab);
        var comp = null;
        if (isBg) {
            this.effectBgNode.addChild(effect);
            comp = effect.getComponent("EffectPrefab");
            this.effectMgr[0].push(comp);
        } else {
            this.effectNode.addChild(effect);
            comp = effect.getComponent("EffectPrefab");
            this.effectMgr[1].push(comp);
        }
        return comp;
    },

    setFlipX: function (flipX) {

        var scale = this.playerScale;
        scale *= this.getLargeScale();

        if (flipX) {
            this.playerNode.scaleX = -1 * scale;
        } else {
            this.playerNode.scaleX = scale;
        }

        this.playerNode.scaleY = scale;
        this.flipX = flipX;
    },

    getFlipX: function () {
        return this.flipX;
    },

    getPlayerScale: function () {
        return this.playerScale;
    },

    getBodyPosition(pt) {

        var x = 0;
        var y = 0;

        var cfi = AF.GameConfig.getPlayerInfo(this.playerId);

        if (cfi) {
            if (pt == 1) {
                x = cfi.chest.x;
                y = cfi.chest.y;
            } else if (pt == 2) {
                x = cfi.head.x;
                y = cfi.head.y;
            }
        }

        var scale = this.playerScale;

        scale *= this.getLargeScale();

        x = x * scale;
        y = y * scale;

        return { x: x, y: y };
    },

    setPlayerID: function (playerId) {
        // if ("undefined" === typeof this.sprPlayer || "undefined" === this.aniAction) {
        //     this.onLoad();
        // }


        this.clearUI();
        var cfi = AF.GameConfig.getPlayerInfo(playerId);
        if (!cfi) {
            return;
        }
        this.playerScale = cfi.scale;
        this.playerNode.scale = this.playerScale;
        this.playerId = playerId;
        this.listenFilename = cfi.model;
        for (const key in cfi.actions) {
            if (cfi.actions.hasOwnProperty(key)) {
                this.actions[key] = AF.util.deepCopy(cfi.actions[key], {});
            }
        }
        // this.actions
        this.head = cfi.head || { x: 0, y: 0 };
        this.body = cfi.chest || { x: 0, y: 0 };
        this.userTips.setPosition(this.head.x, this.head.y + 15);

        this.setUserTips(false);
        this.setHeroShadow(true);

        this.nickNameNode.active = false;

        this.defaultPoise = { showAction: cfi.showAction, show: cfi.show };
        // this.playerNode.y = -1 * this.foot;
        AF.Frameloader.startLoadFile(this.listenFilename, 2);
    },

    getPlayerSprite: function () {
        return this.sprPlayer;
    },

    setNickName: function (name, offsetY, fontSize, color) {
        if ("" === name) {
            this.nickNameNode.active = false;
            return;
        }
        this.nickNameNode.active = true;
        var offsetY = offsetY || 10;
        var fontSize = fontSize || 40;
        var color = color || new cc.Color(0, 0, 0);

        this.nickNameNode.setPosition(cc.v2(this.head.x, offsetY));
        this.nickNameNode.color = color;

        var nickNameLabel = this.nickNameNode.getComponent(cc.Label);

        nickNameLabel.fontSize = fontSize;
        nickNameLabel.lineHeight = fontSize;
        nickNameLabel.string = AF.util.cutstr(name, 8);
    },

    disableNickName: function () {
        this.nickNameNode.active = false;
    },

    setRoleName: function (name) {
        // if (name.length > 8) {
        //     var str = "";
        //     for (let i = 0; i < 8; i++) {
        //         str += name[i];
        //     }

        //     name = str;
        // }

        // if (name == "") {
        //     return;
        // }
        this.rolename.string = AF.util.cutstr(name, 8);
    },

    setPlayerAnchor: function (x, y) {
        this.playerNode.anchorX = x;
        this.playerNode.anchorY = y;
    },

    setLoadEffect: function (visable) {
        this.loadEffect = visable;
        if (!this._isLoaded) {
            this.loadEffectNode.active = this.loadEffect;
        }
    },

    stopAction: function () {
        if (this.aniAction) {
            this.aniAction.stop();
        }
    },

    playDefaultPoise: function () {
        this.playAction(this.defaultPoise.showAction, true, this.defaultPoise.show);
    },
    playSingleFrame: function (actionType, frameIndex) {
        this.playAction(actionType, true, frameIndex);
    },

    /*
    this.actionLoop = false;
        this.actionList = [];
        this.currentActionIndex = 0;
        this.currentActionLoop = 1;
    */

    playAction: function (actionType, loop, frameIndex) {
        var frameIndex = frameIndex || 0;
        var loop = loop || false;

        var obj = {};
        obj.actionType = actionType;
        obj.frameIndex = frameIndex;
        obj.repeatCount = 1;

        if (loop) {
            obj.repeatCount = Infinity;
        }

        var actions = [];
        actions.push(obj);

        this.playActions(actions, false);
    },
    //actions =[{actionType: 动作名,frameIndex:帧, repeatCount:次数 }]
    playActions: function (actions, loop) {

        if (this.isMoving()) {
            this.node.x = this.tPos.x;
            this.node.y = this.tPos.y;
            this._isMoving = false;
        }

        this.actionList = [];

        for (let i = 0; i < actions.length; i++) {
            var obj = {};
            obj.actionType = actions[i].actionType;
            obj.frameIndex = actions[i].frameIndex || 0;
            obj.repeatCount = actions[i].repeatCount || 1;
            obj.as = actions[i].as || 100;

            this.actionList.push(obj);
        }

        this.actionLoop = loop;

        this.currentActionIndex = 0;
        this.currentActionLoop = 1;

        this._playAni();
    },

    isLoaded: function () {
        return this._isLoaded;
    },

    isMoving: function () {
        return this._isMoving;
    },

    showFloatLabel: function (content, type, cs) {
        type = type || 0
        this.floatLabel.push({ content: content, type: type, cs: cs });
    },

    clearUI: function () {
        this.clearListen();
        this.loadEffectNode.active = this.loadEffect;

        this._isMoving = false;
        this.durationTime = 0;

        this.runAudioDuration = 0;

        this.tPos = cc.v2(0, 0);

        this._isLoaded = false;
        this.flipX = false;

        this.floatLabel = [];
        this.labelInitX = 0;
        this.labelXArr = [10, 20];

        this.actions = [];

        this.setFlipX(false);
        var clips = this.aniAction.getClips();
        for (let i = 0; i < clips.length; i++) {
            this.aniAction.removeClip(clips[i], true);
        }


    },

    onDestroy: function () {
        this.clearListen();
        this.aniAction.off('finished', this.onFinished, this);
        AF.EventDispatcher.off(AF.Event.FILE_LOADFRAME, this.onLoadFrameEnded, this);
    },

    createClip: function () {

        var clips = this.aniAction.getClips();
        for (let i = 0; i < clips.length; i++) {
            this.aniAction.removeClip(clips[i], true);
        }
        var actionInfo = this.actionList[this.currentActionIndex];
        var actionName = actionInfo.actionType;
        var action = this.actions[actionName];
        if (!action) {
            cc.error(this.playerId + '的' + actionName + '不存在');
            actionName = 'wait';
            action = this.actions[actionName];
        }
        this.setPlayerAnchor(action.x, action.y);
        var frames = [];
        if (!action.frames || action.frames.length <= 0) {
            cc.error("palyerId:" + this.playerId + "的" + actionName + "动作缺失!,播放wait动作替代!");
            actionName = 'wait';
            action = this.actions[actionName];
        }
        if (0 < actionInfo.frameIndex && actionInfo.frameIndex <= action.frames.length) {
            frames[0] = action.frames[actionInfo.frameIndex - 1];
        } else {
            frames = action.frames;
        }

        if (actionInfo.frameIndex == -1) {
            if (action.frames.length > 0) {
                frames = [];
                frames.push(action.frames[action.frames.length - 1]);
            }
        }


        if (frames.length <= 0) {
            frames = this.actions["wait"].frames;
        }

        this.sprPlayer.spriteFrame = frames[0];
        var clip = cc.AnimationClip.createWithSpriteFrames(frames, action.rate);
        clip.name = actionName;
        if (Infinity === actionInfo.repeatCount) {
            clip.wrapMode = cc.WrapMode.Loop;
        } else {
            clip.wrapMode = cc.WrapMode.Normal;
        }
        clip.sample = 10;
        clip.speed = actionInfo.as / 100;
        this.aniAction.addClip(clip, actionName);
        return this.aniAction.play(actionName);
    },

    onLoadFrameEnded: function (playerName, frames, succ) {
        if (this.listenFilename !== playerName) {
            return;
        }
        this.clearListen();

        if (!succ) {
            cc.error('onLoadFrameEnded fail');
            return;
        }

        for (let i = 1; i <= AF.Const.ActionName.length - 1; i++) {
            var actionType = AF.Const.ActionName[i];
            this.actions[actionType].frames = [];
            this.actions[actionType].frames = frames[i];
        }

        //this.node.active = true;
        this.loadEffectNode.active = false;
        this._isLoaded = true;
        if (this.actionList.length <= 0) {
            this.actionList.push(this.defaultAction);
            this.currentActionIndex = 0;
            this.currentActionLoop = 1;
        }
        this._playAni();
    },

    onPlayNextAction: function () {

        var currentAction = this.actionList[this.currentActionIndex];

        if (Infinity === currentAction.repeatCount) {
            return;
        }

        if (this.currentActionLoop < currentAction.repeatCount) {
            this.currentActionLoop++;
            return;
        }

        this.currentActionIndex++;
        this.currentActionLoop = 1;

        if (this.currentActionIndex >= this.actionList.length) {
            if (this.actionLoop) {
                this.currentActionIndex = 0;
                this.currentActionLoop = 1;
            } else {
                this.actionList = [];
                this.actionList.push(this.defaultAction);
                this.currentActionIndex = 0;
                this.currentActionLoop = 1;
            }
        }
    },

    onFinished: function (event) {
        if (this.dead && this.anistate.name === "dead") {
            this.playSingleFrame("dead", -1);
        } else {
            this.onPlayNextAction();
            this._playAni();
        }
    },

    _playAni: function () {
        if (!this.isLoaded()) return;
        this.stopAction();
        this.anistate = this.createClip();
    },

    _updateFloatLabel: function (dt) {

        if (this.floatLabel.length <= 0) {
            return;
        }

        var SPLIT = 300;

        var this_float_ms = AF.util.getCurrTime();

        if (this_float_ms <= this.last_float_ms + SPLIT) {
            return;
        }

        var lableInfo = this.floatLabel[0];
        this.floatLabel.splice(0, 1);

        var label = new cc.Node();
        label.scale = 0.1;
        label.opacity = 0;
        var text = label.addComponent(cc.Label);
        text.isSystemFontUsed = false;
        text.font = this.fontWin;
        text.overflow = cc.Label.Overflow.NONE;

        //var outline = label.addComponent(cc.LabelOutline);
        //outline.width = 0.8;

        //根据type来修改内容

        var str = cc.js.formatStr("%d", lableInfo.content);

        if (lableInfo.content > 0) {
            str = "+" + str;
        }

        if (lableInfo.content > 0) {
            text.fontSize = 36;
            label.color = cc.color(95, 201, 34);

            if (lableInfo.cs) {
                text.fontSize *= 1.2;
            }
        } else {
            text.fontSize = 36;
            label.color = cc.color(255, 255, 0);
            if (lableInfo.cs) {
                text.fontSize *= 1.2;
                label.color = cc.color(255, 25, 7);
            }
        }

        text.lineHeight = text.fontSize + 6;
        //outline.color = label.color;

        text.string = str;
        this.labelInitX++;
        this.labelInitX %= this.labelXArr.length;
        var dir = (Math.abs(this.playerNode.scaleX) / this.playerNode.scaleX) * -1;
        var offsetX = this.labelXArr[this.labelInitX] * dir;
        label.setPosition(cc.v2(this.head.x + offsetX, this.head.y + 30));
        this.floatNode.addChild(label, 100);

        this.last_float_ms = this_float_ms;

        var self = this;
        var actions = [];

        if (lableInfo.type == 1) {
            label.setPosition(cc.v2(this.head.x, this.head.y + 30));
            label.scale = 1;
            label.opacity = 255;
            var show = cc.spawn(
                cc.moveBy(1.0, cc.v2(0, 100)),
                cc.fadeOut(1.0)
            );
            actions.push(show);

        } else {
            var show = cc.spawn(
                cc.bezierTo(0.5, [
                    cc.v2(this.head.x + offsetX + dir * 5, this.head.y + 50),
                    cc.v2(this.head.x + offsetX + dir * 10, this.head.y + 100),
                    cc.v2(this.head.x + offsetX + dir * 15, this.head.y + 40)]),
                cc.scaleTo(0.5, 0.8).easing(cc.easeBackOut()),
                cc.fadeIn(0.3),
            );
            actions.push(show);

            var doStop = cc.delayTime(1.0 / 60.0);
            actions.push(doStop);

            var disappear = cc.spawn(
                cc.callFunc(function () {
                }),
                cc.scaleTo(self.defaultDuration, 0.5).easing(cc.easeBackOut()),
                cc.fadeOut(self.defaultDuration),
            );
            actions.push(disappear);
        }



        var doDestroy = cc.callFunc(function () {
            label.destroy();
        });
        actions.push(doDestroy);

        var act = cc.sequence(actions);
        label.runAction(act);
    },

    setUserTips: function (active) {
        this.userTips.active = active;
    },

    setHeroShadow: function (active) {
        this.heroShadow.active = active;
    },

    setZOrderDelegate: function (delegate) {
        this.zOrderDelegate = delegate;
    },

    setZOrder: function () {
        if (this.zOrderDelegate) {
            this.node.zIndex = this.zOrderDelegate.getPlayerZOrder(this.node.y);
        }
    },

    getZOrder: function () {
        return this.node.zIndex;
    },

    _updatePos: function (dt) {
        if (!this.isMoving()) return;
        if (this.durationTime <= dt) {
            this._isMoving = false;
            this.node.x = this.tPos.x;
            this.node.y = this.tPos.y;
            this.durationTime = 0;
            //恢复默认动作
            this.actionList = [];
            this.actionList.push(this.defaultAction);
            this.currentActionIndex = 0;
            this.currentActionLoop = 1;
            this._playAni();
            return;
        }
        var speed = dt / this.durationTime;
        var dx = (this.tPos.x - this.node.x) * speed;
        var dy = (this.tPos.y - this.node.y) * speed;
        this.node.x += dx;
        this.node.y += dy;
        this.setZOrder();
        if (dx < 0) {
            this.setFlipX(true);
        } else if (dx > 0) {
            this.setFlipX(false);
        }
        this.durationTime -= dt;

        this.runAudioDuration += dt;
        if (this.runAudioDuration >= this.runAudioInterval) {
            this.runAudioDuration = 0;
        }
    },

    setDead: function (dead) {
        this.dead = dead;

        if (this.dead) {
            this.clearFaint();
            this.clearHudun();
        }
    },

    clearListen: function () {
        this.listenFilename = null;
    },

    _updateLarge: function (dt) {
        if (this.nextLarge == -1) {
            return;
        }

        if (this.currentLarge > this.nextLarge) {
            this.currentLarge--;
        } else if (this.currentLarge < this.nextLarge) {
            this.currentLarge++;
        }

        var pos = this.getBodyPosition(2);

        this.followPlayerScale(this.hudunEffect);
        this.followPlayerScale(this.faintEffect);

        this.setFlipX(this.flipX);

        if (this.currentLarge == this.nextLarge) {
            this.nextLarge = -1;
        }
    },

    getLargeScale: function () {
        return 1 + this.currentLarge * 0.02;
    },

    setLarge: function (large) {
        this.nextLarge = large * 5;
    },

    getLevelupEffectInfo: function (pNode, name) {
        var index = 1;
        var effectComp = null;
        while (true) {
            let effect = pNode.getChildByName(name + index);
            if (!effect) { break; }

            let comp = effect.getComponent('EffectPrefab');
            if (!comp) { break; }

            if (!comp.checkWorking()) {
                effectComp = comp;
                break;
            }
            index++;
        }
        if (!effectComp) {
            var newEffect = cc.instantiate(this.effectPrefab);
            newEffect.setAnchorPoint(0.5, 0);
            newEffect.y = 45;
            pNode.addChild(newEffect, 1, name + index);
            effectComp = newEffect.getComponent('EffectPrefab');
        }
        return { comp: effectComp, name: name + index };
    },

    playLevelupAni: function () {

        let fgEffectInfo = this.getLevelupEffectInfo(this.effectNode, 'playerlevelupfg');
        let fgEffectName = fgEffectInfo.name;
        let levelupFgEffect = fgEffectInfo.comp;
        levelupFgEffect.setFlipX(this.flipX);

        let bgEffectInfo = this.getLevelupEffectInfo(this.effectBgNode, 'playerlevelupbg');
        let bgEffectName = bgEffectInfo.name;
        let levelupBgEffect = bgEffectInfo.comp;
        levelupBgEffect.setFlipX(this.flipX);

        levelupFgEffect.doStart('playerlevelupfg', 1, 1, 20, null, 0);
        levelupBgEffect.doStart('playerlevelupbg', 1, 1, 20, null, 0);

        levelupFgEffect.setNodeName(fgEffectName);
        levelupBgEffect.setNodeName(bgEffectName);
    },

    setExpProgressY: function (posY) {
        let expProgressNode = this.node.getChildByName('expProgressNode');
        if (!expProgressNode) {
            return;
        }
        expProgressNode.getComponent("ProgressBasePrefab").setExpProgressY(posY);
    },

    showGain: function (gainInfo, maxDelayTime) {
        let expProgressNode = this.node.getChildByName('expProgressNode');
        if (!expProgressNode) {
            expProgressNode = cc.instantiate(this.expProgressPre);
            this.node.addChild(expProgressNode, 1, 'expProgressNode');
        } else {
            expProgressNode.stopAllActions();
            expProgressNode.getComponent("ProgressBasePrefab").init();
            expProgressNode.active = true;
        }

        let actions = [];
        actions.push(cc.callFunc(function (target, args) {
            target.getComponent("ProgressBasePrefab").showGain(gainInfo);
        }));
        actions.push(cc.delayTime(1.0));
        if (gainInfo.list.length > 0) {
            let list = gainInfo.list;
            actions.push(cc.callFunc(function (target, args) {
                target.getComponent("ProgressBasePrefab").showExp(list);
            }));
            actions.push(cc.delayTime(maxDelayTime + 2.0));
        }
        actions.push(cc.callFunc(function (target, args) {
            target.active = false;
        }));
        expProgressNode.runAction(cc.sequence(actions));
    },

    showHudun: function (is_hudun) {

        if (is_hudun) {
            if (!this.hudunEffect) {
                var effect = AF.util.createPrefabNode(this.effectPrefab);
                this.hudunNode.addChild(effect);
                var pt = this.getBodyPosition(1);
                /*(265 / 2 - 37) / 265 => 37:泡泡盾距离中心点Y轴偏差,265:泡泡盾大小*/
                effect.getChildByName('effectAni').setAnchorPoint(0.5, (265 / 2 - 37) / 265);
                effect.setPosition(2 - pt.x, 0);
                if (this.getFlipX()) {
                    effect.setPosition(pt.x - 2, 0);
                }
                effect.getComponent("EffectPrefab").doStart('paopaodun', 1, Infinity, null, null, null);
                this.hudunEffect = effect;
            }
            this.hudunEffect.active = true;
            this.followPlayerScale(this.hudunEffect);
        } else {
            this.clearHudun();
        }
    },

    showFaint: function (is_faint) {

        if (is_faint) {
            this.playSingleFrame("wait", 1);

            if (!this.faintEffect) {
                var effect = AF.util.createPrefabNode(this.effectPrefab);
                this.faintNode.addChild(effect);
                var pt = this.getBodyPosition(2);

                pt.x -= 8;
                pt.y += 35;
                if (this.getFlipX()) {
                    pt.x = 0 - pt.x
                }

                effect.setPosition(pt);
                effect.getComponent("EffectPrefab").doStart('faint', 1, Infinity, null, null, null);
                this.faintEffect = effect;
            }
            this.faintEffect.active = true;
            this.followPlayerScale(this.faintEffect);
        } else {
            this.playAction("wait", true);
            this.clearFaint();
        }
    },

    clearFaint: function () {
        if (this.faintEffect) {
            this.faintEffect.active = false;
        }
    },

    clearHudun: function () {
        if (this.hudunEffect) {
            this.hudunEffect.active = false;
        }
    },

    followPlayerScale: function (node) {

        var scale = this.playerScale;

        scale *= this.getLargeScale();

        if (node) {
            node.scale = scale;
        }
    },

});
