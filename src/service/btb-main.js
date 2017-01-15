define(function (require, exports) {
    
    var ajax = require('service/ajax');

    function fillParams(url, params) {
        url = url.replace(/\{([^}]*)\}/g, function (all, key) {
            return encodeURIComponent(params[key] || '');
        });
        url = url.replace(/\w+\/\//g, '');
        url = url.replace(/\/\w+\/(?=\?)/g, '');
        return url;
    }

    exports.getMainLogList = function getLogList(params) {
        var url = '/proxy/btb/scene/{keyType}/{keyValue}?beginTime={beginTime}&endTime={endTime}';
        url = fillParams(url, params);
        return {
            promise: ajax.get(url),
            url: url
        };
    };
    
    exports.getRuleListByPhone = function getRuleListByPhone(params) {
        var url = '/proxy/btb/rule/phone/{phone}';
        url = fillParams(url, params);
        return {
            promise: ajax.get(url),
            url: url
        };
    }
});