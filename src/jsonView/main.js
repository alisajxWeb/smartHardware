define(function(require, exports){

    var utils = require('common/utils');
    
    exports.init = function () {
        var json = sessionStorage.getItem('json-data');
        if (json) {
            var html = utils.formatJSON(JSON.parse(json), true);
            $('#view').html(html);
        }
    };
});
 