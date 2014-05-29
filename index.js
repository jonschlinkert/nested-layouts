/**
 * Recursively stack nested layouts.
 *
 * @param   {String} `str` The staring layout string.
 * @param   {Function} `fn` Function to extract the name of the next layout from the string.
 * @return  {String}
 */
var utils = require('./lib/utils');

module.exports = function(str, tag, fn) {
  var original = str;
  var stack = [];

  stack.push(utils.strip(str));

  // Recursively inject content into parent.
  while (str.indexOf('<') >= 0) {
    var layout = fn(str);
    str = utils.read(layout);
    stack.push(utils.strip(str));
    if (str === original) {
      break;
    }
  }

  return stack.reduce(function(a, b) {
    return a.replace(tag, b);
  });
};