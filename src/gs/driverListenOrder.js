define(function (require, exports) {

    var service = require('service/common-main');
    var emitter = require('common/eventEmitter');


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
            $("#driverListenOrderConclusion").html(formatConclusion(conclusion, data));
            $('#driverListenOrderTable tbody').html(renderTable(messages));
        });
    }



    exports.init = function () {
        var container = this;
        var tabIndex = 1;


        // mainPageContainer.on('change', '#dlQueryChoose', function () {
        //     var dlQueryChoose = $("#dlQueryChoose").val();
        // });

        // mainPageContainer.on('click', '#gs_sdp_public', function () {
        //     if ($("#gs_sdp_public").get(0).checked) {
        //         $('.gs_sdp_public').show();
        //     } else {
        //         $('.gs_sdp_public').hide();
        //     }
        // });

            // emitter.fire('reset_query', {
            //     query: {
            //         dlArea: dlArea,
            //         dlQueryInfo: dlQueryInfo,
            //         dlQueryChoose: dlQueryChoose,
            //         dlBeginTime: dlBeginTime,
            //         dlEndTime: dlEndTime,
            //         tabIndex: tabIndex,
            //         queryBtn: 'driverListenQuery'
            //     },
            //     flag: true
            // });
            // var url = '/proxy/gs/driverListen';
            // if (dlQueryChoose === '1') {
            //     url = url + '/phone/' + dlQueryInfo;
            // }
        //     url = url + '?beginTime=' + dlBeginTime + '&endTime=' + dlEndTime;
        //     $("#gs_sdp_public").prop("checked", true);
        //     $("#gs_api_filter_order").prop("checked", true);
        //     $("#gs_api_change_model").prop("checked", true);
        //     $("#gs_strategy_access").prop("checked", true);
        //     $("#gs_strategy_public").prop("checked", true);
        //     createQueryTask(url).done(function () {
        //         emitter.fire('update_feedback', {
        //             index: tabIndex,
        //             queryUrl: url
        //         });
        //     });
        // });

        emitter.fire('auto_query', { index: tabIndex });
    };
});