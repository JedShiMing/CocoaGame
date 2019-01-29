const itemWidth = 90

cc.Class({
    extends: cc.Component,

    properties: {
        qqCon: cc.Node,
        heads: [cc.Node],
        wxDisplay: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        let self = this
        self.qqCon.active = false
    },
    onEnable: function () {
        AF.EventDispatcher.on('UpdateFriendPassed', this.updatePoint, this)

    },
    onDisable: function () {
        AF.EventDispatcher.off('UpdateFriendPassed', this.updatePoint, this)
    },
    updatePoint: function (pointId) {
        let self = this
        if (AF.platform.isWxApp()) {
            AF.util.postMessage(3, { pointId, isAllScreen: AF.util.isAllScreen(), height: cc.winSize.height });
        }
        else if (AF.platform.isQQApp()) {
            this.qqCon.active = true
            AF.util.getRankList(list => {
                if (list) {
                    this.list = list
                    this.updateHeads(pointId)
                }
            })
        }
    },
    updateHeads: function (pointId) {
        if (!this.node || !this.node.active) {
            return
        }
        for (let i = 0; i < 3 && i < this.list.length; i++) {
            if (this.list[i].score >= pointId) {
                this.heads[i].active = true
                this.heads[i].getComponent("PhotoPrefab").setPhoto(this.list[i].url);
            } else {
                break
            }
        }
    }
})



