/**
 * App基类
 */

var EventDispatcher = require("af-event-dispatcher");
var Event           = require("af-event");
var Const           = require('af-const');

let JS = cc.js;

var AppBase = {

    init: function() {
        // 监听各种消息
        EventDispatcher.once(Event.GAME_LOADED, this.onInit, this);
    },

    // 初始化    
    onInit: function(){},
}

module.exports = AppBase;