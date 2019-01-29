var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        toggle_share: cc.Toggle,
        label_gold: cc.Label,

        asset_select: [cc.SpriteFrame],
        btn_select: cc.Sprite,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        this.select = false
        DialogBase.prototype.onLoad.call(this);
    },

    onEnable: function () {
        DialogBase.prototype.onEnable.call(this);
        this.params = AF.DIALOG_PARAMS()
        this.label_gold.string = AF.GameData.getMyPlayerData().gold.toString();

        this.select = false;
        this.btn_select.spriteFrame = this.asset_select[1]
    },

    onDisable: function () {
        AF.EventDispatcher.emit('ShowBalancePassed', { pointId: this.params.pointId, costTime: this.params.costTime })
    },

    onselect() {
        this.select = !this.select
        this.btn_select.spriteFrame = this.select ? this.asset_select[0] : this.asset_select[1]
    },

    onBtnClick() {
        const tag = Date.now().toString()
        let playerData = AF.GameData.getMyPlayerData();
        if (this.select) {
            AF.util.shareAppMessage(null, () => {
                playerData.giftTag = tag
                playerData.gold += 600
                AF.GameData.savePlayerData(playerData);
                this.close()
            }, () => {
                playerData.giftTag = tag
                playerData.gold += 600
                AF.GameData.savePlayerData(playerData);
                this.close()
            }, { giftTag: tag }, 'gift', { summary: '灰太狼去哪了？点击翻倍' })
        } else {
            playerData.gold += 600
            AF.GameData.setMyPlayerData(playerData);
            AF.GameData.savePlayerData(playerData);
            AF.EventDispatcher.emit('GoldRefresh');
            this.close()
        }
    },

});