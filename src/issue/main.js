define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var service = require('service/common-main');
    var utils = require('common/utils');
    var store = require('common/store');

    exports.init = function () {
        var me = this;
        var container = this.element;

        $('.issue-btn').on('click', function() {
            if($('.textArea').find('textarea').val() !== ''){
                alert('感谢您的建议，后台已收到！');
                window.location.href= 'http://www.alisablog.cn/eq/main';
            }
            else{
                alert('请填写内容！');
            }
        });
    };
});