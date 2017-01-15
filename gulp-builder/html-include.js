var fs = require('fs');
var path = require('path');
var through = require('through2');
var Simplite = require('../dep/simplite');
var config = require('./config');

var parseInclude = function (content, encoding) {
    content.replace(config.includeReg, function (all, quot, pth) {
        var tplContent = new String(fs.readFileSync(path.resolve(path.join(config.htmlPath, pth))), encoding);
        Simplite.addTemplate(pth, tplContent);
        parseInclude(tplContent, encoding);
    });
};

var htmlMerge = exports.htmlMerge = function (htmlContent, encoding, rootBase) {
    var key = (new Date().getTime()) + '_t'
    parseInclude(htmlContent, encoding || 'UTF-8');
    Simplite.addTemplate(key, htmlContent);
    Simplite.compiles = {};
    return Simplite.render(key, {
        rootBase: rootBase
    });
};

module.exports = function (rootBase) {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content = htmlMerge(content, encoding, rootBase);
        file.contents = new Buffer(content);
        this.push(file);
        return callback();
    });
};