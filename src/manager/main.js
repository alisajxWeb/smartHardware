define(function (require, exports) {

    var utils = require('common/utils');
    var store = require('common/store');
    var service = require('service/common-main');
    var select = require('common/select/list/list');

    var rom =  '卧室1';
    var cls = '灯';
    var nam = '';

    var renderSelect = function () {
        new select.init({
            container: $('.eq-addAlert').find('.romBox'),
            selectList: [{
                title: '卧室1',
                value: '卧室1',
                checked: true
            }, {
                title: '客厅',
                value: '客厅'
            }, {
                title: '儿童房',
                value: '儿童房'
            }],
            clickCallback: function (value) {
                rom = value;
            }
        });
        new select.init({
            container: $('.eq-addAlert').find('.clsBox'),
            selectList: [{
                title: '灯',
                value: '灯',
                checked: true
            }, {
                title: '窗帘',
                value: '窗帘'
            }, {
                title: '空调',
                value: '空调'
            }, {
                title: '电视',
                value: '电视'
            }],
            clickCallback: function (value) {
                cls = value;
            }
        });
    };

    exports.init = function () {
        var me = this;
        var container = this.element;
        $('.add-equip').on('click', function() {
            $('.add-box').css('display', 'block');
            $('.nameBox').val('');
            $('.romBox').find('.select-box').remove();
            $('.clsBox').find('.select-box').remove();
            renderSelect();
        });
        $('.eq-shadow').on('click', function() {
            $('.add-box').css('display', 'none');
        });
        $('.addeq-btn').on('click', function() {
            nam = $('.nameBox').val();
            var tr ='<tr class="16"><td>' + nam + '</td><td>' + rom + '</td><td>' + cls + '</td><td><input class="mana-del" type="button" value="删除"/></td></tr>';
            if(nam !== ''){
                $('tbody').after(tr);
                alert('添加' + nam + '成功');
                $('.add-box').css('display', 'none');
                
                $('.mana-del').on('click', function(){
                    var num = $(this).parents('tr').attr('class');
                    if(confirm('是否确认删除此设备？')){
                        $('.'+num).remove();
                    }
                });
            } else {
                alert('请输入设备名称');
            }
        })
        $('.mana-del').on('click', function(){
            var num = $(this).parents('tr').attr('class');
            if(confirm('是否确认删除此设备？')){
                $('.'+num).remove();
            }
        });
    };
});