var ejs = require('ejs'),
    extend = require('extend'),
    deferred = require('deferred'),
    path = require('path'),
    fs = require('fs'),
    HtmlHelper = require('./html-helper'),
    TemplateCache = require('./template-cache');

/**
 *
 * @param path
 * @param model
 * @param options
 * @constructor
 */
function ViewData(path, model, options, engine){
    this.path = path;
    this.model = model;
    this.options = options || {};
    this.engine = engine;
    this.html = new HtmlHelper(this);
}
ViewData.prototype = {
    renderBody: function(){
        return this.options.childBody || '';
    },

    partial: function(path, model){

    },

    renderSection: function(section){
        return this.options.sections ? this.options.sections[section] || '' : '';
    },

    createSection: function(section, content){
        this.options.sections = this.options.sections || {};
        this.options.sections[section] = content;
    }
};

var DEF_OPTS = {
    layout: '~/_layout',
    viewExtension: 'ejs'
};

/**
 *
 * @param viewsPath
 * @param defaultOptions
 * @constructor
 */
function ViewEngine(viewsPath, defaultOptions){
    this.basePath = viewsPath;
    this.defaultOpts = extend({}, defaultOptions, DEF_OPTS);
    this.cache = new TemplateCache(viewsPath);

}
ViewEngine.prototype = {

    getViewTemplate: (function(){
        var cache = {};
        return function(path){

            return this.cache.get(path, function(){
                if(fs.existsSync(path)) {
                    var data = fs.readFileSync(path, {encoding: 'UTF-8'});
                    cache[path] = ejs.compile(data);

                    return cache[path];
                }else{
                    throw new Error('Could not find view \'' + path + '\'');
                }
            });
        };
    })(),

    render: function(viewPath, model, options, cwd){
        var opts = extend({}, options, this.defaultOpts);
        if(options && typeof options.layout !== 'undefined') opts.layout = options.layout;
        return this.renderView(this.resolvePath(viewPath, cwd, opts), model, opts);
    },

    renderView: function(path, model, options){
        var template = this.getViewTemplate(path),
            viewData = new ViewData(path, model, options, this),
            output = template(viewData);

        if(viewData.options.layout && viewData.options.layout.trim()){
            return this.render(viewData.options.layout, model, {
                layout: '',
                childBody: output,
                sections: viewData.options.sections
            });
        }else{
            return output;
        }
    },

    resolvePath: function(p, cwd, opts){
        var fullPath;
        if(p.indexOf('~/') === 0){
            fullPath = path.join(this.basePath, p.substring(2)) + '.' + opts.viewExtension;
        }else if(!path.isAbsolute(p)){
            fullPath = path.join(cwd, p);
        }else{
            fullPath = p;
        }

        return fullPath;
    }
};

module.exports = ViewEngine;