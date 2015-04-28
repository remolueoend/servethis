
var mimes = require('mime-types'),
    fs = require('fs'),
    path = require('path');

module.exports = function(req, res, next, error){
    req.servethis.stats(function(err, stats){
        if(err) error(err);
        else if(!stats.exists) error();
        else{
            res.writeHead(200, {
                'Content-Type': mimes.lookup(path.extname(req.servethis.reqPath)),
                'Content-Length': stats.size
            });
            var readStream = fs.createReadStream(req.servethis.reqPath);
            readStream.pipe(res);
        }
    });
};