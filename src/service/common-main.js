/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');
    var city = require('service/city');
    var deffered = $.Deferred();

    exports.feedbackSave = function feedbackSave(params) {
        return ajax.get('/proxyLocal/feedback/save/' + params.resolve + '?module=' + encodeURIComponent(params.module));
    };

    exports.getCityInfos = function getCityInfos(params) {
        deffered.resolve(city);
        return deffered.promise();
    };

    exports.query = function query(url, options) {
        options = options || { holder: $('body') };
        return ajax.get(url, undefined, options);
    };

});