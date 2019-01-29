/**
 * 大厅App
 */

var AppBase         = require('af-app-base');
var EventDispatcher = require("af-event-dispatcher");
var Event           = require("af-event");

let JS = cc.js;

function Hall () {}
JS.setClassName('Hall', Hall);

JS.mixin(Hall.prototype, AppBase);

JS.mixin(Hall.prototype, {

    onInit: function() {
        cc.log("[HALL] hall init!");
        this.setHallDefaultAsset();
    },

    setHallDefaultAsset: function () {
        // 设置默认的MessageBox样式
        AF.MessageBox.resetDefaultStyle("HallDefaultMessageBox");
        AF.LoadingLayer.resetDefaultStyle("HallLoadingDialog");
    },
});

var app = new Hall();
app.init();

module.exports = app;