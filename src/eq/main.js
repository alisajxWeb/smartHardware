define(function (require, exports) {
    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var store = require('common/store');
    // var select = require('common/select/selectService');

    var feedbackMaps = {};

    require('./lab');
    require('./curtains');
    require('./airConditioner');
    require('./tv');

    function setQuery() {
        var querys = utils.getQuery(true);
        for (var id in querys) {
            $('#' + id).val(querys[id]);
        }
        return querys;
    }

    exports.init = function () {

        var host = location.hostname;
        var mainPageContainer = $(this.element);
        var autoQuerys = setQuery();
        var inited = false;
        var firstUrl = true;
  

        $('.main-page .nav-tabs').on('shown.bs.tab', function (e) {
            var target = $(e.target);
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