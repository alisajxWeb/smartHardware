{{ -- tpl: my-favourite-item-tpl -- }}
<% _this.list.forEach(function (item) { %>
   <div class="favourite-item">
        <a class="favourite-item-link" href="<%= item.key %>" target="_blank">
            <%= item.description %><i class="glyphicon glyphicon-new-window"></i> 
        </a>
    </div>
<% }); %>
{{ -- /tpl -- }}
