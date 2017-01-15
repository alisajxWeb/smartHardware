define(function (require) {
    
    require('tpl!./orderMessagesPlugin.tpl');
    require('css!./orderMessagesPlugin.less');

    Simplite.addFilter('formatLogTime', function formatLogTime(timeStr) {
        timeStr = (timeStr + '').split('+')[0];
        return timeStr;
    });

    var OrderMessagesPlugin = require('exports/dep/ui').create({
        init: function init(options) {
            this.views = {};
            this.element.find('.js-restore-list').html(Simplite.render('exports-restore-ordermessageplugin-template', { prefix: this.prefix }));
        },

        bindEvent: function bindEvent() {

            var me = this;

            me.element.on('click', '.js-detail-click', function () {
                var data = $(this).closest('tr').data();
                me.fire('clickDetail', data);
            });
            
        },

        render: function render(data) {
            this.element.show();
            if (this.views[data.key]) {
                return this.show(data.key);
            }
            var me = this;
            var tbody = Simplite.render('exports-restore-ordermessageplugin-record-template', { list: data.dataSource });
            data.dataSource.forEach(function (item) {
                me.views[item.orderId] = item.cls;
            });
            this.element.find('tbody').html(tbody);
        },
        
        show: function show(key) {
            if (key) {
                return this.element.find('.' + this.views[key]).show(); 
            }
            this.element.find('tr').show();
        },

        hide: function hide(key) {
            if (key) {
                return this.element.find('.' + this.views[key]).hide(); 
            }
            this.element.find('tr').hide();
        },
        
        dispose: function dispose(key) {
            if (key) {
                return this.views[key] && this.element.find('.' + this.views[key]).remove();
            }
            for(var key in this.views) {
                this.element.find('.' + this.views[key]).remove();
            }
            this.views = {};
        },

        getDataSource: function getDataSource(params) {
            
        }
    });

    OrderMessagesPlugin.defaultOptions = {
        prefix: 'exports-plugin',
        name: 'OrderMessagesPlugin',
        text: '订单主流程',
        events: {
           clickDetail: 'clickDetail' 
        }
    };


    return OrderMessagesPlugin;
});