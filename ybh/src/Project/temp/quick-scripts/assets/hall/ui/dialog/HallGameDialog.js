(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/dialog/HallGameDialog.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c02ecbWkOxBwbBv7FyaPZPw', 'HallGameDialog', __filename);
// hall/ui/dialog/HallGameDialog.js

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _GameItem = require('./GameItem');

var _GameItem2 = _interopRequireDefault(_GameItem);

var _LinkItem = require('./LinkItem');

var _LinkItem2 = _interopRequireDefault(_LinkItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DialogBase = require('AFDialogBase');
var itemWidth = 90;

cc.Class({
    extends: DialogBase,

    properties: {
        title: cc.Label,
        itemWrap: cc.Node,
        linkWrap: cc.Node,
        prefabItem: cc.Prefab,
        prefabLink: cc.Prefab,
        label_gold: cc.Label,

        top: cc.Node,
        bottom: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        DialogBase.prototype.onLoad.call(this);

        AF.EventDispatcher.on('GoldRefresh', this.refreshGold, this);
        this.info = null;
        this.items = [];
        this.selectedItems = [];
        this.tipCount = 1;
    },

    onEnable: function onEnable() {
        DialogBase.prototype.onEnable.call(this);

        this.playerData = AF.GameData.getMyPlayerData();

        var params = AF.DIALOG_PARAMS();
        this.pointId = params.pointId || 1;

        this.initUI();

        this.info = AF.GameConfig.getPointInfo(this.pointId);

        this.initItemNodes();
        this.itemWrap.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.itemWrap.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        AF.EventDispatcher.emit('ShowFriendPassed', this.pointId);
    },

    onDisable: function onDisable() {
        DialogBase.prototype.onDisable.call(this);

        AF.EventDispatcher.emit('HideFriendPassed');

        this.itemWrap.off(cc.Node.EventType.TOUCH_START, this.onTouchStart);
        this.itemWrap.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },
    onDestroy: function onDestroy() {
        DialogBase.prototype.onDestroy.call(this);
        AF.EventDispatcher.off('GoldRefresh', this.refreshGold, this);
    },
    refreshGold: function refreshGold() {
        this.playerData = AF.GameData.getMyPlayerData();
        this.label_gold.string = this.playerData.gold.toString();
    },


    initUI: function initUI() {
        //适配iPhoneX，bg沉到最底下
        //this.bg.y = (this.bg.height - cc.winSize.height)/2;
        // this.bg.y = (0 - cc.winSize.height) / 2;
        this.title.string = this.pointId.toString();
    },

    onBackButtonClick: function onBackButtonClick(event, custom) {
        AF.gotoScene("HallMainScene");
    },

    update: function update(dt) {
        if (!this.willShowTips || this.willShowTips.length <= 0) {
            return;
        }
        var now = Date.now();
        if (!this.lastUpdate || now - this.lastUpdate >= 100) {
            var item = this.willShowTips.shift();
            if (item[0]) {
                item[0].updateTipLink(item[1], item[2]);
            }
            if (this.willShowTips.length <= 0) {
                this.willShowTips = null;
            }
            this.lastUpdate = now;
        }
    },

    initItemNodes: function initItemNodes() {
        var _this = this;

        this.itemWrap.destroyAllChildren();
        this.linkWrap.destroyAllChildren();
        this.items = [];
        this.selectedItems = [];
        this.tipCount = 1;
        this.startTime = Date.now();
        this.passed = false;
        this.willShowTips = null;
        //上 下node显示
        // this.top.active = true
        this.bottom.active = true;

        this.label_gold.string = this.playerData.gold.toString();

        for (var x = 0; x < this.info.w; x++) {
            this.items[x] = [];
            for (var y = 0; y < this.info.h; y++) {
                var node = cc.instantiate(this.prefabItem);
                node.x = x * itemWidth + 45;
                node.y = (this.info.h - 1 - y) * itemWidth + 45;
                node.name = 'item_' + x + '_' + y;
                node.parent = this.itemWrap;

                var linkNode = cc.instantiate(this.prefabLink);
                linkNode.x = x * itemWidth;
                linkNode.y = (this.info.h - 1 - y) * itemWidth;
                linkNode.parent = this.linkWrap;

                this.items[x][y] = {
                    node: node,
                    gameitem: node.getComponent(_GameItem2.default),
                    position: [x, y],
                    linkNode: linkNode,
                    linkitem: linkNode.getComponent(_LinkItem2.default)
                };
            }
        }
        this.itemWrap.width = this.info.w * itemWidth;
        this.itemWrap.height = this.info.h * itemWidth;
        this.linkWrap.width = this.info.w * itemWidth;
        this.linkWrap.height = this.info.h * itemWidth;

        // let lastitem = null
        this.info.path.forEach(function (_ref, index) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            if (index === 0) {
                _this.items[x][y].gameitem.setZero(true);
                _this.items[x][y].gameitem.setSelected(true);
                _this.selectedItems = [_this.items[x][y]];
            }
            _this.items[x][y].gameitem.setActive(true);
            // this.items[x][y].gameitem.setLabel(`${index}`)
        });

        this.itemWrap.getComponent(cc.Widget).updateAlignment();
        this.linkWrap.getComponent(cc.Widget).updateAlignment();
    },

    onTouchStart: function onTouchStart(e) {
        var currentItem = this.calcPos(e);
        if (!currentItem) {
            return;
        }
        //回退
        var foundIdx = -1;
        for (var i = 0; i < this.selectedItems.length; i++) {
            if (this.selectedItems[i] === currentItem) {
                foundIdx = i;
                currentItem.gameitem.animateScale();
            }
            if (foundIdx !== -1 && i > foundIdx) {
                this.selectedItems[i].gameitem.setSelected(false);
                this.selectedItems[i].linkitem.updateSelectLink('', false);
            }
        }
        if (foundIdx !== -1) {
            this.selectedItems.splice(foundIdx + 1);
        }
    },

    onTouchMove: function onTouchMove(e) {
        if (this.passed) {
            return;
        }
        var currentItem = this.calcPos(e);
        if (!currentItem || !currentItem.gameitem.getActive()) {
            return;
        }
        var lastSelectItem = this.selectedItems[this.selectedItems.length - 1];
        if (currentItem === lastSelectItem) {
            return;
        }
        var pos = this.getRelativePos(lastSelectItem.position, currentItem.position);
        if (!/top|bottom|left|right/.test(pos)) {
            return;
        }
        //move过程中只能一格一格回退
        if (this.selectedItems.length >= 2 && currentItem === this.selectedItems[this.selectedItems.length - 2]) {
            lastSelectItem.gameitem.setSelected(false);
            lastSelectItem.linkitem.updateSelectLink('', false);
            currentItem.gameitem.animateScale();
            this.selectedItems.pop();
        } else if (!currentItem.gameitem.getSelected()) {
            currentItem.gameitem.setSelected(true);
            currentItem.linkitem.updateSelectLink(pos, true);
            this.selectedItems.push(currentItem);

            this.checkPass();
        }
    },

    calcPos: function calcPos(e) {
        var parentPos = this.itemWrap.convertToWorldSpaceAR(cc.v2(0, 0));
        var v2 = [e.getLocationX() - parentPos.x, e.getLocationY() - parentPos.y];
        var xidx = Math.floor(v2[0] / itemWidth);
        var yidx = this.info.h - Math.ceil(v2[1] / itemWidth);

        if (xidx < 0 || xidx >= this.info.w || yidx < 0 || yidx >= this.info.h) {
            return null;
        }
        return this.items[xidx][yidx];
    },

    getRelativePos: function getRelativePos(lastitem, item) {
        if (!lastitem || !item) return '';

        var _lastitem = _slicedToArray(lastitem, 2),
            x0 = _lastitem[0],
            y0 = _lastitem[1];

        var _item = _slicedToArray(item, 2),
            x1 = _item[0],
            y1 = _item[1];

        if (x0 === x1) {
            if (y0 - y1 === 1) return 'bottom';else if (y0 - y1 === -1) return 'top';
        } else if (y0 === y1) {
            if (x0 - x1 === 1) return 'right';else if (x0 - x1 === -1) return 'left';
        }
        return '';
    },

    checkPass: function checkPass() {
        var _this2 = this;

        if (this.selectedItems.length < this.info.path.length) {
            return false;
        }
        // AF.ToastMessage.show("过关");
        var costTime = Date.now() - this.startTime;
        this.passed = true;
        var over = false;
        if (this.playerData.pointId < this.pointId) {
            //上传分数
            AF.util.upScore({
                score: this.pointId,
                startTime: this.startTime,
                endTime: Date.now()
            });
            this.playerData.pointId = this.pointId;
            over = true;
            AF.GameData.setMyPlayerData(this.playerData);
            AF.GameData.savePlayerData(this.playerData);
        }

        // this.top.active = false
        this.scheduleOnce(function () {
            _this2.bottom.active = false;
            AF.EventDispatcher.emit('HideFriendPassed');

            AF.openDialog("HallBalanceDialog", { costTime: costTime,
                over: over,
                pointId: _this2.pointId,
                close: function close() {
                    return AF.gotoScene("HallMainScene");
                },
                next: _this2.next.bind(_this2) });
        }, 0.5);
        return true;
    },

    clearSelected: function clearSelected() {
        this.selectedItems.forEach(function (item, index) {
            if (index !== 0) {
                item.gameitem.setSelected(false);
                item.linkitem.updateSelectLink('', false);
            }
        });
        this.selectedItems.splice(1);
    },

    checkShowGameTip: function checkShowGameTip(e) {
        var _this3 = this;

        if (this.tipCount >= this.info.path.length || this.willShowTips) {
            return;
        }
        if (this.playerData.gold >= 200) {
            this.playerData.gold -= 200;
            this.label_gold.string = this.playerData.gold.toString();
            AF.GameData.setMyPlayerData(this.playerData);
            AF.GameData.savePlayerData(this.playerData);
            this.showGameTip();
        } else {
            AF.util.showVideoAd('battle', function (suc) {
                if (suc) {
                    _this3.showGameTip();
                }
            });
        }
    },

    showGameTip: function showGameTip() {
        this.clearSelected();
        this.tipCount += 5;
        // const minTimer = () => new Promise((resolve) => setTimeout(resolve, 100))
        var items = this.info.path.slice(0, this.tipCount);
        var start = this.tipCount - 6;
        start = start < 1 ? 1 : start;
        this.willShowTips = [];
        for (var i = start; i < items.length; i++) {
            var lastPath = items[i - 1];
            var currPath = items[i];
            var nextPath = items[i + 1] || null;

            var currItem = this.items[currPath[0]][currPath[1]];
            this.willShowTips.push([currItem.linkitem, this.getRelativePos(lastPath, currPath), this.getRelativePos(nextPath, currPath)]);
        }
    },


    next: function next() {
        this.pointId = this.pointId + 1;
        this.initUI();
        this.info = AF.GameConfig.getPointInfo(this.pointId);

        AF.EventDispatcher.emit('ShowFriendPassed', this.pointId);

        this.initItemNodes();
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=HallGameDialog.js.map
        