define(function (require, exports) {

    var store = require('common/store');
    var commonErrors = require('./commonErrors');

    function storeHrefAndApi(api) {
        if (api.indexOf('/proxyLocal') === -1 && api.indexOf('/catchdata') === -1 && api.indexOf('autoSaveUrl=') === -1 && api.indexOf('/datastore/list') === -1) {
            var url = window.location.pathname + window.location.search + window.location.hash;
            var api = api;
            store.set(api, url);
            store.set(url, api);
        }
    }
    

    /**
     * 发送 post 请求
     *
     * @inner
     * @param {string} url 请求 url
     * @param {Object} params 发送的数据
     * @param {Object=} options
     * @property {boolean} options.sync 是否是同步请求
     * * @property {boolean} options.method 请求的方式
     * @property {Object=} options.errorHandler 自定义 error 处理
     *
     * @return {Promise}
     */
    function ajax(url, params, options) {
        storeHrefAndApi(url);
        options = options || {};

        url = (url.indexOf('?') === -1) ? (url + '?') : (url + '&');

        url = url + 'autoSaveUrl=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
 
        return $.ajax({
            url: window.rootBase + url,
            data: (options.contentType && options.contentType.indexOf('x-www-form-urlencoded') !== -1) ? params : JSON.stringify(params),
            method: options.method || 'POST',
            type: 'POST',
            dataType: 'json',
            contentType: options.contentType || 'application/json;charset=UTF-8',
            async: options.sync ? false : true,
            timeout: 100000,
            headers: options.headers,
            beforeSend: options.beforeSend || function () {
                var time = new Date().getTime();
                options._time = time;
                options.holder && options.holder.append('<div class="data-loading data-loading-' + time + '">').addClass('data-loading-relative');
            }
        }).pipe(function (response) {
            options.holder && options.holder.removeClass('data-loading-relative').find('.data-loading-' + options._time).remove();
            if (response.status == 302) {
                window.location.href = response.url;
            } else if (response.status == 403) {
                window.location.href = '/noAuth'; 
            } else {
                var deferred = $.Deferred();
                if (commonErrors[response.status]) {
                    deferred.reject(response);
                } else {
                    deferred.resolve(response);
                }
                return deferred.promise();
            }
        }, function (response) {
            options.holder && options.holder.removeClass('data-loading-relative').find('.data-loading-' + options._time).remove();
            var deferred = $.Deferred();
            deferred.reject(response);
            return deferred.promise();
        });
    }

    /**
     * 发送跨域的 jsonp请求
     *
     * @param  {string} url
     * @param  {Object} params
     * @return {Promise}
     */
    exports.jsonp = function (url, params, timeout) {
        return $.ajax({
            url: url,
            data: JSON.stringify(params),
            dataType: 'jsonp',
            timeout: timeout,
            scriptCharset: 'UTF-8'
        }).pipe(function (response) {
            if (response.status === 200) {
                return response;
            } else {
                var deferred = $.Deferred();
                if (commonErrors[response.status]) {
                    deferred.reject(response);
                } else {
                    deferred.reject(response);
                }
                return deferred.promise();
            }
        });
    };

    exports.ajax = ajax;

    exports.get = function (url, params, options) {
        options = options || {};
        options.method = 'GET';
        options.holder = $('body');
        return ajax(url, params, options);
    };

    exports.post = function (url, params, options) {
        options = options || {};
        options.method = 'POST';
        options.holder = $('body');
        options.contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        return ajax(url, params, options);
    };
});