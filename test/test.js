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

var data = function(str) {
  var matter = /\<([\s\S]+?)>/g;
  return str.match(matter)[0].match(/\w+/)[0];
};

var fixture = utils.read('a');


describe('when nested layouts are defined:', function () {
  it('should recursively inject content from each file into its layout.', function () {

    var actual = stack(fixture, body, data);
    var expected = [
      'A above',
      'B above',
      'C above',
      'D above',
      'E above',
      'F above',
      '{{body}}',
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

