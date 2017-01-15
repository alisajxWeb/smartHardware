/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.query = function query(url) {
        return ajax.get('/proxyLocal' + url);
    };

});