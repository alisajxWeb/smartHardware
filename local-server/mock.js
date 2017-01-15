/**
 * @file 本地开发时的mock请求拦截处理
 * @author zhangshaolong
 */

'use strict';

var queryString = require('querystring');

var URL = require('url');

var http = require('http');

var request = require('./request');

var formDataReg = /multipart\/form-data/;

var config = require('./config');

var proxyInfo;

module.exports = function (req, res, next) {

    var reqUrl = req.url;

    var apiType = config.api.type;
    var apiValue = config.api.value;
    if (typeof apiValue === 'string') {
        apiValue = [apiValue];
    }
    var len = apiValue.length;
    if (apiType === 'prefix') {
        for (var i = 0; i < len; i++) {
            apiValue[i] = config.rootBase + apiValue[i];
        }
    }
    var isApi = false;
    if (apiType === 'prefix') {
        for (var i = 0; i < len; i++) {
            if (!isApi) {
                isApi = reqUrl.indexOf(apiValue[i]) === 0;
            }
        }
    } else if (apiType === 'suffix') {
        var sufValue = reqUrl.split('?')[0];
        for (var i = 0; i < len; i++) {
            if (!isApi) {
                isApi = isApi = sufValue.endsWith(apiValue[i]);
            }
        }
    }
    
    if (isApi) {
        var contentType = req.headers['content-type'] || 'text/plain;charset=UTF-8';
        res.writeHead(200, {'Content-Type': contentType});
        var headers = {};
        for (var key in req.headers) {
            headers[key] = req.headers[key];
        }

        var getProxyInfo = function () {
            var pageUrl = req.headers.referer;

            var query = URL.parse(pageUrl, true).query;

            if (query && query.proxy) {
                var pair = query.proxy.split(':');
                return {
                    host: pair[0],
                    port: pair[1] || 80
                }
            }
        };

        var doProxy = function (proxyInfo) {
            headers.host = proxyInfo.host + ':' + proxyInfo.port;
            delete headers['accept-encoding']; // 去掉压缩数据
            var options = {
                host: proxyInfo.host,
                port: proxyInfo.port,
                path: reqUrl.replace('/proxyLocal', ''), // 本地接口 特殊处理
                method: req.method,
                headers: headers
                // headers: {
                //   // 如果代理服务器需要认证
                //   'Proxy-Authentication': 'Base ' + new Buffer('user:password').toString('base64')    // 替换为代理服务器用户名和密码
                // }
            };

            var proxyReq = request(options, function(proxyRes) {
                proxyRes.pipe(res);
            });

            req.on('data', function (data) {
                proxyReq.write(data);
            });

            req.on('end', function () {
                proxyReq.end();
            });
        };

        if (!proxyInfo) {
            proxyInfo = getProxyInfo();
        }

        if (proxyInfo && reqUrl.indexOf()) {
            doProxy(proxyInfo);
            return ;
        }

        var doMock = function (params, pathName) {
            try {
                for (var i = 0; i < len; i++) {
                    pathName = pathName.replace(apiValue[i], '');
                }
                var path = require.resolve('../mock/' + pathName.replace(/^\//, '').replace(/\//g, '_'));
                delete require.cache[path];
                var result = require(path);
                if (typeof result === 'function') {
                    result = result(params);
                }
                if (!isNaN(result.sleep) && result.sleep > 0) {
                    setTimeout(function () {
                        delete result.sleep;
                        res.end(JSON.stringify(result));
                    }, result.sleep);
                } else {
                    if (typeof result !== 'string') {
                        result = JSON.stringify(result);
                    }
                    res.end(result);
                }
            } catch (e) {
                console.log(e);
                res.end(JSON.stringify({
                    status: 500
                }));
            }
        };
        var method = req.method.toUpperCase();
        var urlInfo = URL.parse(reqUrl, true);
        if (formDataReg.test(contentType)) {
            req.once('data', function(data) {
                doMock(queryString.parse(String(data, 'UTF-8')), urlInfo.pathname);
            });
            return;
        }
        var params = '';
        if (method === 'POST') {
            req.on('data', function (data) {
                params += data;
            });
            req.on('end', function () {
                if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                    params = queryString.parse(params || '{}');
                } else if (contentType.indexOf('application/json') > -1) {
                    params = JSON.parse(params || '{}');
                }
                for (var key in urlInfo.query) {
                    params[key] = urlInfo.query[key];
                }
                doMock(params, urlInfo.pathname);
            });
        } else if (method === 'GET') {
            params = urlInfo.query;
            doMock(params, urlInfo.pathname);
        }
    } else {
        return next();
    }
}