"use strict";
cc._RF.push(module, '2e3f21J38VO2Jyh8nCVWCax', 'AFAdJustScale');
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