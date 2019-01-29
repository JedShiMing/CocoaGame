(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/widget/AFLoadingLayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '713a7tbfNFNPJlgM1xjtFsF', 'AFLoadingLayer', __filename);
// framework/ui/widget/AFLoadingLayer.js

'use strict';

var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    editor: {
        menu: 'ApplicationFramework/AFLoadingLayer'
    },

    properties: {
        tips: {
            default: null,
            type: cc.Label,
            displayName: 'tips文本标签'
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        DialogBase.prototype.onLoad.call(this);
        this.regEvent(AF.Event.CLOSE_DIALOG_BY_NAME, this.dialogCloseEvent);
    },

    dialogCloseEvent: function dialogCloseEvent(dialogName) {
        if (dialogName === 'LOADING_LAYER') {
            cc.log("CLOSE_DIALOG_BY_NAME AFLoadingLayer close");
            this.closeImmediate();
        }
    },

    onEnable: function onEnable() {
        DialogBase.prototype.onEnable.call(this);

        var anim = this.getComponent(cc.Animation);
        if (anim) {
            var animState = anim.play();

            animState.wrapMode = cc.WrapMode.Loop;
            animState.repeatCount = Infinity;
        }

        this.show(false);
        this.scheduleOnce(function () {
            this.show(true);
        }.bind(this), 1.0);
    },

    onDisable: function onDisable() {
        DialogBase.prototype.onDisable.call(this);
    },

    onDestroy: function onDestroy() {
        DialogBase.prototype.onDestroy.call(this);
    },

    setTips: function setTips(tips) {
        if (!this.tips) return;
        this.tips.string = tips;
    },
    show: function show(isShow) {
        var panel = this.node.getChildByName("panel");
        panel.opacity = isShow ? 255 : 0;
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
        //# sourceMappingURL=AFLoadingLayer.js.map
        