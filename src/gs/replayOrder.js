define(function (require, exports) {

    var service = require('service/common-main');
    var emitter = require('common/eventEmitter');

    function renderTable(messages) {
        return Simplite.render('replay-order-tbody', { list: messages });
    }

    function createQueryTask(url) {
        return service.query(url).done(function (data) {

            var messages = [];
            $.each(data, function (idx, item) {
                var source = item._source;
                messages.push(source);
            });
            if (!messages) {
                messages = [];
            }

            $("#replayOrderConclusion").html(getConclusion(messages));
            $('#replayOrderTable tbody').html(renderTable(messages));
        });
    }

    function getConclusion(messages) {
        return messages.filter(function(item) {
            return (item.uri === '/gulfstream/order/v2/passenger/pNewOrder' && item.dltag === '_com_request_in' && item.args)
        }).map(function(item) {
            var args = item.args;
			var argsStr = args.substring(0, args.length - 1);
		    var argsJson = JSON.parse(argsStr);
		    var estimatePrice = argsJson.estimate_price || ' ';
		    var fromAddress = argsJson.fromAddress || ' ';
		    var toAddress = argsJson.toAddress || ' ';
		    var imei = argsJson.imei || ' ';
            return '订单预估价格:' + estimatePrice + '元<br>'
            + '上车地点:' + fromAddress + '<br>'
            + '目的地:' + toAddress + '<br>'
            + '乘客imei:' + imei + '<br>';       
        }).join('');
    }

    exports.init = function () {
        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 8;

        mainPageContainer.on('click', '#replayOrderQuery', function () {
            var replayOrderId = $.trim(mainPageContainer.find('#replayOrderId').val());
            var replayOrderBeginTime = $.trim(mainPageContainer.find('#replayOrderBeginTime').val());
            var replayOrderEndTime = $.trim(mainPageContainer.find('#replayOrderEndTime').val());
            if (!replayOrderId) {
                alert('请输入查询条件');
                return;
            }

            emitter.fire('reset_query', {
                query: {
                    replayOrderId: replayOrderId,
                    replayOrderBeginTime: replayOrderBeginTime,
                    replayOrderEndTime: replayOrderEndTime,
                    tabIndex: tabIndex,
                    queryBtn: 'replayOrderQuery'
                },
                flag: true
            });
            var url = '/holmesProxy/holmes/api/v1/traces/order/' + replayOrderId + '?format=order_replay_raw';
            createQueryTask(url).done(function () {
                emitter.fire('update_feedback', {
                    index: tabIndex,
                    queryUrl: url
                });
            });
        });

        emitter.fire('auto_query', { index: tabIndex });
        emitter.fire('init_feedBack', {
            ele: mainPageContainer.find('.feedback-container'),
            index: tabIndex
        });
        emitter.fire('reset_timerange', {
            key: 'replayOrderTimeRange',
            keyStartTime: 'replayOrderBeginTime',
            keyEndTime: 'replayOrderEndTime'
        });
    };
});