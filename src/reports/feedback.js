define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var service = require('service/reports-main');

    var modulesText = require('./modulesText');

    var chart, arrayResults;

    function renderChart(results, mainPageContainer) {
        arrayResults = modulesText.flatData(results);
        arrayResults.forEach(function (item) {
            item.resolved = 0;
            item.unresolved = 0;
            item.items.forEach(function (record) {
                if (record.result == 0){
                    item.unresolved  = item.unresolved + (+record.pv)
                } else {
                    item.resolved = item.resolved + (+record.pv);
                }
            });
        });
        var option = {
            title: {
                text: '用户反馈',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter:function (params) { 
                    var unresolved = +params.data.unresolved;
                    var resolved = +params.data.resolved;
                    var unresolvedPercent =  ((unresolved * 100) / ((unresolved + resolved) || 1)).toFixed(2); 
                    return params.name + " : " + params.value + " (" + params.percent + "%)<br/> 解决: " + resolved +  "<br/> 未解决: " + unresolved + "("  + unresolvedPercent + "%)"; 
                }
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: arrayResults.map(function (item) { return modulesText.getModule(item.key); })
            },
            series: [
                {
                    type: 'pie',
                    selectedMode: 'single',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: arrayResults.map(function (item) {
                        return {
                            name: modulesText.getModule(item.key),
                            value: item.count,
                            items: item.items,
                            resolved: item.resolved,
                            unresolved: item.unresolved
                        }
                    }),
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        if (!chart) {
            chart = echarts.init(document.getElementById('feedbackChart'));
            chart.on('pieselectchanged', function (data) {
                var filters = arrayResults.filter(function (item) {
                    return modulesText.getModule(item.key) === data.name;
                })[0];
                var feedbackBeginTime = $.trim(mainPageContainer.find('#feedbackBeginTime').val());
                var feedbackEndTime = $.trim(mainPageContainer.find('#feedbackEndTime').val());
                var url = '/reports/feedback?beginTime=' + encodeURIComponent(feedbackBeginTime) + '&endTime=' + encodeURIComponent(feedbackEndTime) + '&module=' + encodeURIComponent('/' + filters.key.split('_').join('/'));
                service.queryFeedbackList(url).done(function (data) {
                    $('#feedbackTable tbody').html(Simplite.render('feedback-tbody', { list: data }));
                });
            })
        }
        chart.setOption(option);
    }

    function createQueryTask(url) {
        return service.queryFeedbackList(url);
    };

    exports.init = function () {
        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 2;

        mainPageContainer.on('click', '#feedbackQuery', function () {
            
            mainPageContainer.attr('inited', 'true');

            var feedbackBeginTime = $.trim(mainPageContainer.find('#feedbackBeginTime').val());
            var feedbackEndTime = $.trim(mainPageContainer.find('#feedbackEndTime').val());

            if (!feedbackBeginTime && !feedbackEndTime) {
				feedbackBeginTime = moment().subtract(6, 'days').format('YYYY-MM-DD') + ' 00:00:00';
				feedbackEndTime = moment().format('YYYY-MM-DD') + ' 23:59:59';
				$('#feedbackBeginTime').val(feedbackBeginTime);
				$('#feedbackEndTime').val(feedbackEndTime);
                var daterangepicker = $('#feedbackTimeRange').data('daterangepicker');
                daterangepicker.setStartDate(feedbackBeginTime);
                daterangepicker.setEndDate(feedbackEndTime); 
			}

            var url = '/reports/feedbackStatistics?beginTime=' + feedbackBeginTime + '&endTime=' + feedbackEndTime;
            
            emitter.fire('reset_query', {
                query: {
                    feedbackBeginTime: feedbackBeginTime,
                    feedbackEndTime: feedbackEndTime,
                    tabIndex: tabIndex,
                    queryBtn: 'feedbackQuery'
                },
                flag: true
            });

            
            $.when(createQueryTask(url + '&result=0'), createQueryTask(url + '&result=1'), service.queryFeedbackUV(feedbackBeginTime, feedbackEndTime))
                .done(function (dataUnResolved, dataResolved, dataOther) {
                    var resolvedSource = (dataResolved || []).map(function (item) { item.result = 1; return item;});
                    var unresolvedSource = (dataUnResolved || []).map(function (item) { item.result = 0; return item;});
                    var data = resolvedSource.concat(unresolvedSource);
                    data = data.filter(function (item) {
                        var modules = item['module'].split('/');
                        var mainModule = modules[1] + '_' + modules[2] + '_' + modules[3];
                        if (modulesText.getModule(mainModule, true) === mainModule) {
                            return false;
                        }
                        return true;
                    });

                    renderChart(modulesText.categoryData(data, 'module'), mainPageContainer);

                    var result = {
                        resolved: 0,
                        unresolved: 0,
                        total: 0,
                        percent: 100
                    };

                    data.forEach(function (item) {
                        if (item.result == 1) {
                            result.resolved = result.resolved + (+item.pv) ;
                        } else {
                            result.unresolved = result.unresolved + (+item.pv);
                        }
                    });

                    result.total = result.resolved + result.unresolved;
                    result.totalUv = dataOther.userCount;
                    result.kfUv = dataOther.userCountKf;
                    result.percent = (result.resolved * 100 / (result.total || 1)).toFixed(2);
                    me.find('.feedback-total').html(Simplite.render('feedback-total', result));
                });
        });
        emitter.fire('reset_timerange', {
            key: 'feedbackTimeRange',
            keyStartTime: 'feedbackBeginTime',
            keyEndTime: 'feedbackEndTime'
        });
        emitter.fire('auto_query', { index: tabIndex });
      
    };
});