define(function (require, exports) {

    var utils = require('common/utils');
    var emitter = require('common/eventEmitter');
    var service = require('service/gs-main');


    function initDateRangePicker(beginQuery, endQuery) {

        var rangeDom = $('#newRewardTimeRange');
        var startTimeDom = $('#newRewardBeginTime');
        var endTimeDom = $('#newRewardEndTime');
        rangeDom.daterangepicker(
            {
                startDate: beginQuery || moment().startOf('day'),
                endDate: endQuery || moment(),
                timePicker: true,
                timePicker12Hour: false,
                linkedCalendars: true,
                separator: ' 到 ',
                format: 'YYYY-MM-DD HH:mm:ss',
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
                var beginTime = start.format('YYYY-MM-DD HH:mm:ss');
                var endTime = end.format('YYYY-MM-DD HH:mm:ss');
                $(startTimeDom).val(beginTime);
                $(endTimeDom).val(endTime);
            });
        return rangeDom.data('daterangepicker');
    }

    //right
    function seriesParams(timerangepicker) {
        var params = {};
        params.newRewardQueryType = $.trim($('#newRewardQueryType').val());
        params.newRewardQueryInfo = $.trim($('#newRewardQueryInfo').val());
        params.newRewardConfigId = $.trim($('#newRewardConfigId').val());
        params.beginTime = $.trim($('#newRewardBeginTime').val());
        params.endTime = $.trim($('#newRewardEndTime').val());
        return params;
    }

    function autoQuery(timerangepicker, tabIndex, container) {
        var beginTime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var endTime = moment().format('YYYY-MM-DD HH:mm:ss');

        var querys = utils.getQuery(true);
        var result = {};
        for (var key in querys) {
            result[key] = decodeURIComponent(querys[key]);
        }

        beginTime = result.beginTime || beginTime;
        endTime = result.endTime || endTime;


        $('#newRewardBeginTime').val(beginTime);
        $('#newRewardEndTime').val(endTime);

        timerangepicker.setStartDate(beginTime);
        timerangepicker.setEndDate(endTime);

        return result;
    }

    function renderTable(messages) {
        return Simplite.render('new-reward-tbody', { list: messages });
    }
    function createQueryTask(url) {
        return service.getNewAward(url).done(function (data) {
            var conclusion = data.conclusion;
            var messages = data.messages;
            if (!messages) {
                messages = [];
            }
            if (!conclusion) {
                conclusion = "";
            }
            var driverInfo, orderInfo, activityReason;
            messages.forEach(function (item, index) {
                if (item.driverInfo) {
                    try {
                        driverInfo = JSON.parse(item.driverInfo);
                    } catch (e) {
                        driverInfo = item.driverInfo;
                    }
                    item.driverInfo = driverInfo;
                }
                if (item.orderInfo) {
                    try {
                        orderInfo = JSON.parse(item.orderInfo);
                    } catch (e) {
                        orderInfo = item.orderInfo;
                    }
                    item.orderInfo = orderInfo;
                }
                if (item.activityReason) {
                    try {
                        activityReason = JSON.parse(item.activityReason);
                        if (activityReason['判断详情']) {
                            try {
                                activityReason['判断详情'] = JSON.parse(activityReason['判断详情']);
                            } catch (e) {
                                activityReason['判断详情'] = activityReason['判断详情'];
                            }
                        }
                        if ("规则ID" in activityReason) {
                            item.ruleId = activityReason["规则ID"]
                        }
                    } catch (e) {
                        activityReason = item.activityReason;
                    }
                    item.activityReason = activityReason;
                }

                // item.driverInfo = driverInfo;
                // item.orderInfo = orderInfo;
                // item.activityReason = activityReason;
            })
            $("#newRewardConclusion").html(conclusion.replace(/\|\|/g, '\<br\>'));
            $("#newRewardTable tbody").html(renderTable(messages));
        });
    }

    exports.init = function sceneInit() {

        var container = this.element;
        var tabIndex = 9;
        // init timerange
        var timerangepicker = initDateRangePicker();

        container
            .on('click', '.query-btn', function search() {
                var params = seriesParams(timerangepicker);
                if (!params.newRewardQueryInfo) {
                    alert('请输入查询条件');
                    return;
                }

                emitter.fire('reset_query', {
                    query: {
                        newRewardQueryType: params.newRewardQueryType,
                        newRewardQueryInfo: params.newRewardQueryInfo,
                        newRewardConfigId: params.newRewardConfigId,
                        beginTime: params.beginTime,
                        endTime: params.endTime,
                        tabIndex: tabIndex,
                        queryBtn: 'newRewardQuery'
                    },
                    flag: true
                });
                var url = '/proxy/gs/award';
                if (params.newRewardQueryType === 'orderId') {
                    url = url + '/orderId/';
                } else if (params.newRewardQueryType === 'driverId') {
                    url = url + '/driverId/';
                } else if (params.newRewardQueryType === 'driverPhone') {
                    url = url + '/driverPhone/';
                }

                url = url + params.newRewardQueryInfo + '?beginTime=' + params.beginTime + '&endTime=' + params.endTime;
                if (params.newRewardConfigId) {
                    url = url + '&activityId=' + params.newRewardConfigId;
                }
                createQueryTask(url).done(function () {
                    emitter.fire('update_feedback', {
                        index: tabIndex,
                        queryUrl: url
                    })
                });
            })
            .on('click', '.toggle-msg-btn', function toggleMessage() {
                var icon = $(this).find('.glyphicon');
                var tr = $(this).parent().next();
                if (icon.hasClass('glyphicon-triangle-right')) {
                    icon.removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                } else {
                    icon.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                }
                tr.toggle();
            });


        autoQuery(timerangepicker, tabIndex, container);
        emitter.fire('auto_query', { index: tabIndex });

        emitter.fire('init_feedBack', {
            ele: container.find('.feedback-container'),
            index: tabIndex
        });
    };
});