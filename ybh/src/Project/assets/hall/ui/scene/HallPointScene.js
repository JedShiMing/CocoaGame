
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node, // 滚动条内容
        scrolldoctView: cc.Node,  // 底部画布

        prefab_page: cc.Node,
        prefab_item: cc.Node,
        prefab_doct: cc.Node,

        asset_lock: cc.SpriteFrame,
        asset_gift: cc.SpriteFrame,
        asset_curr: cc.SpriteFrame,
        asset_unlock: cc.SpriteFrame,

        asset_docts: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        let playerData = AF.GameData.getMyPlayerData()
        if(playerData.pointId == null){
            playerData.pointId = 0
            playerData.gold = 0
            AF.GameData.savePlayerData(playerData);
        }
        this.pointId = playerData.pointId
        this.totalPage = 9
        console.log('AF.util.getUserInfo() = ', AF.util.getUserInfo())
        this.initPages()
    },

    onEnable:function() {
        AF.EventDispatcher.emit(AF.Event.SCENE_LOADED);
    },

    initPages() {
        let node_page, node_item
        this.currentPage = Math.ceil((this.pointId + 1) / 50) - 1
        this.currentPage = this.currentPage > this.totalPage ? this.totalPage : this.currentPage
        this.node_pages = []
        for (let i = 0; i < 3; i++) {
            node_page = cc.instantiate(this.prefab_page)
            node_page.parent = this.content
            for (let k = 0; k < 50; k++) {
                node_item = cc.instantiate(this.prefab_item)
                node_item.parent = node_page
                node_item.active = true
            }
            this.updatePage(node_page, this.currentPage - 1 + i)
            this.node_pages.push(node_page)
        }

        this.content.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true)
        this.content.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this, true)
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true)
        this.initDoct()

        this.content.x = -this.currentPage * 500
    },

    updatePage(node_page, pageIndex) {
        let defaultPage = Math.ceil((this.pointId + 1) / 50) - 1
        if (pageIndex < 0 || pageIndex > this.currentPage + 1 || pageIndex > this.totalPage || pageIndex > defaultPage + 1) {
            node_page.active = false
            return
        }
        node_page.children.forEach((node, index) => {
            let id = pageIndex * 50 + index + 1;
            let sprite = node.getComponent(cc.Sprite)
            node.children[0].getComponent(cc.Label).string = id.toString()
            if (id <= this.pointId) {
                if (sprite.spriteFrame !== this.asset_unlock) {
                    sprite.spriteFrame = this.asset_unlock//已通过
                }
            } else if (id === this.pointId + 1) {
                if (sprite.spriteFrame !== this.asset_curr) {
                    sprite.spriteFrame = this.asset_curr//当前挑战
                }
            } else if (id > this.pointId + 1) {
                if (id % 25 === 0) {
                    if (sprite.spriteFrame !== this.asset_gift) {
                        node.children[0].getComponent(cc.Label).string = ''
                        sprite.spriteFrame = this.asset_gift//礼物
                    }
                } else if (sprite.spriteFrame !== this.asset_lock) {
                    sprite.spriteFrame = this.asset_lock//无法挑战
                }
            }
            node.name = id.toString()
        });
        node_page.x = 500 * pageIndex
        node_page.active = true
    },

    // 监听滚动条开始滚动
    startCB(e) {
        if (!this.refreshingFlag) {
            this.scorllFlag = true;
        }
    },

    onTouchMove(event) {
        if (this.moving) {
            return
        }
        //FIXME: touch move delta should be calculated by DPI.
        if (!this.touchMoved) {
            let loc = event.touch.getLocation()
            let start = event.touch.getStartLocation()
            let touch = event.touch;
            let move = Math.abs(start.x - loc.x) > 5 || Math.abs(start.y - loc.y) > 5
            if (move) {
                this.touchMoved = true
                event.stopPropagation()
            }
        }
        let x = event.touch.getDelta().x + this.content.x
        x = x > 0 ? 0 : x
        x = x < -this.content.width + 475 ? -this.content.width + 475 : x
        this.content.x = x
    },

    // 监听滚动条结束滚动
    onTouchEnd(e) {
        if (this.moving) {
            return
        }
        if (this.touchMoved) {
            e.stopPropagation();
        }

        let node_page
        let dx = -this.content.x - this.currentPage * 500
        if (dx < -50) {
            if (this.currentPage <= 0) {
                return
            }
            this.currentPage -= 1
            node_page = this.node_pages.pop()
            this.node_pages.unshift(node_page)
            this.moving = true
            this.content.runAction(cc.sequence(
                cc.moveTo(0.3, cc.v2(-this.currentPage * 500, 0)),
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    this.moving = false
                    this.touchMoved = false
                    this.updatePage(node_page, this.currentPage - 1)
                }, this.node)
            ))
        } else if (dx > 50) {
            let defaultPage = Math.ceil((this.pointId + 1) / 50) - 1
            if (this.currentPage >= this.totalPage || this.currentPage >= defaultPage + 1) {
                return
            }
            this.currentPage += 1
            node_page = this.node_pages.shift()
            this.node_pages.push(node_page)
            this.moving = true
            this.content.runAction(cc.sequence(
                cc.moveTo(0.3, cc.v2(-this.currentPage * 500, 0)),
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    this.moving = false
                    this.touchMoved = false
                    this.updatePage(node_page, this.currentPage + 1)
                }, this.node)
            ))
        } else if (dx != 0) {
            this.touchMoved = false
            this.content.runAction(cc.moveTo(0.1, cc.v2(-this.currentPage * 500, 0)))
        } else {
            this.touchMoved = false
            return
        }
        this.initDoct()
    },

    // 画底部小圆点 & 更新
    initDoct() {
        let totalPage = Math.min(Math.ceil((this.pointId + 1) / 50), this.totalPage)
        for (let i = 0; i <= totalPage; i++) {
            let node = null;
            if (this.scrolldoctView.children[i]) {
                node = this.scrolldoctView.children[i]
            }
            else {
                node = cc.instantiate(this.prefab_doct)
                node.parent = this.scrolldoctView
                node.active = true
            }
            if (i !== this.currentPage) {
                node.getComponent(cc.Sprite).spriteFrame = this.asset_docts[0]
            } else {
                node.getComponent(cc.Sprite).spriteFrame = this.asset_docts[1]
            }
        }
    },

    onBackButtonClick: function (event, custom) {
        AF.gotoScene('HallMainScene');
    },

    onItemClick(e) {
        let id = parseInt(e.target.name);
        if (id <= this.pointId + 1) {
            AF.openDialog("HallGameDialog", { pointId: id });
        }
    },
});
