"use strict";
cc._RF.push(module, '5fc56KixrBGLJvjUoNO2qsI', 'Hall');
// hall/Hall.js

"use strict";

/**
 * 大厅App
 */

var AppBase = require('af-app-base');
var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");

var JS = cc.js;

function Hall() {}
JS.setClassName('Hall', Hall);

JS.mixin(Hall.prototype, AppBase);

JS.mixin(Hall.prototype, {

    onInit: function onInit() {
        cc.log("[HALL] hall init!");
        this.setHallDefaultAsset();
    },

    setHallDefaultAsset: function setHallDefaultAsset() {
        // 设置默认的MessageBox样式
        AF.MessageBox.resetDefaultStyle("HallDefaultMessageBox");
        AF.LoadingLayer.resetDefaultStyle("HallLoadingDialog");
    }
});

var app = new Hall();
app.init();

module.exports = app;

cc._RF.pop();