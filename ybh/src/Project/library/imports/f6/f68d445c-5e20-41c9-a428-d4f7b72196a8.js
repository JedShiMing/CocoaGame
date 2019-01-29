"use strict";
cc._RF.push(module, 'f68d4RcXiBByaQo1Pe3IZao', 'AF-shader-utils');
// framework/utils/AF-shader-utils.js

"use strict";

// ShaderUtils.js
var SHADER_STATE = cc.Enum({
    noraml: -1,
    gray: -1
});
var ShaderUtils = {
    shaderPrograms: {},

    init: function init(shaderName) {

        var glProgram = this.shaderPrograms[shaderName];
        if (!glProgram) {
            glProgram = new cc.GLProgram();
            var vert = require(cc.js.formatStr("%s.vert", shaderName));
            var frag = require(cc.js.formatStr("%s.frag", shaderName));
            glProgram.initWithString(vert, frag);
            if (!cc.sys.isNative) {
                glProgram.initWithVertexShaderByteArray(vert, frag);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            }
            glProgram.link();
            glProgram.updateUniforms();
            this.shaderPrograms[shaderName] = glProgram;
        }
    },

    setShader: function setShader(sprite, shaderName) {
        this.init(shaderName);
        var glProgram = this.shaderPrograms[shaderName];
        // if (!glProgram) {
        //     glProgram = new cc.GLProgram();
        //     var vert = require(cc.js.formatStr("%s.vert", shaderName));
        //     var frag = require(cc.js.formatStr("%s.frag", shaderName));
        //     glProgram.initWithString(vert, frag);
        //     if (!cc.sys.isNative) {  
        //         glProgram.initWithVertexShaderByteArray(vert, frag);
        //         glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);  
        //         glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);  
        //         glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);  
        //     }
        //     glProgram.link();  
        //     glProgram.updateUniforms();
        //     this.shaderPrograms[shaderName] = glProgram;
        // }
        sprite._sgNode.setShaderProgram(glProgram);
        sprite._sgNode.setState(SHADER_STATE[shaderName]);
        return glProgram;
    }
};

//ShaderUtils.init("gray");

var AF = window.AF = window.AF || {};
AF.ShaderUtils = AF.ShaderUtils || {};
cc.js.mixin(AF.ShaderUtils, ShaderUtils);

module.exports = ShaderUtils;

cc._RF.pop();