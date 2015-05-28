
var render = require('./render'),
    fs = require('fs'),
    path = require('path');

var defaults = [
    'index.html',
    'default.html',
    'index.htm',
    'default.htm'
];

function getDefaultFile(files){
    for(var i = 0; i < defaults.length; i++) {
        for (var j = 0; j < files.length; j++) {
            if(defaults[i] === files[j]){
                return files[j];
            }
        }
    }
}

function fileStats(base, files, cb){

    var result = [], c = 0, add = function(base, name){
        var fullPath = path.join(base, name);
        fs.stat(fullPath, function(err, s){
            result.push({
                fullPath: fullPath,
                name: name,
                isDir: s.isDirectory(),
                link: path.relative(process.cwd(), fullPath),
                modified: {
                    date: s.ctime,
                    toString: function(){
                        var d = this.date;
                        return d.toLocaleString()
                    }
                },
                size: s.size
            });
            if (c >= files.length - 1) {
                cb(result);
            } else{
                c++;
            }
        });
    };

    if(!files.length){
        cb(result); return;
    }

    for(var i = 0; i < files.length; i++){
        add(base, files[i]);
    }
}

function sortStats(stats){
    stats.sort(function(a, b){
        if(a.isDir && !b.isDir) return -1;
        if(b.isDir && !a.isDir) return 1;
        if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    return stats;
}

module.exports = function(app, req, res, next, error){
    req.servethis.stats(function(err, stats){
        if(err) error(err);
        else if(!stats.exists) error();
        else{
            if(stats.isDirectory()){
                fs.readdir(req.servethis.reqPath, function(err, files){
                    if(err) error(err);
                    else{
                        var defFile = getDefaultFile(files);
                        if(defFile){
                            req.servethis.setReqPath(path.join(req.servethis.reqPath, defFile));
                            next();
                        }else{
                            fileStats(req.servethis.reqPath, files, function(stats){
                                render(res, error, '~/directory', {
                                    stats: sortStats(stats),
                                    folder: {
                                        name: path.basename(req.servethis.reqPath),
                                        link: path.relative(process.cwd(), req.servethis.reqPath),
                                        parentLink: path.relative(process.cwd(), path.dirname(req.servethis.reqPath))
                                    },
                                    req: req
                                });
                            });
                        }
                    }
                });
            }else{
                next();
            }
        }
    });
};