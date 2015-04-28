
var mimes = require('../dat/mime-types.json'),
    fs = require('fs'),
    path = require('path');

module.exports = function(req, res, next, error){
    req.servethis.stats(function(err, stats){
        if(err) error(err);
        else if(!stats.exists) error();
        else{
            res.writeHead(200, {
                'Content-Type': mimes[path.extname(req.servethis.reqPath)] || 'text/plain',
                'Content-Length': stats.size
            });
            var readStream = fs.createReadStream(req.servethis.reqPath);
            readStream.pipe(res);
        }
    });
};