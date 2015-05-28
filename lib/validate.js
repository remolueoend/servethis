var httpError = require('./httpError');

module.exports = function(app, req, res, next, error){
    if(app.flags.indexOf('p') === -1 && (req.connection.remoteAddress !== '127.0.0.1' &&  req.connection.remoteAddress !== '::1'))
        error(httpError.forbidden('Remote connections are not accepted on this server.'));
    else
        next();
};