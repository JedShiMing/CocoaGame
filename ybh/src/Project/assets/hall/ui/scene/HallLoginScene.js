const VERSION_FILE = "version.json";

const STEP = {
    LAUNCH_FAIL: -1,
    LAUNCH_INIT: 0,
    LOCAL_VERSION: 1,
    REMOTE_VERSION: 2,
    WAIT_REMOTE_VERSION: 3,
    FILELIST_AND_VERSION: 4,
    WAIT_FILELIST_AND_VERSION: 5,
    LOAD_CONFIG: 6,
    WAIT_LOAD_CONFIG: 7,
    START_LOGIN: 8,
    WAIT_LOGIN_RESULT: 9,
    GET_USER_INFO: 10,
    WAIT_USER_INFO: 11,
    GOTO_MAINSCENE: 12,
    WAIT_NEWBIE_DIALOG: 13,
    LAUNCH_END: 14,
};
/**
 * 0 init
 * 1 读取本地version.json
 * 2 下载并读取远程version.json，并且比较版本
 * 3 step2 waiting
 * 4 下载资源文件列表，保存version.json 
 * 5 step4 waiting
 * 6 读取配置文件
 * 7 step6 waiting
 * 8 发起登录请求
 * 9 step8 waiting
 * 10 获取用户信息
 * 11 step10 waiting
 * 12 进入主界面
 * 13 end
 */
cc.Class({
    extends: cc.Component,

    properties: {
        stratButton: cc.Node,
        version: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        
        this.localVersion = 0;
        this.step = STEP.LAUNCH_INIT;
        this.tryTimes = 0;
        this.fileList = [];

        AF.EventDispatcher.on(AF.Event.FILE_DOWNLOAD, this._loadAndCheckVersion, this);
        AF.EventDispatcher.on(AF.Event.DOWNLOADDIAGLOG_ON_CLOSE, this._downloadFilelist, this);

        this.stratButton.active = false;

        this.schedule(this.onGameBGM, 0.1, this);
    },

    onEnable: function () {
        AF.setEnableSwitchSceneAnim(true);

        var strVersion = AF.platform.getDisplayVersion();

        this.version.string = strVersion;

        if (AF.platform.isHairScreen()) {
            this.version.node.getComponent(cc.Widget).right = 20;
        }

        this.localVersion = 0;
        this.step = STEP.LAUNCH_INIT;
        this.tryTimes = 0;
        this.fileList = [];

        AF.EventDispatcher.emit(AF.Event.SCENE_LOADED);

        var isVideoAdOpen = AF.util.isVideoAdOpen();

        AF.platform.start(isVideoAdOpen);
        AF.platform.setKeepScreenOn();

        var params = AF.SCENE_PARAMS();
        this.change = (params && params.change) || false;
        if (this.change) {
            this.step = STEP.GOTO_MAINSCENE;
        } else {
            AF.GameData.init();
            AF.GameConfig.init();
        }

        this.firstLoad = (params && params.firstLoad) || false;
    },

    onGameBGM: function (dt) {
        AF.EventDispatcher.emit(AF.Event.GAME_ON_BGM);
    },

    onDisable: function () {
    },

    onDestroy: function () {
        AF.EventDispatcher.off(AF.Event.FILE_DOWNLOAD, this._loadAndCheckVersion, this);
        AF.EventDispatcher.off(AF.Event.DOWNLOADDIAGLOG_ON_CLOSE, this._downloadFilelist, this);
    },

    _loadLocalVersionFile: function () {

        if (this.step !== STEP.LOCAL_VERSION) return;

        if (!AF.util.isLocalFileExist(VERSION_FILE)) {
            //VERSION_FILE不存在 拉取远程VERSION_FILE
            this.localVersion = 0;
            this.step = STEP.REMOTE_VERSION;
            return;
        }

        var self = this;
        try {
            cc.loader.load(AF.util.getLocalFilePath(VERSION_FILE), function (err, res) {
                if (err) {
                    throw err;
                }
                self.localVersion = res.version;
                self.step = STEP.REMOTE_VERSION;
                console.log("【本地版本文件内容】", res);
                console.log("HallLoginScene.js _loadLocalVersionFile localVersion:", self.localVersion);
            });

        } catch (errMsg) {
            console.log("【错误:读取本地版本文件出错】");
            console.log("【读取路径：" + AF.util.getLocalFilePath(VERSION_FILE) + "】");
            console.log("【错误信息】", errMsg);
            self.localVersion = 0;
            self.step = STEP.REMOTE_VERSION;
        }
    },

    _startLoadRemoteVersionFile: function () {
        if (this.step !== STEP.WAIT_REMOTE_VERSION) return;
        AF.Downloader.startDownloadFile(VERSION_FILE, true);
    },

    _loadAndCheckVersion: function (filename, tempFilePath, state) {
        if (this.step !== STEP.WAIT_REMOTE_VERSION) return;
        if (VERSION_FILE !== filename) return;
        if (!state) {
            //下载失败
            console.log("err HallLoginScene.js _loadAndCheckVersion ", filename, tempFilePath, state);
            this.step = STEP.LAUNCH_INIT;
            return;
        }
        
        AF.util.makesureLocalPath2("temp/");
        var url = AF.util.getLocalFilePath2("temp/" + VERSION_FILE);

        AF.util.saveLocalFile(tempFilePath, url);

        var self = this;

        try {
            cc.loader.load(url, function (err, res) {
                if (err) {
                    throw err;
                }
                console.log("【远程版本文件内容】", res);
                console.log("【远程版本文件版本】", res.version);
                console.log("【远程版本文件列表】", res.files);
                console.log("【本地版本】", res.version);
                if (self.localVersion !== res.version) {
                    self.fileList = res.files;
                    self.tempFilePath = url;
                    console.log("【远程版本文件版本与本地不同】");
                    console.log("【远程版本文件版本与本地不同】");
                } else {
                    self.tempFilePath = null;
                    console.log("【远程版本文件版本与本地相同】");
                }

                self.step = STEP.FILELIST_AND_VERSION;
            });
        } catch (errMsg) {
            console.warn("【错误:读取远程文件临时文件出错】");
            console.warn("【读取路径：" + url + "】");
            console.warn("【错误信息】", errMsg);
            self.localVersion = 0;
            self.step = STEP.LAUNCH_INIT;
        }
    },

    _downloadFilelist: function (downloadState) {
        if (this.step !== STEP.WAIT_FILELIST_AND_VERSION) return;
        if (downloadState) {
            this._saveRemoteVersionFile();
            this.step = STEP.LOAD_CONFIG;
            AF.EventDispatcher.emit(AF.Event.SHOW_LOGIN_PROGRESS_DIALOG, 3, 40);
        } else {
            console.log("err HallLoginScene.js _downloadFilelist ", downloadState);
            this.step = STEP.LAUNCH_INIT;
        }
    },

    _saveRemoteVersionFile: function () {
        if (this.step !== STEP.WAIT_FILELIST_AND_VERSION) return;
        if (!AF.platform.isWxApp() && !AF.platform.isQQApp()) {
            this.step = STEP.LOAD_CONFIG;
            return;
        }
        if (!this.tempFilePath) {
            this.step = STEP.LOAD_CONFIG;
            return;
        }

        AF.util.copyLocalFile(this.tempFilePath, AF.util.getLocalFilePath(VERSION_FILE));

        this.step = STEP.LOAD_CONFIG;
    },

    _loadConfigFileList: function () {
        if (this.step !== STEP.WAIT_LOAD_CONFIG) return;
        this.configList = [
            "model",
            "player",
            "point"
        ];

        this.index = 0;
        this._startLoadConfig();
    },

    _startLoadConfig: function () {
        if (this.step !== STEP.WAIT_LOAD_CONFIG) return;
        if (this.index >= this.configList.length) {
            // 配置加载完成
            this.step = STEP.START_LOGIN;
            AF.EventDispatcher.emit(AF.Event.SHOW_LOGIN_PROGRESS_DIALOG, 3, 60);
 
            return;
        }
        var cfg = "config/" + this.configList[this.index] + "_config.json";
        console.log("开始加载配置文件" + cfg + "...");
        var url;

        if (AF.platform.isWxApp() || AF.platform.isQQApp()) {
            url = AF.util.getLocalFilePath(cfg);
        } else {
            url = AF.util.getRemoteUrl(cfg);
        }
        var self = this;
        cc.loader.load(url, function (err, res) {
            if (err) {
                console.log("err HallLoginScene.js _startLoadConfig ", err);
                self.step = STEP.LAUNCH_INIT;
                return;
            }

            AF.GameConfig.setGameConfig(self.configList[self.index], res);

            self.index++;
            self._startLoadConfig();
        });
    },

    update: function (dt) {
        var self = this;
        if (!self.openLoginProgressDialog) {
            AF.EventDispatcher.emit(AF.Event.SCENE_LOADED);
            AF.openDialog("LoginProgressDialog");
            self.openLoginProgressDialog = true;
        }

        if (!AF.util.queryObject("LoginProgressDialog")) {
            return;
        }

        if (STEP.LAUNCH_INIT === self.step) {

            console.log("开始启动游戏");
            AF.GameData.setMyObject("LoginProgressDialogFinish", false);
            self.stratButton.active = false;

            AF.EventDispatcher.emit(AF.Event.SHOW_LOGIN_PROGRESS_DIALOG, 1, 10);

            if (self.tryTimes > 3) {
                self.step = STEP.LAUNCH_FAIL;
                console.log("启动失败");
                console.log("HallLoginScene.js update  err: try too many times");
                AF.MessageBox.OK("启动失败", "点击确定重试！", (ret) => {
                    if (ret === AF.MessageBox.RET_OK) {
                        self.tryTimes = 0;
                        self.step = STEP.LAUNCH_INIT;
                    }
                }, "", false);
                return;
            } else if (self.tryTimes == 3) {
                console.log("重试次数超过3次");
                self.tryTimes++;
                return;
            } else {
                self.tryTimes++;
            }
            if (AF.platform.isWxApp() || AF.platform.isQQApp()) {
                console.log("开始读取本地配置文件");
                self.step = STEP.LOCAL_VERSION;
                self._loadLocalVersionFile();
            } else {
                console.log("浏览器平台");
                self.step = STEP.FILELIST_AND_VERSION;
            }
        } else if (STEP.REMOTE_VERSION === self.step) {
            console.log("读取远程配置文件并比较版本差异，并保存最新的版本文件");
            self.step = STEP.WAIT_REMOTE_VERSION;
            self._startLoadRemoteVersionFile();
            return;
        } else if (STEP.FILELIST_AND_VERSION === self.step) {
            console.log("开始下载资源文件列表，保存version.json");
            self.step = STEP.WAIT_FILELIST_AND_VERSION;
            AF.EventDispatcher.emit(AF.Event.SHOW_LOGIN_PROGRESS_DIALOG, 2, 30, self.fileList);
            return;
        } else if (STEP.LOAD_CONFIG === self.step) {
            console.log("开始加载配置文件...");
            self.step = STEP.WAIT_LOAD_CONFIG;
            self._loadConfigFileList();
            return;
        } else if (STEP.START_LOGIN === self.step) {
            console.log("开始连接服务器...");
            // AF.audio.playDefaultBGM();
            AF.EventDispatcher.emit(AF.Event.SHOW_LOGIN_PROGRESS_DIALOG, 3, 100);

            self.step = STEP.WAIT_LOGIN_RESULT;
            var OPENID = AF.util.getStorage('openId');
            if (OPENID) {
                self.step = STEP.GET_USER_INFO;
                return;
            }
            AF.util.login((openid) => {
                OPENID = openid
                console.error('openid', OPENID);
                self.step = STEP.GET_USER_INFO;
            }, (errMsg) => {
                console.error(errMsg);
                self.step = STEP.LAUNCH_INIT;
            });
        } else if (STEP.GET_USER_INFO === self.step) {
            console.log("获取用户信息");
            self.step = STEP.WAIT_USER_INFO;
            self.step = STEP.GOTO_MAINSCENE;
        } else if (STEP.GOTO_MAINSCENE === self.step) {
            if (AF.GameData.getMyObject("LoginProgressDialogFinish")) {
                self.step = STEP.LAUNCH_END;
                console.log("等待 进入主界面或新手引导界面");
                AF.gotoScene('HallMainScene');
            }
        }
    },
});
