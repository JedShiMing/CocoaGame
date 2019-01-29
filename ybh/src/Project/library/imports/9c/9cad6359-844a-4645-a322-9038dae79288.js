"use strict";
cc._RF.push(module, '9cad6NZhEpGRaMikDja55KI', 'AFClickWidgetAttach');
// framework/ui/component/AFClickWidgetAttach.js

'use strict';

// var BUTTON_TYPE = cc.Class({ NORMAL, START });
var BUTTON_TYPE = cc.Enum({
    NORMAL: -1,
    START: -1,
    GOLD: -1,
    CRYSTAL: -1
});
cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFClickWidgetAttach'
    },

    properties: {
        clickEffect: {
            type: cc.AudioClip,
            default: null,
            displayName: '点击音效'
        },

        enableClickAudioEffect: {
            default: true,
            displayName: "开启点击音效"
        },
        buttonType: {
            type: BUTTON_TYPE,
            default: BUTTON_TYPE.NORMAL,
            displayName: '按钮类型',
            tooltip: '气泡或者正常'
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on('touchend', this.onClicked, this);
    },

    onDestroy: function onDestroy() {
        this.node.off('touchend', this.onClicked, this);
    },

    onClicked: function onClicked() {
        if (!this.enableClickAudioEffect) {
            return;
        }
        var btn = this.getComponent('cc.Button');
        if (!btn) {
            btn = this.getComponent('cc.Toggle');
        }
        if (!btn.interactable || !btn.enabledInHierarchy) {
            AF.audio.playButtonEffect('button_disable');
            return;
        }
        if (!btn._pressed) {
            return;
        }
        if (this.buttonType === BUTTON_TYPE.NORMAL) {
            AF.audio.playButtonEffect('button');
        } else if (this.buttonType === BUTTON_TYPE.START) {
            AF.audio.playButtonEffect('bubble');
        } else if (this.buttonType === BUTTON_TYPE.GOLD) {
            AF.audio.playButtonEffect('gold');
        } else if (this.buttonType === BUTTON_TYPE.CRYSTAL) {
            AF.audio.playButtonEffect('crystal');
        }
    }
});

cc._RF.pop();