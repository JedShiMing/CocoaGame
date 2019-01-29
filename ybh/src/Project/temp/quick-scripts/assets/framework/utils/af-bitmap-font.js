(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/utils/af-bitmap-font.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0efdb7UodNFH5CedrwY5wEh', 'af-bitmap-font', __filename);
// framework/utils/af-bitmap-font.js

"use strict";

// af-bitmap-font
(window.AF = window.AF || {}).BMFont = cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {}

});

/**
 * bitmap生成控件
 */
var _styles = {};

var AFBMFont = {};

/**
 * option : {
 *      file: 文件名
 *      content: 内容
 *      style: Left center right
 * }
 */
AFBMFont.CreateNewLabel = function (fileName, content, style) {};

module.exports = (window.AF = window.AF || {}).AFBMFont = AFBMFont;

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
        //# sourceMappingURL=af-bitmap-font.js.map
        