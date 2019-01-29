(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/widget/InReviewXChange.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2c1faDgGrFKJKLclxDGy9hv', 'InReviewXChange', __filename);
// hall/ui/widget/InReviewXChange.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        inReview: {
            default: false,
            displayName: "是否审核状态",
            tooltip: "app审核状态和此值一致时，显示该组件界面"
        }
    },

    editor: {
        menu: 'common/InReviewXChange'
    },

    onLoad: function onLoad() {
        this.node.active = this.inReview == AF.IN_REVIEW;
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
        //# sourceMappingURL=InReviewXChange.js.map
        