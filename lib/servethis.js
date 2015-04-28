
var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    open = require('open'),
    args = Array.prototype.slice.call(process.argv, 2),
    port = parseInt(args[0]) || 8080,
    cwd = process.cwd(),
    mw = new (require('./middleware'))();

mw
    .use(function(req, res, next){ console.log(req.method + ' ' + req.url); next(); })
    .use(require('./prepRequest'))
    .use(require('./serveDir'))
    .use(require('./serveFile'))
    .error(require('./serveError'));

http.createServer(function(req, res){
    mw.call(req, res);
}).listen(port);

//open('http://localhost:' + port);