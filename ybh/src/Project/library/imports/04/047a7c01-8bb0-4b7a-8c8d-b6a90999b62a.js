"use strict";
cc._RF.push(module, '047a7wBi7BLeoyNtqkJmbYq', 'af-asset-loader');
// framework/misc/af-asset-loader.js

"use strict";

/**
 * 后台静默下载资源
 */

var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");
var Const = require("af-const");

var AssetLoader = {

    init: function init() {
        this._task = [];

        // 监听各种消息
        EventDispatcher.once(Event.GAME_LOADED, this._onGameLoaded, this);
    },

    _onGameLoaded: function _onGameLoaded() {

        this._startLoadDialogAssets('framework');
        this._startLoadDialogAssets('hall');
    },

    _startLoadDialogAssets: function _startLoadDialogAssets(moduleName) {
        var info = AF.Config.getDialogList();
        if (!info) {
            cc.error("load dialog assets failed, not found dialog list.");
            return;
        }
        var urls = [];
        var list = info.module[moduleName];
        var len = list.length;
        for (var i = 0; i < len; ++i) {
            urls.push(info.dialogs[list[i]]);
        }

        if (urls.length == 0) return;

        cc.loader.loadResArray(urls);
    }

};

AssetLoader.init();

module.exports = AssetLoader;

cc._RF.pop();