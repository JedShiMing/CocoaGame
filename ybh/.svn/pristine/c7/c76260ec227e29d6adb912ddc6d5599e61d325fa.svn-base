/**
 * App启动器
 */

var ua, isAndroid, isChrome;

if (!cc.sys.isNative) {
    ua = navigator.userAgent;
    var win = window;
    isChrome  = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
    isAndroid = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
}

var AppLauncher = {};

AppLauncher.Const = {
    LAUNCHE_TIMEOUT: 500,   // 跳转超时
};

var loadIframe;
function getIntentIframe() {
    if(!loadIframe){
        var iframe = document.createElement("iframe");
        iframe.style.cssText = "display:none;width:0px;height:0px;";
        document.body.appendChild(iframe);
        loadIframe = iframe;
    }
    return loadIframe;
}

function getChromeIntent(appInfo) {
    var scheme = isAndroid ? appInfo.AndroidSchemeURL : appInfo.iOSSchemeURL;
    // 此处域名产品修改
    return  "intent://t.qq.com/#Intent;scheme=" + scheme + ";package=" + appInfo.AndroidPackageName + ";end";
}

function openApp(appInfo) {
    var scheme = isAndroid ? appInfo.AndroidSchemeURL : appInfo.iOSSchemeURL;
    if(!isChrome) {
        if(isAndroid){
            win.location.href = getChromeIntent(appInfo);
        }else{
            win.location.href = scheme;
        }
    } else {
        getIntentIframe().src = scheme;
    }
}

/**
 * iOS 6.0以上用这种方式跳转appstore
 * <meta name="apple-itunes-app" content="app-id=432274380">
 */
function redirectToDownloadUrl(appInfo){
    win.location.href = isAndroid ? appInfo.AndroidDownloadURL : appInfo.iOSDownloadURL;
}


/**
 * 打开应用失败则跳转到应用下载页面
 * @param appInfo
 *
 * appInfo字段说明:
 *  - AndroidPackageName   安卓包名
 *  - AndroidSchemeURL     安卓scheme链接
 *  - AndroidDownloadURL   安卓下载页面
 *  - iOSSchemeURL         iOS scheme链接
 *  - iOSDownloadURL       iOS下载链接
 */
AppLauncher.open = function(appInfo){
    var t = Date.now();
    openApp(appInfo);
    setTimeout(function(){
        if(Date.now() - t < AppLauncher.Const.LAUNCHE_TIMEOUT + 100){
            redirectToDownloadUrl(appInfo);
        }
    }, this.timeout)
};

module.exports = (window.AF = window.AF || {}).AppLauncher = AppLauncher;


