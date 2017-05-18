var btn = document.getElementsByClassName("login-btn");
var user = document.getElementsByClassName("js-user");
var password = document.getElementsByClassName("js-password");
function clickBtn(){
    var userName = user[0].value;
    var pasw = password[0].value;
    if(userName !== 'jiangxin' || pasw !== '123456'){
        alert('请输入正确的登陆信息');
    }else {
        alert('登陆成功');
        window.location.href= window.location.href + 'eq/main';
    }
};