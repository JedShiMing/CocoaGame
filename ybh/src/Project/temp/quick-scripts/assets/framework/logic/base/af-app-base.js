(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/logic/base/af-app-base.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1ca48VS1n1MLZcJmtvsqvra', 'af-app-base', __filename);
// framework/logic/base/af-app-base.js

"use strict";

/**
 * App基类
 */

var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");
var Const = require('af-const');

var JS = cc.js;

var AppBase = {

    init: function init() {
        // 监听各种消息
        EventDispatcher.once(Event.GAME_LOADED, this.onInit, this);
    },

    // 初始化    
    onInit: function onInit() {}
};

module.exports = AppBase;

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
        //# sourceMappingURL=af-app-base.js.map
        