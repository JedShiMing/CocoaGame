module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Sprite,
        label: cc.Label,
    },
    _active: false,
    _zero: false,
    _selected: false,
    // LIFE-CYCLE CALLBACKS:

    setLabel: function (l) {
        this.label.string = l
    },

    setZero(v) {
        this._zero = !!v
    },

    setActive: function (v) {
        this._active = !!v
        this.bg.node.active = !!v
    },

    getActive: function () {
        return this._active
    },

    animateScale:function(){
        let anim1 = cc.scaleTo(0.15, 1.2, 1.2);
        let anim2 = cc.scaleTo(0.15, 1.0, 1.0);
        this.node.runAction(cc.sequence(anim1, anim2))
    },

    setSelected: function (v) {
        if (this._selected === !!v) {
            return
        }
        const animation = this.bg.getComponent(cc.Animation)
        if (v) {
            animation.play()
            this.animateScale()
        } else {
            animation.play()
            animation.setCurrentTime(0)
            animation.stop()
        }
        this._selected = !!v
    },

    getSelected: function () {
        return this._selected
    },
})
