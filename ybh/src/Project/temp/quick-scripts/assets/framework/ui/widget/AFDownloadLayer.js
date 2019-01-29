(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/ui/widget/AFDownloadLayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6bfad6tfy9NNKxDlXyyfPIY', 'AFDownloadLayer', __filename);
// framework/ui/widget/AFDownloadLayer.js

'use strict';

var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    editor: {
        menu: 'ApplicationFramework/AFDownloadLayer'
    },

    properties: {
        // tips: {
        //     default: null,
        //     type: cc.Label,
        //     displayName: 'tips文本标签'
        // }
        downloadProgress: {
            default: null,
            type: cc.ProgressBar,
            displayName: 'downloadProgress下载进度条'
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        DialogBase.prototype.onLoad.call(this);
        this.downloadState = false;
        this.regEvent(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded);
    },
    onEnable: function onEnable() {
        DialogBase.prototype.onEnable.call(this);
        //
        this.workState = 0;
        // 1 无下载任务 2 正在下载 3 下载完成 4 下载失败
        this.currentState = 1;
        this.currentIndex = -1;
        this.fileList = AF.DIALOG_PARAMS();
        this.downloadProgress.progress = 0;
        this.percent = 0;
    },

    onDestroy: function onDestroy() {
        DialogBase.prototype.onDestroy.call(this);
        this.currentState = 1;
        this.currentIndex = -1;
        this.downloadState = false;
    },
    show: function show(isShow) {
        var panel = this.node.getChildByName("panel");
        panel.opacity = isShow ? 255 : 0;
    },
    onFileDownloaded: function onFileDownloaded(filename, url, state) {
        if (this.currentIndex < 0 || this.currentIndex >= this.fileList.length) {
            return;
        }
        if (filename !== this.fileList[this.currentIndex]) {
            return;
        }
        if (state) {
            this.currentState = 3;
        } else {
            this.currentState = 4;
        }
    },
    downloadFile: function downloadFile() {
        AF.Downloader.startDownloadFile(this.fileList[this.currentIndex], false);
    },
    update: function update(dt) {
        if (3 === this.workState) {
            if (this.percent < 99) {
                this.percent++;
                this.downloadProgress.progress = this.percent / 100;
            } else {
                this.workState = 1;
                this.downloadProgress.progress = 1;
                //发射成功
                this.downloadState = true;
                this.close();
            }
            return;
        }
        if (0 !== this.workState) {
            return;
        }

        if (this.percent < 99) {
            this.percent++;
            this.downloadProgress.progress = this.percent / 100;
        }

        if (1 === this.currentState) {
            if (this.currentIndex + 1 > this.fileList.length - 1) {
                this.workState = 3;
            } else {
                this.currentIndex++;
                this.currentState = 2;
                this.downloadFile();
            }
        } else if (2 === this.currentState) {
            //if()
        } else if (3 === this.currentState) {
            this.currentState = 1;
        } else if (4 === this.currentState) {
            //下载失败
            this.workState = 2;
            //发射失败
            this.downloadState = false;
            this.close();
        }
    },
    close: function close() {
        DialogBase.prototype.close.call(this);
        AF.EventDispatcher.emit(AF.Event.DOWNLOADDIAGLOG_ON_CLOSE, this.downloadState);
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
        //# sourceMappingURL=AFDownloadLayer.js.map
        