var path = require('path');
var fs = require('fs');

exports.read = function(filepath, cwd) {
  var dir = path.join(process.cwd(), 'test/fixtures', filepath);
  return fs.readFileSync(dir + '.tmpl', 'utf8');
};

exports.strip = function(str) {
  return str.replace(/<.>\s*/, '');
};