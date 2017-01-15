/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    function formatParams(params) {
        if (params && params.api) {
            var now = new Date().getTime();
            params.ts = now; 
        }
    }

    function getHeader(params) {        
        if (params && params.api && params.ts) {
            return {
                token: md5('omg' + params.ts + 'api')
            };
        }
    }

    exports.queryAllTask = function queryAllTask(params) {
        formatParams(params);
        return ajax.post('/catchdataProxy/catch/log/query_all_task', params, {headers: getHeader(params)});  
    };

    exports.queryWifiLog = function queryWifiLog(params) {
        formatParams(params);
        return ajax.post('/catchdataProxy/catch/log/wifi/query_log', params, {headers: getHeader(params)})  
    };

    exports.deleteTask = function deleteTask(params) {
        formatParams(params);
        return ajax.post('/catchdataProxy/catch/log/delete_task', params, {headers: getHeader(params)});  
    };

    exports.createTask = function createTask(params) {
        formatParams(params);
        return ajax.post('/catchdataProxy/catch/log/create_task', params, {headers: getHeader(params)});  
    };
});