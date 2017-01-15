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

    exports.getOrderGrids = function getOrderGrids(params) {
        var url = '/proxy/gs/sceneTrip/tripId/{tripId}?district={district}&isTrip={isTrip}&beginTime={beginTime}&endTime={endTime}';
        url = fillParams(url, params);
        return {
            promise: ajax.get(url),
            url: url
        };
    };

    exports.query = function query(params) {
        var url = '/proxy/gs/sceneRecovery/{sceneRecoveryType}/{sceneRecoveryQueryInfo}?beginTime={beginTime}&endTime={endTime}&sceneRecoveryType={sceneRecoveryType}';
        url = fillParams(url, params);
        return {
            promise: ajax.get(url),
            url: url
        };
    };
    
    exports.getNewAward = function getNewAward(url, options) {
        options = options || { holder: $('body') };
        return ajax.get(url, undefined, options);
    };

});