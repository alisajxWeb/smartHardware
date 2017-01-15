{{ -- tpl: user-info-tr -- }}
    <% _this.users.forEach(function(item) {%>
        <tr>
            <td><%= item.name %></td>
            <td><%= (item.role || 'kf') %></td>
            <td><%= filter('getAuthText', item.url) %></td>
            <td>
                <button data-name='<%= item.name %>' type="button" class="btn btn-primary userMgrDelete" style="margin-right:5px;">删除</button>
                <button data-name='<%= item.name %>' type="button" class="btn btn-primary userMgrResolve" data-toggle="modal" data-target="#addModal">授权</button>
            </td>
        </tr>
    <% }) %>
{{ -- /tpl -- }}
