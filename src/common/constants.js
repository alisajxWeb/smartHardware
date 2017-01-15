define(function (require, exports) {

    exports.needAuthUrls = [
        {
            url: '/ddc/main',
            name: '公共',
            key: 'public'
        },
        {
            url: '/catchdata/',
            name: '日志抓取',
            key: 'catchdata'
        },
        {
            url: '/reports/',
            name: '报表统计',
            key: 'reports'
        }
    ];
});