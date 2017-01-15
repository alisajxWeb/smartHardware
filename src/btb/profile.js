define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var service = require('service/btb-main');
    var tabIndex = 2;
    var container;

    function seriesParams() {
        var result = {};
        var fileds = container.find('.form-inline').find('.js-form-field');
        $.each(fileds, function (index, item) {
            result[$(item).attr('name')] = $.trim($(item).val());
        });
        return result;
    }

    function autoQuery() {
        var fileds = container.find('.form-inline').find('.js-form-field');
        var querys = utils.getQuery(true) || {};
        $.each(fileds, function (index, item) {
            var key = querys[$(item).attr('name')];
            if (key) {
                $(item).val(decodeURIComponent(key || ''));
            }
        });
        emitter.fire('auto_query', { tabIndex: tabIndex, queryBtn: container.find('.js-query-btn') });
    }

    function renderUI(data) {
        var ruleList = data.self_car_config.rule_list;
        ruleList.forEach(function (rule) {
            rule.update_time = utils.toYMDHMS(new Date(rule.update_time * 1000));
        });
        container.find('.js-company-name').html(data.company_name);
        container.find('.table').find('tbody').html(Simplite.render('btb-rule-item', { list: ruleList }))
    }

    exports.init = function () {

        container = this.element;

        container
            .on('click', '.js-query-btn', function () {
                var params = seriesParams();
                if (params.phone && /^\d+$/g.test(params.phone)) {
                    emitter.fire('fresh_query', $.extend(true, { needAuto: 1, tabIndex: tabIndex }, params));
                    var obj = service.getRuleListByPhone(params); 
                    obj.promise.done(function (response) {
                        renderUI(response.data);
                        emitter.fire('update_feedback', {
                            index: tabIndex,
                            queryUrl: obj.url
                        });
                    });
                } else {
                    alert('请输入正确的phone');
                }
            })
            .on('click', '.js-fold-action', function () {
                $(this).parent().toggleClass('fold-text');
            });

        container.find('.form-inline').on('submit', function () {
            container.find('.js-query-btn').click();
            return false;
        });

        emitter.fire('init_feedBack', {
            ele: container.find('.feedback-container'),
            index: tabIndex
        });  

        autoQuery();
    };
});