/**
 * verb <https://github.com/assemble/verb>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');


/**
 * # new Template( options )
 *
 * Template class.
 *
 * @class Template
 * @constructor
 * @namespace Base
 * @param {Object} `options`
 */

function Template(config) {
  config = config || {};
  this.context = config.context || {};
  this.options = config.options || {};

  this._cache = {};
  this._orig = {};

  this.engine = this.options.engine || _.template;

  if (!this.engine.compile) {
    this.engine.compile = this.engine;
  }
}


/**
 * ## .parse( str )
 *
 * Parse a string into an object and extend the context with the result.
 *
 * The following properties are on the returned object:
 *
 * - `orig`: the original string
 * - `data`: any front matter
 * - `content`: the content of the file
 *
 * **Example**
 *
 * ```js
 * var str = file.readFileSync('foo.md');
 * template.parse( str );
 * //=> {data: {}, content: 'Foo', orig: {}}
 * ```
 *
 * @method parse
 * @param  {String} `str`
 * @param  {Object} `options`
 * @api public
 */

Template.prototype.parse = function (str, options) {
  return _.extend(matter(str), options);
};


/**
 * ## .cache( name, str )
 *
 * Cache a template by name.
 *
 * **Example**
 *
 * ```js
 * template.cache('person', 'Person is <%= name %>');
 * ```
 *
 * @method cache
 * @param   {String} `name`
 * @return  {String}
 * @api public
 */

Template.prototype.cache = function(name, str) {
  this._cache[name] = this.engine.compile(str);
  this._orig[name] = str;
};


/**
 * ## .compile( content )
 *
 * Return a compiled a template function.
 *
 * **Example**
 *
 * ```js
 * template.compile('Person is <%= name %>');
 * //=> returns the compiled function
 * ```
 *
 * @method  compile
 * @param   {String} `str`
 * @return  {Function}
 * @api public
 */

Template.prototype.compile = function(str) {
  return this.engine.compile(str);
};


/**
 * ## .get( name, orig )
 *
 * Returned a cached raw template as a string or a function.
 *
 * **Example**
 *
 * ```js
 * template.get('person');
 * //=> returns the compiled function
 *
 * template.get('person', true);
 * //=> 'Person is <%= name %>'
 * ```
 *
 * @method  get
 * @param   {String} `name`
 * @param   {Boolean} `orig` If `true`, return the original string.
 * @return  {String}
 * @api public
 */

Template.prototype.get = function(name, orig) {
  return orig ? this._orig[name] : this._cache[name];
};


/**
 * ## .exists( name )
 *
 * Returned `true` if the template exists.
 *
 * @method exists
 * @param   {String} `name`
 * @return  {Boolean}
 * @api public
 */

Template.prototype.exists = function (name) {
  return this._orig.hasOwnProperty(name);
};


/**
 * ## .render( name, context )
 *
 * Render a template function to a string with the given context.
 *
 * **Example**
 *
 * ```js
 * var template = new Template({name: 'Jon'});
 * template.render('person');
 * //=> 'Person is Jon
 * template.render('person', {name: 'Brian'});
 * //=> 'Person is Brian
 * ```
 *
 * @method  render
 * @param   {String} `name`
 * @param   {Object} `context`
 * @return  {String}
 * @api public
 */

Template.prototype.render = function (name, context) {
  context = _.extend(this.context, context);
  return this._cache[name](context);
};


module.exports = Template;
