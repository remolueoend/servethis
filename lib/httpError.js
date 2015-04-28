module.exports = {
    notFound: function(message){
        return this.error(message || "The requested path cannot be found.", 404);
    },
    serverError: function(err){
        return this.error(message || "A server occurred.", 500);
    },

    forbidden: function(message){
        return this.error(message || "Forbidden.", 403);
    },

    error: function(message, status){
        var e = new Error(message || "An unknown error occurred.");
        e.status = status || 500;
        return e;
    }
};