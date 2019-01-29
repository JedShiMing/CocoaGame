"use strict";
cc._RF.push(module, '8a6a5NDTzNCvqqbEjSa6Q93', 'af-notice-mgr');
// framework/ui/mgr/af-notice-mgr.js

"use strict";

/**
 * 通知消息管理器
 */

var Const = require("af-const");

var Notice = {};

var DEFAULT_MARQUEE_MSG_INTERVAL = 10; // 默认重复播放的跑马灯消息间隔时间

Notice.registerMarqueeWidget = function (com) {
    this._marqueeWidget = com;
};

Notice.unregisterMarqueeWidget = function () {
    this._marqueeWidget = undefined;
};

/**
 * 跑马灯消息
 * @param text {String} 消息文本（支持富文本）
 * @param repeat {Number} 重复次数 -1:为一直重复
 * @param interval {Number} 重复间隔时间(秒)
 */
Notice.marquee = function (text, repeat, interval) {
    this._marqueeMsg = this._marqueeMsg || [];
    if (repeat) {
        this._marqueeMsg.push({
            text: text,
            repeat: repeat - 1,
            interval: interval || DEFAULT_MARQUEE_MSG_INTERVAL,
            time: interval || DEFAULT_MARQUEE_MSG_INTERVAL
        });
        if (!this._tickHandle) {
            this._tickHandle = setInterval(this._tick.bind(this), 1000);
        }
    }

    this._showMarquee(text);
};

Notice._showMarquee = function (text) {
    if (this._marqueeWidget) {
        this._marqueeWidget.show(text);
    }
};

Notice._checkMarqueeMsgQueue = function () {
    var i = 0;
    while (true) {
        if (i >= this._marqueeMsg.length) {
            break;
        }

        var v = this._marqueeMsg[i];
        v.time -= 1;
        if (v.time <= 0) {
            v.time = v.interval;
            v.repeat = v.repeat > 0 ? v.repeat - 1 : v.repeat;
            this._showMarquee(v.text);
            if (v.repeat == 0) {
                this._marqueeMsg.splice(i, 1);
            } else {
                i++;
            }
        } else {
            i++;
        }
    }
};

Notice._tick = function () {
    if (this._marqueeMsg) {
        this._checkMarqueeMsgQueue();
    }
};

module.exports = (window.AF = window.AF || {}).Notice = Notice;

cc._RF.pop();