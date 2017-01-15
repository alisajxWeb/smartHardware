{{ -- tpl: filtermenu-template -- }}
    <div class="filter-items">
        <% for(var i = 0, len = _this.filters.length; i < len; i++){ %>
        <% var tmp = _this.filters[i]; %>
        <% var idKey = _this.key + '_' + i %>
        <div class="filter-item">
            <input id="<%= idKey %>" type="checkbox" value="<%= tmp.code %>" checked/>
            <label for="<%= idKey %>"><%= tmp.txt %></label>
        </div>
        <% } %>
        <div class="actions">
            <button class="btn btn-xs btn-default reject-btn">取消</button>
            <button class="btn btn-xs btn-primary resolve-btn">确定</button>
        </div>
    </div>
{{ -- /tpl -- }}