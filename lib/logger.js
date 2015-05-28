var colors = require('colors/safe');

function getColor(s){
    return s < 300 ? 'green' : s < 400 ? 'gray' : s < 500 ? 'yellow' : 'red';
}

function logRequest(app, req, res, next, error){
    req.on('end', function(){
        app.trigger('logger.requestEnd', {
            address: req.connection.remoteAddress,
            method: req.method,
            url: req.url,
            status: res.statusCode,
            errorMessage: res.errorMessage
        });

    });
    next();
}

logRequest.error = function(app, err){
    app.trigger('error', err);
};

module.exports = logRequest;