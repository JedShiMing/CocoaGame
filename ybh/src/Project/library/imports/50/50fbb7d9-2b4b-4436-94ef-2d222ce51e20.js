"use strict";
cc._RF.push(module, '50fbbfZK0tENpTvLSIs5R4g', 'af-downloader');
// framework/utils/af-downloader.js

'use strict';

/**
 * 下载管理器函数
 */

var Downloader = {
    init: function init() {
        this.allDownloadFiles = new Array();
        this.currentDownloadFileInfo = null;
    },
    //下载文件名（必须存在于remote下,必填字段） isNotSave => false保存 true 不保存 =>默认缺省保存 zip不保存
    startDownloadFile: function startDownloadFile(filename, isNotSave) {
        isNotSave = isNotSave || false;
        if (AF.util.isZipFile(filename)) {
            isNotSave = true;
        }
        if (!AF.platform.isWxApp() && !AF.platform.isQQApp()) {
            AF.EventDispatcher.emit(AF.Event.FILE_DOWNLOAD, filename, AF.util.getRemoteUrl(filename), true);
            return;
        }
        if (this.currentDownloadFileInfo && this.currentDownloadFileInfo.filename === filename) return;
        for (var index = 0; index < this.allDownloadFiles.length; index++) {
            if (this.allDownloadFiles[index].filename === filename) return;
        }
        this.allDownloadFiles.push({ filename: filename, isNotSave: isNotSave });
        this.processDownloadFile();
    },
    processDownloadFile: function processDownloadFile() {
        if (this.currentDownloadFileInfo) return;
        if (0 >= this.allDownloadFiles.length) return;

        this.currentDownloadFileInfo = this.allDownloadFiles[0];
        this.currentDownloadFileInfo.isUnzip = false;
        this.allDownloadFiles.splice(0, 1);
        var loadPath = '';
        var state = true;

        var self = this;
        var result = AF.util.makesureLocalPath(self.currentDownloadFileInfo.filename);
        if (!result) {
            state = false;
            AF.EventDispatcher.emit(AF.Event.FILE_DOWNLOAD, self.currentDownloadFileInfo.filename, AF.util.getRemoteUrl(self.currentDownloadFileInfo.filename), state);
            this.currentDownloadFileInfo = null;
            self.processDownloadFile();
            return;
        }
        var filename = self.currentDownloadFileInfo.filename;
        var tempFilePath = '';
        var filePath = '';
        if (!self.currentDownloadFileInfo.isNotSave) {
            filePath = AF.util.getLocalFilePath(filename);
        }
        if (AF.platform.isWxApp()) {
            wx.downloadFile({
                url: AF.util.getRemoteUrl(filename),
                header: {},
                filePath: filePath,
                success: function success(res) {
                    self.currentDownloadFileInfo.isUnzip = false;
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        state = false;
                        if (AF.util.isZipFile(filename)) {
                            loadPath = '';
                        } else {
                            loadPath = AF.util.getRemoteUrl(filename);
                        }
                        return;
                    }

                    if (!self.currentDownloadFileInfo.isNotSave) {
                        if (AF.util.isLocalFileExist(filename)) {
                            state = true;
                            loadPath = AF.util.getLocalFilePath(filename);
                            return;
                        }
                        state = false;
                        loadPath = AF.util.getRemoteUrl(filename);
                    } else if (AF.util.isZipFile(filename)) {
                        tempFilePath = res.tempFilePath;
                        self.currentDownloadFileInfo.isUnzip = true;
                    } else {
                        state = true;
                        loadPath = res.tempFilePath;
                    }
                },
                fail: function fail(err) {
                    state = false;

                    if (AF.util.isZipFile(filename)) {
                        loadPath = '';
                    } else {
                        loadPath = AF.util.getRemoteUrl(filename);
                    }
                },
                complete: function complete() {

                    var isUnzip = self.currentDownloadFileInfo.isUnzip;
                    console.log('wx.downloadFile complet: ' + filename + ' ,isUnzip:' + isUnzip + ' ,state:' + state);

                    if (isUnzip) {
                        var fs = wx.getFileSystemManager();
                        fs.unzip({
                            zipFilePath: tempFilePath,
                            targetPath: AF.util.getLocalFilePath(AF.util.getFilePath(filename)),
                            success: function success(res) {
                                loadPath = AF.util.getLocalFilePath(AF.util.getZipFilename(filename));
                                state = true;
                            },
                            fail: function fail(res) {
                                state = false;
                                loadPath = '';
                            },
                            complete: function complete() {
                                console.log('fs.unzip complete: ' + filename + ' ,state:' + state);
                                AF.EventDispatcher.emit(AF.Event.FILE_DOWNLOAD, filename, loadPath, state);
                                self.currentDownloadFileInfo = null;
                                self.processDownloadFile();
                            }
                        });
                        return;
                    }
                    AF.EventDispatcher.emit(AF.Event.FILE_DOWNLOAD, filename, loadPath, state);
                    self.currentDownloadFileInfo = null;
                    self.processDownloadFile();
                }
            });
        } else if (AF.platform.isQQApp()) {
            BK.Http.request({
                url: AF.util.getRemoteUrl(filename),
                method: 'GET',
                headers: {
                    'Referer': 'https://hudong.qq.com',
                    'User-Agent': 'brick-client',
                    'Content-Type': 'application/octet-stream'
                },
                body: '',
                success: function success(res) {
                    console.log('statusCode', res.statusCode);
                    console.log('headers', JSON.stringify(res.headers));

                    self.currentDownloadFileInfo.isUnzip = false;
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        state = false;
                        if (AF.util.isZipFile(filename)) {
                            loadPath = '';
                        } else {
                            loadPath = AF.util.getRemoteUrl(filename);
                        }
                        return;
                    }

                    //尝试保存临时文件

                    if (!self.currentDownloadFileInfo.isNotSave) {
                        BK.fileSystem.writeFileSync(AF.util.getLocalFilePath(filename), res.arrayBuffer());

                        //尝试存一次
                        if (AF.util.isLocalFileExist(filename)) {
                            state = true;
                            loadPath = AF.util.getLocalFilePath(filename);
                            return;
                        }
                        state = false;
                        loadPath = AF.util.getRemoteUrl(filename);
                    } else if (AF.util.isZipFile(filename)) {
                        //尝试存储临时随机文件名zip
                        var localTempFilePath = "temp/" + filename;
                        BK.fileSystem.writeFileSync(AF.util.getLocalFilePath2(localTempFilePath), res.arrayBuffer());

                        if (AF.util.isLocalFileExist2(localTempFilePath)) {
                            tempFilePath = AF.util.getLocalFilePath2(localTempFilePath);
                            self.currentDownloadFileInfo.isUnzip = true;
                        } else {
                            state = false;
                            loadPath = '';
                        }
                    } else {

                        console.log("成功6");
                        //尝试保存

                        if (filePath) {
                            console.log("成功7");
                            BK.fileSystem.writeFileSync(AF.util.getLocalFilePath(filename), res.arrayBuffer());
                            state = true;
                            loadPath = AF.util.getLocalFilePath(filename);
                        } else {
                            console.log("成功8");
                            //保存成临时文件
                            state = true;
                            loadPath = AF.util.getLocalFilePath2("temp/temp_" + filename);
                            BK.fileSystem.writeFileSync(loadPath, res.arrayBuffer());
                        }

                        console.log("成功9");
                    }
                },
                fail: function fail(errObj) {

                    console.log("下载失败");

                    state = false;

                    if (AF.util.isZipFile(filename)) {
                        loadPath = '';
                    } else {
                        loadPath = AF.util.getRemoteUrl(filename);
                    }
                },
                complete: function complete() {
                    var isUnzip = self.currentDownloadFileInfo.isUnzip;
                    console.log('qq.downloadFile complet: ' + filename + ' ,isUnzip:' + isUnzip + ' ,state:' + state);

                    if (isUnzip) {
                        BK.fileSystem.unzipSync(tempFilePath, AF.util.getLocalFilePath(AF.util.getFilePath(filename)));

                        loadPath = AF.util.getLocalFilePath(AF.util.getZipFilename(filename));
                        state = true;
                    }

                    AF.EventDispatcher.emit(AF.Event.FILE_DOWNLOAD, filename, loadPath, state);
                    self.currentDownloadFileInfo = null;
                    self.processDownloadFile();
                }
            });

            /*
            wx.downloadFile({
                url: AF.util.getRemoteUrl(filename),
                header: {},
                filePath: filePath,
                success: function (res) {
                    self.currentDownloadFileInfo.isUnzip = false;
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        state = false;
                        if (AF.util.isZipFile(filename)) {
                            loadPath = '';
                        } else {
                            loadPath = AF.util.getRemoteUrl(filename);
                        }
                        return;
                    }
                          if (!self.currentDownloadFileInfo.isNotSave) {
                        if (AF.util.isLocalFileExist(filename)) {
                            state = true;
                            loadPath = AF.util.getLocalFilePath(filename);
                            return;
                        }
                        state = false;
                        loadPath = AF.util.getRemoteUrl(filename);
                    } else if (AF.util.isZipFile(filename)) {
                        tempFilePath = res.tempFilePath;
                        self.currentDownloadFileInfo.isUnzip = true;
                    } else {
                        state = true;
                        loadPath = res.tempFilePath;
                    }
                },
                fail: function (err) {
                    state = false;
                          if (AF.util.isZipFile(filename)) {
                        loadPath = '';
                        state = false;
                    }
                    loadPath = AF.util.getRemoteUrl(filename);
                },
                complete: function () {
                    
                    var isUnzip = self.currentDownloadFileInfo.isUnzip;
                    console.log('wx.downloadFile complet: ' + filename + ' ,isUnzip:' + isUnzip + ' ,state:' + state);
                          if (isUnzip) {
                        var fs = wx.getFileSystemManager();
                        fs.unzip({
                            zipFilePath: tempFilePath,
                            targetPath: AF.util.getLocalFilePath(AF.util.getFilePath(filename)),
                            success: function (res) {
                                loadPath = AF.util.getLocalFilePath(AF.util.getZipFilename(filename));
                                state = true;
                            },
                            fail: function (res) {
                                state = false;
                                loadPath = '';
                            },
                            complete: function () {
                                console.log('fs.unzip complete: ' + filename + ' ,state:' + state);
                                AF.EventDispatcher.emit(AF.Event.FILE_DOWNLOAD, filename, loadPath, state);
                                self.currentDownloadFileInfo = null;
                                self.processDownloadFile();
                            }
                        });
                        return;
                    }
                    AF.EventDispatcher.emit(AF.Event.FILE_DOWNLOAD, filename, loadPath, state);
                    self.currentDownloadFileInfo = null;
                    self.processDownloadFile();
                }
            });
            */
        }
    }

};

Downloader.init();

AF.Downloader = module.exports = Downloader;

cc._RF.pop();