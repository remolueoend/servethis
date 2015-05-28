
var http = require('http'),
    open = require('open'),
    Middleware = require('./middleware'),
    logger = require('./logger'),
    ontrigger = require('ontrigger');

/**
 *
 * @param port
 * @param dir
 * @param flags
 * @constructor
 */
function ServeThis(port, dir, flags){
    ontrigger(this);
    this.port = port;
    this.dir = dir;
    this.flags = flags;
    var _this = this;
    this.server = http.createServer(function(req, res){ _this.onRequest(req, res); });
    this.mw = new Middleware(this);
    this.mw
        .use(require('./logger'))
        .use(require('./validate'))
        .use(require('./prepRequest'))
        .use(require('./serveDir'))
        .use(require('./serveFile'))
        .error(require('./serveError'));

    this.server.on('error', function(err){
        _this.trigger('error', err);
    });
}
ServeThis.prototype = {

    start: function(){
        var _this = this;
        this.on('requestStart', function(e, req, res){
            _this.mw.call(req, res);
        });
        this.server.listen(this.port, function(){ _this.onListening(); });

    },

    onRequest: function(req, res){
        var _this = this;
        this.trigger('requestStart', req, res);
        req.on('end', function(){
            _this.trigger('requestEnd', req, res);
        });
    },

    onListening: function(){
        if(this.flags.indexOf('s') === -1) {
            open('http://localhost:' + this.port);
        }
        this.trigger('started');
    }
};

module.exports = ServeThis;

