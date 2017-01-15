define(function (require, exports) {

    require('tpl!../../tpl/sysmgr-main.tpl');

    var constants = require('common/constants');
    var emitter = require('common/eventEmitter');
    var service = require('service/sysmgr-main');
    

    var auth = {};

    constants.needAuthUrls.forEach(function(element) {
        auth[element.url] = element.name;
    });

    function getAuthText(url) {
        if (url) {
            url = url.split(',');
            return url.map(function (item) {
                return auth[item];
            }).join(',')
        }
        return url || '';
    }


    function renderUsers(users) {
        return Simplite.render('user-info-tr', {users: users});
    }

    exports.init = function () {

        var me = this.element;
        var mainPageContainer = me;

        $('#userurl').append(constants.needAuthUrls.slice(1).map(function (item) {
            return '<option value="' + item.key + '">' + item.name + '</option>';
        }).join(''));

        Simplite.addFilter('getAuthText', getAuthText);

        mainPageContainer.on('click', '.userMgrResolve', function () {
            var username = $.trim($(this).data('name'));
            $('#addUserName').val(username);
        });

        $(document).on('click', '.js-save-user', function () {
            var username = $.trim($('#addUserName').val());
            var userrole = $.trim($('#userrole').val());
            var userurl = $.trim($('#userurl').val());
            service.query('/sysmgr/addUser/' + username + '/' + userrole + '/' + userurl).done(function () {
                $('#addModal').modal('hide')
                mainPageContainer.find('#username').val(username);
                alert('操作成功');
                $('#userMgrSearch').click();
            });
        });

        mainPageContainer.on('click', '.userMgrDelete', function () {
            var username = $.trim($(this).data('name'));
            if (confirm('确定删除')) {
                service.query('/sysmgr/deleteUser/' + username).done(function () {
                    alert('操作成功');
                    $('#userMgrSearch').click();
                });
            }
        });

        mainPageContainer.on('click', '#userMgrSearch', function () {
            var username = $.trim(mainPageContainer.find('#username').val());
            if (!username) return alert('请输入用户名');
            service.query('/sysmgr/getUser/' + username).done(function (data) {
                if (data && data.name) {
                    $('#userList').find('tbody').html(renderUsers([data]));
                }
            });
        });
    }
});