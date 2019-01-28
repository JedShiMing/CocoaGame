cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        cc.loader.downloader.loadSubpackage('zi_package', function (err) {
            if (err) {
                return console.error('加载子包失败 -- ', err);
            }
            console.log('load subpackage successfully.');
        });
    },

    // called every frame
    update: function (dt) {

    },
});