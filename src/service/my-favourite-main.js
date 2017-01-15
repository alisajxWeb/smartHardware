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

    exports.getList = function getList() {
        var url = '/proxy/datastore/list?t=' + (new Date().getTime());
        return ajax.get(url);
    };
});