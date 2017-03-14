define(function (require, exports) {

    var service = require('service/eq-main');
    var emitter = require('common/eventEmitter');
    var select = require('common/select/list/list');
    require('./DateTimePicker');

    var params = {
        equipId: 14
    };
    var params2 = {
        equipId: params.equipId,
        timeoutTime: '',
        timeoutStatus: '0',
    };
    var room = {
        "room1": [{
            title: '投影机',
            value: 14,
            checked: true
        }],
        "room2": [{
            title: '电视',
            value: 15,
            checked: true
        }]
    };
    var equipList = room['room1'];
    var renderRoomSelect = function () {
        new select.init({
            container: $('.tvPage').find('.roomBox'),
            selectList: [{
                title: '卧室1',
                value: 'room1',
                checked: true
            }, {
                title: '客厅',
                value: 'room2'
            }],
            clickCallback: function (value) {
                equipList = room[value];
                $('.tvPage').find('.equipBox').html('');
                renderEquipSelect();
                params.equipId = equipList[0].value;
                getStatus();
            }
        });
    };
    var renderEquipSelect = function () {
        new select.init({
            container: $('.tvPage').find('.equipBox'),
            selectList: equipList,
            clickCallback: function (value) {
                params.equipId = value;
                getStatus();
            }
        });
    };
    var getStatus = function () {
        service.getStatus({
            params: params,
            success: function (data) {
                var response1 = JSON.parse(data.responseText);
                if (response1.status.code === 0) {
                    // if (response1.result.status === 1) {
                    //     $('.light').removeClass('light-D').addClass('light-L');
                    // } else {
                    //     $('.light').removeClass('light-L').addClass('light-D');
                    // }
                } else {
                    alert(response1.status.reason);
                }
            }
        });
    };
    var setStatus = function () {
        service.setStatus({
            params: params,
            success: function (data) {
                var response2 = JSON.parse(data.responseText);
                if (response2.status.code === 0) {
                    // if ($('.light').hasClass('light-L')) {
                    //     $('.light').removeClass('light-L').addClass('light-D');
                    // } else {
                    //     $('.light').removeClass('light-D').addClass('light-L');
                    // }
                getStatus();
                } else {
                    alert(response2.status.reason);
                }
            }
        });
    };

    exports.init = function () {
        var container = this;
        var tabIndex = 1;
        getStatus();
        renderRoomSelect();
        renderEquipSelect();
        emitter.fire('auto_query', { index: tabIndex });
    };

    $('.tvPage').find('.icon-off').on('click', function () {
        setStatus();
    });
});
