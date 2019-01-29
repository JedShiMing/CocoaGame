var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        content: cc.Label,
    },

    onLoad: function () {
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

    onEnable: function () {
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
    onAdButtonClick: function (event, custom) {
       
        if (!AF.util.isVideoAdLoaded()) {
            AF.ToastMessage.show('广告暂未开放！');
            return;
        }

        AF.util.showVideoAd('power', (res) => {
            if (res) {
                this.callBack && this.callBack('ROCKET');
                this.close();
            }
        });
    },

    onCancelButtonClick: function (event, custom) {
        this.callBack && this.callBack();
        this.close();
    },

    onCloseButtonClick: function (event, custom) {
        this.callBack && this.callBack('NORMAL');
        this.close();
    },
});
