define(function (require) {
    
    require('css!./restore.less');
    require('tpl!./restore.tpl');

    var loadMap = require('common/loadMap');
    var PluginManager = require('exports/restore/pluginmanager/pluginmanager');
    var DriverLinePlugin = require('exports/restore/plugins/driverlineplugin/driverLinePlugin');
    var DriverPositionPlugin = require('exports/restore/plugins/driverpositionplugin/driverPositionPlugin');
    var DriverTipPlugin = require('exports/restore/plugins/drivertipplugin/driverTipPlugin');
    var PassengerLinePlugin = require('exports/restore/plugins/passengerlineplugin/passengerLinePlugin');
    var PassengerPositionPlugin = require('exports/restore/plugins/passengerpositionplugin/passengerPositionPlugin');
    var PassengerTipPlugin = require('exports/restore/plugins/passengertipplugin/passengerTipPlugin');
    var OrderMessagesPlugin = require('exports/restore/plugins/ordermessagesplugin/orderMessagesPlugin');
    var OrderDetailPlugin = require('exports/restore/plugins/orderdetailplugin/orderDetailPlugin');

    var Restore = require('exports/dep/ui').create({
        init: function init(options) {
            var me = this;
            this.mapData = {};
            this.element.html(Simplite.render('exports-restore-template', { prefix: this.prefix }));
            loadMap(function initMapInstance() {
                me.mapData.mapInstance = new qq.maps.Map(me.element.find('.js-restore-map')[0], { scrollwheel: false, zoom: 13 });
                me.renderDefault();
            });
            this.initPlugins();
        },

        bindEvent: function bindEvent() {
            var me = this;
        },

        initPlugins: function initPlugins() {
            var me = this;
            this.pluginManager = new PluginManager({
                element: this.element.find('.js-restore-plugins')
            });

            this.pluginManager.on('init', function () {
                me.renderDefault();
            })

            this.pluginManager.on('showAllTrip', function () {
                me.fire('pluginManagerShowAllTrip');
            });
        
            var driverLinePlugin = new DriverLinePlugin({
                mapData: this.mapData,
                getDataSource: function (data) {
                    return me.dataSource.driverLine[data.orderId];
                }
            });

            var driverPositionPlugin = new DriverPositionPlugin({
                mapData: this.mapData,
                domain: this.domain,
                getDataSource: function (data) {
                    return me.dataSource.driverPosition[data.orderId];
                }
            });

            var driverTipPlugin = new DriverTipPlugin({
                mapData: this.mapData,
                getDataSource: function (data) {
                    return me.dataSource.driverTip[data.orderId];
                }
            });

            var passengerLinePlugin = new PassengerLinePlugin({
                mapData: this.mapData,
                getDataSource: function (data) {
                    return me.dataSource.passengerLine[data.orderId];
                }
            });

            var passengerPositionPlugin =  new PassengerPositionPlugin({
                mapData: this.mapData,
                domain: this.domain,
                getDataSource: function (data) {
                    var order = me.dataSource.orderInfos.filter(function (item) {
                        return item.orderId === data.orderId;
                    })[0]
                    return { list: me.dataSource.passengerPosition[data.orderId], order: order };
                }
            });

            var passengerTipPlugin = new PassengerTipPlugin({
                mapData: this.mapData,
                getDataSource: function (data) {
                    var order = me.dataSource.orderInfos.filter(function (item) {
                        return item.orderId === data.orderId;
                    })[0]
                    return { list: me.dataSource.passengerTip[data.orderId], order: order };
                }
            });

            var orderMessagesPlugin = new OrderMessagesPlugin({
                element: this.element.find('.js-restore-list-wrap'),
                prefix: this.prefix,
                getDataSource: function (data) {
                    var colorMaps = {};
                    me.dataSource.orderInfos.forEach(function (item) {
                        colorMaps[item.orderId] = {
                            color: item.color,
                            cls: item.cls
                        }
                    });
                    me.dataSource.orderMessages.forEach(function (item) {
                        if (item.orderId) {
                            item.cls = colorMaps[item.orderId].cls;
                            item.color = colorMaps[item.orderId].color;
                            item.visible = (item.orderId === data.orderId);
                        }
                    });
                    return me.dataSource.orderMessages;
                }
            });

            orderMessagesPlugin.on('clickDetail', function (data) {
                me.fire('orderMessagesDetailClick', data);
            });

            var orderDetailPlugin = new OrderDetailPlugin({
                element: this.element.find('.js-restore-order-wrap'),
                prefix: this.prefix,
                getDataSource: function (data) {
                    return me.dataSource.orderInfos.filter(function (item) {
                        return data.orderId === item.orderId;
                    })[0];
                }
            });

            this.pluginManager.add(driverLinePlugin);
            this.pluginManager.add(driverPositionPlugin)
            this.pluginManager.add(driverTipPlugin);
            this.pluginManager.add(passengerLinePlugin)
            this.pluginManager.add(passengerPositionPlugin);
            this.pluginManager.add(passengerTipPlugin)
            this.pluginManager.add(orderMessagesPlugin);
            this.pluginManager.add(orderDetailPlugin);
           
        },

        renderPlugins: function renderPlugins() {
            var orderInfos = this.dataSource.orderInfos;
            this.pluginManager.render(orderInfos, this.dataSource.showAllBtn);
            this.renderDefault();
        },

        renderDefault: function renderDefault() {
            var me = this;
            if (!me.prepared) {
                return me.prepared = 1;
            } else if(me.prepared === 1) {
                return me.prepared = 2;
            } else {
                var element = me.pluginManager.element;
                ['OrderDetailPlugin', 'OrderMessagesPlugin', 'PassengerPositionPlugin', 'DriverLinePlugin'].forEach(function (item) {
                    element.find('[data-plugin-name="' + item + '"]').trigger('click');
                });
            }
        },

        render: function render(dataSource) {
            var me = this;
            this.resetMap();
            this.dataSource = dataSource;
            if (this.dataSource && this.dataSource.orderInfos) {
                this.dataSource.orderInfos.forEach(function (item, index) {
                    item.color = me.colors[index].color;
                    item.cls = me.colors[index].cls;
                });
            }
            if (this.dataSource) {
                this.renderPlugins();
            }
        },

        resetMap: function resetMap () {
            this.pluginManager.pluginsArray.forEach(function (plugin, index) {
                plugin.dispose();
            });
        },

        show: function show() {
            this.element.show();
        },

        hide: function hide() {
            this.element.hide();
        }
    });

    Restore.defaultOptions = {
        prefix: 'exports-plugin',
        domain: 'http://bamai.xiaojukeji.com',
        prepared: 0,
        colors: [
            {
                color: '#7d26cd',
                cls: 'cls-one'
            },
            {
                color: '#c60',
                cls: 'cls-two'
            },
            {
                color: '#09c',
                cls: 'cls-three'
            },
            {
                color: '#06c',
                cls: 'cls-four'
            },
            {
                color: '#666',
                cls: 'cls-five'
            },
            {
                color: '#1cd8c0',
                cls: 'cls-six'
            }
        ]
    };

    return Restore;
});