{{ -- tpl: taxi-log-tr -- }}
    <% _this.list.forEach(function(tmp) {%>
        <tr>
            <td><%=# filter('formatLogTime', tmp.timestamp) %></td>
            <td><%=# tmp.cityName %></td>
            <td><%=# tmp.uuid %></td>
            <td><%= filter('formatDigest', tmp.digest) %></td>
        </tr>
    <% }) %>
{{ -- /tpl -- }}
{{ -- tpl: taxi-scene-tbody -- }}
   <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var item = _this.list[i]; %>
        <tr class=" tr-main " data-extend-index="<%= i %>">
            <td class="toggle-msg-btn icon-td text-center"><i class="glyphicon glyphicon-plus"></i></td>
            <td><%= filter('formatLogTime', item.logTime) %></td>
            <td style="word-break: break-all;"><%=# item.uri %></td>
            <td><%=# item.translateUri %></td>
            <td><%=# item.digest %></td>
            <td><%=# item.orderId %></td>
            <td><a href="http://trace.didichuxing.com/trace/<%=# item.traceid %>?index=taxi*" target="_blank">详情</a></td>
        </tr>
        <% if (item.children){ item.children.forEach(function (tmp, index) { %>
            <tr class="tr-normal js-normal-<%= i %> " >
                <td class="toggle-msg-detail-btn icon-td text-right"><i class="glyphicon glyphicon-triangle-right"></i></td>
                <td><%= filter('formatLogTime', tmp.logTime) %></td>
                <td style="word-break: break-all;"><%=# tmp.uri %></td>
                <td><%=# tmp.translateUri %>-<%=# tmp.dltag %></td>
                <td colspan="2"><%=# tmp.digest %></td>  
                <td><a href="http://trace.didichuxing.com/trace/<%=# tmp.traceid %>?index=taxi*" target="_blank">详情</a></td>
            </tr>
            <tr class="tr-extend">
                <td colspan="7">
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation" class="active"><a href="#taxi_inArgs_<%= i %>_<%= index %>" class="tab-event" aria-controls="table" role="tab" data-toggle="tab">请求参数</a></li>
                        <li role="presentation"><a href="#taxi_outArgs_<%= i %>_<%= index %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">返回结果</a></li>
                        <li role="presentation"><a href="#taxi_ext_<%= i %>_<%= index %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">扩展信息</a></li>
                        <% if (tmp.message){ %>
                        <li role="presentation"><a href="#taxi_message_<%= i %>_<%= index %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">原始日志</a></li>
                        <% } %>
                    </ul>
                    <div class="tab-content inner-tab">
                        <div role="tabpanel" class="tab-pane active" id="taxi_inArgs_<%= i %>_<%= index %>">
                            <%= filter('formatArgs', tmp.inArgs) || '<div class="text-center no-data">没有请求参数</div>' %>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="taxi_outArgs_<%= i %>_<%= index %>">
                            <%= filter('formatArgs', tmp.outArgs) || '<div class="text-center no-data">没有返回结果</div>' %>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="taxi_ext_<%= i %>_<%= index %>">
                            <%=filter('formatArgs', tmp.extInfo) || '<div class="text-center no-data">没有扩展信息</div>' %>
                        </div>
                        <% if (tmp.message){ %>
                        <div role="tabpanel" class="tab-pane js-message-tab" id="taxi_message_<%= i %>_<%= index %>">
                            <pre style="white-space: initial;">
                                <%= tmp.message %>
                            </pre>
                        </div>
                        <% } %>
                    </div>
                </td>
            </tr>
        <% }); } %>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: taxi-scene-empty -- }}
    <tr>
        <td colspan="7">暂无结果</td>
    </tr>
{{ -- /tpl -- }}