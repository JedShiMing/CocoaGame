var DialogBase = require('AFDialogBase');

var TypeYesNo = cc.Enum({
    LEFT_YES_RIGHT_NO: -1,
    RIGHT_YES_LEFT_NO: -1,
});

cc.Class({
    extends: DialogBase,

    editor: {
        menu: 'ApplicationFramework/AFMessageBox'
    },

    properties: {
        txTitle: {
            type: cc.Label,
            default: null,
            displayName: '标题',
        },
        txContent: {
            type: cc.Label,
            default: null,
            displayName: '内容',
        },
        richTxContent: {
            type: cc.RichText,
            default: null,
            displayName: '富文本',
        },
        btnClose: {
            type: cc.Button,
            default: null,
            displayName: '关闭按钮',
        },
        btnLeft: {
            type: cc.Button,
            default: null,
            displayName: '左边按钮',
        },
        btnRight: {
            type: cc.Button,
            default: null,
            displayName: '右边按钮',
        },
        btnMiddle: {
            type: cc.Button,
            default: null,
            displayName: '中间按钮',
        },
        typeYesNo: {
            type: TypeYesNo,
            default: TypeYesNo.LEFT_YES_RIGHT_NO,
            displayName: 'YesNo按钮排列方式',
            tooltip: '左边Yes右边No，或者左边No右边Yes'
        },
    },

    // use this for initialization
    onLoad: function () {
        DialogBase.prototype.onLoad.call(this);
    },

    onEnable: function () {
        DialogBase.prototype.onEnable.call(this);

        var option = AF.DIALOG_PARAMS();
        this._option = option;

        if (!this.validate()) return;

        this.btnClose.node.active = !!option.enableCloseButton; // 关闭按钮是否设置
        this.txTitle.string = option.title || '';
        this.txContent.string = option.content || '';
        this.richTxContent.string = option.richText || '';
        this.enableTouchEmptyPlaceToClose = option.enableTouchEmptyPlaceToClose;
        this.zOrder = option.zOrder;

        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(function () {
                if (this.zOrder) {
                    this.node.zIndex = this.zOrder;
                    this.zOrder = undefined;
                }
            }, this),
        ));
        // 设置按钮及按钮文本
        if (option.type == AF.MessageBox.TYPE_YES_NO) {
            this.btnLeft.node.active = this.btnRight.node.active = true;
            this.btnMiddle.node.active = false;
            if (option.yesButtonText || option.noButtonText || this.typeYesNo != TypeYesNo.LEFT_YES_RIGHT_NO) {
                this._setYesNoBtnText(option);
            }

        } else if (option.type == AF.MessageBox.TYPE_OK) {
            this.btnLeft.node.active = this.btnRight.node.active = false;
            this.btnMiddle.node.active = true;
            if (option.okButtonText) {
                var lb = this.btnMiddle.getComponentInChildren(cc.Label);
                if (lb) {
                    lb.string = option.okButtonText;
                }
            }
        }
        // this.node.zIndex = AF.Const.MESSAGE_BOX_Z_ORDER;
    },

    onDisable: function () {
        DialogBase.prototype.onDisable.call(this);
    },

    onDestroy: function () {
        DialogBase.prototype.onDestroy.call(this);
    },

    validate: function () {
        if (!this._option) return false;
        if (!this.txContent || !this.richTxContent || !this.txTitle || !this.btnClose
            || !this.btnLeft || !this.btnRight || !this.btnMiddle) {
            !CC_EDITOR && cc.error('invalid proterties, some component no set.');
            return false;
        }
        return true;
    },

    _setYesNoBtnText: function (option) {
        var left = this.btnLeft.getComponentInChildren(cc.Label);
        var right = this.btnRight.getComponentInChildren(cc.Label);
        if (!left || !right) return;

        var leftYes = this.typeYesNo == TypeYesNo.LEFT_YES_RIGHT_NO;

        if (!leftYes) {
            left.string = '取消';
            right.string = '确定';
        }

        if (option.yesButtonText) {
            leftYes ? left.string = option.yesButtonText : right.string = option.yesButtonText;
        }
        if (option.noButtonText) {
            leftYes ? right.string = option.noButtonText : left.string = option.noButtonText;
        }
    },

    close: function (code) {
        DialogBase.prototype.close.call(this);
        this.doCallback(code || AF.MessageBox.RET_CLOSE);
        this._option = undefined;
    },

    doCallback: function (code) {
        if (this._option && this._option.callback) {
            this._option.callback(code);
        }
    },

    onBtnCloseClicked: function () {
        this.close();
    },

    onBtnMiddle: function () {
        this.close(AF.MessageBox.RET_OK);
    },

    onBtnLeft: function () {
        var code = this.typeYesNo == TypeYesNo.LEFT_YES_RIGHT_NO
            ? AF.MessageBox.RET_YES : AF.MessageBox.RET_NO;
        this.close(code);
    },

    onBtnRight: function () {
        var code = this.typeYesNo == TypeYesNo.LEFT_YES_RIGHT_NO
            ? AF.MessageBox.RET_NO : AF.MessageBox.RET_YES;
        this.close(code);
    },
});
