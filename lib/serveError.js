
var httpError = require('./httpError'),
    render = require('./render'),
    logger = require('./logger');

function renderSimpleErr(res, e){
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h2>' + e.message + '</h2><textarea style="width:100%;height:100%;padding:0;margin:0;border:none;font-size:16px;font-family:\"Courier New\";" disabled>' + e.stack + '</textarea>');
}

module.exports = function(app, req, res, ex){
    var err = ex || httpError.notFound();
    res.statusCode = (err.status = err.status || 500);
    res.errorMessage = err.message;

    if(err.status === 500){
        app.trigger('error', err);
    }

    render(res, function(e){ renderSimpleErr(res, e); }, '~/error', {err: err, req: req});
};