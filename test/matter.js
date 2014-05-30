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
      'Default!',
      'F above',
      'E above',
      'D above',
      'C above',
      'B above',
      'A above',
      '{{body}}',
      'A below',
      'B below',
      'C below',
      'D below',
      'E below',
      'F below',
      'Default!'
    ].join('\n');

    expect(actual).to.eql(expected);
    done();
  });
});

