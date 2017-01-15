define(function (require, exports) {

    exports.getModule = function getModule(key, isContainer) {
        var kvMaps = {
            "restoredataProxy_restore_gulf": "问题还原",
            "proxy_gs_oldPangu": "专快-奖励-老盘古",
            "proxy_gs_driverListen": "专快-听单",
            "proxy_gs_combo": "专快-奖励-combo",
            "proxy_gs_newPangu": "专快-奖励-新盘古",
            "proxy_gs_offline": "专快-奖励-离线",
            "proxy_gs_orderPrice": "专快-计价里程",
            "proxy_gs_endBill": "专快-结束计费",
            "proxy_gs_beginBill": "专快-开始计费",
            "proxy_gs_payBill": "专快-支付",
            "proxy_gs_billPreOrder": "专快-预估",
            "proxy_gs_sceneRecovery": "专快-场景还原(全量)",
            "proxy_gs_sceneTrip": "专快-场景还原(订单)",
            "proxy_gs_award": "专快-新奖查询",
            "proxy_beatles_query": "顺风车-日志查询",
            "proxy_beatles_sceneQuery": "顺风车-场景还原(订单)",
            "catchdataProxy_catch_log": "日志抓取",
            "proxy_btb_rule": "企业级-规则查询",
            "proxy_btb_scene": "企业级-场景还原",
            "proxy_common_passport": "公共-passport",
            "proxy_common_pay": "公共-支付",
            "proxy_pay_cashier": "支付-cashier",
            "proxy_taxi_stg": "出租车-策略分单",
        };
        if (isContainer) {
            for (var k in kvMaps) {
                if (kvMaps.hasOwnProperty(k) && k.indexOf(key) !== -1) {
                    return kvMaps[k];
                }
            }
        }
        return kvMaps[key] || key;
    };

    exports.categoryData = function categoryData(datas, key) {
        var dataSource = datas || [];
        var results = {};
        key = key || 'url';

        dataSource.forEach(function (item) {
            var modules = item[key].split('/');
            var mainModule = modules[1] + '_' + modules[2];
            var subModule = modules[3];
            var total = results[mainModule] || {
                count: 0,
                children: {}
            };
            var subTotal = total.children[subModule] || {
                count: 0,
                items: []
            };
            subTotal.count = subTotal.count + (+item.pv);
            subTotal.items.push(item);
            total.count = total.count + (+item.pv);
            total.children[subModule] = subTotal;
            results[mainModule] = total;
        });

        return results;
    };

    exports.flatData = function flatData(results, charSplit) {
        var arrayResults = [];
        charSplit = charSplit || '_';
        for (var key in results) {
            for (var k in results[key].children) {
                arrayResults.push({
                    key: key + charSplit + k,
                    count: results[key].children[k].count,
                    items: results[key].children[k].items
                });
            }
        }
        return arrayResults;
    };
});