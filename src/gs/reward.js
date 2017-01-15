define(function (require, exports) {

	var Autocomplete = require('component/widgets/autocomplete/autocomplete');
    var service = require('service/common-main');
    var emitter = require('common/eventEmitter');
	var utils = require('common/utils');

	var container = $('#reward');
    var autocompleteObj = {};

	function renderTable(messages) {
        return Simplite.render('reward-tbody', { list: messages });
    }

	var keyDom = {
		rewardArea: container.find('input[name="rewardArea"]'),
		rewardQueryType: container.find('select[name="rewardQueryType"]'),
		rewardQueryIdType: container.find('select[name="rewardQueryIdType"]'),
		keyId: container.find('input[name="keyId"]'),
		activityId: container.find('input[name="activityId"]'),
		rewardBeginTime: container.find('input[name="rewardBeginTime"]'),
		rewardEndTime: container.find('input[name="rewardEndTime"]')
	};

	var rewardQueryType = [
		{
			text: '旧盘古',
			value: '1',
			api: '/proxy/gs/oldPangu/orderId/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}'
		},
		{
			text: '动态补贴',
			value: '2',
			api: {
				driverId: '/proxy/gs/newPangu/driverId/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}',
				phone: '/proxy/gs/newPangu/phone/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}',
				orderId: '/proxy/gs/newPangu/area/{rewardArea}/orderId/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}'
			}
		},
		{
			text: '离线',
			value: '3',
			api: {
				driverId: '/proxy/gs/offline/activityId/{activityId}/driverId/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}',
				phone: '/proxy/gs/offline/activityId/{activityId}/phone/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}'
			}
		},
		{
			text: 'combo',
			value: '4',
			api: {
				driverId: '/proxy/gs/combo/driverId/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}',
				orderId: '/proxy/gs/combo/orderId/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}',
				phone: '/proxy/gs/combo/phone/{keyId}?beginTime={rewardBeginTime}&endTime={rewardEndTime}'
			}
		}
	];

	var rewardQueryIdType = [
		{
			text: '司机id',
			value: 'driverId'
		},
		{
			text: '订单id',
			value: 'orderId'
		},
		{
			text: 'phone',
			value: 'phone'
		}
	];

	function initSelectOption() {
		var querys = utils.getQuery(true);
		keyDom.rewardQueryType.html(rewardQueryType.map(function (item) {
			return '<option value="' + item.value + '">' + item.text + '</option>';
		}).join(''));
		keyDom.rewardQueryIdType.html(rewardQueryIdType.map(function (item) {
			return '<option value="' + item.value + '">' + item.text + '</option>';
		}).join(''));
		if (querys.rewardQueryType) {
			keyDom.rewardQueryType.val(querys.rewardQueryType);
			keyDom.rewardQueryIdType.val(querys.rewardQueryIdType);
		}
	}


    function initCityAutoComplete() {
        service.getCityInfos().done(function (data) {
            autocompleteObj.autocomplete = new Autocomplete({
                element: '#rewardArea',
                data: data
            });
        });
    }

	function configUI(queryType) {
		var uiConfig = {
			1: ['orderId'],
			2: ['orderId', 'driverId', 'phone'],
			3: ['driverId', 'phone'],
			4: ['phone', 'orderId', 'driverId']
		};
		var config = uiConfig[queryType].join('#');

		// activity_id
		if (queryType == rewardQueryType[2].value) {
			keyDom.activityId.show();
		} else {
			keyDom.activityId.hide();
		}

		// disable options
		var currentVal = keyDom.rewardQueryIdType.val()
		keyDom.rewardQueryIdType.find('option').each(function (index, item) {
			$(item).prop('disabled', false);
			if (config.indexOf($(item).attr('value')) === -1) {
				$(item).prop('disabled', true);
			}
		});

		if (config.indexOf(currentVal) === -1) {
			keyDom.rewardQueryIdType.val(config.split('#')[0]);
		}

		// 动态补贴需要选择地区和订单
		if (queryType == rewardQueryType[1].value && keyDom.rewardQueryIdType.val() == rewardQueryIdType[1].value) {
			keyDom.rewardArea.show();
			keyDom.rewardArea.prop('disabled', false);
		} else {
			keyDom.rewardArea.prop('disabled', true);
			keyDom.rewardArea.hide();
		}
	}

	function validateParams(params) {
		if (!params.keyId) {
			return {
				message: '请输入' + keyDom.rewardQueryIdType.val()
			}
		}

		if (params.rewardQueryType == rewardQueryType[1].value
			&& params.rewardQueryIdType == rewardQueryIdType[1].value
			&& !params.rewardArea) {
			return {
				message: '请选择地区'
			}
		}
		if ((params.rewardQueryType == rewardQueryType[2].value) && !params.activityId) {
			return {
				message: '请输入activityId'
			}
		}
		return true;
	}

	function getURL(selectedType, params) {
		var url = selectedType.api;
		if (typeof url === 'object') {
			url = url[params.rewardQueryIdType]
			console.log(url);
		}
		//
		url = url.replace(/\{([^}]+)\}/g, function (str, key) {
			return params[key] || '';
		}).replace('//', '/');
		return url;

	}

	function createQueryTask(url) {
		return service.query(url).done(function (data) {
			var conclusion = data.conclusion;
			var messages = data.messages;

			if (!messages) {
				messages = [];
			}
			if (!conclusion) {
				conclusion = "";
			}
			var isOffline = keyDom.rewardQueryType.val() == rewardQueryType[2].value;
            $("#rewardConclusion").html((isOffline && messages.length > 0 ? '活动奖励规则: <a target="blank" href="' + getRulesRef() + '">查看详细</a><br/>' : '') + conclusion.replace(/\|\|/g,'\<br\>'));
			$('#rewardTable tbody').html(renderTable(messages));
        });
    }

	function getRulesRef() {
		var aid = keyDom.activityId.val();
		var did = keyDom.keyId.val();
		return 'http://static.udache.com/gulfstream/webapp/pages/driver-reward-activity/details.html?aid=' + aid + '&did=' + did + '&atype=1&do=1&ticket=&admin=xiaoju888';
	}

	exports.init = function init() {

		var me = this;

		var tabIndex = 7;

		Simplite.addFilter('formatRewardMessage', function formatRewardMessage(item) {
			var args, value = item.message || '';
			if (args = item.args) {
				if (args[args.length - 1] === '.') {
					args = args.slice(0, -1);
				}
				args = JSON.parse(args);
				if (args.driver_info) {
					value = value.replace(args.driver_info.replace(/\\/g, '\\\\').replace(/"/g, '\\"'), '<span class="json-view" style="color: white;background:green;">' + args.driver_info + '</span>');
				}

				if (args.order_info) {
					value = value.replace(args.order_info.replace(/\\/g, '\\\\').replace(/"/g, '\\"'), '<span class="json-view" style="color: white;background:green;">' + args.order_info + '</span>');
				}
			}
			return value;
		});

        initCityAutoComplete();

		initSelectOption();

		container
			.on('change', '.js-reward-id-type', function selectIdType() {
				var disabled = !($(this).val() == rewardQueryIdType[1].value);
				keyDom.rewardArea.prop('disabled', disabled);
				if (disabled || keyDom.rewardQueryType.val() == rewardQueryType[3].value) {
					keyDom.rewardArea.hide();
				} else {
					keyDom.rewardArea.show();
				}
			})
			.on('change', '.js-reward-query-type', function selectQueryType() {
				var queryType = +$(this).val();
				configUI(queryType);
			})
			.on('click', '#rewardQuery', function query() {
				var params = {};
				var value, result;
				for (var key in keyDom) {
					value = $.trim(keyDom[key].val());
					if (value) {
						params[key] = value;
					}
				}

				if (params.rewardQueryType == rewardQueryType[1].value
					&& params.rewardQueryIdType == rewardQueryIdType[1].value) {
					if (autocompleteObj.autocomplete) {
						var dlAreaData = autocompleteObj.autocomplete.getData();
						if (dlAreaData) {
							params.rewardArea = dlAreaData.code;
						}
					}
				} else {
					delete params.rewardArea;
				}

				if ((result = validateParams(params)) !== true) {
					return alert(result.message);
				}

				emitter.fire('reset_query', {
					query: $.extend({}, params, { tabIndex: tabIndex, queryBtn: 'rewardQuery' }),
					flag: true
				});

				var selectedType = rewardQueryType.filter(function (item) {
					return item.value == $('select[name="rewardQueryType"]').val();
				})[0];

				var url = getURL(selectedType, params);

				createQueryTask(url).done(function () {
					emitter.fire('update_feedback', {
						index: tabIndex,
						queryUrl: url
					});
				});
			});
		
		keyDom.rewardQueryType.trigger('change');

		emitter.fire('auto_query', { index: tabIndex });

		emitter.fire('init_feedBack', {
            ele: me.element.find('.feedback-container'),
            index: tabIndex
        });

		emitter.fire('reset_timerange', {
            key: 'rewardTimeRange',
            keyStartTime: 'rewardBeginTime',
            keyEndTime: 'rewardEndTime'
        });
	};
});