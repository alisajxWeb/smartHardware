define(function (require, exports) {

    var emitter = require('common/eventEmitter');
    var service = require('service/reports-main');

    var modulesText = require('./modulesText');

    var chart, arrayResults;

    function renderChart(results) {
        arrayResults = modulesText.flatData(results);
        var option = {
            title: {
                text: '用户访问',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
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
                            value: item.count
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
            chart = echarts.init(document.getElementById('accessChart'));
            chart.on('pieselectchanged', function (data) {
                var filters = arrayResults.filter(function (item) {
                    return modulesText.getModule(item.key) === data.name;
                })[0];
                var url = '/' + filters.key.split('_').join('/');
                var accessBeginTime = $.trim($('#accessBeginTime').val());
                var accessEndTime = $.trim($('#accessEndTime').val());
                url = '/reports/userAccess?beginTime=' + encodeURIComponent(accessBeginTime) + '&endTime=' + encodeURIComponent(accessEndTime) + '&url=' + encodeURIComponent(url);
                service.queryUseraccessList(url).done(function (data) {
                    if (data && data.userAccesses) {
                        $('#userAccessTable tbody').html(Simplite.render('user-access-tbody', { list: data.userAccesses }));
                    }
                });
            })
        }
        chart.setOption(option);
    }

    function createQueryTask(url) {
        return service.queryUseraccessList(url).done(function (data) {
            var userAccesses = data || [];
            userAccesses = userAccesses.filter(function (item) {
                var modules = item['module'].split('/');
                var mainModule = modules[1] + '_' + modules[2] + '_' + modules[3];
                if (modulesText.getModule(mainModule, true) === mainModule) {
                    return false;
                }
                return true;
            });
            renderChart(modulesText.categoryData(userAccesses, 'module'));
        });
    }

    exports.init = function () {

        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 1;

        mainPageContainer.on('click', '#accessQuery', function () {

            mainPageContainer.attr('inited', 'true');

            var accessBeginTime = $.trim(mainPageContainer.find('#accessBeginTime').val());
            var accessEndTime = $.trim(mainPageContainer.find('#accessEndTime').val());

			if (!accessBeginTime && !accessEndTime) {
				accessBeginTime = moment().subtract(6, 'days').format('YYYY-MM-DD') + ' 00:00:00';
				accessEndTime = moment().format('YYYY-MM-DD') + ' 23:59:59';
				$('#accessBeginTime').val(accessBeginTime);
				$('#accessEndTime').val(accessEndTime);
                var daterangepicker = $('#accessTimeRange').data('daterangepicker');
                daterangepicker.setStartDate(accessBeginTime);
                daterangepicker.setEndDate(accessEndTime); 
			}

            var url = '/reports/pvStatistics?beginTime=' + accessBeginTime + '&endTime=' + accessEndTime;

            emitter.fire('reset_query', {
                query: {
                    accessBeginTime: accessBeginTime,
                    accessEndTime: accessEndTime,
                    tabIndex: tabIndex,
                    queryBtn: 'accessQuery'
                },
                flag: true
            });

            createQueryTask(url);
        });
        
        emitter.fire('reset_timerange', {
            key: 'accessTimeRange',
            keyStartTime: 'accessBeginTime',
            keyEndTime: 'accessEndTime'
        });
        emitter.fire('auto_query', { index: tabIndex });
        
    };
});