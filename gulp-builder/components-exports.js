var through = require('through2');
var rjs = require('requirejs');
var path = require('path');
var tplPlubinCompile = require('./tplplugin-compile');
var cssPluginCompile = require('./cssplugin-compile');
var config = require('./config');

module.exports = function (filePath) {
    var baseUrl = 'src';
    var startIndex = filePath.indexOf(baseUrl);
    var name = filePath.slice(startIndex + 1 + baseUrl.length, -3);
    rjs.optimize({
        baseUrl: baseUrl,
        name: name,
        paths: {
            tpl: 'common/tpl',
            css: 'common/css',
            dep: '../dep'
        },
        stubModules: ['tpl'],
        //optimize: 'none',
        optimizeAllPluginResources: true,
        onBuildRead: function (moduleName, pth, contents) {
            // 处理widgets里面的css插件
            contents = cssPluginCompile(contents, pth);
            contents = tplPlubinCompile(contents, pth);
            return contents;
        },
        onBuildWrite: function (moduleName, pth, contents) {
            if (moduleName === 'tpl') {
                return '';
            }
            return contents;
        },
        out: path.join(config.buildPath, config.jsPath, name + '.js')
    });
};