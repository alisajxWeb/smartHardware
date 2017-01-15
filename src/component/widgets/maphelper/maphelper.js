define(function(require, exports) {

    var loadQQMap = require('common/loadMap');

    require('css!./maphelper.less');
    require('tpl!./maphelper.tpl');

     var MapHelper = require('../../ui').create({
        init: function init(options) {
            options = options || {};
            this.element = $(Simplite.render('maphelper-template'));
            this.points = [];
            this.uuid = 0;
            $(this.container || 'body').append(this.element);
            this.initMap();
        },
        bindEvent: function () {
            var me = this;
            var actions = me.actions;
            me.element
                .on('click', actions.toggleFullscreenBtn, function () {
                    me.element.removeClass('small-screen').toggleClass('full-screen');
                })

                .on('click', actions.clearAllBtn, function () {
                    var pointListWrap = me.element.find('.map-controls .points-container');
                    pointListWrap.html('');
                    me.removePoints();
                })

                .on('click', actions.removePointBtn, function () {
                    var pointItem = $(this).closest('.point-item');
                    var uuid = pointItem.data('uuid');
                    pointItem.remove();
                    me.removePoints({uuid: uuid});
                    return false;
                })

                .on('click', actions.toggleFoldBtn, function () {
                   me.element.toggleClass('fold');
                })

                .on('click', actions.toggleSmallBtn, function () {
                    me.element.removeClass('full-screen').toggleClass('small-screen');
                })

                .on('click', actions.closeBtn, function () {
                    me.hide();
                })

                .on('click', this.actions.pointItem, function () {
                    var uuid = $(this).data('uuid');
                    me.mapInstance.setCenter(me.getPointByUUID(uuid).marker.getPosition());
                });

            me.on('dispose', function () {
                me.removePoints();
            });
            
        },
        getPointByUUID: function (uuid) {
            if (!uuid) return null;
            return this.points.filter(function (item) {
                return item.uuid == uuid;          
            })[0];
        },
        renderMap: function renderMap(){
            var mapInstance = new qq.maps.Map(this.element.find('.map-container')[0], {
                scrollwheel: false,
                zoom: 13
            });
            this.mapInstance = mapInstance;
        },
        initMap: function () {
            var me = this;

            loadQQMap(function () {
                me.renderMap();
            });
        },
        renderPoints: function (points) {
            var mapInstance = this.mapInstance;
            var pointListWrap = this.element.find('.map-controls .points-container');
            var html = '', center;
            if (!points) return false;
            if (!Array.isArray(points)) {
                points = [points];
            }
            points.forEach(function (item) {
                center = new qq.maps.LatLng(item.point.lat, item.point.lng);
                item.marker = new qq.maps.Marker({
                    position: center,
                    map: mapInstance
                });

                item.label = new qq.maps.Label({
                    position: center,
                    map: mapInstance,
                    content: item.point.name
                });

                html += Simplite.render('point-template', {
                    uuid: item.uuid,
                    lat: item.point.lat,
                    lng: item.point.lng,
                    name: item.point.name
                });
            });
            pointListWrap.append(html);
            mapInstance.setCenter(center);
        },
        addPoints: function (points) {
            var me = this;
            if (!points) return false;
            if (!Array.isArray(points)) {
                points = [points];
            }
            var newIndex = me.points.length;
            points.map(function (item) {
                me.points.push({
                    point: item,
                    marker: null,
                    uuid: ++me.uuid
                });
                if (!item.name) {
                    item.name = '未命名 ' + me.uuid;  
                }
            });
            me.renderPoints(me.points.slice(newIndex));
            return me.points.slice(newIndex);
        },
        removePoints: function (point) {
            var points = this.points;
            if (!point) {
                points.forEach(function(item) {
                    item.marker.setMap(null);
                    item.point = null;
                    item.marker = null;
                    item.label = null;
                });
                points.splice(0, points.length);
            } else {
                for (var i = 0; i < points.length; i++) {
                    if (points[i].uuid == point.uuid) {
                        var item = points.splice(i, 1)[0];
                        item.marker.setMap(null);
                        item.label.setMap(null);
                        item.point = null;
                        item.marker = null;
                        item.label = null;
                        break;
                    }
                }
            }
        },
        show: function () {
            this.element.show();
        },
        hide: function() {
            this.element.hide();
        }
    });

    MapHelper.defaultOptions = {
        actions: {
            toggleFullscreenBtn: '.toggle-fullscreen-btn',
            clearAllBtn: '.clear-all-btn',
            removePointBtn: '.remove-point-btn',
            toggleFoldBtn: '.toggle-fold',
            pointItem: '.point-item',
            toggleSmallBtn: '.toggle-small-btn',
            closeBtn: '.close-btn'
        }
    };

    return MapHelper;

});