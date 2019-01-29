import Util from './Util'

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        heads: [cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
    },
    updatePoint: function (pointId) {

        // {
        //     AF.util.getRankList(list => {
        //         if (list) {
        //             this.list = list
        //             this.updateHeads(pointId)
        //         }
        //     })
        // }

        Util.getWXFriendRanks().then(list => {
            if (list) {
                this.list = list
                this.updateHeads(pointId)
            }
        })
    },
    updateHeads: function (pointId) {
        if (!this.node || !this.node.active) {
            return
        }
        for (let i = 0; i < 3 && i < this.list.length; i++) {
            if (this.list[i].score >= pointId) {
                this.heads[i].active = true
                this.heads[i].getComponent("PhotoPrefab").setPhoto(this.list[i].avatarUrl);
            } else {
                // this.heads[i].active = false
                this.heads[i].getComponent("PhotoPrefab").clearPhoto()
            }
        }
    },
})



