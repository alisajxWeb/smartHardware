define(function (require) {
    
    require('tpl!./orderDetailPlugin.tpl');
    require('css!./orderDetailPlugin.less');

    var OrderDetailPlugin = require('exports/dep/ui').create({
        init: function init(options) {
            this.views = {};
        },

        bindEvent: function bindEvent() {
            var me = this;
            this.element.on('click', '.js-expend-action', function () {
                var container = $(this).closest('.js-container');
                container.toggleClass('expended');
                container.find('.js-body').slideToggle();
            });
        },

        render: function render(data) {
            this.element.show();
            if (this.views[data.key]) {
                return this.show(data.key);
            }
           
            var tpl = $(Simplite.render('exports-restore-orderdetailplugin-template', { tmp: data.dataSource, prefix: this.prefix, mainWorkList: data.mainWorkList }));
            this.element.find('.js-order-list').append(tpl);
            this.views[data.key] = tpl;
        },
        
        show: function show(key) {
            if (key) {
                return this.views[key] && this.views[key].show();
            }
            for(var key in this.views) {
                this.views[key].show();
            }
        },

        hide: function hide(key) {
            if (key) {
                return this.views[key] && this.views[key].hide();
            }
            for(var key in this.views) {
                this.views[key].hide();
            }
        },
        
        dispose: function dispose(key) {
            if (key) {
                return this.views[key] && this.views[key].remove();
            }
            
            for(var key in this.views) {
                this.views[key].remove();
            }
            this.views = {};
        },

        getDataSource: function getDataSource(params) {
            
        }
    });

    OrderDetailPlugin.defaultOptions = {
        prefix: 'exports-plugin',
        name: 'OrderDetailPlugin',
        text: '订单详细信息'
    };


    return OrderDetailPlugin;
});