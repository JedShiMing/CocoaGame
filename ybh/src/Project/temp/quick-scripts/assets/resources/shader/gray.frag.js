(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/resources/shader/gray.frag.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b5835o7PSdHza4dgTuGdNCw', 'gray.frag', __filename);
// resources/shader/gray.frag.js

"use strict";

// gray.frag.js
module.exports = "\n#ifdef GL_ES\nprecision lowp float;\n#endif\n\nvarying vec4 v_fragmentColor;\nvarying vec2 v_texCoord;\nvoid main()\n{\n    vec4 c = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b);\n    gl_FragColor.w = c.w;\n}\n";

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
        //# sourceMappingURL=gray.frag.js.map
        