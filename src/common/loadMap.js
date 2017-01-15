define(function () {
    var cbs = [];

    return function loadMap(cb) {
        cbs.push(cb);
        if (!window.mapInit && (!window.qq || !window.qq.maps || !window.qq.maps.Map)) {
            window.mapInit = function  mapInit() {
                delete window.mapInit;
                while(cbs.length) {
                    cbs.shift()();
                }
            };
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://map.qq.com/api/js?v=2.exp&libraries=convertor&key=AHBBZ-NECRX-QAJ4J-ZHSJU-VPUTK-QZFRH&callback=mapInit";
            document.body.appendChild(script);
        } else {
            if (window.qq && window.qq.maps && window.qq.maps.Map) {
                while(cbs.length) {
                    cbs.shift()();
                }
            }
        }
    }
})