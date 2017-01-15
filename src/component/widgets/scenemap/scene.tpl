{{ -- tpl: widget-scenemap-tool-template -- }}
    <div class="map-toolbox">
        <span class="map-boxtit"><i class="map-circle" style="background:<%=# _this.color %>"></i>订单：<b><%=# _this.orderId %></b></span>
        <span class="map-boxtip" data-oid="<%=# _this.orderId %>">
            <a class="tool-btn" data-type="driverLine" data-call="visible" href="javascript:;"><i class="tool-icon"></i>显示司机轨迹</a>
            <a class="tool-btn tool-btn-cur" data-type="driverMarker" data-call="visible" href="javascript:;"><i class="tool-icon"></i>显示司机位置</a>
            <a class="tool-btn" data-type="driverWindow" data-call="window" href="javascript:;"><i class="tool-icon"></i>显示司机提示</a>
            <a class="tool-btn" data-type="passengerLine" data-call="visible" href="javascript:;"><i class="tool-icon"></i>显示乘客轨迹</a>
            <a class="tool-btn tool-btn-cur" data-type="passengerMarker" data-call="visible" href="javascript:;"><i class="tool-icon"></i>显示乘客位置</a>
            <a class="tool-btn" data-type="passengerWindow" data-call="window" href="javascript:;"><i class="tool-icon"></i>显示乘客提示</a>
        </span>
    </div>
{{ -- /tpl -- }}