(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/framework/network/af-http.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ae7c6JrGrpK87Anlr9kDecw', 'af-http', __filename);
// framework/network/af-http.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * http
 */

var http = {};

function encodeParams(obj) {
    if (!obj) return '';
    var str = '';
    for (var k in obj) {
        if (obj.hasOwnProperty(k) && obj[k] !== undefined && obj[k] !== null) {
            str.length && (str += '&');
            str += encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        }
    }
    return str;
}

function parseResponse(resp) {
    try {
        resp = JSON.parse(resp);
    } catch (e) {}
    return resp;
}

function isValidParam(obj) {
    if (obj) {
        for (var k in obj) {
            return true;
        }
    }
    return false;
}

// post请求
// 格式化post 传递的数据
function postDataFormat(obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) != "object") {
        return obj;
    }
    // 支持有FormData的浏览器（Firefox 4+ , Safari 5+, Chrome和Android 3+版的Webkit）
    if (typeof FormData == "function") {
        var data = new FormData();
        for (var attr in obj) {
            data.append(attr, obj[attr]);
        }
        return data;
    } else {
        // 不支持FormData的浏览器的处理
        var arr = [];
        for (var attr in obj) {
            var v = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
            //var v = '' + attr + "=" + obj[attr];
            arr.push(v);
        }
        return arr.join("&");
    }
}

function getHttpStateHandle(xhr, cb) {
    return function () {
        if (xhr.readyState == 4) {
            var responseText = xhr.responseText;
            if (xhr.status >= 200 && xhr.status < 300 && responseText) {
                cb && cb(null, parseResponse(responseText), xhr.status);
            } else if (xhr.status == 404 || !responseText) {
                cb && cb(true, parseResponse(responseText), xhr.status);
            } else {
                cb && cb(true, parseResponse(responseText), xhr.status);
            }
        }
    };
}

function getFileHttpStateHandle(xhr, cb) {
    return function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("HHHHH");
                //cb && cb(null, xhr.response);
            } else if (xhr.status == 404) {
                cb && cb(true /*, responseText ? parseResponse(responseText) : undefined*/);
            } else {
                cb && cb(true);
            }
        }
    };
}

http.get = function (url, params, cb, timeOut) {
    function callback(err, result, statusCode) {
        handle && clearTimeout(handle);
        handle = null;

        cb && cb(err, result, statusCode);
        cb = null;
    }

    timeOut = timeOut || 6000;
    var handle = setTimeout(function () {
        handle = null;
        xhr.abort();
        callback(true);
    }, timeOut);

    url = url + '?' + encodeParams(params);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = getHttpStateHandle(xhr, callback);
    xhr.timeout = timeOut - 100;
    xhr.ontimeout = function (e) {
        cc.log("request timeout:", url);
        callback(true);
    };

    //cc.log("get -> [" + url + "]");
    xhr.open("GET", url, true);
    xhr.send();
};

http.getFile = function (url, params, cb, timeOut) {
    function callback(err, result) {
        handle && clearTimeout(handle);
        handle = null;

        cb && cb(err, result);
        cb = null;
    }

    timeOut = timeOut || 6000;
    var handle = setTimeout(function () {
        handle = null;
        xhr.abort();
        callback(true);
    }, timeOut);

    url = url + '?' + encodeParams(params);
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onreadystatechange = getFileHttpStateHandle(xhr, callback);
    xhr.timeout = timeOut - 100;
    xhr.ontimeout = function (e) {
        cc.log("request timeout:", url);
        callback(true);
    };

    //cc.log("get -> [" + url + "]");
    xhr.open("GET", url, true);
    xhr.send();
};

http.post = function (url, params, body, cb, timeOut) {
    function callback(err, result, statusCode) {
        handle && clearTimeout(handle);
        handle = null;

        cb && cb(err, result, statusCode);
        cb = null;
    }

    timeOut = timeOut || 6000;
    var handle = setTimeout(function () {
        handle = null;
        xhr.abort();
        callback(true);
    }, timeOut);

    isValidParam(params) && (url = url + '?' + encodeParams(params));
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = getHttpStateHandle(xhr, callback);
    xhr.timeout = timeOut - 100;
    xhr.ontimeout = function (e) {
        cc.log("request timeout:", url);
        callback(true);
    };
    xhr.open("POST", url, true);
    var data = JSON.stringify(body);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
    //cc.log("http post:", url, JSON.stringify(body), data);
};

module.exports = (window.AF = window.AF || {}).http = http;

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
        //# sourceMappingURL=af-http.js.map
        