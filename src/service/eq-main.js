/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    function fillParams(url, params) {
        url = url.replace(/\{([^}]*)\}/g, function (all, key) {
            return ((key === 'param' && params[key]) ? encodeURIComponent(JSON.stringify(params[key])) : encodeURIComponent(params[key] || ''));
        });
        return url;
    }
    exports.getStatus = function getStatus(options) {
        var url = '/eq/getEquip?equipId={equipId}';
        url = fillParams(url, options.params);
        return $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
            jsonp:"callback",
            jsonpCallback: "jsonpCallback",
            scriptCharset: 'UTF-8',
            success: options.success,
            error: options.success
        });
    };

    exports.setStatus = function setStatus(options) {
        var url = '/eq/setEquip?equipId={equipId}';
        url = fillParams(url, options.params);
        return $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
            jsonp:"callback",
            jsonpCallback: "jsonpCallback",
            scriptCharset: 'UTF-8',
            success: options.success,
            error: options.success
        });
    };

    exports.timeOut = function timeOut(options) {
        var url = '/eq/timeout?equipId={equipId}&timeoutTime={timeoutTime}&timeoutStatus={timeoutStatus}';
        url = fillParams(url, options.params);
        return $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
            jsonp:"callback",
            jsonpCallback: "jsonpCallback",
            scriptCharset: 'UTF-8',
            success: options.success,
            error: options.success
        });
    };
});