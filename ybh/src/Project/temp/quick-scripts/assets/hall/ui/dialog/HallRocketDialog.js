(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/dialog/HallRocketDialog.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ca64alku7JHOprJfcnqwKfP', 'HallRocketDialog', __filename);
// hall/ui/dialog/HallRocketDialog.js

'use strict';

var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        content: cc.Label
    },

    onLoad: function onLoad() {
        DialogBase.prototype.onLoad.call(this);

        var shadow = this.node.getChildByName('shadow');
        shadow.width = cc.winSize.width;
        shadow.height = cc.winSize.height;
        shadow.setPosition(0, 0);

        var messageBoxBg = this.node.getChildByName('messageBoxBg');
        messageBoxBg.setPosition(0, cc.winSize.height / 2 - 393 - messageBoxBg.height / 2);

        var closeButton = this.node.getChildByName('closeButton');
        closeButton.setPosition(messageBoxBg.x + messageBoxBg.width * 0.47, messageBoxBg.y + messageBoxBg.height * 0.47);

        var adButton = this.node.getChildByName('adButton');
        adButton.setPosition(messageBoxBg.x, messageBoxBg.y - messageBoxBg.height * 0.47);
    },

    onEnable: function onEnable() {
        DialogBase.prototype.onEnable.call(this);
        var params = AF.DIALOG_PARAMS();

        if (!params) {
            console.warn('HallRocketDialog no params!');
        }
        this.content.string = cc.js.formatStr('从%s分开始？', '' + params.score);
        this.callBack = params.callBack;
        // this.launchRocket = params.launchRocket;
        // this.cancel = params.cancel;
    },

    /********** 按钮回调函数 **********/
    onAdButtonClick: function onAdButtonClick(event, custom) {
        var _this = this;

        if (!AF.util.isVideoAdLoaded()) {
            AF.ToastMessage.show('广告暂未开放！');
            return;
        }

        AF.util.showVideoAd('power', function (res) {
            if (res) {
                _this.callBack && _this.callBack('ROCKET');
                _this.close();
            }
        });
    },

    onCancelButtonClick: function onCancelButtonClick(event, custom) {
        this.callBack && this.callBack();
        this.close();
    },

    onCloseButtonClick: function onCloseButtonClick(event, custom) {
        this.callBack && this.callBack('NORMAL');
        this.close();
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
        //# sourceMappingURL=HallRocketDialog.js.map
        