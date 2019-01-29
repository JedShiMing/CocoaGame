(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/ui/scene/HallBootScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '22e7cBWK3lPWqn03TlZ0L10', 'HallBootScene', __filename);
// hall/ui/scene/HallBootScene.js

"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Config = require("af-config-mgr");

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        console.log("HallBootScene onLoad");
    },
    onEnable: function onEnable() {
        console.log("HallBootScene onEnable");
        //console.log("SceneMgr", SceneManager);
        // 添加SceneManager节点

        /*
        var s = cc.director.getScene();
        var node = new cc.Node('SceneManager');
        node.addComponent(SceneManager);
        s.addChild(node);
          AF.gotoScene("HallLoginScene");
        */
    },
    start: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var SceneManager, s, node;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            console.log("HallBootScene start");
                            _context.prev = 1;
                            _context.next = 4;
                            return this.loadSubPackage();

                        case 4:
                            _context.next = 6;
                            return Config.loadDialogList();

                        case 6:
                            SceneManager = require('af-scene-mgr');

                            // 添加SceneManager节点

                            s = cc.director.getScene();

                            if (!(CC_EDITOR || s.getChildByName('SceneManager'))) {
                                _context.next = 10;
                                break;
                            }

                            return _context.abrupt("return");

                        case 10:
                            node = new cc.Node('SceneManager');

                            node.addComponent(SceneManager);
                            s.addChild(node);
                            AF.gotoScene("HallLoginScene");
                            _context.next = 20;
                            break;

                        case 16:
                            _context.prev = 16;
                            _context.t0 = _context["catch"](1);

                            console.error('【游戏出现错误】');
                            return _context.abrupt("return");

                        case 20:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[1, 16]]);
        }));

        function start() {
            return _ref.apply(this, arguments);
        }

        return start;
    }(),
    loadSubPackage: function loadSubPackage() {
        return new Promise(function (resolve, reject) {
            cc.loader.downloader.loadSubpackage('sub', function (err) {
                if (err) {
                    resolve();
                }
                resolve();
            });
        });
    },
    update: function update() {
        /*
          var dialogList = AF.Config.getDialogList();
          if (!dialogList) {
            //console.log("loading dialog list");
        } else {
            //console.log(dialogList);
        }
        */
    }
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
        //# sourceMappingURL=HallBootScene.js.map
        