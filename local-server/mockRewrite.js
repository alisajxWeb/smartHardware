var URL = require('url');
module.exports = function (req, res, next) {
    var mergeUrl = function (url) {
        if (url.indexOf('?') === -1) {
            url = url + '?';
        }
        if (url.indexOf('&') !== -1) {
            url = url + '&';
        }
        return url;
    }
    var rules = [
        {
            rule: /^\/eq\/getEquip\/(\d+)$/,
            proxy: function rewrite(req, equipId) {
                var url = req.url;
                url = url.replace('/' + equipId, '');
                url = mergeUrl(url);
                url =  url + 'equipId=' + equipId;
                req.url = url;
            }
        },
        {
            rule: /^\/eq\/setEquip\/(\d+)$/,
            proxy: function rewrite(req, equipId) {
                var url = req.url;
                url = url.replace('/' + equipId, '');
                url = mergeUrl(url);
                url =  url + 'equipId=' + equipId;
                req.url = url;
            }
        },
        {
            rule: /^\/eq\/timeout\/(\d+)\/(\d+)\/(\d+)$/,
            proxy: function rewrite(req, equipId, timeoutTime, timeoutStatus) {
                var url = req.url;
                url = url.replace('/' + equipId, '').replace('/' + timeoutTime, '').replace('/' + timeoutStatus, '');
                url = mergeUrl(url);
                url =  url + 'equipId=' + equipId + '&timeoutTime=' + timeoutTime + '&timeoutStatus=' + timeoutStatus;
                req.url = url;
            }
        }
    ];

    var query = URL.parse(req.headers.referer || '', true).query;
    if (rules && rules.length > 0 && (!query || !query.proxy)) {
        var url = URL.parse(req.url, true).pathname;
        var ruleObj, matches;
        for (var i = 0, len = rules.length; i < len; i++) {
            ruleObj = rules[i];
            matches = url.match(ruleObj.rule);
            if (matches) {
                var tmp = matches.slice(1);
                tmp.unshift(req);
                ruleObj.proxy.apply(null, tmp)
            }
        }
        next();
    } else {
        next();
    }
};