define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var service = require('service/common-main');

    function renderTable(messages) {
        return Simplite.render('begin-bill-tbody', { list: messages });
    }

    function createQueryTask(url) {
        return service.query(url).done(function (data) {
            var conclusion = data.conclusion;
            var messages = data.messages;
            if (!messages) {
                messages = [];
            }
            if (!conclusion) {
                conclusion = "";
            }
            $("#beginBillConclusion").html(conclusion.replace(/\|\|/g, '\<br\>'));
            $("#beginBillTable tbody").html(renderTable(messages));
        });
    }

    exports.init = function () {
        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 3;
        me.on('click', '#beginBillQuery', function () {
            var beginBillType = $.trim(mainPageContainer.find('#beginBillType').val());
            var beginBillQueryInfo = $.trim(mainPageContainer.find('#beginBillQueryInfo').val());
            var beginBillBeginTime = $.trim(mainPageContainer.find('#beginBillBeginTime').val());
            var beginBillEndTime = $.trim(mainPageContainer.find('#beginBillEndTime').val());
            if (!beginBillQueryInfo) {
                alert('请输入查询条件');
                return;
            }
            emitter.fire('reset_query', {
                query: {
                    beginBillType: beginBillType,
                    beginBillQueryInfo: beginBillQueryInfo,
                    beginBillBeginTime: beginBillBeginTime,
                    beginBillEndTime: beginBillEndTime,
                    tabIndex: tabIndex,
                    queryBtn: 'beginBillQuery'
                },
                flag: true
            });
            var url = '/proxy/gs/beginBill';
            if (beginBillType === 'billOrder') {
                url = url + '/orderId/';
            } else {
                url = url + '/passengerPhone/';
            }
            url = url + beginBillQueryInfo + '?beginTime=' + beginBillBeginTime + '&endTime=' + beginBillEndTime;
            createQueryTask(url).done(function () {
                emitter.fire('update_feedback', {
                    index: tabIndex,
                    queryUrl: url
                });
            });
        });

        emitter.fire('auto_query', { index: 3 });
        emitter.fire('init_feedBack', {
             ele: me.find('.feedback-container'),
             index: tabIndex 
        });
        emitter.fire('reset_timerange', {
            key: 'beginBillTimeRange',
            keyStartTime: 'beginBillBeginTime',
            keyEndTime: 'beginBillEndTime'
        });
    };
});