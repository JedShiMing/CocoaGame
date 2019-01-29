(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/base/AFDialogBase.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c125043iHFJV5wM9jJsjAyo', 'AFDialogBase', __filename);
// framework/ui/base/AFDialogBase.js

"use strict";

var SceneMgr = require('af-scene-mgr');

var IN_OUT_ACTION_TAG = 1298;

(window.AF = window.AF || {}).DialogBase = cc.Class({
    extends: cc.Component,

    properties: {
        enableInOutAction: {
            default: false,
            displayName: "启用弹出/关闭效果"
        },
        // 弹窗/关闭效果的 action tag
        inOutActionTag: {
            default: 1298,
            visible: false
        },

        enableTouchEmptyPlaceToClose: {
            default: false,
            displayName: "点击空白处关闭"
        },

        // maskColor: {
        //     default: cc.color(155, 0, 0),
        //     displayName: "蒙板颜色",
        // },

        // hideDialog: CC_EDITOR && {
        //     type: cc.Boolean,
        //     displayName: "隐藏(编辑器中)",
        //     set: function(value) {
        //         this._hideDialog = value;
        //         this.node.opacity = 0;
        //     },
        //     get: function () {
        //         return !!this._hideDialog;
        //     },
        // },

        isSceneDialog: {
            default: false,
            displayName: "场景对话框",
            tooltip: "是否是挂在场景上边的对话框"
        },

        noHideOtherDialog: {
            default: false,
            displayName: "不隐藏其他对话框",
            tooltip: "打开本对话框时不隐藏之前打开的对话框"
        },

        noHideBelowDialog: {
            default: false,
            displayName: "始终显示",
            tooltip: "在打开其它对话框时不隐藏本对话框"
        },

        enableDialogPopOutAudioEffect: {
            default: false,
            displayName: '开启弹出音效'
        },
        dialogPopOutAudioEffect: {
            type: cc.AudioClip,
            default: null,
            displayName: '弹出音效'
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.uiSceneTouchEnable = false;

        this.listenEvents = [];

        // 注册场景对话框
        if (this.isSceneDialog) {
            var name = this.node.name;
            SceneMgr.instance.registerDialog(name, this.node);
            this.node.active = true;
            // this.node.opacity = 255;
        }

        this._isClosing = false;

        // 给对话框填一个mask
        this.addMask();

        AF.EventDispatcher.on(AF.Event.WILL_OPEN_DIALOG, this.willOpenDialog, this);
        AF.EventDispatcher.on(AF.Event.UI_SCENE_TOUCH_ENABLE, this.setUISceneTouchEnable, this);
    },

    onEnable: function onEnable() {
        this.runInAction();
        // this.enableInOutAction && this.runInAction();
        // 监听点击事件
        this._mask.on('touchstart', this.onTouchEmptyPlace, this);

        // 弹出音效
        if (this.enableDialogPopOutAudioEffect) {
            AF.audio.playDialogPopOutEffect();
        }
    },

    onDisable: function onDisable() {
        this._mask.off('touchstart', this.onTouchEmptyPlace, this);
    },

    onDestroy: function onDestroy() {

        AF.EventDispatcher.off(AF.Event.WILL_OPEN_DIALOG, this.willOpenDialog);
        AF.EventDispatcher.off(AF.Event.UI_SCENE_TOUCH_ENABLE, this.setUISceneTouchEnable);
        this.unregAllEvents();

        // 注册场景对话框
        if (this.isSceneDialog) {
            var name = this.node.name;
            SceneMgr.instance.unregisterDialog(name, this.node);
        }
    },

    regEvent: function regEvent(eventType, callback) {
        for (var i = 0; i < this.listenEvents.length; i++) {
            var event = this.listenEvents[i];
            if (event.type === eventType) {
                return;
            }
        }

        this.listenEvents.push({ type: eventType, callback: callback });
        AF.EventDispatcher.on(eventType, callback, this);
    },

    unregEvent: function unregEvent(eventType) {
        for (var i = 0; i < this.listenEvents.length; i++) {
            var event = this.listenEvents[i];
            if (event.type === eventType) {
                AF.EventDispatcher.off(event.type, event.callback, this);
                this.listenEvents.splice(i, 1);
                return;
            }
        }
    },

    unregAllEvents: function unregAllEvents() {
        for (var i = 0; i < this.listenEvents.length; i++) {
            var event = this.listenEvents[i];
            AF.EventDispatcher.off(event.type, event.callback, this);
        }

        this.listenEvents = [];
    },

    _getCanvasNode: function _getCanvasNode() {
        var scene = cc.director.getScene();
        var canvas = scene.getChildByName("Canvas");
        if (canvas) return canvas;
        var children = scene.children;
        var len = children.length;
        for (var i = 0; i < len; ++i) {
            cc.log("Node: " + children[i]);
            if (children[i].getComponent(cc.Canvas)) {
                return children[i];
            }
        }
    },
    // 给对话框填一个mask    
    addMask: function addMask() {
        var children = this.node.children;
        var len = children.length;
        for (var i = 0; i < len; ++i) {
            children[i].zIndex += 1;
        }
        var winSize = cc.winSize;
        var mask = new cc.Node("DialogMask");
        mask.zIndex = 0;
        mask.width = winSize.width;
        mask.height = winSize.height;
        // mask.color = this.maskColor;
        this._mask = mask;
        this.node.addChild(mask);
    },

    onTouchEmptyPlace: function onTouchEmptyPlace(touch) {
        if (!this.uiSceneTouchEnable) {
            return;
        }
        if (!this.enableTouchEmptyPlaceToClose) {
            return;
        }
        var panel = this.node.getChildByName("panel");
        if (!panel) {
            panel = this.node;
        }
        var pt = panel.convertTouchToNodeSpace(touch);
        var sz = panel.getContentSize();
        var rect = cc.rect(0, 0, sz.width, sz.height);
        if (!cc.rectContainsPoint(rect, pt)) {
            this.close();
        }
        return true;
    },

    willOpenDialog: function willOpenDialog() {
        this.uiSceneTouchEnable = false;
    },

    setUISceneTouchEnable: function setUISceneTouchEnable() {
        this.uiSceneTouchEnable = true;
    },

    _getRootNode: function _getRootNode() {
        if (this.isSceneDialog) return this.node;
        var root = cc.director.getScene();
        var node = this.node;
        while (true) {
            if (node.parent == root) {
                return node;
            } else {
                node = node.parent;
            }
        }
    },

    close: function close() {
        this._isClosing = true;
        this.runOutAction(function () {
            this._isClosing = false;
            var node = this._getRootNode();
            SceneMgr.instance.onDialogClosed(node.name, node);
        }.bind(this));
    },

    closeImmediate: function closeImmediate() {
        var node = this._getRootNode();
        SceneMgr.instance.onDialogClosed(node.name, node);
    },

    isClosing: function isClosing() {
        return this._isClosing = true;
    },

    // 窗口弹出动画action, 可以重载
    runInAction: function runInAction() {
        if (!this.enableInOutAction) {
            AF.EventDispatcher.emit(AF.Event.UI_SCENE_TOUCH_ENABLE, true);
            return;
        }
        var node = this.node;
        node.stopActionByTag(this.inOutActionTag);
        var center = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        center = this.node.parent.convertToNodeSpace(center);
        node.setPosition(center);
        node.scale = 0.6;
        node.opacity = 0;
        var act = cc.spawn(cc.scaleTo(0.35, 1).easing(cc.easeBackOut()), cc.fadeTo(0.35, 255));
        var seq = cc.sequence(act, cc.callFunc(function () {
            AF.EventDispatcher.emit(AF.Event.UI_SCENE_TOUCH_ENABLE, true);
        }));
        seq.setTag(this.inOutActionTag);
        node.runAction(seq);
    },
    // 窗口隐藏动画,动画完成必须回调onComplete
    runOutAction: function runOutAction(onComplete) {
        if (!this.enableInOutAction) {
            onComplete && onComplete();
            return;
        }
        var node = this.node;
        node.stopActionByTag(this.inOutActionTag);
        var act = cc.sequence(cc.spawn(cc.scaleTo(0.1, 0.6), cc.fadeTo(0.1, 0.4), cc.moveBy(0.1, cc.p(0, -50))), cc.callFunc(onComplete));
        act.setTag(this.inOutActionTag);
        node.runAction(act);
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
        //# sourceMappingURL=AFDialogBase.js.map
        