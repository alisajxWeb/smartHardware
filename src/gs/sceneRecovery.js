define(function (require, exports) {

    var Autocomplete = require('component/widgets/autocomplete/autocomplete');
    var FilterMenu = require('component/widgets/filtermenu/filtermenu');
    var utils = require('common/utils');
    var emitter = require('common/eventEmitter');
    var Validator = require('common/Validator');
    var service = require('service/gs-main');
    var cityInfos = require('service/city');
    var Combine = require('exports/combine/combine');

    var pageState = {
        district: '',
        tripId: '',
        hasShowAll: false
    };

    function initDateRangePicker(beginQuery, endQuery) {

        var rangeDom = $('#sceneRecoveryTimeRange');
        var startTimeDom = $('#sceneRecoveryBeginTime');
        var endTimeDom = $('#sceneRecoveryEndTime');
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
        params.sceneRecoveryType = $.trim($('#sceneRecoveryType').val());
        params.sceneRecoveryQueryInfo = $.trim($('#sceneRecoveryQueryInfo').val());
        params.beginTime = $.trim($('#sceneRecoveryBeginTime').val());
        params.endTime = $.trim($('#sceneRecoveryEndTime').val());
        return params;
    }

    function initValidator(container) {
        var v = new Validator({
            rules: {
                required: function (isRequired) {
                    var val = this.value;
                    if (isRequired === 'false') {
                        if (!val) {
                            return {
                                force: true
                            }
                        } else {
                            return true;
                        }
                    } else {
                        return val.length > 0;
                    }
                }
            },
            elements: {
                sceneRecoveryQueryInfo: ['required:true']
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

    function autoQuery(timerangepicker, tabIndex, container) {
        var beginTime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        var endTime = moment().format('YYYY-MM-DD HH:mm:ss');

        var querys = utils.getQuery(true);
        var result = {};
        for (var key in querys) {
            result[key] = decodeURIComponent(querys[key]);
        }

        if (result.isTrip == 1) {
            pageState.hasShowAll = true;
            pageState.district = result.district; 
            pageState.tripId = result.tripId;
        }

        beginTime = result.beginTime || beginTime;
        endTime = result.endTime || endTime;


        $('#sceneRecoveryBeginTime').val(beginTime);
        $('#sceneRecoveryEndTime').val(endTime);

        timerangepicker.setStartDate(beginTime);
        timerangepicker.setEndDate(endTime);

        return result;
    }

    function formatUrl(list) {
        var beginTime = $('#sceneRecoveryBeginTime').val();
        var endTime = $('#sceneRecoveryEndTime').val();
        list.forEach(function (item) {
            if (item.traceId) {
                item.href = 'http://trace.didichuxing.com/trace/' + item.traceId;
            }

            if (item.orderId) {
                item.href = '/gs/main#?beginTime=' + encodeURIComponent(beginTime) + '&endTime=' + encodeURIComponent(endTime) + '&queryBtn=sceneRecoveryQuery&tabIndex=8&sceneRecoveryType=orderId&sceneRecoveryQueryInfo=' + item.orderId;
            }
        });
        return list;
    }

    function formatDataSource(data) {

        var cityMap = {};
        if (cityInfos && cityInfos.length) {
            cityInfos.forEach(function (city) {
                cityMap[city.id] = city.name;
            });
        }

        (function converPointsPosition() {
            data.driverTrips.forEach(function (item) {
                var point = utils.Convert_BD09_To_GCJ02(+item.lat, +item.lng);
                item.lat = point[0];
                item.lng = point[1]; 
            });

            for (var key in data.passengerTrips) {
                data.passengerTrips[key].forEach(function (item) {
                    var point = utils.Convert_BD09_To_GCJ02(+item.lat, +item.lng);
                    item.lat = point[0];
                    item.lng = point[1]; 
                });
            }
        })();

        function formatOrderList(orderInfos, messages) {
            if (orderInfos.length === 0 && messages.length !== 0) {
                orderInfos.push({
                    orderId: messages[0].orderId
                });
                return orderInfos;
            } else {
                return orderInfos.map(function (item, index) {
                    var orderItem = JSON.parse(item.args.slice(0, -1));
                    orderItem.area = cityMap[orderItem.area] || orderItem.area;
                    return $.extend({}, { startTime: item.startTime, endTime: item.endTime, orderId: item.orderId }, orderItem);
                });
            }
        }

        function formatOrderMessages(messages) {
            (messages || []).forEach(function (item) {
                item.href = 'http://trace.didichuxing.com/trace/' + item.traceId + '?index=zhuanche*';
            });
            return messages || [];
        }

        function formatDriverLine(data) {
            
            var orderInfos = data.orderInfos || [];
            var points = data.driverTrips || [];
            var result = {}, key = 'time';

            for (var j = 0; j < orderInfos.length; j++) {
                var order = orderInfos[j];
                if (order.startTime && order.endTime) {
                    var startTime = utils.parseToDate(order.startTime).getTime() / 1000;
                    var endTime = utils.parseToDate(order.endTime).getTime() / 1000;
                    result[order.orderId] = [];
                    for(var i = 0, len = points.length; i < len; i++) {
                        var point = points[i];
                        var keyValue = point[key];
                        if (!!keyValue) {
                            keyValue = Number(keyValue);
                            if (keyValue >= startTime && keyValue <= endTime) {
                                result[order.orderId].push(point);
                            }
                        }
                    }
                } else {
                    result[order.orderId] = points.slice(0);
                }

                if (!result[order.orderId].length) {
                    
                    result[order.orderId].push({
                        lat: order.lat || order.flat || order.tlat,
                        lng: order.lng || order.flng || order.tlng
                    })
                }
            }

            return result;
        }

        function formatDriverTip(data) {
            var result = {};
            var orderInfos = data.orderInfos || [];

            for (var j = 0; j < orderInfos.length; j++) {
                var order = orderInfos[j];
                result[order.orderId] = (data.passengerKeyEvents[order.orderId] || []).filter(function (item, index){
                    if (item.lat && item.lng && Number(item.lat) > 0 && Number(item.lng) > 0 && (item.eventType != null )) {
                        return ',4,5,6,9,10,12,'.indexOf(',' + item.eventType + ',') !== -1 || ',0,1,2,4,5,8,9,10,11,12,'.indexOf(item.orderStatus) !== -1 ;
                    }
                    return false;
                });
            }

            return result;
        }


        function formatPassengerTip(data) {
            var result = {};
            var orderInfos = data.orderInfos || [];

            for (var j = 0; j < orderInfos.length; j++) {
                var order = orderInfos[j];
                result[order.orderId] = (data.passengerKeyEvents[order.orderId] || []).filter(function (item, index){
                    if (item.lat && item.lng && Number(item.lat) > 0 && Number(item.lng) > 0 && (item.eventType != null )) {
                        return ',1,2,3,7,8,11,'.indexOf(',' + item.eventType + ',') !== -1 || ',3,6,7,'.indexOf(item.orderStatus) !== -1 ;
                    }
                    return false;
                });
            }

            return result;
        }

        function formatDriverPosition(data) {
            return formatDriverTip(data);
        }

        function formatPassengerPosition(data) {
            return formatPassengerTip(data);
        }


        data.orderInfos = formatOrderList(data.orderInfos, data.messages);
         
        var result = {
            showAllBtn: data.isTrip == 1 && !pageState.hasShowAll,
            orderInfos: data.orderInfos,
            orderMessages: formatOrderMessages(data.messages),
            driverLine: formatDriverLine(data),
            driverTip: formatDriverTip(data),
            driverPosition: formatDriverPosition(data),
            passengerLine: data.passengerTrips,
            passengerTip: formatPassengerTip(data),
            passengerPosition: formatPassengerPosition(data)
        };

        return result;
    }

    exports.init = function sceneInit() {

        Simplite.addFilter('formatMsg', function formatMsg(errno) {
            return errs.getErrMsg(errno);
        });

        var container = this.element;
        var tabIndex = 8;
        var inited = false;

        // init timerange
        var timerangepicker = initDateRangePicker();

        // initValidator
        var validator = initValidator(container);

        var combine = new Combine({
            element: container.find('.data-list-wrap'),
        });

        combine.on('pluginManagerShowAllTrip', function () {
            var params = seriesParams(timerangepicker);
            params.isTrip = '1';
            params.district = pageState.district;
            params.tripId = pageState.tripId;
            emitter.fire('reset_query', {
                query: $.extend({}, params, { tabIndex: tabIndex, queryBtn: 'sceneRecoveryQuery' }),
                flag: true
            });

            var promiseObj = service.getOrderGrids(params);

            promiseObj.promise.done(function (data) {
                pageState.hasShowAll = true;
                emitter.fire('update_feedback', {
                    index: tabIndex,
                    queryUrl: promiseObj.url
                });
                combine.render(formatDataSource(data), 'order');
            });
        });

        container
            .on('click', '.query-btn', function search() {
                validator.validate().done(function (result) {
                    if (result) {
                        var params = seriesParams(timerangepicker);
                        var promiseObj;
                        $('body').addClass('fold');

                        if (!inited && utils.getQuery(true).isTrip == '1') {
                            params.isTrip = '1';
                            params.district = pageState.district;
                            params.tripId = pageState.tripId;
                            inited = true;
                        } else {
                            pageState.hasShowAll = false;
                            params.tripId = params.sceneRecoveryQueryInfo;
                            params.isTrip = '0';
                            inited = true;
                        }

                        emitter.fire('reset_query', {
                            query: $.extend({}, params, { tabIndex: tabIndex, queryBtn: 'sceneRecoveryQuery' }),
                            flag: true
                        });

                        if (params.sceneRecoveryType !== 'orderId') {
                            promiseObj = service.query(params);
                            promiseObj.promise.done(function (resp) {
                                emitter.fire('update_feedback', {
                                    index: tabIndex,
                                    queryUrl: promiseObj.url
                                });
                                combine.render({ list: formatUrl(resp.messages) });
                            });
                        } else {
                            promiseObj = service.getOrderGrids(params); 
                            promiseObj.promise.done(function (data) {
                                emitter.fire('update_feedback', {
                                    index: tabIndex,
                                    queryUrl: promiseObj.url
                                });
                                if (data.district) {
                                    pageState.district = data.district;
                                }
                                if (data.tripId) {
                                    pageState.tripId = data.tripId;
                                }
                                combine.render(formatDataSource(data), 'order');
                            });
                        }
                    }
                });
            });

        container.find('.form-inline').on('keydown', function (e) {
            if (e.keyCode === 13) {
                container.find('.query-btn').click();
            }
        });

        autoQuery(timerangepicker, tabIndex, container);

        emitter.fire('init_feedBack', {
             ele: container.find('.feedback-container'),
             index: tabIndex 
        });

        emitter.fire('auto_query', { index: tabIndex });
    };
});