define(function (require, exports) {

    require('css!./feedback.less');
    require('tpl!./feedback.tpl');

    var FeedBack = require('../../ui').create({
        init: function init(options) {
            this.render();
        },

        bindEvent: function bindEvent() {
            var me = this;
            var actions = me.actions;
            me.element
                .on('click', actions.resolveBtn, function resolve() {
                    me.fire('resolve', me.params);
                })
                .on('click', actions.rejectBtn, function reject() {
                    me.fire('reject', me.params);
                });

            me.on('dispose', function () {
                me.element.off('click', actions.resolveBtn);
                me.element.off('click', actions.rejectBtn);
                me.element = null;
            });
        },

        render: function render() {
            this.container = $(Simplite.render('feedback-template', {}));
            this.element.append(this.container);
        },

        updateModuleUrl: function updateModuleUrl(url) {
            this.params.moduleUrl = url;
        },

        hide: function hide() {
            this.container.hide();
        },

        show: function show() {
            this.container.show();
        }
    });

    FeedBack.defaultOptions = {
        actions: {
            resolveBtn: '.resolve-btn',
            rejectBtn: '.reject-btn'
        }
    };

    return FeedBack;

});