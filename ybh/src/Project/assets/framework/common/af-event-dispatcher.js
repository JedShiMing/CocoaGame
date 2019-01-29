'use strict';

var List = require('AFList')

var EventDispatcher = {};
EventDispatcher.eventGroup = {};

EventDispatcher.getEvent = function (eventKey) {
    return EventDispatcher.eventGroup[eventKey] = (EventDispatcher.eventGroup[eventKey] || new List());
};

EventDispatcher.on = function (eventKey, selector, target) {
    if (!selector) {
        cc.error("invalid addListener selector");
    }
    selector && EventDispatcher.getEvent(eventKey).pushBack({ selector: selector, target: target });
};

EventDispatcher.off = function (eventKey, selector, target) {
    EventDispatcher.getEvent(eventKey).removeIf(function (item) {
        return item.selector == selector && item.target == target;
    });
};

EventDispatcher.emit = function (eventKey) {
    var argv = [];
    for (var i = 1, len = arguments.length; i < len; ++i) {
        var arg = arguments[i];
        argv.push(arg);
    }

    return EventDispatcher.getEvent(eventKey).forEach(function (item) {
        return item.selector.apply(item.target, argv);
    });
};

EventDispatcher.once = function (eventKey, selector, target) {
    var self = this;
    var cb = function () {
        self.off(eventKey, cb, target);
        selector.apply(this, arguments);
    };
    this.on(eventKey, cb, target);
};

module.exports = (window.AF = window.AF || {}).EventDispatcher = EventDispatcher;
