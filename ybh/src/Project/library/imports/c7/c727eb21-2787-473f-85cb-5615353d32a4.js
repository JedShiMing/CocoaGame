"use strict";
cc._RF.push(module, 'c727eshJ4dHP4XLVhU1PTKk', 'StonePrefab');
// hall/ui/widget/StonePrefab.js

'use strict';

var stone_velocity_config = {
    low: {
        width: 200,
        baseDt: 0.9,
        minSpeed: 160,
        maxSpeed: 300
    },
    middle: {
        width: 156,
        baseDt: 0.7,
        minSpeed: 160,
        maxSpeed: 320
    },
    height: {
        width: 100,
        baseDt: 0.75,
        minSpeed: 200,
        maxSpeed: 400
    }
};

cc.Class({
    extends: cc.Component,

    properties: {
        sotneSpriteframes: {
            default: [],
            type: cc.SpriteFrame
        },
        tipsSpriteframes: {
            default: [],
            type: cc.SpriteFrame
        },
        scoreNode: cc.Node,
        light: cc.Node,
        stoneNode: cc.Node,
        effectPre: cc.Prefab
    },

    onLoad: function onLoad() {
        this.node.width = 60;
        this.node.height = 40;
        this.node.setAnchorPoint(0.5, 0);
        this.light.opacity = 0;

        var effectNode = cc.instantiate(this.effectPre);
        this.node.addChild(effectNode);
        this.effectScript = effectNode.getComponent('EffectPrefab');
    },

    init: function init() {
        this.scoreNode.opacity = 0;
    },

    setStoneType: function setStoneType(type, effectName) {
        this.stoneType = type;
        switch (type) {
            case 'stone':
                this.stoneNode.active = true;
                this.effectScript.node.active = false;
                this.setNewColor();
                break;
            case 'fireball':
                this.stoneNode.active = false;
                this.effectScript.node.active = true;
                break;
            default:
                break;
        }
    },

    setStoneRect: function setStoneRect(width, height) {

        this.node.width = width || 60;
        this.node.height = height || 40;

        // this.stoneNode.width = width || 60;
        // this.stoneNode.height = height || 40;

        this.light.width = this.node.width;
        this.light.height = this.node.height;

        this.setCenterPosition(this.stoneNode);
        this.setCenterPosition(this.effectScript.node);
    },

    getStoneRect: function getStoneRect() {
        return this.node.getBoundingBox();
        // this.node.getRect();
        // var a = new cc.Rect(0, 10, 20, 20);
        // var b = new cc.Rect(0, 10, 10, 10);
        // cc.rectIntersectsRect(a, b); // true;
    },

    setCenterPosition: function setCenterPosition(node) {
        var cAPos = node.getAnchorPoint();
        var pAPos = this.node.getAnchorPoint();
        var x = (cAPos.x - pAPos.x) * this.node.width;
        var y = (cAPos.y - pAPos.y) * this.node.height;
        node.setPosition(x, y);
    },

    setNewColor: function setNewColor(width) {
        // var r = Math.ceil(Math.random() * 255 * 5) % 256;
        // var g = Math.ceil(Math.random() * 255 * 5) % 256;
        // var b = Math.ceil(Math.random() * 255 * 5) % 256;
        // let color = new cc.Color(r, g, b);
        // this.stoneNode.color = color;
        var sotneSprite = null;
        if (width === stone_velocity_config.low.width) {
            sotneSprite = this.sotneSpriteframes[0];
        } else if (width === stone_velocity_config.middle.width) {
            sotneSprite = this.sotneSpriteframes[1];
        } else if (width === stone_velocity_config.height.width) {
            sotneSprite = this.sotneSpriteframes[2];
        }
        this.stoneNode.getComponent(cc.Sprite).spriteFrame = sotneSprite;
        // if (Math.random() * 10 > 5) {
        //     this.stoneNode.scaleX = -1;
        // } else {
        //     this.stoneNode.scaleX = 1;
        // }
    },

    showScore: function showScore(score, tipType) {
        // return;
        var index = -1;
        var addIconNode = this.scoreNode.getChildByName("addIcon");
        var scoreNumNode = this.scoreNode.getChildByName("scoreNum");
        scoreNumNode.getComponent(cc.Label).string = '+' + score;
        var tipsNode = this.scoreNode.getChildByName("tips");
        scoreNumNode.x = 10;
        scoreNumNode.y = 36;
        if (index >= 0) {
            tipsNode.active = true;
            tipsNode.getComponent(cc.Sprite).spriteFrame = this.tipsSpriteframes[index];
        } else {
            tipsNode.active = false;
        }
        var particleSystem = this.node.getComponentInChildren(cc.ParticleSystem);
        switch (tipType) {
            case 'normal':
                break;
            case 'danger':
                break;
            case 'perfect':
                particleSystem.resetSystem();
                break;
            case 'goodJob':
                particleSystem.resetSystem();
                break;
            default:
                break;
        }
        /*addIconNode.x = 15;
        scoreNumNode.x = 52;
        addIconNode.y = 3;
        scoreNumNode.y = 3;
        var particleSystem = this.node.getComponentInChildren(cc.ParticleSystem);
        // particleSystem.posVar.x = 0.7 * this.stoneNode.width;
        // console.log('应该',0.7 * this.stoneNode.width);
        // console.log('particleSystem',particleSystem.posVar);
        switch (tipType) {
            case 'normal':
                index = -1;
                addIconNode.x = 10;
                scoreNumNode.x = 47;
                addIconNode.y = 36;
                scoreNumNode.y = 36;
                break;
            case 'danger':
                index = 0;
                break;
            case 'perfect':
                index = 1;
                particleSystem.resetSystem();
                break;
            case 'goodJob':
                index = 1;
                particleSystem.resetSystem();
                break;
            default:
                break;
        }
        index = -1;
        addIconNode.x = 10;
        scoreNumNode.x = 47;
        addIconNode.y = 36;
        scoreNumNode.y = 36;
        if (index >= 0) {
            tipsNode.active = true;
            tipsNode.getComponent(cc.Sprite).spriteFrame = this.tipsSpriteframes[index];
        } else {
            tipsNode.active = false;
        }*/

        var x = this.node.width * 0.5 + 5;
        var y = 0;
        this.scoreNode.setPosition(x, y);
        this.scoreNode.opacity = 255;
    },

    showScoreFadeAction: function showScoreFadeAction() {
        // return;
        var particleSystem = this.node.getComponentInChildren(cc.ParticleSystem);
        particleSystem.stopSystem();
        this.scoreNode.runAction(cc.sequence(cc.spawn(cc.moveBy(0.4, cc.v2(60, 0)).easing(cc.easeBackOut()), cc.fadeTo(0.4, 150)), cc.fadeOut(1 / 60)));
    },

    showLight: function showLight() {
        this.light.stopAllActions();
        this.light.width = this.node.width;
        this.light.height = this.node.height;
        this.light.setScale(0.85);
        this.light.opacity = 0;
        this.light.runAction(cc.sequence(cc.fadeTo(0.08, 255 * 0.95), cc.scaleTo(0.1, 1.1), cc.spawn(cc.fadeTo(0.36, 0), cc.scaleTo(0.36, 1.5))));
    }
});

cc._RF.pop();