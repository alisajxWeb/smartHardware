define(function (require) {

    var pointLimit = 500;
    
    var PassengerPositionPlugin = require('exports/dep/ui').create({
        init: function init(options) {
            this.views = {};
            this.points = {};
            
        },

        bindEvent: function bindEvent() {
            
        },

        drawAsMark: function drawAsMark(data) {
            var views = [];
            var points = [];
            if (data.key && data.dataSource && data.dataSource.list && data.dataSource.list.length) {
                var mapInstance = this.mapData.mapInstance;
                var list = data.dataSource.list;
                var domain = this.domain;

                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    var marker = new qq.maps.Marker({
                        position: new qq.maps.LatLng(item.lat, item.lng),
                        icon: [
                            domain,
                            '/img/map/personal',
                            '-' + data.color.slice(1) + '.png'
                        ].join(''),
                        visible: true,
                        map: mapInstance
                    });
                    views.push(marker);
                }
    
                this.points[data.key] = points;
                this.views[data.key] = views;
            } else if (data.key){
                this.points[data.key] = points;
                this.views[data.key] = views;
            }
        },

        drawStartEnd: function drawStartEnd(data) {
            if (data.key && data.dataSource && data.dataSource.order){
                var orderInfo = data.dataSource.order;
                var mapInstance = this.mapData.mapInstance;
                var domain = this.domain;
                var markCall = function (lat, lng, eventType, address) {
                    var marker = new qq.maps.Marker({
                        position: new qq.maps.LatLng(lat, lng),
                        icon: [
                            domain,
                            '/img/map/personal-',
                            data.color.slice(1) + '-',
                            eventType + '.png'
                        ].join(''),
                        visible: true,
                        map: mapInstance
                    });
                    return marker;
                };

                if (orderInfo.flat && orderInfo.flng) {
                    this.views[data.key].push(markCall(orderInfo.flat, orderInfo.flng, 'start', orderInfo.fromName + '-' + orderInfo.fromAddress));
                }

                if (orderInfo.tlat && orderInfo.tlng) {
                    this.views[data.key].push(markCall(orderInfo.tlat, orderInfo.tlng, 'dest', orderInfo.toName + '-' + orderInfo.toAddress));
                }
            }
        },

        render: function render(data) {
            if (this.views[data.orderId]) {
                return this.show(data.orderId);
            }
            this.drawAsMark(data);
            this.drawStartEnd(data);
        },
        
        show: function show(key) {
            var views = this.views;
            if (key) {
                views = views[key];
                views && views.forEach(function (item) {
                    item.setVisible(true);
                });
            } else {
                for (var key in views) {
                    views[key].forEach(function (item) {
                        item.setVisible(true);
                    });
                }
            }
        },

        hide: function hide(key) {
            var views = this.views;
            if (key) {
                views = views[key];
                views && views.forEach(function (item) {
                    item.setVisible(false);
                });
            } else {
                for (var key in views) {
                    views[key].forEach(function (item) {
                        item.setVisible(false);
                    });
                }
            }
        },
        
        dispose: function dispose(key) {
            var views;
            if (key) {
                views = this.views[key];
                views.forEach(function (item){
                    item.setMap(null);
                }); 
                delete this.views[key];
                delete this.points[key];
            } else {
                views = this.views;
                for (var key in views) {
                    views[key] && views[key].forEach(function (item) {
                        item.setMap(null);
                    });
                }
                this.views = {};
                this.points = {};
            }
            
        },

        getDataSource: function getDataSource(params) {
            
        }
    });

    PassengerPositionPlugin.defaultOptions = {
        name: 'PassengerPositionPlugin',
        text: '乘客位置',
        domain: ''
    };


    return PassengerPositionPlugin;
});