define(function (require, exports) {
    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var store = require('common/store');
    var service = require('service/eq-main');
    var feedbackMaps = {};
 
    require('./lab');
    require('./curtains');
    require('./airConditioner');
    require('./tv');
    var params = {"equipId": 1}; 

    function setQuery() {
        var querys = utils.getQuery(true);
        for (var id in querys) {
            $('#' + id).val(querys[id]);
        }
        return querys;
    }
    var getStatus = function (index) {
        service.getStatus({
            params: params,
            success: function (data) {
                var response1 = data;
                if (response1.status.code !== 0) {
                    alert(response1.status.reason);
                }
            }
        });
    };
    
    exports.init = function () {  
        var host = location.hostname;
        var mainPageContainer = $(this.element);
        var autoQuerys = setQuery();
        var inited = false;
        var firstUrl = true;
        $('.main-page .nav-tabs').on('shown.bs.tab', function (e) {
            var target = $(e.target);
            var dataIndex = $(target[0]).attr('data-index');
            switch(dataIndex){
                case 1: params.equipId = '1';
                    break;
                case 2: params.equipId = '8';
                    break;
                case 3: params.equipId = '12';
                    break;
                case 4: params.equipId = '14';
                    break;
            }
            getStatus(dataIndex);
            var feedback = feedbackMaps[target.data('index')];
            if (feedback && feedback.params.moduleUrl) {
                window.location.hash = store.get(feedback.params.moduleUrl).split('#')[1];
            } else if (feedback && !firstUrl){
                window.location.hash = '?tabIndex=' + target.data('index');
            }

            firstUrl = false;
            
            emitter.fire('reset_star');
        });

        emitter.on('auto_query', function (data) {
            var querys = autoQuerys;
            var index = data.index;
            var queryId = querys.queryBtn;
            if (!inited && queryId && querys.tabIndex == index) {
                $('.main-page .nav-tabs a:eq(' + (querys.tabIndex ? querys.tabIndex - 1 : 0) + ')').tab('show');
                $('#' + queryId).trigger('click');
                inited = true;
            }
            if (!inited && !queryId){
                inited = true;
                $('.main-page .nav-tabs a:eq(' + (querys.tabIndex ? (querys.tabIndex  - 1) : 0 )+ ')').tab('show');
            }
        });
    };
});
