define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var Validator = require('common/Validator');
    var rules = require('common/rules');
    var OrderDetailPlugin = require('exports/restore/plugins/orderdetailplugin/orderDetailPlugin');
    var MapHelper = require('component/widgets/maphelper/maphelper');
    var Searchbar = require('component/widgets/searchbar/searchbar');
    var service = require('service/btb-main');
    var cityInfos = require('service/city');
    var cityMap = {};
    var tabIndex = 1;
    var format = 'YYYY-MM-DD HH:mm:ss';
    var mainFlow, currentList, orderListObj;
    var pOrederId = 'x_order_id';
    var pMainIndex = 'x_index';
    var cls = ['cls-one', 'cls-two', 'cls-three', 'cls-four', 'cls-five'];

    var colors = {
        'cls-one': '#d0e9c6', 
        'cls-two': '#c6d0de',
        'cls-three': '#fdd1a5',
        'cls-four': '#fcf8e3',
        'cls-five': '#1cd8c0'
    };

    var payType = {
        '20': '满足条件且企业余额足够用户选择个人支付',
        '21': '使用企业余额支付',
        '22': '个人支付',
        '23': '个人支付（需报销）',
        '24': '企业用户不满足报销条件'
    };

    var needLevelUpMsg = {
        'queryPayChannelList': true,
        '/gulfstream/order/v2/passenger/pNewOrder': true,
    };

    var apiMaps = {
        '/gulfstream/api/v1/passenger/pGetEstimatePriceCoupon': '预估',    
        '/zeus/iapi/CompanyPay/V1/getUserPayPermission': '前置获取支付权限',
        '/gulfstream/order/v2/passenger/pNewOrder': '创建订单',
        '/zeus/iapi/CompanyPay/V1/newOrder': '创建订单',
        'CompanyPay_neworder': '创建订单',
        '/gulfstream/driver/v2/driver/dFinishOrderNew': '结束计费',
        '/zeus/iapi/CompanyPay/V1/getUserPayStatus': '后置获取支付权限',
        '/gulfstream/api/v1/passenger/pGetOrderDetail': '获取订单详情',
        '/gulfstream/pay/v1/cashier/getFeeDetail': '获取支付详情',
        '/zeus/iapi/CompanyPay/V1/freezeAmount': '冻结余额',
        '/zeus/iapi/CompanyPay/V1/orderPay': '订单支付',
        '/gulfstream/pay/v1/cashier/passengerBillPay/index': '下发乘客账单',
        '/gulfstream/pay/v1/cashier/processOrderReceipt/collect': '下发乘客账单',
        'queryPayChannelList': '查询支付渠道列表',
        '/gulfstream/api/v1/passenger/pPrePay': '发起支付',
        '/zeus/iapi/CompanyPay/V1/reApply': '申请报销',
        '/zeus/iapi/CompanyPay/V1/isVip': '查询是否为企业用户',
        'createPayOrder': '创建支付订单',
        '/paris/app_v1/Create/quick': '创建订单执行冻结余额',
        '/paris/app_v1/Prepay/quick': '发起支付执行冻结余额',
        '/paris/app_v1/Pay/quick': '执行支付冻结余额',
        '/zeus/iapi/CompanyPay/V1/reimbursement': '申请报销'
    };

    var mainSteps = [
        {
            name: '预',
            urls: ['/zeus/iapi/CompanyPay/V1/isVip', '/zeus/iapi/CompanyPay/V1/getUserPayPermission']
        },
        {
            name: '创',
            urls: ['/gulfstream/order/v2/passenger/pNewOrder', '/paris/app_v1/Create/quick']
        },
        {
            name: '账',
            urls: ['/gulfstream/pay/v1/cashier/passengerBillPay/index', '/gulfstream/pay/v1/cashier/processOrderReceipt/collect', 'queryPayChannelList', '/zeus/iapi/CompanyPay/V1/getUserPayStatus']
        },
        {
            name: '单',
            urls: ['/gulfstream/api/v1/passenger/pGetOrderDetail', 'queryPayChannelList', '/zeus/iapi/CompanyPay/V1/getUserPayStatus', '/zeus/iapi/CompanyPay/V1/freezeAmount']
        },
        {
            name: '付',
            urls: ['/gulfstream/api/v1/passenger/pPrePay', 'queryPayChannelList', '/paris/app_v1/Prepay/quick']
        }
    ];

    var mainWork = (function (arr){
        var results = {};
        arr.forEach(function (item) {
            item.urls.forEach(function (url) {
                results[url] = true;
            });
        });
        return results;

    })(mainSteps);

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

    function getOrderWorkStatusList (allWorkList, orderId) {
        var lastIndex = 0;
        var result = allWorkList.filter(function (m) {
            return m[pOrederId] == orderId;
        });

        var getMessagesFromResult = function (urls) {
            var urls = '#' + urls.join('#') + '#';
            return result.filter(function (m) {
                return urls.indexOf('#' + m.apiName + '#') != -1 ;
            });
        };

        var getFirstStepResult = function (urls) {
            var firstStep = result[0], orderPreStop = 0;
            var messages = [];

            for (var i = allWorkList.length - 1; i >= 0; i--) {
                if (firstStep.apiName === allWorkList[i].apiName && firstStep.traceid === allWorkList[i].traceid && firstStep.logTime === allWorkList[i].logTime){
                    orderPreStop = i;
                    break;
                } 
            }

            for (var j = orderPreStop - 1; j >= 0; j--) {
                if (allWorkList[j].apiName == urls[1]) {
                    messages.push(allWorkList[j]);
                    break;
                }
            }

            for (var k = orderPreStop - 1; k >= 0; k--) {
                if (allWorkList[k].apiName == urls[0]) {
                    messages.push(allWorkList[k]);
                }
            }
            return messages;
        };

        return mainSteps.map(function (item, index) {
            var temps = index ? getMessagesFromResult(item.urls) : getFirstStepResult(item.urls);
            var cls = '', tmp = true, x = -1;
            if (temps.length > 0) {
                temps.forEach(function (m) {
                    tmp = tmp && !+m.errno;
                    if (x === -1 && !tmp) {
                        x = m[pMainIndex];
                    }
                });
                if (x === -1) {
                    x = temps[0][pMainIndex]
                }
                cls = tmp ? 'success' : 'error';
            }
            return {
                name: item.name,
                cls: cls,
                id: index,
                index: x === -1 ? '' : x
            }; 
        });
    }

    function renderStepTip(container) {
        var orderList = container.find('.js-order-list').find('.exports-plugin-orderdetail-container');
        orderList.each(function (index, item) {
            $(item).find('.exports-plugin-orderdetail-step-item').each(function (index, step) {
                var list = '<div class="step-tips"><ul>' + mainSteps[$(step).data('id')].urls.map(function (url) {
                    return '<li>' + url + '-' + apiMaps[url] + '</li>';
                }).join('') + '</ul></div>';
                $(step).append(Simplite.render('btb-step-template', { str: list }));
            });
        });
    }

    function renderOrderList(container, mainFlow) {
        orderListObj.dispose();
        if (mainFlow && mainFlow.length) {
            var traceOrderListMap = {};
            var orderList = [];

            var orderMessageList = mainFlow.filter(function (message) {
                return message.apiName === '/gulfstream/order/v2/passenger/pNewOrder';
            });

            var allWorkList = mainFlow.filter(function (item, index) {
                item[pMainIndex] = index;
                return !!mainWork[item.apiName];
            });

            orderMessageList.forEach(function (item) {
                var tmp = item.children; 
                var inx = tmp[0];
                var outx = tmp[1];
                if (inx && outx && (typeof inx.in === 'object')) {
                    try {
                        var orderInfo = $.extend(true, {}, inx.in);
                        orderInfo.orderId = item.orderId;
                        orderInfo.color = colors[item.cls];
                        orderInfo.area = cityMap[orderInfo.area];
                        orderList.push(orderInfo);
                    } catch(e) {
                        console.log(e);
                    }
                }
            });

            try {
                orderList.forEach(function (order) {
                    orderListObj.render({
                        key: order.orderId,
                        dataSource: order,
                        mainWorkList: getOrderWorkStatusList(allWorkList, order.orderId)
                    });
                });
                if (orderList.length > 1) {
                    container.addClass('mutiply-order').removeClass('only-order');
                } else {
                    container.removeClass('mutiply-order').addClass('only-order');
                }
                renderStepTip(container);
            }  catch (e) {
                console.log(e);
            }
        }
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
        (list || []).forEach(function (item, index){
            var inArgs, out, extInfo;
            if (item.in) {
                if (item.in.slice(-1) === '.') {
                    try {
                        var msg = '个人支付';
                        inArgs = JSON.parse(item.in.slice(0, -1));
                        if (item.apiName === '/gulfstream/order/v2/passenger/pNewOrder') {
                            if (inArgs.user_pay_info) {
                                inArgs.user_pay_info = decodeURIComponent(inArgs.user_pay_info);
                                msg = payType[JSON.parse(inArgs.user_pay_info)['pay_type']];
                            }
                            if (item.msg) {
                                item.msg = item.msg + '||' + msg;
                            } else {
                                item.msg = msg;
                            }
                        }

                        if (item.apiName === '/gulfstream/api/v1/passenger/pPrePay') {
                            if (inArgs.business_pay_type) {
                                msg = payType[inArgs.business_pay_type];
                            }
                            if (item.msg) {
                                item.msg = item.msg + '||' + msg;
                            } else {
                                item.msg = msg; 
                            }
                        }   
                    } catch (e) {
                        inArgs = item.in;
                    }
                } else {
                    inArgs = item.in;
                }
            }
            if (item.out) {
                if (item.out.slice(-1) === '.') {
                    try {
                        out = JSON.parse(item.out.slice(0, -1));
                    } catch (e) {
                        out = item.out;
                    }
                } else {
                    out = item.out;
                }
            }

            if (item.extInfo) {
                if (item.extInfo.slice(-1) === '.') {
                    try {
                        extInfo = JSON.parse(item.extInfo.slice(0, -1));
                    } catch (e) {
                        extInfo = item.extInfo;
                    }
                } else {
                    extInfo = item.extInfo;
                }
            }

            if (item.message) {
                item.message = item.message.replace(/(\\u)(\w{4}|\w{2})/gi, function($0,$1,$2){  
                    return String.fromCharCode(parseInt($2,16));  
                });   
            }

            item.in = inArgs;
            item.out = out;
            item.extInfo = extInfo;
        });
    }

    function renderMainUI(container, response) {
        var tbody = container.find('.table .list');
        var i = 0, clsMap = {};
        if (response && response.messages && response.messages.length) {
            mainFlow = response.btbMainFlow;
            currentList = response.messages;
            formatMessages(currentList);

            var maps = listToMap(currentList);

            for (var key in maps) {
                var results = maps[key].filter(function (item) {
                    return !!item.orderId;
                });
                if (results.length) {
                    var tmpOrderId = results[0].orderId;
                    maps[key].forEach(function (item) {
                        item[pOrederId] = tmpOrderId;
                    });
                }
            }

            mainFlow.forEach(function (item) {
                if (item.logType !== 'btb') {
                    item.children = maps[item.traceid] || [];
                    item.children.forEach(function (m) {
                        if (m.msg && needLevelUpMsg[m.apiName]) {
                            item.msg = m.msg;
                        }
                    });
                } else {
                    var msgsMap = {}, msgsAttr = [];
                    item.children = (maps[item.traceid] || []).filter(function (m) {
                        return m.apiName === item.apiName;
                    });
                    item.children.forEach(function (m) {
                        msgsMap[m.msg] = true;
                    });
                    for (var key in msgsMap) {
                        msgsAttr.push(key);
                    }
                    item.msg = msgsAttr.join('||');
                }

                if (item.children.length) {
                    item[pOrederId] = item.children[0][pOrederId];
                }
            });

            mainFlow.forEach(function (item) {
                var orderIds = item.children.filter(function (m) {
                    return !!m.orderId;
                });

                if (orderIds.length) {
                    item.orderId = orderIds[0].orderId;
                }

                var errno = true;

                item.children.forEach(function (m) {
                    errno = errno && !(+m.errno);
                });
                
                item.errno = errno ? '0' : '1';
            });

            mainFlow.forEach(function (item) {
                if (item.orderId) {
                    item.cls = clsMap[item.orderId] || (clsMap[item.orderId] = cls[i++]);
                }
            });


            tbody.html(Simplite.render('btb-scene-main-item', { list: mainFlow }));

        } else {
            tbody.html(Simplite.render('btb-pay-empty'));            
        }

        renderOrderList(container, mainFlow);
        
        container.find('.conclusion-text').html((response.conclusion || '').replace(/\|\|/g, '<br/>'));
    }

    function resetList(container) {
        var list = container.find('.table .list');
        list.find('.tr-selected').removeClass('tr-selected');
        list.find('.hilight-word').removeClass('hilight-word');
    }

    function initOrderList(container) {
        return new OrderDetailPlugin({
            element: container.find('.js-order-list-wrap')
        });
    }

    exports.init = function () {
        var container = this.element;
        var validator = initValidator();
        var mapHelper = new MapHelper();
        var searchbar = new Searchbar();

        searchbar.on('search', function (data) {
            var key = data.text;

            if (!key) {
                return false;
            }

            var list = container.find('.table .list');
            var selectedIndex = [];
            resetList(container);

            mainFlow.forEach(function (mainItem, mainIndex) {
                mainItem.children.forEach(function (item, index) {
                    if((item.message || '').indexOf(key) !== -1) {
                        selectedIndex.push(mainIndex + '_' + index);
                    }
                })
            });

            selectedIndex.forEach(function (item) {
                var indx = item.split('_');
                list.find('tr[data-extend-index="' + indx[0]+ '"]').addClass('tr-selected');
                list.find('tr.js-normal-' + indx[0] + ':eq(' + indx[1] + ')').addClass('tr-selected');
                $('#btb_message_' + item).find('pre').html(mainFlow[indx[0]].children[indx[1]].message.replace(new RegExp('(' + key + ')', 'ig'), '<span class="hilight-word">$1</span>'))
            });

            searchbar.setResultNum(selectedIndex.length);
        });

        searchbar.on('reset', function () {
            resetList(container);
        });

        mapHelper.initMap();

        if (cityInfos && cityInfos.length) {
            cityInfos.forEach(function (city) {
                cityMap[city.id] = city.name;
            });
        }

        orderListObj = initOrderList(container);

        Simplite.addFilter('formatInArgs', function formatInArgs(inArgs) {
            if (inArgs) {
                return '<pre>' + utils.formatJSON(inArgs, true) + '</pre>';;;
            } else {
                return '';
            }
        });

        Simplite.addFilter('formatOutArgs', function formatOutArgs(out) {
            if (out) {
                return '<pre>' + utils.formatJSON(out, true) + '</pre>';
            } else {
                return '';
            }
        });

        Simplite.addFilter('formatExtInfo', function formatExtInfo(extInfo) {
            if (extInfo) {
                return '<pre>' + utils.formatJSON(extInfo, true) + '</pre>';
            } else {
                return '';
            }
        });

        Simplite.addFilter('formatApiName', function formatApiName(item) {
            var type = ({'btb': '企业级', 'gs': '专快车', 'pay': '公共支付'}[item.logType]);
            var result = [];
            result.push(type);
            if(apiMaps[item.apiName]) {
                result.push(apiMaps[item.apiName]);
            }
            return result.join('-');
        });

        Simplite.addFilter('formatDigest',  function formatDigest(digest) {
            return Simplite.filters.escape(digest || '').replace(/(\|\|)+/g, '\<br\/\>');
        });

        initDateRangePicker(container);

        container
            .on('click', '.query-btn', function () {
                validator.validate().done(function (result) {
                    if (result) {
                        var params = seriesParams(container);
                        emitter.fire('fresh_query', $.extend(true, { needAuto: 1, tabIndex: tabIndex }, params));
                        var obj = service.getMainLogList(params);
                        obj.promise.done(function (response) {
                            emitter.fire('update_feedback', {
                                index: tabIndex,
                                queryUrl: obj.url
                            });
                            renderMainUI(container, response);
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
                var tr = $(this).parents('.tr-normal').next();
                if (icon.hasClass('glyphicon-triangle-right')) {
                    icon.removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                } else {
                    icon.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                }
                tr.toggle();
            });

        container
            .on('click', '.js-lng-lat', function () {
                var me = $(this);
                var lngLat = me.text().split(',');
                mapHelper.show();
                mapHelper.addPoints({
                    lng: +lngLat[0],
                    lat: +lngLat[1],
                    name: lngLat.join('-')
                });
            })
            .on('click', '.js-toggle-search-log', function () {
                var filter = container.find('.filter'); 
                filter.toggle();
                filter.find('.reset-btn').click();
            })
            .on('click', '.exports-plugin-orderdetail-step-item', function () {
                var index = $(this).data('index');
                if (index) {
                    var top = $('.tr-main:eq(' + index + ')').offset().top;
                    $(window).scrollTop(top - 80);
                }
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