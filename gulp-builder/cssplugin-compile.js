var fs = require('fs');
var path = require('path');
var less = require('less');
var config = require('./config');
var cwd = config.cwd;

module.exports = function (content, pth) {
    if (pth.indexOf(config.widgetsPath) > -1 || pth.indexOf(config.exportsPath) > -1) {
        content = content.replace(config.cssPluginRule, function (all, pluginPath) {
            if (pluginPath.indexOf('.') === 0) { // 不会存在代码写在隐藏文件里面的情况
                pluginPath = path.join(path.dirname(pth), pluginPath);
            } else {
                pluginPath = path.join(cwd, pluginPath);
            }
            var data = fs.readFileSync(pluginPath, 'utf-8');
            var compiledCss = '';

            less.render(data, {sync: true, compress: true, relativeUrls: true}, function (err, result) {
                if (err) throw err;
                compiledCss = result.css;
            });
            
            return '\n(function () {var head = document.head || document.getElementsByTagName("head")[0];'
                + 'var style = document.createElement("style");'
                + 'style.setAttribute("type", "text/css");'
                + 'style.innerHTML = "' + compiledCss.replace(/"/g, '\\"').replace(/\s+/g, ' ') + '";'
                + 'head.appendChild(style);})();\n';
        });
    }
    return content;
};