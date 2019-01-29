(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/utils/af-random2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c9109hAD9NA97Du5qxSXISm', 'af-random2', __filename);
// framework/utils/af-random2.js

"use strict";

// if(typeof window == "undefined") {
//     var AF = {};
// } else {
//     window.AF = window.AF || {};
// }

var Random2 = function Random2(seed) {
    seed = seed || new Date().getTime();
    this.setSeed(seed);
};

Random2.prototype.next = function (a, b) {
    this._seed = this._seed * 16807 % 2147483647;
    if (arguments.length === 0) {
        return this._seed / 2147483647;
    } else if (arguments.length === 1) {
        return this._seed / 2147483647 * a;
    } else {
        return this._seed / 2147483647 * (b - a) + a;
    }
};

Random2.prototype.getChance = function (chance) {
    var r = this.getRandomIn(1, 100);

    return r <= chance;
};

Random2.prototype.getRandomIn = function (min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
};

Random2.prototype.setSeed = function (seed) {
    this._seed = seed * 16807 % 2147483647;
    if (this._seed <= 0) {
        this._seed += 2147483646;
    }
};

AF.Random2 = module.exports = Random2;

AF.Random = new AF.Random2(new Date().getTime());

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
        //# sourceMappingURL=af-random2.js.map
        