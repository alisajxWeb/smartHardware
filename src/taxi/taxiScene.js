define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var Validator = require('common/Validator');
    var rules = require('common/rules');
    var store = require('common/store');
    var MapHelper = require('component/widgets/maphelper/maphelper');
    var service = require('service/taxi-main');
    var tabIndex = 2;
    var format = 'YYYY-MM-DD HH:mm:ss';
    var mainFlow, currentList, orderListObj;


    function initValidator(container) {
        var v = new Validator({
            rules: rules,
            elements: {
                keyType: ['required:true'],
                keyValue: ['required:true', 'number'],
                timeRange: ['required:true']
            },
            notifier: {
                '*': function (result, rule, ele) {
                    if (!result) {
                        $(this).parent().addClass('has-error');
                    } else {
                        $(this).parent().removeClass('has-error');
                    }
                }
            }
        });
        v.init(container);
        return v;
    }

    function seriesParams(container) {
        var result = {};
        var fileds = container.find('.form-inline').find('.js-form-field');
        $.each(fileds, function (index, item) {
            result[$(item).attr('name')] = $.trim($(item).val());
        });
        return result;
    }

    function autoQuery(container) {
        var fileds = container.find('.form-inline').find('.js-form-field');
        var timerangepicker = container.find('[name="timeRange"]').data('daterangepicker');
        var querys = utils.getQuery(true) || {};
        if (!querys.beginTime) {
            querys.beginTime = moment().startOf('day').format(format);
        }

        if (!querys.endTime) {
            querys.endTime = moment().format(format);
        }

        $.each(fileds, function (index, item) {
            var key = querys[$(item).attr('name')];
            if (key) {
                $(item).val(decodeURIComponent(key || ''));
            }
        });

        timerangepicker.setStartDate(decodeURIComponent(querys.beginTime));
        timerangepicker.setEndDate(decodeURIComponent(querys.endTime));

        emitter.fire('auto_query', { tabIndex: tabIndex, queryBtn: container.find('.query-btn') });
    }

    function initDateRangePicker(container) {

        var rangeDom = container.find('[name="timeRange"]');
        var startTimeDom = container.find('[name="beginTime"]');
        var endTimeDom = container.find('[name="endTime"]');
        rangeDom.daterangepicker(
            {
                startDate: moment().startOf('day'),
                endDate: moment(),
                timePicker: true,
                timePicker12Hour: false,
                linkedCalendars: true,
                separator: ' 到 ',
                format: format,
                opens: 'left',
                ranges: {
                    '今天': [moment().startOf('day'), moment()],
                    '昨天': [moment().subtract(1, 'days').startOf('day'), moment().startOf('day')],
                    '近2天': [moment().subtract(1, 'days').startOf('day'), moment()]
                },
                locale: {
                    applyLabel: '确定',
                    cancelLabel: '取消',
                    fromLabel: '开始时间',
                    toLabel: '结束时间',
                    customRangeLabel: '自定义',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                }
            },
            function writeToDom(start, end) {
                var beginTime = start.format(format);
                var endTime = end.format(format);
                startTimeDom.val(beginTime);
                endTimeDom.val(endTime);
            });
        return rangeDom.data('daterangepicker');
    }

    function listToMap(messages, key) {
        var messageMaps = {};
        key = key || 'traceid';
        messages.forEach(function (item) {
            var keyValue = item[key];
            var arrays = messageMaps[keyValue] || [];
            arrays.push(item);
            messageMaps[keyValue] = arrays;
        });
        return messageMaps;
    }

    function formatMessages(list) {
        (list || []).forEach(function (item, index) {
            var inOrOutArgs;
            if (item.args) {
                if (item.args.slice(-1) === '.') {
                    try {
                        inOrOutArgs = JSON.parse(item.args.slice(0, -1));
                    } catch (e) {
                        inOrOutArgs = item.args;
                    }
                    item.args = inOrOutArgs;
                }
            }

            if (item.message) {
                item.message = item.message.replace(/(\\u)(\w{4}|\w{2})/gi, function ($0, $1, $2) {
                    return String.fromCharCode(parseInt($2, 16));
                });
            }
        });
    }

    function renderMainUI(container, response) {
        var tbody = container.find('.table .list');
        if (response && response.messages && response.messages.length) {
            mainFlow = response.taxiMainFlow;
            currentList = response.messages;
            formatMessages(currentList);

            var maps = listToMap(currentList);

            mainFlow.forEach(function (item) {
                item.children = maps[item.traceid] || [];
                item.children.forEach(function (m) {
                    if (m.traceid == item.traceid) {
                        item.orderId = m.oid;
                        m.message = m.message;
                        m.translateUri = item.translateUri;
                        if (m.dltag == '_com_request_in') {
                            m.inArgs = m.args;
                            m.dltag = '_com_request_in'
                        } else if (m.dltag == '_com_request_out') {
                            m.outArgs = m.args;
                            m.dltag = '_com_request_out'
                        }
                    }
                })
            })
            tbody.html(Simplite.render('taxi-scene-tbody', { list: mainFlow }));
        } else {
            tbody.html(Simplite.render('taxi-scene-empty'));
        }

        container.find('#taxiSceneConclusion').html((response.conclusion || '').replace(/\|\|/g, '<br/>'));
    }


    exports.init = function () {
        var container = this.element;
        var validator = initValidator();
        var mapHelper = new MapHelper();
        mapHelper.initMap();

        initDateRangePicker(container);

        container
            .on('click', '.query-btn', function () {
                validator.validate().done(function (result) {
                    if (result) {
                        var params = seriesParams(container);
                        emitter.fire('fresh_query', $.extend(true, { needAuto: 1, tabIndex: tabIndex }, params));
                        service.getSceneLogList(params).done(function (response) {
                            renderMainUI(container, response);
                            emitter.fire('update_feedback', {
                                index: tabIndex,
                                queryUrl: store.get(window.location.pathname + window.location.search + window.location.hash)
                            });
                        });
                    }
                });
            })
            .on('click', '.toggle-msg-btn', function toggleMessage() {
                var icon = $(this).find('.glyphicon');
                var currentTr = $(this).parent();
                var tr = currentTr.nextAll('.js-normal-' + currentTr.data('extendIndex'));
                if (icon.hasClass('glyphicon-plus')) {
                    icon.removeClass('glyphicon-plus').addClass('glyphicon-minus');
                } else {
                    icon.removeClass('glyphicon-minus').addClass('glyphicon-plus');
                }
                $.each(tr, function (index, ele) {
                    $(ele).next().hide();
                    $(ele).find('.glyphicon').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                });
                tr.toggle();
            })
            .on('click', '.toggle-msg-detail-btn', function toggleMessageDetail() {
                var icon = $(this).find('.glyphicon');
                var tr = $(this).parent().next();
                if (icon.hasClass('glyphicon-triangle-right')) {
                    icon.removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                } else {
                    icon.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                }
                tr.toggle();
            });

        container.find('.form-inline').on('keydown', function (e) {
            if (e.keyCode === 13) {
                container.find('.query-btn').click();
            }
        });

        emitter.fire('init_feedBack', {
            ele: container.find('.feedback-container'),
            index: tabIndex
        });

        autoQuery(container);
    };
});