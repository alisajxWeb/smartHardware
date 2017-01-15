define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var service = require('service/common-main');

    function renderTable(messages) {
        return Simplite.render('pay-bill-tbody', { list: messages });
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
            $("#payBillConclusion").html(conclusion.replace(/\|\|/g, '\<br\>'));
            $("#payBillTable tbody").html(renderTable(messages));
        });
    }

    exports.init = function () {
        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 6;

        mainPageContainer.on('click', '#payBillQuery', function () {
            var payBillOrderId = $.trim(mainPageContainer.find('#payBillOrderId').val());
            var payBillBeginTime = $.trim(mainPageContainer.find('#payBillBeginTime').val());
            var payBillEndTime = $.trim(mainPageContainer.find('#payBillEndTime').val());
            if (!payBillOrderId) {
                alert('请输入查询条件');
                return;
            }
            
            emitter.fire('reset_query', {
                query: {
                    payBillOrderId: payBillOrderId,
                    payBillBeginTime: payBillBeginTime,
                    payBillEndTime: payBillEndTime,
                    tabIndex: tabIndex,
                    queryBtn: 'payBillQuery'
                },
                flag: true
            });
            
            var url = '/proxy/gs/payBill/orderId/' + payBillOrderId + '?beginTime=' + payBillBeginTime + '&endTime=' + payBillEndTime;
            createQueryTask(url).done(function () {
                emitter.fire('update_feedback', {
                    index: tabIndex,
                    queryUrl: url
                });
            });;
        });



        emitter.fire('auto_query', { index: tabIndex });
        emitter.fire('init_feedBack', {
            ele: me.find('.feedback-container'),
            index: tabIndex
        });
        
        emitter.fire('reset_timerange', {
            key: 'payBillTimeRange',
            keyStartTime: 'payBillBeginTime',
            keyEndTime: 'payBillEndTime'
        });
    }

});