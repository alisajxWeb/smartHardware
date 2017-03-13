define(function (require, exports) {

    var service = require('service/eq-main');
    var emitter = require('common/eventEmitter');
    var select = require('common/select/list/list');
    require('./DateTimePicker');

    var params = {
        equipId: 1
    };
    var params2 = {
        equipId: params.equipId,
        timeoutTime: '',
        timeoutStatus: '0',
    };
    var room = {
        "room1": [{
            title: '台灯',
            value: 1,
            checked: true
        }, {
            title: '落地灯1',
            value: 2
        }, {
            title: '射灯',
            value: 3
        }, {
            title: '吊灯',
            value: 4
        }],
        "room2": [{
            title: '吊灯',
            value: 5,
            checked: true
        }, {
            title: '射灯',
            value: 6
        }],
        "room3": [{
            title: '台灯',
            value: 7,
            checked: true
        }]
    };
    var equipList = room['room1'];
    var renderRoomSelect = function () {
        new select.init({
            container: $('.labPage').find('.roomBox'),
            selectList: [{
                title: '卧室1',
                value: 'room1',
                checked: true
            }, {
                title: '客厅',
                value: 'room2'
            }, {
                title: '儿童房',
                value: 'room3'
            }],
            clickCallback: function (value) {
                equipList = room[value];
                $('.labPage').find('.equipBox').html('');
                renderEquipSelect();
                params.equipId = equipList[0].value;
                getStatus();
            }
        });
    };
    var renderEquipSelect = function () {
        new select.init({
            container: $('.labPage').find('.equipBox'),
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
                if (response1.status.statusCode === 0) {
                    if (response1.result.status === 1) {
                        $('.light').removeClass('light-D').addClass('light-L');
                    } else {
                        $('.light').removeClass('light-L').addClass('light-D');
                    }
                } else {
                    alert(response1.status.statusReason);
                }
            }
        });
    };
    var setStatus = function () {
        service.setStatus({
            params: params,
            success: function (data) {
                var response2 = JSON.parse(data.responseText);
                if (response2.status.statusCode === 0) {
                    // if ($('.light').hasClass('light-L')) {
                    //     $('.light').removeClass('light-L').addClass('light-D');
                    // } else {
                    //     $('.light').removeClass('light-D').addClass('light-L');
                    // }
                getStatus();
                } else {
                    alert(response2.status.statusReason);
                }
            }
        });
    };

    var setTimeout = function () {
        service.timeOut({
            params: params2,
            success: function (data) {
                var response3 = JSON.parse(data.responseText);
                if (response3.status.statusCode === 0) {
                    alert('设置成功！');
                } else {
                    alert(response3.status.statusReason);
                }
            }
        });
    };
    exports.init = function () {
        var container = this;
        var tabIndex = 1;
        getStatus();
        $('.labPage').find("#lightBox").DateTimePicker();
        renderRoomSelect();
        renderEquipSelect();
        emitter.fire('auto_query', { index: tabIndex });
    };

    $('.labPage').find('.icon-off').on('click', function () {
        setStatus();
    });
    $('.labPage').find('.radio').on('click', function () {
        var value = this.value;
        params2.timeoutStatus = value === '0' ? '0' : '1';
    });
    $('.labPage').find('.js-button').on('click', function () {
        var timeSet = $.trim($('.labPage').find('.timeSet').val());
        if(timeSet!=='') {
            params2.equipId = params.equipId,
            params2.timeoutTime = timeSet,
            setTimeout();
        } else {
            alert('请设置时间')
        }
    });
});