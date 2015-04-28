var path = require('path'),
    viewEngine = new (require('./view-engine'))(path.join(__dirname, '../views'));

module.exports = function(res, error, viewPath, model){
    try{
        var view = viewEngine.render(viewPath, model);
        res.setHeader('Content-Type', 'text/html');
        res.end(view);
    } catch(err){
        error(err);
    }
};
