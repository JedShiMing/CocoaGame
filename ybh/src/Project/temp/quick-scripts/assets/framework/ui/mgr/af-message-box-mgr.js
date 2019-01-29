(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/mgr/af-message-box-mgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '108ebK6Re1LsaOnFtwU/OVr', 'af-message-box-mgr', __filename);
// framework/ui/mgr/af-message-box-mgr.js

"use strict";

/**
 * MessageBox管理器
 */

var Const = require("af-const");
var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");

var DEFAULT_MESSAGE_BOX_STYLE_NAME = 'DefaultMessageBoxStyle';
var _styles = {};

var MessageBox = {};

var WECHAT_SUBSCRIPTION = '像素物语';

// message box 类型， ok模式/确认取消模式
MessageBox.TYPE_OK = 1;
MessageBox.TYPE_YES_NO = 2;

// 用户操作回调
MessageBox.RET_OK = 1;
MessageBox.RET_YES = 2;
MessageBox.RET_NO = 3;
MessageBox.RET_CLOSE = 4;

// 添加样式
MessageBox.addStyle = function (name, prefabName) {
    console.log("name: ", name, ", prefabName: ", prefabName);
    _styles[name] = prefabName;
    AF.preloadDialog(prefabName);
};

// 重置默认样式
MessageBox.resetDefaultStyle = function (prefabName) {
    console.log("prefabName: ", prefabName);
    _styles['default'] = undefined;
    if (prefabName) {
        this.addStyle('default', prefabName);
    }
};

/**
 * option : {
 *      type:  类型 ( TYPE_OK 或 TYPE_YES_NO )
 *      title:  标题
 *      content: 内容
 *      richText: 富文本内容
 *      callback: 回调
 *      enableCloseButton: 是否显示关闭按钮 (默认kaiqi)
 *      okButtonText: OK按钮文本
 *      yesButtonText: Yes按钮文本
 *      noButtonText: No按钮文本
 *      enableTouchEmptyPlaceToClose: 点击空白处关闭
 *      style: 样式名
 *      zOrder: 层级 
 * }
 */
MessageBox.show = function (option) {
    var prefabName;
    if (option.style && _styles[option.style]) {
        prefabName = _styles[option.style];
    } else {
        prefabName = _styles['default'] ? _styles['default'] : _styles['_default_'];
    }
    if (option.enableTouchEmptyPlaceToClose === undefined) {
        option.enableTouchEmptyPlaceToClose = true;
    }
    AF.openDialog(prefabName, option);
};

MessageBox.YesNo = function (title, content, callback, yesButtonText, noButtonText, enableTouchEmptyPlaceToClose) {
    MessageBox.show({
        type: MessageBox.TYPE_YES_NO,
        title: title,
        content: content,
        callback: callback,
        yesButtonText: yesButtonText,
        noButtonText: noButtonText,
        enableCloseButton: false,
        enableTouchEmptyPlaceToClose: enableTouchEmptyPlaceToClose
    });
};

MessageBox.OK = function (title, content, callback, okButtonText, enableTouchEmptyPlaceToClose, enableCloseButton) {
    MessageBox.show({
        type: MessageBox.TYPE_OK,
        title: title,
        content: content,
        callback: callback,
        okButtonText: okButtonText || '确定',
        enableCloseButton: enableCloseButton || false,
        enableTouchEmptyPlaceToClose: enableTouchEmptyPlaceToClose
    });
};

MessageBox.NetError = function (content) {
    MessageBox.show({
        type: MessageBox.TYPE_OK,
        title: '',
        content: '老大,网络发生错误!',
        callback: function callback(code) {
            AF.gotoScene("HallLoginScene");
        },
        okButtonText: '重连',
        enableCloseButton: false,
        enableTouchEmptyPlaceToClose: false,
        zOrder: AF.Const.MESSAGE_BOX_Z_ORDER
    });
};

// // 加载框架默认的吐司消息样式
// EventDispatcher.once(Event.GAME_LOADED, function () {
//     MessageBox.addStyle('_default_', DEFAULT_MESSAGE_BOX_STYLE_NAME);
// });

module.exports = (window.AF = window.AF || {}).MessageBox = MessageBox;

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
        //# sourceMappingURL=af-message-box-mgr.js.map
        