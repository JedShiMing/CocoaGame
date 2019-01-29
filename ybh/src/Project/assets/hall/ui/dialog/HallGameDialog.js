import GameItem from './GameItem'
import LinkItem from './LinkItem'

var DialogBase = require('AFDialogBase');
const itemWidth = 90

cc.Class({
    extends: DialogBase,

    properties: {
        title: cc.Label,
        itemWrap: cc.Node,
        linkWrap: cc.Node,
        prefabItem: cc.Prefab,
        prefabLink: cc.Prefab,
        label_gold: cc.Label,

        top:cc.Node,
        bottom: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        DialogBase.prototype.onLoad.call(this);

        AF.EventDispatcher.on('GoldRefresh', this.refreshGold,this);
        this.info = null
        this.items = []
        this.selectedItems = []
        this.tipCount = 1
    },

    onEnable: function () {
        DialogBase.prototype.onEnable.call(this);

        this.playerData = AF.GameData.getMyPlayerData();

        var params = AF.DIALOG_PARAMS();
        this.pointId = params.pointId || 1;

        this.initUI();

        this.info = AF.GameConfig.getPointInfo(this.pointId);

        this.initItemNodes()
        this.itemWrap.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.itemWrap.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        AF.EventDispatcher.emit('ShowFriendPassed', this.pointId);

    },

    onDisable: function () {
        DialogBase.prototype.onDisable.call(this);

        AF.EventDispatcher.emit('HideFriendPassed');

        this.itemWrap.off(cc.Node.EventType.TOUCH_START, this.onTouchStart)
        this.itemWrap.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },
    onDestroy(){
        DialogBase.prototype.onDestroy.call(this);
        AF.EventDispatcher.off('GoldRefresh', this.refreshGold, this);
    },

    refreshGold(){
        this.playerData = AF.GameData.getMyPlayerData();
        this.label_gold.string = this.playerData.gold.toString()
    },

    initUI: function () {
        //适配iPhoneX，bg沉到最底下
        //this.bg.y = (this.bg.height - cc.winSize.height)/2;
        // this.bg.y = (0 - cc.winSize.height) / 2;
        this.title.string = this.pointId.toString()
    },

    onBackButtonClick: function (event, custom) {
        AF.gotoScene("HallMainScene");
    },

    update: function (dt) {
        if (!this.willShowTips || this.willShowTips.length <= 0) {
            return
        }
        const now = Date.now()
        if (!this.lastUpdate || now - this.lastUpdate >= 100) {
            const item = this.willShowTips.shift()
            if (item[0]) {
                item[0].updateTipLink(item[1], item[2])
            }
            if (this.willShowTips.length <= 0) {
                this.willShowTips = null
            }
            this.lastUpdate = now
        }
    },


    initItemNodes: function () {
        this.itemWrap.destroyAllChildren()
        this.linkWrap.destroyAllChildren()
        this.items = []
        this.selectedItems = []
        this.tipCount = 1
        this.startTime = Date.now()
        this.passed = false
        this.willShowTips = null
        //上 下node显示
        // this.top.active = true
        this.bottom.active = true
        
        this.label_gold.string = this.playerData.gold.toString()

        for (let x = 0; x < this.info.w; x++) {
            this.items[x] = []
            for (let y = 0; y < this.info.h; y++) {
                let node = cc.instantiate(this.prefabItem)
                node.x = x * itemWidth + 45;
                node.y = (this.info.h - 1 - y) * itemWidth + 45;
                node.name = `item_${x}_${y}`
                node.parent = this.itemWrap

                let linkNode = cc.instantiate(this.prefabLink)
                linkNode.x = x * itemWidth;
                linkNode.y = (this.info.h - 1 - y) * itemWidth;
                linkNode.parent = this.linkWrap

                this.items[x][y] = {
                    node,
                    gameitem: node.getComponent(GameItem),
                    position: [x, y],
                    linkNode,
                    linkitem: linkNode.getComponent(LinkItem),
                }
            }
        }
        this.itemWrap.width = this.info.w * itemWidth
        this.itemWrap.height = this.info.h * itemWidth
        this.linkWrap.width = this.info.w * itemWidth
        this.linkWrap.height = this.info.h * itemWidth

        // let lastitem = null
        this.info.path.forEach(([x, y], index) => {
            if (index === 0) {
                this.items[x][y].gameitem.setZero(true)
                this.items[x][y].gameitem.setSelected(true)
                this.selectedItems = [this.items[x][y]]
            }
            this.items[x][y].gameitem.setActive(true)
            // this.items[x][y].gameitem.setLabel(`${index}`)
        });

        this.itemWrap.getComponent(cc.Widget).updateAlignment()
        this.linkWrap.getComponent(cc.Widget).updateAlignment()
    },

    onTouchStart: function (e) {
        const currentItem = this.calcPos(e)
        if (!currentItem) {
            return
        }
        //回退
        let foundIdx = -1
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (this.selectedItems[i] === currentItem) {
                foundIdx = i
                currentItem.gameitem.animateScale()
            }
            if (foundIdx !== -1 && i > foundIdx) {
                this.selectedItems[i].gameitem.setSelected(false)
                this.selectedItems[i].linkitem.updateSelectLink('', false)
            }
        }
        if (foundIdx !== -1) {
            this.selectedItems.splice(foundIdx + 1)
        }
    },

    onTouchMove: function (e) {
        if (this.passed) {
            return
        }
        const currentItem = this.calcPos(e)
        if (!currentItem || !currentItem.gameitem.getActive()) {
            return
        }
        let lastSelectItem = this.selectedItems[this.selectedItems.length - 1]
        if (currentItem === lastSelectItem) {
            return
        }
        const pos = this.getRelativePos(lastSelectItem.position, currentItem.position)
        if (!/top|bottom|left|right/.test(pos)) {
            return
        }
        //move过程中只能一格一格回退
        if (this.selectedItems.length >= 2 && currentItem === this.selectedItems[this.selectedItems.length - 2]) {
            lastSelectItem.gameitem.setSelected(false)
            lastSelectItem.linkitem.updateSelectLink('', false)
            currentItem.gameitem.animateScale()
            this.selectedItems.pop()
        } else if (!currentItem.gameitem.getSelected()) {
            currentItem.gameitem.setSelected(true)
            currentItem.linkitem.updateSelectLink(pos, true)
            this.selectedItems.push(currentItem)

            this.checkPass()
        }
    },

    calcPos: function (e) {
        const parentPos = this.itemWrap.convertToWorldSpaceAR(cc.v2(0, 0))
        const v2 = [e.getLocationX() - parentPos.x, e.getLocationY() - parentPos.y]
        const xidx = Math.floor(v2[0] / itemWidth)
        const yidx = this.info.h - Math.ceil(v2[1] / itemWidth)

        if (xidx < 0 || xidx >= this.info.w ||
            yidx < 0 || yidx >= this.info.h) {
            return null
        }
        return this.items[xidx][yidx]
    },

    getRelativePos: function (lastitem, item) {
        if (!lastitem || !item) return ''
        const [x0, y0] = lastitem
        const [x1, y1] = item
        if (x0 === x1) {
            if (y0 - y1 === 1) return 'bottom'
            else if (y0 - y1 === -1) return 'top'
        } else if (y0 === y1) {
            if (x0 - x1 === 1) return 'right'
            else if (x0 - x1 === -1) return 'left'
        }
        return ''
    },

    checkPass: function () {
        if (this.selectedItems.length < this.info.path.length) {
            return false
        }
        // AF.ToastMessage.show("过关");
        const costTime = Date.now() - this.startTime
        this.passed = true
        let over = false
        if(this.playerData.pointId < this.pointId){
            //上传分数
            AF.util.upScore({
                score: this.pointId,
                startTime: this.startTime,
                endTime: Date.now(),
            })
            this.playerData.pointId = this.pointId
            over = true
            AF.GameData.setMyPlayerData(this.playerData);
            AF.GameData.savePlayerData(this.playerData);
        }
        
        
        // this.top.active = false
        this.scheduleOnce(()=>{
            this.bottom.active = false
            AF.EventDispatcher.emit('HideFriendPassed');

            AF.openDialog("HallBalanceDialog", { costTime,
                over,
                pointId: this.pointId,
                close: ()=>AF.gotoScene("HallMainScene"),
                next: this.next.bind(this) });
        }, 0.5)
        return true
    },

    clearSelected: function () {
        this.selectedItems.forEach((item, index) => {
            if (index !== 0) {
                item.gameitem.setSelected(false)
                item.linkitem.updateSelectLink('', false)
            }
        })
        this.selectedItems.splice(1)
    },

    checkShowGameTip: function (e) {
        if (this.tipCount >= this.info.path.length || this.willShowTips) {
            return
        }
        if(this.playerData.gold >= 200){
            this.playerData.gold -= 200
            this.label_gold.string = this.playerData.gold.toString()
            AF.GameData.setMyPlayerData(this.playerData);
            AF.GameData.savePlayerData(this.playerData);
            this.showGameTip()
        }else{
            AF.util.showVideoAd('battle', (suc)=>{
                if(suc){
                    this.showGameTip()
                }
            })
        }
        
    },

    showGameTip(){
        this.clearSelected()
        this.tipCount += 5
        // const minTimer = () => new Promise((resolve) => setTimeout(resolve, 100))
        const items = this.info.path.slice(0, this.tipCount)
        let start = this.tipCount - 6
        start = start < 1 ? 1 : start
        this.willShowTips = []
        for (let i = start; i < items.length; i++) {
            let lastPath = items[i - 1]
            let currPath = items[i]
            let nextPath = items[i + 1] || null

            let currItem = this.items[currPath[0]][currPath[1]]
            this.willShowTips.push([currItem.linkitem, this.getRelativePos(lastPath, currPath), this.getRelativePos(nextPath, currPath)])
        }
    },

    next: function () {
        this.pointId = this.pointId + 1;
        this.initUI()
        this.info = AF.GameConfig.getPointInfo(this.pointId);

        AF.EventDispatcher.emit('ShowFriendPassed', this.pointId);

        this.initItemNodes()
    },
})


