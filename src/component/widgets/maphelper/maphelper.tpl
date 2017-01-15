{{ -- tpl: point-template -- }}
    <li class="point-item" data-uuid="<%= _this.uuid %>" title="lat: <%= _this.lat %>, lng: <%= _this.lng %>"><%= _this.name %> <i class="glyphicon glyphicon-remove remove-point-btn"></i></li>
{{ -- /tpl -- }}


{{ -- tpl: maphelper-template -- }}
    <div class="main-maphelper-wrap" style="display:none">
        <div class="maphelper-header">
            <div class="maphelper-title">可视化点地图点</div>
            <ul class="tools">
                <li class="tool-btn clear-all-btn" title="清空标记"><i class="glyphicon glyphicon-refresh"></i></li>
                <li class="tool-btn toggle-small-btn" title="最小化|还原"><i class="glyphicon glyphicon-minus"></i><i class="glyphicon glyphicon-plus"></i></li>
                <li class="tool-btn toggle-fullscreen-btn" title="全屏|退出全屏"><i class="glyphicon glyphicon-resize-full"></i><i class="glyphicon glyphicon-resize-small"></i></li>
                <li class="tool-btn close-btn" title="关闭"><i class="glyphicon glyphicon-remove"></i></li>
            </ul>
        </div>
        <div class="maphelper-body">
            <div class="map-container"></div>
            <div class="map-controls">
                <div class="toggle-fold" title="折叠|展开">
                    <i class="glyphicon glyphicon-menu-right"></i>
                    <i class="glyphicon glyphicon-menu-left"></i>
                </div>
                <div class="points-wrap">
                    <ul class="points-container"></ul>
                </div>
            </div>
        </div>
    </div>
{{ -- /tpl -- }}