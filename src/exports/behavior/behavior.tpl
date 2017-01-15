{{ -- tpl: exports-behavior-template -- }}
    <div class="<%= _this.prefix %>-behavior-container">
    <% var prefix = _this.prefix; %>
        <div class="<%= prefix %>-behavior-label-list">
            <ul>
                <li class="<%= prefix %>-behavior-label-title">数据来源(点击筛选)：</li>
                <% for(var key in _this.labels){  var obj = _this.labels[key]; %>
                <li class="<%= prefix %>-behavior-label <%=# obj.cls %> js-behavior-label" data-active-key="<%= key %>">
                    <div class="<%= prefix %>-behavior-label-color"></div>
                    <div class="<%= prefix %>-behavior-label-text"><%= obj.text %></div>
                </li>
                <% } %>
            </ul>
        </div>
        <div class="<%= _this.prefix %>-behavior-table">
            <table>
                <thead>
                    <th class="js-sort desc">时间&nbsp;<span class="icon-triangle-bottom"></span><span class="icon-triangle-top"></span></th>
                    <th>数据来源</th>
                    <th>uri</th>
                    <th>uri说明</th>
                    <th>详情</th>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
{{ -- /tpl -- }}


{{ -- tpl: exports-behavior-item-template -- }}
   <% for(var i = 0; i < _this.data.length; i++) { %>
       <% var tmp = _this.data[i]; %>
       <tr class="<%=# _this.colorNames[tmp.dataType].cls %>" data-order-id="<%=# tmp.orderId %>" data-trace-id="<%=# tmp.traceId %>">
            <td><%=# filter('formatLogTime', tmp.stime) %></td>
            <td><%=# tmp.translateDataType %></td>
            <% if(!tmp.orderId){ %>
                <td><%=# tmp.uri %></td>
                <td><%=# tmp.translateUri %></td>
            <% } else { %>
                <td colspan="2">
                    订单id:<%=# tmp.orderId %>  乘客id:<%=# tmp.passengerId %>  乘客手机号:<%=# tmp.passengerPhone %>  司机id:<%=# tmp.driverId %>  司机手机号:<%=# tmp.driverPhone %>
                </td>
            <% } %>
            <td>
                <% if((tmp.orderId || '') + (tmp.traceId || '')){ %>
                    <a class="js-bahavior-detail" href="<%= tmp.href || 'javascript:void(0);' %>" target="_blank">详情</a>
                <% } %>
            </td>
       </tr>
   <% } %>
{{ -- /tpl -- }}
