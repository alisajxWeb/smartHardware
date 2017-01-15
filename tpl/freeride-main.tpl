{{ -- tpl: freeride-order-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
        <% var tmp = _this.list[i]; %>
        <div class="tr-line">
            <div style="width: 20px" class="js-key-">
                <i class="glyphicon glyphicon-triangle-right toggle-msg-btn"></i>
            </div><div style="width: 200px" class="js-key-logTime"><%=# filter('formatLogTime', tmp.logTime) %>
            </div><div style="width: 200px" class="js-key-digest wordbreak"><%= filter('formatDigest', tmp.digest) %>
            </div><div style="width: 210px" class="js-key-urlkey wordbreak pr-10"><%=# tmp.urlkey %>
            </div><div style="width: 150px" class="js-key-errno wordbreak"><%=# (tmp.errno != null && tmp.errno != '') ? (tmp.errno + '：') : '' %><%=# filter('formatMsg', tmp.errno) %>
            </div><div style="width: 150px" class="js-key-uid"><a href="http://mis.didialift.com/admin/user/userdetail?userid=<%=# tmp.uid %>" target="_blank"><%=# tmp.uid %></a>
            </div><div style="width: 200px" class="js-key-orderId"><%= tmp.orderId ? '<a href="http://mis.didialift.com/admin/order/orderdetail?orderid=' + tmp.orderId + '" target="_blank">' + tmp.orderId + '</a>' : '' %>
            </div><div style="width: 100px" class="js-key-uri"><a href="http://api.didialift.com<%= tmp.uri %>" target="_blank">请求链接</a>
            </div><div style="width: 270px" class="js-key-traceid"><a href="http://holmes.intra.didichuxing.com/trace/<%=# tmp.traceid %>?index=shunfengche*" target="_blank"><%=# tmp.traceid %></a>
            </div><div style="width: 100px" class="js-key-procTime"><%=# tmp.procTime %>
            </div><div style="width: 200px" class="js-key-clientHost"><%=# tmp.clientHost %>
            </div><div style="width: 200px" class="js-key-logid"><%=# tmp.logid %></div>
        </div>
        <div class="tr-detail">
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#table_<%= i %>" class="tab-event" aria-controls="table" role="tab" data-toggle="tab">table</a></li>
                <li role="presentation"><a href="#json_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">json</a></li>
            </ul>
            <div class="tab-content inner-tab">
                <div role="tabpanel" class="tab-pane active" id="table_<%= i %>">
                    <div class="inner-table-wrap">
                        <% for(var j = 1; j < _this.keys.length; j++){ %>
                        <div class="tr-line">
                            <div style="width:150px;text-align:right;padding-right: 20px;"><%=# _this.keys[j] %></div><div style="width:850px"><%=# tmp[_this.keys[j]] %></div>
                        </div>
                        <% } %>
                    </div>
                </div>
                <div role="tabpanel" class="tab-pane" id="json_<%= i %>">
                    <pre class="view" inited="0" data-json='<%= JSON.stringify(tmp) %>'></pre>
                </div>
            </div>
        </div>
    <% } %>
{{ -- /tpl -- }}

{{ -- tpl: freeride-order-item-tbody -- }}
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
                            <input type="checkbox" name="orderSelected" value="<%= tmp.orderId %>" checked />
                        <% } %>
                        <a role="button" data-toggle="collapse" data-parent="#order-list-wrap" href="#collapse_<%= i %>" aria-expanded="true" aria-controls="collapse_<%= i %>">订单<%=# tmp.orderId %></a>
                        <% if(_this.isTrip != '0' && !_this.hasShowAll && _this.tripId != 0){ %>
                            <a href="javascript:void(0)" class="btn btn-primary btn-xs show-all-btn">显示所有拼单</a>
                        <% } %>
                        <% if(_this.tripId == 0){ %>
                            (此订单无人接单)
                        <% } %>
                    </h4>
                </div>
                <div id="collapse_<%= i %>" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="order_<%= i %>">
                    <div class="panel-body">
                        <table class="table table-bordered" style="margin-bottom:0">
                            <tbody>
                                <tr>
                                    <td class="label-width">司机ID</td>
                                    <td><%=# tmp.driverId || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">乘客ID</td>
                                    <td><%=# tmp.passengerId || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">是否免单</td>
                                    <td><%=# tmp.freeType == 0 ? '否' : '是' %></td>
                                    
                                </tr>
                                <tr>
                                    <td class="label-width">预约单出发时间</td>
                                    <td><%=# tmp.setupTime || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">车主抢单时间</td>
                                    <td><%=# tmp.striveTime || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">车主抢单经纬度</td>
                                    <td><%=# tmp.striveLng || '-' %>，<%=# tmp.striveLat || '-' %></td>
                                </tr>
                                <tr>
                                    <td class="label-width">创建时间</td>
                                    <td><%=# tmp.createTime || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">达到时间</td>
                                    <td><%=# tmp.arriveTime || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">取消时间</td>
                                    <td><%=# tmp.cancelTime || '-' %></td>
                                </tr>
                                <tr>
                                    <td class="label-width">支付时间</td>
                                    <td><%=# tmp.payTime || '-' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">上车地址</td>
                                    <td><%=# tmp.fromName || '' %>-<%=# tmp.fromAddress || '' %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">上车经纬度</td>
                                    <td><%=# tmp.fromLng %>，<%=# tmp.fromLat %></td>
                                </tr>
                                <tr>
                                    <td class="label-width">目的地</td>
                                    <td><%=# tmp.toName %>-<%=# tmp.toAddress %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">目的地经纬度</td>
                                    <td><%=# tmp.toLng %>, <%=# tmp.toLat %></td>
                                <% if(line !== 12){ %>
                                </tr>
                                <tr>
                                <% } %>
                                    <td class="label-width">是否求带走</td>
                                    <td><%=# (tmp.isO2o == '0' ? '否' : '是') %></td>
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

{{ -- tpl: freeride-order-time-tbody -- }}
    <% for(var i = 0, len = _this.list.length; i < len; i++){ %>
    <% var tmp  = _this.list[i]; %>
    <tr class="click-trigger <%=# tmp.cls %>" data-order="<%=# tmp.orderId %>" data-trace="<%=# tmp.traceid %>">
        <td class="toggle-msg-btn"><i class="glyphicon glyphicon-triangle-right"></i></td>
        <td><%=# filter('formatLogTime', tmp.logTime) %></td>
        <td>
            <div class="fold toggle">
                <div class="normal"><%=# tmp.urlkey %></div>
                <div class="code"><a href="http://api.didialift.com<%=# tmp.uri %>" target="_blank"><%=# tmp.uri %></a></div>
            </div>
        </td>
        <td><%= filter('formatErrorNo', tmp) %></td>
        <td><%=# tmp.orderId %></td>
        <td><a href="http://trace.didichuxing.com/trace/<%=# tmp.traceid %>?index=shunfengche*" target="_blank">详情</a></td>
    </tr>
    <tr class="tr-detail" data-order="<%=# tmp.orderId %>" style="width:auto;">
        <td colspan="6">
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#freeride_in_<%= i %>" class="tab-event" aria-controls="table" role="tab" data-toggle="tab">in</a></li>
                <li role="presentation"><a href="#freeride_out_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">out</a></li>
                <li role="presentation"><a href="#freeride_message_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">message</a></li>
                <li role="presentation"><a href="#freeride_all_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">all</a></li>
                <li role="presentation"><a href="#freeride_fatal_<%= i %>" class="tab-event" aria-controls="json" role="tab" data-toggle="tab">fatal</a></li>
            </ul>
            <div class="tab-content inner-tab">
                <div role="tabpanel" class="tab-pane active" id="freeride_in_<%= i %>">
                    <pre class="view" inited="0" style="margin:0;max-width: 100%;" data-jsonstr='<%= (tmp.in || "{}.") %>'></pre>
                </div>
                <div role="tabpanel" class="tab-pane" id="freeride_out_<%= i %>">
                    <pre class="view" inited="0" style="margin:0;max-width: 100%;" data-jsonstr='<%= (tmp.out || "{}.") %>'></pre>
                </div>
                <div role="tabpanel" class="tab-pane" id="freeride_message_<%= i %>">
                    <pre class="view" inited="1" style="margin:0;max-width: 100%;">
                     <%=# tmp.message %>
                    </pre>
                </div>
                <div role="tabpanel" class="tab-pane" id="freeride_all_<%= i %>">
                    <% var cloneData = $.extend(true, {}, tmp); delete cloneData.message; delete cloneData.in; delete cloneData.out; %>
                    <pre class="view" inited="0" style="margin:0;max-width: 100%;" data-jsonstr='<%= JSON.stringify(cloneData) %>.'></pre>
                </div>
                <div role="tabpanel" class="tab-pane" id="freeride_fatal_<%= i %>">
                    <pre class="view" inited="0" style="margin:0;max-width: 100%;" data-jsonstr='<%= (tmp.out || "{}.") %>'></pre>
                </div>
            </div>
        </td>
    </tr>
    <% } %>
{{ -- /tpl -- }}
