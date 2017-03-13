define(function (require, exports) {
    
    var ajax = require('service/ajax');

    function fillParams(url, params) {
        url = url.replace(/\{([^}]*)\}/g, function (all, key) {
            return ((key === 'param' && params[key]) ? encodeURIComponent(JSON.stringify(params[key])) : encodeURIComponent(params[key] || ''));
        });
        url = url.replace(/\w+\/\//g, '');
        url = url.replace(/\/\w+\/(?=\?)/g, '');
        return url;
    }

    exports.getListenLogs = function getListenLogs(params) {
        var url = '/proxy/taxi/stg/orderId/{orderId}/driverId/{driverId}?beginTime={beginTime}&endTime={endTime}';
        url = fillParams(url, params);
        return ajax.get(url);
    };

    exports.getSceneLogList = function getSceneLogList(params){
        var url = '/proxy/taxi/scene/{taxiSceneQueryType}/{taxiSceneQueryInfo}?beginTime={beginTime}&endTime={endTime}';
        url = fillParams(url,params);
         return ajax.get(url);
    }

});