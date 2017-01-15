define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var service = require('service/common-main');


    function renderTable(messages) {
        return Simplite.render('bill-pre-order-tbody', { list: messages });
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
            $("#billPreOrderConclusion").html(conclusion.replace(/\|\|/g, '\<br\>'));
            $("#billPreOrderTable tbody").html(renderTable(messages));
        });
    }


    exports.init = function () {
        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 2;

        mainPageContainer.on('click', '#billPreOrderQuery', function () {
            var billPreOrderPhone = $.trim(mainPageContainer.find('#billPreOrderPhone').val());
            var billPreOrderBeginTime = $.trim(mainPageContainer.find('#billPreOrderBeginTime').val());
            var billPreOrderEndTime = $.trim(mainPageContainer.find('#billPreOrderEndTime').val());
            if (!billPreOrderPhone) {
                alert('请输入查询条件');
                return;
            }
            emitter.fire('reset_query', {
                query: {
                    billPreOrderPhone: billPreOrderPhone,
                    billPreOrderBeginTime: billPreOrderBeginTime,
                    billPreOrderEndTime: billPreOrderEndTime,
                    tabIndex: tabIndex,
                    queryBtn: 'billPreOrderQuery'
                },
                flag: true
            });
            var url = '/proxy/gs/billPreOrder/passengerPhone/' + billPreOrderPhone + '?beginTime=' + billPreOrderBeginTime + '&endTime=' + billPreOrderEndTime;
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
            key: 'billPreOrderTimeRange',
            keyStartTime: 'billPreOrderBeginTime',
            keyEndTime: 'billPreOrderEndTime'
        });
    };
});