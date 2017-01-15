{{ -- tpl: exports-restore-template -- }}
    <div class="<%=# _this.prefix %>-restore-container">
        <div class="<%=# _this.prefix %>-restore-map-container js-restore-map-container">
            <div class="js-restore-map <%=# _this.prefix %>-restore-map"></div><div class="<%=# _this.prefix %>-restore-plugins js-restore-plugins"></div>
        </div>
        <div class="<%=# _this.prefix %>-restore-order-wrap js-restore-order-wrap" style="display:none">
            <div class="<%=# _this.prefix %>-restore-order-header">订单详细信息</div>
            <div class="<%=# _this.prefix %>-restore-order">
                <div class="js-order-list"></div>
            </div>
        </div>
        <div class="<%=# _this.prefix %>-restore-list-wrap js-restore-list-wrap" style="display:none">
            <div class="<%=# _this.prefix %>-restore-order-header">订单相关日志</div>
            <div class="<%=# _this.prefix %>-restore-list">
                <div class="js-restore-list"></div>
            </div>
        </div>
    </div>
{{ -- /tpl -- }}
