"use strict";
cc._RF.push(module, 'bec1aY3wNhO46YS8rs/CzGc', 'RankItemPrefab');
// hall/ui/widget/RankItemPrefab.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        BgFrames: {
            default: [],
            type: cc.SpriteFrame
        },

        bg: cc.Sprite,
        playername: cc.Label,
        playerscore: cc.Label,
        rank: cc.Label,
        head: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setPlayerInfo: function setPlayerInfo(rank, headUrl, name, score, isMySelf) {
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
    }

    // update (dt) {},
});

cc._RF.pop();