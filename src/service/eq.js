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

    exports.getOrderList = function queryUseraccessList(params) {
        
        var url = '/proxy/beatles/query?beginTime={beginTime}&endTime={endTime}&param={param}';
        url = fillParams(url, params);
        return ajax.get(url);  
    };

    exports.getOrderGrids = function getOrderGrids(params) {
        var url = '/proxy/beatles/sceneQuery/orderId/{orderId}?beginTime={beginTime}&endTime={endTime}';
        url = fillParams(url, params);
        return ajax.get(url);
    };
});