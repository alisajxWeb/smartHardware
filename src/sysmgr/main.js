define(function (require, exports) {

    require('tpl!../../tpl/gs-main.tpl');

    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var service = require('service/common-main');
    var store = require('common/store');

    require('./user');

    var tableUtil = {
        sortTable: function ($this) {
            if ($this.hasClass('glyphicon-triangle-bottom')) {
                $this.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
            } else {
                $this.removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
            }
            var tbody = $this.closest('table').find('tbody');
            if (tbody.size()) {
                var trs = tbody.find('tr');
                for (var i = trs.length - 1; i >= 0; i--) {
                    tbody.append(trs[i]);
                }
            }
        },
        updateTable: function (id, datas, tplTr, type) {
            var mainPageContainer = $('body').find('.main-page');
            mainPageContainer.find('.sort').removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');

            var tbody = mainPageContainer.find('#' + id + ' tbody');
            var lineArr = [];
            var lineReg = /\$\{([^}]+)\}/g;

            $.each(datas, function (idx, item) {
                lineArr.push(tplTr.replace(lineReg, function (all, key) {
                    return tableUtil.beforeUpdateSet(key, item, type);
                }));
            });
            tbody.html(lineArr.join(''));
        },
        beforeUpdateSet: function (key, item, type) {
            var value = item[key] || '';
            value = value + '';
            value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (key === 'digest') {
                value = value.replace(/\|\|/g, '\<br\>');
            }
            return value;
        }
    };

    function setQuery() {
        var querys = utils.getQuery(true);
        for (var id in querys) {
            $('#' + id).val(querys[id]);
        }
        return querys;
    }

    function showTab(index) {
        index = index - 1;
        var ul = $('body').find('.main-page .nav-tabs');
        var container = ul.find(' > li');
        container.removeClass('active');
        $(container.get(index)).addClass('active');
        var contents = ul.parent().find('.table-responsive');
        $.each(contents, function (idx, item) {
            if (index === idx) {
                $(item).show();
            } else {
                $(item).hide();
            }
        });
    }

    function autoQueryClick(querys, index) {
        var queryId = querys.queryBtn;
        if (queryId && ((index && querys.tabIndex == index) || !index)) {
            $('#' + queryId).trigger('click');
        }
    };

    function resetQuery(key, value) {
        if (!key) {
            return '';
        }
        if (typeof key === 'string') {
            var keyMap = {};
            keyMap[key] = value;
            key = keyMap;
        }
        var args = [];
        for (var ki in key) {
            args.push(ki + '=' + key[ki]);
        }
        args.sort();
        return '?' + args.join('&');
    }

    function setTimerangeValue(beginDomId, endDomId) {
        var timerangeValue = function (start, end, label) {
            var beginTime = start.format('YYYY-MM-DD HH:mm') + ":00";
            var endTime = end.format('YYYY-MM-DD HH:mm') + ":00";
            console.log("A new date range was chosen: " + beginTime + ' to ' + endTime);
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
        
        // 线下才显示
        if (host != 'bamai.xiaojukeji.com') {
            $('.offline').show();
        }

        var userRole = store.get('userData').role || 'kf';
        $('.auth-' + userRole).removeClass('auth-' + userRole);

        mainPageContainer.find('.nav').on('click','.tab-event', function() {
		    showTab($(this).data('idx'));
	    });

        mainPageContainer.on('dblclick', '.toggle', function () {
            $(this).toggleClass('fold');
            $(this).toggleClass('code');
        });

        // 设置json格式化功能
        mainPageContainer.on('click', '.json-view', function jsonView() {
            sessionStorage.setItem('json-data', $(this).html());
	        window.open('/jsonView');
        });
        
        $('.sort').on('click', function () {
            tableUtil.sortTable($(this));
        });

        emitter.on('reset_query', function (data) {
            window.location.hash = resetQuery(data.query, data.flag);
        });

        emitter.on('auto_query', function (data) {
            autoQueryClick(autoQuerys, data.index);
        });

        emitter.on('reset_timerange', function (data) {
            resetTimeRange(data.key, autoQuerys, data.keyStartTime, data.keyEndTime);
        });

        emitter.on('update_table', function (data) {
            tableUtil.updateTable(data.key, data.item, data.tpl, data.type);
        });

        emitter.on('init_feedBack', function (data) {
            var conTipExist = $(data.ele).find('.feedback-content');
            if(conTipExist.length > 0) {
                return conTipExist.attr('queryUrl', encodeURIComponent(data.queryUrl));
            }

            var conTip = $(Simplite.render('feedback-dialog'));
            conTip.attr('queryUrl', encodeURIComponent(data.queryUrl));
            $(data.ele).append(conTip);
            conTip.on('click', '.btn-success', function () {
                var queryUrl = conTip.attr('queryUrl') 
                service.feedbackSave({
                    resolve: 1,
                    module: queryUrl
                }).done(function (){
                    alert('多谢您的反馈');
                });
                conTip.hide();
            });

            conTip.on('click', '.btn-danger', function () {
                var queryUrl = conTip.attr('queryUrl');
                service.feedbackSave({
                    resolve: 0,
                    module: queryUrl
                }).done(function (){
                    alert('多谢您的反馈,我们稍后会联系您');
                });
                conTip.hide();
            });

            conTip.show();
        });

        var autoQuerys = setQuery();
        showTab(autoQuerys.tabIndex || 1);
    };
});