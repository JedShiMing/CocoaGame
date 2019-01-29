(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/scene/HallJumpScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b0ffdjl1Z9EdpyW/V0/WdyT', 'HallJumpScene', __filename);
// hall/ui/scene/HallJumpScene.js

'use strict';

//两块云之间的间隔最大值 像素
var CLOUD_INTERVAL = 100;
//云的最大透明度与最小透明度
var MIN_OPACITY = 255 * 0.8;
var MAX_OPACITY = 255 * 0.98;
//云起始高度
var BASE_CLOUD_HEIGHT = 1500;
//石头高度【实际图片大小高度相同】 像素
var STONE_INTERVAL = 80;
//英雄水平方向阻力 像素/s
var DRAG = 1000;
//重力 1500像素/s
var GRAVITY = 2000;
//跳跃初速度 550像素/s
var VELOCITY = 750;

// perfectCount
//石头的配置
/*{
    low: {//0 <= 当前高度 < 20 * STONE_INTERVAL
        width: ,//石头宽度【实际图片大小宽度相同】 像素
        baseDt:, //基础时间间隔 石头中心到达中心点的最小间隔 s
        minSpeed: ,//随机最小速度 像素/s
        maxSpeed: ,//随机最大速度 像素/s
    },
    middle: {//20 * STONE_INTERVAL <= 当前高度 < 50 * STONE_INTERVAL
        ...
    },
    height: {//50 * STONE_INTERVAL <= 当前高度
        ...
    },
}*/
var stone_velocity_config = {
    low: {
        width: 200,
        baseDt: 0.9,
        minSpeed: 300,
        maxSpeed: 380
    },
    middle: {
        width: 200,
        baseDt: 0.6,
        minSpeed: 280,
        maxSpeed: 400
    },
    height: {
        width: 200,
        baseDt: 0.6,
        minSpeed: 280,
        maxSpeed: 400
    }
};
//砖块之间最小速度差
var SPEED_DIFF = 10;
//生成砖块间隔
var CREATE_DEALY_TIME = 1.5;
//石头最大速度 像素/s
var MAX_STONE_SPEED = 700;
//石头范围 
var STONE_RANGE = [2, 5];
//超越分数线间隔 NORMAL_INTERVAL*10
var NORMAL_INTERVAL = 500;
//地面高度 像素
var GROUND_HEIGHT = 425;
//最大完美幂乘
var MAX_PREFECT = 5;
//砖块中心点完美偏差
var PREFECT_OFFSET = 0;
/*以上是配置项 以下不允许修改*/

var debug = false;

var jumpActionName = 'attack';

var BASE_SCORE = 1;

var CLOUD_ACTION_TAG = 10005;

var GAME_STATUS = {
    CONTINUE: 'CONTINUE',
    OVER: 'OVER',
    DROP: 'DROP',
    BALANCE: 'BALANCE',
    PAUSE: 'PAUSE'
};

var PLAYER_STATUS = {
    GROUND: 'GROUND',
    SKY: 'SKY',
    DOUBLE: 'DOUBLE'
};

cc.Class({
    extends: cc.Component,

    properties: {
        uiNode: cc.Node,
        gameNode: cc.Node,
        cloudNode: cc.Node,
        bgNode: cc.Node,
        rocketBg: cc.Node,

        goldNode: cc.Node,

        perfectFont: cc.BitmapFont,
        normalFont: cc.BitmapFont,

        playerPre: cc.Prefab,
        effectPre: cc.Prefab,
        stonePre: cc.Prefab,
        titleSpriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },

        scoreNode: cc.Node,

        sharerOpenId: cc.Label,
        sharerNickName: cc.Label,
        score: cc.Label,
        photo: cc.Node,

        reviveButton: cc.Node
    },

    onLoad: function onLoad() {
        this.playerData = AF.GameData.getMyPlayerData();

        this.step = 0;

        var origin = cc.v2(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2);

        this.uiNode.setPosition(origin);
        // var uiBg = this.uiNode.getChildByName('bg');
        // uiBg.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        // uiBg.width = cc.winSize.width;
        // uiBg.height = cc.winSize.height;
        var logoNode = this.uiNode.getChildByName('logoNode');
        logoNode.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));

        var touchNode = this.node.getChildByName('touchNode');
        touchNode.width = cc.winSize.width;
        touchNode.height = cc.winSize.height;
        touchNode.setPosition(origin);
        touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        var offsetPos = cc.v2(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2 - cc.winSize.height * 1.5);
        this.gameNode.setPosition(offsetPos);

        this.cloudNode.setPosition(offsetPos);

        this.bgNode.setPosition(offsetPos);

        // this.playerId = AF.GameConfig.getRandomPlayerId();
        // this.playerId = 1101;
        this.initUINode(this.uiNode);
        this.initGameNode(this.gameNode);
        this.initCloudNode(this.cloudNode);
        this.initBGNode(this.bgNode);

        this.initGameStart();

        this.showDustEffect(0, 0 - cc.winSize.height);
        this.showLineEffect(0 - cc.winSize.height);

        this.gameStatus = GAME_STATUS.OVER;
        this.playerStatus = PLAYER_STATUS.SKY;

        this.goldPool = [];
        AF.EventDispatcher.on(AF.Event.JUMP_REVIVE, this.onBalanceDialogEvent, this);

        //AF.util.showBannerAd("main");

        this.photoScript = this.photo.getComponent("PhotoPrefab");

        this.schedule(this.onGameBGM, 0.1, this);
    },

    onDestroy: function onDestroy() {
        AF.EventDispatcher.off(AF.Event.JUMP_REVIVE, this.onBalanceDialogEvent, this);

        AF.util.hideBannerAd("main");
    },

    onBalanceDialogEvent: function onBalanceDialogEvent(status) {
        if (status === 0) {
            this.reviveButton.active = true;
            // this.showRevive();
            this.scoreNode.active = true;
        } else if (status === 1) {
            this.scoreNode.active = false;
            this.gameStart = false;
            this.showBalance();
        } else if (status === 2) {
            this.scoreNode.active = false;
            this.gameStatus = GAME_STATUS.BALANCE;
        }
    },

    initUINode: function initUINode(node) {
        var node = this.uiNode;
        // var logo = node.getChildByName('logo');
        // logo.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.618);

        var playerButton = node.getChildByName('playerButton');
        var scale = 1.3;

        var hero = cc.instantiate(this.playerPre);
        hero.setPosition(5, -28);
        hero.setScale(scale);
        playerButton.getChildByName('button').addChild(hero);
        this.buttonHeroScript = hero.getComponent("PlayerPrefab");
        // this.buttonHeroScript.setPlayerID(this.playerId);
        // this.buttonHeroScript.playDefaultPoise();
        // this.buttonHeroScript.setHeroShadow(false);
        playerButton.setPosition(100, 0.15 * cc.winSize.height);

        var rankButton = node.getChildByName('rankButton');
        rankButton.setPosition(540, 0.15 * cc.winSize.height);

        var startButton = node.getChildByName('startButton');
        startButton.setPosition(320, 0.15 * cc.winSize.height);

        var gameCountNode = this.uiNode.getChildByName('gameCount');
        gameCountNode.setPosition(0, cc.winSize.height * 0.93);

        var overNode = this.uiNode.getChildByName('overNode');
        overNode.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.93 - 150);
        var childs = ['overBestScore', 'overAveScore', 'overPreScore', 'overNormal'];
        var node = null;
        for (var i = 0; i < childs.length; i++) {
            var childNode = overNode.getChildByName(childs[i]);
            childNode.scale = 0;
        }

        var startNode = this.uiNode.getChildByName('startNode');
        startNode.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.6);
        var childs = ['ready', 'cutdown0', 'cutdown1', 'go'];
        var node = null;
        for (var _i = 0; _i < childs.length; _i++) {
            var _childNode = startNode.getChildByName(childs[_i]);
            _childNode.scale = 0;
        }

        var tipsNode = this.uiNode.getChildByName('tips');
        tipsNode.setPosition(cc.winSize.width / 2, cc.winSize.height * 0.93 - 250);
    },

    createNewStone: function createNewStone() {
        var stoneNode = cc.instantiate(this.stonePre);
        stoneNode.setPosition(-1000, 0);
        this.gameNode.addChild(stoneNode, -1);
        var stoneScript = stoneNode.getComponent('StonePrefab');
        stoneScript.setStoneType('stone');
        stoneScript.setNewColor(stone_velocity_config.low.width);
        stoneScript.setStoneRect(stone_velocity_config.low.width, STONE_INTERVAL);
        return stoneScript;
    },

    initGameNode: function initGameNode() {

        this.totalHeight = GROUND_HEIGHT;
        var scale = 1.5;
        this.playerNode = this.gameNode.getChildByName('playerNode');
        this.playerNode.zIndex = 9;
        this.playerNode.width = 36 * scale;
        this.playerNode.height = 78 * scale;
        // this.playerNode.setAnchorPoint(0.5, 0);
        this.playerNode.setPosition(cc.winSize.width / 2, GROUND_HEIGHT);

        var jumpHero = cc.instantiate(this.playerPre);
        jumpHero.setScale(scale);
        jumpHero.setPosition(0, 0);
        this.playerNode.addChild(jumpHero, 1, 'jumpHero');
        this.heroScript = jumpHero.getComponent("PlayerPrefab");
        // this.heroScript.setPlayerID(this.playerId);
        // this.heroScript.setHeroShadow(false);

        var backupHero = cc.instantiate(this.playerPre);
        backupHero.setScale(scale);
        backupHero.setPosition(0, 0);
        this.playerNode.addChild(backupHero, 1, 'backupHero');
        this.backupHeroInfo = {
            script: backupHero.getComponent("PlayerPrefab"),
            playerId: AF.GameConfig.getRandomPlayerId()
        };
        this.backupHeroInfo.script.setPlayerID(this.backupHeroInfo.playerId);
        backupHero.active = false;

        this.stonePool = [];
        var stoneNum = Math.ceil(cc.winSize.height / STONE_INTERVAL);
        for (var i = 0; i < stoneNum; i++) {
            var stoneScript = this.createNewStone();
            var stoneObj = { script: stoneScript, status: false };
            this.stonePool.push(stoneObj);
        }
        this.groundStone = null;
        this.lineMgr = {};
        var lines = ['aveLine', 'lastLine', 'bestLine', 'normalLine'];
        for (var _i2 = 0; _i2 < lines.length; _i2++) {
            var name = lines[_i2];
            var line = this.gameNode.getChildByName(name);
            // line.x = cc.winSize.width / 2;
            this.lineMgr[name] = line;
        }
    },

    initCloudNode: function initCloudNode(node) {
        var node = this.cloudNode;
        this.cloudMgr = [];
        var cloudNum = Math.ceil(1.5 * cc.winSize.height / CLOUD_INTERVAL);
        for (var i = 0; i < cloudNum; i++) {
            var nodeName = 'cloudNode' + (1 + i);
            var cloudNode = new cc.Node(nodeName);
            var cloudSp = cloudNode.addComponent(cc.Sprite);
            cloudSp.trim = false;
            cloudSp.sizeMode = 2;
            node.addChild(cloudNode, 9, nodeName);

            var cloudObj = { sprite: cloudSp, cloudId: i };
            this.refreshCloudUI(cloudObj);
            this.cloudMgr[i] = cloudObj;
        }
    },

    refreshCloudUI: function refreshCloudUI(cloudObj) {
        if (!cloudObj || !cloudObj.sprite) {
            return;
        }

        var cloudSp = cloudObj.sprite;
        var node = cloudObj.sprite.node;
        var baseHeight = BASE_CLOUD_HEIGHT + cloudObj.cloudId * CLOUD_INTERVAL;

        var name = 'yun' + (1 + Math.ceil(Math.random() * 100) % 4);
        var x = Math.ceil(Math.random() * 10) % 2 * 2 * cc.winSize.width / 3 + Math.random() * cc.winSize.width / 3;
        var y = baseHeight + Math.random() * CLOUD_INTERVAL;

        node.opacity = MIN_OPACITY + Math.ceil(Math.random() * (MAX_OPACITY - MIN_OPACITY));

        cc.loader.loadRes('hall/textures/cloud/' + name, cc.SpriteFrame, function (err, spriteFrame) {

            if (err) {
                console.warn('url: hall/textures/cloud/' + name + ' load fail');
                return;
            }
            if (cloudSp) {
                cloudSp.spriteFrame = spriteFrame;
                cloudSp.node.zIndex = -1 * Math.ceil(y / CLOUD_INTERVAL);
            } else {
                console.warn('Cloud sprite frame setting error!');
            }
        });
        var minX = 0 - cc.winSize.width / 2;
        // let maxX = cc.winSize.width - node.width;
        node.setPosition(x, y);
        // node.setPosition(minX, y);

        this.addCloudMoveEffect(node);
        if (node.active) {
            // node.stopActionByTag(CLOUD_ACTION_TAG);
            // // var dxAndDts = [];
            // // for (let i = 1; i <= 4; i++) {
            // //     let dx = i * 10 + cc.random0To1() * 20;
            // //     let dt1 = i * 1 + cc.random0To1() * 1;
            // //     let dt2 = i * 1 + cc.random0To1() * 1;
            // //     dxAndDts.push({ dx: dx, dt: dt1 });
            // //     dxAndDts.push({ dx: 0 - dx, dt: dt2 });
            // // }
            // var actions = [];
            // (maxX - minX) / (minSpeed + Math.random() * (maxSpeed - minSpeed));
            // actions.push(
            //     cc.moveTo(, maxX, y)
            // )
            // actions.push(
            //     cc.callFunc(function () {
            //         node.setPosition(minX, y);
            //     })
            // );
            // // actions.push(cc.moveTo(actionInfo[0].dt, actionInfo[0].dx, 0));
            // // while (true) {
            // //     if (!dxAndDts.length) { break; }
            // //     var index = Math.floor(Math.random() * dxAndDts.length);
            // //     var actionInfo = dxAndDts.splice(index, 1);
            // //     actions.push(cc.moveBy(actionInfo[0].dt, actionInfo[0].dx, 0));
            // // }
            // var action = cc.repeatForever(cc.sequence(actions));
            // action.setTag(CLOUD_ACTION_TAG);
            // node.runAction(action);
        }
    },

    initBGNode: function initBGNode(node) {
        this.bgMgr = [];
        this.bgMgr.push(node.getChildByName('sky1'));
        this.bgMgr.push(node.getChildByName('sky2'));
        this.bgMgr.push(node.getChildByName('sky3'));
    },

    initGameStart: function initGameStart() {
        this.gameStartTime = Date.now();
        var origin = cc.v2(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2);

        this.uiNode.setPosition(origin);
        var logoNode = this.uiNode.getChildByName('logoNode');
        logoNode.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));

        // var offsetPos = cc.p(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2 - 830);
        var offsetPos = cc.v2(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2 - cc.winSize.height * 1.5);
        this.gameNode.setPosition(offsetPos);

        this.cloudNode.setPosition(offsetPos);

        this.bgNode.setPosition(offsetPos);

        var tips = this.uiNode.getChildByName('tips');
        var title = tips.getChildByName('title').getComponent(cc.Sprite);
        var addIcon = tips.getChildByName('addIcon').getComponent(cc.Sprite);
        var scoreNum = tips.getChildByName('scoreNum').getComponent(cc.Label);
        title.node.active = false;
        title.node.scale = 0;
        addIcon.node.active = false;
        scoreNum.node.active = false;
        this.scoreNode.active = true;

        for (var i = 0; i < this.stonePool.length; i++) {
            var stoneObj = this.stonePool[i];
            stoneObj.status = false;
            stoneObj.script.node.setPosition(-1000, 0);
            stoneObj.script.node.opacity = 255;
        }

        for (var _i3 = 0; _i3 < this.cloudMgr.length; _i3++) {
            var cloudObj = this.cloudMgr[_i3];
            cloudObj.cloudId = _i3;
            this.refreshCloudUI(cloudObj);
        }

        for (var _i4 = 0; _i4 < this.bgMgr.length; _i4++) {
            var bgNode = this.bgMgr[_i4];
            bgNode.y = bgNode.height * _i4;
        }
        this.heroVerticalVelocity = 0;
        this.heroHorizontalVelocity = 0;
        this.heroRotationVelocity = 0;

        var newBackupHeroScript = this.heroScript;
        var newBackupPlayerId = AF.GameConfig.getRandomPlayerId();
        newBackupHeroScript.setPlayerID(newBackupPlayerId);
        newBackupHeroScript.node.active = false;

        this.playerId = this.backupHeroInfo.playerId;
        this.heroScript = this.backupHeroInfo.script;
        this.heroScript.node.active = true;
        this.backupHeroInfo = {
            script: newBackupHeroScript,
            playerId: newBackupPlayerId
        };
        this.heroScript.playAction('wait');
        this.heroScript.setHeroShadow(false);

        this.playerNode.zIndex = 9;
        this.playerNode.width = 36;
        this.playerNode.height = 78;
        this.playerNode.setAnchorPoint(0.5, 0);
        this.playerNode.rotation = 0;
        this.playerNode.setPosition(cc.winSize.width / 2, GROUND_HEIGHT);

        this.buttonHeroScript.setPlayerID(this.playerId);
        this.buttonHeroScript.playDefaultPoise();
        this.buttonHeroScript.setHeroShadow(false);

        this.groundStone = null;

        this.perfectCount = 0;
        this.step = 0;
        this.totalScore = 0;
        var gameCountNode = this.uiNode.getChildByName('gameCount');
        var totalScoreNode = gameCountNode.getChildByName('scoreNum');
        var totalScoreNum = totalScoreNode.getComponentInChildren(cc.Label);
        totalScoreNum.font = this.normalFont;

        this.refreshCountLabel();
        gameCountNode.active = false;

        this.stoneList = [];
        this.perfectStoneList = [];

        var bestLimt = this.playerData.bestScore;
        var bestLine = this.lineMgr['bestLine'];
        bestLine.setPosition(cc.winSize.width / 2, GROUND_HEIGHT + STONE_INTERVAL * bestLimt);
        if (bestLimt) {
            bestLine.active = true;
        } else {
            bestLine.active = false;
        }

        var averLimt = Math.ceil(this.playerData.totalScore / this.playerData.playCount);
        var aveLine = this.lineMgr['aveLine'];
        aveLine.setPosition(cc.winSize.width / 2, GROUND_HEIGHT + STONE_INTERVAL * averLimt);
        if (averLimt && averLimt !== bestLimt) {
            aveLine.active = true;
        } else {
            aveLine.active = false;
        }
        var preLimt = this.playerData.preScore;
        var lastLine = this.lineMgr['lastLine'];
        lastLine.setPosition(cc.winSize.width / 2, GROUND_HEIGHT + STONE_INTERVAL * preLimt);
        if (preLimt && preLimt !== bestLimt && preLimt !== averLimt) {
            lastLine.active = true;
        } else {
            lastLine.active = false;
        }

        this.currLimt = 1;

        if (this.currLimt * NORMAL_INTERVAL === preLimt) {
            this.currLimt += 1;
        }
        if (this.currLimt * NORMAL_INTERVAL === averLimt) {
            this.currLimt += 1;
        }
        if (this.currLimt * NORMAL_INTERVAL === bestLimt) {
            this.currLimt += 1;
        }
        var normalLine = this.lineMgr['normalLine'];
        normalLine.setPosition(cc.winSize.width / 2, GROUND_HEIGHT + STONE_INTERVAL * this.currLimt * NORMAL_INTERVAL);
        normalLine.active = true;
    },

    onDisable: function onDisable() {
        // this.node.active = true;
    },

    start: function start() {
        AF.EventDispatcher.emit(AF.Event.SCENE_LOADED);
        this.heroVerticalVelocity = 0;
        this.heroHorizontalVelocity = 0;
        this.heroRotationVelocity = 0;
        this.gameStart = false;
    },

    /********** 定时器函数 **********/

    updateHeroPosition: function updateHeroPosition(dt, keep) {
        keep = keep || false;
        this.playerNode.y += this.heroVerticalVelocity * dt;
        this.playerNode.x += this.heroHorizontalVelocity * dt;

        this.playerNode.rotation += this.heroRotationVelocity * dt;
        this.heroVerticalVelocity -= dt * GRAVITY;
        if (this.heroHorizontalVelocity > 0) {
            this.heroHorizontalVelocity = Math.max(0, this.heroHorizontalVelocity - dt * DRAG);
        } else if (this.heroHorizontalVelocity < 0) {
            this.heroHorizontalVelocity = Math.min(0, this.heroHorizontalVelocity + dt * DRAG);
        }

        if (this.playerNode.y <= GROUND_HEIGHT) {
            this.heroVerticalVelocity = 0;
            // this.heroHorizontalVelocity = 0;
            this.playerNode.y = GROUND_HEIGHT;
        }
        if (0 === this.heroHorizontalVelocit && 0 === this.heroVerticalVelocity) {
            this.heroRotationVelocity = 0;
        }
        if (Math.abs(this.playerNode.rotation) > 75) {
            this.heroRotationVelocity = 0;
        }
        if (!this.stoneList || !this.stoneList[0]) {
            return;
        }
        var stoneObj = this.stoneList[0];
        if (!keep && stoneObj.velocity > 0) {
            this.heroScript.setFlipX(true);
        } else if (stoneObj.velocity < 0) {
            this.heroScript.setFlipX(false);
        }
    },

    updateStonePosition: function updateStonePosition(dt) {
        var stoneList = this.stoneList;
        for (var i = 0; i < stoneList.length; i++) {
            var stoneObj = stoneList[i];
            if (stoneObj.delayTime > 0) {
                stoneObj.delayTime -= dt;
                continue;
            }
            var node = stoneObj.script.node;
            node.x += stoneObj.velocity * dt;
            stoneObj.velocity += dt * stoneObj.acceleration;
            if (stoneObj.velocity < 0 && node.x < cc.winSize.width / 2 || stoneObj.velocity > 0 && node.x > cc.winSize.width / 2) {
                stoneObj.velocity = 0;
                stoneObj.acceleration = 0;
                node.x = cc.winSize.width / 2;
            }
        }
    },

    //核心检测
    rectIntersectsRect: function rectIntersectsRect(rectA, rectB) {
        if (!rectA || !rectB) {
            return null;
        }
        var rectAMinX = cc.rectGetMinX(rectA);
        var rectAMaxX = cc.rectGetMaxX(rectA);
        var rectAMinY = cc.rectGetMinY(rectA);
        var rectAMaxY = cc.rectGetMaxY(rectA);

        var rectBMinX = cc.rectGetMinX(rectB);
        var rectBMaxX = cc.rectGetMaxX(rectB);
        var rectBMinY = cc.rectGetMinY(rectB);
        var rectBMaxY = cc.rectGetMaxY(rectB);

        var newMinX = Math.max(rectAMinX, rectBMinX);
        var newMaxX = Math.min(rectAMaxX, rectBMaxX);

        var newMinY = Math.max(rectAMinY, rectBMinY);
        var newMaxY = Math.min(rectAMaxY, rectBMaxY);

        var rect = { x: newMinX, y: newMinY, width: newMaxX - newMinX, height: newMaxY - newMinY };
        if (rect.width <= 0 || rect.height <= 0) {
            rect = null;
        }
        return rect;
    },

    checkIntersects: function checkIntersects(stoneRect, playerRect) {
        //碰撞结果
        var newRect = this.rectIntersectsRect(stoneRect, playerRect);
        if (!newRect) {
            return null;
        }

        var dx = newRect.width;
        var dy = newRect.height;
        var result = null;
        if (dx >= playerRect.width) {
            result = { gameStatus: GAME_STATUS.CONTINUE };
        } else if (dy >= 18) {
            result = { gameStatus: GAME_STATUS.OVER };
        } else if (dx <= 16) {
            result = null;
        } else {
            result = { gameStatus: GAME_STATUS.CONTINUE };
        }
        if (result && GAME_STATUS.CONTINUE === result.gameStatus && this.heroVerticalVelocity > 0) {
            result = null;
        }
        return result;
    },

    updateIntersects: function updateIntersects(playerRect) {

        var velocity = 0;
        var playerTrueY = GROUND_HEIGHT;

        //检测运动中的砖块的碰撞
        var resultStone = null;
        if (this.stoneList && this.stoneList[0]) {
            var stoneObj = this.stoneList[0];

            var stoneRect = stoneObj.script.getStoneRect();
            stoneRect.height += 1;
            // stoneRect.x = AF.util.getDestination(stoneRect.x, stoneObj.velocity, stoneObj.acceleration, dt);
            resultStone = this.checkIntersects(stoneRect, playerRect);

            velocity = stoneObj.velocity;
            playerTrueY = stoneObj.script.node.y + stoneObj.script.node.height;
        }
        if (resultStone) {
            return Object.assign({}, resultStone, { velocity: velocity, playerTrueY: playerTrueY, type: 'stone' });
        }

        //检测是否已经落到地面
        velocity = 0;
        var groundRect = {};
        groundRect.x = 0;
        groundRect.y = GROUND_HEIGHT - STONE_INTERVAL;
        groundRect.width = cc.winSize.width;
        groundRect.height = STONE_INTERVAL + 1;
        playerTrueY = GROUND_HEIGHT;

        if (this.groundStone) {
            groundRect.y = this.groundStone.node.y;
            playerTrueY = this.groundStone.node.y + this.groundStone.node.height;
        }

        var resultGround = this.checkIntersects(groundRect, playerRect);

        if (resultGround) {
            resultGround.gameStatus = GAME_STATUS.CONTINUE;
            return Object.assign({}, resultGround, { velocity: velocity, playerTrueY: playerTrueY, type: 'ground' });
        }
        return { gameStatus: GAME_STATUS.DROP };
    },

    updateGameNextDt: function updateGameNextDt(result) {
        if (GAME_STATUS.DROP === result.gameStatus) {
            return;
        } else if (GAME_STATUS.OVER === result.gameStatus) {
            //游戏结束perfect
            AF.audio.play('lose');
            if (PLAYER_STATUS.DOUBLE === this.playerStatus) {
                this.doJump();
            }
            this.heroHorizontalVelocity = result.velocity * 3 / 2;
            this.heroRotationVelocity = result.velocity;
            this.gameStatus = GAME_STATUS.OVER;
            this.heroScript.stopAction();
            return;
        }
        //continue
        this.refreshHeroStatus(result);

        if ('ground' === result.type) {
            return;
        }

        //获得分数
        this.step += 1;
        var score = BASE_SCORE;
        var tipType = 'normal';
        var tipNum = 0;
        var audioName = 'dong';
        if (this.groundStone) {
            var offsetX = Math.abs(this.stoneList[0].script.node.x - this.groundStone.node.x);
            var dx = this.groundStone.node.width - offsetX;
            if (offsetX <= PREFECT_OFFSET) {
                this.perfectCount += 1;
                if (this.perfectStoneList.length <= 0) {
                    this.perfectStoneList.push(this.groundStone);
                }
                this.perfectStoneList.push(this.stoneList[0].script);
                if (MAX_PREFECT !== -1 && this.perfectCount > MAX_PREFECT) {
                    score = Math.pow(2 * BASE_SCORE, MAX_PREFECT);
                } else {
                    score = Math.pow(2 * BASE_SCORE, this.perfectCount);
                }
                // score = BASE_SCORE * 2;
                tipType = 'perfect';
                tipNum = this.perfectCount;
                audioName = 'perfect' + (1 + this.perfectCount % 5);
            } else if (dx >= 8) {
                this.perfectCount = 0;
                this.perfectStoneList = [];
                score = BASE_SCORE;
                tipType = 'normal';
                tipNum = 0;
                audioName = 'dong';
            } else if (dx < 8) {
                this.perfectCount = 0;
                this.perfectStoneList = [];
                score = BASE_SCORE;
                tipType = 'danger';
                tipNum = 0;
                audioName = 'dong';
            }
        }

        // AF.audio.play(audioName);

        var stoneObj = this.stoneList.shift();
        var oldGroundStone = this.groundStone;
        var newGroundStone = stoneObj.script;
        this.showTips(tipType, tipNum, score);
        // this.totalScore += score;
        if (oldGroundStone) {
            oldGroundStone.showScoreFadeAction();
            // oldGroundStone.showLight();
        }
        newGroundStone.showScore(score, tipType);
        if (this.stoneList.length <= 5) {

            var lastStone = this.stoneList[this.stoneList.length - 1];
            var newList = this.getNexStoneList(lastStone, STONE_RANGE[0], STONE_RANGE[1]);
            this.stoneList = this.stoneList.concat(newList);
            // this.stoneList.push(newList);
        }

        this.refreshCountLabel();
        this.groundStone = newGroundStone;
    },

    refreshHeroStatus: function refreshHeroStatus(result) {
        this.heroHorizontalVelocity = 0;
        this.playerNode.y = result.playerTrueY;
        switch (this.playerStatus) {
            case PLAYER_STATUS.GROUND:
                this.heroVerticalVelocity = 0;
                break;
            case PLAYER_STATUS.SKY:
                this.showDustEffect(this.heroScript.getFlipX(), result.playerTrueY);
                this.heroScript.playAction('wait');
                this.playerStatus = PLAYER_STATUS.GROUND;
                this.heroVerticalVelocity = 0;
                if ('ground' === result.type) {
                    // AF.audio.play('dong');
                }
                break;
            case PLAYER_STATUS.DOUBLE:
                this.heroVerticalVelocity = 0;
                this.showDustEffect(this.heroScript.getFlipX(), result.playerTrueY);
                this.doJump();
                break;
            default:
                break;
        }
    },

    updateGameNodePosition: function updateGameNodePosition(dt, velocity) {
        this.gameNode.y += dt * velocity;
        this.cloudNode.y += dt * velocity;
        this.bgNode.y += dt * velocity;

        this.refreshCloudMgr();
        this.refreshStonePool();
        this.refreshBGNode();
    },

    updateLine: function updateLine(dt) {
        var message = '';
        var posY = GROUND_HEIGHT;
        var currScore = Math.ceil(this.totalScore / BASE_SCORE);
        var score = 0;

        var normalLimt = this.step + this.currLimt * NORMAL_INTERVAL - currScore;
        var normalLine = this.lineMgr['normalLine'];
        if (normalLine.y > GROUND_HEIGHT + STONE_INTERVAL * normalLimt) {
            normalLine.y -= dt * (STONE_INTERVAL / 0.1);
        }
        if (currScore >= this.currLimt * NORMAL_INTERVAL) {
            message = 'overNormal';
            posY = normalLine.y;
            // this.showLineEffect(normalLine.y);
            this.currLimt = Math.floor(this.totalScore / NORMAL_INTERVAL) + 1;
            score = (this.currLimt - 1) * NORMAL_INTERVAL * BASE_SCORE;
            if (this.currLimt * NORMAL_INTERVAL === this.playerData.preScore) {
                this.currLimt += 1;
            }
            if (this.currLimt * NORMAL_INTERVAL === Math.ceil(this.playerData.totalScore / this.playerData.playCount)) {
                this.currLimt += 1;
            }
            if (this.currLimt * NORMAL_INTERVAL === this.playerData.bestScore) {
                this.currLimt += 1;
            }
            normalLimt = this.step + this.currLimt * NORMAL_INTERVAL - currScore;
            normalLine.setPosition(cc.winSize.width / 2, GROUND_HEIGHT + STONE_INTERVAL * normalLimt);
        }

        var preLimt = this.step + this.playerData.preScore - currScore;
        var lastLine = this.lineMgr['lastLine'];
        if (lastLine.y > GROUND_HEIGHT + STONE_INTERVAL * preLimt) {
            lastLine.y -= dt * (STONE_INTERVAL / 0.1);
        }
        if (lastLine.active && preLimt <= this.step) {
            message = 'overPreScore';
            posY = lastLine.y;
            // this.showLineEffect(lastLine.y);
            lastLine.active = false;
        }

        var averLimt = this.step + Math.ceil(this.playerData.totalScore / this.playerData.playCount) - currScore;
        var aveLine = this.lineMgr['aveLine'];
        if (aveLine.y > GROUND_HEIGHT + STONE_INTERVAL * averLimt) {
            aveLine.y -= dt * (STONE_INTERVAL / 0.1);
        }
        if (aveLine.active && averLimt <= this.step) {
            message = 'overAveScore';
            posY = aveLine.y;
            // this.showLineEffect(aveLine.y);
            aveLine.active = false;
        }

        var bestLimt = this.step + this.playerData.bestScore - currScore;
        var bestLine = this.lineMgr['bestLine'];
        if (bestLine.y > GROUND_HEIGHT + STONE_INTERVAL * bestLimt) {
            bestLine.y -= dt * (STONE_INTERVAL / 0.1);
        }
        if (bestLine.active && bestLimt <= this.step) {
            message = 'overBestScore';
            posY = bestLine.y;
            // this.showLineEffect(bestLine.y);
            bestLine.active = false;
        }
        if (message) {
            this.showOverMessage(message, score);
            this.showLineEffect(posY);
        }
    },

    showOverMessage: function showOverMessage(message, score) {
        var overNode = this.uiNode.getChildByName('overNode');
        var gameCountNode = this.uiNode.getChildByName('gameCount');
        var scoreNum = gameCountNode.getChildByName('scoreNum').getComponentInChildren(cc.Label);
        var worldPos = scoreNum.node.convertToWorldSpaceAR(cc.v2(0, 0));
        var localPos = this.uiNode.convertToNodeSpaceAR(cc.v2(worldPos.x, worldPos.y - scoreNum.node.height / 2 - 50));

        overNode.setPosition(localPos);

        var childs = ['overBestScore', 'overAveScore', 'overPreScore', 'overNormal'];
        var node = null;
        for (var i = 0; i < childs.length; i++) {
            var childNode = overNode.getChildByName(childs[i]);
            childNode.stopAllActions();
            childNode.scale = 0;
            if (message === childs[i]) {
                node = childNode;
            }
        }
        if (!node) {
            return;
        }
        if ('overNormal' === message) {
            var _scoreNum = node.getChildByName('scoreNum');
            _scoreNum.getComponent(cc.Label).string = score;
            node.getChildByName('title').x = 0 - _scoreNum.width / 2;
            node.getChildByName('scoreIcon').x = _scoreNum.width / 2;
        }
        node.runAction(cc.sequence(cc.scaleTo(0.3, 1.2).easing(cc.easeBackOut()), cc.scaleTo(0.3, 1).easing(cc.easeBackIn()), cc.delayTime(0.4), cc.scaleTo(0.1, 0).easing(cc.easeBackOut())));
    },

    refreshCloudMgr: function refreshCloudMgr() {
        while (true) {
            var lowCloud = this.cloudMgr[0];
            if (!lowCloud) {
                break;
            }
            var cloudNode = lowCloud.sprite.node;
            var pos = cloudNode.convertToWorldSpaceAR(cc.v2(0, 0));
            if (pos.y >= -4 * STONE_INTERVAL - 0.5 * cloudNode.height) {
                break;
            }
            var heightCloud = this.cloudMgr[this.cloudMgr.length - 1];
            lowCloud.cloudId = heightCloud.cloudId + 1;
            this.refreshCloudUI(lowCloud);
            var newHeightCloud = this.cloudMgr.shift();
            this.cloudMgr.push(newHeightCloud);
        }
    },

    refreshStonePool: function refreshStonePool() {
        for (var i = 0; i < this.stonePool.length; i++) {
            var stoneObj = this.stonePool[i];
            if (!stoneObj.status) {
                continue;
            }
            var stoneNode = stoneObj.script.node;
            var pos = stoneNode.convertToWorldSpaceAR(cc.v2(0, 0));
            if (pos.y < -4 * STONE_INTERVAL) {
                stoneObj.status = false;
                stoneNode.setPosition(-1000, 0);
                stoneNode.opacity = 255;
                stoneNode.zIndex = -1;
            }
        }
        while (true && this.perfectStoneList[0]) {
            var stone = this.perfectStoneList[0];
            var _stoneNode = stone.node;
            var _pos = _stoneNode.convertToWorldSpaceAR(cc.v2(0, 0));
            if (_pos.y < -4 * STONE_INTERVAL) {
                this.perfectStoneList.shift();
            } else {
                break;
            }
        }
    },

    refreshBGNode: function refreshBGNode() {
        var maxY = this.bgMgr[this.bgMgr.length - 1].height + this.bgMgr[this.bgMgr.length - 1].y;
        var lowBgNode = this.bgMgr[0];
        var lowPos = lowBgNode.convertToWorldSpaceAR(cc.v2(0, 0));
        if (lowPos.y < -4 * STONE_INTERVAL - 1 * lowBgNode.height) {
            this.bgMgr.shift();
            this.bgMgr.push(lowBgNode);
            lowBgNode.y = maxY;
            return;
        }

        // var minY = this.bgMgr[0].y;
        // var heightBgNode = this.bgMgr[this.bgMgr.length - 1];
        // var heightPos = heightBgNode.convertToWorldSpaceAR(cc.p(0, 0));
        // if (heightPos.y > 4 * STONE_INTERVAL) {
        //     this.bgMgr.pop();
        //     this.bgMgr.unshift(lowBgNode);
        //     lowBgNode.y = minY - 1 * heightBgNode.height;
        //     return;
        // }
    },

    update: function update(dt) {
        if (!this.gameStart) {
            return;
        }
        if ('ROCKET' === this.gameModle) {
            this.updateRocket(dt);
        } else if ('NORMAL' === this.gameModle) {
            this.updateNormal(dt);
        }
    },

    updateNormal: function updateNormal(dt) {
        if (GAME_STATUS.PAUSE === this.gameStatus) {
            return;
        }
        //更新英雄位置
        this.updateHeroPosition(dt);
        //更新云层 石头 背景
        var currY = Math.abs(this.gameNode.y);
        if (currY - cc.winSize.height / 2 <= this.step * STONE_INTERVAL) {
            this.updateGameNodePosition(dt, -2 * STONE_INTERVAL);
        } else if (currY - cc.winSize.height / 2 >= (this.step + 1) * STONE_INTERVAL) {
            this.updateGameNodePosition(dt, 2 * STONE_INTERVAL);
        }
        this.updateLine(dt);
        switch (this.gameStatus) {
            case GAME_STATUS.BALANCE:
                break;
            case GAME_STATUS.PAUSE:
                break;
            case GAME_STATUS.OVER:
                this.gameStatus = GAME_STATUS.BALANCE;
                var params = {
                    modle: 'balance',
                    data: {
                        score: this.totalScore,
                        startTime: this.gameStartTime
                    }
                };
                if (!AF.util.isVideoAdLoaded()) {
                    this.reviveEnable = false;
                } else if (this.reviveEnable) {
                    this.gameStatus = GAME_STATUS.PAUSE;
                    var params = {
                        modle: 'revive',
                        data: {
                            score: this.totalScore,
                            startTime: this.gameStartTime
                        }
                    };
                }
                this.scoreNode.active = false;
                AF.openDialog('HallBalanceDialog', params);
                break;
            case GAME_STATUS.CONTINUE:
                var playerRect = this.playerNode.getBoundingBox();
                //砖石位置更新
                this.updateStonePosition(dt);
                //检测碰撞框
                var result = this.updateIntersects(playerRect);
                //游戏数据
                this.updateGameNextDt(result);
                break;
            default:
                break;
        }
    },

    updateRocket: function updateRocket(dt) {
        this.updateRocketBg(dt);
        //更新英雄位置
        this.updateHeroPosition(dt, true);
        //更新云层 石头 背景
        var currY = Math.abs(this.gameNode.y);
        if (currY - cc.winSize.height / 2 <= (this.step + 4) * STONE_INTERVAL) {
            var velocity = -10 * STONE_INTERVAL * 2 / 1;
            this.updateGameNodePosition(dt, velocity);
        }

        this.updateRocketStonePosition(dt);
        this.catchHeroPosition();
        this.checkStone();
    },

    onTouchStart: function onTouchStart(event) {

        switch (this.playerStatus) {
            case PLAYER_STATUS.GROUND:
                console.warn('玩家在地面.');
                this.doJump();
                break;
            case PLAYER_STATUS.SKY:
                console.warn('玩家在空中.');
                this.playerStatus = PLAYER_STATUS.DOUBLE;
                break;
            case PLAYER_STATUS.DOUBLE:
                console.warn('玩家连跳.');
                break;
            default:
                break;
        }
    },

    doJump: function doJump() {
        AF.audio.play('jump');
        this.heroScript.playAction(jumpActionName, true);
        this.heroVerticalVelocity = VELOCITY;
        this.playerStatus = PLAYER_STATUS.SKY;
    },

    /********** 按钮回调函数 **********/
    onPlayerButtonClick: function onPlayerButtonClick(event, custom) {
        return;
    },

    onRankButtonClick: function onRankButtonClick(event, custom) {
        // AF.ToastMessage.show('功能开发中');
        AF.gotoScene("HallRankScene");

        // function finish(res) {
        //     if (res) {
        //         AF.ToastMessage.show("观看完毕");
        //     } else {
        //         AF.ToastMessage.show("观看中止");
        //     }
        // }

        // AF.util.showVideoAd("power", finish);
    },

    onReviveButtonClick: function onReviveButtonClick(event, custom) {
        for (var i = 0; i < this.stoneList.length; i++) {
            var stoneObj = this.stoneList[i];
            stoneObj.script.node.setPosition(-1000, 0);
        }

        AF.audio.resumeBGM();
        this.stoneList = [];
        var lastStone = null;
        if (this.groundStone) {
            lastStone = {
                script: this.groundStone,
                type: 'stone',
                velocity: 0,
                acceleration: 0,
                delayTime: 2
            };
        }
        var newList = this.getNexStoneList(lastStone, STONE_RANGE[0], STONE_RANGE[1]);
        this.stoneList = this.stoneList.concat(newList);
        var newList = this.getNexStoneList(this.stoneList[this.stoneList.length - 1], STONE_RANGE[0], STONE_RANGE[1]);
        this.stoneList = this.stoneList.concat(newList);

        this.heroVerticalVelocity = 0;
        this.heroHorizontalVelocity = 0;
        this.heroRotationVelocity = 0;
        this.heroScript.playAction('wait');

        this.playerNode.zIndex = 9;
        this.playerNode.rotation = 0;
        this.playerNode.setPosition(cc.winSize.width / 2, GROUND_HEIGHT + (this.step + 1) * STONE_INTERVAL);
        this.reviveEnable = false;
        this.gameStatus = GAME_STATUS.CONTINUE;
        this.playerStatus = PLAYER_STATUS.SKY;

        this.reviveButton.active = false;
    },

    onGameStart: function onGameStart(result) {
        if (!result) {
            return;
        }
        var self = this;
        var actions = [];
        var time1 = 0.2;
        var time2 = 0.8;
        self.playerNode.y = GROUND_HEIGHT + STONE_INTERVAL * 1.5;
        self.playerNode.active = false;
        self.hideStartButton();
        // actions.push(
        //     cc.callFunc(function () {
        //         let logoNode = self.uiNode.getChildByName('logoNode');
        //         logoNode.runAction(cc.moveBy(time1, 0, -150));
        //     })
        // );
        // actions.push(cc.delayTime(time1+0.05));
        actions.push(cc.callFunc(function () {
            var origin = cc.v2(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2);
            self.gameNode.runAction(cc.moveTo(time2, origin)).easing(cc.easeSineIn(3));
            self.cloudNode.runAction(cc.moveTo(time2, origin)).easing(cc.easeSineIn(3));
            self.bgNode.runAction(cc.moveTo(time2, origin)).easing(cc.easeSineIn(3));
            var speed = Math.abs(self.cloudNode.y + cc.winSize.height / 2) / time2;
            var logoNode = self.uiNode.getChildByName('logoNode');
            logoNode.runAction(cc.moveBy(1000 / speed, 0, 1000));
        }));
        actions.push(cc.delayTime(time2));
        actions.push(cc.callFunc(function () {
            AF.audio.playDefaultBGM();
            AF.audio.play('ready');
            var startNode = self.uiNode.getChildByName('startNode');
            var childNode = startNode.getChildByName('ready');
            childNode.runAction(cc.sequence(cc.scaleTo(0.15, 1.2), cc.scaleTo(0.15, 1), cc.delayTime(0.2), cc.scaleTo(0.1, 0)));
        }));
        actions.push(cc.delayTime(0.2));
        actions.push(cc.callFunc(function () {
            self.playerNode.active = true;
            var scale = self.playerNode.scale;
            self.playerNode.scale = 0;
            self.playerNode.runAction(cc.sequence(
            // cc.blink(0.3, 2)
            cc.scaleTo(0.3, 1 * scale, 0.8 * scale), cc.scaleTo(0.3, 0.8 * scale, 1 * scale), cc.scaleTo(0.1, scale)));
            self.gameModle = 'NORMAL';
            self.gameStart = true;
            self.gameStatus = GAME_STATUS.CONTINUE;
            self.playerStatus = PLAYER_STATUS.SKY;
        }));
        actions.push(cc.delayTime(0.3));

        var _loop = function _loop(i) {
            actions.push(cc.callFunc(function () {
                AF.audio.play('ready');
                var nodeName = 'cutdown' + i % 2;
                var startNode = self.uiNode.getChildByName('startNode');
                var childNode = startNode.getChildByName(nodeName);
                childNode.getComponent(cc.Label).string = i;
                childNode.runAction(cc.sequence(cc.scaleTo(0.15, 1.2), cc.scaleTo(0.15, 1), cc.delayTime(0.2), cc.scaleTo(0.1, 0)));
            }));
            actions.push(cc.delayTime(0.5));
        };

        for (var i = 2; i > 0; i--) {
            _loop(i);
        }
        actions.push(cc.callFunc(function () {
            AF.audio.play('ready');
            var startNode = self.uiNode.getChildByName('startNode');
            var childNode = startNode.getChildByName('go');
            childNode.runAction(cc.sequence(cc.scaleTo(0.15, 1.2), cc.scaleTo(0.15, 1), cc.delayTime(0.2), cc.scaleTo(0.1, 0)));
        }));
        actions.push(cc.delayTime(0.5));
        actions.push(cc.callFunc(function () {
            self.doStartGame(result);
        }));
        this.node.runAction(cc.sequence(actions));
    },

    doStartGame: function doStartGame(result) {
        if (!result) {
            return;
        }
        if ('ROCKET' === result) {
            this.doRocketRush();
        } else if ('NORMAL' === result) {

            this.gameModle = 'NORMAL';

            var newList = this.getNexStoneList(null, STONE_RANGE[0], STONE_RANGE[1]);
            this.stoneList = this.stoneList.concat(newList);
            var newList = this.getNexStoneList(this.stoneList[this.stoneList.length - 1], STONE_RANGE[0], STONE_RANGE[1]);
            this.stoneList = this.stoneList.concat(newList);
        }

        this.gameStart = true;
        var gameCountNode = this.uiNode.getChildByName('gameCount');
        gameCountNode.active = true;

        this.gameStatus = GAME_STATUS.CONTINUE;
        this.playerStatus = PLAYER_STATUS.SKY;
        this.reviveEnable = true;
    },

    onStartButtonClick: function onStartButtonClick(event, custom) {
        // AF.ToastMessage.show('功能开发中');
        if (!this.heroScript.isLoaded()) {
            AF.ToastMessage.show('人物加载中');
            return;
        }
        var self = this;
        var openRocketDialog = function openRocketDialog(score) {
            return new Promise(function (resolve, reject) {
                AF.openDialog('HallRocketDialog', {
                    score: score,
                    callBack: resolve
                });
            });
        };
        var score = Math.floor(self.playerData.preScore / 1000);
        if (score > 0 && AF.util.isVideoAdLoaded()) {
            openRocketDialog(score * 1000).then(function (result) {
                self.onGameStart(result);
            });
        } else {
            self.onGameStart('NORMAL');
        }
    },

    getNexStoneList: function getNexStoneList(lastStone, minLength, maxLength) {
        minLength = minLength || 3;
        maxLength = maxLength || 5;

        var direction = 0;
        if (lastStone) {
            if (lastStone.velocity < 0) {
                direction = 1;
            } else if (lastStone.velocity > 0) {
                direction = -1;
            }
        }
        if (!direction) {
            if (Math.ceil(Math.random() * 1000) % 2) {
                direction = 1;
            } else {
                direction = -1;
            }
        }

        var startX = cc.winSize.width * 3 / 2;
        var startY = GROUND_HEIGHT;
        var baseDelayTime = 0;
        var baseAcceleration = 0;

        if (lastStone) {
            startY = lastStone.script.node.y + STONE_INTERVAL;
            if (lastStone.delayTime > 0) {
                baseDelayTime = lastStone.delayTime;
                baseAcceleration = lastStone.acceleration;
            }
        }
        var width = 0;
        var minSpeed = 160;
        var maxSpeed = 260;
        var baseDt = 0.8;

        if (startY < 20 * STONE_INTERVAL) {
            width = stone_velocity_config.low.width;
            baseDt = stone_velocity_config.low.baseDt;
            minSpeed = stone_velocity_config.low.minSpeed;
            maxSpeed = stone_velocity_config.low.maxSpeed;
        } else if (startY < 50 * STONE_INTERVAL) {
            width = stone_velocity_config.middle.width;
            baseDt = stone_velocity_config.middle.baseDt;
            minSpeed = stone_velocity_config.middle.minSpeed;
            maxSpeed = stone_velocity_config.middle.maxSpeed;
        } else {
            //else if (startY < 125 * STONE_INTERVAL)
            width = stone_velocity_config.height.width;
            baseDt = stone_velocity_config.height.baseDt;
            minSpeed = stone_velocity_config.height.minSpeed;
            maxSpeed = stone_velocity_config.height.maxSpeed;
        }
        startX = cc.winSize.width + width / 2;
        if (direction > 0) {
            startX = 0 - width / 2;
        }
        var preVelocity = direction * (minSpeed + Math.random() * (maxSpeed - minSpeed));
        var preAcceleration = baseAcceleration;

        var stoneList = [];
        var num = minLength + Math.ceil(Math.random() * (maxLength - minLength));
        for (var i = 0; i < num; i++) {

            var stoneScript = this.getStone();
            stoneScript.init();
            stoneScript.setStoneType('stone');
            stoneScript.setStoneRect(width, STONE_INTERVAL);
            stoneScript.setNewColor(width);

            stoneScript.node.setPosition(startX, startY + i * STONE_INTERVAL);
            stoneScript.node.zIndex = 5;

            var acceleration = 0;

            var velocity = direction * minSpeed;
            if (i > 0) {
                velocity = preVelocity + direction * SPEED_DIFF + direction * 0.8 * Math.random() * Math.abs(maxSpeed - Math.abs(preVelocity));
                if (Math.abs(velocity) > maxSpeed) {
                    velocity = direction * maxSpeed;
                }
                // while (Math.abs(velocity) > maxSpeed) {
                //     velocity = preVelocity + direction * 0.8 * Math.random() * Math.abs(maxSpeed - Math.abs(preVelocity));
                // }
            }
            var delayTime = baseDelayTime + (i + 1) * CREATE_DEALY_TIME;
            if (!lastStone && !i) {
                delayTime = 1;
            }

            var stoneObj = {
                script: stoneScript,
                type: 'stone',
                velocity: velocity,
                acceleration: acceleration,
                delayTime: delayTime
            };
            stoneList.push(stoneObj);

            preVelocity = velocity;
            preAcceleration = acceleration;
        }
        return stoneList;
    },

    getStone: function getStone() {
        var stoneScript = null;
        for (var i = 0; i < this.stonePool.length; i++) {
            var stoneObj = this.stonePool[i];
            if (!stoneObj.status) {
                stoneObj.status = true;
                stoneScript = stoneObj.script;
                break;
            }
        }
        if (!stoneScript) {
            stoneScript = this.createNewStone();
            this.stonePool.push({ script: stoneScript, status: true });
        }
        return stoneScript;
    },

    hideStartButton: function hideStartButton() {

        // var logo = this.uiNode.getChildByName('logo');
        // logo.active = false;
        // this.uiNode.getChildByName('bg').active = false;

        var playerButton = this.uiNode.getChildByName('playerButton');
        playerButton.active = false;

        var rankButton = this.uiNode.getChildByName('rankButton');
        rankButton.active = false;

        var startButton = this.uiNode.getChildByName('startButton');
        startButton.active = false;
    },

    showBalance: function showBalance() {

        var playerData = this.playerData;
        var score = this.totalScore / BASE_SCORE;
        playerData.playCount += 1;
        playerData.totalScore += score;
        playerData.preScore = score;
        if (score > playerData.bestScore) {
            playerData.bestScore = score;
        }
        AF.GameData.setMyPlayerData(playerData);
        AF.GameData.savePlayerData(playerData);
        // let playerDataStr = JSON.stringify(playerData);
        // AF.util.setStorage("player_data", playerDataStr);

        // this.playerId = AF.GameConfig.getRandomPlayerId();
        this.initGameStart();

        // this.uiNode.getChildByName('bg').active = true;

        var playerButton = this.uiNode.getChildByName('playerButton');
        playerButton.active = true;

        var rankButton = this.uiNode.getChildByName('rankButton');
        rankButton.active = true;

        var startButton = this.uiNode.getChildByName('startButton');
        startButton.active = true;
    },

    showRevive: function showRevive() {

        this.heroVerticalVelocity = 0;
        this.heroHorizontalVelocity = 0;
        this.heroRotationVelocity = 0;
        this.heroScript.playAction('wait');

        this.playerNode.zIndex = 9;
        this.playerNode.rotation = 0;
        this.playerNode.setPosition(cc.winSize.width / 2, GROUND_HEIGHT + (this.step + 2) * STONE_INTERVAL);
        this.reviveEnable = false;
        this.gameStatus = GAME_STATUS.CONTINUE;
        this.playerStatus = PLAYER_STATUS.SKY;
    },

    refreshCountLabel: function refreshCountLabel() {

        var gameCountNode = this.uiNode.getChildByName('gameCount');
        var scoreNum = gameCountNode.getChildByName('scoreNum').getComponentInChildren(cc.Label);
        scoreNum.string = this.totalScore;
    },

    showTips: function showTips(tipType, tipNum, score) {

        // var tips = this.uiNode.getChildByName('tips');
        // var title = tips.getChildByName('title').getComponent(cc.Sprite);
        // var addIcon = tips.getChildByName('addIcon').getComponent(cc.Sprite);
        // var scoreNum = tips.getChildByName('scoreNum').getComponent(cc.Label);

        var gameCountNode = this.uiNode.getChildByName('gameCount');
        var totalScoreNode = gameCountNode.getChildByName('scoreNum');
        var scoreNum = totalScoreNode.getComponentInChildren(cc.Label);

        var index = -1;
        switch (tipType) {
            case 'perfect':
                scoreNum.font = this.perfectFont;
                index = 1;
                this.addGoodFlyEffect(score, tipNum);

                break;
            case 'normal':
                scoreNum.font = this.normalFont;
                index = -1;
                this.totalScore += score;
                // this.addShakerEffect(totalScoreNode, 0.1);
                break;
            case 'danger':
                scoreNum.font = this.normalFont;
                index = 0;
                score = BASE_SCORE;
                this.addShakerEffect(totalScoreNode, 0.1);
                this.totalScore += score;
                break;

            default:
                break;
        }

        /*if (index < 0) {
            title.node.active = false;
            addIcon.node.active = false;
            scoreNum.node.active = false;
        } else {
            title.node.active = true;
            title.spriteFrame = this.titleSpriteFrames[index];
            title.node.runAction(cc.sequence(
                cc.scaleTo(0.05, 1.2).easing(cc.easeBackOut()),
                cc.scaleTo(0.05, 1).easing(cc.easeBackIn()),
            ));
        }
        scoreNum.string = score;
        addIcon.node.active = true;
        scoreNum.node.active = true;*/

        // tipType = 'goodJob';
        if ('perfect' !== tipType) {
            return;
        }

        for (var i = 0; i < this.perfectStoneList.length; i++) {
            var stone = this.perfectStoneList[i];
            stone.showLight();
        }
    },

    showGoodJobMessage: function showGoodJobMessage(index) {

        var tips = this.uiNode.getChildByName('tips');
        /*var title = tips.getChildByName('title').getComponent(cc.Sprite);
        var addIcon = tips.getChildByName('addIcon').getComponent(cc.Sprite);
        var scoreNum = tips.getChildByName('scoreNum').getComponent(cc.Label);
          title.node.active = true;
        addIcon.node.active = false;
        scoreNum.node.active = false;
          title.spriteFrame = this.titleSpriteFrames[index];
          title.node.stopAllActions();
        title.node.setScale(0);
        title.node.runAction(cc.sequence(
            cc.scaleTo(0.3, 1.2).easing(cc.easeBackOut()),
            cc.scaleTo(0.3, 1).easing(cc.easeBackIn()),
            cc.delayTime(0.4),
            cc.scaleTo(0.1, 0).easing(cc.easeBackOut()),
        ));*/

        var audioName = 'tip1';
        var effectNames = ['cool', 'good', 'great', 'prefect', 'wonderful', 'unbelievable'];
        var effectName = 'cool';
        if (index >= 6) {
            // title.spriteFrame = this.titleSpriteFrames[5];
            audioName = 'tip6';
            effectName = effectNames[5];
        } else {
            // title.spriteFrame = this.titleSpriteFrames[index - 1];
            effectName = effectNames[index - 1];
            audioName = 'tip' + index;
        }
        AF.audio.play(audioName);
        this.showTipsEffect(effectName);
    },

    getGoldObj: function getGoldObj() {

        var goldObj = null;
        for (var i = 0; i < this.goldPool.length; i++) {
            goldObj = this.goldPool[i];
            if (!goldObj.workStatus) {
                return goldObj;
            }
        }
        var node = cc.instantiate(this.goldNode);
        node.setPosition(320, -100);
        this.gameNode.addChild(node, 1);
        goldObj = {
            node: node,
            workStatus: false
        };

        this.goldPool.push(goldObj);
        return goldObj;
    },

    showDustEffect: function showDustEffect(flipX, posY) {
        if (!this.dustEffect) {
            var dustEffectNode = cc.instantiate(this.effectPre);
            this.gameNode.addChild(dustEffectNode, 2, 'dustEffectNode');
            this.dustEffect = dustEffectNode.getComponent('EffectPrefab');
        }
        var offsetX = 64;
        if (!flipX) {
            offsetX = -64;
        }
        this.dustEffect.node.setPosition(cc.winSize.width / 2 + offsetX, posY + 64);
        this.dustEffect.doStart("dust", 1, 1, 25);
        this.dustEffect.setFlipX(flipX);
    },

    showLineEffect: function showLineEffect(posY) {
        if (!this.lineEffect) {
            var lineEffect = cc.instantiate(this.effectPre);
            this.gameNode.addChild(lineEffect, 2, 'lineEffect');
            this.lineEffect = lineEffect.getComponent('EffectPrefab');
        }
        this.lineEffect.node.setPosition(cc.winSize.width / 2, posY + 64);
        this.lineEffect.doStart("xian", 1, 1, 25);
    },

    showTipsEffect: function showTipsEffect(effectName) {
        if (!this.tipsEffect) {
            var tipsNode = this.uiNode.getChildByName('tips');
            var tipsEffectNode = cc.instantiate(this.effectPre);
            tipsNode.addChild(tipsEffectNode, 2, 'tipsEffect');
            this.tipsEffect = tipsEffectNode.getComponent('EffectPrefab');
        }
        this.tipsEffect.node.setPosition(0, 0);
        this.tipsEffect.doStart(effectName, 1, 1, 12);
    },

    doRocketRush: function doRocketRush() {
        this.gameModle = 'ROCKET';

        this.intervalSwitchBg = 0;
        this.rocketBg.active = true;
        var center = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.rocketBg.setPosition(cc.v2(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2));
        var bg1 = this.rocketBg.getChildByName('rocketBg1');
        bg1.scaleY = cc.winSize.height / bg1.height;
        bg1.setPosition(center);
        var bg2 = this.rocketBg.getChildByName('rocketBg2');
        bg2.scaleY = cc.winSize.height / bg2.height;
        bg2.setPosition(center);

        for (var i = 0; i < this.stonePool.length; i++) {
            var stoneObj = this.stonePool[i];
            stoneObj.status = false;
            stoneObj.script.node.setPosition(-1000, 0);
            stoneObj.script.node.opacity = 255;
        }
        this.stoneList = [];
        for (var _i5 = 0; _i5 < 10; _i5++) {
            var lastStone = null;
            if (this.stoneList.length) {
                lastStone = this.stoneList[this.stoneList.length - 1];
            }
            var newStone = this.getRocketStone(lastStone);
            this.stoneList.push(newStone);
        }
        this.heroVerticalVelocity = VELOCITY * 1.5;
    },

    updateRocketBg: function updateRocketBg(dt) {
        this.intervalSwitchBg += dt;
        if (this.intervalSwitchBg <= 0.2) {
            return;
        }

        this.intervalSwitchBg = 0;
        this.rocketBg.setPosition(cc.v2(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2));
        var bg1 = this.rocketBg.getChildByName('rocketBg1');
        var bg2 = this.rocketBg.getChildByName('rocketBg2');

        if (bg1.active) {
            bg1.active = false;
            bg2.active = true;
        } else {
            bg1.active = true;
            bg2.active = false;
        }
    },

    getRocketStone: function getRocketStone(lastStone) {
        var startY = GROUND_HEIGHT;
        var direction = -1;

        var preMoveTime = 0;
        var direction = 0;
        if (lastStone) {
            startY = lastStone.script.node.y + STONE_INTERVAL;
            preMoveTime = AF.util.getMoveTime(Math.abs(lastStone.script.node.x - cc.winSize.width / 2), lastStone.velocity, lastStone.acceleration);
            preMoveTime += lastStone.delayTime;
            if (lastStone.velocity < 0) {
                direction = 1;
            } else if (lastStone.velocity > 0) {
                direction = -1;
            }
        }
        if (!direction) {
            if (Math.ceil(Math.random() * 1000) % 2) {
                direction = 1;
            } else {
                direction = -1;
            }
        }
        var moveTime = 0.4 / 2;
        var velocity = 1200 * direction * 2;
        var startX = cc.winSize.width / 2 - moveTime * velocity;

        var stoneScript = this.getStone();
        stoneScript.init();
        stoneScript.setStoneType('stone');
        stoneScript.setNewColor(stone_velocity_config.low.width);
        stoneScript.setStoneRect(stone_velocity_config.low.width, STONE_INTERVAL);
        stoneScript.node.setPosition(startX, startY);
        var acceleration = 0;
        var delayTime = preMoveTime - moveTime + 0.1 / 2;
        if (delayTime < 0) {
            delayTime = 0;
        }

        var stoneObj = {
            script: stoneScript,
            type: 'stone',
            velocity: velocity,
            acceleration: acceleration,
            delayTime: delayTime
        };
        return stoneObj;
    },

    updateRocketStonePosition: function updateRocketStonePosition(dt) {
        dt = dt || 1 / 60;
        var stoneList = this.stoneList;
        for (var i = 0; i < stoneList.length; i++) {
            var stoneObj = stoneList[i];
            if (stoneObj.delayTime > 0) {
                stoneObj.delayTime -= dt;
                continue;
            }
            var node = stoneObj.script.node;
            node.x += stoneObj.velocity * dt;
            stoneObj.velocity += dt * stoneObj.acceleration;
        }
        while (true) {
            var _stoneObj = stoneList[0];
            if (!_stoneObj) {
                break;
            }
            var _node = _stoneObj.script.node;
            if (_stoneObj.velocity < 0 && _node.x < cc.winSize.width / 2 || _stoneObj.velocity > 0 && _node.x > cc.winSize.width / 2) {
                _stoneObj.velocity = 0;
                _stoneObj.acceleration = 0;
                _node.x = cc.winSize.width / 2;
                stoneList.shift();
                this.groundStone = _stoneObj.script;
                this.perfectStoneList.push(this.groundStone);
                this.step += 1;
            } else {
                break;
            }
        }
        if (this.stoneList.length >= 10 || this.step >= 40) {
            return;
        }
        for (var _i6 = 0; _i6 < 10; _i6++) {
            var lastStone = null;
            if (this.stoneList.length) {
                lastStone = this.stoneList[this.stoneList.length - 1];
            }
            var newStone = this.getRocketStone(lastStone);
            this.stoneList.push(newStone);
        }
    },

    catchHeroPosition: function catchHeroPosition() {
        var heroPos = this.playerNode.convertToWorldSpaceAR(cc.v2(0, 0));
        if (heroPos.y <= GROUND_HEIGHT) {
            var gamePos = this.gameNode.convertToNodeSpaceAR(cc.v2(320, GROUND_HEIGHT));
            this.playerNode.setPosition(gamePos);
            // this.heroVerticalVelocity = STONE_INTERVAL / 0.2;
        }
    },

    checkStone: function checkStone() {
        if (this.stoneList.length > 0) {
            return;
        }

        this.gameModle = 'NORMAL';
        this.rocketBg.active = false;

        var newList = this.getNexStoneList({
            script: this.groundStone,
            type: 'stone',
            velocity: 0,
            acceleration: 0,
            delayTime: 0.5
        }, STONE_RANGE[0], STONE_RANGE[1]);
        this.stoneList = this.stoneList.concat(newList);
        var newList = this.getNexStoneList(this.stoneList[this.stoneList.length - 1], STONE_RANGE[0], STONE_RANGE[1]);
        this.stoneList = this.stoneList.concat(newList);

        this.gameStatus = GAME_STATUS.CONTINUE;
        this.playerStatus = PLAYER_STATUS.SKY;
        this.reviveEnable = true;

        this.heroVerticalVelocity = VELOCITY * 0.5;

        var velocity = this.heroVerticalVelocity;
        var acceleration = -1 * GRAVITY;
        var distance = this.groundStone.node.y - this.playerNode.y;
        var dt = Math.max((-velocity + Math.sqrt(velocity * velocity + 2 * acceleration * distance)) / acceleration, (-velocity - Math.sqrt(velocity * velocity + 2 * acceleration * distance)) / acceleration);
        if (dt > 0) {
            var self = this;
            this.node.runAction(cc.sequence(cc.delayTime(dt), cc.callFunc(function () {
                var score = Math.floor(self.playerData.preScore / 1000) * 1000;
                self.groundStone.showScore(score, 'perfect');
                self.totalScore += score;
                self.refreshCountLabel();
            })));
        }
    },

    doMoveXXXX: function doMoveXXXX(node, ghostList, time, tpos, easing) {
        var directionX = 0;
        var directionY = 0;
        if (node.x - tpos.x < 0) {
            directionX = -1;
        } else if (node.x - tpos.x > 0) {
            directionX = 1;
        }
        if (node.y - tpos.y < 0) {
            directionY = -1;
        } else if (node.y - tpos.y > 0) {
            directionY = 1;
        }
        var dt = 3;
        if (time <= 3 / 60 * dt + 3 / 60 * dt * ghostList.length) {
            dt = 1;
        }
        var showGold = cc.callFunc(function () {
            for (var i = 0; i < ghostList.length; i++) {
                var name = ghostList[i];
                var childNode = node.getChildByName(name);
                childNode.setPosition(0, 0);
                var index = i + 1;
                var pos = cc.p(directionX * 15 * index, directionY * 15 * index);
                if (dt <= 1) {
                    childNode.runAction(cc.moveTo(1 / 60 * dt * index, pos));
                } else {
                    childNode.runAction(cc.sequence(cc.delayTime(1 / 60 * dt), cc.moveTo(1 / 60 * dt * index, pos)));
                }
            }
        });
        var moveAction = cc.moveTo(time, tpos);
        if (easing) {
            moveAction = cc.moveTo(time, tpos).easing(easing);
        }
        var hideGold = cc.callFunc(function () {
            for (var i = 0; i < ghostList.length; i++) {
                var name = ghostList[i];
                var childNode = node.getChildByName(name);
                var index = i + 1;
                childNode.runAction(cc.moveTo(1 / 60 * 2 * index, cc.p(0, 0)));
            }
        });

        node.runAction(cc.sequence(showGold, moveAction, hideGold));
    },

    addGoodFlyEffect: function addGoodFlyEffect(score, perfectCount) {
        var self = this;
        var goldObj = this.getGoldObj();
        goldObj.workStatus = true;
        var gold = goldObj.node;
        gold.active = true;
        gold.opacity = 255;
        gold.setPosition(320, self.playerNode.y + 10);
        var gameCountNode = self.uiNode.getChildByName('gameCount');
        var scoreNum = gameCountNode.getChildByName('scoreNum').getComponentInChildren(cc.Label);

        var tPos = cc.winSize.height * 0.93 - 80;

        var scheduler = {};

        scheduler.target = gold;
        scheduler.speed = 1000;
        scheduler.interval = 0;

        scheduler.init_x = gold.getPositionX();
        scheduler.init_y = gold.getPositionY();
        scheduler.goldObj = goldObj;

        scheduler.step = 0;
        scheduler.totalTime = 0;
        scheduler.time = 0;

        var actionName = 'flyGod';
        scheduler.target[actionName] = function (dt) {
            if ('delay' === scheduler.currModle) {
                scheduler.time += dt;
                if (scheduler.time >= scheduler.totalTime) {
                    scheduler.totalTime = 0;
                    scheduler.time = 0;
                    scheduler.step += 1;
                    scheduler.currModle = '';
                }
                return;
            }
            switch (scheduler.step) {
                case 0:
                    var moveTime1 = 300 / scheduler.speed;
                    self.doMoveXXXX(scheduler.target, [], moveTime1, cc.p(320, scheduler.target.y + 300));
                    scheduler.totalTime = moveTime1;
                    scheduler.time = 0;
                    scheduler.step += 1;
                    scheduler.currModle = 'delay';
                    break;
                case 2:
                    var worldPos = scheduler.target.convertToWorldSpaceAR(cc.p(0, 0));
                    scheduler.target.parent = self.uiNode;
                    scheduler.target.zIndex = -1;
                    var localPos = self.uiNode.convertToNodeSpace(worldPos);
                    scheduler.target.setPosition(localPos);

                    scheduler.totalTime = 0;
                    scheduler.time = 0;
                    scheduler.step += 1;
                    break;
                case 3:
                    var time = (tPos - scheduler.target.y) / scheduler.speed;
                    self.doMoveXXXX(scheduler.target, ['gold2', 'gold3', 'gold4'], time, cc.p(320, tPos));
                    scheduler.totalTime = time + 3 * 3 / 60;
                    scheduler.time = 0;
                    scheduler.step += 1;
                    scheduler.currModle = 'delay';
                    break;
                case 5:
                    scheduler.target.runAction(cc.fadeOut(0.1));
                    scheduler.totalTime = 0.1;
                    scheduler.time = 0;
                    scheduler.step += 1;
                    scheduler.currModle = 'delay';
                    break;
                case 7:
                    scheduler.target.parent = self.gameNode;
                    scheduler.target.zIndex = -1;
                    scheduler.target.setPosition(scheduler.init_x, scheduler.init_y);
                    scheduler.target.opacity = 255;
                    scheduler.target.active = false;
                    scheduler.goldObj.workStatus = false;

                    var cb = null;
                    if (!(perfectCount % 5)) {
                        // scoreNum.font = self.perfectFont;
                        // cb = function () {
                        //     scoreNum.font = self.normalFont;
                        // };
                        self.showGoodJobMessage(Math.floor(perfectCount / 5));
                    }
                    self.addShakerEffect(scoreNum.node, 0.1, cb);
                    self.totalScore += score;
                    scoreNum.string = self.totalScore;

                    // scheduler.target.stopAction(scheduler.target[actionName]);
                    self.unschedule(scheduler.target[actionName]);
                    scheduler.target[actionName] = null;

                    scheduler.totalTime = 0;
                    scheduler.time = 0;
                    scheduler.step += 1;
                    break;
                default:
                    break;
            }
        };
        this.schedule(scheduler.target[actionName], scheduler.interval);
    },

    addCloudMoveEffect: function addCloudMoveEffect(node) {
        if (node === null) {
            return;
        }
        var actionName = 'CloudMoveEffect';
        if (node[actionName]) {
            this.unschedule(node[actionName]);
            // console.warn();
            node[actionName] = null;
        }
        var moveActionInfo = {};
        moveActionInfo.speed_min = 10;
        moveActionInfo.speed_max = 30;
        moveActionInfo.currSpeed = moveActionInfo.speed_min + Math.random() * (moveActionInfo.speed_max - moveActionInfo.speed_min);
        // moveActionInfo.init_x = 0
        moveActionInfo.init_y = 0;

        moveActionInfo.target = node;
        // moveActionInfo.init_x = node.getPositionX()
        moveActionInfo.init_y = node.getPositionY();

        moveActionInfo.target[actionName] = function (dt) {
            moveActionInfo.target.x += moveActionInfo.currSpeed * dt;
            var currWorldPos = moveActionInfo.target.convertToWorldSpaceAR(cc.p(0, 0));
            if (currWorldPos.x - moveActionInfo.target.width / 2 * moveActionInfo.target.scale >= cc.winSize.width) {
                var x = 0 - 100 * Math.random() - node.width / 2;
                var y = moveActionInfo.init_y;
                moveActionInfo.target.setPosition(x, y);
                moveActionInfo.currSpeed = moveActionInfo.speed_min + Math.random() * (moveActionInfo.speed_max - moveActionInfo.speed_min);
            }
        };
        this.schedule(moveActionInfo.target[actionName], 0);
    },

    addShakerEffect: function addShakerEffect(node, time, endCallBack) {
        if (time === null && node === null) {
            return;
        }
        var self = this;
        var actionName = 'ShakerActionName';

        var shaker = {};
        shaker.init_x = 0; //[[初始位置x]]
        shaker.init_y = 0; //[[初始位置y]]
        shaker.diff_x = 0; //[[偏移量x]]
        shaker.diff_y = 0; //[[偏移量y]]
        shaker.diff_max = 10; //[[最大偏移量]]
        shaker.interval = 0.01; //[[震动频率]]
        shaker.totalTime = 0; //[[震动时间]]
        shaker.time = 0; //[[计时器]]

        shaker.target = node;
        shaker.init_x = node.getPositionX();
        shaker.init_y = node.getPositionY();
        shaker.totalTime = time;

        shaker.target[actionName] = function (dt) {
            if (shaker.time >= shaker.totalTime) {
                // shaker.target.stopAction(shaker.target[actionName]);
                self.unschedule(shaker.target[actionName]);
                shaker.target[actionName] = null;
                shaker.target.setPosition(shaker.init_x, shaker.init_y);
                endCallBack && endCallBack();
                endCallBack = null;
                return;
            }
            shaker.time = shaker.time + shaker.interval;
            shaker.diff_x = Math.random() * (shaker.diff_max + shaker.diff_max + 1) - shaker.diff_max;
            shaker.diff_y = Math.random() * (shaker.diff_max + shaker.diff_max + 1) - shaker.diff_max;
            shaker.target.setPosition(shaker.init_x + shaker.diff_x, shaker.init_y + shaker.diff_y);
        };
        // this.schedule(, shaker.interval);
        this.schedule(shaker.target[actionName], shaker.interval);
    },

    showSharerInfo: function showSharerInfo() {
        return;
        var shareInfo = AF.util.getShareInfo();
        if (shareInfo && shareInfo['challenge']) {
            var self = this;
            var challenge = JSON.parse(shareInfo['challenge']);
            var sharerOpenId = challenge['sharerOpenId'];
            var sharerNickName = challenge['sharerNickName'];
            AF.util.getAvatarUrl(sharerOpenId, function (openId, avatarUrl) {
                if (openId === sharerOpenId) {
                    self.photoScript.setBigPhoto(avatarUrl);
                }
            });
            var score = challenge['score'];
            this.sharerOpenId.string = 'ID:' + sharerOpenId;
            this.sharerNickName.string = '昵称:' + sharerNickName;
            this.score.string = '分数:' + score;
        }
    },

    onGameBGM: function onGameBGM(dt) {
        AF.EventDispatcher.emit(AF.Event.GAME_ON_BGM);
    }
});

/*getNexStoneList: function (lastStone, minLength, maxLength) {
    minLength = minLength || 3;
    maxLength = maxLength || 5;
      var direction = 0;
    if (lastStone) {
        if (lastStone.velocity < 0) {
            direction = 1;
        } else if (lastStone.velocity > 0) {
            direction = -1;
        }
    }
    if (!direction) {
        if (Math.ceil(Math.random() * 1000) % 2) {
            direction = 1;
        } else {
            direction = -1;
        }
    }
        var startX = cc.winSize.width * 3 / 2;
    var startY = GROUND_HEIGHT;
    var baseMoveTime = 0;
    var baseVelocity = 100;
    var baseAcceleration = 0;
      if (lastStone) {
        startY = lastStone.script.node.y + STONE_INTERVAL;
        baseMoveTime = AF.util.getMoveTime(Math.abs(lastStone.script.node.x - cc.winSize.width / 2), lastStone.velocity, lastStone.acceleration);
        if (lastStone.delayTime > 0) {
            baseMoveTime += lastStone.delayTime;
        }
        baseVelocity = lastStone.velocity;
        baseAcceleration = lastStone.acceleration;
    }
    if (direction > 0) {
        startX = -1 * cc.winSize.width / 2
    }
    var width = 0;
    var minSpeed = 160;
    var maxSpeed = 260;
    var baseDt = 0.8;
      if (startY < 20 * STONE_INTERVAL) {
        width = stone_velocity_config.low.width;
        baseDt = stone_velocity_config.low.baseDt;
        minSpeed = stone_velocity_config.low.minSpeed;
        maxSpeed = stone_velocity_config.low.maxSpeed;
    } else if (startY < 50 * STONE_INTERVAL) {
        width = stone_velocity_config.middle.width;
        baseDt = stone_velocity_config.middle.baseDt;
        minSpeed = stone_velocity_config.middle.minSpeed;
        maxSpeed = stone_velocity_config.middle.maxSpeed;
    } else {
        //else if (startY < 125 * STONE_INTERVAL)
        width = stone_velocity_config.height.width;
        baseDt = stone_velocity_config.height.baseDt;
        minSpeed = stone_velocity_config.height.minSpeed;
        maxSpeed = stone_velocity_config.height.maxSpeed;
    }
      //规则 晚创建的一定要比先创建的晚到中心点
    var preMoveTime = baseMoveTime + 0.2;
    var preVelocity = direction * (minSpeed + Math.random() * (maxSpeed - minSpeed));
    var preAcceleration = baseAcceleration;
      var stoneList = [];
    var num = minLength + Math.ceil(Math.random() * (maxLength - minLength));
    for (let i = 0; i < num; i++) {
        let stoneScript = this.getStone();
        stoneScript.init();
        stoneScript.setStoneType('stone');
        stoneScript.setStoneRect(width, STONE_INTERVAL);
        stoneScript.setNewColor(width);
          stoneScript.node.setPosition(startX, startY + i * STONE_INTERVAL);
        stoneScript.node.zIndex = 5;
          let acceleration = 0;
          // let velocity = preVelocity + 0.8 * Math.random() * preVelocity;
        // while (Math.abs(velocity) > MAX_STONE_SPEED) {
        //     velocity = preVelocity + 0.8 * Math.random() * preVelocity;
        // }
          let velocity = direction * minSpeed;
        if (i > 0) {
            velocity = preVelocity + direction * 0.8 * Math.random() * Math.abs(maxSpeed - Math.abs(preVelocity));
            while (Math.abs(velocity) > maxSpeed) {
                velocity = preVelocity + direction * 0.8 * Math.random() * Math.abs(maxSpeed - Math.abs(preVelocity));
            }
        }
        // console.log(velocity);
        // 0.2
        let moveTime = AF.util.getMoveTime(Math.abs(startX - cc.winSize.width / 2), velocity, acceleration);
        let delayTime = preMoveTime - moveTime + baseDt;
          if (delayTime < 0) {
            delayTime = 0;
        }
          if (!lastStone && !i) {
            delayTime = 1;
        }
          let stoneObj = {
            script: stoneScript,
            type: 'stone',
            velocity: velocity,
            acceleration: acceleration,
            delayTime: delayTime,
        };
        stoneList.push(stoneObj);
          preMoveTime = moveTime + delayTime;
        preVelocity = velocity;
        preAcceleration = acceleration;
    }
      //匀速模式
      //   加速度模式
    // + 加速度模式
    // - 加速度模式
    return stoneList;
},*/

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
        //# sourceMappingURL=HallJumpScene.js.map
        