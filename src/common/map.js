define(function (require, exports) {
    window.DDConf = window.DDConf || {};
    DDConf.util = DDConf.util || {};

    // 私有函数
    var pri = {
        conf: {
            MAP: null,
            container: null,
            mapTool: null,
            mapCanvas: null,
            gridData: null
        },
        mapConfig: {
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
        },
        // 获取地图数据
        getMapData: function () {
            var data = pri.conf.gridData;
            var hasLatLng = false;
            var setLatLng = function (info) {
                for (var j = 0; j < info.coordinates.length; j++) {
                    var item = info.coordinates[j];
                    if (item.lat && item.lng) {
                        hasLatLng = true;
                        pri.conf.defaultLat = item.lat;
                        pri.conf.defaultLng = item.lng;
                        pri.executeMap(data);
                        break;
                    }
                }
            };

            if (typeof data.coordinates !== 'undefined' && data.coordinates.length) {
                for (var i = 0; i < data.coordinates.length; i++) {
                    if (!hasLatLng) {
                        setLatLng(data.coordinates[i]);
                    } else {
                        break;
                    }
                }
            }
        },
        // 执行地图渲染
        executeMap: function (data) {
            var mapConf = {
                center: new qq.maps.LatLng(pri.conf.defaultLat, pri.conf.defaultLng),
                scrollwheel: false,
                zoom: 13
            };
            pri.mapTool = {
                eventTime: [],
                mapIconIndex: 0,
                driverLine: {},
                driverMarker: {},
                driverWindow: {},
                passengerLine: {},
                passengerMarker: {},
                passengerWindow: {}
            };

            $(pri.conf.container).show();
            pri.conf.MAP = new qq.maps.Map($(pri.conf.mapCanvas).get(0), mapConf);
            pri.executeDraw(data);
        },
        // 执行绘图操作
        executeDraw: function (data) {
            var indexStatus = -1;
            var formatTime = function (timeStr) {
                try {
                    var date = new Date(timeStr);
                    return date.getTime() / 1000;
                } catch (e) {
                    return 0;
                }
            };

            pri.toolColor = [];
            pri.orderIdList = [];

            $.each(data.coordinates, function (index, info) {
                if (info.key_event_coordinates) {
                    $.each(info.key_event_coordinates, function (i, item) {
                        pri.resetPassengerData(info.order_id, index);
                        pri.drawMarker(info.order_id, item);
                    });
                    pri.mapTool.eventTime.push({
                        orderId: info.order_id,
                        startTime: formatTime(info.start_time),
                        endTime: formatTime(info.end_time)
                    });
                    if (indexStatus !== index) {
                        indexStatus = index;
                        pri.toolColor.push(pri.mapConfig.drawColor[index]);
                        pri.orderIdList.push(info.order_id);
                        pri.drawPassengerPoint(info, index);
                    }
                }
                pri.drawPolyline(index, info);
            });

            pri.setMapTools();
        },
        // 绘制提示&&信息窗口
        drawMarker: function (orderId, item) {
            if (item.lat && item.lng && Number(item.lat) > 0 && Number(item.lng) > 0 && typeof item.event_type !== 'undefined') {
                var notice = [
                    '事件：' + (pri.mapConfig.eventDesc[item.event_type] || '未知') + '-' + item.event_type,
                    '订单：' + (pri.mapConfig.orderDesc[item.order_status] || '未知') + '-' + item.order_status,
                    '时间：' + (item.record_time || '未知'),
                    '单号：' + (orderId || '未知')
                ].join('<br>');
                var isDriver = /司机/g.test(notice);

                var marker = new qq.maps.Marker({
                    position: new qq.maps.LatLng(item.lat, item.lng),
                    icon: [
                        '/img/map/',
                        (isDriver ? 'driver' : 'personal'),
                        '-' + pri.mapTool.mapIconIndex + '.png'
                    ].join(''),
                    visible: false,
                    map: pri.conf.MAP
                });
                var tmapId = 'S' + new Date().getTime();
                var infoWin = new qq.maps.InfoWindow({
                    content: '<i class="map-toast" id="' + tmapId + '"></i>' + notice,
                    position: marker.getPosition(),
                    map: pri.conf.MAP
                });

                pri.bindMarkerEvent(infoWin, tmapId);

                if (isDriver) {
                    pri.mapTool.driverMarker[orderId].push(marker);
                    pri.mapTool.driverWindow[orderId].push(infoWin);
                } else {
                    pri.mapTool.passengerMarker[orderId].push(marker);
                    pri.mapTool.passengerWindow[orderId].push(infoWin);
                }
            }
        },
        // 绘制路线
        drawPolyline: function (index, info) {
            var drawLineFn = function (lineList, lineColor, lineType, orderId) {
                $.each(lineList, function (i, item) {
                    if (Number(item.lat) > 0 && Number(item.lng)) {
                        var point = DDConf.util.mapConvert.Convert_BD09_To_GCJ02({
                            lat: item.lat,
                            lng: item.lng
                        });
                        if (lineType === 'driver') {
                            pri.drawDriverLine(point, orderId, item.time, index);
                        } else {
                            pri.drawPassengerLine(lineColor, point, orderId);
                        }
                    }
                });
                var polyline;
                if (lineType === 'driver') {
                    var orderId = pri.mapTool.eventTime[index-1].orderId;
                    polyline = new qq.maps.Polyline({
                        path: pri.mapTool.driverLine[orderId],
                        strokeColor: pri.mapConfig.drawColor[index-1],
                        strokeWeight: 5,
                        map: pri.conf.MAP,
                        visible: false
                    });
                    pri.mapTool.driverLine[orderId].length = 0;
                    pri.mapTool.driverLine[orderId].push(polyline);
                } else {
                   polyline = new qq.maps.Polyline({
                        path: pri.mapTool.passengerLine[orderId],
                        strokeColor: lineColor,
                        strokeWeight: 3,
                        map: pri.conf.MAP,
                        visible: false
                    });
                    pri.mapTool.passengerLine[orderId].length = 0;
                    pri.mapTool.passengerLine[orderId].push(polyline);
                }
            };
            info.coordinates.length && drawLineFn(info.coordinates, pri.mapConfig.drawColor[index], info.type, info.order_id);
        },
        drawDriverLine: function (point, orderId, timeStr, index) {
            $.each(pri.mapTool.eventTime, function (i, item) {
                if (timeStr <= item.endTime && timeStr >= item.startTime) {
                    pri.mapTool.driverLine[item.orderId].push(new qq.maps.LatLng(point.lat, point.lng));
                }
            });
        },
        drawPassengerLine: function (lineColor, point, orderId) {
            pri.mapTool.passengerLine[orderId].push(new qq.maps.LatLng(point.lat, point.lng));
        },
        drawPassengerPoint: function (info, index) {
            var point = {};
            var type = '';
            var markCall = function (lat, lng, eventType, iconIndex, address) {
                var marker = new qq.maps.Marker({
                    position: new qq.maps.LatLng(lat, lng),
                    icon: [
                        '/img/map/personal-',
                        iconIndex + '-',
                        eventType + '.png'
                    ].join(''),
                    visible: true,
                    map: pri.conf.MAP
                });
                var tmapId = 'S' + new Date().getTime();
                var infoWin = new qq.maps.InfoWindow({
                    content: [
                        '乘客：' + (eventType === 'start' ? '乘车地址' : '下车地址'),
                        '<i class="map-toast" id="' + tmapId + '"></i>' + address
                    ].join('<br>'),
                    position: marker.getPosition(),
                    map: pri.conf.MAP
                });
                pri.bindMarkerEvent(infoWin, tmapId);
                pri.mapTool.passengerMarker[info.order_id].push(marker);
                pri.mapTool.passengerWindow[info.order_id].push(infoWin);
            };

            if (info.start_lat && info.start_lng) {
                type = 'start';
                point.lat = info.start_lat;
                point.lng = info.start_lng;
                pri.decodeLatLng(point.lat, point.lng, type, pri.mapTool.mapIconIndex, markCall);
            }
            if (info.dest_lat && info.dest_lng) {
                type = 'dest';
                point.lat = info.dest_lat;
                point.lng = info.dest_lng;
                pri.decodeLatLng(point.lat, point.lng, type, pri.mapTool.mapIconIndex, markCall);
            }
        },
        bindMarkerEvent: function (infoWin, tmapId) {
            $('body').delegate('#' + tmapId, 'mouseenter', function (event) {
                var infoNode = $(this).parent().parent().parent();
                infoNode.zIndex(infoNode.zIndex() + 1);
            }).delegate('#' + tmapId, 'mouseleave', function (event) {
                var infoNode = $(this).parent().parent().parent();
                infoNode.zIndex(infoNode.zIndex() - 1);
            });
        },
        // 反解析地址
        decodeLatLng: function (lat, lng, type, iconIndex, callback) {
            var latLng = new qq.maps.LatLng(lat, lng);
            var geocoder = new qq.maps.Geocoder({
                complete: function (result) {
                    callback(lat, lng, type, iconIndex, result.detail.address);
                }
            });
            geocoder.getAddress(latLng);
        },
        resetPassengerData: function (orderId, index) {
            if (!pri.mapTool.passengerMarker[orderId]) {
                pri.mapTool.mapIconIndex++;
                pri.mapTool.driverLine[orderId] = [];
                pri.mapTool.driverMarker[orderId] = [];
                pri.mapTool.driverWindow[orderId] = [];
                pri.mapTool.passengerLine[orderId] = [];
                pri.mapTool.passengerMarker[orderId] = [];
                pri.mapTool.passengerWindow[orderId] = [];
            }
        },
        // 设置地图工具栏
        setMapTools: function () {
            var btnBox = [];
            var toolTmpl = [
                '<a class="tool-btn" data-type="driverLine" data-call="visible" href="javascript:;">',
                '<i class="tool-icon"></i>显示司机轨迹</a>',
                '<a class="tool-btn" data-type="driverMarker" data-call="visible" href="javascript:;">',
                '<i class="tool-icon default-show"></i>显示司机位置</a>',
                '<a class="tool-btn" data-type="driverWindow" data-call="window" href="javascript:;">',
                '<i class="tool-icon"></i>显示司机提示</a>',
                '<a class="tool-btn" data-type="passengerLine" data-call="visible" href="javascript:;">',
                '<i class="tool-icon"></i>显示乘客轨迹</a>',
                '<a class="tool-btn" data-type="passengerMarker" data-call="visible" href="javascript:;">',
                '<i class="tool-icon default-show"></i>显示乘客位置</a>',
                '<a class="tool-btn" data-type="passengerWindow" data-call="window" href="javascript:;">',
                '<i class="tool-icon"></i>显示乘客提示</a>'
            ].join('');

            $.each(pri.orderIdList, function (i, item) {
                btnBox.push([
                    '<div class="map-toolbox">',
                    '<span class="map-boxtit">',
                    '<i class="map-circle" style="background:' + pri.toolColor[i] + '"></i>',
                    '订单：<b>' + item + '</b></span>',
                    '<span class="map-boxtip" data-oid="' + item + '">' + toolTmpl + '</span>',
                    '</div>'
                ].join(''));
            });

            $(pri.conf.mapTool).html(btnBox.join(''));

            $('.tool-btn').click(function () {
                if ($(this).hasClass('tool-btn-cur')) {
                    $(this).removeClass('tool-btn-cur');
                    pri.mapToolsEvent($(this), false);
                } else {
                    $(this).addClass('tool-btn-cur');
                    pri.mapToolsEvent($(this), true);
                }
            });

            $('.map-boxtit').click(function () {
                if ($(this).hasClass('boxtit-disable')) {
                    $(this).removeClass('boxtit-disable');
                    $(this).siblings('.map-boxtip').children().removeClass('tool-btn-cur').trigger('click');
                } else {
                    $(this).addClass('boxtit-disable');
                    $(this).siblings('.map-boxtip').children().addClass('tool-btn-cur').trigger('click');
                }
            });

            $('.default-show').trigger('click').removeClass('default-show');
        },
        mapToolsEvent: function (nodeObj, type) {
            var dataType = nodeObj.attr('data-type');
            var callType = nodeObj.attr('data-call');
            var nodePant = nodeObj.parent();
            var orderId = nodePant.attr('data-oid');
            var toolBtn = nodePant.siblings('.map-boxtit');
            var dataList = pri.mapTool[dataType] && pri.mapTool[dataType][orderId];
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
        }
    };

    // 对外接口
    var pub = function (options) {
        $.extend(pri.conf, options);
        $(pri.conf.container).hide();
        $(pri.conf.mapTool).html('');
        $(pri.conf.mapCanvas).html('');
        pri.getMapData();
    };

    DDConf.util.map = pub;

    // 百度地图坐标转换
    DDConf.util.mapConvert = {
        XPI: 3.14159265358979324 * 3000.0 / 180.0,
        // 中国正常坐标系GCJ02协议的坐标
        // 转到 百度地图对应的 BD09 协议坐标
        Convert_GCJ02_To_BD09: function (point) {
            var x = point.lng;
            var y = point.lat;
            var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * DDConf.util.mapConvert.XPI);
            var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * DDConf.util.mapConvert.XPI);
            point.lng = z * Math.cos(theta) + 0.0065;
            point.lat = z * Math.sin(theta) + 0.006;
            return point;
        },
        // 百度地图对应的 BD09 协议坐标
        // 转到 中国正常坐标系GCJ02协议的坐标
        Convert_BD09_To_GCJ02: function (point) {
            var x = point.lng - 0.0065;
            var y = point.lat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * DDConf.util.mapConvert.XPI);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * DDConf.util.mapConvert.XPI);
            point.lng = z * Math.cos(theta);
            point.lat = z * Math.sin(theta);
            return point;
        }
    };

    return DDConf;
});
