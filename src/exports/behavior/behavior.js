define(function (require) {
    
    require('css!./behavior.less');
    require('tpl!./behavior.tpl');

    Simplite.addFilter('formatLogTime', function formatLogTime(timeStr) {
        timeStr = (timeStr + '').split('+')[0];
        return timeStr;
    });

    

    var Behavior = require('exports/dep/ui').create({
        init: function init(options) {
            var me = this;
            this.element.html(Simplite.render('exports-behavior-template', { prefix: this.prefix, labels: this.colorNames }));
        },

        bindEvent: function bindEvent() {
            var me = this;

            me.element
                .on('click', '.js-behavior-label', function () {
                    var ele = $(this);
                    var activeKey = ele.data('activeKey');
                    var obj = me.colorNames[activeKey];
                    ele.toggleClass(obj.cls);
                    $('.' + obj.cls, me.element.find('table')).toggle();
                })
                .on('click', '.js-sort', function () {
                    var tbody = $(this).closest('table').find('tbody');
                    $(this).toggleClass('desc');
                    $(this).toggleClass('asc');
                    if (tbody.size()) {
                        var trs = tbody.find('tr');
                        for (var i = trs.length - 1; i >= 0; i--) {
                            tbody.append(trs[i]);
                        }
                    } 
                })
                .on('click', '.js-bahavior-detail', function () {
                    var data = $(this).closest('tr').data();
                    me.fire('behaviorMessagesDetailClick', data);
                });
        },

        render: function render(dataSource) {
            if (dataSource) {
                this.renderList(dataSource);
            }
        },

        renderList: function renderList(dataSource) {
            this.dataSource = dataSource || {};
            this.element.find('tbody').html(Simplite.render('exports-behavior-item-template', { data: this.dataSource.list || [], colorNames: this.colorNames }))
        },

        show: function show() {
            this.element.show();
        },

        hide: function hide() {
            this.element.hide();
        }
    });

    Behavior.defaultOptions = {
        prefix: 'exports-plugin',
        colorNames: {
            'h5': {
                text: '前端H5数据',
                cls: 'cls-one'
            },
            'app': {
                text: '前端APP数据',
                cls: 'cls-two'
            },
            'backend': {
                text: '服务端订单数据',
                cls: 'cls-three'
            },
            'backend_no_order': {
                text: '服务端非订单数据',
                cls: 'cls-four'
            }
        }
    };

    return Behavior;
});