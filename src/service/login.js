/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    function fillParams(url, params) {
        var hostName = 'http://api.alisablog.cn';
        url = url.replace(/\{([^}]*)\}/g, function (all, key) {
            return ((key === 'param' && params[key]) ? encodeURIComponent(JSON.stringify(params[key])) : encodeURIComponent(params[key] || ''));
        });
        return hostName + url;
    }
    exports.userLogin = function userLogin(options) {
        var url = '/uss/login?userName={userName}&password={password}';
        url = fillParams(url, options.params);
        return $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
            scriptCharset: 'UTF-8',
            success: options.success,
            error: options.success
        });
    };
    exports.getUserEquips = function getUserEquips(options) {
        var url = '/eq/getUserEquips';
        return $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
            scriptCharset: 'UTF-8',
            success: options.success,
            error: options.success
        });
    };
});
