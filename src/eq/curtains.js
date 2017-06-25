define(function (require, exports) {

    var service = require('service/eq-main');
    var emitter = require('common/eventEmitter');
    var select = require('common/select/list/list');
    require('./DateTimePicker');

    var params = {
        "equipId": '0',
        "status": '0',
        "timeoutTime": '',
        "timeoutStatus": '0',
    };
    var info = '';
    var roomArr = [];
    var equipLists = {};
    var equipList = equipLists['room1'];

    var renderRoomSelect = function () {
       var count = 0;
        var info = JSON.parse(sessionStorage.getItem('info'));
        for(var key in info) {
            if(key === '窗帘') {
                info = info[key];
                for(var key2 in info){
                    var tempHash = {title: '',value: '', checked: false};
                    if(key2 !== ''){
                        count ++;
                        tempHash.title = key2;
                        tempHash.value = 'room' + count;
                        if(count === 1) {
                            tempHash.checked = true;
                        }
                        roomArr.push(tempHash);
                    }
                }
            }
        }
        var i = 0;
        var len1 = roomArr.length;
        for(i; i < len1; i++) {
            var j = 0;
            var roomNum = roomArr[i].value;
            var roomName = roomArr[i].title;
            equipLists[roomNum] = [];
            var roomN = info[roomName];
            var len2 = roomN.length;
            for(j; j< len2; j++){
                var temp = {title: '', value: '', checked: false };
                temp.value = roomN[j].id;
                temp.title = roomN[j].name;
                if(j === 0){
                    temp.checked = true;
                }
                equipLists[roomNum].push(temp);
            }
        }
        equipList = equipLists['room1'];
        new select.init({
            container: $('.cutainsPage').find('.roomBox'),
            selectList: roomArr,
            clickCallback: function (value) {
                equipList = equipLists[value];
                $('.cutainsPage').find('.equipBox').html('');
                renderEquipSelect();
                params.equipId = equipList[0].value;
                getStatus();
            }
        });

    };
    var renderEquipSelect = function () {
        new select.init({
            container: $('.cutainsPage').find('.equipBox'),
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
                        $('.curtains-img').attr("src", "/img/open.png");
                        params.status = '1'; 
                    } else if(response1.result.status === '0'){
                        $('.curtains-img').attr("src", "/img/close.png");
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

    exports.init = function () {
        var container = this;
        var tabIndex = 1;
        getStatus(true);
        renderRoomSelect();
        renderEquipSelect();
        emitter.fire('auto_query', { index: tabIndex });
    };

    $('.cutainsPage').find('.icon-off').on('click', function () {
        params.status = params.status ==='0' ? '1': '0';
        setStatus();
    });
});
