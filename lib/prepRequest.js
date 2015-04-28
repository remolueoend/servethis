
var path = require('path'),
    fs = require('fs'),
    cwd = process.cwd();

module.exports = function(req, res, next, error){
    var p = path.join(cwd, req.url);
    req.servethis = {
        reqPath:  p,
        stats: (function(){
            var _stat;
            return function(cb) {
                if(_stat) {
                    cb(null, _stat); return;
                }
                var _this = this;
                fs.exists(this.reqPath, function (exists) {
                    if (exists) {
                        fs.stat(_this.reqPath, function (err, stats) {
                            if(!err) stats.exists = true, _stat = stats;
                            cb(err, stats);
                        });
                    }else{
                        cb(null, {exists: false});
                    }
                });
            };
        })()
    };
    next();
};