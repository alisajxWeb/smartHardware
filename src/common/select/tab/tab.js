/**
 * @require.async tab.css
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
    executeSelect: function () {
        var self = this;
        var selectedValue = '';
        var selectedTitle = '';
        var optionHtml = [];
        var selectHtml = self.template(self.selectTmpl.select, {
            nodeType: self.conf.nodeType,
            skinName: self.conf.skinName
        });

        $.each(self.conf.selectList, function (index, item) {
            if (item.checked) {
                item.selected = 'option-selected';
                selectedValue = item.value;
                selectedTitle = item.title;
                selectHtml = selectHtml.replace('请选择', item.title);
            }
            optionHtml.push(self.template(self.selectTmpl.option, item));
        });

        selectHtml = selectHtml.replace('{option}', optionHtml.join(''));

        $(self.conf.container).append(selectHtml);
        self.selectEvent();
        typeof self.conf.readyCallback === 'function' && self.conf.readyCallback(selectedValue, selectedTitle);
    },
    selectTmpl: {
        select: [
            '<ul class="select-tab-box ${skinName}" node-type="${nodeType}">',
            '{option}',
            '</ul>'
        ].join(''),
        option: [
            '<li class="option-item ${selected}" data-val="${value}" data-tit="${title}">',
            '${title}',
            '</li>'
        ].join('')
    },
    selectEvent: function () {
        var self = this;
        var selectBox = $('[node-type="' + self.conf.nodeType + '"]');

        selectBox
            .delegate('.option-item', 'click', function () {
                var title = $(this).attr('data-tit');
                var value = $(this).attr('data-val');

                $(this).addClass('option-selected').siblings().removeClass('option-selected');
                selectBox.find('.select-text').text(title);

                typeof self.conf.clickCallback === 'function' && self.conf.clickCallback(value, title);
            });
    },
    template: function (tpl, data) {
        return tpl.replace(/\${(.*?)}/g, function ($, $1) {
            return data[$1] || '';
        });
    }
};

module.exports = select;
