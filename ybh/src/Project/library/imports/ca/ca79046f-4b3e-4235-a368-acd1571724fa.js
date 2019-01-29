"use strict";
cc._RF.push(module, 'ca790RvSz5CNaNorNFXFyT6', 'af-const');
// framework/const/af-const.js

/**
 * 公共模块的常量定义
 */

"use strict";

var Const = {
    DIALOG_Z_ORDER: 1000, // 对话框zOrder
    TOAST_MESSAGE_Z_ORDER: 2000, // Toast消息zOrder
    TOP_Z_ORDER: 4000,
    ANIM_Z_ORDER: 4001, //场景切换动画zOrder
    GUIDE_Z_ORDER: 4002, //新手引导页面zOrder
    STORY_Z_ORDER: 4003, //剧情页面zOrder
    GAIN_Z_ORDER: 4004, //收获页面zOrder
    LOADING_LAYER_Z_ORDER: 4005, //加载阻止页面zOrder
    MESSAGE_BOX_Z_ORDER: 6000 // 系统消息框zOrder
};

// 玩家性别
Const.UserGender = {
    FEMALE: 0,
    MALE: 1,
    UNKNOWN: 2
};

Const.ActionType = {
    effect: 0,
    wait: 1,
    run: 2,
    attack: 3,
    magic: 4,
    dead: 5,
    passive: 6,
    win1: 7,
    win2: 8,
    magic2: 9,
    magic3: 10,
    revive: 11
};

Const.ActionName = ["", "wait", "run", "attack", "magic", "dead", "passive", "win1", "win2", "magic2", "magic3", "revive"];

module.exports = (window.AF = window.AF || {}).Const = Const;

cc._RF.pop();