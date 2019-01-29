const itemWidth = 90

cc.Class({
    extends: cc.Component,

    properties: {
        qqCon: cc.Node,
        heads: [cc.Node],
        label_time: [cc.Label],
        wxDisplay: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        AF.EventDispatcher.on('UpdateBalancePassed', this.updatePoint, this)

        this.qqCon.active = false
    },
    onDestroy() {
        AF.EventDispatcher.off('UpdateBalancePassed', this.updatePoint, this)
    },
    updatePoint: function ({ pointId, costTime }) {
        this.pointId = pointId
        this.costTime = costTime
        if (AF.platform.isWxApp()) {
            AF.util.postMessage(4, { pointId, costTime });
        }
        else if (AF.platform.isQQApp()) {
            this.qqCon.active = true
            AF.util.getRankList(ranklist => {
                if (ranklist) {
                    let selfId = 0
                    for (let i = 0; i < ranklist.length; i++) {
                        if(ranklist[i].selfFlag === 1) {
                            selfId = i;
                            break;
                        }
                    }
                    this.list = []
                    if (selfId === 0) {
                        this.list = [ranklist[selfId],ranklist[selfId + 1],ranklist[selfId + 2]]
                    } else if (selfId === ranklist.length - 1) {
                        this.list = [ranklist[selfId - 2],ranklist[selfId - 1],ranklist[selfId]]
                    } else {
                        this.list = [ranklist[selfId - 1],ranklist[selfId],ranklist[selfId + 1]]
                    }
                    this.updateHeads()
                }
            })
        }
    },

    updateHeads: function () {
        for (let i = 0; i < 3; i++) {
            this.heads[i].active = true
            this.heads[i].getComponent("PhotoPrefab").setPhoto(this.list[i].url);
            this.label_time[i].string = this.list[i].score + '关';
        }
    }
})



