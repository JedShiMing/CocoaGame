(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/logic/af-config-mgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6accf9KYURPR5d1knt0IUdo', 'af-config-mgr', __filename);
// framework/logic/af-config-mgr.js

"use strict";

/**
 * 配置管理
 */

var Const = require('af-const');
var EventDispatcher = require("af-event-dispatcher");
var Event = require("af-event");

// (window.AF = window.AF || {}).i18n = require('LanguageData');

var DIALOG_LIST_FILE_PATH = "framework/config/dialog_list"; // 对话框列表配置

var Config = {

    init: function init() {
        this._dialogList = null; // 对话框列表
        console.log('Config init');
    },

    getDialogList: function getDialogList() {
        return this._dialogList;
    },

    _onEngineLoad: function _onEngineLoad() {
        // AF.i18n.init("zh");
        // this._loadDialogList();
    },

    // 加载dialog list
    _loadDialogList: function _loadDialogList() {
        cc.loader.loadRes(DIALOG_LIST_FILE_PATH, function (errors, data) {
            if (errors) {
                cc.warn('load dialog list file failed!');
                return;
            }
            this._dialogList = data;
        }.bind(this));
    },

    loadDialogList: function loadDialogList() {
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
    }

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
        //# sourceMappingURL=af-config-mgr.js.map
        