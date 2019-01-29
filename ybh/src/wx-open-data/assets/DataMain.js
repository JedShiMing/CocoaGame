import BalancePassedView from './Script/BalancePassedView'
import FriendPassedView from './Script/FriendPassedView'
import Util from './Script/Util'

const RANK_ITEM_HEIGHT = 108;
// const RANK_ITEM_PADDING = 14;
const PADDING_BOTTOM_H = 50;
cc.Class({
    extends: cc.Component,

    properties: {
        ranks: cc.Node,
        RankItemPre: cc.Prefab,
        Balance: cc.Node,
        Friend: cc.Node
    },

    start() {
        if (!this.isWxApp()) {
            return;
        }
        let self = this;
        wx.onMessage(data => {
            console.log('收到主域消息', data, self);
            if (!data.cmd) {
                self.setUI(0,0,0)
            } else if (data.cmd === 2) { // 排行榜
                console.log('显示排行榜', self.ranks);
                self.setUI(1,0,0);

                if (data.data.isAllScreen) {
                    let scrWid = self.ranks.getComponent(cc.Widget)
                    scrWid.top = 3;
                    scrWid.bottom = 100;
                    scrWid.updateAlignment();
                    let viewWid = self.ranks.getChildByName('view').getComponent(cc.Widget)
                    viewWid.updateAlignment()
                }
                self.requestDataFromServer();
            } else if (data.cmd === 3) { // 已通关好友, 右上角
                console.log('显示右上角 = ', self.Friend);
                self.setUI(0,0,1);
                self.showFriendPass(data.data)
            } else if (data.cmd === 4) { // 已通关好友, 中间
                console.log('显示中间');
                self.setUI(0,1,0);
                self.showBalancePass(data.data)
            }
        })
    },

    setUI(a,b,c) {
        this.ranks.active = a === 1;
        this.Balance.active = b === 1;
        this.Friend.active = c === 1;
    },

    requestDataFromServer: function () {
        var self = this;
        Util.getWXFriendRanks().then(list => {
            if (list) self.renderRank(list)
        })
    },

    renderRank(players) {
        let self = this;
        let friends = players;
        console.log('ranks = ', self.ranks)
        let _content = self.ranks.getChildByName('view').getChildByName('content')
        _content.destroyAllChildren()
        for (let i = 0; i < friends.length; i++) {
            let item = cc.instantiate(self.RankItemPre);
            _content.addChild(item);
            item.getComponent("RankItemPrefab").setPlayerInfo(i + 1, friends[i].avatarUrl, friends[i].nickname, friends[i].score, false);
            item.height = RANK_ITEM_HEIGHT
        }
    },
    isWxApp: function () {
        return 'undefined' !== typeof (wx);
    },


    showFriendPass(data) {
        this.Friend.getComponent(FriendPassedView).updatePoint(data.pointId)

    },
    showBalancePass(info) {
        this.Balance.getComponent(BalancePassedView).updatePoint(info)
    },
});
