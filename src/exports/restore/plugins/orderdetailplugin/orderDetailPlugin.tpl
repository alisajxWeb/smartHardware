{{ -- tpl: exports-restore-orderdetailplugin-template -- }}
     <div class="<%= _this.prefix %>-orderdetail-container js-container expended" data-order-id="<%=# _this.tmp.orderId %>">
        <% var tmp = _this.tmp; %>
        <div class="<%= _this.prefix %>-orderdetail-header" style="background-color:<%= tmp.color %>">
            订单<%=# tmp.orderId %>
            <% if (_this.mainWorkList){ %>
                <div class="<%= _this.prefix %>-orderdetail-steps">
                    <% _this.mainWorkList.forEach(function (item, index) { %>
                    <div class="<%= _this.prefix %>-orderdetail-step-item" data-index="<%= item.index %>" data-id="<%= item.id %>">
                        <span class="<%= _this.prefix %>-orderdetail-step-item-number <%= item.cls %>"><%= item.name %></span>
                    </div>
                    <% }); %>
                </div>
            <% } %>
            <span class="js-expend-action">
                <i class="<%= _this.prefix %>-orderdetail-header-icon-plus">+</i>
                <i class="<%= _this.prefix %>-orderdetail-header-icon-minus">一</i>
            </span>
        </div>
        <div class="<%= _this.prefix %>-orderdetail-body js-body">
            <table class="<%= _this.prefix %>-orderdetail-table">
                <tbody>
                    <tr>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">app时间</td>
                        <td><%=# /^\d+$/g.test(tmp.appTime) ? (function (d) { return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':'); })(new Date(+tmp.appTime)) : (tmp.appTime || '-') %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">地区</td>
                        <td><%=# tmp.area %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">客户端版本</td>
                        <td><%=# tmp.appversion || tmp.appVersion || '-' %></td>
                    </tr>
                    <tr>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">乘客系统</td>
                        <td><%=# (tmp.mobileType || tmp.model || '') %>-<%=# (tmp.os || tmp.osVersion || '') %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">企业用户</td>
                        <td><%=# (tmp.enterprise_user == null) ? '-' : (tmp.enterprise_user == 1 ? '是' : '否') %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">预估车费</td>
                        <td><%=# tmp.estimate_price || '-' %>元</td>
                    </tr>
                    <tr>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">上车地址</td>
                        <td><%=# tmp.fromAddress || '' %>|<%=# tmp.fromName || '' %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">上车经纬度</td>
                        <td class="js-lng-lat"><%=# tmp.flng %>,<%=# tmp.flat %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">目的地</td>
                        <td><%=# tmp.toAddress %>|<%=# tmp.toName %></td>
                    </tr>
                    <tr>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">目的地经纬度</td>
                        <td class="js-lng-lat"><%=# tmp.tlng %>,<%=# tmp.tlat %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">imei</td>
                        <td><%=# tmp.imei || '-' %></td>
                        <td class="<%= _this.prefix %>-orderdetail-label-width">networkType</td>
                        <td><%=# tmp.networkType || '-' %></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
{{ -- /tpl -- }}