define(function (require, exports) {

    var SceneMap = require('component/widgets/scenemap/scenemap');
    var FilterMenu = require('component/widgets/filtermenu/filtermenu');

    var emitter = require('common/eventEmitter');
    var Validator = require('common/Validator');
    var loadQQMap = require('common/loadMap');
    var utils = require('common/utils');
    var service = require('service/freeride-main');
    var store = require('common/store');

    var dataSource, globalFilters, sceneMap;

    var pageState = {
        district: '',
        tripId: '',
        hasShowAll: false
    };

    function initMap(data, mapInstance, container) {
        container.find('.map-container').show();
        if (!sceneMap) {
            sceneMap = new SceneMap({
                mapInstance: mapInstance,
                container: container.find('.map-container'),
                mapTool: container.find('.map-tool'),
                mapCanvas: container.find('.map-canvas'),
                dataSource: data
            });
        } else {
            sceneMap.reset();
            sceneMap.update(data);
        }
    }

    function initDateRangePicker(container, beginQuery, endQuery) {
        var rangeDom = container.find('.time-range');
        var startTimeDom = container.find('.js-input-beginTime');
        var endTimeDom = container.find('.js-input-endTime');
        rangeDom.daterangepicker(
            {
                startDate: beginQuery || moment().startOf('day'),
                endDate: endQuery || moment().add(1, 'days').startOf('day'),
                timePicker: true,
                timePicker12Hour: false,
                linkedCalendars: true,
                separator: ' 到 ',
                format: 'YYYY-MM-DD HH:mm:ss',
                opens: 'right',
                ranges: {
                    '今天': [moment(moment().format('YYYY-MM-DD') + ' 00:00:00'), moment()],
                    '昨天': [moment(moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'), moment(moment().format('YYYY-MM-DD') + ' 00:00:00')],
                    '近7天': [moment().subtract(6, 'days'), moment()]
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
        var daterangepicker = rangeDom.data('daterangepicker');
        return daterangepicker;
    }

    function autoQuery(container, tabIndex) {

        var querys = utils.getQuery(true);
        var result = {};
        for (var key in querys) {
            result[key] = decodeURIComponent(querys[key]);
        }

        var beginTime = result.beginTime || moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss');
        var endTime = result.endTime || moment().format('YYYY-MM-DD HH:mm:ss');
        var beginTimeDom = container.find('.js-input-beginTime');
        var endTimeDom = container.find('.js-input-endTime');
        var rangeDom = container.find('.time-range');
        var timerangepicker = rangeDom.data('daterangepicker');
        var orderIdDom = container.find('.js-input-order');

        beginTimeDom.val(beginTime);
        endTimeDom.val(endTime);
        orderIdDom.val(result.orderId || '');

        timerangepicker.setStartDate(beginTime);
        timerangepicker.setEndDate(endTime);

        emitter.fire('auto_query', { tabIndex: tabIndex, queryBtn: container.find('.query-btn') });
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
                restoreTimeRange: ['required:true'],
                orderId: ['required:true']
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
        var params = {
            orderId: $.trim(container.find('.js-input-order').val()),
            beginTime: $.trim(container.find('.js-input-beginTime').val()),
            endTime: $.trim(container.find('.js-input-endTime').val())
        }; 
        
        return params;
    }

    function updateMapTrace(dataSource, mapInstance, container) {
        var passengerKeyEvents = {};
        var passengerTrips = {};
        var driverTrips = {};
        if (dataSource.coordinates) {
            for (var i = 0; i < dataSource.coordinates.length; i++) {
                var tmp = dataSource.coordinates[i];
                passengerKeyEvents[tmp.orderId] = tmp.orderKeyCoordinates;
                passengerTrips[tmp.orderId] = tmp.passengerCoordinates;
                driverTrips[tmp.orderId] = tmp.driverCoordinates;
            }
        }
        var data = {
            driverTrips: driverTrips,
            passengerKeyEvents: passengerKeyEvents,
            passengerTrips: passengerTrips,
            orderInfos: dataSource.orderList || []
        };
        initMap(data, mapInstance, container);
    }

    function updateTimeTrace(orderList) {
        var cls = ['one', 'two', 'three', 'four', 'five', 'six'];
        var prefix = ['cls-'];
        var clsMap = {};
        var i = 0;
        orderList.forEach(function (item) {
            if (!clsMap[item.orderId]) {
                item.cls = prefix + (cls[i] || 'other');
                clsMap[item.orderId] = item.cls;
                i++;
            } else {
                item.cls = clsMap[item.orderId];
            }
        });
        var html = Simplite.render('freeride-order-time-tbody', { list: orderList || [] });
        $('.js-order-time-trace-table tbody').html(html);
        return clsMap;
    }

    function updateOrderList(dataSource, clsMap) {
        var html = Simplite.render('freeride-order-item-tbody', { list: dataSource.orderList, hasShowAll: pageState.hasShowAll, isTrip: pageState.isTrip, tripId: pageState.tripId });
        $('.js-order-list').html(html);
    }

    function formatOrderList(orderInfos, clsMap) {
        return orderInfos.map(function (item, index) {
            var startTime = moment(item.createTime).unix();
            var endTime = moment(item.arriveTime).unix();
            var cls = clsMap[item.orderId] || 'cls-other';
            return $.extend({}, { cls: cls, startTime: startTime, endTime: endTime }, item);
        });
    }

    function converPoints(dataSource) {
        dataSource.coordinates && dataSource.coordinates.forEach(function (obj) {
            obj.passengerCoordinates && obj.passengerCoordinates.forEach(function (item) {
                var point = utils.Convert_BD09_To_GCJ02(+item.lat, +item.lng);
                item.lat = point[0] + '';
                item.lng = point[1] + '';
            });
            obj.driverCoordinates && obj.driverCoordinates.forEach(function (item) {
                var point = utils.Convert_BD09_To_GCJ02(+item.lat, +item.lng);
                item.lat = point[0] + '';
                item.lng = point[1] + ''; 
            });
        });
    }

    function updateUI(dataSource, mapInstance, container) {
        var clsMap = updateTimeTrace(dataSource.messages);
        converPoints(dataSource);
        dataSource.orderList = formatOrderList(dataSource.basicInfos, clsMap); 
        updateOrderList(dataSource);
        updateMapTrace(dataSource, mapInstance, container);
    }

    function filterData(filters, dataSource) {
        return dataSource.filter(function filterRules(item) {
            var result = true;
            for (var key in filters) {
                var checkedList = filters[key].getData().checkedList; 
                var exists = false;
                for (var i = 0; i < checkedList.length; i++) {
                    if (checkedList[i] === item[key]) {
                        exists = true;
                        break;
                    }
                }
                result = result && exists;
                if (!result) {
                    break;
                }
            }
            return result;
        });
    }

    function filterFatal(orderList, traceid) {
        var result = (orderList || []).filter(function (item) {
            return logLevel === 'FATAL' && item.traceid === traceid
        });
        return result[0];
    }

    function initFiltersUI(container) {
        var filters = {};
        $.each($('.need-filter', container), function (index, item) {
            filters[$(item).data('key')] = new FilterMenu({
                element: $(item)
            });
            filters[$(item).data('key')].on('resolve', function (data) {
                updateTimeTrace(filterData(globalFilters, dataSource.messages));
            });
        })
        
        return filters;
    }

     function updateFilters(filters, dataSource) {

        function mapToArray(map) {
            var result = [];
            for (var key in map) {
                result.push(map[key]);
            }
            return result;
        }

        var flatMap = {};

        for (var key in filters) {
            flatMap[key] = {};
        }

        for (var i = 0, len = dataSource.length; i < len; i++) {
            var tmp = dataSource[i];
            for (var key in flatMap) {
                var arr = flatMap[key];
                if (tmp[key] != null) {
                    arr[tmp[key]] = {
                        code: tmp[key],
                        txt: tmp[key]
                    };
                }
            }
        }

        for (var key in filters) {
            filters[key].render({ filters: mapToArray(flatMap[key]) });
        }
    }

    exports.init = function restoreInit() {
        var container = this.element;

        var daterangepicker = initDateRangePicker(container);

        var validator = initValidator(container);

        var tabIndex = 2;

        var mapInstance;

        // init filters
        globalFilters = initFiltersUI(container);

        emitter.on('module_change', function (data) {
            if (+data.tabIndex === tabIndex) {
            }
        });

        Simplite.addFilter('formatErrorNo', function (item) {
            if (item.errno != 0) {
                return '<strong style="color:#f00">errno：' + item.errno + '</strong>'
            }
            return '';
        });

        container
            .on('click', '.toggle-msg-btn', function () {
                var icon = $(this).find('.glyphicon');
                var tr = $(this).parent().next();
                var traceid = $(this).parent().data('trace');
                if (icon.hasClass('glyphicon-triangle-right')) {
                    icon.removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                    tr.find('.view').each(function (index, item) {
                        var initedJson = $(item).attr('inited') == 1;
                        if (!initedJson) {
                            var jsonStr = $(item).data('jsonstr');
                            if ($(item).parent().attr('id').indexOf('fatal') === -1) {
                                if (jsonStr.lastIndexOf('.') !== -1) {
                                    jsonStr = jsonStr.slice(0, -1);
                                } 
                            } else {
                                jsonStr = JSON.stringify(filterFatal(dataSource.messages, traceid) || {});
                            }
                            $(item).html(utils.formatJSON(JSON.parse(jsonStr), true));
                            $(item).attr('inited', 1);
                        }
                    });
                    
                } else {
                    icon.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                }
                tr.toggle();
                return false;
            })
            .on('click', '.show-all-btn', function () {
                var params = seriesParams(container);
                params.isTrip = '1';
                params.orderId = pageState.tripId;
                service.getOrderGrids(params).done(function (data) {
                    dataSource = data;
                    pageState.hasShowAll = true;
                    updateUI(data, mapInstance, container);
                    updateFilters(globalFilters, dataSource.messages);
                });
            })
            .on('click', ':checkbox[name="orderSelected"]', function () {
                var checked = $(this).prop('checked');
                var value = this.value;
                $('.js-order-time-trace-table .tr-detail[data-order="' + value + '"]').hide();
                $('.js-order-time-trace-table .click-trigger[data-order="' + value + '"]')[checked ? 'show' : 'hide']();
                $('.js-order-time-trace-table .glyphicon-triangle-bottom').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
            })
            .on('click', '.query-btn', function query(){
                validator.validate().done(function (result) {
                    if (result) {
                        var params = seriesParams(container);
                        emitter.fire('fresh_query',$.extend(true, { needAuto: 1, tabIndex: tabIndex }, params));
                        service.getOrderGrids(params).done(function (data) {
                            dataSource = data;
                            if (data.basicInfos && data.basicInfos.length) {
                                pageState.tripId = data.basicInfos[0].carpoolId;
                                pageState.isTrip = data.basicInfos[0].isCarpool;
                            }
                            updateUI(data, mapInstance, container);
                            updateFilters(globalFilters, dataSource.messages);
                            emitter.fire('update_feedback', {
                                index: tabIndex,
                                queryUrl: store.get(window.location.pathname + window.location.search + window.location.hash)
                            });
                        });
                    }
                })
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

        loadQQMap(function () {
            autoQuery(container, tabIndex);
            mapInstance = new qq.maps.Map(container.find('.map-canvas')[0], {
                scrollwheel: false,
                zoom: 13,
            });
        });
    };
});