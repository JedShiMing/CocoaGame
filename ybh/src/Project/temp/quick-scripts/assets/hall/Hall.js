(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/Hall.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5fc56KixrBGLJvjUoNO2qsI', 'Hall', __filename);
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
        //# sourceMappingURL=Hall.js.map
        