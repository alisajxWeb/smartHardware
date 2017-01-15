define(function (require, exports) {

	var emitter = require('common/eventEmitter');
    var service = require('service/reports-main');
	var utils = require('common/utils');
	var modulesText = require('./modulesText');

	var chartsMap = {
		apiChart: null,
		apiPieChart: null
	};

	var dataSource = {
		apiChart: null,
		apiPieChart: null
	};

	var chars = {
		apiChart: function (dataSource, queryType) {
			return {
				tooltip: {
					trigger: 'axis',
					formatter: function (arg) {
						var obj = dataSource[arg[0].dataIndex];
						if (queryType !== 'day') {
							return obj.beginTime + ' 到 ' + obj.endTime + '<br/>' + 'pv：' + obj.pv;
						}
						return obj.date + '<br/>' + 'pv：' + obj.pv;
					}
				},
				legend: {
					data: ['pv']
				},
				title: {
					left: '46%',
					text: 'api调用次数'
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '10%',
					containLabel: true
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				dataZoom: [
					{
						id: 'dataZoomX',
						type: 'slider',
						bottom: '7%',
						filterMode: 'filter'
					}
				],
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: formatDataSource(dataSource, 'date')
				},
				yAxis: [
					{
						name: 'pv',
						minInterval: 1
					}
				],
				series: [
					{
						name: 'count',
						type: 'line',
						data: formatDataSource(dataSource, 'pv')
					}
				]
			};
		},
		apiPieChart: function(dataSource) {
			return  {
				title: {
					text: 'api调用模块统计',
					x: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					left: 'right',
					data: dataSource.map(function (item) { return modulesText.getModule(item.key, true); })
				},
				series: [
					{
						type: 'pie',
						selectedMode: 'single',
						radius: '55%',
						center: ['50%', '60%'],
						data: dataSource.map(function (item) {
							return {
								name: modulesText.getModule(item.key, true),
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
		}
	};

	function updateChart(dataSourceLocal, currentChart) {
		var domChart = document.getElementById(currentChart);
		var queryType = $('#apiCategory').val();
		$(domChart).show();

		if (!chartsMap[currentChart]) {
			chartsMap[currentChart] = echarts.init(domChart);
		}

		var dataSource = dataSourceLocal[currentChart][queryType];

		// 使用刚指定的配置项和数据显示图表。
		chartsMap[currentChart].setOption(chars[currentChart](dataSource, queryType));

		return chartsMap[currentChart];
	}


	function formatDataSource(dataSource, key) {
		return dataSource.map(function (item, index) {
			return item[key];
		});
	}

	function mergeDataByDays(refsData, dataSource, queryType) {
		var types = ({
			week: {
				day: 7,
				txt: '周',
				spliceLengthFunc: function (current) {
					var spliceLength;
					var currentDay = current.day();
					if (currentDay === 0) {
						spliceLength = 1;
					} else {
						spliceLength = 7 - currentDay + 1;
					}
					return spliceLength;
				},
				inX: function (item, current) {
					return item.beginTime <= current.date && current.date <= item.endTime
				}
			},
			month: {
				day: 30,
				txt: '月',
				spliceLengthFunc: function (current) {
					var start = current.date();
					return current.endOf('month').date() - start + 1;
				},
				inX: function (item, current) {
					return item.beginTime.indexOf(current.date) != -1;
				}
			}
		})[queryType];
		var result = refsData.slice(0);
		var mergeArr = [];
		var days = types.day;
		var spliceLength = 0;
		var current;
		while (result.length) {
			current = moment(result[0].date);
			mergeArr.push(result.splice(0, types.spliceLengthFunc(current)));
		}
		return mergeArr.map(function (item, index) {
			var total = item.reduce(function (c, n) {
				if (dataSource) {
					return {
						pv: 0,
						uv: 0
					};
				}
				return {
					pv: ((c.pv || 0) * 1) + ((n.pv || 0) * 1),
					uv: ((c.uv || 0) * 1) + ((n.uv || 0) * 1)
				}
			}, {
					pv: 0,
					uv: 0
				});
			total.beginTime = item[0].date;
			total.endTime = item[item.length - 1].date;
			total.date = '第' + (index + 1) + types.txt;
			return total;
		}).map(function (item, index) {
			if (dataSource && dataSource.length) {
				if (types.inX(item, dataSource[0])) {
					var tmp = dataSource.shift();
					item.pv = tmp.pv;
					item.uv = tmp.uv;
				}
			}
			return item;
		});
	}

	function fixedDataSource(dataSource, start, end) {
		var dayData = dataSource.day;
		var i = moment(start).format('YYYY-MM-DD');
		var tmp, tmpStr, resultDay = [], item;

		end = moment(end).format('YYYY-MM-DD');

		while (i <= end) {
			tmp = moment(i);
			tmpStr = tmp.format('YYYY-MM-DD');
			item = dayData[0];
			if (item && item.date === tmpStr) {
				resultDay.push(dayData.shift());
			} else {
				resultDay.push({
					date: tmpStr,
					pv: 0,
					uv: 0
				})
			}
			i = tmp.add(1, 'days').format('YYYY-MM-DD');
		}

		resultWeek = mergeDataByDays(resultDay, dataSource.week, 'week');
		resultMonth = mergeDataByDays(resultDay, dataSource.month, 'month');

		return {
			day: resultDay,
			week: resultWeek,
			month: resultMonth
		};
	}

	function setTimerangeDisplayValue(beginTime, endTime, displayDomId) {
		if (beginTime && endTime) {
			var separator = ' 到 ';
			var beginTimeLength = beginTime.length;
			var endTimeLength = endTime.length;
			if (beginTimeLength < 3 || endTimeLength < 3) {
				return;
			}
			var beginTimeDisplay = beginTime.substring(0, beginTimeLength - 3);
			var endTimeDisplay = endTime.substring(0, endTimeLength - 3);
			// 针对火狐等浏览器 对%20做转移
			var whiteSpace = '%20';
			beginTimeDisplay = beginTimeDisplay.replace(whiteSpace, ' ');
			endTimeDisplay = endTimeDisplay.replace(whiteSpace, '');
			$('#' + displayDomId).val(beginTimeDisplay + separator + endTimeDisplay);
		}
	}

	function setTimerangeValue(beginDomId, endDomId) {
		var timerangeValue = function (start, end, label) {
			var beginTime = start.format('YYYY-MM-DD HH:mm') + ":00";
			var endTime = end.format('YYYY-MM-DD HH:mm') + ":00";
			console.log("A new date range was chosen: " + beginTime + ' to ' + endTime);
			$('#' + beginDomId).val(beginTime);
			$('#' + endDomId).val(endTime);
		}
		return timerangeValue;
	}

	function getTimerangeInit(beginQuery, endQuery) {
		var timerangeInit = {
			startDate: beginQuery || moment().startOf('day'),
			endDate: endQuery || moment().add(1, 'days').startOf('day'),
			timePicker: false,
			timePicker12Hour: false,
			linkedCalendars: true,
			separator: ' 到 ',
			format: 'YYYY-MM-DD',
			opens: 'right',
			ranges: {
				'近7天': [moment().subtract(6, 'days'), moment()],
				'近20天': [moment().subtract(20, 'days'), moment()],
				'近1月': [moment().subtract(30, 'days'), moment()]
			},
			locale: {
				applyLabel: '确定',
				cancelLabel: '取消',
				fromLabel: '开始时间',
				toLabel: '结束时间',
				customRangeLabel: '自定义',
				daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
				monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
			}
		}
		return timerangeInit;
	}

	function resetTimeRange(timeRange, autoQuerys, beginTime, endTime) {
		setTimerangeDisplayValue(autoQuerys[beginTime], autoQuerys[endTime], timeRange);
		$('#' + timeRange).daterangepicker(getTimerangeInit(autoQuerys[beginTime], autoQuerys[endTime]), setTimerangeValue(beginTime, endTime))
	}

	function createQueryAPITask(data, url) {
		var paramsArr = [];
		for (var key in data) {
			paramsArr.push(key + '=' + data[key]);
		}

		return service.queryApiList(url + '?' + paramsArr.join('&'));
	}

	function updateTotal() {
		var count = 0;
		(dataSource.apiChart.month || []).forEach(function (item) {
			count = count + (+item.pv);
		});
		$('#apiTotal').html(Simplite.render('api-total', { count: count }));
	}

	exports.init = function () {

		var tabIndex = 4;
		var mainPageContainer = this.element;

		$('.main-page .nav').on('click', '.tab-event', function () {
			var index = $(this).data('idx');
			if (index == tabIndex) {
				setTimeout(function () {
					chartsMap.apiChart && chartsMap.apiChart.resize();
				}, 0);
			}
		});

		$('#apiQuery').click(function () {

			mainPageContainer.attr('inited', 'true');

			var apiBeginTime = $.trim($('#apiBeginTime').val());
			var apiEndTime = $.trim($('#apiEndTime').val());

			if (!apiBeginTime && !apiEndTime) {
				apiBeginTime = moment().subtract(6, 'days').format('YYYY-MM-DD') + ' 00:00:00';
				apiEndTime = moment().format('YYYY-MM-DD') + ' 23:59:59';
				$('#apiBeginTime').val(apiBeginTime);
				$('#apiEndTime').val(apiEndTime);
				var daterangepicker = $('#apiTimeRange').data('daterangepicker');
                daterangepicker.setStartDate(apiBeginTime);
                daterangepicker.setEndDate(apiEndTime); 
			}

			emitter.fire('reset_query', {
                query: {
                    apiBeginTime: apiBeginTime,
					apiEndTime: apiEndTime,
					tabIndex: tabIndex,
					queryBtn: 'apiQuery'
                },
                flag: true
            });

			createQueryAPITask({
				beginTime: apiBeginTime,
				endTime: apiEndTime
			}, '/reports/apipv').done(function (response) {
				dataSource.apiChart = fixedDataSource({ day: response }, apiBeginTime, apiEndTime);
				updateChart(dataSource, 'apiChart');
				updateTotal();
			});

			createQueryAPITask({
				beginTime: apiBeginTime,
				endTime: apiEndTime
			}, '/reports/apipvStatistics').done(function (response) {
				var chartData =	(response || [])
					.filter(function (item) {
						if (item.module !== '/error') {
							var modules = item['module'].split('/');
							var mainModule = modules[1] + '_' + modules[2];
							if (modulesText.getModule(mainModule, true) === mainModule) {
								return false;
							}
							return true;
						} else {
							return false;
						}
					})
					.map(function (item) {
						return {
							key: item.module.split('/').join('_'),
							count: +item.pv
						}
					});
				dataSource.apiPieChart = { day: chartData, week: chartData, month: chartData };
				updateChart(dataSource, 'apiPieChart');
			});
		});

		$('input[name="apiCategory"]').click(function () {
			$('#apiCategory').val($(this).val());
			updateChart(dataSource, 'apiChart');
		});

		resetTimeRange('apiTimeRange', utils.getQuery(true), 'apiBeginTime', 'apiEndTime');
		
		emitter.fire('auto_query', { index: tabIndex });
	};
});