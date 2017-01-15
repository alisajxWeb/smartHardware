define(function (require, exports) {

    var store = require('common/store');
    var constants = require('common/constants');

    var pathMap = {};

    function hasAuth(url, urls) {
        return urls.filter(function (item) {
            return url.indexOf(item) != -1;
        })[0];
    }

    exports.init = function () {

        var moduleNode = this.element;

        var pathname = location.pathname;

        var search = location.search;

        var userInfo = store.get('userData');
        var urls = !userInfo.url ? [] : userInfo.url.split(',');
        var needAuthUrls = constants.needAuthUrls.map(function (item) {
            return item.url;
        });

        if (hasAuth(pathname, needAuthUrls) && !hasAuth(pathname, urls)) {
            window.location.href = '/noAuth';
        }

        moduleNode.find('a').each(function () {
            var href = $(this).attr('data-href');
            var pathArr = pathMap[href];
            var $this = $(this);
            if (hasAuth(href, urls)) {
                $(this).parent().show();
            }
            if (pathArr) {
                $.each(pathArr, function (idx, pname) {
                    if (pname === pathname) {
                        $this.parent().addClass('active');
                        return false;
                    }
                });
            } else {
                if (href === pathname) {
                    $this.parent().addClass('active');
                }
            }
            $this.attr('href', href);
        });

        moduleNode.on('click', '.toggle-nav-btn', function () {
            $('body').toggleClass('fold');
        })
    };
});