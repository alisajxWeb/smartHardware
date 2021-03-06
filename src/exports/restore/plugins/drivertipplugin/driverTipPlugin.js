define(function (require) {

    var pointLimit = 500;
    
    var DriverTipPlugin = require('exports/dep/ui').create({
        init: function init(options) {
            this.views = {};
            this.points = {};
            
        },

        bindEvent: function bindEvent() {
            
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

        drawAsMark: function drawAsLine(data) {
            var views = [];
            if (data.key && data.dataSource && data.dataSource.length) {
                var mapInstance = this.mapData.mapInstance;

                for (var i = 0, len = data.dataSource.length; i < len; i++) {
                    var item = data.dataSource[i];
                    var notice = [
                        '事件：' + (item.translatePointIndex || this.eventDesc[item.eventType] || '未知') + '-' + (item.pointIndex || item.eventType),
                        '订单：' + (this.orderDesc[item.orderStatus] || '未知') + '-' + (item.orderStatus || ''),
                        '时间：' + (item.recordTime || item.createtime || '未知'),
                        '单号：' + (data.key || '未知')
                    ].join('<br>');
                    var tmapId = 'S' + new Date().getTime();
                    var infoWin = new qq.maps.InfoWindow({
                        content: '<i id="' + tmapId + '" style="position: absolute;left: -20px;right: -20px;top: -10px;bottom: -10px;"></i>' + notice,
                        position: new qq.maps.LatLng(item.lat, item.lng),
                        map: mapInstance
                    });
                    infoWin.open();
                    this.bindMarkerEvent(infoWin, tmapId);
                    views.push(infoWin);
                }

                this.views[data.key] = views;
            } else if (data.key) {
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
                    item.open();
                });
            } else {
                for (var key in views) {
                    views[key].forEach(function (item) {
                        item.open();
                    });
                }
            }
        },

        hide: function hide(key) {
            var views = this.views;
            if (key) {
                views = views[key];
                views && views.forEach(function (item) {
                    item.close();
                });
            } else {
                for (var key in views) {
                    views[key].forEach(function (item) {
                        item.close();
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

    DriverTipPlugin.defaultOptions = {
        name: 'DriverTipPlugin',
        text: '司机事件',
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
    };


    return DriverTipPlugin;
});