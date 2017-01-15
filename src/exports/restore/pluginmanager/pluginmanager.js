define(function (require) {

    require('tpl!./pluginmanager.tpl');
    require('css!./pluginmanager.less');
    
    var PluginManager = require('exports/dep/ui').create({
        init: function init(options) {
            this.pluginsArray = [];
            this.pluginsMap = {};
        },

        bindEvent: function bindEvent() {

            var me = this;
            me.element
                .on('click', '.js-pluginmanager-title', function () {
                    $(this).siblings('.js-pluginmanager-list').slideToggle(200);
                })
                .on('click', '.js-show-all', function () {
                    me.fire('showAllTrip');
                })
                .on('click', '.js-action', function () {
                    var action = $(this).data('action');
                    var container = $(this).closest('.js-pluginmanager-order');
                    if (action === 'select') {
                        $('.js-pluginmanager-plugin', container).not('.active').trigger('click');
                    } else {
                        $('.js-pluginmanager-plugin.active', container).trigger('click');
                    }
                    return false;
                })
                .on('click', '.js-pluginmanager-plugin', function () {
                    var data = $(this).data();
                    data.orderId = $(this).attr('data-order-id');
                    var icon = $(this).find('.js-pluginmanager-item-icon');
                    var plugin = me.pluginsMap[data.pluginName];
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        icon.css('backgroundColor', '');
                        return plugin.hide(data.orderId);
                    }
                    $(this).addClass('active');
                    icon.css('backgroundColor', data.color);
                    var dataPromise = plugin.getDataSource(data);
                    if (dataPromise && typeof dataPromise.done === 'function') {
                        dataPromise.done(function (result) {
                            plugin.render({key: data.orderId, color: data.color, dataSource: result});
                        });
                    } else {
                        plugin.render({key: data.orderId, color: data.color, dataSource: dataPromise});
                    }  
                });
        },

        render: function render(orderInfos, showAllBtn) {
            this.element.html(Simplite.render('exports-restore-pluginmanager-template', {
                orderInfos: orderInfos || [],
                plugins: this.pluginsArray,
                prefix: this.prefix,
                showAllBtn: showAllBtn,
            }))
        },

        add: function add(plugins) {
            var me = this;
            if (plugins && plugins.name) {
                plugins = [plugins];
            }
            if (plugins && plugins.length) {
                plugins.forEach(function (item) {
                    me.pluginsArray.push(item);
                    me.pluginsMap[item.name] = item;
                });
            }
        },
    });

    PluginManager.defaultOptions = {
        prefix: 'exports-plugin'
    };

    return PluginManager;
});