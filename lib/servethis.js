
var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    args = Array.prototype.slice.call(process.argv, 2),
    port = parseInt(args[0]) || 8080,
    cwd = process.cwd();

http.createServer(function(req, res){
    var p = path.join(cwd, req.url);
    fs.stat(p, function(err, stats){
        if(stats.isFile()){
            serveFile(res, stats);
        }else if(stats.isDirectory()){
            serveFolder(res, stats);
        }else{
            
        }
    });

}).listen(port);