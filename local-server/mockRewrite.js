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
            rule: /^\/proxy\/gs\/billPreOrder\/passengerPhone\/(\d+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/gs\/driverListen\/phone\/(\d+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/gs\/orderPrice\/(\d+)\/(\d+)\/(\d+)$/,
            proxy: function rewrite(req, area, id, type) {
                var url = req.url;
                url = url.replace('/' + area, '').replace('/' + id, '').replace('/' + type, '');
                url = mergeUrl(url);
                url =  url + 'area=' + area + '&id=' + id + '&type=' + type;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/gs\/beginBill\/orderId\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/gs\/beginBill\/passengerPhone\/([^/]+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/gs\/endBill\/orderId\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/gs\/payBill\/orderId\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/gs\/sceneTrip\/tripId\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/holmesProxy\/holmes\/api\/v1\/traces\/order\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'order=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/btb\/scene\/phone\/(\d+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/beatles\/sceneQuery\/orderId\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/common\/passport\/phone\/(\d+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/taxi\/orderId\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/taxi\/driverId\/(\d+)$/,
            proxy: function rewrite(req, driverId) {
                var url = req.url;
                url = url.replace('/' + driverId, '');
                url = mergeUrl(url);
                url =  url + 'driverId=' + driverId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/taxi\/orderId\/(\d+)\/driverId\/(\d+)$/,
            proxy: function rewrite(req, orderId, driverId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId + '&driverId=' + driverId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/taxi\/scene\/orderId\/([^/]+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/pay\/cashier\/phone\/(\d+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
        {
            rule: /^\/proxyLocal\/sysmgr\/getUser\/([^/]+)$/,
            proxy: function rewrite(req, user) {
                var url = req.url;
                url = url.replace('/' + user, '');
                url = mergeUrl(url);
                url =  url + 'user=' + user;
                req.url = url;
            }
        },
         {
            rule: /^\/proxy\/gs\/oldPangu\/orderId\/([^/]+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
         {
            rule: /^\/proxy\/gs\/sceneRecovery\/passengerPhone\/(\d+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
         {
            rule: /^\/proxy\/gs\/award\/orderId\/(\d+)$/,
            proxy: function rewrite(req, orderId) {
                var url = req.url;
                url = url.replace('/' + orderId, '');
                url = mergeUrl(url);
                url =  url + 'orderId=' + orderId;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/btb\/rule\/phone\/(\d+)$/,
            proxy: function rewrite(req, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone;
                req.url = url;
            }
        },
        {
            rule: /^\/proxy\/ddc\/card\/(\d+)\/(\d+)$/,
            proxy: function rewrite(req, productId, phone) {
                var url = req.url;
                url = url.replace('/' + phone, '');
                url = url.replace('/' + productId, '');
                url = mergeUrl(url);
                url =  url + 'phone=' + phone + '&productId=' + productId;
                req.url = url;
            }
        },
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