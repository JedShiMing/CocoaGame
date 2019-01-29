/**
 * 配置管理
 */

var Const           = require('af-const');
var EventDispatcher = require("af-event-dispatcher");
var Event           = require("af-event");

// (window.AF = window.AF || {}).i18n = require('LanguageData');
 
var DIALOG_LIST_FILE_PATH    = "framework/config/dialog_list";  // 对话框列表配置

var Config = {
    
    init: function() {
        this._dialogList = null;    // 对话框列表
        console.log('Config init');
    },

    getDialogList: function() {
        return this._dialogList;
    },

    _onEngineLoad: function() {
        // AF.i18n.init("zh");
        // this._loadDialogList();
    },

    // 加载dialog list
    _loadDialogList: function() {
        cc.loader.loadRes(DIALOG_LIST_FILE_PATH, function (errors, data) {
            if (errors) {
                cc.warn('load dialog list file failed!');
                return;
            }
            this._dialogList = data;
        }.bind(this));
    },

    loadDialogList: function () {
        return new Promise(function (resolve, rejec) {
            cc.loader.loadRes(DIALOG_LIST_FILE_PATH, function (errors, data) {
                if (errors) {
                    cc.warn('load dialog list file failed!');
                    rejec(errors);
                    return;
                }
                Config._dialogList = data.json;
                resolve(data);
            });
        });
    },

};

Config.init();

// 引擎加载完
// cc.game.once(cc.game.EVENT_GAME_INITED, function () {
//     /*!CC_EDITOR &&*/ Config._onEngineLoad();
// });

EventDispatcher.once(Event.GAME_LOADED, function () {
    Config._onEngineLoad();
});

AF.Config = module.exports = Config;