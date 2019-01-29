/**
 * loading层管理器
 */

var Const = require("af-const");
var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");

var DEFAULT_TIME_OUT = 8;
var DEFAULT_MESSAGE_BOX_STYLE_NAME = 'DefaultLoadingLayerStyle';
var _styles = {};

var LoadingLayer = {};

// 添加样式
LoadingLayer.addStyle = function (name, prefabName) {
    _styles[name] = prefabName;
    AF.preloadDialog(prefabName);
};

// 重置默认样式
LoadingLayer.resetDefaultStyle = function (prefabName) {
    _styles['default'] = undefined;
    if (prefabName) {
        this.addStyle('default', prefabName);
    }
};

LoadingLayer.show = function (params) {
    params = params || {};
    AF.EventDispatcher.emit(AF.Event.SHOW_LOADING_LAYER, params);
};

LoadingLayer._closeLoadingLayer = function () {
    AF.EventDispatcher.emit(AF.Event.HIDE_LOADING_LAYER);
};

LoadingLayer._tick = function () {
    if (this._totalTime) {
        this._totalTime -= 1;
        if (this._totalTime <= 0) {
            var cb = this._timeupCB;
            cb && cb();
            this._closeLoadingLayer();
        }
    }
};

LoadingLayer._onSwitchScene = function () {
    this._closeLoadingLayer();
    this._tickHandle && clearInterval(this._tickHandle);
    this._curLoadingLayer = this._releaseProtos = this._timeupCB = this._totalTime = undefined;
    this._tickHandle = undefined;
    this._openningLoadingLayer = false;
};

AF.EventDispatcher.on(AF.Event.BEFORE_SCENE_LAUNCH, LoadingLayer._onSwitchScene, LoadingLayer);

// 加载框架默认的吐司消息样式
EventDispatcher.once(Event.GAME_LOADED, function () {
    LoadingLayer.addStyle('_default_', DEFAULT_MESSAGE_BOX_STYLE_NAME);
});

AF.LOADING_LAYER = LoadingLayer.show.bind(LoadingLayer);
AF.CLOSE_LOADING_LAYER = LoadingLayer._closeLoadingLayer.bind(LoadingLayer);

module.exports = (window.AF = window.AF || {}).LoadingLayer = LoadingLayer;