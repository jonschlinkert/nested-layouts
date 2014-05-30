/*!
 * nested layouts
 *
 * Copyright (c) 2014 nested layouts, contributors
 * Licensed under the MIT License (MIT)
 */

var expect = require('chai').expect;
var matter = require('gray-matter');
var utils = require('../lib/utils');
var stack = require('../');

var body = /\{{([\s\S]+?)}}/g;

var fn = function(str) {
  var context = matter(str);
  return {
    layout: context.data.layout || 'default',
    content: context.content.replace(/^\s*/, ''),
    orig: context.original
  }
};


describe('when nested layouts are defined:', function () {
  it('should recursively inject content from each file into its layout.', function (done) {
    var actual = stack('test/fixtures/matter', 'f', body, fn);
    var expected = [
      'Default!',
      'F above',
      '{{body}}',
      'F below',
      'Default!'
    ].join('\n');

    expect(actual).to.eql(expected);
    done();
  });
});


describe('when nested layouts are defined:', function () {
  it('should recursively inject content from each file into its layout.', function (done) {
    var actual = stack('test/fixtures/matter', 'e', body, fn);
    var expected = [
      'Default!',
      'F above',
      'E above',
      '{{body}}',
      'E below',
      'F below',
      'Default!'
    ].join('\n');

    expect(actual).to.eql(expected);
    done();
  });
});

