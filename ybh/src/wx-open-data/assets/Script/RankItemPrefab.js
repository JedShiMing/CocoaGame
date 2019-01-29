
cc.Class({
    extends: cc.Component,

    properties: {
        BgFrames: {
            default: [],
            type: cc.SpriteFrame,
        },

        bg: cc.Sprite,
        playername: cc.Label,
        playerscore: cc.Label,
        rank: cc.Label,
        head: cc.Node,
    },

    setPlayerInfo: function (rank, headUrl, name, score, isMySelf) {
        var self = this;
        if (isMySelf) {
                self.bg.spriteFrame = self.BgFrames[4];
                self.rank.node.active = true;
                self.rank.string = cc.js.formatStr("%d", rank);
                self.playername.string = '我';
                self.playername.node.active = true;
        } else {
            if (rank >= 1 && rank <= 3) {
                self.bg.spriteFrame = self.BgFrames[rank];
                self.rank.node.active = false;
            } else {
                self.bg.spriteFrame = self.BgFrames[0];
                self.rank.node.active = true;
                self.rank.string = cc.js.formatStr("%d", rank);
            }
            self.playername.string = name;
        }
        self.playerscore.string = score;
        self.head.getComponent("PhotoPrefab").setPhoto(headUrl);
    },

    // update (dt) {},
});
