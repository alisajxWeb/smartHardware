/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.getLogList = function queryUseraccessList(params) {
        
        var url = '/proxy/pay/cashier/{type}/{id}?beginTime={beginTime}&endTime={endTime}';
        url = url.replace(/\{([^}]*)\}/g, function (all, key) {
            return ((key === 'param' && params[key]) ? encodeURIComponent(JSON.stringify(params[key])) : encodeURIComponent(params[key] || ''));
        });
        return ajax.get(url);  
    };
});