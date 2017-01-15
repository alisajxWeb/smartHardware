define(function (require) {

    var pointLimit = 500;
    
    var PassengerLinePlugin = require('exports/dep/ui').create({
        init: function init(options) {
            this.views = {};
            this.points = {};
            
        },

        bindEvent: function bindEvent() {
            
        },

        drawAsLine: function drawAsLine(data) {
            if (data.key && data.dataSource && data.dataSource.length) {
                var mapInstance = this.mapData.mapInstance;
                var views = [];
                var path = [];
                for (var i = 0, len = data.dataSource.length; i < len; i++) {
                    var point = data.dataSource[i];
                    path.push(new qq.maps.LatLng(point.lat, point.lng));
                }
                var polyline = new qq.maps.Polyline({
                    path: path,
                    strokeColor: data.color,
                    strokeWeight: 5,
                    map: mapInstance,
                    visible: true,
                });
                views.push(polyline);
                mapInstance.setCenter(path[0]);
                this.views[data.key] = views;
            }
        },

        drawAsPoints: function drawAsPoints(data) {
            if (data.key && data.dataSource && data.dataSource.length) {
                var mapInstance = this.mapData.mapInstance;
                var views = [];
                for (var i = 0, l = data.dataSource.length; i < l; i++) {
                    var point = data.dataSource[i];
                    views.push(new qq.maps.Circle({
                        center: new qq.maps.LatLng(point.lat, point.lng),
                        radius: 8,
                        fillColor: data.color,
                        strokeWeight: 2,
                        strokeColor: data.color,
                        zIndex: 100,
                        map: mapInstance,
                        visible: true
                    }));
                }
                mapInstance.setCenter(views[0].getCenter());
                this.views[data.key] = views;
            }
        },

        render: function render(data) {
            var points = data.dataSource;
            if (this.views[data.orderId]) {
                return this.show(data.orderId);
            }
            if (points && points.length >= pointLimit) {
                this.drawAsLine(data);
            } else {
                this.drawAsPoints(data);
            }
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

    PassengerLinePlugin.defaultOptions = {
        name: 'PassengerLinePlugin',
        text: '乘客轨迹'
    };


    return PassengerLinePlugin;
});