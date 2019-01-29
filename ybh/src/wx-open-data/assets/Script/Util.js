const util = {
    // 获取微信好友排行榜数据
    getWXFriendRanks() {
        return new Promise(function (resolve, reject) {
            wx.getFriendCloudStorage({
                keyList: ["score"],
                success: res => {
                    let players = [];

                    for (let i = 0; i < res.data.length; i++) {
                        var data = res.data[i];

                        var obj = null;

                        for (let k = 0; k < data.KVDataList.length; k++) {
                            var kvData = data.KVDataList[k];

                            if (kvData.key === "score") {
                                obj = JSON.parse(kvData.value);
                                break;
                            }

                            if (obj) {
                                break;
                            }
                        }

                        if (obj) {
                            var player = {};
                            player.score = obj.score || 0;
                            player.startTime = obj.startTime || 0;
                            player.endTime = obj.endTime || 0;
                            player.openid = data.openid;
                            player.nickname = data.nickname;
                            player.avatarUrl = data.avatarUrl;
                            players.push(player);
                        }
                    }
                    players.sort(function (a, b) {
                        return -(a.score - b.score)
                    });
                    if (players.length > 0) {
                        resolve(players)
                    }
                }
            });
        })
    },

    // 获取微信个人信息
    getWeChatUserInfo() {
        return new Promise(function (resolve, reject) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (user) => {
                    resolve(user.data)
                },
                fail: (eor) => {
                    reject(eor)
                }
            })
        })
    },

    // 是否是全面屏
    isAllScreen: function () {
        var sz = cc.view.getFrameSize();
        var r = sz.width > sz.height ? sz.width / sz.height : sz.height / sz.width;
        return r > 1.85;
    }
};

module.exports = util;
