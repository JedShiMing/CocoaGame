"use strict";
cc._RF.push(module, '2c1faDgGrFKJKLclxDGy9hv', 'InReviewXChange');
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