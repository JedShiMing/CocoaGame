"use strict";
cc._RF.push(module, '1ca48VS1n1MLZcJmtvsqvra', 'af-app-base');
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