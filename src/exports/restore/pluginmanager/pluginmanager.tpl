{{ -- tpl: exports-restore-pluginmanager-template -- }}
    <ul class="<%=# _this.prefix %>-pluginmanager-container">
        <% var plugins = _this.plugins %>
            <% if(_this.showAllBtn){ %>
            <li class="<%=# _this.prefix %>-pluginmanager-show-all js-show-all">显示整个行程所有拼单</li>
            <% } %>
        <% _this.orderInfos.forEach(function (item) { %>
            <li class="js-pluginmanager-order <%= item.cls %>" style="color:<%= item.color %>;">
                <div class="<%=# _this.prefix %>-pluginmanager-title js-pluginmanager-title">
                    <span class="<%=# _this.prefix %>-pluginmanager-title-icon"></span>
                    订单<%=# item.orderId %>
                    <div class="<%=# _this.prefix %>-pluginmanager-title-actions">
                        <a href="javascript:void(0);" class="<%=# _this.prefix %>-pluginmanager-title-action js-action" data-action="select">全选</a>
                        <a href="javascript:void(0);" class="<%=# _this.prefix %>-pluginmanager-title-action js-action" data-action="cancel">取消全选</a>
                    </div>
                </div>
                <ul class="<%=# _this.prefix %>-pluginmanager-list js-pluginmanager-list">
                    <% plugins.forEach(function (plugin) { %>
                    <li class="<%=# _this.prefix %>-pluginmanager-item js-pluginmanager-plugin" data-color="<%=# item.color %>" data-plugin-name="<%=# plugin.name %>" data-order-id="<%=# item.orderId %>">
                        <span class="<%=# _this.prefix %>-pluginmanager-item-icon js-pluginmanager-item-icon"></span><%=# plugin.text %>
                    </li>
                    <% }) %>
                </ul>
            </li>
        <% }) %>
    </uL>
{{ -- /tpl -- }}
