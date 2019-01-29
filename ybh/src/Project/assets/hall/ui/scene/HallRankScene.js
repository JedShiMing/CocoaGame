const RANK_ITEM_HEIGHT = 108;
const RANK_ITEM_PADDING = 14;
// const list = [
//     {
//         url: '',
//         score: 100,
//         nick: 'jed',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     },{
//         url: '',
//         score: 100,
//         nick: 'jed2',
//         selfFlag: false
//     }
//     ]
cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        scrollView: cc.ScrollView,
        RankItemPre: cc.Prefab,
        scrView: cc.Node,
        display: cc.Node,
    },

    onLoad: function () {
        let self = this;
        if (AF.platform.isWxApp()) {
            self.scrollView.node.active = false
        } else if (AF.platform.isQQApp()) {
            AF.util.getRankList((data) => {
                if (data && data.length > 0) {
                    self.setPlayerData(data)
                }
            });
            // self.setPlayerData(list)
            self.scrollView.node.active = true;
            AF.EventDispatcher.emit(AF.Event.SCENE_LOADED);
            self.scrollView.node.on('scrolling', this.onTouchMove, this, true)
        } else {
            AF.util.getRankList((data) => {
                if (data && data.length > 0) {
                    self.setPlayerData(data)
                }
            })
        }
    },

    onEnable: function () {
        AF.EventDispatcher.emit(AF.Event.SCENE_LOADED);
    },

    start() {
        let self = this
        if (AF.platform.isWxApp()) {
            if (AF.util.isAllScreen()) {
                let disWid = self.display.getComponent(cc.Widget)
                console.log('disWid = ', disWid)
                disWid.top = 190
                disWid.updateAlignment()
            }
            AF.util.postMessage(2, {isAllScreen: AF.util.isAllScreen(), height: cc.winSize.height});
        }
    },

    onTouchMove: function (event) {
        let self = this
        let moveY = self.scrollView.getComponent(cc.ScrollView).getScrollOffset().y;
        self.selfItem.active = !((moveY >= self.startY - self.scrView.height) && (moveY <= self.startY + RANK_ITEM_HEIGHT));
    },

    setPlayerData: function (players) {
        let self = this;
        let friends = players;
        let total_height = friends.length * RANK_ITEM_HEIGHT + RANK_ITEM_PADDING * (friends.length - 1);

        if (total_height < self.scrollView.node.height) {
            total_height = self.scrollView.node.height;
        }
        let myPlayer = null;
        let myRank;

        for (let i = 0; i < friends.length; i++) {
            let item = cc.instantiate(self.RankItemPre);
            self.scrollView.content.addChild(item);

            item.getComponent("RankItemPrefab").setPlayerInfo(i + 1, friends[i].url, friends[i].nick, friends[i].score, false);

            item.x = self.scrollView.content.width / 2;

            if (friends[i].selfFlag) {
                self.startY = i * (RANK_ITEM_PADDING + RANK_ITEM_HEIGHT)
                myPlayer = friends[i];
                myRank = i + 1;
            }
        }

        if (myPlayer) {
            self.selfItem = cc.instantiate(self.RankItemPre);
            self.bg.addChild(self.selfItem);

            self.selfItem.getComponent("RankItemPrefab").setPlayerInfo(myRank, myPlayer.url, myPlayer.nick, myPlayer.score, true);
            self.selfItem.x = 0;
            self.selfItem.y = -(self.scrollView.node.height / 2);
            self.selfItem.active = self.scrView.height < self.startY
        }
    },

    onBackButtonClick: function (event, custom) {
        console.log('返回了上一页')
        AF.gotoScene("HallMainScene");
    },
});