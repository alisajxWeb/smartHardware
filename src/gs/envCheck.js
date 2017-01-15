define(function (require, exports) {

    var service = require('service/common-main');

    var envCheckTrTpl = 'env-check-tbody';


    function updateEnvCheckData(data, mainPageContainer) {
        if (data && data.info) {
            var driver = data.info.driver;
            var order = data.info.order;

            var tbodyOrder = mainPageContainer.find('#envCheckOrderTable tbody');
            var tbodyDriver = mainPageContainer.find('#envCheckDriverTable tbody');

            tbodyOrder.html(Simplite.render(envCheckTrTpl, { data: order }));
            tbodyDriver.html(Simplite.render(envCheckTrTpl, { data: driver }));
        }
    };

    function createEnvCheck(district, orderId, driverPhone, vmIp) {
        var params = "?district=" + district + "&orderid=" + orderId + "&driverphone=" + driverPhone + "&ip=" + vmIp;
        return service.query('/gsProxy/envcheck/pushorder' + params);
    }

    exports.init = function () {
        var me = this.element;
        var mainPageContainer = me;

        Simplite.addFilter('formatBR', function formatBR(tmp) {
            return ((tmp || '') + '').replace(/\|\|\|\|/g, '<br/>');
        });

        mainPageContainer.on('click', '.query-btn-envcheck', function () {
            var district = $.trim(mainPageContainer.find('#district').val());
            var orderId = $.trim(mainPageContainer.find('#orderIdDataCheck').val());
            var driverPhone = $.trim(mainPageContainer.find('#driverPhone').val());
            var vmIp = $.trim(mainPageContainer.find('#vmIp').val());
            if (!district && !orderId && !driverPhone && !vmIp) {
                alert('请输入全部查询参数');
                return;
            }
            createEnvCheck(district, orderId, driverPhone, vmIp).done(function (data) {
                updateEnvCheckData(data, mainPageContainer)
            });
        });
    };
});
