{{ -- tpl: searchbar-template -- }}
    <div class="searchbar-container">
        <div class="searchbar-form">
            <div class="searchbar-animate-container">
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control js-searchbar-input" placeholder="搜索日志"/>
                    <span class="input-group-btn">
                        <button class="btn btn-primary js-searchbar-search" type="button"><i class="glyphicon glyphicon-search"></i></button>
                    </span>
                    <i class="js-searchbar-reset glyphicon glyphicon-refresh"></i>
                </div>
            </div>
        </div>
        <div class="searchbar-total">共<span class="js-searchbar-num">*</span>条搜索结果</div>
    </div>
{{ -- /tpl -- }}