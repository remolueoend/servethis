var request = require('request'),
    path = require('path'),
    deferred = require('deferred'),
    Period = require('./period'),
    args = process.argv.slice(2),
    host = args[0],
    count = parseInt(args[1]),
    printInt;


function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var period = new Period();

request('http://' + host + '/get-pathes', function(err, response, body){
    var reqs = [], pathes = JSON.parse(body), c = 0;
    var int = setInterval(function(){
        var url = pathes[rand(0, pathes.length - 1)];
        reqs.push(sendRequest('http://' + host + '/' + url));
        c++;
        if(c > count){
            clearInterval(int);

            deferred.apply(void 0, reqs)(function(){
                clearInterval(printInt);
                period.printDefault();
                console.log('finished. Stopping server...');
                request('http://' + host + '/stop', function(err, response, body){
                    console.log('server stopped.');
                });
            });
        }
    }, 0);

    printInt = setInterval(function(){
        period.printDefault();
    }, 2000);
});

function sendRequest(url){
    var o = {};
    var d = deferred();
    period.startMeasure(o);
    request(url, function (err, response, body) {
        period.endMeasure(o);
        d.resolve();
    });

    return d.promise;
}