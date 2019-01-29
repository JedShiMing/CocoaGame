import Util from './Util'

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        heads: [cc.Node],
        label_time: [cc.Label],
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {},

    updatePoint: function ({ pointId, costTime }) {
        this.costTime = costTime
        Promise.all([
            Util.getWeChatUserInfo(),
            Util.getWXFriendRanks()
        ]).then(value => {
            let selfInfo = value[0]
            let ranklist = value[1]
            if (!ranklist || !selfInfo) return
            let selfId = 0
            for (let i = 0; i < ranklist.length; i++) {
                if(ranklist[i].nickname === selfInfo[0].nickName
                && ranklist[i].avatarUrl === selfInfo[0].avatarUrl) {
                    selfId = i;
                    break;
                }
            }
            this.ranks = []
            if (selfId === 0) {
                this.ranks = [ranklist[selfId],ranklist[selfId + 1],ranklist[selfId + 2]]
            } else if (selfId === ranklist.length - 1) {
                this.ranks = [ranklist[selfId - 2],ranklist[selfId - 1],ranklist[selfId]]
            } else {
                this.ranks = [ranklist[selfId - 1],ranklist[selfId],ranklist[selfId + 1]]
            }
            this.updateHeads()
        }).catch(eor => {
            console.log('3e = ', eor)
        })
    },

    updateHeads: function () {
        for (let i = 0; i < 3; i++) {
            if (!this.ranks[i]) break
            this.heads[i].active = true
            this.heads[i].getComponent("PhotoPrefab").setPhoto(this.ranks[i].avatarUrl);
            this.label_time[i].string = this.ranks[i].score + '关';
        }
    },
})



