/*!
 * nested layouts
 *
 * Copyright (c) 2014 nested layouts, contributors
 * Licensed under the MIT License (MIT)
 */

var expect = require('chai').expect;
var utils = require('../lib/utils');
var stack = require('../');

var body = /\{{([\s\S]+?)}}/g;
var matter = /\<([\s\S]+?)>/g;

var layout = function(str) {
  if (/</.test(str)) {
    return str.match(matter)[0].match(/\w+/)[0];
  }
  return 'default';
};

var content = function (str) {
  return utils.strip(str);
};

var fn = function(str) {
  return {
    layout: layout(str),
    content: content(str)
  }
};


describe('when nested layouts are defined:', function () {
  it('should recursively inject content from each file into its layout.', function () {

    var actual = stack('test/fixtures/simple', 'a', body, fn);
    var expected = [
      'A above',
      'B above',
      'C above',
      'D above',
      'E above',
      'F above',
      'Default!',
      '{{body}}',
      'Default!',
      'F below',
      'E below',
      'D below',
      'C below',
      'B below',
      'A below'
    ].join('\n');

    expect(actual).to.eql(expected);
  });
});

