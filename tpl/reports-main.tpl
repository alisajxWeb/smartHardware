{{ -- tpl: user-access-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.createTime %></td>
            <td><%=# tmp.user %></td>
            <td><%=# tmp.url %></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: user-access-total -- }}
    <div style="font-size: 12px;">该时间段内有<span id="user-count" style="font-size: 18px; color: #f00;"><%=# _this.total %></span>个人使用过把脉系统</div>
{{ -- /tpl -- }}

{{ -- tpl: feedback-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.createTime %></td>
            <td><%=# tmp.user %></td>
            <td><%=# tmp.module %></td>
            <td><%=# filter('formatResolveState', tmp.result) %></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: feedback-total -- }}
    <div style="font-size: 12px;">该时间段内有<span style="font-size: 18px; color: #f00;"><%=# _this.total %></span>次反馈，解决问题<span style="font-size: 18px; color: #f00;"><%=# _this.resolved %></span>个，解决率<span style="font-size: 18px; color: #f00;"><%=# _this.percent %>%</span>，总共<span style="font-size: 18px; color: #f00;"><%=# _this.totalUv %></span>人， 客服<span style="font-size: 18px; color: #f00;"><%=# _this.kfUv %></span>人， 非客服<span style="font-size: 18px; color: #f00;"><%=# _this.totalUv - _this.kfUv %></span>人</div>
{{ -- /tpl -- }}

{{ -- tpl: flow-total -- }}
    <div style="font-size: 12px;">总访问UV：<span style="font-size: 18px; color: #f00;"><%=# _this.uv %></span>，客服UV：<span style="font-size: 18px; color: #f00;"><%=# _this.uvKf %></span>，非客服UV：<span style="font-size: 18px; color: #f00;"><%=# _this.uv - _this.uvKf %></span>，</span>PV：<span style="font-size: 18px; color: #f00;"><%=# _this.pv %></span></div>
{{ -- /tpl -- }}

{{ -- tpl: api-total -- }}
    <div style="font-size: 12px;">总调用次数：<span style="font-size: 18px; color: #f00;"><%=# _this.count %></span>次</div>
{{ -- /tpl -- }}