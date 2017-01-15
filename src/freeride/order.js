define(function (require, exports) {

    var Autocomplete = require('component/widgets/autocomplete/autocomplete');
    var FilterMenu = require('component/widgets/filtermenu/filtermenu');
    var utils = require('common/utils');
    var emitter = require('common/eventEmitter');
    var bindFun = require('common/bindFun');
    var Validator = require('common/Validator');
    var store = require('common/store');
    var service = require('service/freeride-main');

    var errs = require('./errno');

    var dataSource, globalFilters;

    var keys = ['', 'logTime', 'digest', 'urlkey', 'errno', 'uid', 'orderId', 'uri', 'traceid', 'procTime', 'clientHost', 'logid'];

    var urlKeyList = [
        '/beatles/api/passenger/order/create-乘客创建订单',
        '/beatles/api/passenger/order/getinfo-乘客获取订单详情',
        '/beatles/api/passenger/order/pay-乘客支付',
        '/beatles/api/passenger/order/cancel-乘客取消订单',
        '/beatles/api/passenger/order/terminate-乘客中止订单',
        '/beatles/api/passenger/order/increase-乘客加价',
        '/beatles/api/passenger/order/getongoing-乘客上车',
        '/beatles/api/passenger/order/calculatecost-获取预估价格',
        '/beatles/api/driver/order/confirmarrive-司机确认上车',
        '/beatles/api/driver/order/strive-司机确认抢单',
        '/beatles/api/driver/order/getongoing-司机确认到达起点',
        '/beatles/api/driver/order/getinfo-司机获取订单详情',
        '/beatles/api/driver/order/terminate-司机中止订单',
        '/beatles/api/driver/order/search-司机查询附近订单',
        '/beatles/api/driver/order/onewaylist-获取临时路线订单',
        '/beatles/api/driver/order/onceagain-获取再抢一单',
        '/beatles/api/driver/order/nearbylist-司机查询附近订单',
        '/beatles/api/driver/order/matchlist-司机固定路线订单',
        '/beatles/api/driver/order/getpricedetail-司机获取计价详情',
        '/beatles/api/driver/order/crosscitylist-查看跨城订单',
        '/beatles/api/user/user/passengerhome-乘客首页信息',
        '/beatles/api/user/user/driverhome-司机首页信息',
        '/beatles/api/user/user/homev2-首页信息（废弃）',
        '/beatles/api/user/user/home-首页信息（废弃）',
        '/beatles/api/user/user/getuserinfo-获取当前用户信息',
        '/beatles/api/user/user/gettodoorder-获取待处理订单',
        '/beatles/api/user/user/getlocationreportconfig-获取地理位置信息',
        '/beatles/api/user/user/getcommonconfig-通用配置信息',
        '/beatles/api/user/user/getcityconfig-城市配置信息',
        '/beatles/api/user/user/center-用户中心',
        '/beatles/api/user/user/card_v2-用户卡片信息',
        '/beatles/api/user/user/card-用户卡片信息（废弃）',
        '/beatles/api/user/user/apm',
        '/beatles/api/user/social/synccontacts',
        '/beatles/api/user/social/matchlist',
        '/beatles/api/user/social/followlist',
        '/beatles/api/user/social/follow',
        '/beatles/api/user/social/contacts',
        '/beatles/api/user/social/cancelfollow',
        '/beatles/api/user/rtp/quit-共享位置退出',
        '/beatles/api/user/rtp/query-当前共享位置信息查询',
        '/beatles/api/user/rtp/join-加入共享位置',
        '/beatles/api/user/rtp/heartbeat-共享位置心跳',
        '/beatles/api/user/rtp/create-创建共享位置',
        '/beatles/api/user/rtp/confirm-确认加入共享位置',
        '/beatles/api/user/route/update',
        '/beatles/api/user/route/getlist',
        '/beatles/api/user/route/delete',
        '/beatles/api/user/route/add',
        '/beatles/api/user/profile/upload',
        '/beatles/api/user/profile/setting',
        '/beatles/api/user/profile/setimstatus',
        '/beatles/api/user/profile/getimstatus',
        '/beatles/api/user/profile/get',
        '/beatles/api/user/order/remindlist',
        '/beatles/api/user/order/getorderlist-获取订单列表',
        '/beatles/api/user/order/deleteorder',
        '/beatles/api/user/order/complain',
        '/beatles/api/user/order/addtag',
        '/beatles/api/user/lbs/lbs',
        '/beatles/api/user/coupon/getlist',
        '/beatles/api/user/block/userlist-获取黑名单列表',
        '/beatles/api/user/block/add-添加用户黑名单',
        '/beatles/api/platform/order/getpayorderdetail',
        '/beatles/api/passenger/route/searchcityshare',
        '/beatles/api/passenger/route/getroutedetail',
        '/beatles/api/passenger/order/getrecommenduser',
        '/beatles/api/passenger/order/getpushnum2',
        '/beatles/api/passenger/order/getpushnum',
        '/beatles/api/passenger/order/getpricedetail',
        '/beatles/api/passenger/order/couponmbp',
        '/beatles/api/passenger/driver/getaround-获取附近司机',
        '/beatles/api/im/user/getinfo',
        '/beatles/api/driver/route/update-临时路线更新',
        '/beatles/api/driver/route/unpublish-临时路线取消',
        '/beatles/api/driver/route/publish-临时路线发布',
        '/beatles/api/driver/route/getlist-获取临时路线',
        '/beatles/api/driver/route/delete-删除临时路线',
        '/beatles/api/driver/route/add-添加临时路线',
        '/beatles/api/driver/profile/driverreg-车主注册',
        '/beatles/api/driver/passenger/getaround-获取附近乘客',
        '/beatles/api/automatch/passenger/accept-乘客确认自动同行',
        '/beatles/api/automatch/passenger/check-乘客接受自动同行检查',
        '/beatles/api/automatch/passenger/getinfo-乘客查看自动同行详情',
        '/beatles/api/automatch/driver/close-车主关闭自动同行',
        '/beatles/api/automatch/driver/getsetting-乘客设置自动同行',
        '/beatles/api/automatch/driver/open-车主打开自动同行',
    ];

    function initDateRangePicker(beginQuery, endQuery) {
        var rangeDom = $('#orderTimeRange');
        var startTimeDom = $('#orderBeginTime');
        var endTimeDom = $('#orderEndTime');
        rangeDom.daterangepicker(
            {
                startDate: beginQuery || moment().startOf('day'),
                endDate: endQuery || moment().add(1, 'days').startOf('day'),
                timePicker: true,
                timePicker12Hour: false,
                linkedCalendars: true,
                separator: ' 到 ',
                format: 'YYYY-MM-DD HH:00',
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
                var beginTime = start.format('YYYY-MM-DD HH:00:00');
                var endTime = end.format('YYYY-MM-DD HH:00:00');
                $(startTimeDom).val(beginTime);
                $(endTimeDom).val(endTime);
            });
        var daterangepicker = rangeDom.data('daterangepicker');
        return daterangepicker;
    }

    function initUrlSelected() {
        var mapToKVData = urlKeyList.map(function mapToKV(item) {
            return {
                name: item,
                code: '#' + item.split('-')[0]
            }
        });
        return new Autocomplete({
            element: '#urlKey',
            data: mapToKVData
        });
    }

    function initFiltersUI(container) {
        var filters = {};
        $.each($('.need-filter', container), function (index, item) {
            filters[$(item).data('key')] = new FilterMenu({
                element: $(item)
            });
            filters[$(item).data('key')].on('resolve', function (data) {
                renderData(filterData(globalFilters, dataSource));
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
                        txt: key === 'errno' ? (tmp[key] ? errs.getErrMsg(tmp[key]) : '') : tmp[key]
                    };
                }
            }
        }

        for (var key in filters) {
            filters[key].render({ filters: mapToArray(flatMap[key]) });
        }
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

    function renderData(data, uncheckedList) {
        var html = Simplite.render('freeride-order-tbody', { list: data, keys: keys });
        (uncheckedList || []).forEach(function hideCol(key) {
            $('.js-key-' + key, html).hide();
        });
        $('#orderTable .tbody').html(html);
    }

    function appendData(data, uncheckedList) {
        var html = $(Simplite.render('freeride-order-tbody', { list: data, keys: keys }));
        (uncheckedList || []).forEach(function hideCol(key) {
            $('.js-key-' + key, html).hide();
        });
        $('#orderTable .tbody').append(html);
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
                orderTimeRange: ['required:true']
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

    function initColumnsFilter() {
        var columnsFilter = new FilterMenu({
            element: $('[data-key="orderTable"]')
        });
        columnsFilter.render({
            filters: keys.slice(1).map(function (key) {
                var txt = ({ logTime: '时间', digest: '摘要' }[key]);
                return {
                    code: key,
                    txt:  (txt ? txt : key)
                };
            })
        });
        columnsFilter.on('resolve', function (data) {
            var checkedList = data.checkedList;
            var uncheckedList = data.uncheckedList;
            uncheckedList.forEach(function hideCol(key) {
                $('.js-key-' + key).hide();
            });
            checkedList.forEach(function showCol(key) {
                $('.js-key-' + key).show();
            })
        })
        return columnsFilter;
    }

    function initTHKeys() {
        $.each($('#orderTable .thead > div'), function addClass(index, item){
            $(item).addClass('js-key-' + keys[index]);
        });
    }

    function initInfinityScroll(cb) {
        var prev = 0;
        var minAlt = 20;
        var offsetFixed = 100;
        var screenHeight = document.documentElement.clientHeight;

        bindFun($(document), 'scroll', function () {
            if (!dataSource) return false;
            var height = $(document).height();
            var scrollTop = $(document).scrollTop();
            
            if ( scrollTop - prev > minAlt && (scrollTop + screenHeight + offsetFixed) >= height) {
                prev = scrollTop;
                cb && cb()
            }

        }, 300);
    }

    function seriesParams(timerangepicker, urlKeySelector, pager) {
        var params = {};
        var selectedUrl = urlKeySelector.getData();
        params.beginTime = $.trim($('#orderBeginTime').val());
        params.endTime = $.trim($('#orderEndTime').val());
        params.param = {
            phone: $.trim($('#orderPhone').val()) || undefined,
            order_id: $.trim($('#orderNO').val()) || undefined,
            urlkey: selectedUrl ? selectedUrl.code.substring(1) : undefined,
            log_level: $.trim($('#logLevel').val()) || undefined,
            indice: $.trim($('#indice').val()) || undefined,
            result_from: (pager.page - 1) * pager.pageSize,
            result_size: pager.pageSize
        };
        return params;
    }

    function autoQuery(timerangepicker, tabIndex, container) {
        var beginTime = moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00';
        var endTime = moment().format('YYYY-MM-DD') + ' 23:00:00';
        
        var querys = utils.getQuery(true);
        var result = {};
        for (var key in querys) {
            result[key] = decodeURIComponent(querys[key]);
        }

        beginTime = result.beginTime || beginTime;
        endTime = result.endTime || endTime; 
        $('#orderPhone').val(result.phone || '');
        $('#orderNO').val(result.order_id || '');
        $('#orderBeginTime').val(beginTime);
        $('#orderEndTime').val(endTime);
        $('#logLevel').val(result.log_level || '');
        $('#urlKey').val(result.urlkey || '');
        $('#indice').val(result.indice || 'beatles_api');

        timerangepicker.setStartDate(beginTime);
        timerangepicker.setEndDate(endTime);

        emitter.fire('auto_query', { tabIndex: tabIndex, queryBtn: $('#orderQuery')});
        return result;
    }

    exports.init = function orderInit() {


        Simplite.addFilter('formatMsg', function formatMsg(errno) {
            return errno ? errs.getErrMsg(errno) : '';
        });

        var container = this.element;

        var tabIndex = 1;

        var pager = {
            page: 1,
            pageSize: 200,
            hasMore: true
        };

        // init th keys
        initTHKeys();

        // init timerange
        var timerangepicker = initDateRangePicker();
        
        // init selected
        var urlKeySelector = initUrlSelected();

        // initValidator
        var validator = initValidator(container);

        // initColumnsFilter
        var columnFilter = initColumnsFilter();

        // initInfinityScroll
        initInfinityScroll(function () {
            var loading = false;
            return function () {
                if (loading || !pager.hasMore) { return };
                loading = true;
                pager.page++;
                service.getOrderList(seriesParams(timerangepicker, urlKeySelector, pager)).done(function (resp) {
                    loading = false;
                    var dataList = resp.messages || [];
                    if (dataList.length > 0) {
                        if (dataSource.reverseState) {
                            dataList.reverse();
                        }
                        for (var i = 0; i < dataList.length; i++) {
                            dataSource.push(dataList[i]);
                        }
                        appendData(dataSource, columnFilter.uncheckedList);
                        updateFilters(globalFilters, dataSource);
                    } else {
                        pager.hasMore = false;
                        container.find('.get-more').hide();
                    }
                });
            }
        }());

        // init filters
        globalFilters = initFiltersUI(container);

        container
            .on('click', '.sort', function sort() {
              $(this).find('.active').removeClass('active').siblings().addClass('active');
              dataSource && (dataSource.reverseState = !dataSource.reverseState);
              dataSource && renderData(filterData(globalFilters, dataSource.reverse()), columnFilter.uncheckedList);
            })
            .on('click', '.query-btn', function search() {
                validator.validate().done(function (result) {
                    if (result) {
                        pager.page = 1;
                        pager.hasMore = true;
                        var params = seriesParams(timerangepicker, urlKeySelector, pager);
                        emitter.fire('fresh_query', $.extend(true, { needAuto: 1, tabIndex: tabIndex }, params));
                        service.getOrderList(params).done(function (resp) {
                            dataSource = resp.messages;
                            renderData(dataSource);
                            updateFilters(globalFilters, dataSource);
                            container.find('.get-more').show();
                            emitter.fire('update_feedback', {
                                index: tabIndex,
                                queryUrl: store.get(window.location.pathname + window.location.search + window.location.hash)
                            });
                        });
                    }
                });
            })
            .on('click', '.toggle-msg-btn', function toggleMessage() {
                var icon = $(this);
                var tr = $(this).parent().parent().next();
                var initedJson = tr.find('.view').attr('inited') == 1;
                if (icon.hasClass('glyphicon-triangle-right')) {
                    icon.removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                    tr.find('.view').attr('inited', 1);
                    !initedJson && tr.find('.view').html(utils.formatJSON(tr.find('.view').data('json'), true))
                } else {
                    icon.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                }
                tr.toggle();
            });

        emitter.fire('init_feedBack', {
            ele: container.find('.feedback-container'),
            index: tabIndex
        }); 

        autoQuery(timerangepicker, tabIndex, container);
    };
});