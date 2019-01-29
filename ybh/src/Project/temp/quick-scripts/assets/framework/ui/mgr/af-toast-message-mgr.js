(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/mgr/af-toast-message-mgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0204aispVNOo643M8NaB9iO', 'af-toast-message-mgr', __filename);
// framework/ui/mgr/af-toast-message-mgr.js

"use strict";

/**
 * 吐司消息管理器
 */
var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");

var Const = require("af-const");

var ToastMessage = {};

var DEFAULT_MESSAGE_STYLE_PATH = 'framework/prefabs/DefaultToastMessageStyle';

var _styles = {};

// 添加样式
ToastMessage.addStyle = function (name, prefabPath) {
    cc.loader.loadRes(prefabPath, function (err, prefab) {
        if (err) {
            !CC_EDITOR && cc.error("can not default toast message style, error:", err);
            return;
        }
        _styles[name] = prefab;
    });
};

// 重置默认样式
ToastMessage.resetDefaultStyle = function (prefabPath) {
    _styles['default'] = undefined;
    if (prefabPath) {
        this.addStyle('default', prefabPath);
    }
};

ToastMessage.show = function (msg, duration, style) {
    if (msg) {
        cc.log('Toast->', msg);
        this._msgQueue = this._msgQueue || [];
        this._msgQueue.push({ text: msg, duration: duration, style: style });
        !this._hasMsgShowing && this._showMessage();
    }
};

ToastMessage._showMessage = function () {
    if (this._msgQueue.length <= 0) return;
    var msg = this._msgQueue.shift();

    // 样式
    var prefab;
    if (_styles[msg.style]) {
        prefab = _styles[msg.style];
    } else {
        prefab = _styles['default'] ? _styles['default'] : _styles['_default_'];
    }
    var node = cc.instantiate(prefab);
    node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    node.zIndex = Const.TOAST_MESSAGE_Z_ORDER;
    var com = node.getComponent("AFToastMessage");
    if (!com) return;
    var self = this;
    this._hasMsgShowing = true;
    com.showMessage(msg.text, msg.duration, function () {
        // self._showMessage();
        // self._hasMsgShowing = false;
    });
    setTimeout(function () {
        self._showMessage();
        self._hasMsgShowing = false;
    }, msg.duration * 1000);
    cc.director.getScene().addChild(node);
};

// 加载默认的吐司消息样式
// cc.game.once(cc.game.EVENT_GAME_INITED, function () {
//     ToastMessage.addStyle('_default_', DEFAULT_MESSAGE_STYLE_PATH);
// });
// 加载框架默认的吐司消息样式
EventDispatcher.once(Event.GAME_LOADED, function () {
    ToastMessage.addStyle('_default_', DEFAULT_MESSAGE_STYLE_PATH);
});

module.exports = (window.AF = window.AF || {}).ToastMessage = ToastMessage;

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
        //# sourceMappingURL=af-toast-message-mgr.js.map
        