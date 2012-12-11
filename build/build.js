/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(this, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || require.aliases[index];
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj){
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("component-event/index.js", function(module, exports, require){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
};
});
require.register("component-type/index.js", function(module, exports, require){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});
require.register("timoxley-is-collection/index.js", function(module, exports, require){
var typeOf = require('type')

/**
 * Evaluates _obj_ to determine if it's an array, an array-like collection, or
 * something else. This is useful when working with the function `arguments`
 * collection and `HTMLElement` collections.
 * Note: This implementation doesn't consider elements that are also
 *
 *
  
  collections, such as `<form>` and `<select>`, to be array-like.

  @method test
@param {Object} obj Object to test.
@return {Number} A number indicating the results of the test:

 * 0: Neither an array nor an array-like collection.
 * 1: Real array.
 * 2: Array-like collection.

@api private
 **/
module.exports = function isCollection(obj) {
  var type = typeOf(obj)
  console.log('typeOf', obj, type)
  if (type === 'array') return 1
    switch (type) {
      case 'arguments': return 2
      case 'object':
        if (isNodeList(obj)) return 2
        try {
          // indexed, but no tagName (element) or scrollTo/document (window. From DOM.isWindow test which we can't use here),
          // or functions without apply/call (Safari
          // HTMLElementCollection bug).
          if ('length' in obj
              && !obj.tagName
            && !(obj.scrollTo && obj.document)
            && !obj.apply) {
              return 2
            }
        } catch (ex) {}
      default:
        return 0
    }
}

function isNodeList(nodes) {
  return typeof nodes === 'object'
  && /^\[object (NodeList)\]$/.test(Object.prototype.toString.call(nodes))
  && nodes.hasOwnProperty('length')
  && (nodes.length == 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
}


});
require.register("events/index.js", function(module, exports, require){
var events = require('event'),
  isCollection = require('is-collection');

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (!isCollection(el)) {
    events.bind(el, type, fn, capture);
  } else if ( el && el[0] !== undefined ) {
    for ( var i = 0; i < el.length; i++ ) {
      events.bind(el[i], type, fn, capture);
    }
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (!isCollection(el)) {
    events.unbind(el, type, fn, capture);
  } else if ( el && el[0] !== undefined ) {
    for ( var i = 0; i < el.length; i++ ) {
      events.unbind(el[i], type, fn, capture);
    }
  }
};
});
require.alias("component-event/index.js", "events/deps/event/index.js");

require.alias("timoxley-is-collection/index.js", "events/deps/is-collection/index.js");
require.alias("component-type/index.js", "timoxley-is-collection/deps/type/index.js");
