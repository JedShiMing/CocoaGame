"use strict";
cc._RF.push(module, 'b5835o7PSdHza4dgTuGdNCw', 'gray.frag');
// resources/shader/gray.frag.js

"use strict";

// gray.frag.js
module.exports = "\n#ifdef GL_ES\nprecision lowp float;\n#endif\n\nvarying vec4 v_fragmentColor;\nvarying vec2 v_texCoord;\nvoid main()\n{\n    vec4 c = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b);\n    gl_FragColor.w = c.w;\n}\n";

cc._RF.pop();