var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        node_light: cc.Node,
        node_starCon: cc.Node,
        node_next: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        DialogBase.prototype.onLoad.call(this);
    },

    onEnable: function () {
        DialogBase.prototype.onEnable.call(this);
        this.params = AF.DIALOG_PARAMS()
        let pointId = AF.GameData.getMyPlayerData().pointId
        if(this.params.pointId % 25 === 0 && this.params.over){
            this.scheduleOnce(()=> AF.openDialog("HallGiftDialog", { costTime:this.params.costTime, pointId: this.params.pointId}),0.1)
        }else{
            this.scheduleOnce(()=> AF.EventDispatcher.emit('ShowBalancePassed', {pointId: this.params.pointId,costTime:this.params.costTime}),0.5)
        }

        this.startAnimation()
    },
    startAnimation(){
        const animation = this.node.getComponent(cc.Animation)
        animation.setCurrentTime(0)
        animation.play('balance', 0)

        this.node_light.rotation = 0
        this.node_light.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(1,90),
            cc.rotateTo(1,180),
            cc.rotateTo(1,270),
            cc.rotateTo(1,0))));

        this.node_starCon.children.forEach(node=>{
            node.scale = 1;
            node.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.6,1.2,1.2),
                cc.scaleTo(0.6,1,1),
            )))
        })
        this.node_next.scale = 1
        this.node_next.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.6,0.9,0.9),
            cc.scaleTo(0.6,1,1),
        )))
        // this.node_buttons.active = false
        // this.node_light.scale = 0
        // this.node_starCon.scale = 0
        // this.node_win.scale = 2
        //
        // this.node_win.runAction(cc.scaleTo(0.2, 1, 1))

    },
    onDisable: function () {
        DialogBase.prototype.onDisable.call(this);
        AF.EventDispatcher.emit('HideBalancePassed')

        this.node_light.stopAllActions()
        this.node_next.stopAllActions()
        this.node_starCon.children.forEach(node=>{
            node.stopAllActions()
        })
    },
    next() {
        this.close()
        this.params.next()
    },
    goToHome() {
        this.close()
        this.params.close()
    },
    challenge() {
        AF.util.shareAppMessage(null, () => {
            console.log('suc')
        }, () => {
            console.log('fail')
        }, {score: this.params.pointId}, 'challenge')
    },
});