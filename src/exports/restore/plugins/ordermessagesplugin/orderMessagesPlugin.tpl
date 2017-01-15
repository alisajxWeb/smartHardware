{{ -- tpl: exports-restore-ordermessageplugin-template -- }}
    <div class="<%= _this.prefix %>-restore-list-table-wrap">
        <table class="<%= _this.prefix %>-restore-list-table">
            <thead>
                <th>时间</th>
                <th>Url</th>
                <th>操作</th>
                <th>订单号</th>
                <th>详情</th>
            </thead>
            <tbody></tbody>
        </table>
    </div>
{{ -- /tpl -- }}

{{ -- tpl: exports-restore-ordermessageplugin-record-template -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
    <% var tmp  = _this.list[i]; %>
    <tr class="<%=# tmp.cls %>" data-order-id="<%=# tmp.orderId %>" data-trace-id="<%=# tmp.traceId %>" style="color:<%=# tmp.color %>;">
        <td><%=# filter('formatLogTime', tmp.startTime) %></td>
        <td><%=# tmp.uri %></td>
        <td><%=# tmp.digest %></td>
        <td><%=# tmp.orderId %>
        <td><a class="js-detail-click" href="<%= tmp.href || 'javascript:void(0);' %>" target="_blank">详情</a></td>
    </tr>
    <% } %>
{{ -- /tpl -- }}