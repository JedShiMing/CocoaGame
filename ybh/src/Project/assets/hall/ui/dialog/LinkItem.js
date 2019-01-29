module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        spSelect: cc.Node,
        spTip: cc.Node,

        straight: cc.Sprite,
        corner: cc.Sprite,
        end: cc.Sprite,
    },

    updateSelectLink(lastPos, selected) {
        if (!!selected) {
            let rotation = 0
            switch (lastPos) {
                case 'left':
                    rotation = 0
                    break
                case 'top':
                    rotation = 90
                    break
                case 'right':
                    rotation = 180
                    break
                case 'bottom':
                    rotation = -90
                    break
                default:
                    return
            }
            this.spSelect.active = true
            this.spSelect.rotation = rotation
        } else {
            this.spSelect.active = false
        }
    },
    updateTipLink(lastPos, nextPos) {
        if ((/top|bottom/.test(lastPos) && /top|bottom/.test(nextPos)) ||
            (/left|right/.test(lastPos) && /left|right/.test(nextPos))
        ) {
            this.spTip.active = true
            this.straight.node.active = true
            this.corner.node.active = false
            this.end.node.active = false
            let rotation = 0
            switch (lastPos) {
                case 'left':
                    rotation = 0
                    break
                case 'top':
                    rotation = 90
                    break
                case 'right':
                    rotation = 180
                    break
                case 'bottom':
                    rotation = -90
                    break
            }
            this.spTip.rotation = rotation
        }
        else if(lastPos && nextPos){
            let rotation = 0
            let scaleY = 1
            this.spTip.active = true
            this.straight.node.active = false
            this.corner.node.active = true
            this.end.node.active = false
            if(lastPos === 'left'){
                if(nextPos === 'top'){
                    scaleY = -1
                }
            }
            else if(lastPos === 'top'){
                rotation = 90
                if(nextPos === 'right'){
                    scaleY = -1
                }
            }
            else if(lastPos === 'right'){
                rotation = 180
                if(nextPos === 'bottom'){
                    scaleY = -1
                }
            }
            else if(lastPos === 'bottom'){
                rotation = -90
                if(nextPos === 'left'){
                    scaleY = -1
                }
            }
            this.spTip.scaleY = scaleY
            this.spTip.rotation = rotation
        }
        else if(!nextPos){
            this.spTip.active = true
            this.straight.node.active = false
            this.corner.node.active = false
            this.end.node.active = true
            let rotation = 0
            switch (lastPos) {
                case 'left':
                    rotation = 0
                    break
                case 'top':
                    rotation = 90
                    break
                case 'right':
                    rotation = 180
                    break
                case 'bottom':
                    rotation = -90
                    break
            }
            this.spTip.rotation = rotation
        }
    },
})
