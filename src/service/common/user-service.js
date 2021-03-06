/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    /**
     * 获取某个模块数据
     * @param {Object} params
     */
    exports.getUserData = function (params, options) {
        return ajax.get('/proxyLocal/userInfo', params, options);
    };

    exports.logout = function logout(options) {
        // return ajax.get('/proxyLocal/logout');
        var url = '/uss/logout';
        return $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
            scriptCharset: 'UTF-8',
            success: options.success,
            error: options.success
        });
    };


    exports.addFavourite = function (queryUrl, params) {

        var url = (queryUrl.indexOf('?') === -1) ? (queryUrl + '?') : (queryUrl + '&');

        url = window.rootBase + url;
        
        return $.get(url + 'autoSaveName=' + encodeURIComponent(params.autoSaveName) + '&autoSaveUrl=' + encodeURIComponent(params.autoSaveUrl));
    };
});