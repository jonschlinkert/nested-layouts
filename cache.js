'use strict';

var Base = require('class-extend');
var expander = require('expander');
var getobject = require('getobject');
var _ = require('lodash');



/**
 * # Cache
 *
 * The Cache constructor is Assemble's parent storage class.
 * Optionally initialize a new `Cache` with the given `obj`.
 *
 * ```js
 * var cache = new Cache();
 * ```
 * @class Cache
 * @param {Object} `obj`
 * @constructor
 * @api public
 */

function Cache (obj) {
  this.cache = obj || {};
}


/**
 * ## .set( key, value )
 *
 * Sets a new element by `key`.
 *
 * **Example**
 *
 * ```js
 * cache.set('a', {b: 'c'});
 *
 * // expand template strings with expander
 * cache.set('a', {b: 'c'}, true);
 * ```
 *
 * Visit [expander's docs](https://github.com/tkellen/expander) for more info.
 *
 * @method set
 * @param {String} `key`
 * @param {*} `value`
 * @param {Boolean} `expand`
 * @api public
 */

Cache.prototype.set = function (key, value, expand) {
  var result;
  if (expand) {
    result = expander.set(this.cache, key, value);
  } else {
    result = getobject.set(this.cache, key, value);
  }
  return result;
};


/**
 * ## .constant(key, value)
 *
 * Store a constant.
 *
 * **Example**
 *
 * ```js
 * cache.constant('a', {b: 'c'});
 * ```
 *
 * @method constant
 * @param {String} key
 * @param {*} value
 * @chainable
 * @api public
 */

Cache.prototype.constant = function(key, value){
  var getter;
  if (typeof value !== 'function'){
    getter = function(){
      return value;
    };
  } else {
    getter = value;
  }
  this.__defineGetter__(key, getter);
  return this;
};


// Boolean checks inspired by express
// https://github.com/visionmedia/express


/**
 * ## .enabled (value)
 *
 * Check if `value` is enabled (truthy).
 *
 * ```js
 * cache.enabled('foo')
 * // => false
 *
 * cache.enable('foo')
 * cache.enabled('foo')
 * // => true
 * ```
 *
 * @method enabled
 * @param {String} value
 * @return {Boolean}
 * @api public
 */

Cache.prototype.enabled = function(value){
  return !!this.set(value);
};


/**
 * ## .disabled (value)
 *
 * Check if `value` is disabled.
 *
 * ```js
 * cache.disabled('foo')
 * // => true
 *
 * cache.enable('foo')
 * cache.disabled('foo')
 * // => false
 * ```
 *
 * @method disabled
 * @param {String} value
 * @return {Boolean}
 * @api public
 */

Cache.prototype.disabled = function(value){
  return !this.set(value);
};


/**
 * ## .enable (value)
 *
 * Enable `value`.
 *
 * **Example**
 *
 * ```js
 * cache.enable('foo');
 * ```
 *
 * @method enable
 * @param {String} value
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.enable = function(value){
  return this.set(value, true);
};


/**
 * ## .disable (value)
 *
 * Disable `value`.
 *
 * **Example**
 *
 * ```js
 * cache.disable('foo');
 * ```
 *
 * @method disable
 * @param {String} value
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.disable = function(value){
  return this.set(value, false);
};


/**
 * ## .exists( key )
 *
 * Return true if an element exists.
 *
 * **Example**
 *
 * ```js
 * cache.exists('person');
 * //=> true
 * ```
 *
 * @method  exists
 * @param   {String}  key
 * @return  {Boolean}
 * @api public
 */

Cache.prototype.exists = function (key) {
  return getobject.exists(this.cache, key);
};


/**
 * ## .merge ( arguments )
 *
 * Extend the cache with the given object.
 * This method is chainable.
 *
 * **Example**
 *
 * ```js
 * var cache = new Cache();
 * cache
 *   .merge({foo: 'bar'}, {baz: 'quux'});
 *   .merge({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method merge
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.merge = function () {
  var args = [].slice.call(arguments);
  _.merge.apply(_, [this.cache].concat(args));
  return this;
};


/**
 * ## .get( key )
 *
 * Get the stored value of `key`.
 *
 * **Example**
 *
 * ```js
 * cache.get('foo');
 * ```
 *
 * @method get
 * @param {*} `key`
 * @param {Boolean} `create`
 * @return {*}
 * @api public
 */

Cache.prototype.get = function (key, create) {
  //return expand ? expander.get(this.cache, key) : getobject.get(this.cache, key);
  return getobject.get(this.cache, key, create);
};


/**
 * ## .all()
 *
 * List all elements on `this.cache`.
 *
 * **Example**
 *
 * ```js
 * cache.all();
 * ```
 *
 * @method list
 * @return {Object}
 * @api public
 */

Cache.prototype.all = function () {
  return this.cache;
};


/**
 * ## .remove(key)
 *
 * Remove an element by `key`.
 *
 * **Example**
 *
 * ```js
 * cache.remove('foo');
 * ```
 *
 * @method remove
 * @param {*} key
 * @api public
 */

Cache.prototype.remove = function (key) {
  delete this.cache[key];
};


module.exports = Base.extend(Cache.prototype);
