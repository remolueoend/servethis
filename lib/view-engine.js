var ejs = require('ejs'),
    extend = require('extend'),
    deferred = require('deferred'),
    path = require('path'),
    fs = require('fs'),
    HtmlHelper = require('./html-helper'),
    TemplateCache = require('./template-cache');

/**
 * Wraps the context of a view.
 *
 * @param path The path of the rendered view
 * @param model The model to use in the view
 * @param [options] Rendering options
 * @param engine The used engine instance
 * @constructor
 */
function ViewData(path, model, options, engine){
    this.path = path;
    this.model = model;
    this.options = options || {};
    this.engine = engine;
    this.html = new HtmlHelper(this);
    this.viewBag = this.options.viewBag || {};
    this.layout = this.options.layout;
    this.sections = this.options.sections;
}
ViewData.prototype = {

    /**
     * Renders the content of a view in a layout.
     *
     * @returns {string}
     */
    renderBody: function(){
        return this.options.childBody || '';
    },

    /**
     * Renders a partial view
     * @param path
     * @param model
     */
    partial: function(path, model){
        return this.engine.render(path, model, {layout: ''}, path.basename(this.path));
    },

    renderSection: function(section){
        return this.sections ? this.sections[section] || '' : '';
    },

    createSection: function(section, content){
        this.sections = this.sections || {};
        this.sections[section] = content;
    }
};

var DEF_OPTS = {
    layout: '~/_layout',
    viewExtension: 'ejs'
};

/**
 * Allows extended rendering of EJS views.
 *
 * @param viewsPath The path of the view directory
 * @param [defaultOptions] Optional default rendering options
 * @constructor
 */
function ViewEngine(viewsPath, defaultOptions){
    this.basePath = viewsPath;
    this.defaultOpts = extend({}, defaultOptions, DEF_OPTS);
    this.cache = new TemplateCache(viewsPath);

}
ViewEngine.prototype = {

    /**
     * Returns the compiled template of the given file path.
     *
     * @param path The path of the template
     * @returns {*}
     */
    getViewTemplate: function(path){
        return this.cache.get(path, function(){
            if(fs.existsSync(path)) {
                var data = fs.readFileSync(path, {encoding: 'UTF-8'});
                return ejs.compile(data);
            }else{
                throw new Error('Could not find view \'' + path + '\'');
            }
        });
    },

    /**
     * Renders the provided view path and returns the output as a string.
     *
     * @param viewPath The path of the view to render
     * @param [model] The model data to use in the view
     * @param [options] Additional rendering options.
     * @param [cwd] Used to render relative partial views.
     * @returns string Output
     */
    render: function(viewPath, model, options, cwd){
        var opts = extend({}, options, this.defaultOpts);
        if(options && typeof options.layout !== 'undefined') opts.layout = options.layout;
        return this.renderView(this.resolvePath(viewPath, cwd, opts), model, opts);
    },

    /**
     * Renders the provided view path and returns the output as a string.
     *
     * @param path The absolute view path to render
     * @param [model] The model data to use in the view
     * @param [options] Additional rendering options.
     * @returns string Output
     */
    renderView: function(path, model, options){
        var template = this.getViewTemplate(path),
            viewData = new ViewData(path, model, options, this),
            output = template(viewData);

        if(viewData.layout && viewData.layout.trim()){
            return this.render(viewData.layout, model, {
                layout: '',
                childBody: output,
                sections: viewData.sections,
                viewBag: viewData.viewBag
            });
        }else{
            return output;
        }
    },

    /**
     * Resolves a relative view path and returns the absolute path.
     *
     * @param p The path to resolve
     * @param [cwd] Optional working directory
     * @param [opts]
     * @returns {*}
     */
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