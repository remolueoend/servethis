var deferred = require('deferred'),
    q = require('q'),
    tmp = require('tmp'),
    fs = require('fs'),
    crypto = require('crypto'),
    extend = require('extend');

var DEF_OPTS = {
    dirCount: 100,
    minFileSize: 1000,
    maxFileSize: 3000000,
    dirRatio: 0.3,
    minSubItems: 1,
    maxSubItems: 30
};

function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDir(base, opts, dirCount){
    var d = deferred();
    if(dirCount(1)){
        tmp.dir({dir: base, unsafeCleanup: true}, function(err, path){
            if(!err){
                onDirCreated(path, opts, dirCount)(function(pathes){
                    d.resolve(pathes.concat([path]));
                }, function(err){
                    d.reject(err);
                }).done();
            }else{
                d.resolve([]);
            }
        });
    }else{
        d.resolve([]);
    }

    return d.promise;
}

function createFile(base, opts){
    var d = deferred();
    var size = rand(opts.minFileSize, opts.maxFileSize + 1);
    tmp.file({dir: base}, function(err, path, fd){
        if(err){
            d.resolve();
        }else{
            var stream = fs.createWriteStream(null, {fd: fd});
            crypto.pseudoRandomBytes(size, function(err, buf){
                if(!err){
                    stream.write(buf, function(){
                        d.resolve(path);
                    });
                }else{
                    d.resolve();
                }
            });
        }
    });

    return d.promise;
}

function onDirCreated(path, opts, dirCount){
    var d = deferred();
    var defs = [];
    for(var i = 0; i < rand(opts.minSubItems, opts.maxSubItems + 1); i++){
        var r = rand(0, 10000);
        if(r < 10000 * opts.dirRatio){
            defs.push(createDir(path, opts, dirCount));
        }else{
            defs.push(createFile(path, opts));
        }
    }

    if(defs.length){
        deferred.apply(void 0, defs)(function(pathes){
            var pList = pathes instanceof Array ? pathes : [pathes];
            var res = [];
            pList.forEach(function(p){
                if(p instanceof Array){
                    res = res.concat(p);
                }else if(p){
                    res.push(p);
                }
            });
            d.resolve(res);
        }, function(err) { d.reject(err); }).done();
    }else{
        d.resolve([]);
    }

    return d.promise;
}

module.exports = function randFs(base, options){
    var opts = extend({}, DEF_OPTS, options);
    var dc = 0;
    var dirCount = function(c){
        if(c) dc += c;
        return dc <= opts.dirCount;
    };
    return createDir(base, opts, dirCount);
};