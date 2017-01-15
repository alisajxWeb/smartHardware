define(function (require, exports) {

    var loadQQMap = require('common/loadMap');

    function mapInit() {
        var json = sessionStorage.getItem('location-data');
        if (json) {
            var locationData = JSON.parse(json);
            var center = new qq.maps.LatLng(locationData.lat, locationData.lng);
            var map = new qq.maps.Map(document.getElementById('mapContainer'),{
                scrollwheel: false,
                center: center,
                zoom: 13
            });
            //创建marker
            var marker = new qq.maps.Marker({
                position: center,
                map: map
            });
        }
    }

    exports.init = function () {
        loadQQMap(mapInit);
    }
});