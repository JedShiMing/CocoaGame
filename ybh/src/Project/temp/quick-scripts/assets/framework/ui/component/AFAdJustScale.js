(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/component/AFAdJustScale.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2e3f21J38VO2Jyh8nCVWCax', 'AFAdJustScale', __filename);
// framework/ui/component/AFAdJustScale.js

'use strict';

var AFAdjustScale = cc.Class({
    extends: cc.Component,

    editor: {
        menu: 'ApplicationFramework/AFAdJustScale'
    },

    properties: {
        minHeight: 1180,
        maxHeight: 1380,

        myHeight: 1280
    },

    onLoad: function onLoad() {
        var realheight = cc.director.getVisibleSize().height;
        if (realheight >= this.maxHeight && realheight <= this.minHeight) return;

        if (realheight < this.minHeight) {
            var d = this.minHeight - realheight;
            this.node.scale = (this.myHeight - d) / this.myHeight;
        }

        if (realheight > this.maxHeight) {
            var d = realheight - this.maxHeight;
            this.node.scale = (this.myHeight + d) / this.myHeight;
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
        //# sourceMappingURL=AFAdJustScale.js.map
        