/**
 * 场景管理器
 */

var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");
var Const = require("af-const");
var Config = require("af-config-mgr");

// var DEFAULT_SWITCH_SCENE_ANIM = "framework/prefabs/DefaultSwitchSceneAnimStyle";
var DEFAULT_SWITCH_SCENE_ANIM = "framework/prefabs/loading";

var SceneManager = (window.AF = window.AF || {}).SceneMgr = cc.Class({
    extends: cc.Component,

    properties: {},

    statics: {
        // 实例
        instance: null,
    },

    // use this for initialization
    onLoad: function () {
        if (SceneManager.instance) {
            return;
        }
        SceneManager.instance = this;
        this._active = true;
        // 设置常驻节点
        cc.game.addPersistRootNode(this.node);
        this.node.zIndex = Const.TOP_Z_ORDER;

        this._enableSwitchSceneAnim = false;    // 启用切换场景动画
        this._switchingSceneFlags = {
            sceneLoaded: false,                 // 标记目标场景是否加载完成
            inAnimationDone: false,             // 切换场景动画进入部分是否完成
            targetSceneName: null,              // 跳转的目标场景名
            switching: false,                   // 正在切换
        }

        this._curSceneName = '';       // 当前场景名
        this._sceneParams = null;     // 切换场景时传递的参数
        this._dialogStack = [];       // 对话框堆栈
        this._dialogCache = {};       // 对话框缓存
        this._preloadingDialog = {};       // 预加载中的对话框
        this._tryToOpenDialog = undefined; // 尝试打开的对话框

        this._sceneDialog = {};       // 已经挂在当前场景节点上的dialog
        this._dialogParams = null;     // 打开对话框传递的参数

        // 发布游戏加载完成消息
        EventDispatcher.emit(Event.GAME_LOADED);
        //注册场景加载完成消息回调
        EventDispatcher.on(Event.SCENE_LOADED, this.sceneLoadedMsg, this);

        this.addSwitchSceneAinm('default', DEFAULT_SWITCH_SCENE_ANIM);
        this._enableSwitchSceneAnim = true;
    },

    setEnableSwitchSceneAnim: function (state) {
        this._enableSwitchSceneAnim = state;
    },

    onEnable: function () {
        this.node.zIndex = Const.TOP_Z_ORDER;
    },
    onDestroy: function () {
        if (!this._active) return;
        // 移除常驻节点
        EventDispatcher.off(Event.SCENE_LOADED, this.sceneLoadedMsg, this);
        cc.game.removePersistRootNode(this.node);
        SceneManager.instance = null;
    },

    getCurSceneParams: function () {
        return this._sceneParams;
    },

    getCurDialogParams: function () {
        return this._dialogParams;
    },

    getCurSceneName: function () {
        return this._curSceneName;
    },
    // 是否正在切换场景
    isSwitchingScene: function () {
        return this._switchingSceneFlags.switching;
    },

    switchScene: function (sceneName, params, onLoad) {
        var flags = this._switchingSceneFlags;
        if (flags.switching) {
            cc.warn('alreay switching to scene [' + flags.targetSceneName + ']');
            if (flags.targetSceneName === sceneName) return;
        }
        var curScene = cc.director.getScene();
        if (this._curSceneName === sceneName) return;
        this._sceneParams = params; // 传递到下一个场景的参数
        this._switchSceneCB = onLoad;

        EventDispatcher.emit(Event.BEFORE_SCENE_LAUNCH, sceneName);
        flags.targetSceneName = sceneName;
        flags.switching = true;
        if (this._enableSwitchSceneAnim)
            this._switchSceneAnimIn();
        var self = this;
        cc.director.preloadScene(sceneName, function () {
            if (!flags.targetSceneName || flags.targetSceneName != sceneName) {
                return;
            }
            flags.sceneLoaded = true;
            if (!self._enableSwitchSceneAnim || flags.inAnimationDone)
                self._loadScene();
        });
    },

    _loadScene: function () {
        var flags = this._switchingSceneFlags;
        cc.director.loadScene(flags.targetSceneName, function () {
            this._curSceneName = flags.targetSceneName;

            EventDispatcher.emit(Event.AFTER_SCENE_LAUNCH, flags.targetSceneName);
            if (this._switchSceneCB) {
                this._switchSceneCB();
                this._switchSceneCB = undefined;
            }
            this._clearDialogCacheAndStack();
        }.bind(this));
    },
    sceneLoadedMsg: function () {
        // console.log('监听到场景加载完成 = ', this._enableSwitchSceneAnim)
        var flags = this._switchingSceneFlags;
        flags.targetSceneName = null;
        flags.sceneLoaded = false;
        flags.inAnimationDone = false;
        flags.switching = false;
        if (this._enableSwitchSceneAnim)
            this._switchSceneAnimOut();
    },
    // 添加切换场景动画
    addSwitchSceneAinm: function (name, prefabPath) {
        var self = this;
        cc.loader.loadRes(prefabPath, function (err, prefab) {
            if (err) {
                cc.error("can not load switch scene animation -> [" + prefabPath + "], error:", err);
                return;
            }
            var node = cc.instantiate(prefab);
            node.name = name;
            var animNode = self.node.getChildByName("SwitchSceneAnimation");
            if (!animNode) {
                animNode = new cc.Node("SwitchSceneAnimation");
                animNode.zIndex = Const.ANIM_Z_ORDER;
                self.node.addChild(animNode);
            }
            var tn = animNode.getChildByName(name);
            if (tn) {
                tn.removeFromParent(true);
            }
            animNode.addChild(node);
            node.active = false;
        });
    },

    // 场景切换动画B
    _switchSceneAnimOut: function () {
        // console.log('结束动画')
        var anim = this._getSwitchAnimComponent();
        anim && anim.playOutAnim();
    },
    // 切换动画A
    _switchSceneAnimIn: function () {
        // console.log('开始动画')
        var flags = this._switchingSceneFlags;
        var anim = this._getSwitchAnimComponent();
        if (anim) { // 播放切换动画
            anim.node.active = true;
            anim.playInAnim(function () {
                flags.inAnimationDone = true;
                flags.sceneLoaded && this._loadScene();
            }.bind(this));
        } else {
            flags.inAnimationDone = true;
            flags.sceneLoaded && this._loadScene();
        }
    },
    _getSwitchAnimComponent: function (name) {
        var animNode = this.node.getChildByName("SwitchSceneAnimation");
        if (!animNode) return null;
        animNode = animNode.getChildByName(name ? name : 'default');
        if (!animNode) return null;
        // var comp = animNode.getComponent("AFSwitchSceneAnim");
        var comp = animNode.getComponent("AFLoadingAnim");
        return comp;
    },

    // 注册已经挂在场景上的dialog
    // 说明：可以将一些跟当前场景高度相关的对话框
    // 直接挂在场景上，这样可以避免重复实例化
    registerDialog: function (dialogName, node) {
        this._sceneDialog[dialogName] = node;
    },
    // 注意：dialog节点被销毁时必须unregister
    unregisterDialog: function (dialogName) {
        delete this._sceneDialog[dialogName];
        var i = 0;
        while (i < this._dialogStack.length) {
            var v = this._dialogStack[i];
            if (v.name === dialogName) {
                this._dialogStack.splice(i, 1);
            } else {
                i++;
            }
        }
    },

    // 切场景后，会把Dialog Cache 和 Stack 清掉
    _clearDialogCacheAndStack: function () {
        this._dialogCache = {};
        this._dialogStack = [];
        this._tryToOpenDialog = undefined;
    },

    _loadDialog: function (dialogName, onLoad, active) {
        if (!this._dialogPaths) {
            var d = Config.getDialogList();
            this._dialogPaths = d.dialogs;
            if (!this._dialogPaths) {
                onLoad && onLoad(true);
                return;
            };
        }

        var dialogPath = this._dialogPaths[dialogName];
        if (!dialogPath) {
            cc.error("can not load dialog -> [" + dialogName + "], not found in dialog list.");
            onLoad && onLoad(true);
            return;
        }
        cc.loader.loadRes(dialogPath, function (err, prefab) {
            if (err) {
                cc.error("can not load dialog -> [" + dialogName + "], error:", err);
                onLoad && onLoad(true);
                return;
            }
            var node = cc.instantiate(prefab);
            if (active !== undefined) {
                node.active = active;
            }
            node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            cc.director.getScene().addChild(node);
            node.zIndex = Const.DIALOG_Z_ORDER;
            node.name = dialogName;
            onLoad && onLoad(null, node);
        });
    },

    preloadDialog: function (dialogName, onLoad) {
        if (this._dialogCache[dialogName]) return;
        this._preloadingDialog[dialogName] = true;
        this._loadDialog(dialogName, function (err, dialogNode) {
            delete this._preloadingDialog[dialogName];
            // 准备打开的对话框
            if (this._tryToOpenDialog && this._tryToOpenDialog.name == dialogName) {
                !err && this._pushDialogToStack(dialogName, dialogNode);
                if (this._tryToOpenDialog.onOpened) {
                    this._tryToOpenDialog.onOpened(err, dialogNode);
                }
                this._tryToOpenDialog = undefined;
            } else {
                if (!err) {
                    dialogNode.active = false;
                    this._dialogCache[dialogName] = { name: dialogName, node: dialogNode };
                }
            }
            onLoad && onLoad(err);
        }.bind(this), false);
    },

    openDialog: function (dialogName, params, onOpened) {
        if (!dialogName || dialogName == "") {
            cc.error("can not open dialog -> [" + dialogName + "]");
            onOpened && onOpened(true);
            return;
        }
        this._dialogParams = params;
        // 是否是场景对话框
        if (this._sceneDialog[dialogName]) {
            if (this._hasDialogInStack(dialogName)) {
                cc.error("scene dialog can not open twice, use prefab dialog or close the dialogs above the scence dialog");
                onOpened && onOpened(true);
                return;
            }
            var node = this._sceneDialog[dialogName];
            node.zIndex = Const.DIALOG_Z_ORDER;
            node.active = true;
            this._pushDialogToStack(dialogName, node);
            if (onOpened) onOpened(false, node);
            return;
        }

        // 是否在缓存中
        if (this._dialogCache[dialogName]) {
            var dialog = this._dialogCache[dialogName];
            delete this._dialogCache[dialogName];
            dialog.node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            dialog.node.zIndex = Const.DIALOG_Z_ORDER;
            dialog.node.active = true;
            this._pushDialogToStack(dialogName, dialog.node);
            onOpened && onOpened(false, dialog.node);
            return;
        }

        // 是否已经在加载了
        if (this._preloadingDialog[dialogName]) {
            this._tryToOpenDialog = { name: dialogName, onOpened: onOpened };
            return;
        }

        this._loadDialog(dialogName, function (err, dialogNode) {
            this._pushDialogToStack(dialogName, dialogNode);
            onOpened && onOpened(err, dialogNode);
        }.bind(this));
    },

    onDialogClosed: function (dialogName, node) {
        var len = this._dialogStack.length;
        var i = len - 1;
        for (i = len - 1; i >= 0; i--) {
            var v = this._dialogStack[i];
            if (v.name === dialogName && v.node === node) {
                this._dialogStack.splice(i, 1);
                if (!this._sceneDialog[dialogName]) {
                    // v.node.destroy();
                    v.node.zIndex = Const.DIALOG_Z_ORDER - 1;
                    v.node.active = false;
                    if (this._dialogCache[dialogName]) {
                        v.node.destroy();
                    } else {
                        this._dialogCache[dialogName] = v;
                    }
                }
                else {
                    v.node.active = false;
                }
                break;
            }
        }
        len = this._dialogStack.length;
        if (len > 0) {
            this._dialogStack[len - 1].node.zIndex = Const.DIALOG_Z_ORDER;
            this._dialogStack[len - 1].node.active = true;
        }
    },
    getCurDialog: function () {
        var len = this._dialogStack.length;
        return len > 0 ? this._dialogStack[len - 1] : undefined;
    },
    _pushDialogToStack: function (dialogName, node) {
        var len = this._dialogStack.length;
        var selfComp = node.getComponent('AFDialogBase');
        if (len > 0 && !selfComp.noHideOtherDialog) {
            var prevDialog = this._dialogStack[len - 1];
            prevDialog.node.zIndex = Const.DIALOG_Z_ORDER - 1;
            var comp = prevDialog.node.getComponent('AFDialogBase');
            // 把前一个dialog
            if ((!comp || !comp.noHideBelowDialog) && !comp.isClosing()) {
                prevDialog.node.active = false;
            }
        }
        this._dialogStack.push({ name: dialogName, node: node });
    },
    _hasDialogInStack: function (dialogName) {
        var len = this._dialogStack.length;
        for (var i = 0; i < len; ++i) {
            var v = this._dialogStack[i];
            if (v.name === dialogName) {
                return true;
            }
        }
        return false;
    },
});

// 设置取切场景和对话框的全局变量
window.AF.SCENE_PARAMS = function () {
    if (!SceneManager.instance) return null;
    return SceneManager.instance.getCurSceneParams();
};

window.AF.DIALOG_PARAMS = function () {
    if (!SceneManager.instance) return {};
    return SceneManager.instance.getCurDialogParams();
};

// 跳转场景
window.AF.gotoScene = function (sceneName, params, onLoad) {
    if (!SceneManager.instance) return null;
    SceneManager.instance.switchScene(sceneName, params, onLoad);
};

window.AF.setEnableSwitchSceneAnim = function (state) {
    if (!SceneManager.instance) return null;
    SceneManager.instance.setEnableSwitchSceneAnim(state);
};

// 打开对话框
window.AF.openDialog = function (dialogName, params, onOpened) {
    if (!SceneManager.instance) return null;

    var argv = { dialogName: dialogName, params: params, onOpened: onOpened };
    window.AF.EventDispatcher.emit(window.AF.Event.WILL_OPEN_DIALOG, argv);

    if (argv.dialogName) {
        cc.log('OpenDialog->', argv.dialogName);
        SceneManager.instance.openDialog(argv.dialogName, argv.params, argv.onOpened);
    }
};

// 预加载对话框
window.AF.preloadDialog = function (dialogName, onLoad) {
    if (!SceneManager.instance) return null;
    SceneManager.instance.preloadDialog(dialogName, onLoad);
};

/*
// 首次启动场景，初始化SceneManager
cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
    // 添加SceneManager节点
    var s = cc.director.getScene();
    if (CC_EDITOR || s.getChildByName('SceneManager')) return;
    var node = new cc.Node('SceneManager');
    node.addComponent(SceneManager);
    s.addChild(node);
});
*/

// 游戏切换到后台
cc.game.on(cc.game.EVENT_HIDE, function () {
    //cc.info('[AF] game on hide');
    console.log("游戏切换到后台");
    EventDispatcher.emit(Event.GMAE_ON_HIDE);
});

// 游戏切换到前台
cc.game.on(cc.game.EVENT_SHOW, function () {
    console.log("游戏切换到前台");
    //cc.info('[AF] game on show');
    EventDispatcher.emit(Event.GAME_ON_SHOW);
});