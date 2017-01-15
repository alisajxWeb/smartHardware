define(function(require, exports) {
    require('css!./scene.less');
    require('tpl!./scene.tpl');

    var pointLimit = 500;

    function filterPointByTime(points, key,  startTime, endTime, isLong) {
        var result = [];
        for(var i = 0, len = points.length; i < len; i++) {
            var point = points[i];
            var keyValue = point[key];
            if (!!keyValue) {
                if (isLong) {
                    keyValue = Number(keyValue);
                }

                if (keyValue >= startTime && keyValue <= endTime) {
                    result.push(point);
                }
            }
        }
        return result;
    }


     var SceneMap = require('../../ui').create({
        init: function init(options) {
            options = options || {};
            this.driverLine = {};
            this.driverMarker = {};
            this.driverWindow = {};
            this.passengerLine = {},
            this.passengerMarker = {},
            this.passengerWindow = {};
            this.initData();
            this.render();
        },
        onViewChange: function (nodeObj, type) {
            var dataType = nodeObj.attr('data-type');
            var callType = nodeObj.attr('data-call');
            var nodePant = nodeObj.parent();
            var orderId = nodePant.attr('data-oid');
            var toolBtn = nodePant.siblings('.map-boxtit');
            var dataList = this[dataType][orderId].views;
            var chooseTotal = nodePant.find('.tool-btn-cur').length;

            if (chooseTotal > 0) {
                toolBtn.removeClass('boxtit-disable');
            } else {
                toolBtn.addClass('boxtit-disable');
            }

            dataList && $.each(dataList, function (i, item) {
                setTimeout(function () {
                    if (callType === 'visible') {
                        item.setVisible(type);
                    } else {
                        if (type) {
                            item.open();
                        } else {
                            item.close();
                        }
                    }
                }, 0);
            });
        },
        isInDefault: function (key) {
            return this.defaultShow.join('#').indexOf(key) !== -1;
        },
        bindEvent: function () {
            var me = this;
            var actions = me.actions;
            this.mapTool
                .on('click', '.tool-btn', function () {
                    if ($(this).hasClass('tool-btn-cur')) {
                        $(this).removeClass('tool-btn-cur');
                        me.onViewChange($(this), false);
                    } else {
                        $(this).addClass('tool-btn-cur');
                        me.onViewChange($(this), true);
                    }
                })
                .on('click', '.map-boxtit', function () {
                    if ($(this).hasClass('boxtit-disable')) {
                        $(this).removeClass('boxtit-disable');
                        $(this).siblings('.map-boxtip').children().removeClass('tool-btn-cur').trigger('click');
                    } else {
                        $(this).addClass('boxtit-disable');
                        $(this).siblings('.map-boxtip').children().addClass('tool-btn-cur').trigger('click');
                    }
                });
        },
        initData: function () {
           var driverTrips = this.dataSource.driverTrips;
           var passengerKeyEvents = this.dataSource.passengerKeyEvents;
           var passengerTrips = this.dataSource.passengerTrips;
           var orderInfos = this.dataSource.orderInfos;
           var eventDesc = this.eventDesc;
           var orderDesc = this.orderDesc;

           for (var i = 0; i < orderInfos.length; i++) {
               var order = orderInfos[i];
               this.driverLine[order.orderId] = {
                   points: driverTrips[order.orderId] || filterPointByTime(driverTrips, 'time', order.startTime, order.endTime, true),
                   views: [] 
               };
               this.driverMarker[order.orderId] = {
                   points: (passengerKeyEvents[order.orderId] || []).filter(function (item, index){
                       if (item.lat && item.lng && Number(item.lat) > 0 && Number(item.lng) > 0 && (item.eventType != null || item.translatePointIndex != null)) {
                           var notice = '';
                           if (item.eventType) {
                               notice = (eventDesc[item.eventType] || '') + (orderDesc[item.orderStatus] || '');
                               return !/司机/g.test(notice);
                           }
                           if (item.translatePointIndex) {
                               notice = item.translatePointIndex || '';
                               return !/车主/g.test(notice);
                           }
                       }
                       return false;
                   }),
                   views: []
               };
               this.driverWindow[order.orderId] = {
                   points: this.driverMarker[order.orderId].points.slice(0),
                   views: []
               };
               this.passengerLine[order.orderId] = {
                   points: passengerTrips[order.orderId] || [],
                   views: [] 
               };
               this.passengerMarker[order.orderId] = {
                   points: (passengerKeyEvents[order.orderId] || []).filter(function (item, index){
                       if (item.lat && item.lng && Number(item.lat) > 0 && Number(item.lng) > 0 && (item.eventType != null || item.translatePointIndex != null)) {
                           var notice = '';
                           if (item.eventType) {
                               notice = (eventDesc[item.eventType] || '') + (orderDesc[item.orderStatus] || '');
                               return !/司机/g.test(notice);
                           }
                           if (item.translatePointIndex) {
                               notice = item.translatePointIndex || '';
                               return !/车主/g.test(notice);
                           }
                       }
                       return false;
                   }),
                   views: []
               };
               this.passengerWindow[order.orderId] = {
                   points: this.passengerMarker[order.orderId].points.slice(0),
                   views: []
               }
           }
        },
        render: function () {
            var orderInfos = this.dataSource.orderInfos;
            var driverTrips = this.dataSource.driverTrips;
            var center; 
            this.mapTool.html('');
            for (var i = 0; i < orderInfos.length; i++) {
                this.drawMap(orderInfos[i], i);
                this.drawTools(orderInfos[i], i);
                if (!center) {
                    center = this.passengerMarker[orderInfos[i].orderId].points[0];
                }
            }
            center && this.mapInstance.setCenter(new qq.maps.LatLng(center.lat, center.lng));
        },
        drawMap: function (orderInfo, index) {
            var orderId = orderInfo.orderId;
            this.drawDriverLine(this.driverLine[orderId], index, orderInfo);
            this.drawDriverMarker(this.driverMarker[orderId], index, orderInfo);
            this.drawDriverWindow(this.driverWindow[orderId], index, orderInfo);
            this.drawPassengerLine(this.passengerLine[orderId], index, orderInfo);
            this.drawPassengerMarker(this.passengerMarker[orderId], index, orderInfo);
            this.drawPassengerdWindow(this.passengerWindow[orderId], index, orderInfo);
        },
        drawTools: function (orderInfo, index) {
            var color = this.drawColor[index];
            this.mapTool.append(Simplite.render('widget-scenemap-tool-template', { orderId: orderInfo.orderId, color: color }))
        },
        drawDriverLine: function (info, index) {
            var path = [];
            var color = this.drawColor[index];
            for (var i = 0, len = info.points.length; i < len; i++) {
                var point = info.points[i];
                path.push(new qq.maps.LatLng(point.lat, point.lng));
            }
            if (path.length >= pointLimit) { 
                var polyline = new qq.maps.Polyline({
                    path: path,
                    strokeColor: color,
                    strokeWeight: 5,
                    map: this.mapInstance,
                    visible: this.isInDefault('driverLine')
                });
                info.views.push(polyline);
            } else {
                for (var j = 0, jl = path.length; j < jl; j++) {
                    info.views.push(new qq.maps.Circle({
                        center: path[j],
                        radius: 5,
                        fillColor: color,
                        strokeWeight: 2,
                        strokeColor: color,
                        zIndex: 100,
                        map: this.mapInstance,
                        visible: this.isInDefault('driverLine')
                    }));
                }
            }
        },
        drawDriverMarker: function (info, index, orderInfo) {
            var eventDesc = this.eventDesc;
            var orderDesc = this.orderDesc;
            var mapInstance = this.mapInstance;

            for (var i = 0, len = info.points.length; i < len; i++) {
                var item = info.points[i];
                var marker = new qq.maps.Marker({
                    position: new qq.maps.LatLng(item.lat, item.lng),
                    icon: [
                        '/img/map/driver',
                        '-' + (index + 1) + '.png'
                    ].join(''),
                    visible: this.isInDefault('driverMarker'),
                    map: mapInstance
                });
                info.views.push(marker);
            }
        },
        bindMarkerEvent: function (infoWin, tmapId) {
            $('body').on('mouseenter', '#' + tmapId, function (event) {
                var infoNode = $(this).parent().parent().parent();
                var zIndex = infoNode.css('zIndex');
                infoNode.css('zIndex', (+zIndex + 1));
            }).on('mouseleave', '#' + tmapId, function (event) {
                var infoNode = $(this).parent().parent().parent();
                var zIndex = infoNode.css('zIndex');
                infoNode.css('zIndex', zIndex - 1);
            });
        },
        drawDriverWindow: function (info, orderInfo) {
            var eventDesc = this.eventDesc;
            var orderDesc = this.orderDesc;
            var mapInstance = this.mapInstance;

            for (var i = 0, len = info.points.length; i < len; i++) {
                var item = info.points[i];
                var notice = [
                    '事件：' + (item.translatePointIndex || this.eventDesc[item.eventType] || '未知') + '-' + (item.pointIndex || item.eventType),
                    '订单：' + (this.orderDesc[item.orderStatus] || '未知') + '-' + (item.orderStatus || ''),
                    '时间：' + (item.recordTime || item.createtime || '未知'),
                    '单号：' + (orderInfo.orderId || '未知')
                ].join('<br>');
                var tmapId = 'S' + new Date().getTime();
                var infoWin = new qq.maps.InfoWindow({
                    content: '<i class="map-toast" id="' + tmapId + '"></i>' + notice,
                    position: new qq.maps.LatLng(item.lat, item.lng),
                    map: mapInstance
                });
                if (this.isInDefault('driverWindow')) {
                    infoWin.open();
                }
                info.views.push(infoWin);
                this.bindMarkerEvent(infoWin, tmapId);
            } 
        },
        drawPassengerLine: function (info, index) {
            var path = [];
            var color = this.drawColor[index];
            for (var i = 0, len = info.points.length; i < len; i++) {
                var point = info.points[i];
                path.push(new qq.maps.LatLng(point.lat, point.lng));
            }
            if (path.length >= pointLimit) { 
                var polyline = new qq.maps.Polyline({
                    path: path,
                    strokeColor: color,
                    strokeWeight: 5,
                    map: this.mapInstance,
                    visible: this.isInDefault('passengerLine')
                });
                info.views.push(polyline);
            } else {
                for (var j = 0, jl = path.length; j < jl; j++) {
                    info.views.push(new qq.maps.Circle({
                        center: path[j],
                        radius: 5,
                        fillColor: color,
                        strokeWeight: 2,
                        strokeColor: color,
                        zIndex: 100,
                        map: this.mapInstance,
                        visible: this.isInDefault('passengerLine')
                    }));
                }
            }
            
        },
        drawPassengerMarker: function (info, index, orderInfo) {
            var eventDesc = this.eventDesc;
            var orderDesc = this.orderDesc;
            var mapInstance = this.mapInstance;
            var index = index + 1;
            var me = this;

            for (var i = 0, len = info.points.length; i < len; i++) {
                var item = info.points[i];
                var marker = new qq.maps.Marker({
                    position: new qq.maps.LatLng(item.lat, item.lng),
                    icon: [
                        '/img/map/personal',
                        '-' + index + '.png'
                    ].join(''),
                    visible: this.isInDefault('passengerMarker'),
                    map: mapInstance
                });
                info.views.push(marker);
            }

            var markCall = function (lat, lng, eventType, address) {
                var marker = new qq.maps.Marker({
                    position: new qq.maps.LatLng(lat, lng),
                    icon: [
                        '/img/map/personal-',
                        index + '-',
                        eventType + '.png'
                    ].join(''),
                    visible: me.isInDefault('passengerMarker'),
                    map: mapInstance
                });
                info.views.push(marker);
            };

            if (orderInfo.flat && orderInfo.flng) {
                markCall(orderInfo.flat, orderInfo.flng, 'start', orderInfo.fromName + '-' + orderInfo.fromAddress);
            }

            if (orderInfo.tlat && orderInfo.tlng) {
                markCall(orderInfo.tlat, orderInfo.tlng, 'dest', orderInfo.toName + '-' + orderInfo.toAddress);
            }

        },
        drawPassengerdWindow: function (info, index, orderInfo) {
            var eventDesc = this.eventDesc;
            var orderDesc = this.orderDesc;
            var mapInstance = this.mapInstance;
            var me = this;

            for (var i = 0, len = info.points.length; i < len; i++) {
                var item = info.points[i];
                var notice = [
                    '事件：' + (item.translatePointIndex || this.eventDesc[item.eventType] || '未知') + '-' + (item.pointIndex || item.eventType),
                    '订单：' + (this.orderDesc[item.orderStatus] || '未知') + '-' + (item.orderStatus || ''),
                    '时间：' + (item.recordTime || item.createtime || '未知'),
                    '单号：' + (orderInfo.orderId || '未知')
                ].join('<br>');
                var tmapId = 'S' + new Date().getTime();
                var infoWin = new qq.maps.InfoWindow({
                    content: '<i class="map-toast" id="' + tmapId + '"></i>' + notice,
                    position: new qq.maps.LatLng(item.lat, item.lng),
                    map: mapInstance
                });
                info.views.push(infoWin);
                if (this.isInDefault('passengerWindow')) {
                    infoWin.open();
                }
                this.bindMarkerEvent(infoWin, tmapId);
            }

            var markCall = function (lat, lng, eventType, address) {
                var tmapId = 'S' + new Date().getTime();
                var infoWin = new qq.maps.InfoWindow({
                    content: [
                        '乘客：' + (eventType === 'start' ? '乘车地址' : '下车地址'),
                        '<i class="map-toast" id="' + tmapId + '"></i>' + address
                    ].join('<br>'),
                    position: new qq.maps.LatLng(lat, lng),
                    map: mapInstance
                });
                if (me.isInDefault('passengerWindow')) {
                    infoWin.open();
                }
                info.views.push(infoWin);
                me.bindMarkerEvent(infoWin, tmapId);
            };

            if (orderInfo.flat && orderInfo.flng) {
                markCall(orderInfo.flat, orderInfo.flng, 'start', orderInfo.fromName + '-' + orderInfo.fromAddress);
            }

            if (orderInfo.tlat && orderInfo.tlng) {
                markCall(orderInfo.tlat, orderInfo.tlng, 'dest', orderInfo.toName + '-' + orderInfo.toAddress);
            }
        },
        reset: function () {
            var keys = ['driverLine', 'driverMarker', 'driverWindow', 'passengerLine', 'passengerMarker', 'passengerWindow'];
            for (var i =0; i < keys.length; i++) {
                var key = keys[i];
                for (var k in this[key]) {
                    this[key][k].views.forEach(function (item) {
                        item.setMap(null);
                    });
                    this[key][k].views.length = 0;
                    this[key][k].points.length = 0;
                    this[key] = {};
                }
            }
        },

        update: function (data) {
            this.dataSource = data;
            this.initData();
            this.render();
        }

    });

    SceneMap.defaultOptions = {
        actions: {
           
        },
        defaultShow: ['driverMarker', 'passengerMarker'],
        eventDesc: {
            1: '乘客 创建订单',
            2: '乘客 增加小费',
            3: '乘客 重发订单',
            4: '司机 拉取订单',
            5: '司机 到达位置',
            6: '司机 开始计费',
            7: '乘客 取消行程(未接单)',
            8: '乘客 取消行程(已接单)',
            9: '司机 取消订单',
            10: '司机 结束计费',
            11: '乘客 支付完成',
            12: '平台 支付司机'
        },
        orderDesc: {
            0: '未抢单',
            1: '已抢单',
            2: '已到达接乘客',
            3: '乘客上车',
            4: '开始计费',
            5: '订单完成',
            6: '抢单前取消（乘客）',
            7: '抢单后取消（乘客）',
            8: '已改派',
            9: '已改派失败',
            10: '司机和乘客协商时间，司机超时',
            11: '客服关闭',
            12: '未能完成服务状态'
        },
        drawColor: ['#c00', '#7D26CD', '#c60', '#09c', '#06c', '#666']
    };

    return SceneMap;
});