(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/shader/gray.vert.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '731a9F87sdIRb2DolsU5Ill', 'gray.vert', __filename);
// resources/shader/gray.vert.js

"use strict";

// gray.vert.js
module.exports = "\nattribute vec4 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\nvarying vec4 v_fragmentColor; \nvarying vec2 v_texCoord; \nvoid main() \n{ \n    gl_Position = CC_PMatrix * a_position;\n    v_fragmentColor = a_color; \n    v_texCoord = a_texCoord; \n}\n";

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
        //# sourceMappingURL=gray.vert.js.map
        