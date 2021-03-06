define(function (require, exports) {
    
    var service = require('service/login');
    var btn = $(".login-btn");
     exports.init = function () {

     };
    $('.login-page').find('.login-btn').on('click', function(){
        var userName = $(".js-user")[0].value;
        var password = $(".js-password")[0].value;
        var params = {};
        if(userName === '' || password === ''){
            alert('请输入登陆信息');
        }else {
            params.userName = userName;
            params.password = password;
            service.userLogin({
                params: params,
                success: function (data) {
                    var response = data;
                    if(response.result === true) {
                        (function getUserEquips() {
                            service.getUserEquips({
                                success: function (data){
                                    if(data.status.code === 0) {
                                        var info;
                                        sessionStorage.setItem('info', JSON.stringify(data.result));
                                        alert('登录成功！');
                                        window.location.href= window.location.href + 'eq/main';
                                    } else {
                                        alert(data.status.reason);
                                    }
                                },
                                error: function() {
                                    alert('网络失败，请重新登录！');
                                }
                            });
                        }());
                    } else {
                        alert('登录失败，请确认用户名或密码！');
                    }
                }
            });
        }

    });
});
