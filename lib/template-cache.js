
var watch = require('watch');

/**
 * Cache using file paths as cache keys. If the file changes or gets removed,
 * the cache entry gets dropped automatically.
 *
 * @param viewPath The path of the base directory
 * @constructor
 */
function FileBasedCache(basePath){
    this.basePath = basePath;
    this.cache = {};
    var _this = this;
    this.watcher = new FileWatcher(basePath, function(f){
        delete _this.cache[f];
    });
}
FileBasedCache.prototype = {
    get: function (templatePath, initializer){
        if(!this.cache[templatePath]) {
            this.cache[templatePath] = initializer();
            this.watcher.start();
        }

        return this.cache[templatePath];
    }
};

function FileWatcher(path, onChange){
    this.path = path;
    this.started = false;
    this.onChange = onChange;
    this.options = {
        ignoreUnreadableDir: true,
        ignoreNotPermitted: true,
        ignoreDirectoryPattern: true
    };
}
FileWatcher.prototype = {
    start: function(){
        if(!this.started){
            this.started = true;
            var _this = this;
            watch.createMonitor(this.path, this.options, function(monitor){
                monitor.on('changed', function(f, curr, prev) {
                    _this.onChange(f);
                });
                monitor.on('removed', function(f, curr, prev){
                    _this.onChange(f);
                });
            });
        }
    }
};

module.exports = FileBasedCache;