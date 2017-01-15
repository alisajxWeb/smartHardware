define(function (require, exports) {

    require('tpl!../../tpl/gs-main.tpl');

    var FeedBack = require('component/widgets/feedback/feedback');
    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var service = require('service/common-main');
    var store = require('common/store');

    var feedbackMaps = {};

    require('./driverListenOrder');
    require('./billPreOrder');
    require('./beginBill');
    require('./orderPrice');
    require('./endBill');
    require('./payBill');
    require('./reward');
    require('./envCheck');
    require('./sceneRecovery');
    require('./newReward');

    function formatLogTime(timeStr) {
        timeStr = (timeStr + '').split('+')[0];
        return timeStr;
    }

    function formatBillMessage(item) {
        var value = item.message || '';
        value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var response = item.response;
        if (response) {
            response = response.substr(0, response.length - 1);
            value = value.replace(response, '<span class="json-view" style="color: white;background:blue;">' + response + '</span>');
        }
        var request = item.request;
        if (request && request != '[]') {
            request = request.substr(0, request.length - 1);
            value = value.replace(request, '<span class="json-view" style="color: white;background:green;">' + request + '</span>');
        }
        return value;
    }

    function formatDigest(digest) {
        return Simplite.filters.escape(digest || '').replace(/\|\|/g, '\<br\/\>');
    }

    function formatDigest2(digest) {
        return Simplite.filters.escape(digest || '').replace(/\,/g, '\<br\/\>');
    }

    function formatMessage(message) {
        if (message) {
            return '<pre>' + utils.formatJSON(message, true) + '</pre>';
        } else {
            return '';
        }
    }

    function formatTitleSetting(uri) {
        var title_setting = {
            "/gulfstream/order/v2/passenger/pNewOrder": "乘客 创建订单",
            "/gulfstream/hermesapi/v1/driver/dPullOrder": "司机 拉取订单",
            "/gulfstream/hermesapi/v1/driver/dStriveOrder": "司机 抢单",
            "/gulfstream/driver/v2/driver/dArrived": "司机 到达",
            "/gulfstream/driver/v2/driver/dBeginCharge": "司机 开始计费",
            "/gulfstream/driver/v2/driver/dEndCharge": "司机 确认账单",
            "/gulfstream/driver/v2/driver/dFinishOrderNew": "司机 结束计费",
            "/gulfstream/api/v1/passenger/pPrePay": "乘客 支付请求处理"
        };
        return title_setting[uri] || uri;
    }

    function setQuery() {
        var querys = utils.getQuery(true);
        for (var id in querys) {
            $('#' + id).val(querys[id]);
        }
        return querys;
    }

    function setTimerangeValue(beginDomId, endDomId) {
        var timerangeValue = function (start, end, label) {
            var beginTime = start.format('YYYY-MM-DD HH:mm') + ":00";
            var endTime = end.format('YYYY-MM-DD HH:mm') + ":00";
            $('#' + beginDomId).val(beginTime);
            $('#' + endDomId).val(endTime);
        }
        return timerangeValue;
    }


    function getTimerangeInit(beginQuery, endQuery) {
        var timerangeInit = {
            startDate: beginQuery || moment().startOf('day'),
            endDate: endQuery || moment().add(1, 'days').startOf('day'),
            timePicker: true,
            timePicker12Hour: false,
            linkedCalendars: true,
            separator: ' 到 ',
            format: 'YYYY-MM-DD HH:mm',
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
        }
        return timerangeInit;
    };

    function setTimerangeDisplayValue(beginTime, endTime, displayDomId) {
        if (beginTime && endTime) {
            var separator = ' 到 ';
            var beginTimeLength = beginTime.length;
            var endTimeLength = endTime.length;
            if (beginTimeLength < 3 || endTimeLength < 3) {
                return;
            }
            var beginTimeDisplay = beginTime.substring(0, beginTimeLength - 3);
            var endTimeDisplay = endTime.substring(0, endTimeLength - 3);
            // 针对火狐等浏览器 对%20做转移
            var whiteSpace = '%20';
            beginTimeDisplay = beginTimeDisplay.replace(whiteSpace, ' ');
            endTimeDisplay = endTimeDisplay.replace(whiteSpace, '');
            $('#' + displayDomId).val(beginTimeDisplay + separator + endTimeDisplay);
        }
    }

    function resetTimeRange(timeRange, autoQuerys, beginTime, endTime) {
        setTimerangeDisplayValue(autoQuerys[beginTime], autoQuerys[endTime], timeRange);
        $('#' + timeRange).daterangepicker(getTimerangeInit(autoQuerys[beginTime], autoQuerys[endTime]), setTimerangeValue(beginTime, endTime))
    }

    exports.init = function () {

        var host = location.hostname;
        var mainPageContainer = $(this.element);
        var autoQuerys = setQuery();
        var inited = false;
        var firstUrl = true;

        Simplite.addFilter('formatLogTime', formatLogTime);
        Simplite.addFilter('formatBillMessage', formatBillMessage);
        Simplite.addFilter('formatDigest', formatDigest);
        Simplite.addFilter('formatDigest2', formatDigest2);
        Simplite.addFilter('formatTitleSetting', formatTitleSetting);
        Simplite.addFilter('formatAwardMessage', formatMessage);

        // 线下才显示
        if (host != 'bamai.xiaojukeji.com') {
            $('.offline').show();
        }

        mainPageContainer.on('dblclick', '.toggle', function () {
            $(this).toggleClass('fold');
            $(this).toggleClass('code');
        });

        // 设置json格式化功能
        mainPageContainer.on('click', '.json-view', function jsonView() {
            sessionStorage.setItem('json-data', $(this).html());
            window.open('/jsonView');
        });

        // table 排序
        mainPageContainer.on('click', '.sort', function sort() {

            var $this = $(this);
            var tbody = $('#' + $this.data('sortFor')).find('tbody');

            $this.find('.active').removeClass('active').siblings().addClass('active');

            if (tbody.size()) {
                var trs = tbody.find('tr');
                for (var i = trs.length - 1; i >= 0; i--) {
                    tbody.append(trs[i]);
                }
            }
        });

        $('.main-page .nav-tabs').on('shown.bs.tab', function (e) {
            var target = $(e.target);
            var feedback = feedbackMaps[target.data('index')];
            if (feedback && feedback.params.moduleUrl) {
                window.location.hash = store.get(feedback.params.moduleUrl).split('#')[1];
            } else if (feedback && !firstUrl){
                window.location.hash = '?tabIndex=' + target.data('index');
            }

            firstUrl = false;
            
            emitter.fire('reset_star');
        });

        emitter.on('reset_star', function () {
            var url = window.location.pathname + window.location.search + window.location.hash;
            if (store.get('stared') && store.get('stared')[url]) {
                $('.star-action').addClass('stared');
            } else {
                $('.star-action').removeClass('stared');
            }
        });

        emitter.on('reset_query', function (data) {
            window.location.hash = utils.refreshQuery(data.query, data.flag, true);
        });

        emitter.on('auto_query', function (data) {
            var querys = autoQuerys;
            var index = data.index;
            var queryId = querys.queryBtn;
            if (!inited && queryId && querys.tabIndex == index) {
                $('.main-page .nav-tabs a:eq(' + (querys.tabIndex ? querys.tabIndex - 1 : 0) + ')').tab('show');
                $('#' + queryId).trigger('click');
                inited = true;
            }
            if (!inited && !queryId){
                inited = true;
                $('.main-page .nav-tabs a:eq(' + (querys.tabIndex ? (querys.tabIndex  - 1) : 0 )+ ')').tab('show');
            }
        });

        emitter.on('reset_timerange', function (data) {
            resetTimeRange(data.key, autoQuerys, data.keyStartTime, data.keyEndTime);
        });

        emitter.on('update_feedback', function (data) {
            var feedback = feedbackMaps[data.index];
            feedback.updateModuleUrl(data.queryUrl);
            feedback.show();
            emitter.fire('reset_star');
        });

        emitter.on('init_feedBack', function (data) {
            
            var feedback = new FeedBack({
                params: {
                    moduleUrl: data.queryUrl
                },
                element: $(data.ele)
            });

            feedback.on('resolve', function (params) {
                service.feedbackSave({
                    resolve: 1,
                    module: params.moduleUrl
                }).done(function () {
                    alert('多谢您的反馈');
                });
                feedback.hide();
            });

            feedback.on('reject', function (params) {
                service.feedbackSave({
                    resolve: 0,
                    module: params.moduleUrl
                }).done(function () {
                    alert('多谢您的反馈,我们稍后会联系您');
                });
                feedback.hide();
            });

            feedbackMaps[data.index] = feedback;
        });
    };
});