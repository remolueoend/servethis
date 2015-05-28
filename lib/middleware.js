function Middleware(app){
    this.app = app;
    this.handlers = [];
    this.onerror =function(){};
}

function mkArr(args, i){
    return Array.prototype.slice.call(args, i || 0);
}

Middleware.prototype = {
    use: function(handler) {
        this.handlers.push(handler);
        return this;
    },
    error: function(handler){
        this.onerror = handler;
    },
    call: function(req, res){
        this.callHandler(0, req, res);
    },
    callHandler: function(index, req, res){
        var self = this, addArgs = mkArr(arguments, 3);
        if(typeof this.handlers[index] === "function"){
            var args = [this.app, req, res];
            args.push(function(){
                self.callHandler.apply(self, [index+=1, req, res].concat(mkArr(arguments)));
            });
            args.push(function(){
                self.onerror.apply(void 0, [self.app, req, res].concat(mkArr(arguments)));
            });
            args.concat(addArgs);
            try{
                this.handlers[index].apply(void 0, args);
            }catch(err){
                this.onerror.apply(void 0, [this.app, req, res, err]);
            }
        }else{
            this.onerror.apply(void 0, [this.app, req, res].concat(addArgs));
        }
    }
};

module.exports = Middleware;