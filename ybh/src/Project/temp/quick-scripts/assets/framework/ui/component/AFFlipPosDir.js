(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/component/AFFlipPosDir.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2c05dFdNo1Ke5YodDEqv90j', 'AFFlipPosDir', __filename);
// framework/ui/component/AFFlipPosDir.js

'use strict';

cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFFlipPosDir'
    },

    properties: {
        strNodeFlipPosX: [cc.String],
        strNodeFlipDirX: [cc.String]
    },

    // use this for initialization
    onLoad: function onLoad() {
        for (var i = 0; i < this.strNodeFlipPosX.length; i++) {
            var node = cc.find(this.strNodeFlipPosX[i], this.node);
            node.x = -node.x;
        }

        for (var i = 0; i < this.strNodeFlipDirX.length; i++) {
            var node = cc.find(this.strNodeFlipDirX[i], this.node);
            node.scaleX = -node.scaleX;
        }
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
        //# sourceMappingURL=AFFlipPosDir.js.map
        