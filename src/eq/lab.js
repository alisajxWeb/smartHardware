define(function (require, exports) {

    var service = require('service/eq-main');
    var emitter = require('common/eventEmitter');
    var select = require('common/select/list/list');
    require('./DateTimePicker');

    var params = {
        "equipId": '1',
        "status": '0',
        "timeoutTime": '',
        "timeoutStatus": '0',
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
    var getStatus = function (isFirst) {
        service.getStatus({
            params: params,
            success: function (data) {
                var response1 = data;
                if (response1.status.code === 0) {
                    if (response1.result.status === '1') { 
                        $('.light').removeClass('light-D').addClass('light-L'); 
                        params.status = '1'; 
                    } else if(response1.result.status === '0'){
                        $('.light').removeClass('light-L').addClass('light-D');
                        params.status = '0';
                    } else {
                        params.status = '0';
                        setStatue();
                        alert('已调整为关闭状态');
                    }
                } else {
                    !isFirst &&
                    alert(response1.status.reason);
                }
            }
        });
    };
    var setStatus = function () {
        service.setStatus({
            params: params,
            success: function (data) {
                var response2 = data;
                if (response2.status.code === 0) {
                    getStatus();
                } else {
                    alert(response2.status.reason);
                }
            }
        });
    };

    var setTimeout = function () {
        service.timeOut({
            params: params,
            success: function (data) {
                var response3 = data;
                if (response3.status.code === 0) {
                    alert('设置成功！');
                } else {
                    alert(response3.status.reason);
                }
            }
        });
    };
    exports.init = function () {
        var container = this;
        var tabIndex = 1;
        $('.labPage').find("#lightBox").DateTimePicker();
        getStatus(true);
        renderRoomSelect();
        renderEquipSelect();
        emitter.fire('auto_query', { index: tabIndex });
    };

    $('.labPage').find('.icon-off').on('click', function () {
        params.status = params.status ==='0' ? '1': '0';
        setStatus();
    });
    $('.labPage').find('.radio').on('click', function () {
        var value = this.value;
        params.timeoutStatus = value === '0' ? '0' : '1';
    });
    $('.labPage').find('.js-button').on('click', function () {
        var timeSet = $.trim($('.labPage').find('.timeSet').val());
        if(timeSet!=='') {
            params.equipId = params.equipId,
            params.timeoutTime = timeSet,
            setTimeout();
        } else {
            alert('请设置时间')
        }
    });
});
