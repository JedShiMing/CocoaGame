(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/widget/UserInfoPrefab.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'af44bTyJ41NN7cYtIxw37yJ', 'UserInfoPrefab', __filename);
// hall/ui/widget/UserInfoPrefab.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        goldNumLabel: {
            default: null,
            type: cc.Label,
            displayName: "金币Label"
        }
    },

    onLoad: function onLoad() {
        this.schedule(this.onUserInfoUpdate, 1, this);
        AF.EventDispatcher.on(AF.Event.USER_INFO_UPDATE, this.onUserInfoUpdate, this);
    },
    onDestroy: function onDestroy() {
        AF.EventDispatcher.off(AF.Event.USER_INFO_UPDATE, this.onUserInfoUpdate, this);
    },

    onEnable: function onEnable() {
        if (AF.platform.isHairScreen()) {
            this.node.y = cc.winSize.height - 72;
        } else {
            this.node.y = cc.winSize.height - 16;
        }

        this.onUserInfoUpdate();
    },

    onUserInfoUpdate: function onUserInfoUpdate() {

        function widgetIsActive(node) {
            var active = true;
            while (node) {
                if (!node) {
                    break;
                }
                if (!node.parent) {
                    break;
                }
                active = node.active;
                if (!active) {
                    break;
                }
                node = node.parent;
            }
            return active;
        }

        if (!widgetIsActive(this.node)) {
            return;
        }

        this.goldNumLabel.string = AF.util.formatNumber(0);
    },

    //-------------按钮回调函数-------------
    onGoldAddButtonClick: function onGoldAddButtonClick(event, custom) {}
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
        //# sourceMappingURL=UserInfoPrefab.js.map
        