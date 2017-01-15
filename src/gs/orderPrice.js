define(function (require, exports) {

    var Autocomplete = require('component/widgets/autocomplete/autocomplete');
    var loadQQMap = require('common/loadMap');
    var emitter = require('common/eventEmitter');
    var service = require('service/common-main');

    var positionControl, map, infoWindow, prevPoint, autocompleteObj = {};

    var changeViewControl, renderTypeMap;;

    function renderTable(messages) {
        return Simplite.render('order-price-tbody', { list: messages });
    }


    function orderPriceLoctype(typeId) {
        if (typeId == '1') {
            return 'GPS';
        } else if (typeId == '2') {
            return 'network';
        } else {
            return ' ';
        }
    }

    // 全屏
    function fullScreen(ele) {
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        }
    }

    function initCityAutoComplete() {
        service.getCityInfos().done(function (data) {
            autocompleteObj.autocomplete = new Autocomplete({
                element: '#opDistrictId',
                data: data
            });
        });
    }

    function PositionControl(ele) {
        ele.index = 10;
        ele.style.display = 'none';
        ele.style.marginTop = "10px";
        ele.style.padding = "5px";
        ele.style.backgroundColor = "#FFFFFF";
        ele.style.border = "2px solid #86ACF2";
        this.ele = ele;
    };

    PositionControl.prototype.getPosSource = orderPriceLoctype;

    PositionControl.prototype.updateContent = function (index, item, info) {
        this.ele.style.display = 'block';
        this.ele.innerHTML = '序列号：' + info.index + '<br/>时间戳：' + info.timestamp + '<br/>类型：' + this.getPosSource(info.loctype) + '<br/>精度：' + info.accuracy + '<br/>纬度：' + info.lat + '<br/>经度：' + info.lng + '';
    }

    function createPositionControl(map) {

        var customDiv = document.createElement("div");

        //获取控件接口设置控件
        var customControl = new PositionControl(customDiv, map);

        //将控件添加到controls栈变量并将其设置在顶部位置
        map.controls[qq.maps.ControlPosition.TOP_LEFT].push(customDiv);

        return customControl;

    }


    function updateMarkerContent(index, item, info) {
        if (prevPoint) {
            prevPoint.setStrokeColor('#00f');
            prevPoint.setFillColor('#00f');
        }
        item.setStrokeColor('#f00');
        item.setFillColor('#f00');
        prevPoint = item;
        positionControl.updateContent(index, item, info);
    }

    function initMap(container) {
        map = new qq.maps.Map(container, { 
            scrollwheel: false,
            scaleControl: true,
            scaleControlOptions: {
                //设置控件位置相对右下角对齐，向左排列
                position: qq.maps.ControlPosition.BOTTOM_RIGHT
            }
        });
        positionControl = createPositionControl(map);
        infoWindow = new qq.maps.InfoWindow({
            map: map
        });
    }

    function renderMap() {
        var eles = [];
        var paths = [];
        var listeners = [];
        var min0 = Infinity;
        var max0 = -Infinity;
        var min1 = Infinity;
        var max1 = -Infinity;

        var resetControls = function resetControls () {
            for (var j = 0, lj = eles.length; j < lj; j++) {
                eles[j].setVisible(false);
                eles[j].setMap(null);
            }
            eles.length = 0;
        };

        var resetListeners = function resetListeners () {
            for (var k = 0, lk = listeners.length; k < lk; k++) {
                qq.maps.event.removeListener(listeners[k]);
            }
            listeners.length = 0;
        };

        var resetPaths = function resetPaths () {
            paths.length = 0;
        };

        var reset = function reset() {
            min0 = Infinity;
            max0 = -Infinity;
            min1 = Infinity;
            max1 = -Infinity;
            resetControls();
            resetListeners();
            resetPaths();
        };

        var renderMap = function renderMap (points) {
            var noPricePoints = [];
            for (var i = 0, len = points.length; i < len; i++) {
                var point = points[i];
                var point0 = +point.lat;
                var point1 = +point.lng;
                if (point0 > max0) {
                    max0 = point0;
                }
                if (point0 < min0) {
                    min0 = point0;
                }
                if (point1 > max1) {
                    max1 = point1;
                }
                if (point1 < min1) {
                    min1 = point1;
                }

                if (point.loctype == 2 && +point.accuracy >= 30) {
                    noPricePoints.push(i);
                }

                paths.push(new qq.maps.LatLng(point0, point1));

                if (i === 0 || i === len - 1) {
                    var anchor = new qq.maps.Point(12, 40),
                        size = new qq.maps.Size(25, 40),
                        origin = new qq.maps.Point(i === 0 ? 200 : 225, 139),
                        icon = new qq.maps.MarkerImage('http://webmap0.map.bdstatic.com/wolfman/static/common/images/markers_new2_4ab0bc5.png', size, origin, anchor);
                    eles.push(new qq.maps.Marker({
                        icon: icon,
                        position: new qq.maps.LatLng(point0, point1),
                        map: map
                    }));
                    
                    continue;
                }
            }
            return noPricePoints;
        };

        return {
            line: function renderAsLine(points) {
                reset();
                renderMap(points);
                var polyline = new qq.maps.Polyline({
                    path: paths,
                    strokeColor: '#0000ff',
                    strokeWeight: 3,
                    map: map
                });
                eles.push(polyline);
                map.setCenter(new qq.maps.LatLng((min0 + max0) / 2, (min1 + max1) / 2)); // 地图中心点
                map.zoomTo(10);
            },
            point: function renderAsPoints(points) {
                reset();
                var noPricePoints = '#' + renderMap(points).join('#') + '#';
                var last = eles.splice(1, 1);
                for (var i = 0, len = paths.length; i < len; i++) {
                    var color = noPricePoints.indexOf('#' + i + '#') === -1 ? '#00f' : '#f00';
                    eles.push(new qq.maps.Circle({
                        center: paths[i],
                        clickable: true,
                        cursor: 'pointer',
                        radius: 5,
                        fillColor: color,
                        strokeWeight: 5,
                        strokeColor: color,
                        zIndex: 100,
                        map: map
                    }));
                    listeners.push(qq.maps.event.addListener(
                        eles[eles.length - 1],
                        'mouseover',
                        (function (i, item, point) {
                            return function () {
                                updateMarkerContent(i, item, point);
                                if ($('#isShowTip').prop('checked')) {
                                    infoWindow.open();
                                    infoWindow.setContent('<div>' + point.index + '</div>');
                                    infoWindow.setPosition(item.center);
                                }
                            }
                        })(i, eles[eles.length - 1], points[i])
                    ));
                }
                eles.push(last[0]);
                map.setCenter(new qq.maps.LatLng((min0 + max0) / 2, (min1 + max1) / 2)); // 地图中心点
                map.zoomTo(14);
            }
        }
    }

    function loadMap(points) {
        var useLine = points.length >= 5000 ? 'line' : 'point';
        $('#order-price-map').show();
        $('#folded').find('.glyphicon').removeClass('glyphicon-plus').addClass('glyphicon-minus');
        if (!renderTypeMap) {
            renderTypeMap = renderMap();
        }
        renderTypeMap[useLine](points);
    }


    function createQueryTask(url) {
        return service.query(url).done(function (data) {
            loadMap(data.messages || []);
            var datas = data.messages;
            if (!datas) {
                datas = [];
            }
            var conclusion = data.conclusion;
            if (!conclusion) {
                conclusion = "";
            }
            $("#orderPriceConclusion").html(conclusion.replace(/\|\|/g, '\<br\>'));
            $('#orderPriceTable tbody').html(renderTable(datas));
        });
    }


    exports.init = function () {

        var me = this.element;
        var mainPageContainer = me;
        var tabIndex = 4;

        Simplite.addFilter('formatLoctype', orderPriceLoctype);

        initCityAutoComplete();

        loadQQMap(function () {
            initMap(mainPageContainer.find('#order-price-map')[0]);
            emitter.fire('auto_query', { index: tabIndex });
            emitter.fire('init_feedBack', {
                ele: me.find('.feedback-container'),
                index: tabIndex 
            });
        });

        mainPageContainer.on('click', '#orderPriceQuery', function () {
            var districtId;
            if (autocompleteObj.autocomplete) {
                var districtData = autocompleteObj.autocomplete.getData();
                if (districtData) {
                    districtId = districtData.code;
                } else {
                    districtId = $.trim(mainPageContainer.find('#opDistrictId').val());
                }
            } else {
                districtId = $.trim(mainPageContainer.find('#opDistrictId').val());
            }

            var orderId = $.trim(mainPageContainer.find('#opOrderId').val());
            var modelId = $.trim(mainPageContainer.find('#opModelId').val());
            if (!districtId || !orderId || !modelId) {
                alert('请输入全部查询条件');
                return;
            }
            emitter.fire('reset_query', {
                query: {
                    opDistrictId: districtId,
                    opOrderId: orderId,
                    opModelId: modelId,
                    tabIndex: tabIndex,
                    queryBtn: 'orderPriceQuery'
                },
                flag: true
            });
            var url = '/proxy/gs/orderPrice/' + districtId + '/' + orderId + '/' + modelId;
            createQueryTask(url).done(function () {
                emitter.fire('update_feedback', {
                    index: tabIndex,
                    queryUrl: url
                });
            });
        });

        $('#fullscreen').click(function () {
            fullScreen(document.getElementById('order-price-map'));
        });

        $('#folded').click(function () {
            var currentState = $(this).find('.glyphicon');
            $('#order-price-map').toggle();
            if (currentState.hasClass('glyphicon-minus')) {
                currentState.removeClass('glyphicon-minus').addClass('glyphicon-plus');
            } else {
                currentState.removeClass('glyphicon-plus').addClass('glyphicon-minus');
            }
        });
    }
});