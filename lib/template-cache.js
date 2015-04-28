
var _cache = {},
    watch = require('watch'),
    started = false;

function TemplateCache(viewPath){
    this.viewPath = viewPath;
}
TemplateCache.prototype = {
    get: function (templatePath, initializer){
        if(!_cache[templatePath]) {
            _cache[templatePath] = initializer();
            startWatcher(this.viewPath);
        }

        return _cache[templatePath];
    }
};


module.exports = TemplateCache;

function startWatcher(path){

    function removeCacheEntry(path){
        delete _cache[path];
    }

    if(!started){
        started = true;
        watch.createMonitor(path, {ignoreUnreadableDir: true, ignoreNotPermitted: true, ignoreDirectoryPattern: true}, function(monitor){
            monitor.on('changed', function(f, curr, prev){
                removeCacheEntry(f);
            });
            monitor.on('removed', function(f, curr, prev){
                removeCacheEntry(f);
            });
        });
        /*watch.watchTree(path, {ignoreUnreadableDir: true, ignoreNotPermitted: true, ignoreDirectoryPattern: true}, function(f, curr, prev){
            console.log(f);
        });*/
    }
}