"use strict";
cc._RF.push(module, 'ce339+Z6nxEvLv/eu3uRE/l', 'serverUrl');
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