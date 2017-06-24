var argv = require('yargs').argv;

module.exports = {
    api: {
        type: 'prefix', // prefix or suffix
        value: ['/eq/', '/uss/','/proxy/', '/restoredataProxy', '/catchdataProxy', '/holmesProxy', '/proxyLocal'] // or array like ['/api/', '/api-prefix/']
    },
    server: {
        host: argv.h || '0.0.0.0',
        port: argv.p || 9090
    },
    rootBase: '',
    cwd: process.cwd()
};