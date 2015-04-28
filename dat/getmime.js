
var request = require('request'),
    cheerio = require('cheerio');

request('http://www.freeformatter.com/mime-types-list.html', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var mimes = {};
        var $ = cheerio.load(body);

        $('table > tbody > tr').each(function(){
            var tds = $(this).children('td'),
                ext = tds.eq(2).text().trim(),
                val = tds.eq(1).text().trim();
            if(ext.length && ext !== 'N/A' && val.length){
                mimes[ext] = val;
            }
        });

        console.log(JSON.stringify(mimes, null, 4));

    }else{
        console.error('Failed to requet mime types:');
        console.error(JSON.stringify(error));
    }
});