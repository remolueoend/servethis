function Middleware(){
    this.handlers = [];
}
Middleware.prototype = {
    use: function(handler) {
        this.handlers.push(handler);
        return this;
    },
    call: function(req, res){
        this.callHandler(req, res, 0);
    },
    callHandler: function(req, res, index){
        var self = this;
        if(typeof this.handlers[index] === "function"){
            this.handlers[index].call(void 0, req, res, function(){
                self.callHandler(req, res, index+=1);
            });
        }
    }

};

module.exports = Middleware;