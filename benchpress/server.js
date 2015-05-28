var ServeThis = require('../lib/servethis'),
    path = require('path'),
    deferred = require('deferred'),
    rmdir = require('rimraf'),
    request = require('request'),
    nappd = require('nappd'),
    Period = require('./period'),
    fs = require('fs'),
    createFileSystem = require('./randFs'),
    args = process.argv.slice(2),
    port = parseInt(args[0]) || 8090,
    reqCount = parseInt(args[1]) || 1000,
    printInt, client;

createFileSystem(process.cwd())(function(pathes){

    console.log('Created ' + pathes.length + ' items in root.');

    var urls = pathes.map(function(p){
        return path.relative(process.cwd(), p);
    });

    var app = new ServeThis(port, process.cwd(), '-sp');
    app.on('started', function(){
        nappd.fromAppPath(path.join(__dirname, 'client.js'), path.join(__dirname, 'client.out'))(function(daemon){
            client = daemon;
            client.start(['localhost:' + port, reqCount])(function(pid){
                console.log('client started (PID: ' + pid + ')');
            });
        });
    });

    var cPeriod = new Period();

    app.on('requestStart', function(e, req, res){
        if(req.url === '/get-pathes') {
            res.end(JSON.stringify(urls));
            e.preventDefault();
        }else if(req.url === '/stop'){
            console.log('finished');
            clearInterval(printInt);
            cPeriod.printDefault();
            res.end('server stopping.');
            e.preventDefault();
            process.exit(0);
            app.stop();
        }else{
            cPeriod.startMeasure(req);
        }
    });

    app.on('requestEnd', function(e, req){
        cPeriod.endMeasure(req);
    });

    printInt = setInterval(function(){
        cPeriod.printDefault();
    }, 2000);



    app.start();
});

function exitHandler(options, err){
    console.log('cleaning up..');
    if (err) console.log(err.stack);
    if(client) client.stop();
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));