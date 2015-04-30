
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
    .use(require('./logger'))
    .use(require('./validate'))
    .use(require('./prepRequest'))
    .use(require('./serveDir'))
    .use(require('./serveFile'))
    .error(require('./serveError'));

function onListening(){
    if(flags.indexOf('s') === -1) {
        open('http://localhost:' + port);
    }
}

function onRequest(req, res){
    mw.call(req, res);
}

var server = http.createServer(onRequest);
try{
    server.listen(port, onListening);
}catch(err){
    console.log('Could not start listener on port ' + port + ': ' + err.message);
}

