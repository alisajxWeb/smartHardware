define(function (require, exports) {

    require('css!./feature.less');
    require('tpl!./feature.tpl');

    function setCookie(name,value){
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
    }

    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    var Feature = require('../../ui').create({
        init: function init(options) {
            if (!this.mountNode) {
                this.mountNode = $('body');
            }
            this.render();
        },

        bindEvent: function bindEvent() {
            var me = this;
            var actions = me.actions;

            me.container
                .on('click', actions.resolveBtn, function resolve() {
                    me.hide();
                    setCookie(me.key, 1);
                });

        },

        render: function render() {
            var hasShown = getCookie(this.key);
            var me = this;
            this.container = $(Simplite.render('widget-feature-template', {}));
            this.mountNode.append(this.container);
            if (!hasShown) {
                setTimeout(function () {
                    me.show();
                }, 1000);
            }
        },

        hide: function hide() {
            this.container.hide();
        },

        show: function show() {
            this.container.find('.feature-container').addClass('animated zoomInDown');
            // this.container.find('.close-btn').addClass('animated bounceInRight')
            this.container.show();
        }
    });

    Feature.defaultOptions = {
        actions: {
            resolveBtn: '.close-btn',
        }
    };

    return Feature;

});