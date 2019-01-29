"use strict";
cc._RF.push(module, 'cb58bcYF35DIqSZcpvZr/j8', 'AFMarqueeNotice');
// framework/ui/widget/AFMarqueeNotice.js

'use strict';

/**
 * 跑马灯消息
 */
var Const = require("af-const");
var NoticeMgr = require('af-notice-mgr');

cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFMarqueeNotice'
    },

    properties: {
        msgPanel: {
            default: null,
            type: cc.Node,
            displayName: "消息底框"
        },
        msgLabel: {
            default: null,
            type: cc.RichText,
            displayName: "消息文本标签"
        },

        moveSpeed: {
            default: 150,
            displayName: "移动速度",
            range: [100, 500]
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._queue = [];
        this._showing = false;

        this._setZIndex();

        NoticeMgr.registerMarqueeWidget(this);

        this._setAllVisible(false);
    },

    onDestroy: function onDestroy() {
        NoticeMgr.unregisterMarqueeWidget();
    },

    show: function show(msg) {
        this._queue.push(msg);
        this._showText();
    },

    _setZIndex: function _setZIndex() {
        // 由于不能把节点放到Canvas的外部，但对话框是加在最上层的，所以需要放置在外面
        var root = cc.director.getScene();
        var node = this.node.parent;
        node.parent = root;
        node.zIndex = Const.TOAST_MESSAGE_Z_ORDER - 1;
        // var node = this.node;
        // while(true) {
        //     if (node.parent == root) {
        //         node.zIndex = Const.TOAST_MESSAGE_Z_ORDER - 1;
        //         break;
        //     } else {
        //         node = node.parent;
        //     }
        // }
    },

    _showText: function _showText() {
        if (this._queue.length <= 0 || this._showing) {
            if (this._queue.length == 0) this._onAllNoticeShowed();
            return;
        };
        this._setAllVisible(true);

        this._showing = true;
        var msg = this._queue.shift();
        this.msgLabel.string = msg || "";
        this.msgLabel.node.x = cc.winSize.width * 10;
        this.scheduleOnce(this._runMarqueeAnimation.bind(this), 0);
    },

    _runMarqueeAnimation: function _runMarqueeAnimation() {
        var panelSize = this.msgPanel.getContentSize();
        var sz = this.msgLabel.node.getContentSize();
        var node = this.msgLabel.node;
        node.x = panelSize.width * 0.5 + sz.width / 2;

        var distance = sz.width + panelSize.width;
        var duration = distance / this.moveSpeed;

        var self = this;
        var act = cc.sequence(cc.moveTo(duration, cc.v2(-sz.width / 2 - panelSize.width / 2, 0)), cc.callFunc(function () {
            self._showing = false;
            self._showText();
        }));
        node.runAction(act);
    },

    _setAllVisible: function _setAllVisible(visblie) {
        this.node.active = visblie;
    },

    _onAllNoticeShowed: function _onAllNoticeShowed() {
        this._setAllVisible(false);
    }
});

cc._RF.pop();