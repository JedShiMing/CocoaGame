var DialogBase = require('AFDialogBase');

cc.Class({
    extends: DialogBase,

    properties: {
        downloadProgress: {
            default: null,
            type: cc.ProgressBar,
            displayName: 'downloadProgress下载进度条'
        },
    },

    // use this for initialization
    onLoad: function () {
        DialogBase.prototype.onLoad.call(this);
        this.node.getChildByName('leftAnchor').y = 0 - cc.winSize.height / 2;
        this.regEvent(AF.Event.FILE_DOWNLOAD, this.onFileDownloaded);
        this.regEvent(AF.Event.SHOW_LOGIN_PROGRESS_DIALOG, this.onShowLoginProgressDialog);
        this.regEvent(AF.Event.QUERY_OBJECT, this.onQueryObject);
    },

    onEnable: function () {
        DialogBase.prototype.onEnable.call(this);
        this.downloadProgress.progress = 0;
        this.percent = 0;
        this.maxPercent = 20;

        this.step = 1;

        this.countUpdate = 0;

        //
        this.downloadState = false;
        this.workState = 0;

        // 1 无下载任务 2 正在下载 3 下载完成 4 下载失败
        this.currentState = 1;
        this.currentIndex = -1;
        this.fileList = AF.DIALOG_PARAMS();
    },

    onQueryObject: function (key) {

        if (key == "LoginProgressDialog") {
            AF.GameData.setMyObject("LoginProgressDialog", true);
        }

    },

    onFileDownloaded: function (filename, url, state) {

        if (this.step !== 2) {
            return;
        }

        if (this.currentIndex < 0 || this.currentIndex >= this.fileList.length) {
            return;
        }

        if (filename !== this.fileList[this.currentIndex]) {
            return;
        }

        if (state) {
            console.log('file is downloaded succ ', filename);
            this.currentState = 3;
        } else {
            console.log('file is downloaded fail ', filename);
            this.currentState = 4;
        }
    },

    downloadFile: function () {
        AF.Downloader.startDownloadFile(this.fileList[this.currentIndex], false);
    },

    onShowLoginProgressDialog: function (step, percent, params) {

        this.step = step;
        this.maxPercent = percent;

        if (this.step == 1) {
            this.downloadProgress.node.active = true;
            this.percent = 0;
        } else if (this.step == 2) {
            //
            this.downloadState = false;
            this.workState = 0;

            // 1 无下载任务 2 正在下载 3 下载完成 4 下载失败
            this.currentState = 1;
            this.currentIndex = -1;
            this.fileList = params;
        }

    },

    updateStep: function () {

        if (this.step == 4) {
            return;
        }

        this.countUpdate += 1;

        if (this.countUpdate > 4) {
            this.countUpdate = 0;
        }

        var split = 0;

        if (this.percent < this.maxPercent) {
            split = this.maxPercent - this.percent;
        }

        if (split > 0) {
            if (split < 5) {
                if (this.countUpdate != 0) {
                    return;
                }
            } else {
                if (this.countUpdate == 1 || this.countUpdate == 3) {
                    return
                }
            }
        }

        if (this.percent < this.maxPercent) {
            this.percent += 2;
            this.downloadProgress.progress = this.percent / 100;
        }

        if (this.percent >= 100) {
            this.step = 4;
            AF.GameData.setMyObject("LoginProgressDialogFinish", true);
            this.downloadProgress.node.active = false;
        }
    },

    updateStep2: function () {

        if (3 === this.workState) {
            this.downloadState = true;
            this.workState = 1;
            return;
        }

        if (2 === this.workState) {
            this.downloadState = false;
            this.workState = 1;
            return;
        }

        if (1 === this.workState) {
            this.workState = -1;
            //emit
            AF.EventDispatcher.emit(AF.Event.DOWNLOADDIAGLOG_ON_CLOSE, this.downloadState);
            return;
        }

        if (0 === this.workState) {
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
            }
        }


    },

    onMoreGamesClick: function () {
    },

    update: function (dt) {

        this.updateStep();

        if (this.step == 2) {
            this.updateStep2();
        }
    }
});
