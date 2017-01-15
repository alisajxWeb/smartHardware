{{ -- tpl: btb-pay-empty -- }}
    <tr>
        <td colspan="7">暂无结果</td>
    </tr>
{{ -- /tpl -- }}

{{ -- tpl: btb-scene-main-item -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var item = _this.list[i]; %>
        <tr class="<%= item.cls %> tr-main <%= item.errno == '1' ? 'tr-error' : '' %>" data-extend-index="<%= i %>">
            <td class="toggle-msg-btn icon-td text-center"><i class="glyphicon glyphicon-plus"></i></td>
            <td><%= filter('formatLogTime', item.logTime) %></td>
            <td style="word-break: break-all;"><%=# item.apiName %></td>
            <td><%=# filter('formatApiName', item) %></td>
            <td><%= filter('formatDigest', item.msg) %></td>
            <td><%= item.orderId %></td>  
            <td><a href="http://trace.didichuxing.com/trace/<%=# item.traceid %>?index=<%=# {btb: 'btb*', gs: 'zhuanche*'}[item.logType]%>" target="_blank">详情</a></td>
        </tr>
        <% if (item.children){ item.children.forEach(function (tmp, index) { %>
            <tr class="tr-normal js-normal-<%= i %> <%= tmp.errno == '1' ? 'tr-error' : '' %>">
                <td colspan="2"><span class="toggle-msg-detail-btn icon-td"><i class="glyphicon glyphicon-triangle-right"></i></span><%= filter('formatLogTime', tmp.logTime) %></td>
                <td style="word-break: break-all;"><%=# tmp.apiName %></td>
                <td><%=# filter('formatApiName', tmp) %>-<%= tmp.dltag %></td>
                <td colspan="2"><%= filter('formatDigest', tmp.msg) %></td>  
                <td><a href="http://trace.didichuxing.com/trace/<%=# tmp.traceid %>?index=<%=# {btb: 'btb*', gs: 'zhuanche*'}[tmp.logType]%>" target="_blank">详情</a></td>
            </tr>
            <tr class="tr-extend">
                <td colspan="7">
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation" class="active"><a href="#btb_in_<%= i %>_<%= index %>" class="tab-event" aria-controls="table" role="tab" data-toggle="tab">请求参数</a></li>
                        <li role="presentation"><a href="#btb_out_<%= i %>_<%= index %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">返回结果</a></li>
                        <li role="presentation"><a href="#btb_ext_<%= i %>_<%= index %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">扩展信息</a></li>
                        <% if (tmp.message){ %>
                        <li role="presentation"><a href="#btb_message_<%= i %>_<%= index %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">原始日志</a></li>
                        <% } %>
                    </ul>
                    <div class="tab-content inner-tab">
                        <div role="tabpanel" class="tab-pane active" id="btb_in_<%= i %>_<%= index %>">
                            <%= filter('formatInArgs', tmp.in) || '<div class="text-center no-data">没有请求参数</div>' %>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="btb_out_<%= i %>_<%= index %>">
                            <%= filter('formatOutArgs', tmp.out) || '<div class="text-center no-data">没有返回结果</div>' %>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="btb_ext_<%= i %>_<%= index %>">
                            <%= filter('formatExtInfo', tmp.extInfo) || '<div class="text-center no-data">没有扩展信息</div>' %>
                        </div>
                        <% if (tmp.message){ %>
                        <div role="tabpanel" class="tab-pane js-message-tab" id="btb_message_<%= i %>_<%= index %>">
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

{{ -- tpl: btb-pay-subitem -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%= filter('formatLogTime', tmp.logTime) %></td>    
            <td><%= filter('formatDigest', tmp.digest) %></td>
            <td><div class="fold toggle"><%=# tmp.message %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}


{{ -- tpl: btb-rule-item -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr class="<%= tmp.status != 0 ? 'disabled' : '' %>">
            <td><%= tmp.name %></td>
            <td><%= tmp.pay_mode %></td>
            <td>
                <% if (tmp.use_car_time){ %>
                <div class="list-fold-container fold-text">
                    <% tmp.use_car_time.forEach(function (timeObj) { %>
                        <%= timeObj.title %><%= timeObj.value %><br/>
                    <% }); %>
                    <% if(tmp.use_car_time.length > 1) { %>
                        <a href="javascript:void(0);" class="action action-fold js-fold-action">展开<i class="glyphicon glyphicon-plus"></i></a>
                        <a href="javascript:void(0);" class="action action-unfold js-fold-action">收起<i class="glyphicon glyphicon-minus"></i></a>
                    <% } %>
                </div>
                <% } %>
            </td>
            <td>
                <% if(tmp.use_car_position && tmp.use_car_position.all){ %>
                <div class="list-fold-container fold-text text-right">
                    上下车地点：
                    <% tmp.use_car_position.all.forEach(function (position) { %>
                        <%= position.name %><%= position.poi_name %><br/>
                    <% }); %>
                    <% if(tmp.use_car_position.all.length > 1) { %>
                        <a href="javascript:void(0);" class="action action-fold js-fold-action">展开<i class="glyphicon glyphicon-plus"></i></a>
                        <a href="javascript:void(0);" class="action action-unfold js-fold-action">收起<i class="glyphicon glyphicon-minus"></i></a>
                    <% } %>
                </div>
                <% } %>
                <% if (tmp.use_car_position && tmp.use_car_position.on){ %>
                <div class="list-fold-container fold-text text-right">
                    上车地点：
                    <% tmp.use_car_position.on.forEach(function (position) { %>
                        <%= position.name %><%= position.poi_name %><br/>
                    <% }); %>
                    <% if(tmp.use_car_position.on.length > 1) { %>
                    <a href="javascript:void(0);" class="action action-fold js-fold-action">展开<i class="glyphicon glyphicon-plus"></i></a>
                    <a href="javascript:void(0);" class="action action-unfold js-fold-action">收起<i class="glyphicon glyphicon-minus"></i></a>
                    <% } %>
                </div>
                <% } %>
                <% if (tmp.use_car_position && tmp.use_car_position.off){ %>
                <div class="list-fold-container fold-text text-right">
                    下车地点：
                    <% tmp.use_car_position.off.forEach(function (position) { %>
                        <%= position.name %><%= position.poi_name %><br/>
                    <% }); %>
                    <% if(tmp.use_car_position.off.length > 1) { %>
                    <a href="javascript:void(0);" class="action action-fold js-fold-action">展开<i class="glyphicon glyphicon-plus"></i></a>
                    <a href="javascript:void(0);" class="action action-unfold js-fold-action">收起<i class="glyphicon glyphicon-minus"></i></a>
                    <% } %>
                </div>
                <% } %>
            </td>
            <td>
                <% if(tmp.use_car_srv){ %>
                <div class="list-fold-container fold-text">
                    <% tmp.use_car_srv.forEach(function (car){ %>
                        <%= car %><br/>
                    <% }); %>
                    <% if(tmp.use_car_srv.length > 1) { %>
                        <a href="javascript:void(0);" class="action action-fold js-fold-action">展开<i class="glyphicon glyphicon-plus"></i></a>
                        <a href="javascript:void(0);" class="action action-unfold js-fold-action">收起<i class="glyphicon glyphicon-minus"></i></a>
                    <% } %>
                </div>
                <% } %>
            </td>
            <td>
                <% if(tmp.require_level){ %>
                    <div class="list-fold-container fold-text">
                        <% tmp.require_level.forEach(function (level) { %>
                            <%= level %><br/>
                        <% }); %>
                        <% if(tmp.require_level.length > 1) { %>
                            <a href="javascript:void(0);" class="action action-fold js-fold-action">展开<i class="glyphicon glyphicon-plus"></i></a>
                            <a href="javascript:void(0);" class="action action-unfold js-fold-action">收起<i class="glyphicon glyphicon-minus"></i></a>
                        <% } %>
                    </div>
                <% } %>
            </td>
            <td><%= tmp.is_use_quota == 1 ? '是' : '否' %></td>
            <td><%= tmp.status == 0 ? '正常' : '删除' %></td>
            <td><%= tmp.update_time %></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: btb-step-template -- }}
    <div class="popover fade right in" role="tooltip">
            <div class="arrow" style="top: 50%;"></div>
            <div class="popover-content"><%= _this.str %></div>
    </div>
{{ -- /tpl -- }}