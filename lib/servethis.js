
var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    open = require('open'),
    httpError = require('./httpError');
    args = Array.prototype.slice.call(process.argv, 2),
    hasPort = args[0] && args[0].indexOf('-') === -1,
    port = hasPort ? parseInt(args[0]) || 8080 : 8080,
    flagIndex = hasPort ? 1 : 0,
    flags = args[flagIndex] && args[flagIndex].indexOf('-') === 0 ? args[flagIndex].substring(1) : '',
    port = parseInt(args[0]) || 8080,
    cwd = process.cwd(),
    mw = new (require('./middleware'))();

mw
    .use(function(req, res, next){ console.log(req.method + ' ' + req.url); next(); })
    .use(function(req, res, next, error){
        if(flags.indexOf('p') === -1 && (req.connection.remoteAddress !== '127.0.0.1' &&  req.connection.remoteAddress !== '::1'))
            error(httpError.forbidden('Remote connections are not accepted on this server.'));
        else
            next();
    })
    .use(require('./prepRequest'))
    .use(require('./serveDir'))
    .use(require('./serveFile'))
    .error(require('./serveError'));

http.createServer(function(req, res){
    mw.call(req, res);
}).listen(port, function(){
    if(flags.indexOf('s') === -1) {
        open('http://localhost:' + port);
    }
});