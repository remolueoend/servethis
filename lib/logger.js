var colors = require('colors/safe');


function getColor(s){
    return s < 300 ? 'green' : s < 400 ? 'gray' : s < 500 ? 'yellow' : 'red';
}

function logRequest(req, res, next, error){
    req.on('end', function(){
        var msg =
            ('[' + req.connection.remoteAddress + '] ' +
            req.method + ' ' + req.url + ' - ' + colors.bold(res.statusCode) +
            (res.errorMessage ? ' (' +  res.errorMessage + ')' : '')).toString();
        console.log(colors[getColor(res.statusCode)](msg));
    });
    next();
}

logRequest.error = function(err){
    console.error(colors.red(err.stack));
};

module.exports = logRequest;