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

    exports.getInfo = function getInfo(params) {
        var url = '/proxy/ddc/{keyType}/{productId}/{keyValue}';
        url = fillParams(url, params);
        return {
            promise: ajax.get(url),
            url: url
        };
    };
    
});