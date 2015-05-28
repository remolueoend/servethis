var args = Array.prototype.slice.call(process.argv, 2),
    hasPort = args[0] && args[0].indexOf('-') === -1,
    port = hasPort ? parseInt(args[0]) || 8080 : 8080,
    flagIndex = hasPort ? 1 : 0,
    flags = args[flagIndex] && args[flagIndex].indexOf('-') === 0 ? args[flagIndex].substring(1) : '',
    ServeThis = require('./servethis'),
    colors = require('colors/safe');

var app = new ServeThis(port, process.cwd(), flags);
app.start();

app.on('logger.requestEnd', function(e, d){
    var msg =
        ('[' + d.address + '] ' +
        d.method + ' ' + d.url + ' - ' + colors.bold(d.status) +
        (d.errorMessage ? ' (' +  d.errorMessage + ')' : '')).toString();
    console.log(colors[getColor(d.status)](msg));
});

app.on('error', function(e, err){
    console.error(colors.red(err.stack));
});

function getColor(s){
    return s < 300 ? 'green' : s < 400 ? 'gray' : s < 500 ? 'yellow' : 'red';
}