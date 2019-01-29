(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/dialog/HallWaitingDialog.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '28ab0nTqb9JrJjhGJIrqU9q', 'HallWaitingDialog', __filename);
// hall/ui/dialog/HallWaitingDialog.js

'use strict';

var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        bg: cc.Node,
        effectPre: cc.Prefab
    },
    onLoad: function onLoad() {
        DialogBase.prototype.onLoad.call(this);
        AF.EventDispatcher.on(AF.Event.CLOSE_WAIT_DIALOG, this.doCloseAction, this);
    },

    onDestroy: function onDestroy() {
        DialogBase.prototype.onDestroy.call(this);
        AF.EventDispatcher.off(AF.Event.CLOSE_WAIT_DIALOG, this.doCloseAction, this);
    },

    doCloseAction: function doCloseAction() {
        var self = this;
        this.bg.runAction(cc.sequence(cc.fadeOut(2), cc.callFunc(function () {
            self.close();
        })));
    }
});

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
        //# sourceMappingURL=HallWaitingDialog.js.map
        