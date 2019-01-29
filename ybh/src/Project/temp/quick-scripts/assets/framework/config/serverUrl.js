(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/config/serverUrl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ce339+Z6nxEvLv/eu3uRE/l', 'serverUrl', __filename);
// framework/config/serverUrl.js

'use strict';

var serverVer = require('./serverVer.js');

var urls = {
    test: {
        src: 'wx',
        api: 'https://yangtest.yiziruwo.cn/link/update/api/v' + serverVer.version + '/',
        cdn: 'https://yangtest.yiziruwo.cn/link/update/version/' + serverVer.version + '/'
    },
    releaseWX: {
        src: 'wx',
        api: 'https://yangtest.yiziruwo.cn/link/update/api/v' + serverVer.version + '/',
        cdn: 'https://yangtest.yiziruwo.cn/link/update/version/' + serverVer.version + '/'
    },
    releaseQQ: {
        src: 'qq',
        api: 'https://yangtest.yiziruwo.cn/link/update/api/v' + serverVer.version + '/',
        cdn: 'https://yangtest.yiziruwo.cn/link/update/version/' + serverVer.version + '/'
    }
};
var self = module.exports = {
    getUrls: function getUrls() {
        return urls;
    }
};

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
        //# sourceMappingURL=serverUrl.js.map
        