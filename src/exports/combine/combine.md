# 使用方式
## 初始化对象
```javascript
var combine = new Combine({
    element: container.find('.data-list-wrap'), // jquery对象容器,
    prefix: 'exports-plugin', // 样式前缀, 可重写自定义
    domain: 'http://bamai.xiaojukeji.com' // 图片所在的域
});

combine.on('orderMessagesDetailClick', function () {
    // order 维度 详情按钮点击
});

combine.on('pluginManagerShowAllTrip', function () {
    // 点击显示整个行程按钮
});

combine.on('behaviorMessagesDetailClick', function () {
    // 非订单维度详情点击
});

```

## render数据
### render数据订单维度的数据
```javascript
combine.render({
        "showAllBtn": true, //是否有拼车需要显示全路径情况
        "orderInfos": [
            { 
                "orderId": "3731781697", 
                "token": "veJb5EmicVFgxaw1x1xpB4pOCagf7P8HHC1CRRLJv8dUzTkKxDAMheG7vFqF5U2ybjP7pAiBmFTGd48gVUCVPvjfwAMGEJ6wqJwlt5ZUpQoT3v4jfGADfe0wZ7_YUiD07dhfTjwJ3zv9vMiFA1dJJarH_9fGAgvzDAAA__8=", 
                "tip": "0", 
                "input": "1", 
                "channel": "1020000001", 
                "from": "wlwebapp", 
                "default_voucher": "1", 
                "flier": "1", 
                "user_pay_info": "", 
                "estimate_price": "", 
                "encrypt_code": "", 
                "card_id": "", 
                "time": "", 
                "car_pool": "1", 
                "type": "0", 
                "carpool_show": "1", 
                "lat": "39.90568", 
                "tlat": "39.88765", 
                "flat": "39.9057", 
                "lng": "116.4797", 
                "tlng": "116.45929", 
                "flng": "116.48", 
                "fromName": "西大望路12号院", 
                "fromAddress": "北京市朝阳区", 
                "toName": "北京市垂杨柳医院", 
                "toAddress": "朝阳区垂杨柳南街2号(双井桥南)", 
                "area": "1", 
                "isNew": "true", 
                "maptype": "soso", 
                "openid": "oDe7ajlxiMbh6H_sWjZhVLcJXK94", 
                "imei": "oDe7ajlxiMbh6H_sWjZhVLcJXK94"
            }
        ], 
        "orderMessages": [
            { 
                "procTime": "0.319100", 
                "appName": "gs-api-web", 
                "orderId": "3731781697", 
                "errno": "0", 
                "startTime": "2016-08-25 07:00:10.289900 +0800", 
                "args": "{\"token\":\"veJb5EmicVFgxaw1x1xpB4pOCagf7P8HHC1CRRLJv8dUzTkKxDAMheG7vFqF5U2ybjP7pAiBmFTGd48gVUCVPvjfwAMGEJ6wqJwlt5ZUpQoT3v4jfGADfe0wZ7_YUiD07dhfTjwJ3zv9vMiFA1dJJarH_9fGAgvzDAAA__8=\",\"tip\":\"0\",\"input\":\"1\",\"channel\":\"1020000001\",\"from\":\"wlwebapp\",\"default_voucher\":\"1\",\"flier\":\"1\",\"user_pay_info\":\"\",\"estimate_price\":\"\",\"encrypt_code\":\"\",\"card_id\":\"\",\"time\":\"\",\"car_pool\":\"1\",\"type\":\"0\",\"carpool_show\":\"1\",\"lat\":\"39.90568\",\"tlat\":\"39.88765\",\"flat\":\"39.9057\",\"lng\":\"116.4797\",\"tlng\":\"116.45929\",\"flng\":\"116.48\",\"fromName\":\"\\u897f\\u5927\\u671b\\u8def12\\u53f7\\u9662\",\"fromAddress\":\"\\u5317\\u4eac\\u5e02\\u671d\\u9633\\u533a\",\"toName\":\"\\u5317\\u4eac\\u5e02\\u5782\\u6768\\u67f3\\u533b\\u9662\",\"toAddress\":\"\\u671d\\u9633\\u533a\\u5782\\u6768\\u67f3\\u5357\\u88572\\u53f7(\\u53cc\\u4e95\\u6865\\u5357)\",\"area\":\"1\",\"isNew\":\"true\",\"maptype\":\"soso\",\"openid\":\"oDe7ajlxiMbh6H_sWjZhVLcJXK94\",\"imei\":\"oDe7ajlxiMbh6H_sWjZhVLcJXK94\"}.", 
                "traceId": "0ade08a757be26fa1856640752e87802", 
                "driverId": null, 
                "uri": "/gulfstream/order/v2/passenger/pNewOrder", 
                "title": "/gulfstream/order/v2/passenger/pNewOrder", 
                "errmsg": "", "digest": "ceshi" 
            }
        ], 
        "driverLine": { 
            "3731781697": [{ "lat": 39.907884563387185, "orderStatus": null, "lng": 116.47692300032055, "eventType": null, "recordTime": null, "time": "1472079611" }] 
        }, 
        "driverTip": { 
            "3731781697": [{ "lat": "39.887777", "orderStatus": "5", "lng": "116.460936", "eventType": "10", "recordTime": "2016-08-25 07:17:42", "time": null }]
        }, 
        "driverPosition": { 
            "3731781697": [{ "lat": "39.887777", "orderStatus": "5", "lng": "116.460936", "eventType": "10", "recordTime": "2016-08-25 07:17:42", "time": null }], 
            "3731787037": [{ "lat": "39.907915", "orderStatus": "1", "lng": "116.478018", "eventType": "4", "recordTime": "2016-08-25 07:01:41", "time": null }] 
        }, 
        "passengerLine": { 
            "3731781697": [], 
            "3731787037": [{ "lat": 39.89513937815574, "orderStatus": null, "lng": 116.46983512285163, "eventType": null, "recordTime": null, "time": "1472079667" }] 
        }, 
        "passengerTip": { 
            "3731781697": [{ "lat": "39.905700", "orderStatus": "0", "lng": "116.480000", "eventType": "1", "recordTime": "2016-08-25 07:00:10", "time": null }], 
            "3731787037": [{ "lat": "39.893460", "orderStatus": "0", "lng": "116.469320", "eventType": "1", "recordTime": "2016-08-25 07:00:52", "time": null }] 
        }, 
        "passengerPosition": { 
            "3731781697": [{ "lat": "39.905700", "orderStatus": "0", "lng": "116.480000", "eventType": "1", "recordTime": "2016-08-25 07:00:10", "time": null }], 
            "3731787037": [{ "lat": "39.893460", "orderStatus": "0", "lng": "116.469320", "eventType": "1", "recordTime": "2016-08-25 07:00:52", "time": null }] 
        } 
    }, 'order');
```
### render非订单维度的数据
```javascript
combine.render(
    { 
        "list":[
            {
                "province": "",
                "driverId": null,
                "stime":"2016-08-20 04:21:58.409000 +0800",
                "dataType":"h5",
                "translateDataType":"前端h5数据",
                "driverPhone":null,
                "orderId":null,
                "passengerPhone":null,
                "passengerId":null,
                "brand":"vivo",
                "traceId":null,
                "uri":null,
                "translateUri":null,
                "urlPath":"https://dorado.xiaojukeji.com/"
            },
            {   
                "province":"",
                "driverId":"",
                "stime":"2016-08-21 09:14:15.279 +0800",
                "dataType":"app",
                "translateDataType":"前端app数据",
                "driverPhone":"",
                "orderId":null,
                "passengerPhone":"15143080314",
                "passengerId":"",
                "brand":"",
                "traceId":"fc86353557b900670000358c321c7451",
                "uri":"/gulfstream/api/v1/passenger/pGetEstimatePriceCoupon",
                "translateUri":null,
                "urlPath":null,
                "href":"http://trace.didichuxing.com/trace/fc86353557b900670000358c321c7451" //提供href 直接用href作为跳转路径
            }
            ...
        ]
    }
)
```
