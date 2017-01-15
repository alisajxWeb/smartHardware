define(function (require, exports) {

    var tabIndex = 1;

    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var service = require('service/taxi-main');
    var cityInfos = require('service/city');
    var store = require('common/store');

    function autoQuery(container) {
        var fileds = container.find('.form-inline').find('.js-form-field');
        var timerangepicker = container.find('[name="timeRange"]').data('daterangepicker');
        var querys = utils.getQuery(true) || {};
        if (!querys.beginTime) {
             querys.beginTime = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        if (!querys.endTime) {
            querys.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        $.each(fileds, function (index, item) {
            $(item).val(decodeURIComponent(querys[$(item).attr('name')] || ''));
        });

        timerangepicker.setStartDate(decodeURIComponent(querys.beginTime));
        timerangepicker.setEndDate(decodeURIComponent(querys.endTime));

        emitter.fire('auto_query', { tabIndex: tabIndex, queryBtn: container.find('.query-btn')});
    }

    function initDateRangePicker(container) {
        var rangeDom = container.find('[name="timeRange"]');
        var startTimeDom = container.find('[name="beginTime"]');
        var endTimeDom = container.find('[name="endTime"]');
        rangeDom.daterangepicker(
            {
                startDate: moment().startOf('day'),
                endDate: moment().add(1, 'days').startOf('day'),
                timePicker: true,
                timePicker12Hour: false,
                linkedCalendars: true,
                separator: ' 到 ',
                format: 'YYYY-MM-DD HH:mm:ss',
                opens: 'left',
                ranges: {
                    '近4小时': [moment().subtract(4, 'hours'), moment()],
                    '近12小时': [moment().subtract(12, 'hours'), moment()],
                    '近1天': [moment().subtract(1, 'days'), moment()]
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
                var beginTime = start.format('YYYY-MM-DD HH:mm:ss');
                var endTime = end.format('YYYY-MM-DD HH:mm:ss');
                $(startTimeDom).val(beginTime);
                $(endTimeDom).val(endTime);
            }
        );
        return rangeDom.data('daterangepicker');
    }

    function seriesParams(container) {
        var result = {};
        var fileds = container.find('.form-inline').find('.js-form-field');
        $.each(fileds, function (index, item) {
            result[$(item).attr('name')] = $.trim($(item).val());
        });
        return result;
    }

    function calculateDigest(data) {
        var cityMap = {};
        if (cityInfos && cityInfos.length) {
            cityInfos.forEach(function (city) {
                cityMap[city.id] = city.name;
            });
        }
        
        var messages = [];
        var conclusion = {};

        (data.messages || []).forEach(function (item) {
            Array.prototype.push.apply(messages, item.result);
        });

        messages.forEach(function (item) {
            item.cityName = cityMap[item.city] || item.city;
            item.digest = item.filterLog != null 
                ? item.filterLog.split(',').filter(function (item) { return !!item; }).map(function(item) { var rule = item.split(':'); return '命中规则' + rule[0] + ':' + rule[1] + '次'}).join('||')
                : ('命中规则' + item.filterReason || '');

        });

        messages.forEach(function (item) {
            if (!conclusion[item.city]) { 
                conclusion[item.city] = {};
            }
            var result = conclusion[item.city];
            if  (item.filterLog) {
                item.filterLog.split(',').filter(function (rule) { return !!rule; }).forEach(function (ruleItem) {
                    var rules = ruleItem.split(':');
                    if (!result[rules[0]]) {
                        result[rules[0]] = +rules[1];
                    } else {
                        result[rules[0]] = result[rules[0]] + (+rules[1]);
                    }
                });
            } else if (item.filterReason) {
                if (!result[item.filterReason]) {
                    result[item.filterReason] = 1;
                } else {
                    result[item.filterReason] = result[item.filterReason] + 1; 
                }
            } 
        });

        var conclusionStr = [];
        for(var key in conclusion) {
            conclusionStr.push('在', cityMap[key], '命中策略过滤规则情况如下:<br/>');
            for (var rule in conclusion[key]) {
                conclusionStr.push('规则', rule, ':', conclusion[key][rule], '次<br/>');
            }
        }
        
        return {
            conclusion: conclusionStr.join(''),
            messages: messages 
        };
    }

    function renderUI(container, data) {
        var conclusion = container.find('.conclusion-text');
        var tbody = container.find('.table tbody');
        var result = calculateDigest(data);
        conclusion.html(result.conclusion);
        tbody.html(Simplite.render('taxi-log-tr', { list: result.messages }));
    }

    exports.init = function () {

        var container = this.element;

        initDateRangePicker(container);

        container
            .on('click', '.query-btn', function () {
                var params = seriesParams(container);
                emitter.fire('fresh_query', $.extend(true, { needAuto: 1, tabIndex: tabIndex }, params));
                service.getListenLogs(params).done(function (response) {
                    renderUI(container, response);
                    emitter.fire('update_feedback', {
                        index: tabIndex,
                        queryUrl: store.get(window.location.pathname + window.location.search + window.location.hash)
                    });
                });
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