"use strict";
cc._RF.push(module, '74c5c2CxblKzoG2L9I4EdaU', 'af-event');
// framework/const/af-event.js

/**
 * 公共模块的事件定义
 */

"use strict";

var Event = {
    // game相关
    GAME_LOADED: 0, // 游戏加载完成

    ENTER_GAME: 0, // 进入游戏
    EXIT_TO_HALL: 0, // 退出游戏回到大厅

    WILL_OPEN_DIALOG: 0, //将要打开某界面
    UI_SCENE_TOUCH_ENABLE: 0, //UI可触摸
    QUERY_OBJECT: 0, // 对象查询
    GAME_ON_SHOW: 0, // 游戏切换到前台
    GMAE_ON_HIDE: 0, // 游戏切换到后台
    GAME_ON_BGM: 0, // 恢复背景音乐
    BEFORE_SCENE_LAUNCH: 0, // 场景切换前
    AFTER_SCENE_LAUNCH: 0, // 场景切换完成
    SCENE_LOADED: 0,

    SHOW_LOADING_LAYER: 0, //展示加载页面
    HIDE_LOADING_LAYER: 0, //隐藏加载页面

    USER_INFO_UPDATE: 0, //玩家资源信息变化

    FILE_DOWNLOAD: 0, //文件下载
    FILE_LOADFRAME: 0, //纹理图片读取
    FILE_LOADNETSPRITE: 0, //网络图片加载
    DOWNLOADDIAGLOG_ON_CLOSE: 0, //下载对话框关闭
    CLOSE_WAIT_DIALOG: 0, //加载对话框关闭

    SHOW_LOGIN_PROGRESS_DIALOG: 0,
    CLOSE_DIALOG_BY_NAME: 0,

    HIDE_BANNER_AD: 0,

    JUMP_REVIVE: 0 //跳跃上的复活
};

var baseKey = 0; //框架内部事件(1, 10000)
for (var k in Event) {
    Event[k] = ++baseKey;
}

module.exports = (window.AF = window.AF || {}).Event = Event;

cc._RF.pop();