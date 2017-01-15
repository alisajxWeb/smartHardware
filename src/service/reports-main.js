/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.queryUseraccessList = function queryUseraccessList(url) {
        return ajax.get('/proxyLocal' + url);  
    };

    exports.queryFeedbackList = function queryFeedbackList(url) {
        return ajax.get('/proxyLocal' + url);
    };

    exports.queryFlowList = function queryFlowList(url) {
        return ajax.get('/proxyLocal' + url);
    };

    exports.queryApiList = function queryApiList(url) {
        return ajax.get('/proxyLocal' + url);
    };

    exports.queryFeedbackUV = function queryFeedbackUV(beginTime, endTime) {
        return ajax.get('/proxyLocal/reports/feedbackUser?beginTime=' + encodeURIComponent(beginTime) + '&endTime=' + encodeURIComponent(endTime));
    };
});