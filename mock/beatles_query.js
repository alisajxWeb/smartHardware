module.exports = function (params) {
    var datas = [];
    for(var i = 0; i < 10; i++) {
        datas.push({
            "uid": i + '',
            "model": "webapp",
            "logTime": "2016-08-11 10:49:07.380 +0800",
            "appversion": "4.3.8",
            "traceid": "0af297e257abe7a300a452b8761e7202",
            "clientHost": "beatles-api-web37.eb",
            "logLevel": "NOTICE",
            "orderId": "73774737374747",
            "spanid": "28b14c7571fa7a5e",
            "dltag": "_com_request_out",
            "logID": "425",
            "pspanid": "2f9096be023409a1",
            "uri": "/beatles/api/user/user/getcityconfig?lat=24.73462&lng=118.636&_=1470883747213&callback=jsonp4&appversion=4.3.8&channel=500642&model=webapp",
            "in": "{\"get\":{\"lat\":\"24.73462\",\"lng\":\"118.636\",\"_\":\"1470883747213\",\"callback\":\"jsonp4\",\"appversion\":\"4.3.8\",\"channel\":\"500642\",\"model\":\"webapp\"},\"post\":[],\"__uid\":0}.",
            "logid": "460909495388037278",
            "ip": "127.0.0.1",
            "appName": "beatles_api",
            "message": "[NOTICE][2016-08-11 10:49:07.380+0800][/home/xiaoju/webroot/beatles/public/phputils/framework.php:36:Xiaoju\\Beatles\\Utils\\Logger:notice] _com_request_out||traceid=0af297e257abe7a300a452b8761e7202||pspanid=2f9096be023409a1||spanid=28b14c7571fa7a5e||logid=460909495388037278||errno=0||ip=127.0.0.1||uri=/beatles/api/user/user/getcityconfig?lat=24.73462&lng=118.636&_=1470883747213&callback=jsonp4&appversion=4.3.8&channel=500642&model=webapp||urlkey=/beatles/api/user/user/getcityconfig||in={\"get\":{\"lat\":\"24.73462\",\"lng\":\"118.636\",\"_\":\"1470883747213\",\"callback\":\"jsonp4\",\"appversion\":\"4.3.8\",\"channel\":\"500642\",\"model\":\"webapp\"},\"post\":[],\"__uid\":0}||out=||proc_time=0.027817||msg=.",
            "proc_time": "0.027817",
            "errno": "0",
            "collectTime": "2016-08-11 10:49:08.948 +0800",
            "urlkey": i % 2 ? "/beatles/api/user/user/getcityconfig" : "/beatles/api/passenger/order/calculatecost2",
            "logName": "didi.log",
            "projectName": "shunfengche",
            "channel": "500642"
        });
    }
    return { messages: datas };  
};