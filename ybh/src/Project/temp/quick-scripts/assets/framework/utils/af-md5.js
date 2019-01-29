(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/utils/af-md5.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '766bf+DBYJBn51sRufs952n', 'af-md5', __filename);
// framework/utils/af-md5.js

'use strict';

/**
 * 快速hash
 */

var md5 = require('md5');

var AF = window.AF = window.AF || {};
AF.util = AF.util || {};
AF.util.md5 = md5;

module.exports = md5;

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
        //# sourceMappingURL=af-md5.js.map
        