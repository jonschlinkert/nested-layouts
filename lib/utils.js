var path = require('path');
var matter = require('gray-matter');
var fs = require('fs');

exports.read = function(cwd, filepath) {
  var dir = path.join(process.cwd(), cwd, filepath);
  return fs.readFileSync(dir + '.tmpl', 'utf8');
};

exports.strip = function(str) {
  return str.replace(/<.>\s*/, '');
};