define(function (require, exports) {

    require('./base-nav');


    var Feature = require('component/widgets/feature/feature');

    // store里面的数据是页面内共享的
    var store = require('common/store');

    var userService = require('service/common/user-service');
    var myService = require('service/my-favourite-main');

    function loadOMG() {
        window.Omega = {
            userName : store.get('userData').username,
            productName:'bamai-web',
            debugMode : false
        };

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://webapp.didistatic.com/static/webapp/shield/z/omega/omega/0.1.6/omega.min.js";
        document.body.appendChild(script);
    }

    function canStar() {
        var path = window.location.pathname.substring(window.rootBase.length);
        var hasFind = false;

        if (path === '/') {
            return false;
        }

        ['/catchdata/main', '/reports/main', '/my/'].forEach(function (item) {
            if (path.indexOf(item) !== -1) {
                hasFind = true;
            }
        });

        return !hasFind;
    }

    function showNps() {
        
    }

    exports.init = function () {

        var deffer = $.Deferred();

        var moduleNode = this.element;

        moduleNode.find('.user-account .logout-btn').click(function () {
            userService.logout();
        });

        (function () {
            $('.nps-container .go-btn').click(function () {
                $('.nps-container').remove();
            });
            $.get(window.rootBase + '/proxyLocal/questionnaire/checkUserQuestionnaire/1').done(function (response){
                if (response.success) {
                    $('.nps-container').show();
                    $('.nps-container').find('.nps-content-container').addClass('animated zoomInDown');
                }
            });
        })();

        (function (moduleNode){
            var starDialog = $('#starDialog');
            var starContainer = moduleNode.find('.star-action');

            starContainer.click(function () {
                if (!$(this).hasClass('stared')) {
                    starDialog.modal('show');
                }
            });

            starDialog.on('click', '.js-save-star', function () {

                var $btn = $(this).button('loading');

                var nameEle = starDialog.find('.js-name');
                var name = $.trim(nameEle.val());
                var url = window.location.pathname + window.location.search + window.location.hash;

                if (!name) {
                    return nameEle.parent().addClass('has-error');
                }
                
                userService.addFavourite(store.get(url), {
                    autoSaveName: name,
                    autoSaveUrl: url
                }).done(function (res) {
                    $btn.button('reset');
                    var startUrls;
                    nameEle.val('');
                    if (startUrls = store.get('stared')) {
                        startUrls[url] = true;
                    } else {
                        startUrls = {};
                        startUrls[url] = true;
                        store.set('stared', startUrls);
                    }
                    starDialog.modal('hide');
                    starContainer.addClass('stared');
                });
            });

            myService.getList().done(function (response) {
                var startUrls = store.get('stared');
                var url = window.location.pathname + window.location.search + window.location.hash;
                
                if (!startUrls) {
                    startUrls = {};
                    store.set('stared', startUrls);
                }

                response.forEach(function (item) {
                    startUrls[item.key.substring(item.key.indexOf('#') + 1)] = true;
                });

                if (startUrls[url]){
                    starContainer.addClass('stared');
                } else {
                    starContainer.removeClass('stared');
                }

                starContainer[canStar() ? 'show' : 'hide']();
            });
            
        })(moduleNode);

        userService.getUserData(Math.round(Math.random() * 100)).done(function (resp) {
            if (resp) {
                
                store.set('userData', resp);

                showNps();

                moduleNode.find('.user-name').text(resp.username);

                loadOMG();

                deffer.resolve(resp);
                
            } else {
                
                deffer.reject('请登录');
                
            }
        });

        return deffer.promise();
    };

    // 启动模块初始化
    require('dep/moduleHandler').init();

});