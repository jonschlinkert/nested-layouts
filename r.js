var matter = require('gray-matter');
var _ = require('lodash');
var Cache = require('./cache');
var Template = require('./template');

var defaults = {
  title: 'Assemble'
};
var template = new Template();
var cache = new Cache(defaults);


var pages = {
  'a':'---\nlayout: b\nname: A\n---\nA in the middle!',
  'b':'---\nlayout: c\nname: B\n---\nB before <%= body %> B after',
  'c':'---\nlayout: default\nname: C\n---\nC before <%= body %> C after',
  'd':'---\nlayout: false\nname: D\n---\nD before <%= body %> D after',
  'e':'---\nlayout: default\nname: E\n---\nE before <%= body %> E after',
  'f':'---\nlayout: default\nname: F\n---\nF before <%= body %> F after',
  'base':'---\nlayout: false\nname: BASE\n---\nbase before <%= body %> base after',
  'default':'---\nlayout: base\nname: DEFAULT\n---\ndefault before <%= body %> default after',
};

template.cache('fallback', '<%= body %>');
cache.set('fallback', {
  data: {},
  content: template.get('fallback')
});

Object.keys(pages).map(function(key) {
  var page = matter(pages[key]);
  var layout = page.data.layout;
  if (!layout || layout === false) {
    layout = 'fallback';
  }
  template.cache(key, page.content);
  cache.set(key, {
    content: template.get(key),
    layout: layout,
    data: page.data
  });
});

// console.log(template.get('a'))
// console.log(cache.get('a'))

/**
 * [description]
 * @param   {[type]}  acc   The accumulator object.
 * @param   {[type]}  orig  Original, un-parsed string.
 * @param   {String}  key   Name of the current page
 * @return  {[type]}        [description]
 */

var mapped = _.reduce(pages, function (acc, orig, key) {
  var page = cache.get(key);
  var fn = page.content;
  var context = page.data;
  var layout = context.layout;
  // console.log(orig)
  // console.log(fn({body: 'foo'}))
  var isMatch = _.keys(pages).filter(function(page) {
    return cache.get(page).layout === key;
  });
    console.log(isMatch)
  // console.log(template.render(layout, {body: tmpl(context)}))

  // Recursively inject content into parent.
  // while (fn(str).layout) {
    // str = utils.read(layouts, fn(str).layout);
    // stack.push(fn(str).content);

    // if (fn(str).layout === 'default') {
    //   str = utils.read(layouts, 'default');
    //   stack.push(fn(str).content);
    //   break;
    // }
  // }

  return acc;
}, {} );

// console.log(mapped);


// var stack = function(layout, tag, fn) {
//   var str = utils.read(layouts, filepath);
//   var stack = [];

//   stack.push(fn(str).content);

//   // Recursively inject content into parent.
//   while (fn(str).layout) {
//     str = utils.read(layouts, fn(str).layout);
//     stack.push(fn(str).content);

//     if (fn(str).layout === 'default') {
//       str = utils.read(layouts, 'default');
//       stack.push(fn(str).content);
//       break;
//     }
//   }

//   var last = _.last(stack, 2);
//   if (last[0] === last[1]) {
//     stack.pop();
//   }

//   return _.reduce(stack.reverse(), function(a, b, c) {
//     return a.replace(tag, b);
//   });
// };

