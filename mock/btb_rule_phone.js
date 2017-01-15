// "name": 规则名称
// "use_car_time”:用车时间
// "use_car_position”:用车地点
// "pay_mode": 支付模式
// "use_car_srv":可用车型
// "require_level": 用车级别
// "is_use_quota": 是否占用个人限额
// "last_modify_time":最后修改时间
module.exports = {
    "status": 0,
    "msg": "success",
    "data": {
        "company_name": "滴滴企业级事业部",
        "guest_car_config": "",
        "self_car_config": {
            "is_remark": "0",
            "use_company_money": "1",
            "month_quota": "0",
            "rule_list": [
                {
                    "id": "6980211897132125672",
                    "name": "加班规则",
                    "status": "1",    // 状态： 0正常；1删除
                    "type": "1",     // 类型： 1加班用车 2日常用车 3差旅用车 9其他用车
                    "is_use_quota": "0",
                    "create_time": "1460982862",
                    "creater": "6978463934001450765",
                    "update_time": "1473681217",
                    "updater": "6978463934001450765",
                    "use_car_time": [
                        {
                            "value": "21:00-次日06:00",
                            "title": "周一至周五"
                        },
                        {
                            "value": "00:00-次日00:00",
                            "title": "周六至周日"
                        }
                    ],
                    "use_car_position": {
                        "all": [
                            {
                                "id": "7687030934386249620",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": "0",
                                "lat": "40.044490",
                                "lng": "116.284140",
                                "poi_name": "文思海辉大厦",
                                "poi_range": "500",
                                "out_city_id": "1",
                                "out_city_name": "北京市",
                                "create_time": "1471515287",
                                "creater": "7398241248307842352",
                                "update_time": "1471515863",
                                "updater": "7398241248307842352"
                            },
                            {
                                "id": "6992224468144229490",
                                "name": "POI-3-广州市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "23.123870000000007",
                                "lng": "113.32602999999997",
                                "poi_name": "越秀金融大厦",
                                "poi_range": 500,
                                "create_time": 1461161863,
                                "creater": "6978463934001450765",
                                "update_time": 1461161863,
                                "updater": "6978463934001450765",
                                "out_city_id": "3",
                                "out_city_name": "广州市"
                            },
                            {
                                "id": "6992222328512319130",
                                "name": "POI-3-广州市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "23.12431199999999",
                                "lng": "113.321647",
                                "poi_name": "雅居乐中心",
                                "poi_range": 500,
                                "create_time": 1461161832,
                                "creater": "6978463934001450765",
                                "update_time": 1461161832,
                                "updater": "6978463934001450765",
                                "out_city_id": "3",
                                "out_city_name": "广州市"
                            },
                            {
                                "id": "6992056610017775478",
                                "name": "POI-2-深圳市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "22.54075000000001",
                                "lng": "113.95253999999998",
                                "poi_name": "大冲商务中心",
                                "poi_range": 500,
                                "create_time": 1461159362,
                                "creater": "6978463934001450765",
                                "update_time": 1461159362,
                                "updater": "6978463934001450765",
                                "out_city_id": "2",
                                "out_city_name": "深圳市"
                            },
                            {
                                "id": "6992051806432399000",
                                "name": "POI-4-上海市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "31.242855000000006",
                                "lng": "121.44214699999999",
                                "poi_name": "EMS揽投站(财富时代大厦揽投站）",
                                "poi_range": 500,
                                "create_time": 1461159291,
                                "creater": "6978463934001450765",
                                "update_time": 1461159291,
                                "updater": "6978463934001450765",
                                "out_city_id": "4",
                                "out_city_name": "上海市"
                            }
                        ]
                    },
                    "require_level": [],
                    "use_car_srv": [
                        "301 -- 快车"
                    ],
                    "pay_mode": "企业余额支付"
                },
                {
                    "id": "7157661265782115616",
                    "name": "办公区规则-普通员工",
                    "status": "0",
                    "type": "2",
                    "is_use_quota": "0",
                    "create_time": "1463627064",
                    "creater": "6978463934001450765",
                    "update_time": "1474970278",
                    "updater": "7151714339283013203",
                    "use_car_time": 0,
                    "use_car_position": {
                        "on": [
                            {
                                "id": "6978471398008688153",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": "0",
                                "lat": "40.044251",
                                "lng": "116.322620",
                                "poi_name": "迪亚天天(上林溪店)",
                                "poi_range": "500",
                                "out_city_id": "1",
                                "out_city_name": "北京市",
                                "create_time": "1460956927",
                                "creater": "6978463934001450765",
                                "update_time": "1460956963",
                                "updater": "6978463934001450765"
                            },
                            {
                                "id": "6978476544050597255",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.04344000000002",
                                "lng": "116.29028999999998",
                                "poi_name": "尚东数字山谷B区1号楼",
                                "poi_range": 500,
                                "create_time": 1460957003,
                                "creater": "6978463934001450765",
                                "update_time": 1460957003,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "6991279380119424300",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.04632000000001",
                                "lng": "116.30379000000002",
                                "poi_name": "金远见大楼",
                                "poi_range": 500,
                                "create_time": 1461147780,
                                "creater": "6978463934001450765",
                                "update_time": 1461147780,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "6991288866024459350",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.06195",
                                "lng": "116.32660999999999",
                                "poi_name": "金燕龙大厦",
                                "poi_range": 500,
                                "create_time": 1461147922,
                                "creater": "6978463934001450765",
                                "update_time": 1461147922,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "6991290981362961799",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.05430900000002",
                                "lng": "116.30364",
                                "poi_name": "盈创动力科技园",
                                "poi_range": 500,
                                "create_time": 1461147953,
                                "creater": "6978463934001450765",
                                "update_time": 1461147953,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "7687030934386249620",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": "0",
                                "lat": "40.044490",
                                "lng": "116.284140",
                                "poi_name": "文思海辉大厦",
                                "poi_range": "500",
                                "out_city_id": "1",
                                "out_city_name": "北京市",
                                "create_time": "1471515287",
                                "creater": "7398241248307842352",
                                "update_time": "1471515863",
                                "updater": "7398241248307842352"
                            },
                            {
                                "id": "7918887987944361352",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.043390000000024",
                                "lng": "116.29986999999998",
                                "poi_name": "八维教育-正门",
                                "poi_range": 500,
                                "create_time": 1474970226,
                                "creater": "7151714339283013203",
                                "update_time": 1474970226,
                                "updater": "7151714339283013203",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            }
                        ],
                        "off": [
                            {
                                "id": "6978471398008688153",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": "0",
                                "lat": "40.044251",
                                "lng": "116.322620",
                                "poi_name": "迪亚天天(上林溪店)",
                                "poi_range": "500",
                                "out_city_id": "1",
                                "out_city_name": "北京市",
                                "create_time": "1460956927",
                                "creater": "6978463934001450765",
                                "update_time": "1460956963",
                                "updater": "6978463934001450765"
                            },
                            {
                                "id": "6978476544050597255",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.04344000000002",
                                "lng": "116.29028999999998",
                                "poi_name": "尚东数字山谷B区1号楼",
                                "poi_range": 500,
                                "create_time": 1460957003,
                                "creater": "6978463934001450765",
                                "update_time": 1460957003,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "6991279380119424300",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.04632000000001",
                                "lng": "116.30379000000002",
                                "poi_name": "金远见大楼",
                                "poi_range": 500,
                                "create_time": 1461147780,
                                "creater": "6978463934001450765",
                                "update_time": 1461147780,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "6991288866024459350",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.06195",
                                "lng": "116.32660999999999",
                                "poi_name": "金燕龙大厦",
                                "poi_range": 500,
                                "create_time": 1461147922,
                                "creater": "6978463934001450765",
                                "update_time": 1461147922,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "6991290981362961799",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": 0,
                                "lat": "40.05430900000002",
                                "lng": "116.30364",
                                "poi_name": "盈创动力科技园",
                                "poi_range": 500,
                                "create_time": 1461147953,
                                "creater": "6978463934001450765",
                                "update_time": 1461147953,
                                "updater": "6978463934001450765",
                                "out_city_id": "1",
                                "out_city_name": "北京市"
                            },
                            {
                                "id": "7687030934386249620",
                                "name": "POI-1-北京市",
                                "company_id": "6978463928900914955",
                                "status": "0",
                                "lat": "40.044490",
                                "lng": "116.284140",
                                "poi_name": "文思海辉大厦",
                                "poi_range": "500",
                                "out_city_id": "1",
                                "out_city_name": "北京市",
                                "create_time": "1471515287",
                                "creater": "7398241248307842352",
                                "update_time": "1471515863",
                                "updater": "7398241248307842352"
                            }
                        ]
                    },
                    "require_level": [
                        "100",
                        "400",
                        "200"
                    ],
                    "use_car_srv": [
                        "301 -- 快车"
                    ],
                    "pay_mode": "企业余额支付"
                }
            ]
        }
    }
}