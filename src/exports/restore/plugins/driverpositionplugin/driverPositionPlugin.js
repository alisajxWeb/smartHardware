define(function (require) {

    var pointLimit = 500;
    
    var DriverPositionPlugin = require('exports/dep/ui').create({
        init: function init(options) {
            this.views = {};
            this.points = {};
            
        },

        bindEvent: function bindEvent() {
            
        },

        drawAsMark: function drawAsMark(data) {
            var views = [];
            var points = [];
            if (data.key && data.dataSource && data.dataSource.length) {
                var mapInstance = this.mapData.mapInstance;    
                var domain = this.domain;

                for (var i = 0, len = data.dataSource.length; i < len; i++) {
                    var item = data.dataSource[i];
                    var marker = new qq.maps.Marker({
                        position: new qq.maps.LatLng(item.lat, item.lng),
                        icon: [
                            domain,
                            '/img/map/driver',
                            '-' + data.color.slice(1) + '.png'
                        ].join(''),
                        visible: true,
                        map: mapInstance
                    });
                    views.push(marker);
                }
                this.points[data.key] = points
                this.views[data.key] = views;
            } else if (data.key){
                this.points[data.key] = points;
                this.views[data.key] = views;
            }
        },

        render: function render(data) {
            if (this.views[data.orderId]) {
                return this.show(data.orderId);
            }
            this.drawAsMark(data);
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

    DriverPositionPlugin.defaultOptions = {
        name: 'DriverPositionPlugin',
        text: '司机位置',
        domain: ''
    };


    return DriverPositionPlugin;
});