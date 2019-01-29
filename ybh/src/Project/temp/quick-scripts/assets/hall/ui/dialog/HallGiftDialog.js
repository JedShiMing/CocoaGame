(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/dialog/HallGiftDialog.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9bb24u0YJBGwK5LUv/bbjU2', 'HallGiftDialog', __filename);
// hall/ui/dialog/HallGiftDialog.js

'use strict';

var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        toggle_share: cc.Toggle,
        label_gold: cc.Label,

        asset_select: [cc.SpriteFrame],
        btn_select: cc.Sprite
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad: function onLoad() {
        this.select = false;
        DialogBase.prototype.onLoad.call(this);
    },

    onEnable: function onEnable() {
        DialogBase.prototype.onEnable.call(this);
        this.params = AF.DIALOG_PARAMS();
        this.label_gold.string = AF.GameData.getMyPlayerData().gold.toString();

        this.select = false;
        this.btn_select.spriteFrame = this.asset_select[1];
    },

    onDisable: function onDisable() {
        AF.EventDispatcher.emit('ShowBalancePassed', { pointId: this.params.pointId, costTime: this.params.costTime });
    },

    onselect: function onselect() {
        this.select = !this.select;
        this.btn_select.spriteFrame = this.select ? this.asset_select[0] : this.asset_select[1];
    },
    onBtnClick: function onBtnClick() {
        var _this = this;

        var tag = Date.now().toString();
        var playerData = AF.GameData.getMyPlayerData();
        if (this.select) {
            AF.util.shareAppMessage(null, function () {
                playerData.giftTag = tag;
                playerData.gold += 600;
                AF.GameData.savePlayerData(playerData);
                _this.close();
            }, function () {
                playerData.giftTag = tag;
                playerData.gold += 600;
                AF.GameData.savePlayerData(playerData);
                _this.close();
            }, { giftTag: tag }, 'gift', { summary: '灰太狼去哪了？点击翻倍' });
        } else {
            playerData.gold += 600;
            AF.GameData.setMyPlayerData(playerData);
            AF.GameData.savePlayerData(playerData);
            AF.EventDispatcher.emit('GoldRefresh');
            this.close();
        }
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
        //# sourceMappingURL=HallGiftDialog.js.map
        