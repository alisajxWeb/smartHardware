{{ -- tpl: feedback-dialog -- }}
    <div class="info feedback-content">
        <p><font style="font-size: 13px;">以下结果是否解决了您的问题?</font></p>
        <input type="button" class="btn btn-success btn-xs" value="已解决">
        <input type="button" class="btn btn-danger btn-xs" value="未解决">
    </div>
{{ -- /tpl -- }}

{{ -- tpl: driver-listen-order-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr class="<%=# tmp.module %>">  
            <td><%=# tmp.moduleName %></td>
            <td><%=# tmp.logTime %></td>
            <td><%= filter('formatDigest', tmp.digest) %></td>
            <td><div class="fold toggle"><%=# tmp.message %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}


{{ -- tpl: bill-pre-order-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.name %></td>
            <td><%=# tmp.logTime %></td>
            <td>错误码:<%=# tmp.errno %><br>错误信息:<%=# tmp.errmsg %></td>
            <td><div class="fold toggle"><%= filter('formatBillMessage', tmp) %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: begin-bill-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.name %></td>
            <td><%=# tmp.logTime %></td>
            <td>错误码: <%=# tmp.errno %><br/>错误信息: <%=# tmp.errmsg %></td>
            <td><div class="fold toggle"><%= filter('formatBillMessage', tmp) %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: order-price-tbody -- }}
     <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.index %></td>
            <td><%=# tmp.timestamp %></td>
            <td><%=# tmp.lat %>, <%=# tmp.lng %></td>
            <td><%=# filter('formatLoctype', tmp.loctype) %></td>
            <td><%=# tmp.accuracy %></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: end-bill-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.name %></td>
            <td><%=# tmp.logTime %></td>
            <td>错误码: <%=# tmp.errno %><br/>错误信息: <%=# tmp.errmsg %></td>
            <td><div class="fold toggle"><%= filter('formatBillMessage', tmp) %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: pay-bill-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.name %></td>
            <td><%=# tmp.logTime %></td>
            <td>错误码: <%=# tmp.errno %><br/>错误信息: <%=# tmp.errmsg %></td>
            <td><div class="fold toggle"><%= filter('formatBillMessage', tmp) %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}


{{ -- tpl: reward-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.logTime %></td>
            <td class="digest"><%= filter('formatDigest', tmp.digest) %></td>
            <td><div class="fold toggle"><%= filter('formatRewardMessage', tmp) %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: replay-order-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr>
            <td><%=# tmp.appName %></td>
            <td><%=# tmp.logTime %></td>
            <td><%=# filter('formatTitleSetting', tmp.uri) %></td>
            <td><%=# tmp.dltag %></td>
            <td><div class="fold toggle"><%= filter('formatBillMessage', tmp) %></div></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}


{{ -- tpl: gs-restore-item-tbody -- }}
     <div class="row">
        <% var line = Math.ceil(12 / _this.list.length); %>
        <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <div class="col-md-<%= line %>">
            <div class="panel panel-default expanded">
                <div class="panel-heading <%=# tmp.cls %>" role="tab" id="order_<%= i %>">
                    <h4 class="panel-title">
                        <i class="glyphicon glyphicon-triangle-bottom"></i>
                        <i class="glyphicon glyphicon-triangle-right"></i>
                        <% if(_this.hasShowAll){ %>
                            <input type="checkbox" name="orderSelected" value="<%= tmp.orderId %>" checked/>
                        <% } %>
                        <a role="button" data-toggle="collapse" data-parent="#order-list-wrap" href="#collapse_<%= i %>" aria-expanded="true" aria-controls="collapse_<%= i %>">订单<%=# tmp.orderId %></a>
                        <% if(_this.isTrip != '0' && !_this.hasShowAll){ %>
                            <a class="btn btn-primary btn-xs show-all-btn" href="javascript:void(0)">显示所有订单</a>
                        <% } %>
                    </h4>
                </div>
                <div id="collapse_<%= i %>" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="order_<%= i %>">
                    <div class="panel-body">
                        <table class="table table-bordered" style="margin-bottom:0">
                            <tbody>
                                <tr>
                                    <td class="label-width">app时间</td>
                                    <td><%=# tmp.appTime || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">地区</td>
                                    <td><%=# _this.cityMap[tmp.area] || tmp.area %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">客户端版本</td>
                                    <td><%=# tmp.appVersion || '-' %></td>
                                </tr>
                                <tr>
                                    <td class="label-width">乘客系统</td>
                                    <td><%=# tmp.model || '' %>-<%=# tmp.osVersion || '' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">企业用户</td>
                                    <td><%=# (tmp.enterprise_user == null) ? '-' : (tmp.enterprise_user == 1 ? '是' : '否') %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">预估车费</td>
                                    <td><%=# tmp.estimate_price || '-' %>元</td>
                                </tr>
                                <tr>
                                    <td class="label-width">上车地址</td>
                                    <td><%=# tmp.fromName || '' %>-<%=# tmp.fromAddress || '' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">上车经纬度</td>
                                    <td><%=# tmp.flng %>，<%=# tmp.flat %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">目的地</td>
                                    <td><%=# tmp.toName %>-<%=# tmp.toAddress %></td>
                                </tr>
                                <tr>
                                    <td class="label-width">目的地经纬度</td>
                                    <td><%=# tmp.tlng %>, <%=# tmp.tlat %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">程序入口</td>
                                    <td><%=# tmp.from || '' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">Openid</td>
                                    <td><%=# tmp.openid %></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <% } %>
    </div>
{{ -- /tpl -- }}

{{ -- tpl: gs-restore-time-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
    <% var tmp  = _this.list[i]; %>
    <tr class="click-trigger <%=# tmp.cls %>" data-order="<%=# tmp.orderId %>" data-trace="<%=# tmp.traceId %>">
        <td><%=# filter('formatLogTime', tmp.startTime) %></td>
        <td><%=# tmp.uri %></td>
        <td><%=# tmp.digest %></td>
        <td><%=# tmp.orderId %>
        <td><a href="http://trace.didichuxing.com/trace/<%=# tmp.traceId %>?index=zhuanche*" target="_blank">详情</a></td>
    </tr>
    <% } %>
{{ -- /tpl -- }}



{{ -- tpl: env-check-tbody -- }}
    <% for (var dataSource in _this.data) { %>
        <% var tmp = _this.data[dataSource]; tmp.dataSource = dataSource; %>
        <tr>
            <td><%= filter('formatBR', dataSource) %></td>
            <td><%= filter('formatBR', tmp.errno) %></td>
            <td><%= filter('formatBR', tmp.result) %></td>
            <td><%= filter('formatBR', tmp.detail) %></td>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: scene-recovery-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <tr class="<%=# tmp.dataType %>">
            <td><%=# tmp.stime.replace("+0800","") %></td>
            <td><%=# tmp.translateDataType%></td>
            <td>
                <%=# tmp.uri %>
            </td>
            <td>
                <%= tmp.translateUri %>
            </td>
            <%
            if(tmp.traceId != null && tmp.traceId != undefined && tmp.traceId != ''){
            %>
                <td><a href="http://trace.didichuxing.com/trace/<%=# tmp.traceId %>" target="_blank"><input class="detailButton" type="button" value="详情"></a></td>
                
            <%
            }else if(tmp.orderId != null && tmp.orderId != undefined && tmp.orderId != ''){
            %>
                <td class="orderIdtd"><a href="/gs/main#?beginTime=<%=# _this.beginTime %>&endTime=<%=# _this.endTime %>&queryBtn=restoreBtn&tabIndex=8&tripId=<%=# tmp.orderId %>" target="_blank"><input class="detailButton" type="button" value="详情"></a></td>
            <%
            }else{
            %>
                <td class="other"><input type="button" class="no_detailButton" value="详情"></td>
            <%
            }
            %>
        </tr>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: new-reward-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>

        <tr class="tr-normal">
            <td class="toggle-msg-btn icon-td"><i class="glyphicon glyphicon-triangle-right"></i></td>
            <td><%= filter('formatLogTime', tmp.logTime) %></td>
            <td><%=# tmp.orderId %></td>
            <td><%=# tmp.driverId %></td>
            <td><%=# tmp.amountValue %></td>
            <td><%=# tmp.bonusRes %></td>
            <td><%=# tmp.upgradeBonusTimes %></td>
            <td><%=# tmp.tradeType %></td>
            <td><%=# tmp.moduleName %></td>
            <td><%=# tmp.awardStatus %></td>
            <td><%=# tmp.configId %></td>
            <td><%=# tmp.ruleId %></td>
        </tr>
        </tr>
        <tr class="tr-extend" style="display:none;">
            <td colspan="12">
                <ul class="nav nav-tabs" role="tablist">
                    <li role="presentation" class="active"><a href="#gs_digest_<%= i %>" class="tab-event" aria-controls="table" role="tab" data-toggle="tab">查看详情</a></li>
                    <li role="presentation"><a href="#gs_driverInfo_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">司机信息</a></li>
                    <li role="presentation"><a href="#gs_orderInfo_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">订单信息</a></li>
                    <li role="presentation"><a href="#gs_activityReason_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">奖励判断详情</a></li>
                    <li role="presentation"><a href="#gs_message_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">原始日志</a></li>
                </ul>
                <div class="tab-content inner-tab">
                    <div role="tabpanel" class="tab-pane active" id="gs_digest_<%= i %>">
                        <pre><%= filter('formatDigest2', tmp.digest) || '没有详情' %></pre>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="gs_driverInfo_<%= i %>">
                        <pre><%= filter('formatAwardMessage', tmp.driverInfo) || '没有司机信息' %></pre>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="gs_orderInfo_<%= i %>">
                        <pre><%= filter('formatAwardMessage', tmp.orderInfo) || '没有订单信息' %></pre>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="gs_activityReason_<%= i %>">
                        <pre><%= filter('formatAwardMessage', tmp.activityReason) || '没有奖励判断详情' %></pre>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="gs_message_<%= i %>">
                        <pre style="white-space:initial;"><%=# tmp.message || '没有原始日志' %></pre>
                    </div>
                </div>
            </td>
        </tr>
    <% } %>
{{ -- /tpl -- }}