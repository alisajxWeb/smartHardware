define(function (require, exports) {

    require('tpl!./combine.tpl');

    var Behavior = require('exports/behavior/behavior');
    var Restore = require('exports/restore/restore');

    var Combine = require('exports/dep/ui').create({
        init: function init() {
            var me = this;
            this.element.html(Simplite.render('exports-combine-template'));
            this.orderComponent = new Restore({
                element: $('.js-combine-order-container', this.element),
                domain: this.domain,
                prefix: this.prefix
            });
            this.behaviorComponent = new Behavior({
                element: $('.js-combine-behavior-container', this.element),
                prefix: this.prefix
            });
        },

        bindEvent: function bindEvent() {
            var me = this;
            me.orderComponent.on('orderMessagesDetailClick', function (data) {
                me.fire('orderMessagesDetailClick', data);
            });
            me.orderComponent.on('pluginManagerShowAllTrip', function (data) {
                me.fire('pluginManagerShowAllTrip');
            });
            me.behaviorComponent.on('behaviorMessagesDetailClick', function (data) {
                me.fire('behaviorMessagesDetailClick', data);
            });
        },

        initComponents: function initComponents() {

        },

        render: function render(dataSource, type) {
            if (type === 'order') {
                this.behaviorComponent.hide();
                this.orderComponent.show();
                this.renderOrder(dataSource);
            } else {
                this.orderComponent.hide();
                this.behaviorComponent.show();
                this.renderBehavior(dataSource);
            }
        },

        renderBehavior: function renderBehavior(dataSource) {
            this.behaviorComponent.render(dataSource);
        },

        renderOrder: function renderOrder(dataSource) {
            this.orderComponent.render(dataSource);
        }
    });

    Combine.defaultOptions = {
        prefix: 'exports-plugin',
        domain: 'http://bamai.xiaojukeji.com'
    };



    return Combine;
});