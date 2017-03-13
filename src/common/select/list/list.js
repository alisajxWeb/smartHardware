define(function (require, exports) {
    /**
     * @require.async list.css
     */
    /**
     * select
     * @param  {object} options [组件设置]
     *
     * options说明：
        {
            // 父容器
            container: '.selecter',
            // 自定义皮肤
            skinName: '',
            // 过滤字段的key
            filterKey: '',
            // 最多显示多少条,
            maxOptions: 10,
            // disable设置
            disable: true,
            // 列表数据
            selectList: [{
                title: 'boxTitle',
                value: 'abc',
                // 可不配置
                checked: true
            }],
            // 组件ready回调
            readyCallback: function (selectedValue, selectedTitle) {
                // 设置的选中值
            },
            // 回调函数
            clickCallback: function (selectedValue, selectedTitle) {
                // selectedValue选中值
            }
        }
     * 
     */

    var select = function (options) {
        this.conf = options;
        this.conf.nodeType = 'select-' + (new Date().getTime() + Math.floor(Math.random() * 100000));
        this.executeSelect();
    };

    select.prototype = {
        setList: function (list) {
            this.conf.selectList = list || [];
            $(this.conf.container).html('');
            this.executeSelect();
        },
        renderOptions: function (list) {
            var arr = [];
            var self = this;
            $.each(list, function (index, item) {
                if (item.checked) {
                    item.selected = 'option-selected';
                    self.selectedValue = item.value;
                    self.selectedTitle = item.title;
                }
                arr.push(self.template(self.selectTmpl.option, item));
            });
            return arr.join('');
        },
        canFilter: function () {
            return !!this.conf.filterKey;
        },
        executeSelect: function () {
            var self = this;
            var list = self.conf.selectList;
            var selectHtml = self.template(self.selectTmpl.select, {
                nodeType: self.conf.nodeType,
                skinName: self.conf.skinName,
                filterCls: self.conf.filterKey ? 'can-filter' : '',
                disable: (list.length === 1 || self.conf.disable) ? 'select-box-disable' : ''
            });

            self.selectedValue = '';
            self.selectedTitle = '';
            self.conf.filterKey && !self.conf.maxOptions && (self.conf.maxOptions = 6);

            $.each(list, function (index, item) {
                item.checked && (selectHtml = selectHtml.replace('请选择', item.title));
            });

            selectHtml = selectHtml.replace('{option}', self.renderOptions(list));

            selectHtml = selectHtml.replace('{filter}', self.canFilter() ? self.selectTmpl.filter : '');

            if (self.canFilter()) {
                $(selectHtml).find('.option-list-wrap').css('maxHeight', self.conf.maxOptions * 30);
            }

            $(self.conf.container).append(selectHtml);

            self.selectEvent();

            typeof self.conf.readyCallback === 'function' && self.conf.readyCallback(self.selectedValue, self.selectedTitle);
        },
        selectTmpl: {
            select: [
                '<div class="select-box ${disable} ${skinName} ${filterCls}" node-type="${nodeType}">',
                '<div class="select-title">',
                '<span class="select-text">请选择</span>',
                '<i class="icon icon-arrowDown"></i>',
                '</div>',
                '<div class="option-box">{filter}<ul class="option-list-wrap">{option}</ul></div>',
                '</div>'
            ].join(''),
            option: [
                '<li class="option-item ${selected}" data-val="${value}" data-tit="${title}">',
                '${title}',
                '</li>'
            ].join(''),
            filter: [
                '<div class="filter-box">',
                '<input class="filter-input" type="text" placeholder="输入搜索" />',
                '</div>'
            ].join(''),
        },
        selectEvent: function () {
            var self = this;
            var selectTimer;
            var selectBox = $('[node-type="' + self.conf.nodeType + '"]');
            var optionBox = selectBox.find('.option-box');
            var optionsWrap = optionBox.find('ul');
            var filterTimer;

            selectBox
                .delegate('.option-item', 'click', function () {
                    var title = $(this).attr('data-tit');
                    var value = $(this).attr('data-val');

                    $(this).addClass('option-selected').siblings().removeClass('option-selected');
                    selectBox.find('.select-text').text(title);
                    optionBox.hide();

                    typeof self.conf.clickCallback === 'function' && self.conf.clickCallback(value, title);
                })
                .delegate('.filter-input', 'keyup', function () {
                    var filterValue = $.trim($(this).val());
                    var key = self.conf.filterKey;
                    if (filterTimer) {
                        clearTimeout(filterTimer);
                    }

                    filterTimer = setTimeout(function () {
                        var list = self.conf.selectList;
                        if (filterValue) {
                            list = self.conf.selectList.filter(function (item) {
                                return item[key].toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
                            });
                        }
                        optionsWrap.html(self.renderOptions(list));
                    });
                })
                .mouseleave(function () {
                    selectTimer = setTimeout(function () {
                        optionBox.hide();
                    }, 300);
                })
                .mouseenter(function (event) {
                    clearTimeout(selectTimer);
                    optionBox.show();
                });
        },
        // 移除已选择项
        removeSelected: function (options) {
            var selectBox = $('[node-type="' + this.conf.nodeType + '"]');
            selectBox.find('.select-text').text(options ? (options.text || '请选择') : '请选择');
            selectBox.find('.option-selected').removeClass('option-selected');
        },
        disable: function () {
            var selectBox = $('[node-type="' + this.conf.nodeType + '"]');
            selectBox.addClass('select-box-disable');
        },
        enable: function () {
            var selectBox = $('[node-type="' + this.conf.nodeType + '"]');
            selectBox.removeClass('select-box-disable');
        },
        template: function (tpl, data) {
            return tpl.replace(/\${(.*?)}/g, function ($, $1) {
                return data[$1] == null ? '' : data[$1];
            });
        },
        setSelected: function (val) {
            var self = this;
            $('.option-item[data-val="' + val + '"]', self.conf.container).trigger('click');
        }
    };
    exports.init = select;
});