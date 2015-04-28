
var cheerio = require('cheerio');

function createTag(name){
    return cheerio.load('<' + name + '></' + name + '>').root();
}

function addAttrs(tag, attrs){
    if(attrs) {
        for (var a in attrs) {
            if (attr.hasOwnProperty(a)) {
                tag.attr(a, attrs[a]);
            }
        }
    }
}

function HtmlHelper(viewData){
    this.viewData = viewData;
}
HtmlHelper.prototype = {
    link: function(text, url, attrs){
        var tag = createTag('a')
        //addAttrs(tag, attrs);
        tag.attr('href', url);
        tag.text(text);
        return tag.toString();
    }
};

module.exports = HtmlHelper;