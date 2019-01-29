"use strict";
cc._RF.push(module, '0e293CIAjxBxbosGuVdy4tG', 'HallMainScene');
// hall/ui/scene/HallMainScene.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {

        userInfoPre: {
            default: null,
            type: cc.Prefab
        },

        effectPre: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function onLoad() {

        this.winSize = cc.winSize;

        AF.util.checkShareGift();

        //监听事件

        AF.EventDispatcher.on(AF.Event.HIDE_BANNER_AD, this.onHideBannerAd, this);

        // var uiNode = new cc.Node('UILayer');
        // uiNode.setPosition(0 - cc.winSize.width / 2, 0 - cc.winSize.height / 2);
        // this.node.addChild(uiNode, 100, "UILayer");
        // var userInfoPanel = cc.instantiate(this.userInfoPre);
        // uiNode.addChild(userInfoPanel, 1, "userInfoPanel");

        // this.schedule(this.checkLoading, 0.5, this);

        // var loadingLayer = this.node.getChildByName('LoadingLayer');
        // this.node.removeChild(loadingLayer);
        // cc.director.getScene().addChild(loadingLayer);
        // loadingLayer.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        // loadingLayer.active = false;
        AF.audio.playDefaultBGM();
        // 背景音乐
        this.schedule(this.onGameBGM, 0.1, this);
    },

    onDestroy: function onDestroy() {

        AF.EventDispatcher.off(AF.Event.HIDE_BANNER_AD, this.onHideBannerAd, this);

        // AF.wxHelper.hideBannerAd("main");
    },

    onEnable: function onEnable() {

        // AF.platform.wxSetLoginTime();

        // AF.wxHelper.createBannerAd("main");
        AF.EventDispatcher.emit(AF.Event.SCENE_LOADED);
    },

    update: function update(dt) {},

    onGameBGM: function onGameBGM(dt) {
        AF.EventDispatcher.emit(AF.Event.GAME_ON_BGM);
    },

    onHideBannerAd: function onHideBannerAd() {
        this.showOrHideBannerAD();
    },
    rankClick: function rankClick() {
        AF.gotoScene('HallRankScene2');
    },


    showOrHideBannerAD: function showOrHideBannerAD() {
        var adHeight = AF.util.getMainBannerAdHeight();
    },

    checkLoading: function checkLoading() {},

    onBtnNounClick: function onBtnNounClick() {
        // AF.gotoScene("HallJumpScene", {});
        AF.ToastMessage.show("功能开发中");
    },

    onBtnStartClick: function onBtnStartClick() {
        AF.gotoScene('HallPointScene');
    }
});

cc._RF.pop();