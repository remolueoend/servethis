
var path = require('path'),
    fs = require('fs'),
    extend = require('extend');

module.exports = function(app, req, res, next, error){
    var p = path.join(app.dir, unescape(req.url));
    extend(req.servethis, {
        _stats: null,
        reqPath:  p,

        setReqPath: function(p){
            this.reqPath = p;
            this._stats = null;
        },

        stats: function(cb) {
            if(this._stats) {
                cb(null, this._stats); return;
            }
            var _this = this;
            fs.exists(this.reqPath, function (exists) {
                if (exists) {
                    fs.stat(_this.reqPath, function (err, stats) {
                        if(!err) stats.exists = true, _this._stats = stats;
                        cb(err, stats);
                    });
                }else{
                    cb(null, {exists: false});
                }
            });
        }
    });
    next();
};