define(function (require, exports) {

    require('tpl!../../tpl/taxi-main.tpl');

    var FeedBack = require('component/widgets/feedback/feedback');
    var emitter = require('common/eventEmitter');
    var utils = require('common/utils');
    var store = require('common/store');
    var service = require('service/common-main');

    require('./strategy');
    require('./taxiScene');

    exports.init = function () {
        var me = this;
        var container = this.element;
        var feedbackMaps = {};
        var query = utils.getQuery(true);
        var inited = false;
        var firstUrl = true;

        Simplite.addFilter('formatLogTime', function formatLogTime(timeStr) {
            timeStr = (timeStr + '').split('+')[0];
            return timeStr;
        });

        Simplite.addFilter('formatDigest',  function formatDigest(digest) {
            return Simplite.filters.escape(digest || '').replace(/\|\|/g, '\<br\/\>');
        });

         Simplite.addFilter('formatArgs', function formatArgs(args) {
            if (args) {
                return '<pre>' + utils.formatJSON(args, true) + '</pre>';;;
            } else {
                return '';
            }
        });

        emitter.on('fresh_query', function freshQuery(data) {
            var flatMap = utils.flatMap(data);
            for(var key in flatMap) {
                flatMap[key] = encodeURIComponent(flatMap[key]);
            }
            location.hash = utils.refreshQuery(flatMap, null, true);
        });

        emitter.on('auto_query', function autoQuery(data) {
            if (!inited && query.tabIndex == data.tabIndex && data.queryBtn) {
                $('.main-page .nav-tabs a:eq(' + (query.tabIndex ? query.tabIndex - 1 : 0) + ')').tab('show');
                data.queryBtn.trigger('click');
                inited = true;
            }
            if (!inited && !query.needAuto) {
                $('.main-page .nav-tabs a:eq(' + (query.tabIndex ? query.tabIndex - 1 : 0) + ')').tab('show');
                inited = true;
            }
        });

        emitter.on('update_feedback', function (data) {
            var feedback = feedbackMaps[data.index];
            feedback.updateModuleUrl(data.queryUrl);
            feedback.show();
            emitter.fire('reset_star');
        });

        emitter.on('init_feedBack', function (data) {
            var feedback = new FeedBack({
                params: {
                    moduleUrl: data.queryUrl
                },
                element: $(data.ele)
            });

            feedback.on('resolve', function (params) {
                service.feedbackSave({
                    resolve: 1,
                    module: params.moduleUrl
                }).done(function () {
                    alert('多谢您的反馈');
                });
                feedback.hide();
            });

            feedback.on('reject', function (params) {
                service.feedbackSave({
                    resolve: 0,
                    module: params.moduleUrl
                }).done(function () {
                    alert('多谢您的反馈,我们稍后会联系您');
                });
                feedback.hide();
            });

            feedbackMaps[data.index] = feedback;
        });

        emitter.on('reset_star', function () {
            var url = window.location.pathname + window.location.search + window.location.hash;
            if (store.get('stared') && store.get('stared')[url]) {
                $('.star-action').addClass('stared');
            } else {
                $('.star-action').removeClass('stared');
            }
        });

        $('.main-page .nav-tabs').on('shown.bs.tab', function (e) {

            var target = $(e.target);
            var feedback = feedbackMaps[target.data('index')];

            setTimeout(function () {
                emitter.fire('module_change', {tabIndex: target.data('index'), id: target.attr('href') });
            });

            if (feedback && feedback.params.moduleUrl) {
                window.location.hash = store.get(feedback.params.moduleUrl).split('#')[1];
            } else if (feedback && !firstUrl){
                window.location.hash = '?tabIndex=' + target.data('index');
            }

            firstUrl = false;

            emitter.fire('reset_star');         
        });

        container.on('dblclick', '.toggle', function () {
            $(this).toggleClass('fold');
            $(this).toggleClass('code');
        });
    };
});