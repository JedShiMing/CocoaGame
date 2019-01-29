
var Config = require("af-config-mgr");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad() {
        console.log("HallBootScene onLoad");
    },

    onEnable() {
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
    async start() {
        console.log("HallBootScene start");
        try {
            await this.loadSubPackage();
            await Config.loadDialogList();
            var SceneManager = require('af-scene-mgr');

            // 添加SceneManager节点
            var s = cc.director.getScene();
            if (CC_EDITOR || s.getChildByName('SceneManager')) return;
            var node = new cc.Node('SceneManager');
            node.addComponent(SceneManager);
            s.addChild(node);
            AF.gotoScene("HallLoginScene");
        } catch (error) {
            console.error('【游戏出现错误】');
            return;
        }/**/
        // for (const key in cc.Sprite.State) {
        //     console.log(key);
        //     //     if (key && key[0] && (key[0] === 'g' || key[0] === 'G')) {
        //     // }
        // }

        // AF.ShaderUtils.init("gray");
        // AF.gotoScene("HallLoginScene");

    },
    loadSubPackage(){
        return new Promise((resolve,reject)=>{
            cc.loader.downloader.loadSubpackage('sub', function (err) {
                if (err) {
                    resolve();
                }
                resolve();
            });
        })
    },

    update() {
        /*

        var dialogList = AF.Config.getDialogList();

        if (!dialogList) {
            //console.log("loading dialog list");
        } else {
            //console.log(dialogList);
        }
        */
    },
});
