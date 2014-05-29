/*!
 * nested layouts
 *
 * Copyright (c) 2014 nested layouts, contributors
 * Licensed under the MIT License (MIT)
 */

var expect = require('chai').expect;
var utils = require('../lib/utils');
var matter = require('gray-matter');
var stack = require('../');

var body = /\{{([\s\S]+?)}}/g;

var fn = function(str) {
  return {
    layout: matter(str).data.layout || 'default',
    content: matter(str).content.replace(/^\s*/, ''),
    orig: matter(str).original
  }
};

describe('when nested layouts are defined:', function () {
  it('should recursively inject content from each file into its layout.', function (done) {

    var actual = stack('test/fixtures/matter', 'a', body, fn);
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
    done();
  });
});

