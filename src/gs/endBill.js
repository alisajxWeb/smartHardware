define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var service = require('service/common-main');

    function renderTable(messages) {
        return Simplite.render('end-bill-tbody', { list: messages });
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
            $("#endBillConclusion").html(conclusion.replace(/\|\|/g, '\<br\>'));
            $('#endBillTable tbody').html(renderTable(messages));
        });
    };

    exports.init = function () {

        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 5;

        mainPageContainer.on('click', '#endBillQuery', function () {
            var endBillType = $.trim(mainPageContainer.find('#endBillType').val());
            var endBillQueryInfo = $.trim(mainPageContainer.find('#endBillQueryInfo').val());
            var endBillBeginTime = $.trim(mainPageContainer.find('#endBillBeginTime').val());
            var endBillEndTime = $.trim(mainPageContainer.find('#endBillEndTime').val());
            if (!endBillQueryInfo) {
                alert('请输入查询条件');
                return;
            }
            emitter.fire('reset_query', {
                query: {
                    endBillType: endBillType,
                    endBillQueryInfo: endBillQueryInfo,
                    endBillBeginTime: endBillBeginTime,
                    endBillEndTime: endBillEndTime,
                    tabIndex: tabIndex,
                    queryBtn: 'endBillQuery'
                },
                flag: true
            });
            var url = '/proxy/gs/endBill';
            if (endBillType === 'billOrder') {
                url = url + '/orderId/';
            } else {
                url = url + '/passengerPhone/';
            }
            url = url + endBillQueryInfo + '?beginTime=' + endBillBeginTime + '&endTime=' + endBillEndTime;
            createQueryTask(url).done(function () {
                emitter.fire('update_feedback', {
                    index: tabIndex,
                    queryUrl: url
                });
            });
        });

        emitter.fire('auto_query', { index: tabIndex });
        emitter.fire('init_feedBack', {
             ele: me.find('.feedback-container'),
             index: tabIndex 
        });
        emitter.fire('reset_timerange', {
            key: 'endBillTimeRange',
            keyStartTime: 'endBillBeginTime',
            keyEndTime: 'endBillEndTime'
        });
    };

});