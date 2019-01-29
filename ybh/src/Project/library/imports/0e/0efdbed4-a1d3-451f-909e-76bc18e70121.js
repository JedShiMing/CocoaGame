"use strict";
cc._RF.push(module, '0efdb7UodNFH5CedrwY5wEh', 'af-bitmap-font');
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