(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/common/AFList.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5075fBNrh9GRJHZxQ9l5XtI', 'AFList', __filename);
// framework/common/AFList.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
    if (typeof require === 'function' && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module && module['exports']) /* nodeJS */
        module['exports'] = function () {
            return factory(cc);
        }();else /* Global */
        (global.AF = global.AF || {}).List = factory(cc);
})(undefined, function (logger) {
    'use strict';

    //---------------------------------------------ListItem-------------------------------------------------------------

    function ListItem(value, previous, next) {
        this._value = value;
        this._previous = previous;
        this._next = next;
    }

    var ListItemPrototype = ListItem.prototype;
    ListItemPrototype.clear = function () {
        this._value = null;
        this._previous = null;
        this._next = null;
    };

    //-----------------------------------------------List---------------------------------------------------------------
    function List() {
        this._size = 0;
        this._stack = [];
        var header = this._header = new ListItem();
        header._next = header;
        header._previous = header;
    }

    var ListPrototype = List.prototype;
    ListPrototype.beginIt = function (forward) {
        this._stack.push({
            forward: forward,
            it: forward ? this._header._next : this._header._previous
        });
    };

    ListPrototype.endIt = function () {
        this._stack.pop();
    };

    ListPrototype.isItEnd = function () {
        var idx = this._stack.length - 1;
        var item = this._stack[idx];
        return !item || item.it == this._header;
    };

    ListPrototype.moveIt = function (nxtOrPre, idx, it) {
        nxtOrPre === undefined && (nxtOrPre = true);
        idx === undefined && (idx = this._stack.length - 1);

        var item = this._stack[idx];
        var value = item ? item.it._value : undefined;
        if (item && (it == undefined || item.it == it)) {
            if (item.forward) {
                if (nxtOrPre) {
                    item.it = item.it._next;
                } else {
                    item.it = item.it._previous;
                }
            } else {
                if (!nxtOrPre) {
                    item.it = item.it._next;
                } else {
                    item.it = item.it._previous;
                }
            }
        }
        return value;
    };

    ListPrototype.getIt = function (idx) {
        idx === undefined && (idx = this._stack.length - 1);
        var item = this._stack[idx];
        return item ? item.it : undefined;
    };

    ListPrototype.getItValue = function (idx) {
        var it = this.getIt(idx);
        return it ? it._value : undefined;
    };

    ListPrototype.len = function () {
        return this._size;
    };

    ListPrototype.clear = function () {
        while (this.popBack()) {}
    };

    ListPrototype.empty = function () {
        return this._size == 0;
    };

    ListPrototype.concat = function (values) {
        for (var key in values) {
            var value = values[key];
            this.pushBack(value);
        }
        return this;
    };

    ListPrototype.extend = function (list) {
        var self = this;
        list.forEach(function (value) {
            self.pushBack(value);
        });
        return this;
    };

    ListPrototype.toArray = function () {
        var ret = [];
        this.forEach(function (value) {
            ret.push(value);
        });
        return ret;
    };

    ListPrototype.forEach = function (cb) {
        var ret = false;
        this.beginIt(true);
        while (!this.isItEnd()) {
            try {
                ret = cb(this.getItValue());
                if (ret) {
                    break;
                }
            } catch (e) {
                logger.error(e);
            }
            this.moveIt();
        }
        this.endIt();
        return ret;
    };

    ListPrototype.forEachReverse = function (cb) {
        var ret = false;
        this.beginIt(false);
        while (!this.isItEnd()) {
            try {
                ret = cb(this.getItValue());
                if (ret) {
                    break;
                }
            } catch (e) {
                logger.error(e);
            }
            this.moveIt();
        }
        this.endIt();
        return ret;
    };

    ListPrototype.find = function (cb) {
        var ret = undefined;
        this.beginIt(true);
        while (!this.isItEnd()) {
            try {
                var value = this.getItValue();
                if (cb(value)) {
                    ret = value;
                    break;
                }
            } catch (e) {
                logger.error(e);
            }
            this.moveIt();
        }
        this.endIt();
        return ret;
    };

    ListPrototype.remove = function (it) {
        if (it == this._header) {
            return false;
        }

        for (var i = 0, len = this._stack.length; i < len; ++i) {
            this.moveIt(false, i, it);
        }

        it._previous._next = it._next;
        it._next._previous = it._previous;
        it.clear();
        this._size--;
        return true;
    };

    ListPrototype.removeIf = function (cb) {
        var ret = false;
        this.beginIt(true);
        while (!this.isItEnd()) {
            try {
                if (cb(this.getItValue())) {
                    this.remove(this.getIt());
                    ret = true;
                    break;
                }
            } catch (e) {
                logger.error(e);
            }
            this.moveIt();
        }
        this.endIt();
        return ret;
    };

    ListPrototype.insert = function (it, value) {
        var item = new ListItem(value, it, it._next);
        item._previous._next = item;
        item._next._previous = item;
        this._size++;
    };

    ListPrototype.insertIf = function (value, cb) {
        this.beginIt(true);
        var ret = false;
        while (!this.isItEnd()) {
            try {
                if (cb(this.getItValue())) {
                    this.insert(this.getIt(), value);
                    ret = true;
                    break;
                }
            } catch (e) {
                logger.error(e);
            }
            this.moveIt();
        }

        if (!ret) {
            this.insert(this._header._previous, value);
        }

        this.endIt();
    };

    ListPrototype.pushBack = function (value) {
        this.insert(this._header._previous, value);
    };

    ListPrototype.popBack = function () {
        var back = this._header._previous;
        var value = back._value;
        this.remove(back);
        return value;
    };

    ListPrototype.getBack = function () {
        return this._header._previous._value;
    };

    ListPrototype.pushFront = function (value) {
        this.insert(this._header, value);
    };

    ListPrototype.popFront = function () {
        var front = this._header._next;
        var value = front._value;
        this.remove(front);
        return value;
    };

    ListPrototype.getFront = function () {
        return this._header._next._value;
    };

    return List;
});

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
        //# sourceMappingURL=AFList.js.map
        