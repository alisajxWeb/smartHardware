define(function (require) {

    require('css!./searchbar.less');
    require('tpl!./searchbar.tpl');

    var Searchbar = require('../../ui').create({
        init: function (options) {
            this.element = $(Simplite.render('searchbar-template'));
            this.context = $('body');
            this.render();
        },
        bindEvent: function () {
            var me = this;
            me.element
                .on('click', me.actions.searchBtn, function () {
                    if (me.element.hasClass('active')) {
                        me.fire('search', { text: me.getSearchText() });
                    }
                })
                .on('click', me.actions.resetBtn, function () {
                    me.reset();
                    me.fire('reset');
                });
            me.element.find(me.actions.searchTxt)
                .on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        me.fire('search', { text: me.getSearchText() });
                    }
                })
                .on('blur', function () {
                    me.setUnActive();
                })
                .on('focus', function () {
                    me.setActive();
                });
           
        },
        getSearchText: function () {
            var val = $.trim(this.element.find(this.actions.searchTxt).val());
            return val;
        },
        render: function (data) {
            this.context.append(this.element);
        },
        setUnActive: function () {
            this.element.removeClass('active');
        },
        show: function () {
            this.element.show();
        },
        hide: function () {
            this.element.hide();
        },
        setResultNum: function (num) {
            this.element.find('.js-searchbar-num').text(num);
        },
        reset: function () {
            this.element.find(this.actions.searchTxt).val('');
        },
        setActive: function () {
            this.element.addClass('active');
        }
    });

    Searchbar.defaultOptions = {
        actions: {
            searchBtn: '.js-searchbar-searchbar',
            searchTxt: '.js-searchbar-input',
            resetBtn: '.js-searchbar-reset'
        }
    };

    return Searchbar;
});