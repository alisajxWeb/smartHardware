define(function (require, exports) {

    require('css!./filtermenu.less');
    require('tpl!./filtermenu.tpl');

    var FilterMenu = require('../../ui').create({
        init: function init(options) {
            this.container = $('<div class="filter-menu"></div>');
            this.element.append(this.container);
            this.render(this.data);
        },

        bindEvent: function bindEvent() {
            var me = this;
            var actions = me.actions;
            me.element
                .on('click', actions.triggerBtn, function toggleView() {
                    me.container.toggle();
                })
                .on('click', actions.resolveBtn, function resolve() {
                    me.hide();
                    me.fire('resolve', me.getData());
                })
                .on('click', actions.rejectBtn, function reject() {
                    me.hide();
                    me.fire('reject', me.getData());
                });

            me.on('dispose', function () {
                me.element.off('click', actions.resolveBtn);
                me.element.off('click', actions.rejectBtn);
                me.element.off('click', actions.triggerBtn);
                me.element = null;
                me.container = null;
            });
        },

        render: function render(data) {
            if (data){
                if (!data.key) {
                    data.key = this.element.data('key');
                }
                this.container.html($(Simplite.render('filtermenu-template', data)));
            }
        },

        hide: function hide() {
            this.container && this.container.hide()
        },

        show: function show() {
            this.container && this.container.show()
        },

        getData: function getData() {
            var checkedData = [];
            var uncheckedData = [];
            $('input:checkbox', this.element).each(function (index, item){
                item.checked ? checkedData.push($.trim(item.value)) : uncheckedData.push($.trim(item.value))
            });
            this.checkedList = checkedData;
            this.uncheckedList = uncheckedData;
            return {
                checkedList: checkedData,
                uncheckedList: uncheckedData
            };
        }
    });

    FilterMenu.defaultOptions = {
        actions: {
            triggerBtn: '.trigger-btn',
            resolveBtn: '.resolve-btn',
            rejectBtn: '.reject-btn'
        }
    };

    return FilterMenu;

});