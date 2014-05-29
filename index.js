'use strict';

var utils = require('./lib/utils');
var _ = require('lodash');

/**
 * Recursively stack nested layouts.
 *
 * @param   {String} `cwd` The directory for layouts.
 * @param   {String} `str` The starting string.
 * @param   {String} `tag` The regex to use for the layout tag, e.g. `{{body}}`
 * @param   {Function} `fn` Function to extract the name of the next layout from the string.
 * @return  {String}
 */

module.exports = function(layouts, filepath, tag, fn) {
  var str = utils.read(layouts, filepath);
  var original = str;
  var stack = [], l = [];

  stack.push(fn(str).content);

  // Recursively inject content into parent.
  while (fn(str).layout) {
    str = utils.read(layouts, fn(str).layout);
    stack.push(fn(str).content);

    if (fn(str).layout === 'default') {
      str = utils.read(layouts, 'default');
      stack.push(fn(str).content);
      break;
    }
  }

  return stack.reduce(function(a, b, c) {
    return a.replace(tag, b);
  });
};