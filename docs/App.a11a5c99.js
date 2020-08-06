// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/vue/dist/vue.runtime.esm.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */

/*  */
var emptyObject = Object.freeze({}); // These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.

function isUndef(v) {
  return v === undefined || v === null;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isTrue(v) {
  return v === true;
}

function isFalse(v) {
  return v === false;
}
/**
 * Check if value is primitive.
 */


function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number' || // $flow-disable-line
  typeof value === 'symbol' || typeof value === 'boolean';
}
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */


function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
/**
 * Get the raw type string of a value, e.g., [object Object].
 */


var _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */


function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}
/**
 * Check if val is a valid array index.
 */


function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

function isPromise(val) {
  return isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function';
}
/**
 * Convert a value to a string that is actually rendered.
 */


function toString(val) {
  return val == null ? '' : Array.isArray(val) || isPlainObject(val) && val.toString === _toString ? JSON.stringify(val, null, 2) : String(val);
}
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */


function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */


function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');

  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}
/**
 * Check if a tag is a built-in tag.
 */


var isBuiltInTag = makeMap('slot,component', true);
/**
 * Check if an attribute is a reserved attribute.
 */

var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
/**
 * Remove an item from an array.
 */

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);

    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
/**
 * Check whether an object has the property.
 */


var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
/**
 * Create a cached version of a pure function.
 */


function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
/**
 * Camelize a hyphen-delimited string.
 */


var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
/**
 * Capitalize a string.
 */

var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
/**
 * Hyphenate a camelCase string.
 */

var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */

function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

var bind = Function.prototype.bind ? nativeBind : polyfillBind;
/**
 * Convert an Array-like object to a real Array.
 */

function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);

  while (i--) {
    ret[i] = list[i + start];
  }

  return ret;
}
/**
 * Mix properties into target object.
 */


function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }

  return to;
}
/**
 * Merge an Array of Objects into a single Object.
 */


function toObject(arr) {
  var res = {};

  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }

  return res;
}
/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */


function noop(a, b, c) {}
/**
 * Always return false.
 */


var no = function (a, b, c) {
  return false;
};
/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */


var identity = function (_) {
  return _;
};
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */


function looseEqual(a, b) {
  if (a === b) {
    return true;
  }

  var isObjectA = isObject(a);
  var isObjectB = isObject(b);

  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);

      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */


function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }

  return -1;
}
/**
 * Ensure a function is called only once.
 */


function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

var SSR_ATTR = 'data-server-rendered';
var ASSET_TYPES = ['component', 'directive', 'filter'];
var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured', 'serverPrefetch'];
/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
};
/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */

var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
/**
 * Check if a string starts with $ or _
 */

function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}
/**
 * Define a property.
 */


function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
/**
 * Parse simple path.
 */


var bailRE = new RegExp("[^" + unicodeRegExp.source + ".$_\\d]");

function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }

  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) {
        return;
      }

      obj = obj[segments[i]];
    }

    return obj;
  };
}
/*  */
// can we use __proto__?


var hasProto = ('__proto__' in {}); // Browser environment sniffing

var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/); // Firefox has a "watch" function on Object.prototype...

var nativeWatch = {}.watch;
var supportsPassive = false;

if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', {
      get: function get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    }); // https://github.com/facebook/flow/issues/285

    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
} // this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV


var _isServer;

var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }

  return _isServer;
}; // detect devtools


var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/* istanbul ignore next */

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */
// $flow-disable-line


if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/function () {
    function Set() {
      this.set = Object.create(null);
    }

    Set.prototype.has = function has(key) {
      return this.set[key] === true;
    };

    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };

    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }();
}
/*  */


var warn = noop;
var tip = noop;
var generateComponentTrace = noop; // work around flow check

var formatComponentName = noop;

if ("development" !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;

  var classify = function (str) {
    return str.replace(classifyRE, function (c) {
      return c.toUpperCase();
    }).replace(/[-_]/g, '');
  };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && !config.silent) {
      console.error("[Vue warn]: " + msg + trace);
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && !config.silent) {
      console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>';
    }

    var options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;

    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
  };

  var repeat = function (str, n) {
    var res = '';

    while (n) {
      if (n % 2 === 1) {
        res += str;
      }

      if (n > 1) {
        str += str;
      }

      n >>= 1;
    }

    return res;
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;

      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];

          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }

        tree.push(vm);
        vm = vm.$parent;
      }

      return '\n\nfound in\n\n' + tree.map(function (vm, i) {
        return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
      }).join('\n');
    } else {
      return "\n\n(found in " + formatComponentName(vm) + ")";
    }
  };
}
/*  */


var uid = 0;
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */

var Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();

  if ("development" !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) {
      return a.id - b.id;
    });
  }

  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
}; // The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.


Dep.target = null;
var targetStack = [];

function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
/*  */


var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = {
  child: {
    configurable: true
  }
}; // DEPRECATED: alias for componentInstance for backwards compat.

/* istanbul ignore next */

prototypeAccessors.child.get = function () {
  return this.componentInstance;
};

Object.defineProperties(VNode.prototype, prototypeAccessors);

var createEmptyVNode = function (text) {
  if (text === void 0) text = '';
  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
} // optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.


function cloneVNode(vnode) {
  var cloned = new VNode(vnode.tag, vnode.data, // #7975
  // clone children array to avoid mutating original in case of cloning
  // a child.
  vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned;
}
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */


var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
/**
 * Intercept mutating methods and emit events
 */

methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    var args = [],
        len = arguments.length;

    while (len--) args[len] = arguments[len];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;

      case 'splice':
        inserted = args.slice(2);
        break;
    }

    if (inserted) {
      ob.observeArray(inserted);
    } // notify change


    ob.dep.notify();
    return result;
  });
});
/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */

var shouldObserve = true;

function toggleObserving(value) {
  shouldObserve = value;
}
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */


var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);

  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }

    this.observeArray(value);
  } else {
    this.walk(value);
  }
};
/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */


Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};
/**
 * Observe a list of Array items.
 */


Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
}; // helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */


function protoAugment(target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}
/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */

/* istanbul ignore next */


function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */


function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }

  var ob;

  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }

  if (asRootData && ob) {
    ob.vmCount++;
  }

  return ob;
}
/**
 * Define a reactive property on an Object.
 */


function defineReactive$$1(obj, key, val, customSetter, shallow) {
  var dep = new Dep();
  var property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) {
    return;
  } // cater for pre-defined getter/setters


  var getter = property && property.get;
  var setter = property && property.set;

  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;

      if (Dep.target) {
        dep.depend();

        if (childOb) {
          childOb.dep.depend();

          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }

      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */

      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      /* eslint-enable no-self-compare */


      if ("development" !== 'production' && customSetter) {
        customSetter();
      } // #7981: for accessor properties without setter


      if (getter && !setter) {
        return;
      }

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */


function set(target, key, val) {
  if ("development" !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot set reactive property on undefined, null, or primitive value: " + target);
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }

  var ob = target.__ob__;

  if (target._isVue || ob && ob.vmCount) {
    "development" !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
    return val;
  }

  if (!ob) {
    target[key] = val;
    return val;
  }

  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val;
}
/**
 * Delete a property and trigger change if necessary.
 */


function del(target, key) {
  if ("development" !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot delete reactive property on undefined, null, or primitive value: " + target);
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }

  var ob = target.__ob__;

  if (target._isVue || ob && ob.vmCount) {
    "development" !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
    return;
  }

  if (!hasOwn(target, key)) {
    return;
  }

  delete target[key];

  if (!ob) {
    return;
  }

  ob.dep.notify();
}
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */


function dependArray(value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */


var strats = config.optionMergeStrategies;
/**
 * Options with restrictions
 */

if ("development" !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
    }

    return defaultStrat(parent, child);
  };
}
/**
 * Helper that recursively merges two data objects together.
 */


function mergeData(to, from) {
  if (!from) {
    return to;
  }

  var key, toVal, fromVal;
  var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i]; // in case the object is already observed...

    if (key === '__ob__') {
      continue;
    }

    toVal = to[key];
    fromVal = from[key];

    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }

  return to;
}
/**
 * Data
 */


function mergeDataOrFn(parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }

    if (!parentVal) {
      return childVal;
    } // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.


    return function mergedDataFn() {
      return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
    };
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal;

      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
      return parentVal;
    }

    return mergeDataOrFn(parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};
/**
 * Hooks and props are merged as arrays.
 */


function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}

function dedupeHooks(hooks) {
  var res = [];

  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }

  return res;
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

function mergeAssets(parentVal, childVal, vm, key) {
  var res = Object.create(parentVal || null);

  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal);
  } else {
    return res;
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch = function (parentVal, childVal, vm, key) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) {
    parentVal = undefined;
  }

  if (childVal === nativeWatch) {
    childVal = undefined;
  }
  /* istanbul ignore if */


  if (!childVal) {
    return Object.create(parentVal || null);
  }

  if ("development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }

  if (!parentVal) {
    return childVal;
  }

  var ret = {};
  extend(ret, parentVal);

  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];

    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }

    ret[key$1] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child];
  }

  return ret;
};
/**
 * Other object hashes.
 */


strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal, vm, key) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }

  if (!parentVal) {
    return childVal;
  }

  var ret = Object.create(null);
  extend(ret, parentVal);

  if (childVal) {
    extend(ret, childVal);
  }

  return ret;
};

strats.provide = mergeDataOrFn;
/**
 * Default strategy.
 */

var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};
/**
 * Validate component names
 */


function checkComponents(options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName(name) {
  if (!new RegExp("^[a-zA-Z][\\-\\.0-9_" + unicodeRegExp.source + "]*$").test(name)) {
    warn('Invalid component name: "' + name + '". Component names ' + 'should conform to valid custom element name in html5 specification.');
  }

  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + name);
  }
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */


function normalizeProps(options, vm) {
  var props = options.props;

  if (!props) {
    return;
  }

  var res = {};
  var i, val, name;

  if (Array.isArray(props)) {
    i = props.length;

    while (i--) {
      val = props[i];

      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = {
          type: null
        };
      } else if ("development" !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : {
        type: val
      };
    }
  } else if ("development" !== 'production') {
    warn("Invalid value for option \"props\": expected an Array or an Object, " + "but got " + toRawType(props) + ".", vm);
  }

  options.props = res;
}
/**
 * Normalize all injections into Object-based format
 */


function normalizeInject(options, vm) {
  var inject = options.inject;

  if (!inject) {
    return;
  }

  var normalized = options.inject = {};

  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = {
        from: inject[i]
      };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val) ? extend({
        from: key
      }, val) : {
        from: val
      };
    }
  } else if ("development" !== 'production') {
    warn("Invalid value for option \"inject\": expected an Array or an Object, " + "but got " + toRawType(inject) + ".", vm);
  }
}
/**
 * Normalize raw function directives into object format.
 */


function normalizeDirectives(options) {
  var dirs = options.directives;

  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];

      if (typeof def$$1 === 'function') {
        dirs[key] = {
          bind: def$$1,
          update: def$$1
        };
      }
    }
  }
}

function assertObjectType(name, value, vm) {
  if (!isPlainObject(value)) {
    warn("Invalid value for option \"" + name + "\": expected an Object, " + "but got " + toRawType(value) + ".", vm);
  }
}
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */


function mergeOptions(parent, child, vm) {
  if ("development" !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child); // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.

  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }

    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;

  for (key in parent) {
    mergeField(key);
  }

  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }

  return options;
}
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */


function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }

  var assets = options[type]; // check local registration variations first

  if (hasOwn(assets, id)) {
    return assets[id];
  }

  var camelizedId = camelize(id);

  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId];
  }

  var PascalCaseId = capitalize(camelizedId);

  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId];
  } // fallback to prototype chain


  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];

  if ("development" !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }

  return res;
}
/*  */


function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key]; // boolean casting

  var booleanIndex = getTypeIndex(Boolean, prop.type);

  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);

      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  } // check default value


  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key); // since the default value is a fresh copy,
    // make sure to observe it.

    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }

  if ("development" !== 'production' && // skip validation for weex recycle-list child component props
  !false) {
    assertProp(prop, key, value, vm, absent);
  }

  return value;
}
/**
 * Get the default value of a prop.
 */


function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined;
  }

  var def = prop.default; // warn against non-factory defaults for Object & Array

  if ("development" !== 'production' && isObject(def)) {
    warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  } // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger


  if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
    return vm._props[key];
  } // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context


  return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
}
/**
 * Assert whether a prop is valid.
 */


function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }

  if (value == null && !prop.required) {
    return;
  }

  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];

  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }

    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
    return;
  }

  var validator = prop.validator;

  if (validator) {
    if (!validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType(value, type) {
  var valid;
  var expectedType = getType(type);

  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase(); // for primitive wrapper objects

    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }

  return {
    valid: valid,
    expectedType: expectedType
  };
}
/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */


function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }

  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i;
    }
  }

  return -1;
}

function getInvalidTypeMessage(name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." + " Expected " + expectedTypes.map(capitalize).join(', ');
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType); // check if we need to specify expected value

  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }

  message += ", got " + receivedType + " "; // check if we need to specify received value

  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }

  return message;
}

function styleValue(value, type) {
  if (type === 'String') {
    return "\"" + value + "\"";
  } else if (type === 'Number') {
    return "" + Number(value);
  } else {
    return "" + value;
  }
}

function isExplicable(value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) {
    return value.toLowerCase() === elem;
  });
}

function isBoolean() {
  var args = [],
      len = arguments.length;

  while (len--) args[len] = arguments[len];

  return args.some(function (elem) {
    return elem.toLowerCase() === 'boolean';
  });
}
/*  */


function handleError(err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();

  try {
    if (vm) {
      var cur = vm;

      while (cur = cur.$parent) {
        var hooks = cur.$options.errorCaptured;

        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;

              if (capture) {
                return;
              }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }

    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling(handler, context, args, vm, info) {
  var res;

  try {
    res = args ? handler.apply(context, args) : handler.call(context);

    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) {
        return handleError(e, vm, info + " (Promise/async)");
      }); // issue #9511
      // avoid catch triggering multiple times when nested calls

      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }

  return res;
}

function globalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info);
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }

  logError(err, vm, info);
}

function logError(err, vm, info) {
  if ("development" !== 'production') {
    warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
  }
  /* istanbul ignore else */


  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err;
  }
}
/*  */


var isUsingMicroTask = false;
var callbacks = [];
var pending = false;

function flushCallbacks() {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;

  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
} // Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).


var timerFunc; // The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:

/* istanbul ignore next, $flow-disable-line */

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();

  timerFunc = function () {
    p.then(flushCallbacks); // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.

    if (isIOS) {
      setTimeout(noop);
    }
  };

  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) || // PhantomJS and iOS 7.x
MutationObserver.toString() === '[object MutationObserverConstructor]')) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });

  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };

  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick(cb, ctx) {
  var _resolve;

  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  if (!pending) {
    pending = true;
    timerFunc();
  } // $flow-disable-line


  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    });
  }
}
/*  */

/* not type checking this file because flow doesn't play well with Proxy */


var initProxy;

if ("development" !== 'production') {
  var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn("Property or method \"" + key + "\" is not defined on the instance but " + 'referenced during render. Make sure that this property is reactive, ' + 'either in the data option, or for class-based components, by ' + 'initializing the property. ' + 'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
  };

  var warnReservedPrefix = function (target, key) {
    warn("Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " + 'properties starting with "$" or "_" are not proxied in the Vue instance to ' + 'prevent conflicts with Vue internals. ' + 'See: https://vuejs.org/v2/api/#data', target);
  };

  var hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
          return false;
        } else {
          target[key] = value;
          return true;
        }
      }
    });
  }

  var hasHandler = {
    has: function has(target, key) {
      var has = (key in target);
      var isAllowed = allowedGlobals(key) || typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data);

      if (!has && !isAllowed) {
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }

      return has || !isAllowed;
    }
  };
  var getHandler = {
    get: function get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }

      return target[key];
    }
  };

  initProxy = function initProxy(vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}
/*  */


var seenObjects = new _Set();
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */

function traverse(val) {
  _traverse(val, seenObjects);

  seenObjects.clear();
}

function _traverse(val, seen) {
  var i, keys;
  var isA = Array.isArray(val);

  if (!isA && !isObject(val) || Object.isFrozen(val) || val instanceof VNode) {
    return;
  }

  if (val.__ob__) {
    var depId = val.__ob__.dep.id;

    if (seen.has(depId)) {
      return;
    }

    seen.add(depId);
  }

  if (isA) {
    i = val.length;

    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    keys = Object.keys(val);
    i = keys.length;

    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}

var mark;
var measure;

if ("development" !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */

  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
    mark = function (tag) {
      return perf.mark(tag);
    };

    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag); // perf.clearMeasures(name)
    };
  }
}
/*  */


var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first

  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  };
});

function createFnInvoker(fns, vm) {
  function invoker() {
    var arguments$1 = arguments;
    var fns = invoker.fns;

    if (Array.isArray(fns)) {
      var cloned = fns.slice();

      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
    }
  }

  invoker.fns = fns;
  return invoker;
}

function updateListeners(on, oldOn, add, remove$$1, createOnceHandler, vm) {
  var name, def$$1, cur, old, event;

  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);

    if (isUndef(cur)) {
      "development" !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }

      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }

      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }

  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}
/*  */


function mergeVNodeHook(def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }

  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook() {
    hook.apply(this, arguments); // important: remove merged hook to ensure it's called only once
    // and prevent memory leak

    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}
/*  */


function extractPropsFromVNodeData(data, Ctor, tag) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;

  if (isUndef(propOptions)) {
    return;
  }

  var res = {};
  var attrs = data.attrs;
  var props = data.props;

  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);

      if ("development" !== 'production') {
        var keyInLowerCase = key.toLowerCase();

        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
          tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
        }
      }

      checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
    }
  }

  return res;
}

function checkProp(res, hash, key, altKey, preserve) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];

      if (!preserve) {
        delete hash[key];
      }

      return true;
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];

      if (!preserve) {
        delete hash[altKey];
      }

      return true;
    }
  }

  return false;
}
/*  */
// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:
// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.


function simpleNormalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }

  return children;
} // 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.


function normalizeChildren(children) {
  return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
}

function isTextNode(node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}

function normalizeArrayChildren(children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;

  for (i = 0; i < children.length; i++) {
    c = children[i];

    if (isUndef(c) || typeof c === 'boolean') {
      continue;
    }

    lastIndex = res.length - 1;
    last = res[lastIndex]; //  nested

    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, (nestedIndex || '') + "_" + i); // merge adjacent text nodes

        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + c[0].text);
          c.shift();
        }

        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }

        res.push(c);
      }
    }
  }

  return res;
}
/*  */


function initProvide(vm) {
  var provide = vm.$options.provide;

  if (provide) {
    vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
  }
}

function initInjections(vm) {
  var result = resolveInject(vm.$options.inject, vm);

  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn("Avoid mutating an injected value directly since the changes will be " + "overwritten whenever the provided component re-renders. " + "injection being mutated: \"" + key + "\"", vm);
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]; // #6574 in case the inject object is observed...

      if (key === '__ob__') {
        continue;
      }

      var provideKey = inject[key].from;
      var source = vm;

      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }

        source = source.$parent;
      }

      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function' ? provideDefault.call(vm) : provideDefault;
        } else if ("development" !== 'production') {
          warn("Injection \"" + key + "\" not found", vm);
        }
      }
    }

    return result;
  }
}
/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */


function resolveSlots(children, context) {
  if (!children || !children.length) {
    return {};
  }

  var slots = {};

  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data; // remove slot attribute if the node is resolved as a Vue slot node

    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    } // named slots should only be respected if the vnode was rendered in the
    // same context.


    if ((child.context === context || child.fnContext === context) && data && data.slot != null) {
      var name = data.slot;
      var slot = slots[name] || (slots[name] = []);

      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  } // ignore slots that contains only whitespace


  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }

  return slots;
}

function isWhitespace(node) {
  return node.isComment && !node.asyncFactory || node.text === ' ';
}
/*  */


function normalizeScopedSlots(slots, normalSlots, prevSlots) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;

  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized;
  } else if (isStable && prevSlots && prevSlots !== emptyObject && key === prevSlots.$key && !hasNormalSlots && !prevSlots.$hasNormal) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots;
  } else {
    res = {};

    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  } // expose normal slots on scopedSlots


  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  } // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error


  if (slots && Object.isExtensible(slots)) {
    slots._normalized = res;
  }

  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res;
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res) ? [res] // single vnode
    : normalizeChildren(res);
    return res && (res.length === 0 || res.length === 1 && res[0].isComment // #9658
    ) ? undefined : res;
  }; // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.


  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }

  return normalized;
}

function proxyNormalSlot(slots, key) {
  return function () {
    return slots[key];
  };
}
/*  */

/**
 * Runtime helper for rendering v-for lists.
 */


function renderList(val, render) {
  var ret, i, l, keys, key;

  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);

    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);

    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();

      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);

      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }

  if (!isDef(ret)) {
    ret = [];
  }

  ret._isVList = true;
  return ret;
}
/*  */

/**
 * Runtime helper for rendering <slot>
 */


function renderSlot(name, fallback, props, bindObject) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;

  if (scopedSlotFn) {
    // scoped slot
    props = props || {};

    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn('slot v-bind without argument expects an Object', this);
      }

      props = extend(extend({}, bindObject), props);
    }

    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;

  if (target) {
    return this.$createElement('template', {
      slot: target
    }, nodes);
  } else {
    return nodes;
  }
}
/*  */

/**
 * Runtime helper for resolving filters
 */


function resolveFilter(id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity;
}
/*  */


function isKeyNotMatch(expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1;
  } else {
    return expect !== actual;
  }
}
/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */


function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;

  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName);
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode);
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key;
  }
}
/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */


function bindObjectProps(data, tag, value, asProp, isSync) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }

      var hash;

      var loop = function (key) {
        if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
        }

        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);

        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});

            on["update:" + key] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop(key);
    }
  }

  return data;
}
/*  */

/**
 * Runtime helper for rendering static trees.
 */


function renderStatic(index, isInFor) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index]; // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.

  if (tree && !isInFor) {
    return tree;
  } // otherwise, render a fresh tree.


  tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this // for render fns generated for functional component templates
  );
  markStatic(tree, "__static__" + index, false);
  return tree;
}
/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */


function markOnce(tree, index, key) {
  markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
  return tree;
}

function markStatic(tree, key, isOnce) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], key + "_" + i, isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode(node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}
/*  */


function bindObjectListeners(data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn('v-on without argument expects an Object value', this);
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};

      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }

  return data;
}
/*  */


function resolveScopedSlots(fns, // see flow/vnode
res, // the following are added in 2.6
hasDynamicKeys, contentHashKey) {
  res = res || {
    $stable: !hasDynamicKeys
  };

  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];

    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }

      res[slot.key] = slot.fn;
    }
  }

  if (contentHashKey) {
    res.$key = contentHashKey;
  }

  return res;
}
/*  */


function bindDynamicKeys(baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];

    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ("development" !== 'production' && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn("Invalid value for dynamic directive argument (expected string or null): " + key, this);
    }
  }

  return baseObj;
} // helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.


function prependModifier(value, symbol) {
  return typeof value === 'string' ? symbol + value : value;
}
/*  */


function installRenderHelpers(target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}
/*  */


function FunctionalRenderContext(data, props, children, parent, Ctor) {
  var this$1 = this;
  var options = Ctor.options; // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check

  var contextVm;

  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent); // $flow-disable-line

    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent; // $flow-disable-line

    parent = parent._original;
  }

  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);

  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(data.scopedSlots, this$1.$slots = resolveSlots(children, parent));
    }

    return this$1.$slots;
  };

  Object.defineProperty(this, 'scopedSlots', {
    enumerable: true,
    get: function get() {
      return normalizeScopedSlots(data.scopedSlots, this.slots());
    }
  }); // support for compiled functional template

  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options; // pre-resolve slots for renderSlot()

    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);

      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }

      return vnode;
    };
  } else {
    this._c = function (a, b, c, d) {
      return createElement(contextVm, a, b, c, d, needNormalization);
    };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;

  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) {
      mergeProps(props, data.attrs);
    }

    if (isDef(data.props)) {
      mergeProps(props, data.props);
    }
  }

  var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);
  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);

    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }

    return res;
  }
}

function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;

  if ("development" !== 'production') {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }

  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }

  return clone;
}

function mergeProps(to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}
/*  */

/*  */

/*  */

/*  */
// inline hooks to be invoked on component VNodes during patch


var componentVNodeHooks = {
  init: function init(vnode, hydrating) {
    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow

      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },
  prepatch: function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(child, options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
    );
  },
  insert: function insert(vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;

    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }

    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true
        /* direct */
        );
      }
    }
  },
  destroy: function destroy(vnode) {
    var componentInstance = vnode.componentInstance;

    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true
        /* direct */
        );
      }
    }
  }
};
var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent(Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return;
  }

  var baseCtor = context.$options._base; // plain options object: turn it into a constructor

  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  } // if at this stage it's not a constructor or an async component factory,
  // reject.


  if (typeof Ctor !== 'function') {
    if ("development" !== 'production') {
      warn("Invalid Component definition: " + String(Ctor), context);
    }

    return;
  } // async component


  var asyncFactory;

  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);

    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {}; // resolve constructor options in case global mixins are applied after
  // component constructor creation

  resolveConstructorOptions(Ctor); // transform component v-model data into props & events

  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  } // extract props


  var propsData = extractPropsFromVNodeData(data, Ctor, tag); // functional component

  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  } // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners


  var listeners = data.on; // replace with listeners with .native modifier
  // so it gets processed during parent component patch.

  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot
    // work around flow
    var slot = data.slot;
    data = {};

    if (slot) {
      data.slot = slot;
    }
  } // install component management hooks onto the placeholder node


  installComponentHooks(data); // return a placeholder vnode

  var name = Ctor.options.name || tag;
  var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, {
    Ctor: Ctor,
    propsData: propsData,
    listeners: listeners,
    tag: tag,
    children: children
  }, asyncFactory);
  return vnode;
}

function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  }; // check inline-template render functions

  var inlineTemplate = vnode.data.inlineTemplate;

  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }

  return new vnode.componentOptions.Ctor(options);
}

function installComponentHooks(data) {
  var hooks = data.hook || (data.hook = {});

  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];

    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1(f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };

  merged._merged = true;
  return merged;
} // transform component v-model info (value and callback) into
// prop and event handler respectively.


function transformModel(options, data) {
  var prop = options.model && options.model.prop || 'value';
  var event = options.model && options.model.event || 'input';
  (data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;

  if (isDef(existing)) {
    if (Array.isArray(existing) ? existing.indexOf(callback) === -1 : existing !== callback) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}
/*  */


var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2; // wrapper function for providing a more flexible interface
// without getting yelled at by flow

function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }

  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }

  return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(context, tag, data, children, normalizationType) {
  if (isDef(data) && isDef(data.__ob__)) {
    "development" !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
    return createEmptyVNode();
  } // object syntax in v-bind


  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }

  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  } // warn against non-primitive key


  if ("development" !== 'production' && isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
    {
      warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context);
    }
  } // support single function children as default scoped slot


  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = {
      default: children[0]
    };
    children.length = 0;
  }

  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }

  var vnode, ns;

  if (typeof tag === 'string') {
    var Ctor;
    ns = context.$vnode && context.$vnode.ns || config.getTagNamespace(tag);

    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ("development" !== 'production' && isDef(data) && isDef(data.nativeOn)) {
        warn("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">.", context);
      }

      vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }

  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) {
      applyNS(vnode, ns);
    }

    if (isDef(data)) {
      registerDeepBindings(data);
    }

    return vnode;
  } else {
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns, force) {
  vnode.ns = ns;

  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }

  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];

      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && child.tag !== 'svg')) {
        applyNS(child, ns, force);
      }
    }
  }
} // ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes


function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }

  if (isObject(data.class)) {
    traverse(data.class);
  }
}
/*  */


function initRender(vm) {
  vm._vnode = null; // the root of the child tree

  vm._staticTrees = null; // v-once cached trees

  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree

  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject; // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates

  vm._c = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
  }; // normalization is always applied for the public version, used in
  // user-written render functions.


  vm.$createElement = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, true);
  }; // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated


  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */

  if ("development" !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

var currentRenderingInstance = null;

function renderMixin(Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(_parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
    } // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.


    vm.$vnode = _parentVnode; // render self

    var vnode;

    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render"); // return error render result,
      // or previous vnode to prevent render error causing blank component

      /* istanbul ignore else */

      if ("development" !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    } // if the returned array contains only a single node, allow it


    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    } // return empty vnode in case the render function errored out


    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
      }

      vnode = createEmptyVNode();
    } // set parent


    vnode.parent = _parentVnode;
    return vnode;
  };
}
/*  */


function ensureCtor(comp, base) {
  if (comp.__esModule || hasSymbol && comp[Symbol.toStringTag] === 'Module') {
    comp = comp.default;
  }

  return isObject(comp) ? base.extend(comp) : comp;
}

function createAsyncPlaceholder(factory, data, context, children, tag) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = {
    data: data,
    context: context,
    children: children,
    tag: tag
  };
  return node;
}

function resolveAsyncComponent(factory, baseCtor) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp;
  }

  if (isDef(factory.resolved)) {
    return factory.resolved;
  }

  var owner = currentRenderingInstance;

  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp;
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null;
    owner.$on('hook:destroyed', function () {
      return remove(owners, owner);
    });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        owners[i].$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;

        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }

        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor); // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)

      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });
    var reject = once(function (reason) {
      "development" !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));

      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });
    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);

          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;

              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;

            if (isUndef(factory.resolved)) {
              reject("development" !== 'production' ? "timeout (" + res.timeout + "ms)" : null);
            }
          }, res.timeout);
        }
      }
    }

    sync = false; // return in case resolved synchronously

    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}
/*  */


function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}
/*  */


function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];

      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c;
      }
    }
  }
}
/*  */

/*  */


function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false; // init parent attached events

  var listeners = vm.$options._parentListeners;

  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add(event, fn) {
  target.$on(event, fn);
}

function remove$1(event, fn) {
  target.$off(event, fn);
}

function createOnceHandler(event, fn) {
  var _target = target;
  return function onceHandler() {
    var res = fn.apply(null, arguments);

    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  };
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin(Vue) {
  var hookRE = /^hook:/;

  Vue.prototype.$on = function (event, fn) {
    var vm = this;

    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn); // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup

      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }

    return vm;
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;

    function on() {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }

    on.fn = fn;
    vm.$on(event, on);
    return vm;
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this; // all

    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm;
    } // array of events


    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }

      return vm;
    } // specific event


    var cbs = vm._events[event];

    if (!cbs) {
      return vm;
    }

    if (!fn) {
      vm._events[event] = null;
      return vm;
    } // specific handler


    var cb;
    var i = cbs.length;

    while (i--) {
      cb = cbs[i];

      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }

    return vm;
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;

    if ("development" !== 'production') {
      var lowerCaseEvent = event.toLowerCase();

      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(vm) + " but the handler is registered for \"" + event + "\". " + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + "You should probably use \"" + hyphenate(event) + "\" instead of \"" + event + "\".");
      }
    }

    var cbs = vm._events[event];

    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";

      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }

    return vm;
  };
}
/*  */


var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  };
}

function initLifecycle(vm) {
  var options = vm.$options; // locate first non-abstract parent

  var parent = options.parent;

  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }

    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;
  vm.$children = [];
  vm.$refs = {};
  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode; // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.

    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false
      /* removeOnly */
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }

    restoreActiveInstance(); // update __vue__ reference

    if (prevEl) {
      prevEl.__vue__ = null;
    }

    if (vm.$el) {
      vm.$el.__vue__ = vm;
    } // if parent is an HOC, update its $el as well


    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    } // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.

  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;

    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;

    if (vm._isBeingDestroyed) {
      return;
    }

    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true; // remove self from parent

    var parent = vm.$parent;

    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    } // teardown watchers


    if (vm._watcher) {
      vm._watcher.teardown();
    }

    var i = vm._watchers.length;

    while (i--) {
      vm._watchers[i].teardown();
    } // remove reference from data ob
    // frozen object may not have observer.


    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    } // call the last hook...


    vm._isDestroyed = true; // invoke destroy hooks on current rendered tree

    vm.__patch__(vm._vnode, null); // fire destroyed hook


    callHook(vm, 'destroyed'); // turn off all instance listeners.

    vm.$off(); // remove __vue__ reference

    if (vm.$el) {
      vm.$el.__vue__ = null;
    } // release circular reference (#6759)


    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent(vm, el, hydrating) {
  vm.$el = el;

  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;

    if ("development" !== 'production') {
      /* istanbul ignore if */
      if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
        warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
      } else {
        warn('Failed to mount component: template or render function not defined.', vm);
      }
    }
  }

  callHook(vm, 'beforeMount');
  var updateComponent;
  /* istanbul ignore if */

  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;
      mark(startTag);

      var vnode = vm._render();

      mark(endTag);
      measure("vue " + name + " render", startTag, endTag);
      mark(startTag);

      vm._update(vnode, hydrating);

      mark(endTag);
      measure("vue " + name + " patch", startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  } // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined


  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true
  /* isRenderWatcher */
  );
  hydrating = false; // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook

  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }

  return vm;
}

function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
  if ("development" !== 'production') {
    isUpdatingChildComponent = true;
  } // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.
  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.


  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(newScopedSlots && !newScopedSlots.$stable || oldScopedSlots !== emptyObject && !oldScopedSlots.$stable || newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key); // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.

  var needsForceUpdate = !!(renderChildren || // has new static slots
  vm.$options._renderChildren || // has old static slots
  hasDynamicScopedSlot);
  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }

  vm.$options._renderChildren = renderChildren; // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render

  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject; // update props

  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];

    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?

      props[key] = validateProp(key, propOptions, propsData, vm);
    }

    toggleObserving(true); // keep a copy of raw propsData

    vm.$options.propsData = propsData;
  } // update listeners


  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners); // resolve slots + force update if has children

  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if ("development" !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) {
      return true;
    }
  }

  return false;
}

function activateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = false;

    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }

  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;

    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }

    callHook(vm, 'activated');
  }
}

function deactivateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = true;

    if (isInInactiveTree(vm)) {
      return;
    }
  }

  if (!vm._inactive) {
    vm._inactive = true;

    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }

    callHook(vm, 'deactivated');
  }
}

function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";

  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }

  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }

  popTarget();
}
/*  */


var MAX_UPDATE_COUNT = 100;
var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;
/**
 * Reset the scheduler's state.
 */

function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};

  if ("development" !== 'production') {
    circular = {};
  }

  waiting = flushing = false;
} // Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.


var currentFlushTimestamp = 0; // Async edge case fix requires storing an event listener's attach timestamp.

var getNow = Date.now; // Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)

if (inBrowser && !isIE) {
  var performance = window.performance;

  if (performance && typeof performance.now === 'function' && getNow() > document.createEvent('Event').timeStamp) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () {
      return performance.now();
    };
  }
}
/**
 * Flush both queues and run the watchers.
 */


function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id; // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.

  queue.sort(function (a, b) {
    return a.id - b.id;
  }); // do not cache length because more watchers might be pushed
  // as we run existing watchers

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];

    if (watcher.before) {
      watcher.before();
    }

    id = watcher.id;
    has[id] = null;
    watcher.run(); // in dev build, check and stop circular updates.

    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;

      if (circular[id] > MAX_UPDATE_COUNT) {
        warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
        break;
      }
    }
  } // keep copies of post queues before resetting state


  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();
  resetSchedulerState(); // call component updated and activated hooks

  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue); // devtool hook

  /* istanbul ignore if */

  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks(queue) {
  var i = queue.length;

  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;

    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}
/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */


function queueActivatedComponent(vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks(queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true
    /* true */
    );
  }
}
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */


function queueWatcher(watcher) {
  var id = watcher.id;

  if (has[id] == null) {
    has[id] = true;

    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;

      while (i > index && queue[i].id > watcher.id) {
        i--;
      }

      queue.splice(i + 1, 0, watcher);
    } // queue the flush


    if (!waiting) {
      waiting = true;

      if ("development" !== 'production' && !config.async) {
        flushSchedulerQueue();
        return;
      }

      nextTick(flushSchedulerQueue);
    }
  }
}
/*  */


var uid$2 = 0;
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */

var Watcher = function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
  this.vm = vm;

  if (isRenderWatcher) {
    vm._watcher = this;
  }

  vm._watchers.push(this); // options


  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }

  this.cb = cb;
  this.id = ++uid$2; // uid for batching

  this.active = true;
  this.dirty = this.lazy; // for lazy watchers

  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = "development" !== 'production' ? expOrFn.toString() : ''; // parse expression for getter

  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);

    if (!this.getter) {
      this.getter = noop;
      "development" !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
    }
  }

  this.value = this.lazy ? undefined : this.get();
};
/**
 * Evaluate the getter, and re-collect dependencies.
 */


Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;

  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
    } else {
      throw e;
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }

    popTarget();
    this.cleanupDeps();
  }

  return value;
};
/**
 * Add a dependency to this directive.
 */


Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;

  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);

    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};
/**
 * Clean up for dependency collection.
 */


Watcher.prototype.cleanupDeps = function cleanupDeps() {
  var i = this.deps.length;

  while (i--) {
    var dep = this.deps[i];

    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }

  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */


Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */


Watcher.prototype.run = function run() {
  if (this.active) {
    var value = this.get();

    if (value !== this.value || // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    isObject(value) || this.deep) {
      // set new value
      var oldValue = this.value;
      this.value = value;

      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};
/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */


Watcher.prototype.evaluate = function evaluate() {
  this.value = this.get();
  this.dirty = false;
};
/**
 * Depend on all deps collected by this watcher.
 */


Watcher.prototype.depend = function depend() {
  var i = this.deps.length;

  while (i--) {
    this.deps[i].depend();
  }
};
/**
 * Remove self from all dependencies' subscriber list.
 */


Watcher.prototype.teardown = function teardown() {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }

    var i = this.deps.length;

    while (i--) {
      this.deps[i].removeSub(this);
    }

    this.active = false;
  }
};
/*  */


var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };

  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;

  if (opts.props) {
    initProps(vm, opts.props);
  }

  if (opts.methods) {
    initMethods(vm, opts.methods);
  }

  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true
    /* asRootData */
    );
  }

  if (opts.computed) {
    initComputed(vm, opts.computed);
  }

  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps(vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {}; // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.

  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent; // root instance props should be converted

  if (!isRoot) {
    toggleObserving(false);
  }

  var loop = function (key) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */

    if ("development" !== 'production') {
      var hyphenatedKey = hyphenate(key);

      if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
        warn("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop.", vm);
      }

      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    } // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.


    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop(key);

  toggleObserving(true);
}

function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};

  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
  } // proxy data on instance


  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;

  while (i--) {
    var key = keys[i];

    if ("development" !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn("Method \"" + key + "\" has already been defined as a data property.", vm);
      }
    }

    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn("The data property \"" + key + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  } // observe data


  observe(data, true
  /* asRootData */
  );
}

function getData(data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();

  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = {
  lazy: true
};

function initComputed(vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null); // computed properties are just getters during SSR

  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;

    if ("development" !== 'production' && getter == null) {
      warn("Getter is missing for computed property \"" + key + "\".", vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
    } // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.


    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if ("development" !== 'production') {
      if (key in vm.$data) {
        warn("The computed property \"" + key + "\" is already defined in data.", vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
      }
    }
  }
}

function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering();

  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(key) : createGetterInvoker(userDef.get) : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }

  if ("development" !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn("Computed property \"" + key + "\" was assigned to but it has no setter.", this);
    };
  }

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];

    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    }
  };
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}

function initMethods(vm, methods) {
  var props = vm.$options.props;

  for (var key in methods) {
    if ("development" !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn("Method \"" + key + "\" has type \"" + typeof methods[key] + "\" in the component definition. " + "Did you reference the function correctly?", vm);
      }

      if (props && hasOwn(props, key)) {
        warn("Method \"" + key + "\" has already been defined as a prop.", vm);
      }

      if (key in vm && isReserved(key)) {
        warn("Method \"" + key + "\" conflicts with an existing Vue instance method. " + "Avoid defining component methods that start with _ or $.");
      }
    }

    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];

    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }

  if (typeof handler === 'string') {
    handler = vm[handler];
  }

  return vm.$watch(expOrFn, handler, options);
}

function stateMixin(Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};

  dataDef.get = function () {
    return this._data;
  };

  var propsDef = {};

  propsDef.get = function () {
    return this._props;
  };

  if ("development" !== 'production') {
    dataDef.set = function () {
      warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
    };

    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }

  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);
  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;

    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }

    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);

    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, "callback for immediate watcher \"" + watcher.expression + "\"");
      }
    }

    return function unwatchFn() {
      watcher.teardown();
    };
  };
}
/*  */


var uid$3 = 0;

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this; // a uid

    vm._uid = uid$3++;
    var startTag, endTag;
    /* istanbul ignore if */

    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + vm._uid;
      endTag = "vue-perf-end:" + vm._uid;
      mark(startTag);
    } // a flag to avoid this being observed


    vm._isVue = true; // merge options

    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
    }
    /* istanbul ignore else */


    if ("development" !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    } // expose real self


    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props

    initState(vm);
    initProvide(vm); // resolve provide after data/props

    callHook(vm, 'created');
    /* istanbul ignore if */

    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure("vue " + vm._name + " init", startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent(vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options); // doing this because it's faster than dynamic enumeration.

  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions(Ctor) {
  var options = Ctor.options;

  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;

    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions; // check if there are any late-modified/attached options (#4976)

      var modifiedOptions = resolveModifiedOptions(Ctor); // update base extend options

      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }

      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);

      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }

  return options;
}

function resolveModifiedOptions(Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;

  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {};
      }

      modified[key] = latest[key];
    }
  }

  return modified;
}

function Vue(options) {
  if ("development" !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }

  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
/*  */

function initUse(Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = this._installedPlugins || (this._installedPlugins = []);

    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    } // additional parameters


    var args = toArray(arguments, 1);
    args.unshift(this);

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }

    installedPlugins.push(plugin);
    return this;
  };
}
/*  */


function initMixin$1(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
/*  */


function initExtend(Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;
  /**
   * Class inheritance
   */

  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});

    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }

    var name = extendOptions.name || Super.options.name;

    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent(options) {
      this._init(options);
    };

    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super; // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.

    if (Sub.options.props) {
      initProps$1(Sub);
    }

    if (Sub.options.computed) {
      initComputed$1(Sub);
    } // allow further extension/mixin/plugin usage


    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use; // create asset registers, so extended classes
    // can have their private assets too.

    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    }); // enable recursive self-lookup

    if (name) {
      Sub.options.components[name] = Sub;
    } // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.


    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options); // cache constructor

    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}

function initProps$1(Comp) {
  var props = Comp.options.props;

  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1(Comp) {
  var computed = Comp.options.computed;

  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}
/*  */


function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }

        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }

        if (type === 'directive' && typeof definition === 'function') {
          definition = {
            bind: definition,
            update: definition
          };
        }

        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}
/*  */


function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  /* istanbul ignore next */


  return false;
}

function pruneCache(keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;

  for (var key in cache) {
    var cachedNode = cache[key];

    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);

      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry(cache, key, keys, current) {
  var cached$$1 = cache[key];

  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }

  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];
var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
  created: function created() {
    this.cache = Object.create(null);
    this.keys = [];
  },
  destroyed: function destroyed() {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },
  mounted: function mounted() {
    var this$1 = this;
    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) {
        return matches(val, name);
      });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) {
        return !matches(val, name);
      });
    });
  },
  render: function render() {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;

    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;

      if ( // not included
      include && (!name || !matches(include, name)) || // excluded
      exclude && name && matches(exclude, name)) {
        return vnode;
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;

      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance; // make current key freshest

        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key); // prune oldest entry

        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }

    return vnode || slot && slot[0];
  }
};
var builtInComponents = {
  KeepAlive: KeepAlive
};
/*  */

function initGlobalAPI(Vue) {
  // config
  var configDef = {};

  configDef.get = function () {
    return config;
  };

  if ("development" !== 'production') {
    configDef.set = function () {
      warn('Do not replace the Vue.config object, set individual fields instead.');
    };
  }

  Object.defineProperty(Vue, 'config', configDef); // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.

  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick; // 2.6 explicit observable API

  Vue.observable = function (obj) {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  }); // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.

  Vue.options._base = Vue;
  extend(Vue.options.components, builtInComponents);
  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
}); // expose FunctionalRenderContext for ssr runtime helper installation

Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});
Vue.version = '2.6.11';
/*  */
// these are reserved for web because they are directly compiled away
// during template compilation

var isReservedAttr = makeMap('style,class'); // attributes that should be using props for binding

var acceptValue = makeMap('input,textarea,option,select,progress');

var mustUseProp = function (tag, type, attr) {
  return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

var convertEnumeratedValue = function (key, value) {
  return isFalsyAttrValue(value) || value === 'false' ? 'false' // allow arbitrary string value for contenteditable
  : key === 'contenteditable' && isValidContentEditableValue(value) ? value : 'true';
};

var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');
var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : '';
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false;
};
/*  */


function genClassForVnode(vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;

  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;

    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }

  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }

  return renderClass(data.staticClass, data.class);
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  };
}

function renderClass(staticClass, dynamicClass) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */


  return '';
}

function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}

function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }

  if (isObject(value)) {
    return stringifyObject(value);
  }

  if (typeof value === 'string') {
    return value;
  }
  /* istanbul ignore next */


  return '';
}

function stringifyArray(value) {
  var res = '';
  var stringified;

  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) {
        res += ' ';
      }

      res += stringified;
    }
  }

  return res;
}

function stringifyObject(value) {
  var res = '';

  for (var key in value) {
    if (value[key]) {
      if (res) {
        res += ' ';
      }

      res += key;
    }
  }

  return res;
}
/*  */


var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};
var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot'); // this map is intentionally selective, only covering SVG elements that may
// contain child elements.

var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag);
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg';
  } // basic support for MathML
  // note it doesn't support other MathML elements being component roots


  if (tag === 'math') {
    return 'math';
  }
}

var unknownElementCache = Object.create(null);

function isUnknownElement(tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true;
  }

  if (isReservedTag(tag)) {
    return false;
  }

  tag = tag.toLowerCase();
  /* istanbul ignore if */

  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag];
  }

  var el = document.createElement(tag);

  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
  } else {
    return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');
/*  */

/**
 * Query an element selector if it's not an element already.
 */

function query(el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);

    if (!selected) {
      "development" !== 'production' && warn('Cannot find element: ' + el);
      return document.createElement('div');
    }

    return selected;
  } else {
    return el;
  }
}
/*  */


function createElement$1(tagName, vnode) {
  var elm = document.createElement(tagName);

  if (tagName !== 'select') {
    return elm;
  } // false or null will remove the attribute but undefined will not


  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }

  return elm;
}

function createElementNS(namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function createComment(text) {
  return document.createComment(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentNode;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

function setStyleScope(node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});
/*  */

var ref = {
  create: function create(_, vnode) {
    registerRef(vnode);
  },
  update: function update(oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy(vnode) {
    registerRef(vnode, true);
  }
};

function registerRef(vnode, isRemoval) {
  var key = vnode.data.ref;

  if (!isDef(key)) {
    return;
  }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;

  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}
/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */


var emptyNode = new VNode('', {}, []);
var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode(a, b) {
  return a.key === b.key && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && a.asyncFactory === b.asyncFactory && isUndef(b.asyncFactory.error));
}

function sameInputType(a, b) {
  if (a.tag !== 'input') {
    return true;
  }

  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, key;
  var map = {};

  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;

    if (isDef(key)) {
      map[key] = i;
    }
  }

  return map;
}

function createPatchFunction(backend) {
  var i, j;
  var cbs = {};
  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];

    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    function remove$$1() {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }

    remove$$1.listeners = listeners;
    return remove$$1;
  }

  function removeNode(el) {
    var parent = nodeOps.parentNode(el); // element may have already been removed due to v-html / v-text

    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1(vnode, inVPre) {
    return !inVPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.some(function (ignore) {
      return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
    })) && config.isUnknownElement(vnode.tag);
  }

  var creatingElmInVPre = 0;

  function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check

    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;

    if (isDef(tag)) {
      if ("development" !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }

        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
        }
      }

      vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
      setScope(vnode);
      /* istanbul ignore if */

      {
        createChildren(vnode, children, insertedVnodeQueue);

        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }

        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;

    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;

      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false
        /* hydrating */
        );
      } // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.


      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);

        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }

        return true;
      }
    }
  }

  function initComponent(vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }

    vnode.elm = vnode.componentInstance.$el;

    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode); // make sure to invoke the insert hook

      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i; // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.

    var innerNode = vnode;

    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;

      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }

        insertedVnodeQueue.push(innerNode);
        break;
      }
    } // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself


    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if ("development" !== 'production') {
        checkDuplicateKeys(children);
      }

      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable(vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }

    return isDef(vnode.tag);
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }

    i = vnode.data.hook; // Reuse variable

    if (isDef(i)) {
      if (isDef(i.create)) {
        i.create(emptyNode, vnode);
      }

      if (isDef(i.insert)) {
        insertedVnodeQueue.push(vnode);
      }
    }
  } // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.


  function setScope(vnode) {
    var i;

    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;

      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }

        ancestor = ancestor.parent;
      }
    } // for slot content they should also get the scopeId from the host instance.


    if (isDef(i = activeInstance) && i !== vnode.context && i !== vnode.fnContext && isDef(i = i.$options._scopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j;
    var data = vnode.data;

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) {
        i(vnode);
      }

      for (i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode);
      }
    }

    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes(vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];

      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook(vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;

      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } // recursively invoke hooks on child component root node


      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }

      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }

      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm; // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions

    var canMove = !removeOnly;

    if ("development" !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);

        if (isUndef(idxInOld)) {
          // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];

          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }

        newStartVnode = newCh[++newStartIdx];
      }
    }

    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys(children) {
    var seenKeys = {};

    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;

      if (isDef(key)) {
        if (seenKeys[key]) {
          warn("Duplicate keys detected: '" + key + "'. This may cause an update error.", vnode.context);
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld(node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];

      if (isDef(c) && sameVnode(node, c)) {
        return i;
      }
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
    if (oldVnode === vnode) {
      return;
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }

      return;
    } // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.


    if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
      vnode.componentInstance = oldVnode.componentInstance;
      return;
    }

    var i;
    var data = vnode.data;

    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;

    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }

      if (isDef(i = data.hook) && isDef(i = i.update)) {
        i(oldVnode, vnode);
      }
    }

    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
        }
      } else if (isDef(ch)) {
        if ("development" !== 'production') {
          checkDuplicateKeys(ch);
        }

        if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }

        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
        i(oldVnode, vnode);
      }
    }
  }

  function invokeInsertHook(vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false; // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).

  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key'); // Note: this is a browser-only function so we can assume elms are DOM nodes.

  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || data && data.pre;
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true;
    } // assert node match


    if ("development" !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false;
      }
    }

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode, true
        /* hydrating */
        );
      }

      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true;
      }
    }

    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }

              return false;
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;

            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break;
              }

              childNode = childNode.nextSibling;
            } // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.


            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }

              return false;
            }
          }
        }
      }

      if (isDef(data)) {
        var fullInvoke = false;

        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break;
          }
        }

        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }

    return true;
  }

  function assertNodeMatch(node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || !isUnknownElement$$1(vnode, inVPre) && vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3);
    }
  }

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) {
        invokeDestroyHook(oldVnode);
      }

      return;
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);

      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }

          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if ("development" !== 'production') {
              warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
            }
          } // either not server-rendered, or hydration failed.
          // create an empty node and replace it


          oldVnode = emptyNodeAt(oldVnode);
        } // replacing existing element


        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm); // create new node

        createElm(vnode, insertedVnodeQueue, // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm)); // update parent placeholder node element, recursively

        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);

          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }

            ancestor.elm = vnode.elm;

            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              } // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.


              var insert = ancestor.data.hook.insert;

              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }

            ancestor = ancestor.parent;
          }
        } // destroy old node


        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}
/*  */


var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives(vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives(oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update(oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);
  var dirsWithInsert = [];
  var dirsWithPostpatch = [];
  var key, oldDir, dir;

  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];

    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);

      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook$1(dir, 'update', vnode, oldVnode);

      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };

    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1(dirs, vm) {
  var res = Object.create(null);

  if (!dirs) {
    // $flow-disable-line
    return res;
  }

  var i, dir;

  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];

    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }

    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  } // $flow-disable-line


  return res;
}

function getRawDirName(dir) {
  return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
}

function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];

  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
    }
  }
}

var baseModules = [ref, directives];
/*  */

function updateAttrs(oldVnode, vnode) {
  var opts = vnode.componentOptions;

  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return;
  }

  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return;
  }

  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {}; // clone observed objects, as the user probably wants to mutate it

  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];

    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  } // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max

  /* istanbul ignore if */


  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }

  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr(el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr(el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.

    /* istanbul ignore if */
    if (isIE && !isIE9 && el.tagName === 'TEXTAREA' && key === 'placeholder' && value !== '' && !el.__ieph) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };

      el.addEventListener('input', blocker); // $flow-disable-line

      el.__ieph = true;
      /* IE placeholder patched */
    }

    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};
/*  */

function updateClass(oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
    return;
  }

  var cls = genClassForVnode(vnode); // handle transition classes

  var transitionClass = el._transitionClasses;

  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  } // set the class


  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};
/*  */

/*  */

/*  */

/*  */
// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.

var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';
/*  */
// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.

function normalizeEvents(on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  } // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4

  /* istanbul ignore if */


  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1(event, handler, capture) {
  var _target = target$1; // save current target element in closure

  return function onceHandler() {
    var res = handler.apply(null, arguments);

    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  };
} // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.


var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

function add$1(name, handler, capture, passive) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;

    handler = original._wrapper = function (e) {
      if ( // no bubbling, should always fire.
      // this is just a safety net in case event.timeStamp is unreliable in
      // certain weird environments...
      e.target === e.currentTarget || // event is fired after handler attachment
      e.timeStamp >= attachedTimestamp || // bail for environments that have buggy event.timeStamp implementations
      // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
      // #9681 QtWebEngine event.timeStamp is negative value
      e.timeStamp <= 0 || // #9448 bail if event is fired in another document in a multi-page
      // electron/nw.js app, since event.timeStamp will be using a different
      // starting reference
      e.target.ownerDocument !== document) {
        return original.apply(this, arguments);
      }
    };
  }

  target$1.addEventListener(name, handler, supportsPassive ? {
    capture: capture,
    passive: passive
  } : capture);
}

function remove$2(name, handler, capture, _target) {
  (_target || target$1).removeEventListener(name, handler._wrapper || handler, capture);
}

function updateDOMListeners(oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return;
  }

  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};
/*  */

var svgContainer;

function updateDOMProps(oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return;
  }

  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {}; // clone observed objects, as the user probably wants to mutate it

  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (!(key in props)) {
      elm[key] = '';
    }
  }

  for (key in props) {
    cur = props[key]; // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)

    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) {
        vnode.children.length = 0;
      }

      if (cur === oldProps[key]) {
        continue;
      } // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property


      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value' && elm.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur; // avoid resetting cursor position when value is the same

      var strCur = isUndef(cur) ? '' : String(cur);

      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
      // IE doesn't support innerHTML for SVG elements
      svgContainer = svgContainer || document.createElement('div');
      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
      var svg = svgContainer.firstChild;

      while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }

      while (svg.firstChild) {
        elm.appendChild(svg.firstChild);
      }
    } else if ( // skip the update if old and new VDOM state is the same.
    // `value` is handled separately because the DOM value may be temporarily
    // out of sync with VDOM state due to focus, composition and modifiers.
    // This  #4521 by skipping the unnecesarry `checked` update.
    cur !== oldProps[key]) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
} // check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue(elm, checkVal) {
  return !elm.composing && (elm.tagName === 'OPTION' || isNotInFocusAndDirty(elm, checkVal) || isDirtyWithModifiers(elm, checkVal));
}

function isNotInFocusAndDirty(elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true; // #6157
  // work around IE bug when accessing document.activeElement in an iframe

  try {
    notInFocus = document.activeElement !== elm;
  } catch (e) {}

  return notInFocus && elm.value !== checkVal;
}

function isDirtyWithModifiers(elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime

  if (isDef(modifiers)) {
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal);
    }

    if (modifiers.trim) {
      return value.trim() !== newVal.trim();
    }
  }

  return value !== newVal;
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};
/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
}); // merge static and dynamic style data on the same vnode

function normalizeStyleData(data) {
  var style = normalizeStyleBinding(data.style); // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it

  return data.staticStyle ? extend(data.staticStyle, style) : style;
} // normalize possible array / string values into Object


function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }

  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
  }

  return bindingStyle;
}
/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */


function getStyle(vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;

    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;

      if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if (styleData = normalizeStyleData(vnode.data)) {
    extend(res, styleData);
  }

  var parentNode = vnode;

  while (parentNode = parentNode.parent) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }

  return res;
}
/*  */


var cssVarRE = /^--/;
var importantRE = /\s*!important$/;

var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);

    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];
var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);

  if (prop !== 'filter' && prop in emptyStyle) {
    return prop;
  }

  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);

  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;

    if (name in emptyStyle) {
      return name;
    }
  }
});

function updateStyle(oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
    return;
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {}; // if static style exists, stylebinding already merged into it when doing normalizeStyleData

  var oldStyle = oldStaticStyle || oldStyleBinding;
  var style = normalizeStyleBinding(vnode.data.style) || {}; // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.

  vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;
  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }

  for (name in newStyle) {
    cur = newStyle[name];

    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};
/*  */

var whitespaceRE = /\s+/;
/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */

function addClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  /* istanbul ignore else */


  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";

    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}
/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */


function removeClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  /* istanbul ignore else */


  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }

    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';

    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }

    cur = cur.trim();

    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}
/*  */


function resolveTransition(def$$1) {
  if (!def$$1) {
    return;
  }
  /* istanbul ignore else */


  if (typeof def$$1 === 'object') {
    var res = {};

    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }

    extend(res, def$$1);
    return res;
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1);
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: name + "-enter",
    enterToClass: name + "-enter-to",
    enterActiveClass: name + "-enter-active",
    leaveClass: name + "-leave",
    leaveToClass: name + "-leave-to",
    leaveActiveClass: name + "-leave-active"
  };
});
var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation'; // Transition property/event sniffing

var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';

if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }

  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
} // binding to window is necessary to make hot reload work in IE in strict mode


var raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout :
/* istanbul ignore next */
function (fn) {
  return fn();
};

function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass(el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);

  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass(el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }

  removeClass(el, cls);
}

function whenTransitionEnds(el, expectedType, cb) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;

  if (!type) {
    return cb();
  }

  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;

  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };

  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };

  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);
  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */

  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }

  var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}

function getTimeout(delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
} // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors


function toMs(s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}
/*  */


function enter(vnode, toggleDisplay) {
  var el = vnode.elm; // call leave callback now

  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;

    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);

  if (isUndef(data)) {
    return;
  }
  /* istanbul ignore if */


  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration; // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.

  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;

  while (transitionNode && transitionNode.parent) {
    context = transitionNode.context;
    transitionNode = transitionNode.parent;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return;
  }

  var startClass = isAppear && appearClass ? appearClass : enterClass;
  var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
  var toClass = isAppear && appearToClass ? appearToClass : enterToClass;
  var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
  var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
  var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
  var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;
  var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);
  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }

    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }

      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }

    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];

      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }

      enterHook && enterHook(el, cb);
    });
  } // start enter transition


  beforeEnterHook && beforeEnterHook(el);

  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);

      if (!cb.cancelled) {
        addTransitionClass(el, toClass);

        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave(vnode, rm) {
  var el = vnode.elm; // call enter callback now

  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;

    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);

  if (isUndef(data) || el.nodeType !== 1) {
    return rm();
  }
  /* istanbul ignore if */


  if (isDef(el._leaveCb)) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;
  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);
  var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }

    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }

    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }

      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }

    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave() {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return;
    } // record leaving element


    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }

    beforeLeave && beforeLeave(el);

    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);

        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);

          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    leave && leave(el, cb);

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
} // only used in dev mode


function checkDuration(val, name, vnode) {
  if (typeof val !== 'number') {
    warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
  } else if (isNaN(val)) {
    warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
  }
}

function isValidDuration(val) {
  return typeof val === 'number' && !isNaN(val);
}
/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */


function getHookArgumentsLength(fn) {
  if (isUndef(fn)) {
    return false;
  }

  var invokerFns = fn.fns;

  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
  } else {
    return (fn._length || fn.length) > 1;
  }
}

function _enter(_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1(vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};
var platformModules = [attrs, klass, events, domProps, style, transition];
/*  */
// the directive module should be applied last, after all
// built-in modules have been applied.

var modules = platformModules.concat(baseModules);
var patch = createPatchFunction({
  nodeOps: nodeOps,
  modules: modules
});
/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */

if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;

    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted(el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }

      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;

      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd); // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.

        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */

        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context); // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.

      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);

      if (curOptions.some(function (o, i) {
        return !looseEqual(o, prevOptions[i]);
      })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple ? binding.value.some(function (v) {
          return hasNoMatchingOption(v, curOptions);
        }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);

        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected(el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */

  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected(el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;

  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
    return;
  }

  var selected, option;

  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];

    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;

      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }

        return;
      }
    }
  }

  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption(value, options) {
  return options.every(function (o) {
    return !looseEqual(o, value);
  });
}

function getValue(option) {
  return '_value' in option ? option._value : option.value;
}

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) {
    return;
  }

  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}
/*  */
// recursively search for possible transition defined inside the component root


function locateNode(vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
}

var show = {
  bind: function bind(el, ref, vnode) {
    var value = ref.value;
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;

    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },
  update: function update(el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;
    /* istanbul ignore if */

    if (!value === !oldValue) {
      return;
    }

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;

    if (transition$$1) {
      vnode.data.show = true;

      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },
  unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};
var platformDirectives = {
  model: directive,
  show: show
};
/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
}; // in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered

function getRealChild(vnode) {
  var compOptions = vnode && vnode.componentOptions;

  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children));
  } else {
    return vnode;
  }
}

function extractTransitionData(comp) {
  var data = {};
  var options = comp.$options; // props

  for (var key in options.propsData) {
    data[key] = comp[key];
  } // events.
  // extract listeners and pass them directly to the transition methods


  var listeners = options._parentListeners;

  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }

  return data;
}

function placeholder(h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    });
  }
}

function hasParentTransition(vnode) {
  while (vnode = vnode.parent) {
    if (vnode.data.transition) {
      return true;
    }
  }
}

function isSameChild(child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag;
}

var isNotTextNode = function (c) {
  return c.tag || isAsyncPlaceholder(c);
};

var isVShowDirective = function (d) {
  return d.name === 'show';
};

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render(h) {
    var this$1 = this;
    var children = this.$slots.default;

    if (!children) {
      return;
    } // filter out text nodes (possible whitespaces)


    children = children.filter(isNotTextNode);
    /* istanbul ignore if */

    if (!children.length) {
      return;
    } // warn multiple elements


    if ("development" !== 'production' && children.length > 1) {
      warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
    }

    var mode = this.mode; // warn invalid mode

    if ("development" !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
      warn('invalid <transition> mode: ' + mode, this.$parent);
    }

    var rawChild = children[0]; // if this is a component root node and the component's
    // parent container node also has transition, skip.

    if (hasParentTransition(this.$vnode)) {
      return rawChild;
    } // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive


    var child = getRealChild(rawChild);
    /* istanbul ignore if */

    if (!child) {
      return rawChild;
    }

    if (this._leaving) {
      return placeholder(h, rawChild);
    } // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.


    var id = "__transition-" + this._uid + "-";
    child.key = child.key == null ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild); // mark v-show
    // so that the transition module can hand over the control to the directive

    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild) && // #6687 component root is a comment node
    !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data); // handle transition mode

      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild);
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild;
        }

        var delayedLeave;

        var performLeave = function () {
          delayedLeave();
        };

        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        });
      }
    }

    return rawChild;
  }
};
/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);
delete props.mode;
var TransitionGroup = {
  props: props,
  beforeMount: function beforeMount() {
    var this$1 = this;
    var update = this._update;

    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1); // force removing pass

      this$1.__patch__(this$1._vnode, this$1.kept, false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
      );

      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },
  render: function render(h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];

      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c;
          (c.data || (c.data = {})).transition = transitionData;
        } else if ("development" !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
          warn("<transition-group> children must be keyed: <" + name + ">");
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];

      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();

        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }

      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children);
  },
  updated: function updated() {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name || 'v') + '-move';

    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return;
    } // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.


    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation); // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line

    this._reflow = document.body.offsetHeight;
    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
          if (e && e.target !== el) {
            return;
          }

          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },
  methods: {
    hasMove: function hasMove(el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false;
      }
      /* istanbul ignore if */


      if (this._hasMove) {
        return this._hasMove;
      } // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.


      var clone = el.cloneNode();

      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) {
          removeClass(clone, cls);
        });
      }

      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return this._hasMove = info.hasTransform;
    }
  }
};

function callPendingCbs(c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */


  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition(c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation(c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;

  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};
/*  */
// install platform specific utils

Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement; // install platform runtime directives & components

extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents); // install platform patch function

Vue.prototype.__patch__ = inBrowser ? patch : noop; // public mount method

Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
}; // devtools global hook

/* istanbul ignore next */


if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if ("development" !== 'production' && "development" !== 'test') {
        console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
      }
    }

    if ("development" !== 'production' && "development" !== 'test' && config.productionTip !== false && typeof console !== 'undefined') {
      console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
    }
  }, 0);
}
/*  */


var _default = Vue;
exports.default = _default;
},{}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/css-baseline/css/4.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/plugins/css-baseline-plugin.js":[function(require,module,exports) {
"use strict";

require("css-baseline/css/4.css");
},{"css-baseline/css/4.css":"node_modules/css-baseline/css/4.css"}],"node_modules/good-vue/dist/index.js":[function(require,module,exports) {
/*!
 * good-vue v1.3.1
 * (c) 
 * Released under the ISC License.
 */
'use strict';

const component = {
  props: {
    'wrap': {
      type: [String, Boolean],
      validator: value => [true, false, 'reverse'].includes(value)
    },
    'shadow': {
      type: [Number, String]
    }
  },
  computed: {
    flexWrapStyle() {
      let wrap = this.$props.wrap || this.$attrs["flex-wrap"];
      let value = wrap;

      if (wrap == true) {
        value = 'wrap';
      } else if (wrap == 'reverse') {
        value = 'wrap-reverse';
      } else if (wrap == false) {
        value = 'nowrap';
      }

      return value != null && {
        'flex-wrap': value
      };
    },

    shadowStyle() {
      let shadow = this.$props.shadow || this.$attrs["box-shadow"];
      let value = shadow;

      if (shadow == 0) {
        value = 'none';
      } else if (shadow == 1) {
        value = '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)';
      } else if (shadow == 2) {
        value = '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)';
      } else if (shadow == 3) {
        value = '0 8px 17px 2px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)';
      } else if (shadow == 4) {
        value = '0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -7px rgba(0,0,0,0.2)';
      } else if (shadow == 5) {
        value = '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)';
      }

      return shadow && {
        'box-shadow': value,
        '-webkit-box-shadow': value
      };
    }

  }
};

//
var script = {
  props: { ...component.props,
    'align-h': {
      type: String,
      validator: value => ['left', 'right', 'center', 'stretch', 'baseline', 'inherit', 'normal'].includes(value)
    },
    'align-v': {
      type: String,
      validator: value => ['top', 'bottom', 'center', 'space-around', 'space-between', 'space-evenly', 'stretch', 'baseline', 'inherit', 'normal'].includes(value)
    }
  },
  computed: { ...component.computed,

    justifyContentStyle() {
      let arrangement = this.$props.alignV || this.$attrs["justify-content"];
      let value = arrangement;

      if (arrangement == 'top') {
        value = 'flex-start';
      } else if (arrangement == 'bottom') {
        value = 'flex-end';
      }

      return value != null && {
        'justify-content': value
      };
    },

    alignItemsStyle() {
      let alignment = this.$props.alignH || this.$attrs["align-items"];
      let value = alignment;
      let additionalValues = {};

      if (alignment == 'left') {
        value = 'flex-start';
        additionalValues = {
          'text-align': 'left'
        };
      } else if (alignment == 'right') {
        value = 'flex-end';
        additionalValues = {
          'text-align': 'right'
        };
      }

      return value != null && {
        'align-items': value,
        ...additionalValues
      };
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', _vm._g({
    staticClass: "good-column",
    style: Object.assign({}, _vm.$attrs, _vm.justifyContentStyle, _vm.alignItemsStyle, _vm.flexWrapStyle, _vm.shadowStyle),
    attrs: {
      "unique-add1e7fe": ""
    }
  }, this.$listeners), [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-46e06dd6_0", {
    source: ".good-column[unique-add1e7fe]{flex-direction:column}[unique-add1e7fe]{display:flex;flex-direction:column;align-items:center;justify-content:center;flex-wrap:nowrap;margin:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

var Column = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

//
var script$1 = {
  props: { ...component.props,
    'align-v': {
      type: String,
      validator: value => ['top', 'bottom', 'center', 'stretch', 'baseline', 'inherit', 'normal'].includes(value)
    },
    'align-h': {
      type: String,
      validator: value => ['left', 'right', 'center', 'space-around', 'space-between', 'space-evenly', 'stretch', 'baseline', 'inherit', 'normal'].includes(value)
    }
  },
  computed: { ...component.computed,

    justifyContentStyle() {
      let arrangement = this.$props.alignH || this.$attrs["justify-content"];
      let value = arrangement;
      let additionalValues = {};

      if (arrangement == 'left') {
        value = 'flex-start';
        additionalValues = {
          'text-align': 'left'
        };
      } else if (arrangement == 'right') {
        value = 'flex-end';
        additionalValues = {
          'text-align': 'right'
        };
      }

      return value != null && {
        'justify-content': value,
        ...additionalValues
      };
    },

    alignItemsStyle() {
      let alignment = this.$props.alignV || this.$attrs["align-items"];
      let value = alignment;

      if (alignment == 'top') {
        value = 'flex-start';
      } else if (alignment == 'bottom') {
        value = 'flex-end';
      }

      return value != null && {
        'align-items': value
      };
    }

  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', _vm._g({
    staticClass: "good-row",
    style: Object.assign({}, _vm.$attrs, _vm.justifyContentStyle, _vm.alignItemsStyle, _vm.flexWrapStyle, _vm.shadowStyle),
    attrs: {
      "unique-add1e7fa": ""
    }
  }, this.$listeners), [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = function (inject) {
  if (!inject) return;
  inject("data-v-7148b7bc_0", {
    source: ".good-row[unique-add1e7fa]{flex-direction:row}[unique-add1e7fa]{display:flex;flex-direction:row;justify-content:center;align-items:center;flex-wrap:nowrap;margin:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject SSR */

var Row = normalizeComponent_1({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, browser, undefined);

//
var script$2 = {
  props: { ...component.props
  },
  computed: { ...component.computed
  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', _vm._g({
    staticClass: "good-container",
    style: Object.assign({}, _vm.shadowStyle, _vm.$attrs),
    attrs: {
      "unique-a23421e7a": ""
    }
  }, this.$listeners), [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$2 = [];
/* style */

const __vue_inject_styles__$2 = function (inject) {
  if (!inject) return;
  inject("data-v-1d9d60fa_0", {
    source: ".good-container[unique-a23421e7a]{flex-direction:column}[unique-a23421e7a]{display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;flex-wrap:nowrap;margin:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$2 = undefined;
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject SSR */

var Container = normalizeComponent_1({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, browser, undefined);

let globalData;
let setupGlobalData = (Vue, data) => {
  globalData = data; // connect the data to every child component

  Vue.mixin({
    data: () => ({
      $global: globalData
    })
  });
};

var index = {
  setupGlobalData,

  install(Vue, options) {
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("column", Column);
    Vue.component("row", Row);
    Vue.component("container", Container);
  }

};

module.exports = index;

},{}],"src/plugins/good-vue-plugin.js":[function(require,module,exports) {
"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _goodVue = _interopRequireDefault(require("good-vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue.default.use(_goodVue.default);
},{"vue":"node_modules/vue/dist/vue.runtime.esm.js","good-vue":"node_modules/good-vue/dist/index.js"}],"node_modules/keen-ui/dist/keen-ui.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*!
 * Keen UI v1.3.0 (https://github.com/JosephusPaye/keen-ui)
 * (c) 2020 Josephus Paye II
 * Released under the MIT License.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["KeenUI"] = factory();
	else
		root["KeenUI"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 188);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiIcon_vue__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_39a27af7_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiIcon_vue__ = __webpack_require__(155);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(107)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiIcon_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_39a27af7_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiIcon_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiIcon.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiIcon.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-39a27af7", Component.options)
  } else {
    hotAPI.reload("data-v-39a27af7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiRippleInk_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ef65288_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiRippleInk_vue__ = __webpack_require__(166);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(118)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiRippleInk_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ef65288_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiRippleInk_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiRippleInk.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiRippleInk.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ef65288", Component.options)
  } else {
    hotAPI.reload("data-v-5ef65288", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export defaultLang */
/* unused harmony export getDayFull */
/* unused harmony export getDayInitial */
/* unused harmony export getDayAbbreviated */
/* unused harmony export getMonthFull */
/* unused harmony export getMonthAbbreviated */
/* unused harmony export getDayOfMonth */
/* unused harmony export humanize */
/* unused harmony export clone */
/* unused harmony export moveToDayOfWeek */
/* unused harmony export isSameDay */
/* unused harmony export isBefore */
/* unused harmony export isAfter */
var defaultLang = {
    months: {
        full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    days: {
        full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

        abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

        initials: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    }
};

function pad(value, length) {
    while (value.length < length) {
        value = '0' + value;
    }

    return value;
}

function getDayFull(date) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLang;

    return lang.days.full[date.getDay()];
}

function getDayInitial(date) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLang;

    return lang.days.initials[date.getDay()];
}

function getDayAbbreviated(date) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLang;

    return lang.days.abbreviated[date.getDay()];
}

function getMonthFull(date) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLang;

    return lang.months.full[date.getMonth()];
}

function getMonthAbbreviated(date) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLang;

    return lang.months.abbreviated[date.getMonth()];
}

function getDayOfMonth(date) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { pad: true };

    var day = date.getDate().toString();
    return options.pad ? pad(day) : day;
}

function humanize(date) {
    var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLang;

    var days = lang.days.abbreviated;
    var months = lang.months.full;

    return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function clone(date) {
    return new Date(date.getTime());
}

function moveToDayOfWeek(date, dayOfWeek) {
    while (date.getDay() !== dayOfWeek) {
        date.setDate(date.getDate() - 1);
    }

    return date;
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

function isBefore(date1, date2) {
    return date1.getTime() < date2.getTime();
}

function isAfter(date1, date2) {
    return date1.getTime() > date2.getTime();
}

/* harmony default export */ __webpack_exports__["a"] = {
    defaultLang: defaultLang,
    getDayFull: getDayFull,
    getDayInitial: getDayInitial,
    getDayAbbreviated: getDayAbbreviated,
    getMonthFull: getMonthFull,
    getMonthAbbreviated: getMonthAbbreviated,
    getDayOfMonth: getDayOfMonth,
    humanize: humanize,
    clone: clone,
    moveToDayOfWeek: moveToDayOfWeek,
    isSameDay: isSameDay,
    isBefore: isBefore,
    isAfter: isAfter
};

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiPopover_vue__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_48582497_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiPopover_vue__ = __webpack_require__(158);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(110)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiPopover_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_48582497_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiPopover_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiPopover.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiPopover.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-48582497", Component.options)
  } else {
    hotAPI.reload("data-v-48582497", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var trim = /^\s+|\s+$/g;
var whitespace = /\s+/g;

function interpret(input) {
    return typeof input === 'string' ? input.replace(trim, '').split(whitespace) : input;
}

function classes(el) {
    if (isElement(el)) {
        return (el.getAttribute('class') || '').replace(trim, '').split(whitespace);
    }

    return [];
}

function set(el, input) {
    if (isElement(el)) {
        el.setAttribute('class', interpret(input).join(' '));
    }
}

function add(el, input) {
    var current = remove(el, input);
    var values = interpret(input);

    current.push.apply(current, values);
    set(el, current);

    return current;
}

function remove(el, input) {
    var current = classes(el);
    var values = interpret(input);

    values.forEach(function (value) {
        var i = current.indexOf(value);
        if (i !== -1) {
            current.splice(i, 1);
        }
    });

    set(el, current);

    return current;
}

function contains(el, input) {
    var current = classes(el);
    var values = interpret(input);

    return values.every(function (value) {
        return current.indexOf(value) !== -1;
    });
}

function isElement(o) {
    var elementObjects = (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object';
    return elementObjects ? o instanceof HTMLElement : isElementObject(o);
}

function isElementObject(o) {
    return o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && typeof o.nodeName === 'string' && o.nodeType === 1;
}

/* harmony default export */ __webpack_exports__["a"] = {
    add: add,
    remove: remove,
    contains: contains,
    has: contains,
    set: set,
    get: classes
};

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isObject */
/* harmony export (immutable) */ __webpack_exports__["b"] = looseEqual;
/* harmony export (immutable) */ __webpack_exports__["c"] = looseIndexOf;
/* harmony export (immutable) */ __webpack_exports__["a"] = startsWith;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isObject(obj) {
    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function looseEqual(a, b) {
    return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
}

function looseIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (looseEqual(arr[i], val)) {
            return i;
        }
    }

    return -1;
}

function startsWith(string, query) {
    var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return string.substr(position, query.length) === query;
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiButton_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_663a40a0_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiButton_vue__ = __webpack_require__(167);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(119)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiButton_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_663a40a0_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiButton_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiButton.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiButton.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-663a40a0", Component.options)
  } else {
    hotAPI.reload("data-v-663a40a0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiProgressCircular_vue__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bea93ea_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiProgressCircular_vue__ = __webpack_require__(175);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(127)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiProgressCircular_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bea93ea_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiProgressCircular_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiProgressCircular.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiProgressCircular.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7bea93ea", Component.options)
  } else {
    hotAPI.reload("data-v-7bea93ea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTooltip_vue__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6cedb6f5_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTooltip_vue__ = __webpack_require__(169);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(121)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTooltip_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6cedb6f5_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTooltip_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiTooltip.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiTooltip.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6cedb6f5", Component.options)
  } else {
    hotAPI.reload("data-v-6cedb6f5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCloseButton_vue__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5f488_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCloseButton_vue__ = __webpack_require__(174);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(126)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCloseButton_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5f488_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCloseButton_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCloseButton.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCloseButton.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ba5f488", Component.options)
  } else {
    hotAPI.reload("data-v-7ba5f488", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiIconButton_vue__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9db4dbee_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiIconButton_vue__ = __webpack_require__(179);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(131)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiIconButton_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9db4dbee_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiIconButton_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiIconButton.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiIconButton.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9db4dbee", Component.options)
  } else {
    hotAPI.reload("data-v-9db4dbee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiModal_vue__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cfba9c2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiModal_vue__ = __webpack_require__(165);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(117)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiModal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cfba9c2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiModal_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiModal.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiModal.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5cfba9c2", Component.options)
  } else {
    hotAPI.reload("data-v-5cfba9c2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export validate */
/* unused harmony export resolve */
function validate(ref, warning) {
    var isValid = ref instanceof Element || ref && ref._isVue || typeof ref === 'string';

    if (!isValid && warning) {
        console.warn(warning);
    }

    return isValid;
}

function resolve(ref, fallback) {
    if (ref instanceof Element) {
        return ref;
    } else if (ref && ref._isVue) {
        return ref.$el;
    } else if (typeof ref === 'string') {
        return document.querySelector(ref);
    }

    return fallback;
}

/* harmony default export */ __webpack_exports__["a"] = {
    validate: validate,
    resolve: resolve
};

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiFocusContainer_vue__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6c26f987_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiFocusContainer_vue__ = __webpack_require__(168);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(120)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiFocusContainer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6c26f987_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiFocusContainer_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiFocusContainer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiFocusContainer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6c26f987", Component.options)
  } else {
    hotAPI.reload("data-v-6c26f987", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCheckbox_vue__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7905fb7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCheckbox_vue__ = __webpack_require__(172);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(124)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCheckbox_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7905fb7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCheckbox_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCheckbox.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCheckbox.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7905fb7e", Component.options)
  } else {
    hotAPI.reload("data-v-7905fb7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiDatepickerCalendar_vue__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b37986d0_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiDatepickerCalendar_vue__ = __webpack_require__(183);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(135)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiDatepickerCalendar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b37986d0_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiDatepickerCalendar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiDatepickerCalendar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiDatepickerCalendar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b37986d0", Component.options)
  } else {
    hotAPI.reload("data-v-b37986d0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiProgressLinear_vue__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_22995a30_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiProgressLinear_vue__ = __webpack_require__(151);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(103)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiProgressLinear_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_22995a30_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiProgressLinear_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiProgressLinear.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiProgressLinear.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-22995a30", Component.options)
  } else {
    hotAPI.reload("data-v-22995a30", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiRadio_vue__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1658ed6d_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiRadio_vue__ = __webpack_require__(150);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(102)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiRadio_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1658ed6d_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiRadio_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiRadio.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiRadio.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1658ed6d", Component.options)
  } else {
    hotAPI.reload("data-v-1658ed6d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSnackbar_vue__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ad542fa_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSnackbar_vue__ = __webpack_require__(163);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(115)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSnackbar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ad542fa_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSnackbar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiSnackbar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiSnackbar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ad542fa", Component.options)
  } else {
    hotAPI.reload("data-v-5ad542fa", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = {
    inserted: function inserted(el, _ref) {
        var value = _ref.value;

        if (value) {
            el.focus();
        }
    }
};

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export inView */
/* harmony export (immutable) */ __webpack_exports__["b"] = scrollIntoView;
/* harmony export (immutable) */ __webpack_exports__["a"] = resetScroll;
function inView(element, container) {
    if (!element) {
        return;
    }

    container = container || element.parentElement;

    var top = element.offsetTop;
    var parentTop = container.scrollTop;
    var bottom = top + element.offsetHeight;
    var parentBottom = container.offsetHeight;

    return top >= parentTop && bottom <= parentBottom;
}

function scrollIntoView(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { container: null, marginTop: 0 };

    if (!element) {
        return;
    }

    options.container = options.container || element.parentElement;

    if (inView(element, options.container)) {
        return;
    }

    options.container.scrollTop = element.offsetTop - options.marginTop;
}

function resetScroll(element) {
    if (!element) {
        return;
    }

    element.scrollTop = 0;
}

/* unused harmony default export */ var _unused_webpack_default_export = {
    inView: inView,
    scrollIntoView: scrollIntoView,
    resetScroll: resetScroll
};

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export on */
/* unused harmony export onKeydown */
/* unused harmony export onKeyup */
/* unused harmony export onKeypress */
function on(event, target, callback) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { passive: true };

    target.addEventListener(event, callback, options);

    return function () {
        target.removeEventListener(event, callback, options);
    };
}

function onKey(key, event, target, callback, options) {
    return on(event, target, function (e) {
        if (!key) {
            callback(e);
        } else if (key === e.key || key === e.keyCode) {
            callback(e);
        }
    }, options);
}

function onKeydown(keys, target, callback, options) {
    return onKey(keys, 'keydown', target, callback, options);
}

function onKeyup(keys, target, callback, options) {
    return onKey(keys, 'keyup', target, callback, options);
}

function onKeypress(keys, target, callback, options) {
    return onKey(keys, 'keypress', target, callback, options);
}

/* harmony default export */ __webpack_exports__["a"] = {
    on: on,
    onKeydown: onKeydown,
    onKeyup: onKeyup,
    onKeypress: onKeypress
};

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 */

var lut = [];

for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

var generate = function generate() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;

    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
};

var short = function short(prefix) {
    prefix = prefix || '';

    var uuid = generate();

    return prefix + uuid.split('-')[0];
};

/* harmony default export */ __webpack_exports__["a"] = {
    generate: generate,
    short: short
};

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_events__ = __webpack_require__(22);


/* harmony default export */ __webpack_exports__["a"] = {
    beforeDestroy: function beforeDestroy() {
        if (typeof this.destroyExternalClickListener === 'function') {
            this.removeExternalClickListener();
        }
    },


    methods: {
        addExternalClickListener: function addExternalClickListener() {
            var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [this.$el];

            var _this = this;

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { passive: true };

            elements = Array.isArray(elements) ? elements : [elements];

            this.destroyExternalClickListener = __WEBPACK_IMPORTED_MODULE_0__helpers_events__["a" /* default */].on('click', document, function (e) {
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].contains(e.target)) {
                        return;
                    }
                }

                if (typeof callback === 'function') {
                    callback(e);
                } else {
                    _this.$emit('external-click', e);
                }
            }, options);
        },
        removeExternalClickListener: function removeExternalClickListener() {
            if (this.destroyExternalClickListener) {
                this.destroyExternalClickListener();
                this.destroyExternalClickListener = null;
            }
        }
    }
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function fuzzysearch (needle, haystack) {
  var tlen = haystack.length;
  var qlen = needle.length;
  if (qlen > tlen) {
    return false;
  }
  if (qlen === tlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < qlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < tlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

module.exports = fuzzysearch;


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_popper_js__ = __webpack_require__(139);
/**!
* tippy.js v4.2.1
* (c) 2017-2019 atomiks
* MIT License
*/


function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var version = "4.2.1";

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var ua = isBrowser ? navigator.userAgent : '';
var isIE = /MSIE |Trident\//.test(ua);
var isUCBrowser = /UCBrowser\//.test(ua);
var isIOS = isBrowser && /iPhone|iPad|iPod/.test(navigator.platform) && !window.MSStream;

var defaultProps = {
  a11y: true,
  allowHTML: true,
  animateFill: true,
  animation: 'shift-away',
  appendTo: function appendTo() {
    return document.body;
  },
  aria: 'describedby',
  arrow: false,
  arrowType: 'sharp',
  boundary: 'scrollParent',
  content: '',
  delay: 0,
  distance: 10,
  duration: [325, 275],
  flip: true,
  flipBehavior: 'flip',
  flipOnUpdate: false,
  followCursor: false,
  hideOnClick: true,
  ignoreAttributes: false,
  inertia: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  lazy: true,
  maxWidth: 350,
  multiple: false,
  offset: 0,
  onHidden: function onHidden() {},
  onHide: function onHide() {},
  onMount: function onMount() {},
  onShow: function onShow() {},
  onShown: function onShown() {},
  placement: 'top',
  popperOptions: {},
  role: 'tooltip',
  showOnInit: false,
  size: 'regular',
  sticky: false,
  target: '',
  theme: 'dark',
  touch: true,
  touchHold: false,
  trigger: 'mouseenter focus',
  updateDuration: 0,
  wait: null,
  zIndex: 9999
  /**
   * If the set() method encounters one of these, the popperInstance must be
   * recreated
   */

};
var POPPER_INSTANCE_DEPENDENCIES = ['arrow', 'arrowType', 'boundary', 'distance', 'flip', 'flipBehavior', 'flipOnUpdate', 'offset', 'placement', 'popperOptions'];

var elementProto = isBrowser ? Element.prototype : {};
var matches = elementProto.matches || elementProto.matchesSelector || elementProto.webkitMatchesSelector || elementProto.mozMatchesSelector || elementProto.msMatchesSelector;
/**
 * Ponyfill for Array.from - converts iterable values to an array
 */

function arrayFrom(value) {
  return [].slice.call(value);
}
/**
 * Ponyfill for Element.prototype.closest
 */

function closest(element, parentSelector) {
  return (elementProto.closest || function (selector) {
    // @ts-ignore
    var el = this;

    while (el) {
      if (matches.call(el, selector)) {
        return el;
      }

      el = el.parentElement;
    }
  }).call(element, parentSelector);
}
/**
 * Works like Element.prototype.closest, but uses a callback instead
 */

function closestCallback(element, callback) {
  while (element) {
    if (callback(element)) {
      return element;
    }

    element = element.parentElement;
  }
}

// Passive event listener config
var PASSIVE = {
  passive: true // Popper `preventOverflow` padding

};
var PADDING = 4; // Popper attributes
// In Popper v2 these will be `data-*` instead of `x-*` to adhere to HTML5 spec

var PLACEMENT_ATTRIBUTE = 'x-placement';
var OUT_OF_BOUNDARIES_ATTRIBUTE = 'x-out-of-boundaries'; // Classes

var IOS_CLASS = 'tippy-iOS';
var ACTIVE_CLASS = 'tippy-active'; // Selectors

var POPPER_SELECTOR = '.tippy-popper';
var TOOLTIP_SELECTOR = '.tippy-tooltip';
var CONTENT_SELECTOR = '.tippy-content';
var BACKDROP_SELECTOR = '.tippy-backdrop';
var ARROW_SELECTOR = '.tippy-arrow';
var ROUND_ARROW_SELECTOR = '.tippy-roundarrow';

var keys = Object.keys(defaultProps);
/**
 * Returns an object of optional props from data-tippy-* attributes
 */

function getDataAttributeOptions(reference) {
  return keys.reduce(function (acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-".concat(key)) || '').trim();

    if (!valueAsString) {
      return acc;
    }

    if (key === 'content') {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }

    return acc;
  }, {});
}
/**
 * Polyfills the virtual reference (plain object) with Element.prototype props
 * Mutating because DOM elements are mutated, adds `_tippy` property
 */

function polyfillElementPrototypeProperties(virtualReference) {
  var polyfills = {
    isVirtual: true,
    attributes: virtualReference.attributes || {},
    setAttribute: function setAttribute(key, value) {
      virtualReference.attributes[key] = value;
    },
    getAttribute: function getAttribute(key) {
      return virtualReference.attributes[key];
    },
    removeAttribute: function removeAttribute(key) {
      delete virtualReference.attributes[key];
    },
    hasAttribute: function hasAttribute(key) {
      return key in virtualReference.attributes;
    },
    addEventListener: function addEventListener() {},
    removeEventListener: function removeEventListener() {},
    classList: {
      classNames: {},
      add: function add(key) {
        virtualReference.classList.classNames[key] = true;
      },
      remove: function remove(key) {
        delete virtualReference.classList.classNames[key];
      },
      contains: function contains(key) {
        return key in virtualReference.classList.classNames;
      }
    }
  };

  for (var key in polyfills) {
    virtualReference[key] = polyfills[key];
  }
}

/**
 * Determines if a value is a "bare" virtual element (before mutations done
 * by `polyfillElementPrototypeProperties()`). JSDOM elements show up as
 * [object Object], we can check if the value is "element-like" if it has
 * `addEventListener`
 */

function isBareVirtualElement(value) {
  return {}.toString.call(value) === '[object Object]' && !value.addEventListener;
}
/**
 * Safe .hasOwnProperty check, for prototype-less objects
 */

function hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}
/**
 * Returns an array of elements based on the value
 */

function getArrayOfElements(value) {
  if (isSingular(value)) {
    // TODO: VirtualReference is not compatible to type Element
    return [value];
  }

  if (value instanceof NodeList) {
    return arrayFrom(value);
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return arrayFrom(document.querySelectorAll(value));
  } catch (e) {
    return [];
  }
}
/**
 * Returns a value at a given index depending on if it's an array or number
 */

function getValue(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? defaultValue : v;
  }

  return value;
}
/**
 * Debounce utility
 */

function debounce(fn, ms) {
  var timeoutId;
  return function () {
    var _this = this,
        _arguments = arguments;

    clearTimeout(timeoutId); // @ts-ignore

    timeoutId = setTimeout(function () {
      return fn.apply(_this, _arguments);
    }, ms);
  };
}
/**
 * Prevents errors from being thrown while accessing nested modifier objects
 * in `popperOptions`
 */

function getModifier(obj, key) {
  return obj && obj.modifiers && obj.modifiers[key];
}
/**
 * Determines if an array or string includes a value
 */

function includes(a, b) {
  return a.indexOf(b) > -1;
}
/**
 * Determines if the value is singular-like
 */

function isSingular(value) {
  return !!(value && hasOwnProperty(value, 'isVirtual')) || value instanceof Element;
}
/**
 * Firefox extensions don't allow setting .innerHTML directly, this will trick it
 */

function innerHTML() {
  return 'innerHTML';
}
/**
 * Evaluates a function if one, or returns the value
 */

function evaluateValue(value, args) {
  return typeof value === 'function' ? value.apply(null, args) : value;
}
/**
 * Sets a popperInstance `flip` modifier's enabled state
 */

function setFlipModifierEnabled(modifiers, value) {
  modifiers.filter(function (m) {
    return m.name === 'flip';
  })[0].enabled = value;
}
/**
 * Determines if an element can receive focus
 * Always returns true for virtual objects
 */

function canReceiveFocus(element) {
  return element instanceof Element ? matches.call(element, 'a[href],area[href],button,details,input,textarea,select,iframe,[tabindex]') && !element.hasAttribute('disabled') : true;
}
/**
 * Returns a new `div` element
 */

function div() {
  return document.createElement('div');
}
/**
 * Applies a transition duration to a list of elements
 */

function setTransitionDuration(els, value) {
  els.forEach(function (el) {
    if (el) {
      el.style.transitionDuration = "".concat(value, "ms");
    }
  });
}
/**
 * Sets the visibility state to elements so they can begin to transition
 */

function setVisibilityState(els, state) {
  els.forEach(function (el) {
    if (el) {
      el.setAttribute('data-state', state);
    }
  });
}
/**
 * Evaluates the props object by merging data attributes and
 * disabling conflicting options where necessary
 */

function evaluateProps(reference, props) {
  var out = _extends({}, props, {
    content: evaluateValue(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeOptions(reference));

  if (out.arrow || isUCBrowser) {
    out.animateFill = false;
  }

  return out;
}
/**
 * Validates an object of options with the valid default props object
 */

function validateOptions(options, defaultProps) {
  Object.keys(options).forEach(function (option) {
    if (!hasOwnProperty(defaultProps, option)) {
      throw new Error("[tippy]: `".concat(option, "` is not a valid option"));
    }
  });
}

/**
 * Sets the innerHTML of an element
 */

function setInnerHTML(element, html) {
  element[innerHTML()] = html instanceof Element ? html[innerHTML()] : html;
}
/**
 * Sets the content of a tooltip
 */

function setContent(contentEl, props) {
  if (props.content instanceof Element) {
    setInnerHTML(contentEl, '');
    contentEl.appendChild(props.content);
  } else if (typeof props.content !== 'function') {
    var key = props.allowHTML ? 'innerHTML' : 'textContent';
    contentEl[key] = props.content;
  }
}
/**
 * Returns the child elements of a popper element
 */

function getChildren(popper) {
  return {
    tooltip: popper.querySelector(TOOLTIP_SELECTOR),
    backdrop: popper.querySelector(BACKDROP_SELECTOR),
    content: popper.querySelector(CONTENT_SELECTOR),
    arrow: popper.querySelector(ARROW_SELECTOR) || popper.querySelector(ROUND_ARROW_SELECTOR)
  };
}
/**
 * Adds `data-inertia` attribute
 */

function addInertia(tooltip) {
  tooltip.setAttribute('data-inertia', '');
}
/**
 * Removes `data-inertia` attribute
 */

function removeInertia(tooltip) {
  tooltip.removeAttribute('data-inertia');
}
/**
 * Creates an arrow element and returns it
 */

function createArrowElement(arrowType) {
  var arrow = div();

  if (arrowType === 'round') {
    arrow.className = 'tippy-roundarrow';
    setInnerHTML(arrow, '<svg viewBox="0 0 18 7" xmlns="http://www.w3.org/2000/svg"><path d="M0 7s2.021-.015 5.253-4.218C6.584 1.051 7.797.007 9 0c1.203-.007 2.416 1.035 3.761 2.782C16.012 7.005 18 7 18 7H0z"/></svg>');
  } else {
    arrow.className = 'tippy-arrow';
  }

  return arrow;
}
/**
 * Creates a backdrop element and returns it
 */

function createBackdropElement() {
  var backdrop = div();
  backdrop.className = 'tippy-backdrop';
  backdrop.setAttribute('data-state', 'hidden');
  return backdrop;
}
/**
 * Adds interactive-related attributes
 */

function addInteractive(popper, tooltip) {
  popper.setAttribute('tabindex', '-1');
  tooltip.setAttribute('data-interactive', '');
}
/**
 * Removes interactive-related attributes
 */

function removeInteractive(popper, tooltip) {
  popper.removeAttribute('tabindex');
  tooltip.removeAttribute('data-interactive');
}
/**
 * Add/remove transitionend listener from tooltip
 */

function updateTransitionEndListener(tooltip, action, listener) {
  // UC Browser hasn't adopted the `transitionend` event despite supporting
  // unprefixed transitions...
  var eventName = isUCBrowser && document.body.style.webkitTransition !== undefined ? 'webkitTransitionEnd' : 'transitionend';
  tooltip[action + 'EventListener'](eventName, listener);
}
/**
 * Returns the popper's placement, ignoring shifting (top-start, etc)
 */

function getBasicPlacement(popper) {
  var fullPlacement = popper.getAttribute(PLACEMENT_ATTRIBUTE);
  return fullPlacement ? fullPlacement.split('-')[0] : '';
}
/**
 * Triggers reflow
 */

function reflow(popper) {
  void popper.offsetHeight;
}
/**
 * Adds/removes theme from tooltip's classList
 */

function updateTheme(tooltip, action, theme) {
  theme.split(' ').forEach(function (themeName) {
    tooltip.classList[action](themeName + '-theme');
  });
}
/**
 * Constructs the popper element and returns it
 */

function createPopperElement(id, props) {
  var popper = div();
  popper.className = 'tippy-popper';
  popper.id = "tippy-".concat(id);
  popper.style.zIndex = '' + props.zIndex;

  if (props.role) {
    popper.setAttribute('role', props.role);
  }

  var tooltip = div();
  tooltip.className = 'tippy-tooltip';
  tooltip.style.maxWidth = props.maxWidth + (typeof props.maxWidth === 'number' ? 'px' : '');
  tooltip.setAttribute('data-size', props.size);
  tooltip.setAttribute('data-animation', props.animation);
  tooltip.setAttribute('data-state', 'hidden');
  updateTheme(tooltip, 'add', props.theme);
  var content = div();
  content.className = 'tippy-content';
  content.setAttribute('data-state', 'hidden');

  if (props.interactive) {
    addInteractive(popper, tooltip);
  }

  if (props.arrow) {
    tooltip.appendChild(createArrowElement(props.arrowType));
  }

  if (props.animateFill) {
    tooltip.appendChild(createBackdropElement());
    tooltip.setAttribute('data-animatefill', '');
  }

  if (props.inertia) {
    addInertia(tooltip);
  }

  setContent(content, props);
  tooltip.appendChild(content);
  popper.appendChild(tooltip);
  return popper;
}
/**
 * Updates the popper element based on the new props
 */

function updatePopperElement(popper, prevProps, nextProps) {
  var _getChildren = getChildren(popper),
      tooltip = _getChildren.tooltip,
      content = _getChildren.content,
      backdrop = _getChildren.backdrop,
      arrow = _getChildren.arrow;

  popper.style.zIndex = '' + nextProps.zIndex;
  tooltip.setAttribute('data-size', nextProps.size);
  tooltip.setAttribute('data-animation', nextProps.animation);
  tooltip.style.maxWidth = nextProps.maxWidth + (typeof nextProps.maxWidth === 'number' ? 'px' : '');

  if (nextProps.role) {
    popper.setAttribute('role', nextProps.role);
  } else {
    popper.removeAttribute('role');
  }

  if (prevProps.content !== nextProps.content) {
    setContent(content, nextProps);
  } // animateFill


  if (!prevProps.animateFill && nextProps.animateFill) {
    tooltip.appendChild(createBackdropElement());
    tooltip.setAttribute('data-animatefill', '');
  } else if (prevProps.animateFill && !nextProps.animateFill) {
    tooltip.removeChild(backdrop);
    tooltip.removeAttribute('data-animatefill');
  } // arrow


  if (!prevProps.arrow && nextProps.arrow) {
    tooltip.appendChild(createArrowElement(nextProps.arrowType));
  } else if (prevProps.arrow && !nextProps.arrow) {
    tooltip.removeChild(arrow);
  } // arrowType


  if (prevProps.arrow && nextProps.arrow && prevProps.arrowType !== nextProps.arrowType) {
    tooltip.replaceChild(createArrowElement(nextProps.arrowType), arrow);
  } // interactive


  if (!prevProps.interactive && nextProps.interactive) {
    addInteractive(popper, tooltip);
  } else if (prevProps.interactive && !nextProps.interactive) {
    removeInteractive(popper, tooltip);
  } // inertia


  if (!prevProps.inertia && nextProps.inertia) {
    addInertia(tooltip);
  } else if (prevProps.inertia && !nextProps.inertia) {
    removeInertia(tooltip);
  } // theme


  if (prevProps.theme !== nextProps.theme) {
    updateTheme(tooltip, 'remove', prevProps.theme);
    updateTheme(tooltip, 'add', nextProps.theme);
  }
}
/**
 * Runs the callback after the popper's position has been updated
 * update() is debounced with Promise.resolve() or setTimeout()
 * scheduleUpdate() is update() wrapped in requestAnimationFrame()
 */

function afterPopperPositionUpdates(popperInstance, callback) {
  var popper = popperInstance.popper,
      options = popperInstance.options;
  var onCreate = options.onCreate,
      onUpdate = options.onUpdate;

  options.onCreate = options.onUpdate = function (data) {
    reflow(popper);
    callback();

    if (onUpdate) {
      onUpdate(data);
    }

    options.onCreate = onCreate;
    options.onUpdate = onUpdate;
  };
}
/**
 * Hides all visible poppers on the document
 */

function hideAll() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      checkHideOnClick = _ref.checkHideOnClick,
      exclude = _ref.exclude,
      duration = _ref.duration;

  arrayFrom(document.querySelectorAll(POPPER_SELECTOR)).forEach(function (popper) {
    var instance = popper._tippy;

    if (instance && (checkHideOnClick ? instance.props.hideOnClick === true : true) && (!exclude || popper !== exclude.popper)) {
      instance.hide(duration);
    }
  });
}
/**
 * Determines if the mouse cursor is outside of the popper's interactive border
 * region
 */

function isCursorOutsideInteractiveBorder(popperPlacement, popperRect, event, props) {
  if (!popperPlacement) {
    return true;
  }

  var x = event.clientX,
      y = event.clientY;
  var interactiveBorder = props.interactiveBorder,
      distance = props.distance;
  var exceedsTop = popperRect.top - y > (popperPlacement === 'top' ? interactiveBorder + distance : interactiveBorder);
  var exceedsBottom = y - popperRect.bottom > (popperPlacement === 'bottom' ? interactiveBorder + distance : interactiveBorder);
  var exceedsLeft = popperRect.left - x > (popperPlacement === 'left' ? interactiveBorder + distance : interactiveBorder);
  var exceedsRight = x - popperRect.right > (popperPlacement === 'right' ? interactiveBorder + distance : interactiveBorder);
  return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
}
/**
 * Returns the distance offset, taking into account the default offset due to
 * the transform: translate() rule (10px) in CSS
 */

function getOffsetDistanceInPx(distance) {
  return -(distance - 10) + 'px';
}

var isUsingTouch = false;
function onDocumentTouch() {
  if (isUsingTouch) {
    return;
  }

  isUsingTouch = true;

  if (isIOS) {
    document.body.classList.add(IOS_CLASS);
  }

  if (window.performance) {
    document.addEventListener('mousemove', onDocumentMouseMove);
  }
}
var lastMouseMoveTime = 0;
function onDocumentMouseMove() {
  var now = performance.now(); // Chrome 60+ is 1 mousemove per animation frame, use 20ms time difference

  if (now - lastMouseMoveTime < 20) {
    isUsingTouch = false;
    document.removeEventListener('mousemove', onDocumentMouseMove);

    if (!isIOS) {
      document.body.classList.remove(IOS_CLASS);
    }
  }

  lastMouseMoveTime = now;
}
function onDocumentClick(event) {
  // Simulated events dispatched on the document
  if (!(event.target instanceof Element)) {
    return hideAll();
  } // Clicked on an interactive popper


  var popper = closest(event.target, POPPER_SELECTOR);

  if (popper && popper._tippy && popper._tippy.props.interactive) {
    return;
  } // Clicked on a reference


  var reference = closestCallback(event.target, function (el) {
    return el._tippy && el._tippy.reference === el;
  });

  if (reference) {
    var instance = reference._tippy;

    if (instance) {
      var isClickTrigger = includes(instance.props.trigger || '', 'click');

      if (isUsingTouch || isClickTrigger) {
        return hideAll({
          exclude: instance,
          checkHideOnClick: true
        });
      }

      if (instance.props.hideOnClick !== true || isClickTrigger) {
        return;
      }

      instance.clearDelayTimeouts();
    }
  }

  hideAll({
    checkHideOnClick: true
  });
}
function onWindowBlur() {
  var _document = document,
      activeElement = _document.activeElement;

  if (activeElement && activeElement.blur && activeElement._tippy) {
    activeElement.blur();
  }
}
/**
 * Adds the needed global event listeners
 */

function bindGlobalEventListeners() {
  document.addEventListener('click', onDocumentClick, true);
  document.addEventListener('touchstart', onDocumentTouch, PASSIVE);
  window.addEventListener('blur', onWindowBlur);
}

var idCounter = 1;
/**
 * Creates and returns a Tippy object. We're using a closure pattern instead of
 * a class so that the exposed object API is clean without private members
 * prefixed with `_`.
 */

function createTippy(reference, collectionProps) {
  var props = evaluateProps(reference, collectionProps); // If the reference shouldn't have multiple tippys, return null early

  if (!props.multiple && reference._tippy) {
    return null;
  }
  /* ======================= 🔒 Private members 🔒 ======================= */


  var lastTriggerEventType;
  var lastMouseMoveEvent;
  var showTimeoutId;
  var hideTimeoutId;
  var animationFrameId;
  var isScheduledToShow = false;
  var currentParentNode;
  var previousPlacement;
  var wasVisibleDuringPreviousUpdate = false;
  var currentTransitionEndListener;
  var listeners = [];
  var debouncedOnMouseMove = props.interactiveDebounce > 0 ? debounce(onMouseMove, props.interactiveDebounce) : onMouseMove;
  /* ======================= 🔑 Public members 🔑 ======================= */

  var id = idCounter++;
  var popper = createPopperElement(id, props);
  var popperChildren = getChildren(popper);
  var popperInstance = null;
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id: id,
    reference: reference,
    popper: popper,
    popperChildren: popperChildren,
    popperInstance: popperInstance,
    props: props,
    state: state,
    // methods
    clearDelayTimeouts: clearDelayTimeouts,
    set: set,
    setContent: setContent$$1,
    show: show,
    hide: hide,
    enable: enable,
    disable: disable,
    destroy: destroy
    /* ==================== Initial instance mutations =================== */

  };
  reference._tippy = instance;
  popper._tippy = instance;
  addTriggersToReference();

  if (!props.lazy) {
    createPopperInstance();
    instance.popperInstance.disableEventListeners();
  }

  if (props.showOnInit) {
    scheduleShow();
  } // Ensure the reference element can receive focus (and is not a delegate)


  if (props.a11y && !props.target && !canReceiveFocus(reference)) {
    reference.setAttribute('tabindex', '0');
  } // Prevent a tippy with a delay from hiding if the cursor left then returned
  // before it started hiding


  popper.addEventListener('mouseenter', function (event) {
    if (instance.props.interactive && instance.state.isVisible && lastTriggerEventType === 'mouseenter') {
      scheduleShow(event);
    }
  });
  popper.addEventListener('mouseleave', function () {
    if (instance.props.interactive && lastTriggerEventType === 'mouseenter') {
      document.addEventListener('mousemove', debouncedOnMouseMove);
    }
  });
  return instance;
  /* ======================= 🔒 Private methods 🔒 ======================= */

  /**
   * Removes the follow cursor listener
   */

  function removeFollowCursorListener() {
    document.removeEventListener('mousemove', positionVirtualReferenceNearCursor);
  }
  /**
   * Cleans up old listeners
   */


  function cleanupOldMouseListeners() {
    document.body.removeEventListener('mouseleave', scheduleHide);
    document.removeEventListener('mousemove', debouncedOnMouseMove);
  }
  /**
   * Returns transitionable inner elements used in show/hide methods
   */


  function getTransitionableElements() {
    return [instance.popperChildren.tooltip, instance.popperChildren.backdrop, instance.popperChildren.content];
  }
  /**
   * Determines if the instance is in `followCursor` mode
   */


  function hasFollowCursorBehavior() {
    return instance.props.followCursor && !isUsingTouch && lastTriggerEventType !== 'focus';
  }
  /**
   * Updates the tooltip's position on each animation frame
   */


  function makeSticky() {
    setTransitionDuration([instance.popper], isIE ? 0 : instance.props.updateDuration);

    function updatePosition() {
      if (instance.popperInstance) {
        instance.popperInstance.scheduleUpdate();
      }

      if (instance.state.isMounted) {
        requestAnimationFrame(updatePosition);
      } else {
        setTransitionDuration([instance.popper], 0);
      }
    }

    updatePosition();
  }
  /**
   * Invokes a callback once the tooltip has fully transitioned out
   */


  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function () {
      if (!instance.state.isVisible && currentParentNode && currentParentNode.contains(instance.popper)) {
        callback();
      }
    });
  }
  /**
   * Invokes a callback once the tooltip has fully transitioned in
   */


  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }
  /**
   * Invokes a callback once the tooltip's CSS transition ends
   */


  function onTransitionEnd(duration, callback) {
    var tooltip = instance.popperChildren.tooltip;
    /**
     * Listener added as the `transitionend` handler
     */

    function listener(event) {
      if (event.target === tooltip) {
        updateTransitionEndListener(tooltip, 'remove', listener);
        callback();
      }
    } // Make callback synchronous if duration is 0
    // `transitionend` won't fire otherwise


    if (duration === 0) {
      return callback();
    }

    updateTransitionEndListener(tooltip, 'remove', currentTransitionEndListener);
    updateTransitionEndListener(tooltip, 'add', listener);
    currentTransitionEndListener = listener;
  }
  /**
   * Adds an event listener to the reference and stores it in `listeners`
   */


  function on(eventType, handler) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    instance.reference.addEventListener(eventType, handler, options);
    listeners.push({
      eventType: eventType,
      handler: handler,
      options: options
    });
  }
  /**
   * Adds event listeners to the reference based on the `trigger` prop
   */


  function addTriggersToReference() {
    if (instance.props.touchHold && !instance.props.target) {
      on('touchstart', onTrigger, PASSIVE);
      on('touchend', onMouseLeave, PASSIVE);
    }

    instance.props.trigger.trim().split(' ').forEach(function (eventType) {
      if (eventType === 'manual') {
        return;
      } // Non-delegates


      if (!instance.props.target) {
        on(eventType, onTrigger);

        switch (eventType) {
          case 'mouseenter':
            on('mouseleave', onMouseLeave);
            break;

          case 'focus':
            on(isIE ? 'focusout' : 'blur', onBlur);
            break;
        }
      } else {
        // Delegates
        switch (eventType) {
          case 'mouseenter':
            on('mouseover', onDelegateShow);
            on('mouseout', onDelegateHide);
            break;

          case 'focus':
            on('focusin', onDelegateShow);
            on('focusout', onDelegateHide);
            break;

          case 'click':
            on(eventType, onDelegateShow);
            break;
        }
      }
    });
  }
  /**
   * Removes event listeners from the reference
   */


  function removeTriggersFromReference() {
    listeners.forEach(function (_ref) {
      var eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      instance.reference.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }
  /**
   * Positions the virtual reference near the cursor
   */


  function positionVirtualReferenceNearCursor(event) {
    var _lastMouseMoveEvent = lastMouseMoveEvent = event,
        clientX = _lastMouseMoveEvent.clientX,
        clientY = _lastMouseMoveEvent.clientY;

    if (!instance.popperInstance) {
      return;
    } // Ensure virtual reference is padded to prevent tooltip from
    // overflowing. Maybe Popper.js issue?


    var placement = getBasicPlacement(instance.popper);
    var padding = instance.props.arrow ? PADDING + (instance.props.arrowType === 'round' ? 18 : 16) : PADDING;
    var isVerticalPlacement = includes(['top', 'bottom'], placement);
    var isHorizontalPlacement = includes(['left', 'right'], placement); // Top / left boundary

    var x = isVerticalPlacement ? Math.max(padding, clientX) : clientX;
    var y = isHorizontalPlacement ? Math.max(padding, clientY) : clientY; // Bottom / right boundary

    if (isVerticalPlacement && x > padding) {
      x = Math.min(clientX, window.innerWidth - padding);
    }

    if (isHorizontalPlacement && y > padding) {
      y = Math.min(clientY, window.innerHeight - padding);
    }

    var rect = instance.reference.getBoundingClientRect();
    var followCursor = instance.props.followCursor;
    var isHorizontal = followCursor === 'horizontal';
    var isVertical = followCursor === 'vertical';
    instance.popperInstance.reference = _extends({}, instance.popperInstance.reference, {
      getBoundingClientRect: function getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          top: isHorizontal ? rect.top : y,
          bottom: isHorizontal ? rect.bottom : y,
          left: isVertical ? rect.left : x,
          right: isVertical ? rect.right : x
        };
      },
      clientWidth: 0,
      clientHeight: 0
    });
    instance.popperInstance.scheduleUpdate();

    if (followCursor === 'initial' && instance.state.isVisible) {
      removeFollowCursorListener();
    }
  }
  /**
   * Creates the tippy instance for a delegate when it's been triggered
   */


  function createDelegateChildTippy(event) {
    if (event) {
      var targetEl = closest(event.target, instance.props.target);

      if (targetEl && !targetEl._tippy) {
        createTippy(targetEl, _extends({}, instance.props, {
          content: evaluateValue(collectionProps.content, [targetEl]),
          appendTo: collectionProps.appendTo,
          target: '',
          showOnInit: true
        }));
        scheduleShow(event);
      }
    }
  }
  /**
   * Event listener invoked upon trigger
   */


  function onTrigger(event) {
    if (!instance.state.isEnabled || isEventListenerStopped(event)) {
      return;
    }

    if (!instance.state.isVisible) {
      lastTriggerEventType = event.type;

      if (event instanceof MouseEvent) {
        lastMouseMoveEvent = event;
      }
    } // Toggle show/hide when clicking click-triggered tooltips


    if (event.type === 'click' && instance.props.hideOnClick !== false && instance.state.isVisible) {
      scheduleHide();
    } else {
      scheduleShow(event);
    }
  }
  /**
   * Event listener used for interactive tooltips to detect when they should
   * hide
   */


  function onMouseMove(event) {
    var referenceTheCursorIsOver = closestCallback(event.target, function (el) {
      return el._tippy;
    });
    var isCursorOverPopper = closest(event.target, POPPER_SELECTOR) === instance.popper;
    var isCursorOverReference = referenceTheCursorIsOver === instance.reference;

    if (isCursorOverPopper || isCursorOverReference) {
      return;
    }

    if (isCursorOutsideInteractiveBorder(getBasicPlacement(instance.popper), instance.popper.getBoundingClientRect(), event, instance.props)) {
      cleanupOldMouseListeners();
      scheduleHide();
    }
  }
  /**
   * Event listener invoked upon mouseleave
   */


  function onMouseLeave(event) {
    if (isEventListenerStopped(event)) {
      return;
    }

    if (instance.props.interactive) {
      document.body.addEventListener('mouseleave', scheduleHide);
      document.addEventListener('mousemove', debouncedOnMouseMove);
      return;
    }

    scheduleHide();
  }
  /**
   * Event listener invoked upon blur
   */


  function onBlur(event) {
    if (event.target !== instance.reference) {
      return;
    }

    if (instance.props.interactive && event.relatedTarget && instance.popper.contains(event.relatedTarget)) {
      return;
    }

    scheduleHide();
  }
  /**
   * Event listener invoked when a child target is triggered
   */


  function onDelegateShow(event) {
    if (closest(event.target, instance.props.target)) {
      scheduleShow(event);
    }
  }
  /**
   * Event listener invoked when a child target should hide
   */


  function onDelegateHide(event) {
    if (closest(event.target, instance.props.target)) {
      scheduleHide();
    }
  }
  /**
   * Determines if an event listener should stop further execution due to the
   * `touchHold` option
   */


  function isEventListenerStopped(event) {
    var supportsTouch = 'ontouchstart' in window;
    var isTouchEvent = includes(event.type, 'touch');
    var touchHold = instance.props.touchHold;
    return supportsTouch && isUsingTouch && touchHold && !isTouchEvent || isUsingTouch && !touchHold && isTouchEvent;
  }
  /**
   * Creates the popper instance for the instance
   */


  function createPopperInstance() {
    var popperOptions = instance.props.popperOptions;
    var _instance$popperChild = instance.popperChildren,
        tooltip = _instance$popperChild.tooltip,
        arrow = _instance$popperChild.arrow;
    var preventOverflowModifier = getModifier(popperOptions, 'preventOverflow');

    function applyMutations(data) {
      if (instance.props.flip && !instance.props.flipOnUpdate) {
        if (data.flipped) {
          instance.popperInstance.options.placement = data.placement;
        }

        setFlipModifierEnabled(instance.popperInstance.modifiers, false);
      } // Apply all of the popper's attributes to the tootip node as well.
      // Allows users to avoid using the .tippy-popper selector for themes.


      tooltip.setAttribute(PLACEMENT_ATTRIBUTE, data.placement);

      if (data.attributes[OUT_OF_BOUNDARIES_ATTRIBUTE] !== false) {
        tooltip.setAttribute(OUT_OF_BOUNDARIES_ATTRIBUTE, '');
      } else {
        tooltip.removeAttribute(OUT_OF_BOUNDARIES_ATTRIBUTE);
      } // Prevents a transition when changing placements (while tippy is visible)
      // for scroll/resize updates


      if (previousPlacement && previousPlacement !== data.placement && wasVisibleDuringPreviousUpdate) {
        tooltip.style.transition = 'none';
        requestAnimationFrame(function () {
          tooltip.style.transition = '';
        });
      }

      previousPlacement = data.placement;
      wasVisibleDuringPreviousUpdate = instance.state.isVisible;
      var basicPlacement = getBasicPlacement(instance.popper);
      var styles = tooltip.style; // Account for the `distance` offset

      styles.top = styles.bottom = styles.left = styles.right = '';
      styles[basicPlacement] = getOffsetDistanceInPx(instance.props.distance);
      var padding = preventOverflowModifier && preventOverflowModifier.padding !== undefined ? preventOverflowModifier.padding : PADDING;
      var isPaddingNumber = typeof padding === 'number';

      var computedPadding = _extends({
        top: isPaddingNumber ? padding : padding.top,
        bottom: isPaddingNumber ? padding : padding.bottom,
        left: isPaddingNumber ? padding : padding.left,
        right: isPaddingNumber ? padding : padding.right
      }, !isPaddingNumber && padding);

      computedPadding[basicPlacement] = isPaddingNumber ? padding + instance.props.distance : (padding[basicPlacement] || 0) + instance.props.distance;
      instance.popperInstance.modifiers.filter(function (m) {
        return m.name === 'preventOverflow';
      })[0].padding = computedPadding;
    }

    var config = _extends({
      placement: instance.props.placement
    }, popperOptions, {
      modifiers: _extends({}, popperOptions ? popperOptions.modifiers : {}, {
        preventOverflow: _extends({
          boundariesElement: instance.props.boundary,
          padding: PADDING
        }, preventOverflowModifier),
        arrow: _extends({
          element: arrow,
          enabled: !!arrow
        }, getModifier(popperOptions, 'arrow')),
        flip: _extends({
          enabled: instance.props.flip,
          // The tooltip is offset by 10px from the popper in CSS,
          // we need to account for its distance
          padding: instance.props.distance + PADDING,
          behavior: instance.props.flipBehavior
        }, getModifier(popperOptions, 'flip')),
        offset: _extends({
          offset: instance.props.offset
        }, getModifier(popperOptions, 'offset'))
      }),
      // This gets invoked when calling `.set()` and updating a popper
      // instance dependency, since a new popper instance gets created
      onCreate: function onCreate(data) {
        applyMutations(data);

        if (popperOptions && popperOptions.onCreate) {
          popperOptions.onCreate(data);
        }
      },
      // This gets invoked on initial create and show()/scroll/resize update.
      // This is due to `afterPopperPositionUpdates` overwriting onCreate()
      // with onUpdate()
      onUpdate: function onUpdate(data) {
        applyMutations(data);

        if (popperOptions && popperOptions.onUpdate) {
          popperOptions.onUpdate(data);
        }
      }
    });

    instance.popperInstance = new __WEBPACK_IMPORTED_MODULE_0_popper_js__["a" /* default */](instance.reference, instance.popper, config);
  }
  /**
   * Mounts the tooltip to the DOM, callback to show tooltip is run **after**
   * popper's position has updated
   */


  function mount(callback) {
    var shouldEnableListeners = !hasFollowCursorBehavior() && !(instance.props.followCursor === 'initial' && isUsingTouch);

    if (!instance.popperInstance) {
      createPopperInstance();

      if (!shouldEnableListeners) {
        instance.popperInstance.disableEventListeners();
      }
    } else {
      if (!hasFollowCursorBehavior()) {
        instance.popperInstance.scheduleUpdate();

        if (shouldEnableListeners) {
          instance.popperInstance.enableEventListeners();
        }
      }

      setFlipModifierEnabled(instance.popperInstance.modifiers, instance.props.flip);
    } // If the instance previously had followCursor behavior, it will be
    // positioned incorrectly if triggered by `focus` afterwards.
    // Update the reference back to the real DOM element


    instance.popperInstance.reference = instance.reference;
    var arrow = instance.popperChildren.arrow;

    if (hasFollowCursorBehavior()) {
      if (arrow) {
        arrow.style.margin = '0';
      }

      if (lastMouseMoveEvent) {
        positionVirtualReferenceNearCursor(lastMouseMoveEvent);
      }
    } else if (arrow) {
      arrow.style.margin = '';
    } // Allow followCursor: 'initial' on touch devices


    if (isUsingTouch && lastMouseMoveEvent && instance.props.followCursor === 'initial') {
      positionVirtualReferenceNearCursor(lastMouseMoveEvent);

      if (arrow) {
        arrow.style.margin = '0';
      }
    }

    afterPopperPositionUpdates(instance.popperInstance, callback);
    var appendTo = instance.props.appendTo;
    currentParentNode = appendTo === 'parent' ? instance.reference.parentNode : evaluateValue(appendTo, [instance.reference]);

    if (!currentParentNode.contains(instance.popper)) {
      currentParentNode.appendChild(instance.popper);
      instance.props.onMount(instance);
      instance.state.isMounted = true;
    }
  }
  /**
   * Setup before show() is invoked (delays, etc.)
   */


  function scheduleShow(event) {
    clearDelayTimeouts();

    if (instance.state.isVisible) {
      return;
    } // Is a delegate, create an instance for the child target


    if (instance.props.target) {
      return createDelegateChildTippy(event);
    }

    isScheduledToShow = true;

    if (instance.props.wait) {
      return instance.props.wait(instance, event);
    } // If the tooltip has a delay, we need to be listening to the mousemove as
    // soon as the trigger event is fired, so that it's in the correct position
    // upon mount.
    // Edge case: if the tooltip is still mounted, but then scheduleShow() is
    // called, it causes a jump.


    if (hasFollowCursorBehavior() && !instance.state.isMounted) {
      document.addEventListener('mousemove', positionVirtualReferenceNearCursor);
    }

    var delay = getValue(instance.props.delay, 0, defaultProps.delay);

    if (delay) {
      showTimeoutId = setTimeout(function () {
        show();
      }, delay);
    } else {
      show();
    }
  }
  /**
   * Setup before hide() is invoked (delays, etc.)
   */


  function scheduleHide() {
    clearDelayTimeouts();

    if (!instance.state.isVisible) {
      return removeFollowCursorListener();
    }

    isScheduledToShow = false;
    var delay = getValue(instance.props.delay, 1, defaultProps.delay);

    if (delay) {
      hideTimeoutId = setTimeout(function () {
        if (instance.state.isVisible) {
          hide();
        }
      }, delay);
    } else {
      // Fixes a `transitionend` problem when it fires 1 frame too
      // late sometimes, we don't want hide() to be called.
      animationFrameId = requestAnimationFrame(function () {
        hide();
      });
    }
  }
  /* ======================= 🔑 Public methods 🔑 ======================= */

  /**
   * Enables the instance to allow it to show or hide
   */


  function enable() {
    instance.state.isEnabled = true;
  }
  /**
   * Disables the instance to disallow it to show or hide
   */


  function disable() {
    instance.state.isEnabled = false;
  }
  /**
   * Clears pending timeouts related to the `delay` prop if any
   */


  function clearDelayTimeouts() {
    clearTimeout(showTimeoutId);
    clearTimeout(hideTimeoutId);
    cancelAnimationFrame(animationFrameId);
  }
  /**
   * Sets new props for the instance and redraws the tooltip
   */


  function set(options) {
    // Backwards-compatible after TypeScript change
    options = options || {};
    validateOptions(options, defaultProps);
    var prevProps = instance.props;
    var nextProps = evaluateProps(instance.reference, _extends({}, instance.props, options, {
      ignoreAttributes: true
    }));
    nextProps.ignoreAttributes = hasOwnProperty(options, 'ignoreAttributes') ? options.ignoreAttributes || false : prevProps.ignoreAttributes;
    instance.props = nextProps;

    if (hasOwnProperty(options, 'trigger') || hasOwnProperty(options, 'touchHold')) {
      removeTriggersFromReference();
      addTriggersToReference();
    }

    if (hasOwnProperty(options, 'interactiveDebounce')) {
      cleanupOldMouseListeners();
      debouncedOnMouseMove = debounce(onMouseMove, options.interactiveDebounce || 0);
    }

    updatePopperElement(instance.popper, prevProps, nextProps);
    instance.popperChildren = getChildren(instance.popper);

    if (instance.popperInstance) {
      instance.popperInstance.update();

      if (POPPER_INSTANCE_DEPENDENCIES.some(function (prop) {
        return hasOwnProperty(options, prop) && options[prop] !== prevProps[prop];
      })) {
        instance.popperInstance.destroy();
        createPopperInstance();

        if (!instance.state.isVisible) {
          instance.popperInstance.disableEventListeners();
        }

        if (instance.props.followCursor && lastMouseMoveEvent) {
          positionVirtualReferenceNearCursor(lastMouseMoveEvent);
        }
      }
    }
  }
  /**
   * Shortcut for .set({ content: newContent })
   */


  function setContent$$1(content) {
    set({
      content: content
    });
  }
  /**
   * Shows the tooltip
   */


  function show() {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getValue(instance.props.duration, 0, defaultProps.duration[1]);

    if (instance.state.isDestroyed || !instance.state.isEnabled || isUsingTouch && !instance.props.touch) {
      return;
    } // Standardize `disabled` behavior across browsers.
    // Firefox allows events on disabled elements, but Chrome doesn't.
    // Using a wrapper element (i.e. <span>) is recommended.


    if (instance.reference.hasAttribute('disabled')) {
      return;
    }

    if (instance.props.onShow(instance) === false) {
      return;
    }

    instance.popper.style.visibility = 'visible';
    instance.state.isVisible = true;

    if (instance.props.interactive) {
      instance.reference.classList.add(ACTIVE_CLASS);
    }

    var transitionableElements = getTransitionableElements(); // Prevent a transition if the popper is at the opposite placement

    setTransitionDuration(transitionableElements.concat(instance.popper), 0);
    mount(function () {
      if (!instance.state.isVisible) {
        return;
      } // Double update will apply correct mutations


      if (!hasFollowCursorBehavior()) {
        instance.popperInstance.update();
      }

      if (instance.popperChildren.backdrop) {
        instance.popperChildren.content.style.transitionDelay = Math.round(duration / 12) + 'ms';
      }

      if (instance.props.sticky) {
        makeSticky();
      }

      setTransitionDuration([instance.popper], props.updateDuration);
      setTransitionDuration(transitionableElements, duration);
      setVisibilityState(transitionableElements, 'visible');
      onTransitionedIn(duration, function () {
        if (instance.props.aria) {
          instance.reference.setAttribute("aria-".concat(instance.props.aria), instance.popper.id);
        }

        instance.props.onShown(instance);
        instance.state.isShown = true;
      });
    });
  }
  /**
   * Hides the tooltip
   */


  function hide() {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getValue(instance.props.duration, 1, defaultProps.duration[1]);

    if (instance.state.isDestroyed || !instance.state.isEnabled) {
      return;
    }

    if (instance.props.onHide(instance) === false) {
      return;
    }

    instance.popper.style.visibility = 'hidden';
    instance.state.isVisible = false;
    instance.state.isShown = false;
    wasVisibleDuringPreviousUpdate = false;

    if (instance.props.interactive) {
      instance.reference.classList.remove(ACTIVE_CLASS);
    }

    var transitionableElements = getTransitionableElements();
    setTransitionDuration(transitionableElements, duration);
    setVisibilityState(transitionableElements, 'hidden');
    onTransitionedOut(duration, function () {
      if (!isScheduledToShow) {
        removeFollowCursorListener();
      }

      if (instance.props.aria) {
        instance.reference.removeAttribute("aria-".concat(instance.props.aria));
      }

      instance.popperInstance.disableEventListeners();
      instance.popperInstance.options.placement = instance.props.placement;
      currentParentNode.removeChild(instance.popper);
      instance.props.onHidden(instance);
      instance.state.isMounted = false;
    });
  }
  /**
   * Destroys the tooltip
   */


  function destroy(destroyTargetInstances) {
    if (instance.state.isDestroyed) {
      return;
    } // If the popper is currently mounted to the DOM, we want to ensure it gets
    // hidden and unmounted instantly upon destruction


    if (instance.state.isMounted) {
      hide(0);
    }

    removeTriggersFromReference();
    delete instance.reference._tippy;

    if (instance.props.target && destroyTargetInstances) {
      arrayFrom(instance.reference.querySelectorAll(instance.props.target)).forEach(function (child) {
        if (child._tippy) {
          child._tippy.destroy();
        }
      });
    }

    if (instance.popperInstance) {
      instance.popperInstance.destroy();
    }

    instance.state.isDestroyed = true;
  }
}

/**
 * Groups an array of instances by taking control of their props during
 * certain lifecycles.
 */

function group(instances) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$delay = _ref.delay,
      delay = _ref$delay === void 0 ? instances[0].props.delay : _ref$delay,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 0 : _ref$duration;

  // Already grouped. Cannot group instances more than once (yet) or stale lifecycle
  // closures will be invoked, causing a stack overflow
  if (instances.some(function (instance) {
    return hasOwnProperty(instance, '_originalProps');
  })) {
    return;
  }

  var isAnyTippyOpen = false;
  instances.forEach(function (instance) {
    instance._originalProps = _extends({}, instance.props);
  });

  function setIsAnyTippyOpen(value) {
    isAnyTippyOpen = value;
    updateInstances();
  }

  function onShow(instance) {
    instance._originalProps.onShow(instance);

    instances.forEach(function (instance) {
      instance.set({
        duration: duration
      });
      instance.hide();
    });
    setIsAnyTippyOpen(true);
  }

  function onHide(instance) {
    instance._originalProps.onHide(instance);

    setIsAnyTippyOpen(false);
  }

  function onShown(instance) {
    instance._originalProps.onShown(instance);

    instance.set({
      duration: instance._originalProps.duration
    });
  }

  function updateInstances() {
    instances.forEach(function (instance) {
      instance.set({
        onShow: onShow,
        onShown: onShown,
        onHide: onHide,
        delay: isAnyTippyOpen ? [0, Array.isArray(delay) ? delay[1] : delay] : delay,
        duration: isAnyTippyOpen ? duration : instance._originalProps.duration
      });
    });
  }

  updateInstances();
}

var globalEventListenersBound = false;
/**
 * Exported module
 */

function tippy(targets, options) {
  validateOptions(options || {}, defaultProps);

  if (!globalEventListenersBound) {
    bindGlobalEventListeners();
    globalEventListenersBound = true;
  }

  var props = _extends({}, defaultProps, options); // If they are specifying a virtual positioning reference, we need to polyfill
  // some native DOM props


  if (isBareVirtualElement(targets)) {
    polyfillElementPrototypeProperties(targets);
  }

  var instances = getArrayOfElements(targets).reduce(function (acc, reference) {
    var instance = reference && createTippy(reference, props);

    if (instance) {
      acc.push(instance);
    }

    return acc;
  }, []);
  return isSingular(targets) ? instances[0] : instances;
}
/**
 * Static props
 */


tippy.version = version;
tippy.defaults = defaultProps;
/**
 * Static methods
 */

tippy.setDefaults = function (partialDefaults) {
  Object.keys(partialDefaults).forEach(function (key) {
    // @ts-ignore
    defaultProps[key] = partialDefaults[key];
  });
};

tippy.hideAll = hideAll;
tippy.group = group;
/**
 * Auto-init tooltips for elements with a `data-tippy="..."` attribute
 */

function autoInit() {
  arrayFrom(document.querySelectorAll('[data-tippy]')).forEach(function (el) {
    var content = el.getAttribute('data-tippy');

    if (content) {
      tippy(el, {
        content: content
      });
    }
  });
}

if (isBrowser) {
  setTimeout(autoInit);
}

/* harmony default export */ __webpack_exports__["a"] = tippy;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendarControls_vue__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fbf1812_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendarControls_vue__ = __webpack_require__(170);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(122)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendarControls_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fbf1812_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendarControls_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCalendarControls.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCalendarControls.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6fbf1812", Component.options)
  } else {
    hotAPI.reload("data-v-6fbf1812", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendarMonth_vue__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e023bc58_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendarMonth_vue__ = __webpack_require__(186);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(138)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendarMonth_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e023bc58_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendarMonth_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCalendarMonth.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCalendarMonth.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e023bc58", Component.options)
  } else {
    hotAPI.reload("data-v-e023bc58", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_modality__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_modality___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__helpers_modality__);


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_deepmerge__ = __webpack_require__(96);
/* harmony export (immutable) */ __webpack_exports__["a"] = configure;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



function configure(Component, props) {
    Object.keys(props).forEach(function (propName) {
        if (Component.props[propName] === undefined) {
            return;
        }

        var defaultValue = Component.props[propName].default;

        if ((typeof defaultValue === 'undefined' ? 'undefined' : _typeof(defaultValue)) === 'object') {
            Component.props[propName].default = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_deepmerge__["a" /* default */])(defaultValue, props[propName]);
            return;
        }

        Component.props[propName].default = props[propName];
    });
}

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiAlert_vue__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0dfa6b64_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiAlert_vue__ = __webpack_require__(147);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(99)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiAlert_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0dfa6b64_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiAlert_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiAlert.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiAlert.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0dfa6b64", Component.options)
  } else {
    hotAPI.reload("data-v-0dfa6b64", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiAutocomplete_vue__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ede18e6_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiAutocomplete_vue__ = __webpack_require__(176);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(128)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiAutocomplete_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ede18e6_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiAutocomplete_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiAutocomplete.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiAutocomplete.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ede18e6", Component.options)
  } else {
    hotAPI.reload("data-v-7ede18e6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendar_vue__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10feac3c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendar_vue__ = __webpack_require__(149);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(101)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10feac3c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCalendar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCalendar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-10feac3c", Component.options)
  } else {
    hotAPI.reload("data-v-10feac3c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCheckboxGroup_vue__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7a92836e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCheckboxGroup_vue__ = __webpack_require__(173);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(125)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCheckboxGroup_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7a92836e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCheckboxGroup_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCheckboxGroup.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCheckboxGroup.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7a92836e", Component.options)
  } else {
    hotAPI.reload("data-v-7a92836e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCollapsible_vue__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca040308_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCollapsible_vue__ = __webpack_require__(185);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(137)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCollapsible_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca040308_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCollapsible_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCollapsible.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCollapsible.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca040308", Component.options)
  } else {
    hotAPI.reload("data-v-ca040308", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiConfirm_vue__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4f7f2732_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiConfirm_vue__ = __webpack_require__(160);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(112)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiConfirm_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4f7f2732_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiConfirm_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiConfirm.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiConfirm.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4f7f2732", Component.options)
  } else {
    hotAPI.reload("data-v-4f7f2732", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiDatepicker_vue__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_74517e3a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiDatepicker_vue__ = __webpack_require__(171);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(123)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiDatepicker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_74517e3a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiDatepicker_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiDatepicker.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiDatepicker.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-74517e3a", Component.options)
  } else {
    hotAPI.reload("data-v-74517e3a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiFab_vue__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4a69660e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiFab_vue__ = __webpack_require__(159);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(111)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiFab_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4a69660e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiFab_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiFab.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiFab.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4a69660e", Component.options)
  } else {
    hotAPI.reload("data-v-4a69660e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiFileupload_vue__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_965da30a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiFileupload_vue__ = __webpack_require__(178);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(130)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiFileupload_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_965da30a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiFileupload_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiFileupload.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiFileupload.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-965da30a", Component.options)
  } else {
    hotAPI.reload("data-v-965da30a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiMenu_vue__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_41a170dd_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiMenu_vue__ = __webpack_require__(157);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(109)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiMenu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_41a170dd_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiMenu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiMenu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiMenu.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-41a170dd", Component.options)
  } else {
    hotAPI.reload("data-v-41a170dd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiPreloader_vue__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_32cd8368_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiPreloader_vue__ = __webpack_require__(154);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(106)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiPreloader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_32cd8368_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiPreloader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiPreloader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiPreloader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-32cd8368", Component.options)
  } else {
    hotAPI.reload("data-v-32cd8368", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiRadioGroup_vue__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0686b3c2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiRadioGroup_vue__ = __webpack_require__(145);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(97)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiRadioGroup_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0686b3c2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiRadioGroup_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiRadioGroup.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiRadioGroup.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0686b3c2", Component.options)
  } else {
    hotAPI.reload("data-v-0686b3c2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSelect_vue__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_54cff87a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSelect_vue__ = __webpack_require__(162);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(114)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSelect_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_54cff87a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSelect_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiSelect.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiSelect.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-54cff87a", Component.options)
  } else {
    hotAPI.reload("data-v-54cff87a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSlider_vue__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d1a7c42_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSlider_vue__ = __webpack_require__(146);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(98)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSlider_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d1a7c42_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSlider_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiSlider.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiSlider.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0d1a7c42", Component.options)
  } else {
    hotAPI.reload("data-v-0d1a7c42", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSnackbarContainer_vue__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0e0792ee_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSnackbarContainer_vue__ = __webpack_require__(148);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(100)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSnackbarContainer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0e0792ee_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSnackbarContainer_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiSnackbarContainer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiSnackbarContainer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0e0792ee", Component.options)
  } else {
    hotAPI.reload("data-v-0e0792ee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSwitch_vue__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ba5ec29c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSwitch_vue__ = __webpack_require__(184);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(136)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSwitch_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ba5ec29c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSwitch_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiSwitch.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiSwitch.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ba5ec29c", Component.options)
  } else {
    hotAPI.reload("data-v-ba5ec29c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTab_vue__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_813aeaf2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTab_vue__ = __webpack_require__(177);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(129)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTab_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_813aeaf2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTab_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiTab.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiTab.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-813aeaf2", Component.options)
  } else {
    hotAPI.reload("data-v-813aeaf2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTabs_vue__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_309a677c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTabs_vue__ = __webpack_require__(153);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(105)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTabs_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_309a677c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTabs_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiTabs.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiTabs.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-309a677c", Component.options)
  } else {
    hotAPI.reload("data-v-309a677c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTextbox_vue__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ac038220_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTextbox_vue__ = __webpack_require__(181);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(133)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTextbox_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ac038220_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTextbox_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiTextbox.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiTextbox.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ac038220", Component.options)
  } else {
    hotAPI.reload("data-v-ac038220", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiToolbar_vue__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b19a1326_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiToolbar_vue__ = __webpack_require__(182);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(134)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiToolbar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b19a1326_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiToolbar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiToolbar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiToolbar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b19a1326", Component.options)
  } else {
    hotAPI.reload("data-v-b19a1326", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Autosize 3.0.20
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.autosize = mod.exports;
	}
})(this, function (exports, module) {
	'use strict';

	var map = typeof Map === "function" ? new Map() : (function () {
		var keys = [];
		var values = [];

		return {
			has: function has(key) {
				return keys.indexOf(key) > -1;
			},
			get: function get(key) {
				return values[keys.indexOf(key)];
			},
			set: function set(key, value) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					values.push(value);
				}
			},
			'delete': function _delete(key) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
					values.splice(index, 1);
				}
			}
		};
	})();

	var createEvent = function createEvent(name) {
		return new Event(name, { bubbles: true });
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function (name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

		var heightOffset = null;
		var clientWidth = ta.clientWidth;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop
					});
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			var originalHeight = ta.style.height;
			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = 'auto';

			var endHeight = ta.scrollHeight + heightOffset;

			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				ta.style.height = originalHeight;
				return;
			}

			ta.style.height = endHeight + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var styleHeight = Math.round(parseFloat(ta.style.height));
			var computed = window.getComputedStyle(ta, null);
			var actualHeight = Math.round(parseFloat(computed.height));

			// The actual height not matching the style height (set via the resize method) indicates that
			// the max-height has been exceeded, in which case the overflow should be set to visible.
			if (actualHeight !== styleHeight) {
				if (computed.overflowY !== 'visible') {
					changeOverflow('visible');
					resize();
					actualHeight = Math.round(parseFloat(window.getComputedStyle(ta, null).height));
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
					resize();
					actualHeight = Math.round(parseFloat(window.getComputedStyle(ta, null).height));
				}
			}

			if (cachedHeight !== actualHeight) {
				cachedHeight = actualHeight;
				var evt = createEvent('autosize:resized');
				try {
					ta.dispatchEvent(evt);
				} catch (err) {
					// Firefox will throw an error on dispatchEvent for a detached element
					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
				}
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = (function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});

			map['delete'](ta);
		}).bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap
		});

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		map.set(ta, {
			destroy: destroy,
			update: update
		});

		init();
	}

	function destroy(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.destroy();
		}
	}

	function update(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.update();
		}
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function (el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function (el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	module.exports = autosize;
});

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiCloseButton_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiIcon_vue__ = __webpack_require__(1);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-alert',

    props: {
        type: {
            type: String,
            default: 'info' },
        removeIcon: {
            type: Boolean,
            default: false
        },
        disableAnimation: {
            type: Boolean,
            default: false
        },
        dismissible: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-alert--type-' + this.type, { 'has-no-transition': this.disableAnimation }];
        }
    },

    methods: {
        dismissAlert: function dismissAlert() {
            this.$emit('dismiss');
        }
    },

    components: {
        UiCloseButton: __WEBPACK_IMPORTED_MODULE_0__UiCloseButton_vue__["a" /* default */],
        UiIcon: __WEBPACK_IMPORTED_MODULE_1__UiIcon_vue__["a" /* default */]
    }
};

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directives_autofocus__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiAutocompleteSuggestion_vue__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_fuzzysearch__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_fuzzysearch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_fuzzysearch__);








/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-autocomplete',

    props: {
        name: String,
        placeholder: String,
        tabindex: [String, Number],
        value: {
            type: [String, Number],
            default: ''
        },
        icon: String,
        iconPosition: {
            type: String,
            default: 'left' },
        label: String,
        floatingLabel: {
            type: Boolean,
            default: false
        },
        help: String,
        error: String,
        readonly: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'simple' },
        suggestions: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        limit: {
            type: Number,
            default: 8
        },
        append: {
            type: Boolean,
            default: false
        },
        appendDelimiter: {
            type: String,
            default: ', '
        },
        minChars: {
            type: Number,
            default: 2
        },
        showOnUpDown: {
            type: Boolean,
            default: true
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        filter: Function,
        sort: Function,
        highlightOnFirstMatch: {
            type: Boolean,
            default: true
        },
        cycleHighlight: {
            type: Boolean,
            default: true
        },
        keys: {
            type: Object,
            default: function _default() {
                return {
                    label: 'label',
                    value: 'value',
                    image: 'image'
                };
            }
        },
        invalid: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            initialValue: this.value,
            isActive: false,
            isTouched: false,
            showDropdown: false,
            highlightedIndex: -1
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-autocomplete--type-' + this.type, 'ui-autocomplete--icon-position-' + this.iconPosition, { 'is-active': this.isActive }, { 'is-invalid': this.invalid }, { 'is-touched': this.isTouched }, { 'is-disabled': this.disabled }, { 'has-label': this.hasLabel }, { 'has-floating-label': this.hasFloatingLabel }];
        },
        labelClasses: function labelClasses() {
            return {
                'is-inline': this.hasFloatingLabel && this.isLabelInline,
                'is-floating': this.hasFloatingLabel && !this.isLabelInline
            };
        },
        hasLabel: function hasLabel() {
            return Boolean(this.label) || Boolean(this.$slots.default);
        },
        hasFloatingLabel: function hasFloatingLabel() {
            return this.hasLabel && this.floatingLabel;
        },
        isLabelInline: function isLabelInline() {
            return this.valueLength === 0 && !this.isActive;
        },
        valueLength: function valueLength() {
            return this.value ? this.value.length : 0;
        },
        hasFeedback: function hasFeedback() {
            return this.showError || this.showHelp;
        },
        showError: function showError() {
            return this.invalid && (Boolean(this.error) || Boolean(this.$slots.error));
        },
        showHelp: function showHelp() {
            return Boolean(this.help) || Boolean(this.$slots.help);
        },
        matchingSuggestions: function matchingSuggestions() {
            var _this = this;

            var suggestions = this.suggestions.filter(function (suggestion) {
                if (_this.filter) {
                    return _this.filter(suggestion, _this.value, _this.defaultFilter);
                }

                var query = _this.value === null ? '' : _this.value;

                return _this.defaultFilter(suggestion, query);
            });

            if (this.sort) {
                suggestions.sort(this.sort.bind(this));
            }

            return suggestions.slice(0, this.limit);
        }
    },

    watch: {
        value: function value() {
            if (this.isActive && this.valueLength >= this.minChars) {
                this.openDropdown();
            }

            this.highlightedIndex = this.highlightOnFirstMatch ? 0 : -1;
        }
    },

    created: function created() {
        if (this.value === null) {
            this.initialValue = '';
            this.updateValue('');
        }
    },
    mounted: function mounted() {
        document.addEventListener('click', this.onExternalClick);
    },
    beforeDestroy: function beforeDestroy() {
        document.removeEventListener('click', this.onExternalClick);
    },


    methods: {
        defaultFilter: function defaultFilter(suggestion, query) {
            var text = suggestion[this.keys.label] || suggestion;

            if (typeof query === 'string') {
                query = query.toLowerCase();
            }

            return __WEBPACK_IMPORTED_MODULE_3_fuzzysearch___default()(query, text.toLowerCase());
        },
        selectSuggestion: function selectSuggestion(suggestion) {
            var _this2 = this;

            var value = void 0;

            if (this.append) {
                value += this.appendDelimiter + (suggestion[this.keys.value] || suggestion);
            } else {
                value = suggestion[this.keys.value] || suggestion;
            }

            this.updateValue(value);
            this.$emit('select', suggestion);

            this.$nextTick(function () {
                _this2.closeDropdown();
                _this2.$refs.input.focus();
            });
        },
        highlightSuggestion: function highlightSuggestion(index) {
            var firstIndex = 0;
            var lastIndex = this.$refs.suggestions.length - 1;

            if (index === -2) {
                index = lastIndex;
            } else if (index < firstIndex) {
                index = this.cycleHighlight ? lastIndex : index;
            } else if (index > lastIndex) {
                index = this.cycleHighlight ? firstIndex : -1;
            }

            this.highlightedIndex = index;

            if (this.showOnUpDown) {
                this.openDropdown();
            }

            if (index < firstIndex || index > lastIndex) {
                this.$emit('highlight-overflow', index);
            } else {
                this.$emit('highlight', this.$refs.suggestions[index].suggestion, index);
            }
        },
        selectHighlighted: function selectHighlighted(index, e) {
            if (this.showDropdown && this.$refs.suggestions.length > 0) {
                e.preventDefault();
                this.selectSuggestion(this.$refs.suggestions[index].suggestion);
            }
        },
        focus: function focus() {
            this.$refs.input.focus();
        },
        openDropdown: function openDropdown() {
            if (!this.showDropdown) {
                this.showDropdown = true;
                this.$emit('dropdown-open');
            }
        },
        closeDropdown: function closeDropdown() {
            var _this3 = this;

            if (this.showDropdown) {
                this.$nextTick(function () {
                    _this3.showDropdown = false;
                    _this3.highlightedIndex = -1;
                    _this3.$emit('dropdown-close');
                });
            }
        },
        updateValue: function updateValue(value) {
            this.$emit('input', value);
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onChange: function onChange(e) {
            this.$emit('change', this.value, e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);

            if (!this.isTouched) {
                this.isTouched = true;
                this.$emit('touch');
            }
        },
        onExternalClick: function onExternalClick(e) {
            if (!this.$el.contains(e.target) && this.showDropdown) {
                this.closeDropdown();
            }
        },
        reset: function reset() {
            if (document.activeElement === this.$refs.input) {
                document.activeElement.blur();
            }

            this.updateValue(this.initialValue);
            this.isTouched = false;
        }
    },

    components: {
        UiAutocompleteSuggestion: __WEBPACK_IMPORTED_MODULE_1__UiAutocompleteSuggestion_vue__["a" /* default */],
        UiIcon: __WEBPACK_IMPORTED_MODULE_2__UiIcon_vue__["a" /* default */]
    },

    directives: {
        autofocus: __WEBPACK_IMPORTED_MODULE_0__directives_autofocus__["a" /* default */]
    }
};

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-autocomplete-suggestion',

    props: {
        suggestion: {
            type: [String, Object],
            required: true
        },
        type: {
            type: String,
            default: 'simple' },
        highlighted: {
            type: Boolean,
            default: false
        },
        keys: {
            type: Object,
            default: function _default() {
                return {
                    label: 'label',
                    image: 'image'
                };
            }
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-autocomplete-suggestion--type-' + this.type, { 'is-highlighted': this.highlighted }];
        },
        imageStyle: function imageStyle() {
            return { 'background-image': 'url(' + this.suggestion[this.keys.image] + ')' };
        }
    }
};

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiPopover_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UiProgressCircular_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UiRippleInk_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__UiTooltip_vue__ = __webpack_require__(9);








/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-button',

    props: {
        type: {
            type: String,
            default: 'primary' },
        buttonType: String,
        href: String,
        color: {
            type: String,
            default: 'default' },
        size: {
            type: String,
            default: 'normal' },
        raised: {
            type: Boolean,
            default: false
        },
        icon: String,
        iconPosition: {
            type: String,
            default: 'left' },
        loading: {
            type: Boolean,
            default: false
        },
        hasDropdown: {
            type: Boolean,
            default: false
        },
        dropdownPosition: {
            type: String,
            default: 'bottom-start'
        },
        appendDropdownToBody: {
            type: Boolean,
            default: true
        },
        constrainDropdownToScrollParent: {
            type: Boolean,
            default: true
        },
        openDropdownOn: {
            type: String,
            default: 'click' },
        tooltip: String,
        openTooltipOn: String,
        tooltipPosition: String,
        disableRipple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-button--type-' + this.type, 'ui-button--color-' + this.color, 'ui-button--icon-position-' + this.iconPosition, 'ui-button--size-' + this.size, { 'is-anchor': this.isAnchor }, { 'is-raised': this.raised }, { 'is-loading': this.loading }, { 'is-disabled': this.disabled || this.loading }, { 'has-dropdown': this.hasDropdown }];
        },
        isAnchor: function isAnchor() {
            return this.href !== undefined;
        },
        progressColor: function progressColor() {
            if (this.color === 'default' || this.type === 'secondary') {
                return 'black';
            }

            return 'white';
        }
    },

    methods: {
        onClick: function onClick(e) {
            this.$emit('click', e);
        },
        onDropdownOpen: function onDropdownOpen() {
            this.$emit('dropdown-open');
        },
        onDropdownClose: function onDropdownClose() {
            this.$emit('dropdown-close');
        },
        openDropdown: function openDropdown() {
            if (this.$refs.dropdown) {
                this.$refs.dropdown.open();
            }
        },
        closeDropdown: function closeDropdown() {
            if (this.$refs.dropdown) {
                this.$refs.dropdown.close();
            }
        },
        toggleDropdown: function toggleDropdown() {
            if (this.$refs.dropdown) {
                this.$refs.dropdown.toggle();
            }
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiPopover: __WEBPACK_IMPORTED_MODULE_1__UiPopover_vue__["a" /* default */],
        UiProgressCircular: __WEBPACK_IMPORTED_MODULE_2__UiProgressCircular_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_3__UiRippleInk_vue__["a" /* default */],
        UiTooltip: __WEBPACK_IMPORTED_MODULE_4__UiTooltip_vue__["a" /* default */]
    }
};

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiCalendarControls_vue__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiCalendarMonth_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_date__ = __webpack_require__(3);







/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-calendar',

    props: {
        color: {
            type: String,
            default: 'default' },
        dateFilter: Function,
        lang: {
            type: Object,
            default: function _default() {
                return __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].defaultLang;
            }
        },
        maxDate: Date,
        minDate: Date,
        raised: {
            type: Boolean,
            default: false
        },
        startOfWeek: {
            type: Number,
            default: 0
        },
        squareCells: {
            type: Boolean,
            default: false
        },
        value: Date,
        yearRange: {
            type: Array,
            default: function _default() {
                var thisYear = new Date().getFullYear();

                return Array.apply(null, Array(200)).map(function (item, index) {
                    return thisYear - 100 + index;
                });
            }
        }
    },

    data: function data() {
        return {
            today: new Date(),
            dateInView: this.value || new Date()
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-calendar--color-' + this.color, { 'is-raised': this.raised }];
        }
    },

    watch: {
        value: function value() {
            if (this.value) {
                this.dateInView = __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].clone(this.value);
            }
        }
    },

    methods: {
        onDateSelect: function onDateSelect(date) {
            this.$emit('input', date);
            this.$emit('date-select', date);
        },
        onMonthChange: function onMonthChange(newDate) {
            this.dateInView = newDate;
            this.$emit('month-change', newDate);
        },
        goToDate: function goToDate(date) {
            this.$refs.month.goToDate(date);
        }
    },

    components: {
        UiCalendarControls: __WEBPACK_IMPORTED_MODULE_0__UiCalendarControls_vue__["a" /* default */],
        UiCalendarMonth: __WEBPACK_IMPORTED_MODULE_1__UiCalendarMonth_vue__["a" /* default */]
    }
};

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiIconButton_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_date__ = __webpack_require__(3);







/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-calendar-controls',

    props: {
        color: {
            type: String,
            default: 'default' },
        lang: Object,
        dateInView: Date,
        minDate: Date,
        maxDate: Date,
        yearRange: {
            type: Array,
            required: true
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-calendar-controls--color-' + this.color];
        },
        monthAndYear: function monthAndYear() {
            return __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].getMonthFull(this.dateInView, this.lang) + ' ' + this.dateInView.getFullYear();
        },
        previousMonthDisabled: function previousMonthDisabled() {
            var lastDayOfPreviousMonth = __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].clone(this.dateInView);

            lastDayOfPreviousMonth.setDate(0);

            var outsideYearRange = lastDayOfPreviousMonth.getFullYear() < this.yearRange[0];

            if (this.minDate) {
                return outsideYearRange || lastDayOfPreviousMonth.getTime() < this.minDate.getTime();
            }

            return outsideYearRange;
        },
        nextMonthDisabled: function nextMonthDisabled() {
            var firstDayOfNextMonth = __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].clone(this.dateInView);

            firstDayOfNextMonth.setMonth(this.dateInView.getMonth() + 1, 1);

            var outsideYearRange = firstDayOfNextMonth.getFullYear() > this.yearRange[this.yearRange.length - 1];

            if (this.maxDate) {
                return outsideYearRange || firstDayOfNextMonth.getTime() > this.maxDate.getTime();
            }

            return outsideYearRange;
        }
    },

    methods: {
        goToPreviousMonth: function goToPreviousMonth() {
            var date = __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].clone(this.dateInView);

            date.setDate(1);
            date.setMonth(date.getMonth() - 1);

            this.goToDate(date);
        },
        goToNextMonth: function goToNextMonth() {
            var date = __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].clone(this.dateInView);

            date.setDate(1);
            date.setMonth(date.getMonth() + 1);

            this.goToDate(date);
        },
        goToDate: function goToDate(date) {
            this.$emit('go-to-date', date);
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiIconButton: __WEBPACK_IMPORTED_MODULE_1__UiIconButton_vue__["a" /* default */]
    }
};

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiCalendarWeek_vue__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_date__ = __webpack_require__(3);






/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-calendar-month',

    props: {
        lang: Object,
        dateFilter: Function,
        dateInView: Date,
        selected: Date,
        maxDate: Date,
        minDate: Date,
        startOfWeek: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: 'primary' },
        squareCells: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        daysOfWeek: function daysOfWeek() {
            var days = this.lang.days.initials.slice(this.startOfWeek);

            if (days.length === 7) {
                return days;
            }

            return days.concat(this.lang.days.initials.slice(0, this.startOfWeek));
        },
        currentWeekStartDates: function currentWeekStartDates() {
            return this.getWeekStartDates(this.dateInView);
        }
    },

    methods: {
        getWeekStartDates: function getWeekStartDates(dateInWeek) {
            var date = __WEBPACK_IMPORTED_MODULE_1__helpers_date__["a" /* default */].clone(dateInWeek);

            date.setDate(1);
            date = __WEBPACK_IMPORTED_MODULE_1__helpers_date__["a" /* default */].moveToDayOfWeek(date, this.startOfWeek);

            var current = __WEBPACK_IMPORTED_MODULE_1__helpers_date__["a" /* default */].clone(date);
            current.setDate(current.getDate() + 7);

            var starts = [date];
            var month = current.getMonth();

            while (current.getMonth() === month) {
                starts.push(__WEBPACK_IMPORTED_MODULE_1__helpers_date__["a" /* default */].clone(current));
                current.setDate(current.getDate() + 7);
            }

            return starts;
        },
        goToDate: function goToDate(date) {
            this.$emit('change', __WEBPACK_IMPORTED_MODULE_1__helpers_date__["a" /* default */].clone(date));
        },
        onDateSelect: function onDateSelect(date) {
            this.$emit('date-select', date);
        }
    },

    components: {
        UiCalendarWeek: __WEBPACK_IMPORTED_MODULE_0__UiCalendarWeek_vue__["a" /* default */]
    }
};

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_date__ = __webpack_require__(3);




/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-calendar-week',

    props: {
        month: Number,
        weekStart: Date,
        minDate: Date,
        maxDate: Date,
        selected: Date,
        dateFilter: Function,
        color: {
            type: String,
            default: 'primary'
        },
        squareCells: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            today: new Date()
        };
    },


    computed: {
        dates: function dates() {
            return this.buildDays(this.weekStart);
        },
        classes: function classes() {
            return ['ui-calendar-week--color-' + this.color, { 'ui-calendar-week--has-square-cells': this.squareCells }];
        }
    },

    methods: {
        buildDays: function buildDays(weekStart) {
            var days = [__WEBPACK_IMPORTED_MODULE_0__helpers_date__["a" /* default */].clone(weekStart)];
            var day = __WEBPACK_IMPORTED_MODULE_0__helpers_date__["a" /* default */].clone(weekStart);

            for (var i = 1; i <= 6; i++) {
                day = __WEBPACK_IMPORTED_MODULE_0__helpers_date__["a" /* default */].clone(day);
                day.setDate(day.getDate() + 1);

                days.push(day);
            }

            return days;
        },
        getDateClasses: function getDateClasses(date) {
            return [{ 'is-today': __WEBPACK_IMPORTED_MODULE_0__helpers_date__["a" /* default */].isSameDay(date, this.today) }, { 'is-in-other-month': this.isDateInOtherMonth(date) }, { 'is-selected': this.selected && __WEBPACK_IMPORTED_MODULE_0__helpers_date__["a" /* default */].isSameDay(date, this.selected) }, { 'is-disabled': this.isDateDisabled(date) }];
        },
        selectDate: function selectDate(date) {
            if (this.isDateDisabled(date)) {
                return;
            }

            this.$emit('date-select', date);
        },
        isDateInOtherMonth: function isDateInOtherMonth(date) {
            return this.month !== date.getMonth();
        },
        isDateDisabled: function isDateDisabled(date) {
            var isDisabled = this.minDate && __WEBPACK_IMPORTED_MODULE_0__helpers_date__["a" /* default */].isBefore(date, this.minDate) || this.maxDate && __WEBPACK_IMPORTED_MODULE_0__helpers_date__["a" /* default */].isAfter(date, this.maxDate);

            if (isDisabled) {
                return true;
            }

            return this.dateFilter ? !this.dateFilter(date) : false;
        }
    }
};

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-checkbox',

    props: {
        name: String,
        label: String,
        tabindex: [String, Number],
        value: {
            required: true
        },
        trueValue: {
            default: true
        },
        falseValue: {
            default: false
        },
        submittedValue: {
            type: String,
            default: 'on' },
        checked: {
            type: Boolean,
            default: false
        },
        boxPosition: {
            type: String,
            default: 'left' },
        color: {
            type: String,
            default: 'primary' },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false,
            isChecked: this.value === this.trueValue || this.checked
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-checkbox--color-' + this.color, 'ui-checkbox--box-position-' + this.boxPosition, { 'is-checked': this.isChecked }, { 'is-active': this.isActive }, { 'is-disabled': this.disabled }];
        }
    },

    watch: {
        value: function value() {
            this.isChecked = this.value === this.trueValue;
        }
    },

    created: function created() {
        this.$emit('input', this.isChecked ? this.trueValue : this.falseValue);
    },


    methods: {
        focus: function focus() {
            this.$refs.input.focus();
        },
        onClick: function onClick(e) {
            var isCheckedPrevious = this.isChecked;
            var isChecked = e.target.checked;

            this.$emit('input', isChecked ? this.trueValue : this.falseValue, e);

            if (isCheckedPrevious !== isChecked) {
                this.$emit('change', isChecked ? this.trueValue : this.falseValue, e);
            }
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);
        }
    }
};

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiCheckbox_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_util__ = __webpack_require__(6);






/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-checkbox-group',

    props: {
        name: String,
        options: {
            type: Array,
            required: true
        },
        value: {
            type: Array,
            required: true
        },
        keys: {
            type: Object,
            default: function _default() {
                return {
                    id: 'id',
                    name: 'name',
                    class: 'class',
                    label: 'label',
                    value: 'value',
                    disabled: 'disabled'
                };
            }
        },
        label: String,
        color: {
            type: String,
            default: 'primary' },
        boxPosition: {
            type: String,
            default: 'left' },
        vertical: {
            type: Boolean,
            default: false
        },
        help: String,
        error: String,
        invalid: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false,
            ignoreChange: false,
            checkboxValues: [],
            initialValue: JSON.parse(JSON.stringify(this.value))
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-checkbox-group--color-' + this.color, 'ui-checkbox-group--box-position-' + this.boxPosition, { 'is-vertical': this.vertical }, { 'is-active': this.isActive }, { 'is-invalid': this.invalid }, { 'is-disabled': this.disabled }];
        },
        hasFeedback: function hasFeedback() {
            return this.showError || this.showHelp;
        },
        showError: function showError() {
            return this.invalid && (Boolean(this.error) || Boolean(this.$slots.error));
        },
        showHelp: function showHelp() {
            return Boolean(this.help) || Boolean(this.$slots.help);
        }
    },

    methods: {
        reset: function reset() {
            var _this = this;

            this.ignoreChange = true;
            this.options.forEach(function (option, index) {
                _this.checkboxValues[index] = _this.isOptionCheckedByDefault(option);
            });
            this.ignoreChange = false;

            this.$emit('input', this.initialValue.length > 0 ? [].concat(this.initialValue) : []);
        },
        isOptionCheckedByDefault: function isOptionCheckedByDefault(option) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_util__["c" /* looseIndexOf */])(this.initialValue, option[this.keys.value] || option) > -1;
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);
        },
        onChange: function onChange(args, option) {
            if (this.ignoreChange) {
                return;
            }

            var checked = args[0];
            var e = args[1];

            var value = [];
            var optionValue = option[this.keys.value] || option;
            var i = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers_util__["c" /* looseIndexOf */])(this.value, optionValue);

            if (checked && i < 0) {
                value = this.value.concat(optionValue);
            }

            if (!checked && i > -1) {
                value = this.value.slice(0, i).concat(this.value.slice(i + 1));
            }

            this.$emit('input', value);
            this.$emit('change', value, e);
        }
    },

    components: {
        UiCheckbox: __WEBPACK_IMPORTED_MODULE_0__UiCheckbox_vue__["a" /* default */]
    }
};

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__ = __webpack_require__(2);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-close-button',

    props: {
        size: {
            type: String,
            default: 'normal' },
        color: {
            type: String,
            default: 'black' },
        disableRipple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-close-button--size-' + this.size, 'ui-close-button--color-' + this.color, { 'is-disabled': this.disabled || this.loading }];
        }
    },

    methods: {
        onClick: function onClick(e) {
            this.$emit('click', e);
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__["a" /* default */]
    }
};

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_uuid__ = __webpack_require__(23);






/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-collapsible',

    props: {
        open: {
            type: Boolean,
            default: false
        },
        title: String,
        removeIcon: {
            type: Boolean,
            default: false
        },
        disableRipple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isOpen: this.open,
            id: __WEBPACK_IMPORTED_MODULE_2__helpers_uuid__["a" /* default */].short('ui-collapsible-')
        };
    },


    computed: {
        classes: function classes() {
            return [{ 'is-open': this.isOpen }, { 'is-disabled': this.disabled }];
        }
    },

    watch: {
        open: function open() {
            if (this.isOpen !== this.open) {
                this.isOpen = this.open;
            }
        }
    },

    mounted: function mounted() {
        if (this.isOpen) {
            this.$refs.bodyWrapper.style.maxHeight = 'none';
        }
    },


    methods: {
        toggleCollapsible: function toggleCollapsible() {
            if (this.disabled) {
                return;
            }

            this.isOpen = !this.isOpen;
        },
        onEnter: function onEnter(el) {
            this.$emit('open');
            el.style.maxHeight = el.scrollHeight + 'px';
        },
        afterEnter: function afterEnter(el) {
            el.style.maxHeight = 'none';
        },
        beforeLeave: function beforeLeave(el) {
            el.style.maxHeight = el.scrollHeight + 'px';

            el.offsetHeight;
        },
        onLeave: function onLeave(el) {
            el.style.maxHeight = 0;
            this.$emit('close');
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__["a" /* default */]
    }
};

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiButton_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiModal_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_classlist__ = __webpack_require__(5);







/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-confirm',

    props: {
        title: {
            type: String,
            default: 'UiConfirm'
        },
        type: {
            type: String,
            default: 'primary' },
        size: String,
        confirmButtonText: {
            type: String,
            default: 'OK'
        },
        confirmButtonIcon: String,
        denyButtonText: {
            type: String,
            default: 'Cancel'
        },
        denyButtonIcon: String,
        autofocus: {
            type: String,
            default: 'deny-button' },
        closeOnConfirm: {
            type: Boolean,
            default: true
        },
        dismissOn: String,
        transition: String,
        loading: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        confirmButtonColor: function confirmButtonColor() {
            var typeToColor = {
                default: 'default',
                primary: 'primary',
                accent: 'accent',
                success: 'green',
                warning: 'orange',
                danger: 'red'
            };

            return typeToColor[this.type];
        }
    },

    methods: {
        open: function open() {
            this.$refs.modal.open();
        },
        close: function close() {
            this.$refs.modal.close();
        },
        confirm: function confirm() {
            this.$emit('confirm');

            if (this.closeOnConfirm) {
                this.$refs.modal.close();
            }
        },
        deny: function deny() {
            this.$refs.modal.close();
            this.$emit('deny');
        },
        onModalOpen: function onModalOpen() {
            var button = void 0;

            if (this.autofocus === 'confirm-button') {
                button = this.$refs.confirmButton.$el;
            } else if (this.autofocus === 'deny-button') {
                button = this.$refs.denyButton.$el;
            }

            if (button) {
                __WEBPACK_IMPORTED_MODULE_2__helpers_classlist__["a" /* default */].add(button, 'has-focus-ring');
                button.addEventListener('blur', this.removeAutoFocus);
                button.focus();
            }

            this.$emit('open');
        },
        onModalReveal: function onModalReveal() {
            this.$emit('reveal');
        },
        onModalClose: function onModalClose() {
            this.$emit('close');
        },
        onModalHide: function onModalHide() {
            this.$emit('hide');
        },
        removeAutoFocus: function removeAutoFocus() {
            var button = void 0;

            if (this.autofocus === 'confirm-button') {
                button = this.$refs.confirmButton.$el;
            } else if (this.autofocus === 'deny-button') {
                button = this.$refs.denyButton.$el;
            }

            if (button) {
                __WEBPACK_IMPORTED_MODULE_2__helpers_classlist__["a" /* default */].remove(button, 'has-focus-ring');

                button.removeEventListener('blur', this.removeAutoFocus);
            }
        }
    },

    components: {
        UiButton: __WEBPACK_IMPORTED_MODULE_0__UiButton_vue__["a" /* default */],
        UiModal: __WEBPACK_IMPORTED_MODULE_1__UiModal_vue__["a" /* default */]
    }
};

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiButton_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiDatepickerCalendar_vue__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UiModal_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__UiPopover_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mixins_RespondsToExternalClick__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_date__ = __webpack_require__(3);











/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-datepicker',

    props: {
        name: String,
        value: [Date, String],
        tabindex: [String, Number],
        startOfWeek: {
            type: Number,
            default: 0
        },
        minDate: Date,
        maxDate: Date,
        yearRange: Array,
        lang: {
            type: Object,
            default: function _default() {
                return __WEBPACK_IMPORTED_MODULE_6__helpers_date__["a" /* default */].defaultLang;
            }
        },
        customFormatter: Function,
        dateFilter: Function,
        color: {
            type: String,
            default: 'primary' },
        orientation: {
            type: String,
            default: 'portrait' },
        pickerType: {
            type: String,
            default: 'popover' },
        defaultView: {
            type: String,
            default: 'date'
        },
        appendDropdownToBody: Boolean,
        dropdownZIndex: Number,
        placeholder: String,
        icon: String,
        iconPosition: {
            type: String,
            default: 'left' },
        label: String,
        floatingLabel: {
            type: Boolean,
            default: false
        },
        invalid: {
            type: Boolean,
            default: false
        },
        help: String,
        error: String,
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false,
            isTouched: false,
            initialValue: JSON.stringify(this.value),
            calendarView: this.defaultView
        };
    },


    computed: {
        date: function date() {
            return typeof this.value === 'string' ? new Date(this.value) : this.value;
        },
        classes: function classes() {
            return ['ui-datepicker--icon-position-' + this.iconPosition, 'ui-datepicker--orientation-' + this.orientation, { 'is-active': this.isActive }, { 'is-invalid': this.invalid }, { 'is-touched': this.isTouched }, { 'is-disabled': this.disabled }, { 'has-label': this.hasLabel }, { 'has-floating-label': this.hasFloatingLabel }];
        },
        labelClasses: function labelClasses() {
            return {
                'is-inline': this.hasFloatingLabel && this.isLabelInline,
                'is-floating': this.hasFloatingLabel && !this.isLabelInline
            };
        },
        hasLabel: function hasLabel() {
            return Boolean(this.label) || Boolean(this.$slots.default);
        },
        hasFloatingLabel: function hasFloatingLabel() {
            return this.hasLabel && this.floatingLabel;
        },
        isLabelInline: function isLabelInline() {
            return !this.date && !this.isActive;
        },
        hasFeedback: function hasFeedback() {
            return this.showError || this.showHelp;
        },
        showError: function showError() {
            return this.invalid && (Boolean(this.error) || Boolean(this.$slots.error));
        },
        showHelp: function showHelp() {
            return Boolean(this.help) || Boolean(this.$slots.help);
        },
        displayText: function displayText() {
            if (!this.date) {
                return '';
            }

            return this.customFormatter ? this.customFormatter(this.date, this.lang) : __WEBPACK_IMPORTED_MODULE_6__helpers_date__["a" /* default */].humanize(this.date, this.lang);
        },
        hasDisplayText: function hasDisplayText() {
            return Boolean(this.displayText.length);
        },
        submittedValue: function submittedValue() {
            return this.date ? this.date.getFullYear() + '-' + (1 + this.date.getMonth()) + '-' + this.date.getDate() : '';
        },
        usesPopover: function usesPopover() {
            return this.pickerType === 'popover';
        },
        usesModal: function usesModal() {
            return this.pickerType === 'modal';
        }
    },

    watch: {
        isActive: function isActive(value) {
            if (value) {
                this.addExternalClickListener([this.$el, this.getPicker().$el], this.onExternalClick);
            } else {
                this.removeExternalClickListener();
            }
        }
    },

    methods: {
        onDateSelect: function onDateSelect(date) {
            this.$emit('input', date);
            this.closePicker();
        },
        isPickerOpen: function isPickerOpen() {
            return this.usesModal ? this.$refs.modal.isOpen : this.$refs.popover.isOpen();
        },
        getPicker: function getPicker() {
            return this.$refs[this.usesModal ? 'modal' : 'popover'];
        },
        openPicker: function openPicker() {
            if (this.disabled) {
                return;
            }

            this.getPicker().open();
        },
        closePicker: function closePicker() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { returnFocus: true };

            this.getPicker().close();

            this.calendarView = this.defaultView;

            if (options.returnFocus) {
                this.$refs.label.focus();
            }
        },
        togglePicker: function togglePicker() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { returnFocus: true };

            if (this.isPickerOpen()) {
                this.closePicker(options);
            } else {
                this.openPicker();
            }
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onTabAway: function onTabAway(e) {
            this.isActive = false;
            this.$emit('blur', e);

            if (this.isPickerOpen()) {
                this.closePicker({ returnFocus: false });
            }
        },
        onPickerOpen: function onPickerOpen() {
            this.$emit('open');
        },
        onPickerClose: function onPickerClose() {
            this.$emit('close');

            if (!this.isTouched) {
                this.isTouched = true;
                this.$emit('touch');
            }
        },
        onExternalClick: function onExternalClick() {
            this.isActive = false;
        },
        focus: function focus() {
            this.$refs.label.focus();
        },
        clear: function clear() {
            this.$emit('input', null);
        },
        reset: function reset() {
            this.$emit('input', JSON.parse(this.initialValue));
        },
        resetTouched: function resetTouched() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { touched: false };

            this.isTouched = options.touched;
        }
    },

    components: {
        UiButton: __WEBPACK_IMPORTED_MODULE_0__UiButton_vue__["a" /* default */],
        UiDatepickerCalendar: __WEBPACK_IMPORTED_MODULE_1__UiDatepickerCalendar_vue__["a" /* default */],
        UiIcon: __WEBPACK_IMPORTED_MODULE_2__UiIcon_vue__["a" /* default */],
        UiModal: __WEBPACK_IMPORTED_MODULE_3__UiModal_vue__["a" /* default */],
        UiPopover: __WEBPACK_IMPORTED_MODULE_4__UiPopover_vue__["a" /* default */]
    },

    mixins: [__WEBPACK_IMPORTED_MODULE_5__mixins_RespondsToExternalClick__["a" /* default */]]
};

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiCalendarControls_vue__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiCalendarMonth_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_date__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_element_scroll__ = __webpack_require__(21);








/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-datepicker-calendar',

    props: {
        value: Date,
        minDate: Date,
        maxDate: Date,
        startOfWeek: {
            type: Number,
            default: 0
        },
        currentView: {
            type: String,
            validator: function validator(value) {
                return value === 'date' || value === 'year';
            }
        },
        lang: {
            type: Object,
            default: function _default() {
                return __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].defaultLang;
            }
        },
        yearRange: {
            type: Array,
            default: function _default() {
                var thisYear = new Date().getFullYear();

                return Array.apply(null, Array(200)).map(function (item, index) {
                    return thisYear - 100 + index;
                });
            }
        },
        dateFilter: Function,
        color: {
            type: String,
            default: 'primary' },
        orientation: {
            type: String,
            default: 'portrait' }
    },

    data: function data() {
        return {
            today: new Date(),
            dateInView: this.getDateInRange(this.value, new Date())
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-datepicker-calendar--color-' + this.color, 'ui-datepicker-calendar--orientation-' + this.orientation];
        },
        headerYear: function headerYear() {
            return this.value ? this.value.getFullYear() : this.today.getFullYear();
        },
        headerWeekday: function headerWeekday() {
            return this.value ? __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].getDayAbbreviated(this.value, this.lang) : __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].getDayAbbreviated(this.today, this.lang);
        },
        headerDay: function headerDay() {
            var date = this.value ? this.value : this.today;

            return __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].getMonthAbbreviated(date, this.lang) + ' ' + __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].getDayOfMonth(date, this.lang);
        },
        showYearPicker: function showYearPicker() {
            return this.currentView === 'year';
        },
        showDatePicker: function showDatePicker() {
            return this.currentView === 'date';
        }
    },

    watch: {
        value: function value() {
            if (this.value) {
                this.dateInView = __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].clone(this.value);
            }
        },
        currentView: function currentView() {
            var _this = this;

            if (this.showYearPicker) {
                this.$nextTick(function () {
                    var el = _this.$refs.years.querySelector('.is-selected') || _this.$refs.years.querySelector('.is-current-year');

                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers_element_scroll__["b" /* scrollIntoView */])(el, { marginTop: 144 });
                });
            }
        }
    },

    methods: {
        selectYear: function selectYear(year) {
            var newDate = __WEBPACK_IMPORTED_MODULE_2__helpers_date__["a" /* default */].clone(this.dateInView);
            newDate.setFullYear(year);

            this.dateInView = this.getDateInRange(newDate);
            this.$emit('update:currentView', 'date');
        },
        getDateInRange: function getDateInRange(date, fallback) {
            date = date || fallback;

            if (this.minDate && date.getTime() < this.minDate.getTime()) {
                return this.minDate;
            }

            if (this.maxDate && date.getTime() > this.maxDate.getTime()) {
                return this.maxDate;
            }

            return date;
        },
        getYearClasses: function getYearClasses(year) {
            return {
                'is-current-year': this.isYearCurrent(year),
                'is-selected': this.isYearSelected(year)
            };
        },
        isYearCurrent: function isYearCurrent(year) {
            return year === this.today.getFullYear();
        },
        isYearSelected: function isYearSelected(year) {
            return this.value && year === this.value.getFullYear();
        },
        isYearOutOfRange: function isYearOutOfRange(year) {
            if (this.minDate && year < this.minDate.getFullYear()) {
                return true;
            }

            if (this.maxDate && year > this.maxDate.getFullYear()) {
                return true;
            }

            if (this.year < this.yearRange[0]) {
                return true;
            }

            if (this.year > this.yearRange[this.yearRange.length - 1]) {
                return true;
            }

            return false;
        },
        onDateSelect: function onDateSelect(date) {
            this.$emit('input', date);
            this.$emit('date-select', date);
        },
        onGoToDate: function onGoToDate(date) {
            this.$refs.month.goToDate(date);
        },
        onMonthChange: function onMonthChange(newDate) {
            this.dateInView = newDate;
            this.$emit('month-change', newDate);
        }
    },

    components: {
        UiCalendarControls: __WEBPACK_IMPORTED_MODULE_0__UiCalendarControls_vue__["a" /* default */],
        UiCalendarMonth: __WEBPACK_IMPORTED_MODULE_1__UiCalendarMonth_vue__["a" /* default */]
    }
};

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UiTooltip_vue__ = __webpack_require__(9);






/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-fab',

    props: {
        size: {
            type: String,
            default: 'normal' },
        color: {
            type: String,
            default: 'default' },
        icon: String,
        ariaLabel: String,
        tooltip: String,
        openTooltipOn: String,
        tooltipPosition: String,
        disableRipple: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-fab--color-' + this.color, 'ui-fab--size-' + this.size];
        }
    },

    methods: {
        onClick: function onClick(e) {
            this.$emit('click', e);
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__["a" /* default */],
        UiTooltip: __WEBPACK_IMPORTED_MODULE_2__UiTooltip_vue__["a" /* default */]
    }
};

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__ = __webpack_require__(2);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-fileupload',

    props: {
        name: {
            type: String,
            required: true
        },
        label: String,
        tabindex: [String, Number],
        accept: String,
        multiple: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'primary' },
        color: {
            type: String,
            default: 'default' },
        size: {
            type: String,
            default: 'normal' },
        raised: {
            type: Boolean,
            default: false
        },
        iconPosition: {
            type: String,
            default: 'left' },
        disableRipple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false,
            renderInput: true,
            hasSelection: false,
            hasMultiple: false,
            displayText: ''
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-fileupload--type-' + this.type, 'ui-fileupload--color-' + this.color, 'ui-fileupload--icon-position-' + this.iconPosition, 'ui-fileupload--size-' + this.size, { 'is-active': this.isActive }, { 'is-multiple': this.hasMultiple }, { 'is-raised': this.raised }, { 'is-disabled': this.disabled }];
        },
        placeholder: function placeholder() {
            if (this.label) {
                return this.label;
            }

            return this.multiple ? 'Choose files' : 'Choose a file';
        }
    },

    methods: {
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);
        },
        onInput: function onInput(e) {
            this.$emit('input', this.$refs.input.files, e);
        },
        onChange: function onChange(e) {
            this.updateDisplayText(e);
            this.$emit('change', this.$refs.input.files, e);
        },
        updateDisplayText: function updateDisplayText(e) {
            var displayText = void 0;
            var input = this.$refs.input;

            if (input.files && input.files.length > 1) {
                displayText = input.files.length + ' files selected';
            } else {
                displayText = e.target.value.split('\\').pop();
            }

            if (displayText) {
                this.hasSelection = true;
                this.displayText = displayText;
                this.hasMultiple = input.files.length > 1;
            }
        },
        focus: function focus() {
            this.$refs.input.focus();
        },
        openPicker: function openPicker() {
            this.$refs.input.click();
        },
        clear: function clear() {
            var _this = this;

            this.renderInput = false;

            this.$nextTick(function () {
                _this.renderInput = true;
            });
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__["a" /* default */]
    }
};

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-focus-container',

    props: {
        containFocus: {
            type: Boolean,
            default: true
        },
        focusRedirector: Function,
        disabled: {
            type: Boolean,
            default: false
        },
        tag: {
            type: String,
            default: 'div'
        },
        lazy: {
            type: Boolean,
            default: false }
    },

    computed: {
        renderRedirector: function renderRedirector() {
            if (this.disabled) {
                return false;
            }

            return this.lazy ? this.containFocus : true;
        }
    },

    methods: {
        focus: function focus() {
            this.$refs.content.focus();
        },
        redirectFocus: function redirectFocus(e, options) {
            if (!this.containFocus) {
                this.$emit('focus-overflow', e, options);
                return;
            }

            e.stopPropagation();

            if (this.focusRedirector) {
                this.focusRedirector(e, options);
                return;
            }

            if (options.isTabbingForward) {
                this.$refs.content.focus();
            } else {
                this.$refs.lastFocusable.focus();
            }
        }
    }
};

/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-icon',

    props: {
        icon: String,
        iconSet: {
            type: String,
            default: 'material-icons'
        },
        ariaLabel: String,
        removeText: {
            type: Boolean,
            default: false
        },
        useSvg: {
            type: Boolean,
            default: false
        }
    }
};

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiPopover_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UiProgressCircular_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UiRippleInk_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__UiTooltip_vue__ = __webpack_require__(9);








/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-icon-button',

    props: {
        type: {
            type: String,
            default: 'primary' },
        buttonType: String,
        href: String,
        color: {
            type: String,
            default: 'default' },
        size: {
            type: String,
            default: 'normal' },
        icon: String,
        ariaLabel: String,
        loading: {
            type: Boolean,
            default: false
        },
        hasDropdown: {
            type: Boolean,
            default: false
        },
        dropdownPosition: {
            type: String,
            default: 'bottom-start'
        },
        appendDropdownToBody: {
            type: Boolean,
            default: true
        },
        constrainDropdownToScrollParent: {
            type: Boolean,
            default: true
        },
        openDropdownOn: {
            type: String,
            default: 'click' },
        tooltip: String,
        openTooltipOn: String,
        tooltipPosition: String,
        disableRipple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-icon-button--type-' + this.type, 'ui-icon-button--color-' + this.color, 'ui-icon-button--size-' + this.size, { 'is-anchor': this.isAnchor }, { 'is-loading': this.loading }, { 'is-disabled': this.disabled || this.loading }, { 'has-dropdown': this.hasDropdown }];
        },
        isAnchor: function isAnchor() {
            return this.href !== undefined;
        },
        progressColor: function progressColor() {
            if (this.type === 'primary') {
                if (this.color === 'default' || this.color === 'black') {
                    return 'black';
                }

                return 'white';
            }

            if (this.color === 'white') {
                return 'white';
            }

            return 'black';
        }
    },

    methods: {
        onClick: function onClick(e) {
            this.$emit('click', e);
        },
        onDropdownOpen: function onDropdownOpen() {
            this.$emit('dropdown-open');
        },
        onDropdownClose: function onDropdownClose() {
            this.$emit('dropdown-close');
        },
        openDropdown: function openDropdown() {
            if (this.$refs.dropdown) {
                this.$refs.dropdown.open();
            }
        },
        closeDropdown: function closeDropdown() {
            if (this.$refs.dropdown) {
                this.$refs.dropdown.close();
            }
        },
        toggleDropdown: function toggleDropdown() {
            if (this.$refs.dropdown) {
                this.$refs.dropdown.toggle();
            }
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiPopover: __WEBPACK_IMPORTED_MODULE_1__UiPopover_vue__["a" /* default */],
        UiProgressCircular: __WEBPACK_IMPORTED_MODULE_2__UiProgressCircular_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_3__UiRippleInk_vue__["a" /* default */],
        UiTooltip: __WEBPACK_IMPORTED_MODULE_4__UiTooltip_vue__["a" /* default */]
    }
};

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiFocusContainer_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiMenuOption_vue__ = __webpack_require__(142);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-menu',

    props: {
        options: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        hasIcons: {
            type: Boolean,
            default: false
        },
        iconProps: Object,
        hasSecondaryText: {
            type: Boolean,
            default: false
        },
        containFocus: {
            type: Boolean,
            default: false
        },
        keys: {
            type: Object,
            default: function _default() {
                return {
                    icon: 'icon',
                    type: 'type',
                    label: 'label',
                    secondaryText: 'secondaryText',
                    iconProps: 'iconProps',
                    disabled: 'disabled',
                    href: 'href',
                    target: 'target'
                };
            }
        },
        disableRipple: {
            type: Boolean,
            default: false
        },
        raised: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return {
                'is-raised': this.raised,
                'has-icons': this.hasIcons,
                'has-secondary-text': this.hasSecondaryText
            };
        }
    },

    methods: {
        selectOption: function selectOption(option) {
            if (option.disabled || option.type === 'divider') {
                return;
            }

            this.$emit('select', option);
            this.closeMenu();
        },
        closeMenu: function closeMenu() {
            this.$emit('close');
        }
    },

    components: {
        UiFocusContainer: __WEBPACK_IMPORTED_MODULE_0__UiFocusContainer_vue__["a" /* default */],
        UiMenuOption: __WEBPACK_IMPORTED_MODULE_1__UiMenuOption_vue__["a" /* default */]
    }
};

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__ = __webpack_require__(2);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-menu-option',

    props: {
        type: String,
        label: String,
        href: String,
        target: String,
        icon: String,
        iconProps: {
            type: Object,
            default: function _default() {
                return {};
            }
        },
        secondaryText: String,
        disableRipple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return {
                'is-divider': this.isDivider,
                'is-disabled': this.disabled,
                'is-anchor': this.isAnchor
            };
        },
        isDivider: function isDivider() {
            return this.type === 'divider';
        },
        isAnchor: function isAnchor() {
            return !this.isDivider && this.href !== undefined;
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__["a" /* default */]
    }
};

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiCloseButton_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiFocusContainer_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_classlist__ = __webpack_require__(5);







/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-modal',

    props: {
        title: {
            type: String,
            default: 'UiModal title'
        },
        alignTop: {
            type: Boolean,
            default: false
        },
        alignTopMargin: {
            type: Number,
            default: 60
        },
        size: {
            type: String,
            default: 'normal' },
        role: {
            type: String,
            default: 'dialog' },
        transition: {
            type: String,
            default: 'scale-down' },
        removeHeader: {
            type: Boolean,
            default: false
        },
        removeCloseButton: {
            type: Boolean,
            default: false
        },
        preventShift: {
            type: Boolean,
            default: false
        },
        dismissible: {
            type: Boolean,
            default: true
        },
        dismissOn: {
            type: String,
            default: 'backdrop esc close-button'
        }
    },

    data: function data() {
        return {
            isOpen: false,
            lastFocusedElement: null
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-modal--size-' + this.size, { 'has-footer': this.hasFooter }, { 'is-open': this.isOpen }, { 'is-aligned-top': this.alignTop }];
        },
        alignTopStyle: function alignTopStyle() {
            if (this.alignTop) {
                return { 'padding-top': this.alignTopMargin + 'px' };
            }

            return null;
        },
        toggleTransition: function toggleTransition() {
            return 'ui-modal--transition-' + this.transition;
        },
        hasFooter: function hasFooter() {
            return Boolean(this.$slots.footer);
        },
        dismissOnBackdrop: function dismissOnBackdrop() {
            return this.dismissOn.indexOf('backdrop') > -1;
        },
        dismissOnCloseButton: function dismissOnCloseButton() {
            return this.dismissOn.indexOf('close-button') > -1;
        },
        dismissOnEsc: function dismissOnEsc() {
            return this.dismissOn.indexOf('esc') > -1;
        }
    },

    watch: {
        isOpen: function isOpen() {
            var _this = this;

            this.$nextTick(function () {
                _this[_this.isOpen ? 'onOpen' : 'onClose']();
            });
        }
    },

    beforeDestroy: function beforeDestroy() {
        if (this.isOpen) {
            this.returnFocus();
        }
    },


    methods: {
        open: function open() {
            this.isOpen = true;
        },
        close: function close() {
            if (!this.dismissible) {
                return;
            }

            this.isOpen = false;
        },
        redirectFocus: function redirectFocus() {
            this.$refs.focusContainer.focus();
        },
        returnFocus: function returnFocus() {
            if (this.lastFocusedElement) {
                this.lastFocusedElement.focus();
            }
        },
        onBackdropClick: function onBackdropClick() {
            if (this.dismissOnBackdrop) {
                this.close();
            } else {
                this.redirectFocus();
            }
        },
        onEsc: function onEsc() {
            if (this.dismissOnEsc) {
                this.close();
            }
        },
        onOpen: function onOpen() {
            this.lastFocusedElement = document.activeElement;
            this.$refs.focusContainer.focus();

            __WEBPACK_IMPORTED_MODULE_2__helpers_classlist__["a" /* default */].add(document.body, 'ui-modal--is-open');
            this.incrementOpenModalCount();

            this.$emit('open');
        },
        onClose: function onClose() {
            this.returnFocus();
            this.$emit('close');
        },
        onEnter: function onEnter() {
            this.$emit('reveal');
        },
        onLeave: function onLeave() {
            this.$emit('hide');
            var newCount = this.decrementOpenModalCount();

            if (newCount === 0) {
                __WEBPACK_IMPORTED_MODULE_2__helpers_classlist__["a" /* default */].remove(document.body, 'ui-modal--is-open');
            }
        },
        getOpenModalCount: function getOpenModalCount() {
            var count = document.body.getAttribute('data-ui-open-modals');
            return count === undefined ? 0 : Number(count);
        },
        setOpenModalCount: function setOpenModalCount(count) {
            var normalizedCount = Math.max(0, count);

            if (normalizedCount === 0) {
                document.body.removeAttribute('data-ui-open-modals');
            } else {
                document.body.setAttribute('data-ui-open-modals', normalizedCount);
            }

            return normalizedCount;
        },
        incrementOpenModalCount: function incrementOpenModalCount() {
            return this.setOpenModalCount(this.getOpenModalCount() + 1);
        },
        decrementOpenModalCount: function decrementOpenModalCount() {
            return this.setOpenModalCount(this.getOpenModalCount() - 1);
        }
    },

    components: {
        UiCloseButton: __WEBPACK_IMPORTED_MODULE_0__UiCloseButton_vue__["a" /* default */],
        UiFocusContainer: __WEBPACK_IMPORTED_MODULE_1__UiFocusContainer_vue__["a" /* default */]
    }
};

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tippy_js_esm__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classlist__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_element_ref__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_events__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__UiFocusContainer_vue__ = __webpack_require__(14);









/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-popover',

    props: {
        animation: {
            type: String,
            default: 'fade' },
        appendToBody: {
            type: Boolean,
            default: true
        },
        closeOnScroll: {
            type: Boolean,
            default: true
        },
        constrainToScrollParent: {
            type: Boolean,
            default: true
        },
        containFocus: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        focusRedirector: Function,
        openOn: {
            type: String,
            default: 'click' },
        position: {
            type: String,
            default: 'bottom-start'
        },
        raised: {
            type: Boolean,
            default: true
        },
        trigger: {
            validator: function validator(value) {
                return __WEBPACK_IMPORTED_MODULE_2__helpers_element_ref__["a" /* default */].validate(value, '[UiPopover]: Invalid prop: "trigger". Expected Element, VueComponent or CSS selector string which matches an existing element.');
            }
        },
        zIndex: Number
    },

    data: function data() {
        return {
            returnFocus: true
        };
    },


    watch: {
        disabled: function disabled(value) {
            if (this.tip) {
                if (value === true) {
                    this.tip.disable();
                } else {
                    this.tip.enable();
                }
            }
        }
    },

    created: function created() {
        this.tip = null;
    },
    mounted: function mounted() {
        this.setupPopover();
    },
    beforeDestroy: function beforeDestroy() {
        this.destroyPopover();
    },


    methods: {
        setupPopover: function setupPopover() {
            this.triggerEl = __WEBPACK_IMPORTED_MODULE_2__helpers_element_ref__["a" /* default */].resolve(this.trigger, this.$el.parentElement);

            if (!this.triggerEl) {
                console.error('[UiPopover]: Trigger element not found.');
                return;
            }

            var options = {
                animateFill: false,

                animation: this.animation === 'none' ? 'fade' : this.animation,
                appendTo: this.appendToBody ? document.body : this.triggerEl.parentElement,
                arrow: false,
                content: this.$el,
                delay: [0, 0],
                distance: 0,
                duration: this.animation === 'none' ? 0 : [250, 200],
                hideOnClick: true,
                ignoreAttributes: true,
                interactive: true,
                lazy: true,
                maxWidth: '100%',
                multiple: true,
                onHidden: this.onHidden,
                onHide: this.onClose,
                onShow: this.onOpen,
                onShown: this.onShown,
                placement: this.position,
                role: 'dialog',
                theme: 'ui-popover',
                trigger: this.openOn.replace('hover', 'mouseenter'),
                zIndex: this.zIndex,
                popperOptions: {
                    modifiers: {
                        computeStyle: {
                            gpuAcceleration: !(window.devicePixelRatio < 1.5 && /Win/.test(navigator.platform))
                        }
                    }
                }
            };

            if (!this.constrainToScrollParent) {
                options.popperOptions.modifiers.preventOverflow = { enabled: false };
                options.popperOptions.modifiers.hide = { enabled: false };
            }

            this.tip = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tippy_js_esm__["a" /* default */])(this.triggerEl, options);

            if (this.disabled) {
                this.tip.disable();
            }
        },
        destroyPopover: function destroyPopover() {
            if (this.tip) {
                this.removeCloseEventListeners();
                this.tip.destroy();
                this.tip = null;
            }
        },
        isOpen: function isOpen() {
            return this.tip && this.tip.state.isVisible;
        },
        open: function open() {
            if (this.tip) {
                this.tip.show();
            }
        },
        close: function close() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { returnFocus: true };

            if (this.tip) {
                this.returnFocus = options.returnFocus;
                this.tip.hide();
            }
        },
        toggle: function toggle() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { returnFocus: true };

            if (this.tip) {
                this.returnFocus = options.returnFocus;
                this.tip[this.isOpen() ? 'hide' : 'show']();
            }
        },
        scheduleUpdate: function scheduleUpdate() {
            if (this.tip) {
                this.tip.popperInstance.scheduleUpdate();
            }
        },
        onOpen: function onOpen() {
            this.addCloseEventListeners();

            __WEBPACK_IMPORTED_MODULE_1__helpers_classlist__["a" /* default */].add(this.triggerEl, 'has-dropdown-open');

            this.$emit('open');
        },
        onClose: function onClose() {
            if (this.returnFocus && this.lastFocusedElement) {
                this.lastFocusedElement.focus();
            }

            this.removeCloseEventListeners();

            __WEBPACK_IMPORTED_MODULE_1__helpers_classlist__["a" /* default */].remove(this.triggerEl, 'has-dropdown-open');

            this.$emit('close');

            this.returnFocus = true;
        },
        onShown: function onShown() {
            this.lastFocusedElement = document.activeElement;
            this.$refs.focusContainer.focus();
            this.$emit('reveal');
        },
        onHidden: function onHidden() {
            this.$emit('hide');
        },
        closeOnExternal: function closeOnExternal(event, closeOptions) {
            if (!this.$el.contains(event.target)) {
                this.close(closeOptions);
            }
        },
        addCloseEventListeners: function addCloseEventListeners() {
            var _this = this;

            this.removeCloseEventListeners();

            setTimeout(function () {
                _this.removeExternalClickListener = __WEBPACK_IMPORTED_MODULE_3__helpers_events__["a" /* default */].on('click', document, function (e) {
                    _this.closeOnExternal(e, { returnFocus: false });
                });

                _this.removeEscListener = __WEBPACK_IMPORTED_MODULE_3__helpers_events__["a" /* default */].onKeydown(27, document, function () {
                    _this.close({ returnFocus: true });
                });

                if (_this.closeOnScroll) {
                    _this.removeScrollListener = __WEBPACK_IMPORTED_MODULE_3__helpers_events__["a" /* default */].on('scroll', document, function (e) {
                        _this.closeOnExternal(e, { returnFocus: true });
                    });
                }
            }, 0);
        },
        removeCloseEventListeners: function removeCloseEventListeners() {
            if (this.removeExternalClickListener) {
                this.removeExternalClickListener();
                this.removeExternalClickListener = null;
            }

            if (this.removeEscListener) {
                this.removeEscListener();
                this.removeEscListener = null;
            }

            if (this.removeScrollListener) {
                this.removeScrollListener();
                this.removeScrollListener = null;
            }
        }
    },

    components: {
        UiFocusContainer: __WEBPACK_IMPORTED_MODULE_4__UiFocusContainer_vue__["a" /* default */]
    }
};

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-preloader',

    props: {
        show: {
            type: Boolean,
            required: true
        }
    }
};

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-progress-circular',

    props: {
        type: {
            type: String,
            default: 'indeterminate' },
        color: {
            type: String,
            default: 'primary' },
        progress: {
            type: Number,
            default: 0
        },
        size: {
            type: Number,
            default: 32
        },
        stroke: Number,
        autoStroke: {
            type: Boolean,
            default: true
        },
        disableTransition: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-progress-circular--color-' + this.color, 'ui-progress-circular--type-' + this.type];
        },
        strokeDashArray: function strokeDashArray() {
            var circumference = 2 * Math.PI * this.radius;

            return Math.round(circumference * 1000) / 1000;
        },
        strokeDashOffset: function strokeDashOffset() {
            var progress = this.moderateProgress(this.progress);
            var circumference = 2 * Math.PI * this.radius;

            return (100 - progress) / 100 * circumference;
        },
        radius: function radius() {
            var stroke = this.stroke ? this.stroke : 4;
            return (this.size - stroke) / 2;
        },
        calculatedStroke: function calculatedStroke() {
            if (this.stroke) {
                return this.stroke;
            }

            if (this.autoStroke) {
                return parseInt(this.size / 8, 10);
            }

            return 4;
        }
    },

    methods: {
        moderateProgress: function moderateProgress(progress) {
            if (isNaN(progress) || progress < 0) {
                return 0;
            }

            if (progress > 100) {
                return 100;
            }

            return progress;
        }
    }
};

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-progress-linear',

    props: {
        type: {
            type: String,
            default: 'indeterminate' },
        color: {
            type: String,
            default: 'primary' },
        progress: {
            type: Number,
            default: 0
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-progress-linear--color-' + this.color, 'ui-progress-linear--type-' + this.type];
        },
        moderatedProgress: function moderatedProgress() {
            if (this.progress < 0) {
                return 0;
            }

            if (this.progress > 100) {
                return 100;
            }

            return this.progress;
        }
    }
};

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-radio',

    props: {
        name: String,
        label: String,
        tabindex: [String, Number],
        value: {
            type: [Number, String],
            required: true
        },
        trueValue: {
            type: [Number, String],
            required: true
        },
        checked: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'primary' },
        buttonPosition: {
            type: String,
            default: 'left' },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-radio--color-' + this.color, 'ui-radio--button-position-' + this.buttonPosition, { 'is-active': this.isActive }, { 'is-checked': this.isChecked }, { 'is-disabled': this.disabled }];
        },
        isChecked: function isChecked() {
            return this.value === this.trueValue;
        }
    },

    created: function created() {
        if (this.checked) {
            this.$emit('input', this.trueValue);
        }
    },


    methods: {
        focus: function focus() {
            this.$refs.input.focus();
        },
        toggleCheck: function toggleCheck() {
            if (!this.disabled) {
                this.$emit('input', this.trueValue);
            }
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);
        },
        onChange: function onChange(e) {
            this.$emit('change', this.isChecked, e);
        }
    }
};

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiRadio_vue__ = __webpack_require__(18);




/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-radio-group',

    props: {
        name: {
            type: String,
            required: true
        },
        tabindex: [String, Number],
        label: String,
        options: {
            type: Array,
            required: true
        },
        value: {
            type: [Number, String],
            required: true
        },
        keys: {
            type: Object,
            default: function _default() {
                return {
                    id: 'id',
                    class: 'class',
                    label: 'label',
                    value: 'value',
                    checked: 'checked',
                    disabled: 'disabled'
                };
            }
        },
        color: {
            type: String,
            default: 'primary' },
        buttonPosition: {
            type: String,
            default: 'left' },
        vertical: {
            type: Boolean,
            default: false
        },
        help: String,
        error: String,
        invalid: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false,
            initialValue: this.value,
            selectedOptionValue: this.value
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-radio-group--color-' + this.color, 'ui-radio-group--button-position-' + this.buttonPosition, { 'is-vertical': this.vertical }, { 'is-active': this.isActive }, { 'is-invalid': this.invalid }, { 'is-disabled': this.disabled }];
        },
        hasFeedback: function hasFeedback() {
            return this.showError || this.showHelp;
        },
        showError: function showError() {
            return this.invalid && (Boolean(this.error) || Boolean(this.$slots.error));
        },
        showHelp: function showHelp() {
            return Boolean(this.help) || Boolean(this.$slots.help);
        }
    },

    watch: {
        selectedOptionValue: function selectedOptionValue() {
            this.$emit('input', this.selectedOptionValue);
            this.$emit('change', this.selectedOptionValue);
        },
        value: function value() {
            this.selectedOptionValue = this.value;
        }
    },

    methods: {
        reset: function reset() {
            this.$emit('input', this.initialValue);
        },
        isOptionCheckedByDefault: function isOptionCheckedByDefault(option) {
            return this.initialValue == option[this.keys.value] || this.initialValue == option || option[this.keys.checked];
        },
        getTrueValue: function getTrueValue(option) {
            if (typeof option === 'string' || typeof option === 'number') {
                return option;
            }

            var value = option[this.keys.value];

            if (value === undefined) {
                console.warn('[UiRadioGroup] option has no `value`: ', option);
                return option;
            }

            return value;
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);
        }
    },

    components: {
        UiRadio: __WEBPACK_IMPORTED_MODULE_0__UiRadio_vue__["a" /* default */]
    }
};

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_classlist__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_element_ref__ = __webpack_require__(13);




var startRipple = function startRipple(eventType, event) {
    var holder = event.currentTarget || event.target;

    if (holder && !__WEBPACK_IMPORTED_MODULE_0__helpers_classlist__["a" /* default */].has(holder, 'ui-ripple-ink')) {
        holder = holder.querySelector('.ui-ripple-ink');
    }

    if (!holder) {
        return;
    }

    var prev = holder.getAttribute('data-ui-event');

    if (prev && prev !== eventType) {
        return;
    }

    holder.setAttribute('data-ui-event', eventType);

    var rect = holder.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var ripple = document.createElement('div');
    var max = void 0;

    if (rect.width === rect.height) {
        max = rect.width * 1.412;
    } else {
        max = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
    }

    var size = max * 2 + 'px';

    ripple.style.width = size;
    ripple.style.height = size;
    ripple.style.marginLeft = -max + x + 'px';
    ripple.style.marginTop = -max + y + 'px';

    ripple.className = 'ui-ripple-ink__ink';
    holder.appendChild(ripple);

    setTimeout(function () {
        __WEBPACK_IMPORTED_MODULE_0__helpers_classlist__["a" /* default */].add(ripple, 'is-held');
    }, 0);

    var releaseEvent = eventType === 'mousedown' ? 'mouseup' : 'touchend';

    var handleRelease = function handleRelease() {
        document.removeEventListener(releaseEvent, handleRelease);

        __WEBPACK_IMPORTED_MODULE_0__helpers_classlist__["a" /* default */].add(ripple, 'is-done');

        var timeout = 650;

        setTimeout(function () {
            holder.removeChild(ripple);

            if (holder.children.length === 0) {
                holder.removeAttribute('data-ui-event');
            }
        }, timeout);
    };

    document.addEventListener(releaseEvent, handleRelease);
};

var handleMouseDown = function handleMouseDown(e) {
    if (e.button === 0) {
        startRipple(e.type, e);
    }
};

var handleTouchStart = function handleTouchStart(e) {
    if (e.changedTouches) {
        for (var i = 0; i < e.changedTouches.length; ++i) {
            startRipple(e.type, e.changedTouches[i]);
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-ripple-ink',

    props: {
        trigger: {
            validator: function validator(value) {
                return __WEBPACK_IMPORTED_MODULE_1__helpers_element_ref__["a" /* default */].validate(value, '[UiRippleInk]: Invalid prop: "trigger". Expected Element, VueComponent or CSS selector string.');
            }
        }
    },

    watch: {
        trigger: function trigger() {
            this.setupRipple();
        }
    },

    created: function created() {
        this.triggerEl = null;
    },
    mounted: function mounted() {
        this.setupRipple();
    },
    beforeDestroy: function beforeDestroy() {
        this.destroyRipple();
    },


    methods: {
        setupRipple: function setupRipple() {
            this.triggerEl = __WEBPACK_IMPORTED_MODULE_1__helpers_element_ref__["a" /* default */].resolve(this.trigger, this.$el.parentElement);

            if (!this.triggerEl) {
                console.error('[UiRippleInk]: Trigger element not found.');
                return;
            }

            this.triggerEl.addEventListener('touchstart', handleTouchStart);
            this.triggerEl.addEventListener('mousedown', handleMouseDown);
        },
        destroyRipple: function destroyRipple() {
            if (!this.triggerEl) {
                return;
            }

            this.triggerEl.removeEventListener('mousedown', handleMouseDown);
            this.triggerEl.removeEventListener('touchstart', handleTouchStart);
        }
    }
};

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiPopover_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UiProgressCircular_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UiSelectOption_vue__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mixins_RespondsToExternalClick__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_util__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_element_scroll__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_fuzzysearch__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_fuzzysearch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_fuzzysearch__);













/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-select',

    props: {
        name: String,
        tabindex: [String, Number],
        value: {
            type: [String, Number, Object, Array],
            required: true
        },
        options: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        placeholder: String,
        icon: String,
        iconPosition: {
            type: String,
            default: 'left' },
        label: String,
        floatingLabel: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'basic' },
        multiple: {
            type: Boolean,
            default: false
        },
        multipleDelimiter: {
            type: String,
            default: ', '
        },
        hasSearch: {
            type: Boolean,
            default: false
        },
        searchPlaceholder: {
            type: String,
            default: 'Search'
        },
        filter: Function,
        disableFilter: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        noResults: {
            type: Boolean,
            default: false
        },
        keys: {
            type: Object,
            default: function _default() {
                return {
                    class: 'class',
                    label: 'label',
                    value: 'value',
                    image: 'image'
                };
            }
        },
        invalid: {
            type: Boolean,
            default: false
        },
        help: String,
        error: String,
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            query: '',
            isActive: false,
            isTouched: false,
            selectedIndex: -1,
            highlightedIndex: -1,
            initialValue: JSON.stringify(this.value)
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-select--type-' + this.type, 'ui-select--icon-position-' + this.iconPosition, { 'is-active': this.isActive }, { 'is-invalid': this.invalid }, { 'is-touched': this.isTouched }, { 'is-disabled': this.disabled }, { 'is-multiple': this.multiple }, { 'has-label': this.hasLabel }, { 'has-floating-label': this.hasFloatingLabel }];
        },
        labelClasses: function labelClasses() {
            return {
                'is-inline': this.hasFloatingLabel && this.isLabelInline,
                'is-floating': this.hasFloatingLabel && !this.isLabelInline
            };
        },
        hasLabel: function hasLabel() {
            return Boolean(this.label) || Boolean(this.$slots.default);
        },
        hasFloatingLabel: function hasFloatingLabel() {
            return this.hasLabel && this.floatingLabel;
        },
        isLabelInline: function isLabelInline() {
            return this.value.length === 0 && !this.isActive;
        },
        hasFeedback: function hasFeedback() {
            return this.showError || this.showHelp;
        },
        showError: function showError() {
            return this.invalid && (Boolean(this.error) || Boolean(this.$slots.error));
        },
        showHelp: function showHelp() {
            return Boolean(this.help) || Boolean(this.$slots.help);
        },
        filteredOptions: function filteredOptions() {
            var _this = this;

            if (this.disableFilter) {
                return this.options;
            }

            var options = this.options.filter(function (option) {
                if (_this.filter) {
                    return _this.filter(option, _this.query, _this.defaultFilter);
                }

                return _this.defaultFilter(option, _this.query);
            });

            if (this.sort) {
                options.sort(this.sort.bind(this));
            }

            return options;
        },
        displayText: function displayText() {
            var _this2 = this;

            if (this.multiple) {
                if (this.value.length > 0) {
                    return this.value.map(function (value) {
                        return value[_this2.keys.label] || value;
                    }).join(this.multipleDelimiter);
                }

                return '';
            }

            return this.value ? this.value[this.keys.label] || this.value : '';
        },
        hasDisplayText: function hasDisplayText() {
            return Boolean(this.displayText.length);
        },
        hasNoResults: function hasNoResults() {
            if (this.loading || this.query.length === 0) {
                return false;
            }

            return this.disableFilter ? this.noResults : this.filteredOptions.length === 0;
        },
        submittedValue: function submittedValue() {
            var _this3 = this;

            if (!this.name || !this.value) {
                return;
            }

            if (Array.isArray(this.value)) {
                return this.value.map(function (option) {
                    return option[_this3.keys.value] || option;
                }).join(',');
            }

            return this.value[this.keys.value] || this.value;
        }
    },

    watch: {
        filteredOptions: function filteredOptions() {
            this.highlightedIndex = 0;
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__helpers_element_scroll__["a" /* resetScroll */])(this.$refs.optionsList);
        },
        query: function query() {
            this.$emit('query-change', this.query);
        },
        isActive: function isActive(value) {
            if (value) {
                this.addExternalClickListener(this.$el, this.onExternalClick);
            } else {
                this.removeExternalClickListener();
            }
        }
    },

    created: function created() {
        if (!this.value || this.value === '') {
            this.setValue(null);
        }
    },


    methods: {
        setValue: function setValue(value) {
            value = value ? value : this.multiple ? [] : '';

            this.$emit('input', value);
            this.$emit('change', value);
        },
        highlightOption: function highlightOption(index) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { autoScroll: true };

            if (this.highlightedIndex === index || this.$refs.options.length === 0) {
                return;
            }

            var firstIndex = 0;
            var lastIndex = this.$refs.options.length - 1;

            if (index < firstIndex) {
                index = lastIndex;
            } else if (index > lastIndex) {
                index = firstIndex;
            }

            this.highlightedIndex = index;

            if (options.autoScroll) {
                this.scrollOptionIntoView(this.$refs.options[index].$el);
            }
        },
        selectHighlighted: function selectHighlighted(index, e) {
            if (this.$refs.options.length > 0) {
                e.preventDefault();
                this.selectOption(this.$refs.options[index].option, index);
            }
        },
        selectOption: function selectOption(option, index) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { autoClose: true };

            var shouldSelect = this.multiple && !this.isOptionSelected(option);

            if (this.multiple) {
                this.updateOption(option, { select: shouldSelect });
            } else {
                this.setValue(option);
                this.selectedIndex = index;
            }

            this.$emit('select', option, {
                selected: this.multiple ? shouldSelect : true
            });

            this.highlightedIndex = index;

            if (!this.multiple) {
                this.clearQuery();
            }

            if (!this.multiple && options.autoClose) {
                this.closeDropdown();
            }
        },
        isOptionSelected: function isOptionSelected(option) {
            if (this.multiple) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__helpers_util__["c" /* looseIndexOf */])(this.value, option) > -1;
            }

            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__helpers_util__["b" /* looseEqual */])(this.value, option);
        },
        updateOption: function updateOption(option) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { select: true };

            var value = [];
            var updated = false;
            var i = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__helpers_util__["c" /* looseIndexOf */])(this.value, option);

            if (options.select && i < 0) {
                value = this.value.concat(option);
                updated = true;
            }

            if (!options.select && i > -1) {
                value = this.value.slice(0, i).concat(this.value.slice(i + 1));
                updated = true;
            }

            if (updated) {
                this.setValue(value);
            }
        },
        defaultFilter: function defaultFilter(option, query) {
            var text = option[this.keys.label] || option;

            if (typeof text === 'string') {
                text = text.toLowerCase();
            }

            return __WEBPACK_IMPORTED_MODULE_7_fuzzysearch___default()(query.toLowerCase(), text);
        },
        clearSelection: function clearSelection() {
            this.setValue(null);
        },
        clearQuery: function clearQuery() {
            this.query = '';
        },
        focus: function focus() {
            this.$refs.label.focus();
        },
        toggleDropdown: function toggleDropdown() {
            this.$refs.dropdown.toggle();
        },
        openDropdown: function openDropdown() {
            if (this.disabled) {
                return;
            }

            this.$refs.dropdown.open();
        },
        closeDropdown: function closeDropdown() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { blurAfterClose: false };

            this.$refs.dropdown.close();

            if (!this.isTouched) {
                this.isTouched = true;
                this.$emit('touch');
            }

            if (options.blurAfterClose) {
                this.isActive = false;
            } else {
                this.$refs.label.focus();
            }
        },
        onFocus: function onFocus(e) {
            if (this.isActive) {
                return;
            }

            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);

            if (this.$refs.dropdown.isOpen()) {
                this.closeDropdown({ blurAfterClose: true });
            }
        },
        onOpen: function onOpen() {
            var _this4 = this;

            this.isActive = true;

            this.$refs.dropdown.$el.style.width = this.$refs.label.getBoundingClientRect().width + 'px';

            this.$nextTick(function () {
                _this4.scrollOptionIntoView(_this4.$refs.optionsList.querySelector('.is-selected'));
            });

            this.$emit('dropdown-open');
        },
        onReveal: function onReveal() {
            this.$refs[this.hasSearch ? 'searchInput' : 'dropdownContent'].focus();
        },
        onClose: function onClose() {
            this.highlightedIndex = this.multiple ? -1 : this.selectedIndex;
            this.$emit('dropdown-close');
        },
        onExternalClick: function onExternalClick() {
            if (this.$refs.dropdown.isOpen()) {
                this.closeDropdown({ blurAfterClose: true });
            } else if (this.isActive) {
                this.isActive = false;
            }
        },
        scrollOptionIntoView: function scrollOptionIntoView(optionEl) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__helpers_element_scroll__["b" /* scrollIntoView */])(optionEl, {
                container: this.$refs.optionsList,
                marginTop: 180
            });
        },
        reset: function reset() {
            this.setValue(JSON.parse(this.initialValue));
            this.clearQuery();
            this.resetTouched();

            this.selectedIndex = -1;
            this.highlightedIndex = -1;
        },
        resetTouched: function resetTouched() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { touched: false };

            this.isTouched = options.touched;
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiPopover: __WEBPACK_IMPORTED_MODULE_1__UiPopover_vue__["a" /* default */],
        UiProgressCircular: __WEBPACK_IMPORTED_MODULE_2__UiProgressCircular_vue__["a" /* default */],
        UiSelectOption: __WEBPACK_IMPORTED_MODULE_3__UiSelectOption_vue__["a" /* default */]
    },

    mixins: [__WEBPACK_IMPORTED_MODULE_4__mixins_RespondsToExternalClick__["a" /* default */]]
};

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);




/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-select-option',

    props: {
        option: {
            type: [String, Number, Object],
            required: true
        },
        type: {
            type: String,
            default: 'basic' },
        multiple: {
            type: Boolean,
            default: false
        },
        highlighted: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        },
        keys: {
            type: Object,
            default: function _default() {
                return {
                    class: 'class',
                    label: 'label',
                    image: 'image'
                };
            }
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-select-option--type-' + this.type, this.option[this.keys.class], { 'is-highlighted': this.highlighted }, { 'is-selected': this.selected }];
        },
        imageStyle: function imageStyle() {
            return { 'background-image': 'url(' + this.option[this.keys.image] + ')' };
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */]
    }
};

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classlist__ = __webpack_require__(5);






/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-slider',

    props: {
        name: String,
        tabindex: [String, Number],
        icon: String,
        value: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        step: {
            type: Number,
            default: 10
        },
        snapToSteps: {
            type: Boolean,
            default: false
        },
        showMarker: {
            type: Boolean,
            default: false
        },
        markerValue: [String, Number],
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            initialValue: this.value,
            isActive: false,
            isDragging: false,
            localValue: this.value
        };
    },


    computed: {
        classes: function classes() {
            return [{ 'is-dragging': this.isDragging }, { 'is-disabled': this.disabled }, { 'is-active': this.isActive }, { 'has-icon': this.hasIcon }, { 'has-marker': this.showMarker }];
        },
        hasIcon: function hasIcon() {
            return Boolean(this.$slots.icon) || Boolean(this.icon);
        },
        fillStyle: function fillStyle() {
            return { transform: 'scaleX(' + this.relativeValue(this.localValue) + ')' };
        },
        thumbStyle: function thumbStyle() {
            return {
                left: this.relativeValue(this.localValue) * 100 + '%'
            };
        },
        markerText: function markerText() {
            return this.markerValue === undefined ? this.value : this.markerValue;
        },
        snapPoints: function snapPoints() {
            var points = [];
            var point = this.step * Math.ceil(this.moderatedMin / this.step);

            while (point <= this.moderatedMax) {
                points.push(point);
                point += this.step;
            }

            return points;
        },
        moderatedMin: function moderatedMin() {
            return this.max > this.min ? this.min : 0;
        },
        moderatedMax: function moderatedMax() {
            return this.max > this.min ? this.max : 100;
        }
    },

    watch: {
        value: function value() {
            this.setValue(this.value);
        },
        isDragging: function isDragging() {
            var operation = this.isDragging ? 'add' : 'remove';
            __WEBPACK_IMPORTED_MODULE_1__helpers_classlist__["a" /* default */][operation](document.body, 'ui-slider--is-dragging');
        }
    },

    mounted: function mounted() {
        this.initializeSlider();
    },
    beforeDestroy: function beforeDestroy() {
        this.teardownSlider();
    },


    methods: {
        focus: function focus() {
            this.$el.focus();
        },
        reset: function reset() {
            this.setValue(this.initialValue);
        },
        onFocus: function onFocus() {
            this.isActive = true;
            this.$emit('focus');
        },
        onBlur: function onBlur() {
            this.isActive = false;
            this.$emit('blur');
        },
        onExternalClick: function onExternalClick(e) {
            if (!this.$el.contains(e.target)) {
                this.onBlur();
            }
        },
        setValueWithSnap: function setValueWithSnap(value) {
            value = this.moderateValue(value);

            if (this.snapToSteps) {
                value = this.getNearestSnapPoint(value);
            }

            this.setValue(value);
        },
        setValue: function setValue(value) {
            value = this.moderateValue(value);

            if (value === this.localValue) {
                return;
            }

            this.localValue = value;
            this.$emit('input', value);
            this.$emit('change', value);
        },
        incrementValue: function incrementValue() {
            this.setValueWithSnap(this.localValue + this.step);
        },
        decrementValue: function decrementValue() {
            this.setValueWithSnap(this.localValue - this.step);
        },
        getTrackOffset: function getTrackOffset() {
            var el = this.$refs.track;
            var offset = el.offsetLeft;

            while (el.offsetParent) {
                el = el.offsetParent;
                offset += el.offsetLeft;
            }

            return offset;
        },
        getPointStyle: function getPointStyle(point) {
            return {
                left: point + '%'
            };
        },
        initializeSlider: function initializeSlider() {
            document.addEventListener('touchend', this.onDragStop);
            document.addEventListener('mouseup', this.onDragStop);
            document.addEventListener('click', this.onExternalClick);
            this.initializeDrag();
        },
        teardownSlider: function teardownSlider() {
            document.removeEventListener('touchend', this.onDragStop);
            document.removeEventListener('mouseup', this.onDragStop);
            document.removeEventListener('click', this.onExternalClick);
        },
        initializeDrag: function initializeDrag() {
            var value = this.moderateValue(this.localValue ? this.localValue : 0);
            this.setValue(value);
        },
        onDragStart: function onDragStart(e) {
            if (this.disabled) {
                return;
            }

            if (!this.isActive) {
                this.onFocus();
            }

            this.isDragging = true;
            this.dragUpdate(e);

            document.addEventListener('touchmove', this.onDragMove);
            document.addEventListener('mousemove', this.onDragMove);

            this.$emit('dragstart', this.localValue, e);
        },
        onDragMove: function onDragMove(e) {
            this.dragUpdate(e);
        },
        dragUpdate: function dragUpdate(e) {
            var position = e.touches ? e.touches[0].pageX : e.pageX;
            var trackLength = this.$refs.track.offsetWidth;
            var relativeValue = (position - this.getTrackOffset()) / trackLength;
            var value = this.moderateValue(this.moderatedMin + relativeValue * (this.moderatedMax - this.moderatedMin));

            if (this.isDragging) {
                this.setValue(Math.round(value));
            }
        },
        onDragStop: function onDragStop(e) {
            if (this.isDragging) {
                this.isDragging = false;

                if (this.snapToSteps && this.value % this.step !== 0) {
                    this.setValueWithSnap(this.value);
                }

                document.removeEventListener('touchmove', this.onDragMove);
                document.removeEventListener('mousemove', this.onDragMove);

                this.$emit('dragend', this.localValue, e);
            }
        },
        getNearestSnapPoint: function getNearestSnapPoint(value) {
            var previousSnapPoint = Math.floor(value / this.step) * this.step;
            var nextSnapPoint = previousSnapPoint + this.step;
            var midpoint = (previousSnapPoint + nextSnapPoint) / 2;

            if (previousSnapPoint < this.moderatedMin) {
                if (nextSnapPoint > this.moderatedMax) {
                    return value;
                }
                return nextSnapPoint;
            }
            if (value >= midpoint && nextSnapPoint <= this.moderatedMax) {
                return nextSnapPoint;
            }
            return previousSnapPoint;
        },
        relativeValue: function relativeValue(value) {
            return (value - this.moderatedMin) / (this.moderatedMax - this.moderatedMin);
        },
        moderateValue: function moderateValue(value) {
            if (value < this.moderatedMin) {
                return this.moderatedMin;
            }

            if (value > this.moderatedMax) {
                return this.moderatedMax;
            }

            return value;
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */]
    }
};

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiButton_vue__ = __webpack_require__(7);




/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-snackbar',

    props: {
        message: String,
        action: String,
        actionColor: {
            type: String,
            default: 'accent' },
        transition: {
            type: String,
            default: 'slide' }
    },

    computed: {
        transitionName: function transitionName() {
            return 'ui-snackbar--transition-' + this.transition;
        }
    },

    methods: {
        onClick: function onClick() {
            this.$emit('click');
        },
        onActionClick: function onActionClick() {
            this.$emit('action-click');
        },
        onEnter: function onEnter() {
            this.$emit('show');
        },
        onLeave: function onLeave() {
            this.$emit('hide');
        }
    },

    components: {
        UiButton: __WEBPACK_IMPORTED_MODULE_0__UiButton_vue__["a" /* default */]
    }
};

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiSnackbar_vue__ = __webpack_require__(19);




/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-snackbar-container',

    props: {
        queueSnackbars: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            default: 5000
        },
        allowHtml: {
            type: Boolean,
            default: false
        },
        position: {
            type: String,
            default: 'left' },
        transition: {
            type: String,
            default: 'slide' }
    },

    data: function data() {
        return {
            queue: [],
            snackbarTimeout: null
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-snackbar-container--position-' + this.position];
        }
    },

    beforeDestroy: function beforeDestroy() {
        this.resetTimeout();
    },


    methods: {
        createSnackbar: function createSnackbar(snackbar) {
            snackbar.show = false;
            snackbar.duration = snackbar.duration || this.duration;

            this.queue.push(snackbar);

            if (this.queue.length === 1) {
                return this.showNextSnackbar();
            } else if (!this.queueSnackbars) {
                this.queue[0].show = false;
            }
        },
        showNextSnackbar: function showNextSnackbar() {
            if (this.queue.length === 0) {
                this.$emit('queue-end');
                return;
            }

            this.queue[0].show = true;
        },
        onShow: function onShow(snackbar) {
            var _this = this;

            if (this.queue.indexOf(snackbar) !== 0) {
                return;
            }

            this.snackbarTimeout = setTimeout(function () {
                _this.queue[0].show = false;
            }, snackbar.duration);

            this.$emit('snackbar-show', snackbar);
            this.callHook('onShow', snackbar);
        },
        onHide: function onHide(snackbar, index) {
            this.resetTimeout();

            if (this.queueSnackbars || this.queue.length === 1) {
                this.queue.splice(index, 1);
            } else {
                this.queue.splice(index, this.queue.length - 1);
            }

            this.$emit('snackbar-hide', snackbar);
            this.callHook('onHide', snackbar);

            this.showNextSnackbar();
        },
        onClick: function onClick(snackbar) {
            snackbar.show = false;
            this.callHook('onClick', snackbar);
        },
        onActionClick: function onActionClick(snackbar) {
            this.callHook('onActionClick', snackbar);
        },
        callHook: function callHook(hook, snackbar) {
            if (typeof snackbar[hook] === 'function') {
                snackbar[hook].call(undefined, snackbar);
            }
        },
        resetTimeout: function resetTimeout() {
            clearTimeout(this.snackbarTimeout);
            this.snackbarTimeout = null;
        }
    },

    components: {
        UiSnackbar: __WEBPACK_IMPORTED_MODULE_0__UiSnackbar_vue__["a" /* default */]
    }
};

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_util__ = __webpack_require__(6);




/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-switch',

    props: {
        name: String,
        label: String,
        tabindex: [String, Number],
        value: {
            required: true
        },
        trueValue: {
            default: true
        },
        falseValue: {
            default: false
        },
        submittedValue: {
            type: String,
            default: 'on' },
        checked: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'primary' },
        switchPosition: {
            type: String,
            default: 'left' },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false,
            isChecked: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_util__["b" /* looseEqual */])(this.value, this.trueValue) || this.checked,
            initialValue: this.value
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-switch--color-' + this.color, 'ui-switch--switch-position-' + this.switchPosition, { 'is-active': this.isActive }, { 'is-checked': this.isChecked }, { 'is-disabled': this.disabled }];
        }
    },

    watch: {
        value: function value() {
            this.isChecked = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers_util__["b" /* looseEqual */])(this.value, this.trueValue);
        }
    },

    created: function created() {
        this.$emit('input', this.isChecked ? this.trueValue : this.falseValue);
    },


    methods: {
        focus: function focus() {
            this.$refs.input.focus();
        },
        onClick: function onClick(e) {
            var isCheckedPrevious = this.isChecked;
            var isChecked = e.target.checked;

            this.$emit('input', isChecked ? this.trueValue : this.falseValue, e);

            if (isCheckedPrevious !== isChecked) {
                this.$emit('change', isChecked ? this.trueValue : this.falseValue, e);
            }
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);
        }
    }
};

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_uuid__ = __webpack_require__(23);




/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-tab',

    props: {
        id: {
            type: String,
            default: function _default() {
                return __WEBPACK_IMPORTED_MODULE_0__helpers_uuid__["a" /* default */].short('ui-tab-');
            }
        },
        title: String,
        selected: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false
        };
    },


    watch: {
        disabled: function disabled() {
            this.$parent.onTabDisabledChange(this);
        }
    },

    created: function created() {
        this.$parent.addTab(this);
    },
    beforeDestroy: function beforeDestroy() {
        this.$parent.removeTab(this);
    },


    methods: {
        activate: function activate() {
            this.isActive = true;
            this.$emit('select', this.id);
        },
        deactivate: function deactivate() {
            this.isActive = false;
            this.$emit('deselect', this.id);
        }
    }
};

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__ = __webpack_require__(2);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-tab-header-item',

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_0__UiIcon_vue__["a" /* default */],
        UiRippleInk: __WEBPACK_IMPORTED_MODULE_1__UiRippleInk_vue__["a" /* default */]
    },

    props: {
        id: String,
        type: {
            type: String,
            default: 'text' },
        title: String,
        active: {
            type: Boolean,
            default: false
        },
        disableRipple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-tab-header-item--type-' + this.type, { 'is-active': this.active }, { 'is-disabled': this.disabled }];
        },
        hasIcon: function hasIcon() {
            return this.type === 'icon' || this.type === 'icon-and-text';
        },
        hasText: function hasText() {
            return this.type === 'text' || this.type === 'icon-and-text';
        }
    }
};

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__render__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiTabHeaderItem_vue__ = __webpack_require__(144);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-tabs',

    components: {
        Render: __WEBPACK_IMPORTED_MODULE_0__render__["a" /* default */],
        UiTabHeaderItem: __WEBPACK_IMPORTED_MODULE_1__UiTabHeaderItem_vue__["a" /* default */]
    },

    props: {
        type: {
            type: String,
            default: 'text' },
        confirmTabChange: Function,
        backgroundColor: {
            type: String,
            default: 'default' },
        textColor: {
            type: String,
            default: 'black' },
        textColorActive: {
            type: String,
            default: 'primary' },
        indicatorColor: {
            type: String,
            default: 'primary' },
        fullwidth: {
            type: Boolean,
            default: false
        },
        raised: {
            type: Boolean,
            default: false
        },
        disableRipple: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            tabs: [],
            activeTabId: null,
            activeTabIndex: -1
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-tabs--type-' + this.type, 'ui-tabs--text-color-' + this.textColor, 'ui-tabs--text-color-active-' + this.textColorActive, 'ui-tabs--background-color-' + this.backgroundColor, 'ui-tabs--indicator-color-' + this.indicatorColor, { 'is-raised': this.raised }, { 'is-fullwidth': this.fullwidth }];
        },
        hasIcon: function hasIcon() {
            return this.type === 'icon' || this.type === 'icon-and-text';
        }
    },

    watch: {
        activeTabId: function activeTabId() {
            var _this = this;

            this.tabs.forEach(function (tab, index) {
                if (_this.activeTabId === tab.id) {
                    tab.activate();
                    _this.activeTabIndex = index;
                } else if (tab.isActive) {
                    tab.deactivate();
                }
            });
        }
    },

    methods: {
        addTab: function addTab(tab) {
            this.tabs.push(tab);

            if (this.activeTabId === null || tab.selected) {
                this.activeTabId = tab.id;
            }
        },
        removeTab: function removeTab(tab) {
            var index = this.tabs.indexOf(tab);

            if (index > -1) {
                this.tabs.splice(index, 1);

                if (tab.id === this.activeTabId) {
                    this.selectTab(this.findNearestTab());
                }
            }
        },
        onTabDisabledChange: function onTabDisabledChange(tab) {
            if (tab.disabled && this.activeTabId === tab.id) {
                this.selectTab(this.findNearestTab());
            }
        },
        onTabClick: function onTabClick(tab, event) {
            this.$emit('tab-click', tab, event);
            this.selectTab(tab);
        },
        selectTab: function selectTab(tab) {
            if (tab === null || tab.disabled || tab.id === this.activeTabId) {
                return;
            }

            if (this.confirmTabChange && !this.confirmTabChange(this.tabs[this.activeTabIndex], tab)) {
                return;
            }

            this.activeTabId = tab.id;
            this.$emit('tab-change', tab);
        },
        selectNextTab: function selectNextTab() {
            var nextTab = this.findNextTab();

            if (nextTab) {
                this.selectTab(nextTab);
                nextTab.$el.focus();
            }
        },
        selectPreviousTab: function selectPreviousTab() {
            var previousTab = this.findPreviousTab();

            if (previousTab) {
                this.selectTab(previousTab);
                previousTab.$el.focus();
            }
        },
        findNextTab: function findNextTab() {
            var tab = null;

            for (var i = this.activeTabIndex + 1; i < this.$refs.tabHeaders.length; i++) {
                if (this.$refs.tabHeaders[i] && !this.$refs.tabHeaders[i].disabled) {
                    tab = this.$refs.tabHeaders[i];
                    break;
                }
            }

            return tab;
        },
        findPreviousTab: function findPreviousTab() {
            var tab = null;

            for (var i = this.activeTabIndex - 1; i >= 0; i--) {
                if (this.$refs.tabHeaders[i] && !this.$refs.tabHeaders[i].disabled) {
                    tab = this.$refs.tabHeaders[i];
                    break;
                }
            }

            return tab;
        },
        findNearestTab: function findNearestTab() {
            return this.findPreviousTab() || this.findNextTab();
        },
        findTabById: function findTabById(id) {
            for (var i = 0; i < this.$refs.tabHeaders.length; i++) {
                if (id === this.$refs.tabHeaders[i].id) {
                    return this.$refs.tabHeaders[i];
                }
            }

            return null;
        },
        setActiveTab: function setActiveTab(tabId) {
            var tab = this.findTabById(tabId);

            if (tab && !tab.disabled) {
                this.selectTab(tab);
            }
        }
    }
};

/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directives_autofocus__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_autosize__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_autosize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_autosize__);







/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-textbox',

    props: {
        name: String,
        placeholder: String,
        tabindex: [String, Number],
        value: {
            type: [String, Number],
            default: ''
        },
        icon: String,
        iconPosition: {
            type: String,
            default: 'left' },
        label: String,
        floatingLabel: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'text' },
        multiLine: {
            type: Boolean,
            default: false
        },
        rows: {
            type: Number,
            default: 2
        },
        autocomplete: String,
        autofocus: {
            type: Boolean,
            default: false
        },
        autosize: {
            type: Boolean,
            default: true
        },
        min: Number,
        max: Number,
        step: {
            type: [String, Number],
            default: 'any'
        },
        maxlength: Number,
        minlength: Number,
        enforceMaxlength: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        help: String,
        error: String,
        invalid: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            isActive: false,
            isTouched: false,
            initialValue: this.value,
            autosizeInitialized: false
        };
    },


    computed: {
        classes: function classes() {
            return ['ui-textbox--icon-position-' + this.iconPosition, { 'is-active': this.isActive }, { 'is-invalid': this.invalid }, { 'is-touched': this.isTouched }, { 'is-multi-line': this.multiLine }, { 'has-counter': this.maxlength }, { 'is-disabled': this.disabled }, { 'has-label': this.hasLabel }, { 'has-floating-label': this.hasFloatingLabel }];
        },
        labelClasses: function labelClasses() {
            return {
                'is-inline': this.hasFloatingLabel && this.isLabelInline,
                'is-floating': this.hasFloatingLabel && !this.isLabelInline
            };
        },
        hasLabel: function hasLabel() {
            return Boolean(this.label) || Boolean(this.$slots.default);
        },
        hasFloatingLabel: function hasFloatingLabel() {
            return this.hasLabel && this.floatingLabel;
        },
        isLabelInline: function isLabelInline() {
            return this.valueLength === 0 && !this.isActive;
        },
        minValue: function minValue() {
            if (this.type === 'number' && this.min !== undefined) {
                return this.min;
            }

            return null;
        },
        maxValue: function maxValue() {
            if (this.type === 'number' && this.max !== undefined) {
                return this.max;
            }

            return null;
        },
        stepValue: function stepValue() {
            return this.type === 'number' ? this.step : null;
        },
        valueLength: function valueLength() {
            return this.value ? this.value.length : 0;
        },
        hasFeedback: function hasFeedback() {
            return this.showError || this.showHelp;
        },
        showError: function showError() {
            return this.invalid && (Boolean(this.error) || Boolean(this.$slots.error));
        },
        showHelp: function showHelp() {
            return Boolean(this.help) || Boolean(this.$slots.help);
        }
    },

    created: function created() {
        if (this.value === null) {
            this.initialValue = '';
            this.updateValue('');
        }
    },
    mounted: function mounted() {
        if (this.multiLine && this.autosize) {
            __WEBPACK_IMPORTED_MODULE_2_autosize___default()(this.$refs.textarea);
            this.autosizeInitialized = true;
        }
    },
    beforeDestroy: function beforeDestroy() {
        if (this.autosizeInitialized) {
            __WEBPACK_IMPORTED_MODULE_2_autosize___default.a.destroy(this.$refs.textarea);
        }
    },


    methods: {
        updateValue: function updateValue(value) {
            this.$emit('input', value);
        },
        onChange: function onChange(e) {
            this.$emit('change', this.value, e);
        },
        onFocus: function onFocus(e) {
            this.isActive = true;
            this.$emit('focus', e);
        },
        onBlur: function onBlur(e) {
            this.isActive = false;
            this.$emit('blur', e);

            if (!this.isTouched) {
                this.isTouched = true;
                this.$emit('touch');
            }
        },
        onKeydown: function onKeydown(e) {
            this.$emit('keydown', e);
        },
        onKeydownEnter: function onKeydownEnter(e) {
            this.$emit('keydown-enter', e);
        },
        reset: function reset() {
            if (document.activeElement === this.$refs.input || document.activeElement === this.$refs.textarea) {
                document.activeElement.blur();
            }

            this.updateValue(this.initialValue);
            this.resetTouched();
        },
        resetTouched: function resetTouched() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { touched: false };

            this.isTouched = options.touched;
        },
        refreshSize: function refreshSize() {
            if (this.autosizeInitialized) {
                __WEBPACK_IMPORTED_MODULE_2_autosize___default.a.update(this.$refs.textarea);
            }
        },
        focus: function focus() {
            (this.$refs.input || this.$refs.textarea).focus();
        }
    },

    components: {
        UiIcon: __WEBPACK_IMPORTED_MODULE_1__UiIcon_vue__["a" /* default */]
    },

    directives: {
        autofocus: __WEBPACK_IMPORTED_MODULE_0__directives_autofocus__["a" /* default */]
    }
};

/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UiIconButton_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UiProgressLinear_vue__ = __webpack_require__(17);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-toolbar',

    props: {
        type: {
            type: String,
            default: 'default' },
        textColor: {
            type: String,
            default: 'black' },
        title: String,
        brand: String,
        removeBrandDivider: {
            type: Boolean,
            default: false
        },
        navIcon: {
            type: String,
            default: 'menu'
        },
        removeNavIcon: {
            type: Boolean,
            default: false
        },
        raised: {
            type: Boolean,
            default: true
        },
        progressPosition: {
            type: String,
            default: 'bottom' },
        loading: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classes: function classes() {
            return ['ui-toolbar--type-' + this.type, 'ui-toolbar--text-color-' + this.textColor, 'ui-toolbar--progress-position-' + this.progressPosition, { 'is-raised': this.raised }];
        },
        progressColor: function progressColor() {
            return this.textColor === 'black' ? 'primary' : 'white';
        },
        hasBrandDivider: function hasBrandDivider() {
            return this.removeBrandDivider ? false : this.brand || this.$slots.brand;
        }
    },

    methods: {
        navIconClick: function navIconClick() {
            this.$emit('nav-icon-click');
        }
    },

    components: {
        UiIconButton: __WEBPACK_IMPORTED_MODULE_0__UiIconButton_vue__["a" /* default */],
        UiProgressLinear: __WEBPACK_IMPORTED_MODULE_1__UiProgressLinear_vue__["a" /* default */]
    }
};

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tippy_js_esm__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_element_ref__ = __webpack_require__(13);





/* harmony default export */ __webpack_exports__["a"] = {
    name: 'ui-tooltip',

    props: {
        animation: {
            type: String,
            default: 'fade' },
        appendToBody: {
            type: Boolean,
            default: true
        },
        openDelay: {
            type: Number,
            default: 0
        },
        openOn: {
            type: String,
            default: 'mouseenter focus' },
        position: {
            type: String,
            default: 'bottom' },
        trigger: {
            validator: function validator(value) {
                return __WEBPACK_IMPORTED_MODULE_1__helpers_element_ref__["a" /* default */].validate(value, '[UiTooltip]: Invalid prop: "trigger". Expected Element, VueComponent or CSS selector string.');
            }
        },
        zIndex: Number
    },

    mounted: function mounted() {
        this.triggerEl = __WEBPACK_IMPORTED_MODULE_1__helpers_element_ref__["a" /* default */].resolve(this.trigger, this.$el.parentElement);

        if (!this.triggerEl) {
            console.error('[UiTooltip]: Trigger element not found.');
            return;
        }

        var options = {
            animateFill: this.animation !== 'fade',

            animation: this.animation === 'none' ? 'fade' : this.animation,
            arrow: false,
            content: this.$el,
            delay: [this.openDelay, 0],
            distance: 4,
            duration: this.animation === 'none' ? 0 : [250, 200],
            ignoreAttributes: true,
            lazy: true,
            multiple: true,
            placement: this.position,
            theme: 'ui-tooltip',
            trigger: this.openOn.replace('hover', 'mouseenter'),
            zIndex: this.zIndex,
            popperOptions: {
                modifiers: {
                    computeStyle: {
                        gpuAcceleration: !(window.devicePixelRatio < 1.5 && /Win/.test(navigator.platform))
                    }
                }
            }
        };

        if (!this.appendToBody) {
            options.appendTo = this.triggerEl.parentElement;
        }

        this.tip = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tippy_js_esm__["a" /* default */])(this.triggerEl, options);
    },
    beforeDestroy: function beforeDestroy() {
        if (this.tip) {
            this.tip.destroy();
            this.tip = null;
        }
    }
};

/***/ }),
/* 94 */
/***/ (function(module, exports) {


document.addEventListener('DOMContentLoaded', function () {
    var hadKeyboardEvent = false;
    var keyboardModalityWhitelist = ['input:not([type])', 'input[type=text]', 'input[type=number]', 'input[type=date]', 'input[type=time]', 'input[type=datetime]', 'textarea', '[role=textbox]', '[supports-modality=keyboard]'].join(',');

    var isHandlingKeyboardThrottle = void 0;

    var matcher = function () {
        var el = document.body;

        if (el.matchesSelector) {
            return el.matchesSelector;
        }

        if (el.webkitMatchesSelector) {
            return el.webkitMatchesSelector;
        }

        if (el.mozMatchesSelector) {
            return el.mozMatchesSelector;
        }

        if (el.msMatchesSelector) {
            return el.msMatchesSelector;
        }

        console.error('Couldn\'t find any matchesSelector method on document.body.');
    }();

    var disableFocusRingByDefault = function disableFocusRingByDefault() {
        var css = 'body:not([modality=keyboard]) :focus { outline: none; }';
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        style.id = 'disable-focus-ring';

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.insertBefore(style, head.firstChild);
    };

    var focusTriggersKeyboardModality = function focusTriggersKeyboardModality(el) {
        var triggers = false;

        if (matcher) {
            triggers = matcher.call(el, keyboardModalityWhitelist) && matcher.call(el, ':not([readonly])');
        }

        return triggers;
    };

    disableFocusRingByDefault();

    document.body.addEventListener('keydown', function () {
        hadKeyboardEvent = true;

        if (isHandlingKeyboardThrottle) {
            clearTimeout(isHandlingKeyboardThrottle);
        }

        isHandlingKeyboardThrottle = setTimeout(function () {
            hadKeyboardEvent = false;
        }, 100);
    }, true);

    document.body.addEventListener('focus', function (e) {
        if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
            document.body.setAttribute('modality', 'keyboard');
        }
    }, true);

    document.body.addEventListener('blur', function () {
        document.body.removeAttribute('modality');
    }, true);
});

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = {
    name: 'render',

    functional: true,

    props: ['nodes'],

    render: function render(createElement, context) {
        return createElement('div', { class: 'ui-render' }, context.props.nodes);
    }
};

/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, optionsArgument) {
	var clone = !optionsArgument || optionsArgument.clone !== false;

	return (clone && isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, optionsArgument)
		: value
}

function defaultArrayMerge(target, source, optionsArgument) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, optionsArgument)
	})
}

function mergeObject(target, source, optionsArgument) {
	var destination = {};
	if (isMergeableObject(target)) {
		Object.keys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], optionsArgument);
		});
	}
	Object.keys(source).forEach(function(key) {
		if (!isMergeableObject(source[key]) || !target[key]) {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], optionsArgument);
		} else {
			destination[key] = deepmerge(target[key], source[key], optionsArgument);
		}
	});
	return destination
}

function deepmerge(target, source, optionsArgument) {
	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var options = optionsArgument || { arrayMerge: defaultArrayMerge };
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, optionsArgument)
	} else if (sourceIsArray) {
		var arrayMerge = options.arrayMerge || defaultArrayMerge;
		return arrayMerge(target, source, optionsArgument)
	} else {
		return mergeObject(target, source, optionsArgument)
	}
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, optionsArgument)
	}, {})
};

var deepmerge_1 = deepmerge;

/* harmony default export */ __webpack_exports__["a"] = deepmerge_1;


/***/ }),
/* 97 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 98 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 99 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 100 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 101 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 102 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 103 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 104 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 105 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 106 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 107 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 108 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 109 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 110 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 111 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 112 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 113 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 114 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 115 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 116 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 117 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 118 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 119 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 120 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 121 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 122 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 123 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 124 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 125 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 126 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 127 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 128 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 129 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 130 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 131 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 132 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 133 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 134 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 135 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 136 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 137 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 138 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.14.7
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

/* harmony default export */ __webpack_exports__["a"] = Popper;
//# sourceMappingURL=popper.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(187)))

/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiAutocompleteSuggestion_vue__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2ff3038a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiAutocompleteSuggestion_vue__ = __webpack_require__(152);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(104)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiAutocompleteSuggestion_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2ff3038a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiAutocompleteSuggestion_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiAutocompleteSuggestion.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiAutocompleteSuggestion.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ff3038a", Component.options)
  } else {
    hotAPI.reload("data-v-2ff3038a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 141 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendarWeek_vue__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c0bb760_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendarWeek_vue__ = __webpack_require__(156);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(108)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiCalendarWeek_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c0bb760_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiCalendarWeek_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiCalendarWeek.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiCalendarWeek.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3c0bb760", Component.options)
  } else {
    hotAPI.reload("data-v-3c0bb760", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 142 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiMenuOption_vue__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cb20b32_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiMenuOption_vue__ = __webpack_require__(164);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(116)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiMenuOption_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cb20b32_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiMenuOption_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiMenuOption.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiMenuOption.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5cb20b32", Component.options)
  } else {
    hotAPI.reload("data-v-5cb20b32", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSelectOption_vue__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a05cade2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSelectOption_vue__ = __webpack_require__(180);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(132)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiSelectOption_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a05cade2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiSelectOption_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiSelectOption.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiSelectOption.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a05cade2", Component.options)
  } else {
    hotAPI.reload("data-v-a05cade2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTabHeaderItem_vue__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_535cc9b2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTabHeaderItem_vue__ = __webpack_require__(161);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(113)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_UiTabHeaderItem_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_535cc9b2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_UiTabHeaderItem_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\UiTabHeaderItem.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UiTabHeaderItem.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-535cc9b2", Component.options)
  } else {
    hotAPI.reload("data-v-535cc9b2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = Component.exports;


/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-radio-group",
    class: _vm.classes
  }, [(_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-radio-group__label-text"
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-radio-group__radios"
  }, _vm._l((_vm.options), function(option) {
    return _c('ui-radio', {
      key: option[_vm.keys.id],
      staticClass: "ui-radio-group__radio",
      class: option[_vm.keys.class],
      attrs: {
        "button-position": _vm.buttonPosition,
        "checked": _vm.isOptionCheckedByDefault(option),
        "color": _vm.color,
        "disabled": _vm.disabled || option[_vm.keys.disabled],
        "id": option[_vm.keys.id],
        "name": _vm.name,
        "tabindex": _vm.tabindex,
        "true-value": _vm.getTrueValue(option)
      },
      on: {
        "blur": _vm.onBlur,
        "focus": _vm.onFocus
      },
      model: {
        value: (_vm.selectedOptionValue),
        callback: function($$v) {
          _vm.selectedOptionValue = $$v
        },
        expression: "selectedOptionValue"
      }
    }, [_vm._v(_vm._s(option[_vm.keys.label] || option))])
  }), 1), _vm._v(" "), (_vm.hasFeedback) ? _c('div', {
    staticClass: "ui-radio-group__feedback"
  }, [(_vm.showError) ? _c('div', {
    staticClass: "ui-radio-group__feedback-text"
  }, [_vm._t("error", [_vm._v(_vm._s(_vm.error))])], 2) : (_vm.showHelp) ? _c('div', {
    staticClass: "ui-radio-group__feedback-text"
  }, [_vm._t("help", [_vm._v(_vm._s(_vm.help))])], 2) : _vm._e()]) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0686b3c2", esExports)
  }
}

/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-slider",
    class: _vm.classes,
    attrs: {
      "role": "slider",
      "aria-valuemax": _vm.moderatedMax,
      "aria-valuemin": _vm.moderatedMin,
      "aria-valuenow": _vm.localValue,
      "tabindex": _vm.disabled ? null : (_vm.tabindex || '0')
    },
    on: {
      "blur": _vm.onBlur,
      "focus": _vm.onFocus,
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) { return null; }
        $event.preventDefault();
        return _vm.decrementValue($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "left", 37, $event.key, ["Left", "ArrowLeft"])) { return null; }
        if ('button' in $event && $event.button !== 0) { return null; }
        $event.preventDefault();
        return _vm.decrementValue($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "right", 39, $event.key, ["Right", "ArrowRight"])) { return null; }
        if ('button' in $event && $event.button !== 2) { return null; }
        $event.preventDefault();
        return _vm.incrementValue($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) { return null; }
        $event.preventDefault();
        return _vm.incrementValue($event)
      }]
    }
  }, [(_vm.name) ? _c('input', {
    staticClass: "ui-slider__hidden-input",
    attrs: {
      "type": "hidden",
      "name": _vm.name
    },
    domProps: {
      "value": _vm.value
    }
  }) : _vm._e(), _vm._v(" "), (_vm.hasIcon) ? _c('div', {
    staticClass: "ui-slider__icon"
  }, [_vm._t("icon", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    ref: "track",
    staticClass: "ui-slider__track",
    on: {
      "mousedown": _vm.onDragStart,
      "touchstart": _vm.onDragStart
    }
  }, [_c('div', {
    staticClass: "ui-slider__track-background"
  }, _vm._l((_vm.snapPoints), function(point) {
    return (_vm.snapToSteps) ? _c('span', {
      staticClass: "ui-slider__snap-point",
      style: ({
        left: 100 * _vm.relativeValue(point) + '%'
      })
    }) : _vm._e()
  }), 0), _vm._v(" "), _c('div', {
    staticClass: "ui-slider__track-fill",
    style: (_vm.fillStyle)
  }), _vm._v(" "), _c('div', {
    ref: "thumb",
    staticClass: "ui-slider__thumb",
    style: (_vm.thumbStyle)
  }, [(_vm.showMarker) ? _c('div', {
    staticClass: "ui-slider__marker"
  }, [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 24 24",
      "width": "36",
      "height": "36"
    }
  }, [_c('path', {
    attrs: {
      "d": "M11 .5c-1.7.2-3.4.9-4.7 2-1.1.9-2 2-2.5 3.2-1.2 2.4-1.2 5.1-.1 7.7 1.1 2.6 2.8 5 5.3 7.5 1.2 1.2 2.8 2.7 3 2.7 0 0 .3-.2.6-.5 3.2-2.7 5.6-5.6 7.1-8.5.8-1.5 1.1-2.6 1.3-3.8.2-1.4 0-2.9-.5-4.3-1.2-3.2-4.1-5.4-7.5-5.8-.5-.2-1.5-.2-2-.2z"
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "ui-slider__marker-text"
  }, [_vm._v(_vm._s(_vm.markerText))])]) : _vm._e()])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0d1a7c42", esExports)
  }
}

/***/ }),
/* 147 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": _vm.disableAnimation ? null : 'ui-alert--transition-toggle'
    }
  }, [_c('div', {
    staticClass: "ui-alert",
    class: _vm.classes,
    attrs: {
      "role": "alert"
    }
  }, [_c('div', {
    staticClass: "ui-alert__body"
  }, [(!_vm.removeIcon) ? _c('div', {
    staticClass: "ui-alert__icon"
  }, [_vm._t("icon", [(_vm.type === 'info') ? _c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M12.984 9V6.984h-1.97V9h1.97zm0 8.016v-6h-1.97v6h1.97zm-.984-15c5.53 0 9.984 4.453 9.984 9.984S17.53 21.984 12 21.984 2.016 17.53 2.016 12 6.47 2.016 12 2.016z"
    }
  })])]) : _vm._e(), _vm._v(" "), (_vm.type === 'success') ? _c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563L5.016 12zm2.016-15c5.53 0 9.984 4.453 9.984 9.984S17.53 21.984 12 21.984 2.016 17.53 2.016 12 6.47 2.016 12 2.016z"
    }
  })])]) : _vm._e(), _vm._v(" "), (_vm.type === 'warning') ? _c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M12.984 14.016v-4.03h-1.97v4.03h1.97zm0 3.984v-2.016h-1.97V18h1.97zm-12 3L12 2.016 23.016 21H.986z"
    }
  })])]) : _vm._e(), _vm._v(" "), (_vm.type === 'error') ? _c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M12.984 12.984v-6h-1.97v6h1.97zm0 4.032V15h-1.97v2.016h1.97zm-.984-15c5.53 0 9.984 4.453 9.984 9.984S17.53 21.984 12 21.984 2.016 17.53 2.016 12 6.47 2.016 12 2.016z"
    }
  })])]) : _vm._e()])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-alert__content"
  }, [_vm._t("default")], 2), _vm._v(" "), _c('div', {
    staticClass: "ui-alert__dismiss-button"
  }, [(_vm.dismissible) ? _c('ui-close-button', {
    attrs: {
      "size": "small"
    },
    on: {
      "click": _vm.dismissAlert
    }
  }) : _vm._e()], 1)])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0dfa6b64", esExports)
  }
}

/***/ }),
/* 148 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-snackbar-container",
    class: _vm.classes
  }, _vm._l((_vm.queue), function(snackbar, index) {
    return _c('ui-snackbar', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (snackbar.show),
        expression: "snackbar.show"
      }],
      key: index,
      attrs: {
        "action-color": snackbar.actionColor,
        "action": snackbar.action,
        "message": snackbar.message,
        "transition": _vm.transition
      },
      on: {
        "action-click": function($event) {
          _vm.onActionClick(snackbar)
        },
        "click": function($event) {
          _vm.onClick(snackbar)
        },
        "hide": function($event) {
          _vm.onHide(snackbar, index)
        },
        "show": function($event) {
          _vm.onShow(snackbar)
        }
      }
    }, [(_vm.allowHtml) ? _c('div', {
      domProps: {
        "innerHTML": _vm._s(snackbar.message)
      }
    }) : _vm._e()])
  }), 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0e0792ee", esExports)
  }
}

/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-calendar",
    class: _vm.classes
  }, [_c('ui-calendar-controls', {
    ref: "controls",
    staticClass: "ui-calendar__header",
    attrs: {
      "color": _vm.color,
      "date-in-view": _vm.dateInView,
      "lang": _vm.lang,
      "max-date": _vm.maxDate,
      "min-date": _vm.minDate,
      "year-range": _vm.yearRange
    },
    on: {
      "go-to-date": _vm.goToDate
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "ui-calendar__body"
  }, [_c('ui-calendar-month', {
    ref: "month",
    attrs: {
      "color": _vm.color,
      "date-in-view": _vm.dateInView,
      "lang": _vm.lang,
      "selected": _vm.value,
      "start-of-week": _vm.startOfWeek,
      "square-cells": _vm.squareCells
    },
    on: {
      "change": _vm.onMonthChange,
      "date-select": _vm.onDateSelect
    },
    scopedSlots: _vm._u([{
      key: "date",
      fn: function(props) {
        return [(_vm.$scopedSlots.date) ? _vm._t("date", null, {
          date: props.date
        }) : [_vm._v(_vm._s(props.date.getDate()))]]
      }
    }])
  })], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-10feac3c", esExports)
  }
}

/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "ui-radio",
    class: _vm.classes,
    on: {
      "click": _vm.toggleCheck
    }
  }, [_c('div', {
    staticClass: "ui-radio__input-wrapper"
  }, [_c('input', {
    ref: "input",
    staticClass: "ui-radio__input",
    attrs: {
      "type": "radio",
      "disabled": _vm.disabled,
      "name": _vm.name,
      "tabindex": _vm.tabindex
    },
    domProps: {
      "checked": _vm.checked,
      "value": _vm.trueValue
    },
    on: {
      "blur": _vm.onBlur,
      "change": _vm.onChange,
      "focus": _vm.onFocus
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "ui-radio__focus-ring"
  }), _vm._v(" "), _c('span', {
    staticClass: "ui-radio__outer-circle"
  }), _vm._v(" "), _c('span', {
    staticClass: "ui-radio__inner-circle"
  })]), _vm._v(" "), (_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-radio__label-text"
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1658ed6d", esExports)
  }
}

/***/ }),
/* 151 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": "ui-progress-linear--transition-fade"
    }
  }, [_c('div', {
    staticClass: "ui-progress-linear",
    class: _vm.classes
  }, [(_vm.type === 'determinate') ? _c('div', {
    staticClass: "ui-progress-linear__progress-bar is-determinate",
    style: ({
      'transform': ("scaleX(" + (_vm.moderatedProgress / 100) + ")")
    }),
    attrs: {
      "role": "progressbar",
      "aria-valuemax": 100,
      "aria-valuemin": 0,
      "aria-valuenow": _vm.moderatedProgress
    }
  }) : _c('div', {
    staticClass: "ui-progress-linear__progress-bar is-indeterminate",
    attrs: {
      "role": "progressbar",
      "aria-valuemax": 100,
      "aria-valuemin": 0
    }
  })])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-22995a30", esExports)
  }
}

/***/ }),
/* 152 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "ui-autocomplete-suggestion",
    class: _vm.classes
  }, [_vm._t("default", [(_vm.type === 'simple') ? _c('div', {
    staticClass: "ui-autocomplete-suggestion__simple"
  }, [_vm._v("\n            " + _vm._s(_vm.suggestion[_vm.keys.label] || _vm.suggestion) + "\n        ")]) : _vm._e(), _vm._v(" "), (_vm.type === 'image') ? _c('div', {
    staticClass: "ui-autocomplete-suggestion__image"
  }, [_c('div', {
    staticClass: "ui-autocomplete-suggestion__image-object",
    style: (_vm.imageStyle)
  }), _vm._v(" "), _c('div', {
    staticClass: "ui-autocomplete-suggestion__image-text"
  }, [_vm._v(_vm._s(_vm.suggestion[_vm.keys.label]))])]) : _vm._e()])], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2ff3038a", esExports)
  }
}

/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-tabs",
    class: _vm.classes
  }, [_c('div', {
    staticClass: "ui-tabs__header"
  }, [_c('ul', {
    staticClass: "ui-tabs__header-items",
    attrs: {
      "role": "tablist"
    }
  }, _vm._l((_vm.tabs), function(tab) {
    return _c('ui-tab-header-item', {
      key: tab.id,
      ref: "tabHeaders",
      refInFor: true,
      attrs: {
        "active": _vm.activeTabId === tab.id,
        "disable-ripple": _vm.disableRipple,
        "disabled": tab.disabled,
        "id": tab.id,
        "title": tab.title,
        "type": _vm.type
      },
      nativeOn: {
        "click": function($event) {
          _vm.onTabClick(tab, $event)
        },
        "keydown": [function($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "left", 37, $event.key, ["Left", "ArrowLeft"])) { return null; }
          if ('button' in $event && $event.button !== 0) { return null; }
          return _vm.selectPreviousTab($event)
        }, function($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "right", 39, $event.key, ["Right", "ArrowRight"])) { return null; }
          if ('button' in $event && $event.button !== 2) { return null; }
          return _vm.selectNextTab($event)
        }]
      }
    }, [(tab.$slots.header) ? _c('render', {
      attrs: {
        "nodes": tab.$slots.header
      }
    }) : (_vm.hasIcon && Boolean(tab.$slots.icon)) ? _c('render', {
      attrs: {
        "slot": "icon",
        "nodes": tab.$slots.icon
      },
      slot: "icon"
    }) : _vm._e()], 1)
  }), 1)]), _vm._v(" "), _c('div', {
    staticClass: "ui-tabs__body"
  }, [_vm._t("default")], 2)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-309a677c", esExports)
  }
}

/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-preloader",
    class: {
      'is-loading': _vm.show
    }
  }, [_c('div', {
    staticClass: "ui-preloader__progressbar",
    attrs: {
      "role": "progressbar",
      "aria-busy": _vm.show ? 'true' : false
    }
  })])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-32cd8368", esExports)
  }
}

/***/ }),
/* 155 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "ui-icon",
    class: [_vm.iconSet, _vm.icon],
    attrs: {
      "aria-label": _vm.ariaLabel
    }
  }, [(_vm.useSvg) ? _c('svg', {
    staticClass: "ui-icon__svg"
  }, [_c('use', {
    attrs: {
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "xlink:href": '#' + _vm.icon
    }
  })]) : _vm._t("default", [_vm._v(_vm._s(_vm.removeText ? null : _vm.icon))])], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-39a27af7", esExports)
  }
}

/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('tr', {
    staticClass: "ui-calendar-week",
    class: _vm.classes
  }, _vm._l((_vm.dates), function(date) {
    return _c('td', {
      key: date.toString()
    }, [_c('button', {
      staticClass: "ui-calendar-week__date",
      class: _vm.getDateClasses(date),
      attrs: {
        "disabled": _vm.isDateDisabled(date)
      },
      on: {
        "click": function($event) {
          _vm.selectDate(date)
        }
      }
    }, [_vm._t("default", [_vm._v(_vm._s(date.getDate()))], {
      date: date
    })], 2)])
  }), 0)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3c0bb760", esExports)
  }
}

/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ui-focus-container', {
    ref: "focusContainer",
    staticClass: "ui-menu",
    class: _vm.classes,
    attrs: {
      "role": "menu",
      "tag": "ul",
      "lazy": "",
      "contain-focus": _vm.containFocus
    }
  }, _vm._l((_vm.options), function(option, index) {
    return _c('ui-menu-option', {
      key: index,
      attrs: {
        "disable-ripple": _vm.disableRipple,
        "disabled": option[_vm.keys.disabled],
        "href": option[_vm.keys.href],
        "icon-props": _vm.iconProps || option[_vm.keys.iconProps],
        "icon": _vm.hasIcons ? option[_vm.keys.icon] : null,
        "label": option[_vm.keys.type] === 'divider' ? null : option[_vm.keys.label] || option,
        "secondary-text": _vm.hasSecondaryText ? option[_vm.keys.secondaryText] : null,
        "target": option[_vm.keys.target],
        "type": option[_vm.keys.type]
      },
      nativeOn: {
        "click": function($event) {
          _vm.selectOption(option)
        },
        "keydown": [function($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
          _vm.selectOption(option)
        }, function($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) { return null; }
          return _vm.closeMenu($event)
        }]
      }
    }, [_vm._t("option", null, {
      option: option
    })], 2)
  }), 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-41a170dd", esExports)
  }
}

/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ui-focus-container', {
    ref: "focusContainer",
    staticClass: "ui-popover",
    class: {
      'is-raised': _vm.raised
    },
    attrs: {
      "role": "dialog",
      "contain-focus": _vm.containFocus,
      "focus-redirector": _vm.focusRedirector
    },
    on: {
      "focus-overflow": function($event) {
        _vm.close()
      }
    }
  }, [_vm._t("default")], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-48582497", esExports)
  }
}

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('button', {
    staticClass: "ui-fab",
    class: _vm.classes,
    attrs: {
      "aria-label": _vm.ariaLabel || _vm.tooltip
    },
    on: {
      "click": _vm.onClick
    }
  }, [(_vm.icon || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-fab__icon"
  }, [_vm._t("default", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "ui-fab__focus-ring"
  }), _vm._v(" "), (!_vm.disableRipple) ? _c('ui-ripple-ink') : _vm._e(), _vm._v(" "), (_vm.tooltip) ? _c('ui-tooltip', {
    attrs: {
      "open-on": _vm.openTooltipOn,
      "position": _vm.tooltipPosition
    }
  }, [_vm._v(_vm._s(_vm.tooltip))]) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4a69660e", esExports)
  }
}

/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ui-modal', {
    ref: "modal",
    staticClass: "ui-confirm",
    attrs: {
      "role": "alertdialog",
      "dismiss-on": _vm.dismissOn,
      "dismissible": !_vm.loading,
      "title": _vm.title,
      "transition": _vm.transition,
      "size": _vm.size
    },
    on: {
      "close": _vm.onModalClose,
      "hide": _vm.onModalHide,
      "open": _vm.onModalOpen,
      "reveal": _vm.onModalReveal
    }
  }, [_c('div', {
    staticClass: "ui-confirm__message"
  }, [_vm._t("default")], 2), _vm._v(" "), _c('div', {
    staticClass: "ui-confirm__footer",
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('ui-button', {
    ref: "confirmButton",
    attrs: {
      "color": _vm.confirmButtonColor,
      "icon": _vm.confirmButtonIcon,
      "loading": _vm.loading
    },
    on: {
      "click": _vm.confirm
    }
  }, [_vm._v(_vm._s(_vm.confirmButtonText))]), _vm._v(" "), _c('ui-button', {
    ref: "denyButton",
    attrs: {
      "disabled": _vm.loading,
      "icon": _vm.denyButtonIcon
    },
    on: {
      "click": _vm.deny
    }
  }, [_vm._v(_vm._s(_vm.denyButtonText))])], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4f7f2732", esExports)
  }
}

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "ui-tab-header-item",
    class: _vm.classes,
    attrs: {
      "role": "tab",
      "aria-controls": _vm.id,
      "aria-selected": _vm.active ? 'true' : null,
      "disabled": _vm.disabled,
      "tabindex": _vm.active ? 0 : -1
    }
  }, [_vm._t("default", [(_vm.hasIcon) ? _c('div', {
    staticClass: "ui-tab-header-item__icon"
  }, [_vm._t("icon")], 2) : _vm._e(), _vm._v(" "), (_vm.hasText) ? _c('div', {
    staticClass: "ui-tab-header-item__text"
  }, [_vm._v(_vm._s(_vm.title))]) : _vm._e()]), _vm._v(" "), (!_vm.disableRipple && !_vm.disabled) ? _c('ui-ripple-ink') : _vm._e()], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-535cc9b2", esExports)
  }
}

/***/ }),
/* 162 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-select",
    class: _vm.classes
  }, [(_vm.name) ? _c('input', {
    staticClass: "ui-select__hidden-input",
    attrs: {
      "type": "hidden",
      "name": _vm.name
    },
    domProps: {
      "value": _vm.submittedValue
    }
  }) : _vm._e(), _vm._v(" "), (_vm.icon || _vm.$slots.icon) ? _c('div', {
    staticClass: "ui-select__icon-wrapper"
  }, [_vm._t("icon", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-select__content"
  }, [_c('div', {
    ref: "label",
    staticClass: "ui-select__label",
    attrs: {
      "tabindex": _vm.disabled ? null : (_vm.tabindex || '0')
    },
    on: {
      "focus": _vm.onFocus,
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        $event.preventDefault();
        return _vm.openDropdown($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) { return null; }
        $event.preventDefault();
        return _vm.openDropdown($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) { return null; }
        return _vm.onBlur($event)
      }]
    }
  }, [(_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-select__label-text",
    class: _vm.labelClasses
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-select__display"
  }, [_c('div', {
    staticClass: "ui-select__display-value",
    class: {
      'is-placeholder': !_vm.hasDisplayText
    }
  }, [_vm._v("\n                    " + _vm._s(_vm.hasDisplayText ? _vm.displayText : (_vm.hasFloatingLabel && _vm.isLabelInline) ? null : _vm.placeholder) + "\n                ")]), _vm._v(" "), _c('ui-icon', {
    staticClass: "ui-select__dropdown-button"
  }, [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M6.984 9.984h10.03L12 15z"
    }
  })])])], 1), _vm._v(" "), _c('ui-popover', {
    ref: "dropdown",
    staticClass: "ui-select__dropdown",
    attrs: {
      "close-on-scroll": false,
      "constrain-to-scroll-parent": false,
      "disabled": _vm.disabled
    },
    on: {
      "close": _vm.onClose,
      "open": _vm.onOpen,
      "reveal": _vm.onReveal
    }
  }, [_c('div', {
    ref: "dropdownContent",
    staticClass: "ui-select__dropdown-content",
    attrs: {
      "tabindex": "-1"
    },
    on: {
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) { return null; }
        $event.preventDefault();
        _vm.highlightOption(_vm.highlightedIndex + 1)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        $event.preventDefault();
        $event.stopPropagation();
        _vm.selectHighlighted(_vm.highlightedIndex, $event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) { return null; }
        $event.preventDefault();
        _vm.closeDropdown()
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) { return null; }
        return _vm.onBlur($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) { return null; }
        $event.preventDefault();
        _vm.highlightOption(_vm.highlightedIndex - 1)
      }]
    }
  }, [(_vm.hasSearch) ? _c('div', {
    staticClass: "ui-select__search",
    on: {
      "click": function($event) {
        $event.stopPropagation();
      },
      "keydown": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) { return null; }
        $event.stopPropagation();
      }
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.query),
      expression: "query"
    }],
    ref: "searchInput",
    staticClass: "ui-select__search-input",
    attrs: {
      "autocomplete": "off",
      "type": "text",
      "placeholder": _vm.searchPlaceholder
    },
    domProps: {
      "value": (_vm.query)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.query = $event.target.value
      }
    }
  }), _vm._v(" "), _c('ui-icon', {
    staticClass: "ui-select__search-icon"
  }, [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M9.516 14.016c2.484 0 4.5-2.016 4.5-4.5s-2.016-4.5-4.5-4.5-4.5 2.016-4.5 4.5 2.016 4.5 4.5 4.5zm6 0l4.97 4.97-1.5 1.5-4.97-4.97v-.797l-.28-.282c-1.126.984-2.626 1.547-4.22 1.547-3.61 0-6.516-2.86-6.516-6.47S5.906 3 9.516 3s6.47 2.906 6.47 6.516c0 1.594-.564 3.094-1.548 4.22l.28.28h.798z"
    }
  })])]), _vm._v(" "), (_vm.loading) ? _c('ui-progress-circular', {
    staticClass: "ui-select__search-progress",
    attrs: {
      "size": 20,
      "stroke": 4
    }
  }) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _c('ul', {
    ref: "optionsList",
    staticClass: "ui-select__options"
  }, [_vm._l((_vm.filteredOptions), function(option, index) {
    return _c('ui-select-option', {
      key: index,
      ref: "options",
      refInFor: true,
      attrs: {
        "highlighted": _vm.highlightedIndex === index,
        "keys": _vm.keys,
        "multiple": _vm.multiple,
        "option": option,
        "selected": _vm.isOptionSelected(option),
        "type": _vm.type
      },
      nativeOn: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.selectOption(option, index)
        },
        "mouseover": function($event) {
          $event.stopPropagation();
          _vm.highlightOption(index, {
            autoScroll: false
          })
        }
      }
    }, [_vm._t("option", null, {
      highlighted: _vm.highlightedIndex === index,
      index: index,
      option: option,
      selected: _vm.isOptionSelected(option)
    })], 2)
  }), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.hasNoResults),
      expression: "hasNoResults"
    }],
    staticClass: "ui-select__no-results"
  }, [_vm._t("no-results", [_vm._v("No results found")])], 2)], 2)])])], 1), _vm._v(" "), (_vm.hasFeedback) ? _c('div', {
    staticClass: "ui-select__feedback"
  }, [(_vm.showError) ? _c('div', {
    staticClass: "ui-select__feedback-text"
  }, [_vm._t("error", [_vm._v(_vm._s(_vm.error))])], 2) : (_vm.showHelp) ? _c('div', {
    staticClass: "ui-select__feedback-text"
  }, [_vm._t("help", [_vm._v(_vm._s(_vm.help))])], 2) : _vm._e()]) : _vm._e()])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-54cff87a", esExports)
  }
}

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": _vm.transitionName
    },
    on: {
      "after-enter": _vm.onEnter,
      "after-leave": _vm.onLeave
    }
  }, [_c('div', {
    staticClass: "ui-snackbar",
    on: {
      "click": _vm.onClick
    }
  }, [_c('div', {
    staticClass: "ui-snackbar__message"
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.message))])], 2), _vm._v(" "), _c('div', {
    staticClass: "ui-snackbar__action"
  }, [(_vm.action) ? _c('ui-button', {
    staticClass: "ui-snackbar__action-button",
    attrs: {
      "type": "secondary",
      "color": _vm.actionColor
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        return _vm.onActionClick($event)
      }
    }
  }, [_vm._v(_vm._s(_vm.action))]) : _vm._e()], 1)])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5ad542fa", esExports)
  }
}

/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c(_vm.isAnchor ? 'a' : 'li', {
    tag: "component",
    staticClass: "ui-menu-option",
    class: _vm.classes,
    attrs: {
      "role": "menu-item",
      "href": _vm.isAnchor ? (_vm.disabled ? null : _vm.href) : null,
      "tabindex": (_vm.isDivider || _vm.isAnchor || _vm.disabled) ? null : '0',
      "target": _vm.isAnchor ? (_vm.disabled ? null : _vm.target) : null
    }
  }, [(!_vm.isDivider) ? _vm._t("default", [_c('div', {
    staticClass: "ui-menu-option__content"
  }, [(_vm.icon) ? _c('ui-icon', {
    staticClass: "ui-menu-option__icon",
    attrs: {
      "icon-set": _vm.iconProps.iconSet,
      "icon": _vm.icon,
      "remove-text": _vm.iconProps.removeText,
      "use-svg": _vm.iconProps.useSvg
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-menu-option__text"
  }, [_vm._v(_vm._s(_vm.label))]), _vm._v(" "), (_vm.secondaryText) ? _c('div', {
    staticClass: "ui-menu-option__secondary-text"
  }, [_vm._v("\n                " + _vm._s(_vm.secondaryText) + "\n            ")]) : _vm._e()], 1)]) : _vm._e(), _vm._v(" "), (!_vm.disabled && !_vm.isDivider && !_vm.disableRipple) ? _c('ui-ripple-ink') : _vm._e()], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5cb20b32", esExports)
  }
}

/***/ }),
/* 165 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": _vm.toggleTransition
    },
    on: {
      "after-enter": _vm.onEnter,
      "after-leave": _vm.onLeave
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isOpen),
      expression: "isOpen"
    }],
    staticClass: "ui-modal ui-modal__mask",
    class: _vm.classes,
    attrs: {
      "role": _vm.role
    },
    on: {
      "click": function($event) {
        if ($event.target !== $event.currentTarget) { return null; }
        return _vm.onBackdropClick($event)
      }
    }
  }, [_c('div', {
    staticClass: "ui-modal__wrapper",
    class: {
      'has-dummy-scrollbar': _vm.preventShift
    },
    style: (_vm.alignTopStyle),
    on: {
      "click": function($event) {
        if ($event.target !== $event.currentTarget) { return null; }
        return _vm.onBackdropClick($event)
      }
    }
  }, [_c('ui-focus-container', {
    ref: "focusContainer",
    staticClass: "ui-modal__container",
    attrs: {
      "tabindex": "-1"
    },
    nativeOn: {
      "keydown": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) { return null; }
        $event.stopPropagation();
        return _vm.onEsc($event)
      }
    }
  }, [(!_vm.removeHeader) ? _c('div', {
    staticClass: "ui-modal__header"
  }, [_vm._t("header", [_c('h1', {
    staticClass: "ui-modal__header-text"
  }, [_vm._v(_vm._s(_vm.title))])]), _vm._v(" "), _c('div', {
    staticClass: "ui-modal__close-button"
  }, [(_vm.dismissOnCloseButton && !_vm.removeCloseButton && _vm.dismissible) ? _c('ui-close-button', {
    on: {
      "click": _vm.close
    }
  }) : _vm._e()], 1)], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-modal__body"
  }, [_vm._t("default")], 2), _vm._v(" "), (_vm.hasFooter) ? _c('div', {
    staticClass: "ui-modal__footer"
  }, [_vm._t("footer")], 2) : _vm._e()])], 1)])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5cfba9c2", esExports)
  }
}

/***/ }),
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-ripple-ink"
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5ef65288", esExports)
  }
}

/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c(_vm.isAnchor ? 'a' : 'button', {
    tag: "component",
    staticClass: "ui-button",
    class: _vm.classes,
    attrs: {
      "disabled": _vm.disabled || _vm.loading,
      "href": _vm.isAnchor ? (_vm.disabled ? null : _vm.href) : null,
      "type": _vm.isAnchor ? null : _vm.buttonType
    },
    on: {
      "click": _vm.onClick
    }
  }, [_c('div', {
    staticClass: "ui-button__content"
  }, [(_vm.icon || _vm.$slots.icon) ? _c('div', {
    staticClass: "ui-button__icon"
  }, [_vm._t("icon", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _vm._t("default"), _vm._v(" "), (_vm.hasDropdown && _vm.iconPosition !== 'right') ? _c('ui-icon', {
    staticClass: "ui-button__dropdown-icon"
  }, [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M6.984 9.984h10.03L12 15z"
    }
  })])]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "ui-button__focus-ring"
  }), _vm._v(" "), (_vm.loading) ? _c('ui-progress-circular', {
    staticClass: "ui-button__progress",
    attrs: {
      "disable-transition": "",
      "color": _vm.progressColor,
      "size": 18,
      "stroke": 4.5
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.disableRipple && !_vm.disabled) ? _c('ui-ripple-ink') : _vm._e(), _vm._v(" "), (_vm.hasDropdown) ? _c('ui-popover', {
    ref: "dropdown",
    attrs: {
      "contain-focus": "",
      "append-to-body": _vm.appendDropdownToBody,
      "constrain-to-scroll-parent": _vm.constrainDropdownToScrollParent,
      "position": _vm.dropdownPosition,
      "open-on": _vm.openDropdownOn
    },
    on: {
      "close": _vm.onDropdownClose,
      "open": _vm.onDropdownOpen
    }
  }, [_vm._t("dropdown")], 2) : _vm._e(), _vm._v(" "), (_vm.tooltip) ? _c('ui-tooltip', {
    attrs: {
      "open-on": _vm.openTooltipOn,
      "position": _vm.tooltipPosition
    }
  }, [_vm._v(_vm._s(_vm.tooltip))]) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-663a40a0", esExports)
  }
}

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c(_vm.tag, {
    tag: "component",
    staticClass: "ui-focus-container"
  }, [(_vm.renderRedirector) ? _c('span', {
    staticClass: "ui-focus-container__focus-redirector",
    attrs: {
      "tabindex": "0"
    },
    on: {
      "focus": function($event) {
        _vm.redirectFocus($event, {
          isTabbingForward: false
        })
      }
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    ref: "content",
    staticClass: "ui-focus-container__content",
    attrs: {
      "tabindex": "-1"
    }
  }, [_vm._t("default")], 2), _vm._v(" "), (!_vm.disabled && _vm.containFocus) ? _c('span', {
    ref: "lastFocusable",
    staticClass: "ui-focus-container__last-focusable",
    attrs: {
      "tabindex": "-1"
    }
  }) : _vm._e(), _vm._v(" "), (_vm.renderRedirector) ? _c('span', {
    staticClass: "ui-focus-container__focus-redirector",
    attrs: {
      "tabindex": "0"
    },
    on: {
      "focus": function($event) {
        _vm.redirectFocus($event, {
          isTabbingForward: true
        })
      }
    }
  }) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6c26f987", esExports)
  }
}

/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-tooltip"
  }, [_vm._t("default")], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6cedb6f5", esExports)
  }
}

/***/ }),
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-calendar-controls",
    class: _vm.classes
  }, [_c('ui-icon-button', {
    staticClass: "ui-calendar-controls__nav-button",
    attrs: {
      "icon": "keyboard_arrow_left",
      "type": "secondary",
      "color": _vm.color === 'default' ? 'default' : 'white',
      "disabled": _vm.previousMonthDisabled
    },
    on: {
      "click": _vm.goToPreviousMonth
    }
  }, [_c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M15.422 16.078l-1.406 1.406-6-6 6-6 1.406 1.406-4.594 4.594z"
    }
  })])])], 1), _vm._v(" "), _c('div', {
    staticClass: "ui-calendar-controls__month-and-year"
  }, [_vm._v(_vm._s(_vm.monthAndYear))]), _vm._v(" "), _c('ui-icon-button', {
    staticClass: "ui-calendar-controls__nav-button",
    attrs: {
      "icon": "keyboard_arrow_right",
      "type": "secondary",
      "color": _vm.color === 'default' ? 'default' : 'white',
      "disabled": _vm.nextMonthDisabled
    },
    on: {
      "click": _vm.goToNextMonth
    }
  }, [_c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M8.578 16.36l4.594-4.595L8.578 7.17l1.406-1.405 6 6-6 6z"
    }
  })])])], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6fbf1812", esExports)
  }
}

/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-datepicker",
    class: _vm.classes
  }, [_c('input', {
    staticClass: "ui-datepicker__hidden-input",
    attrs: {
      "type": "hidden",
      "name": _vm.name
    },
    domProps: {
      "value": _vm.submittedValue
    }
  }), _vm._v(" "), (_vm.icon || _vm.$slots.icon) ? _c('div', {
    staticClass: "ui-datepicker__icon-wrapper"
  }, [_vm._t("icon", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-datepicker__content"
  }, [_c('div', {
    ref: "label",
    staticClass: "ui-datepicker__label",
    attrs: {
      "tabindex": _vm.disabled ? null : (_vm.tabindex || '0')
    },
    on: {
      "focus": _vm.onFocus,
      "click": function($event) {
        _vm.togglePicker({
          returnFocus: false
        })
      },
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        $event.preventDefault();
        _vm.togglePicker({
          returnFocus: false
        })
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) { return null; }
        $event.preventDefault();
        _vm.togglePicker({
          returnFocus: false
        })
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) { return null; }
        return _vm.onTabAway($event)
      }]
    }
  }, [(_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-datepicker__label-text",
    class: _vm.labelClasses
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-datepicker__display"
  }, [_c('div', {
    staticClass: "ui-datepicker__display-value",
    class: {
      'is-placeholder': !_vm.hasDisplayText
    }
  }, [_vm._v("\n                    " + _vm._s(_vm.hasDisplayText ? _vm.displayText : (_vm.hasFloatingLabel && _vm.isLabelInline) ? null : _vm.placeholder) + "\n                ")]), _vm._v(" "), (_vm.usesPopover && !_vm.disabled) ? _c('ui-icon', {
    staticClass: "ui-datepicker__dropdown-button"
  }, [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M6.984 9.984h10.03L12 15z"
    }
  })])]) : _vm._e()], 1), _vm._v(" "), (_vm.usesPopover) ? _c('ui-popover', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.disabled),
      expression: "!disabled"
    }],
    ref: "popover",
    attrs: {
      "contain-focus": "",
      "open-on": "manual",
      "close-on-scroll": false,
      "append-to-body": _vm.appendDropdownToBody,
      "z-index": _vm.dropdownZIndex
    },
    on: {
      "close": _vm.onPickerClose,
      "open": _vm.onPickerOpen
    }
  }, [_c('ui-datepicker-calendar', {
    attrs: {
      "color": _vm.color,
      "date-filter": _vm.dateFilter,
      "lang": _vm.lang,
      "max-date": _vm.maxDate,
      "min-date": _vm.minDate,
      "orientation": _vm.orientation,
      "current-view": _vm.calendarView,
      "value": _vm.date,
      "start-of-week": _vm.startOfWeek,
      "year-range": _vm.yearRange
    },
    on: {
      "update:currentView": function($event) {
        _vm.calendarView = $event
      },
      "date-select": _vm.onDateSelect
    }
  })], 1) : _vm._e()], 1), _vm._v(" "), (_vm.hasFeedback) ? _c('div', {
    staticClass: "ui-datepicker__feedback"
  }, [(_vm.showError) ? _c('div', {
    staticClass: "ui-datepicker__feedback-text"
  }, [_vm._t("error", [_vm._v(_vm._s(_vm.error))])], 2) : (_vm.showHelp) ? _c('div', {
    staticClass: "ui-datepicker__feedback-text"
  }, [_vm._t("help", [_vm._v(_vm._s(_vm.help))])], 2) : _vm._e()]) : _vm._e()]), _vm._v(" "), (_vm.usesModal && !_vm.disabled) ? _c('ui-modal', {
    ref: "modal",
    attrs: {
      "remove-header": "",
      "size": "auto"
    },
    on: {
      "hidden": _vm.onPickerClose,
      "open": _vm.onPickerOpen
    }
  }, [_c('ui-datepicker-calendar', {
    attrs: {
      "color": _vm.color,
      "date-filter": _vm.dateFilter,
      "lang": _vm.lang,
      "max-date": _vm.maxDate,
      "min-date": _vm.minDate,
      "orientation": _vm.orientation,
      "current-view": _vm.calendarView,
      "value": _vm.date,
      "start-of-week": _vm.startOfWeek,
      "year-range": _vm.yearRange
    },
    on: {
      "update:currentView": function($event) {
        _vm.calendarView = $event
      },
      "date-select": _vm.onDateSelect
    }
  })], 1) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-74517e3a", esExports)
  }
}

/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "ui-checkbox",
    class: _vm.classes
  }, [_c('input', {
    ref: "input",
    staticClass: "ui-checkbox__input",
    attrs: {
      "type": "checkbox",
      "disabled": _vm.disabled,
      "name": _vm.name,
      "tabindex": _vm.tabindex
    },
    domProps: {
      "checked": _vm.isChecked,
      "value": _vm.submittedValue
    },
    on: {
      "blur": _vm.onBlur,
      "click": _vm.onClick,
      "focus": _vm.onFocus
    }
  }), _vm._v(" "), _vm._m(0), _vm._v(" "), (_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-checkbox__label-text"
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e()])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-checkbox__checkmark"
  }, [_c('div', {
    staticClass: "ui-checkbox__checkmark-background"
  }), _vm._v(" "), _c('div', {
    staticClass: "ui-checkbox__focus-ring"
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7905fb7e", esExports)
  }
}

/***/ }),
/* 173 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-checkbox-group",
    class: _vm.classes
  }, [(_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-checkbox-group__label-text"
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-checkbox-group__checkboxes"
  }, _vm._l((_vm.options), function(option, index) {
    return _c('ui-checkbox', {
      key: option[_vm.keys.id],
      staticClass: "ui-checkbox-group__checkbox",
      class: option[_vm.keys.class],
      attrs: {
        "box-position": _vm.boxPosition,
        "checked": _vm.isOptionCheckedByDefault(option),
        "color": _vm.color,
        "disabled": _vm.disabled || option[_vm.keys.disabled],
        "id": option[_vm.keys.id],
        "name": _vm.name || option[_vm.keys.name]
      },
      on: {
        "blur": _vm.onBlur,
        "change": function($event) {
          _vm.onChange(arguments, option)
        },
        "focus": _vm.onFocus
      },
      model: {
        value: (_vm.checkboxValues[index]),
        callback: function($$v) {
          _vm.$set(_vm.checkboxValues, index, $$v)
        },
        expression: "checkboxValues[index]"
      }
    }, [_vm._v(_vm._s(option[_vm.keys.label] || option))])
  }), 1), _vm._v(" "), (_vm.hasFeedback) ? _c('div', {
    staticClass: "ui-checkbox-group__feedback"
  }, [(_vm.showError) ? _c('div', {
    staticClass: "ui-checkbox-group__feedback-text"
  }, [_vm._t("error", [_vm._v(_vm._s(_vm.error))])], 2) : (_vm.showHelp) ? _c('div', {
    staticClass: "ui-checkbox-group__feedback-text"
  }, [_vm._t("help", [_vm._v(_vm._s(_vm.help))])], 2) : _vm._e()]) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7a92836e", esExports)
  }
}

/***/ }),
/* 174 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('button', {
    staticClass: "ui-close-button",
    class: _vm.classes,
    attrs: {
      "aria-label": "Close",
      "type": "button",
      "disabled": _vm.disabled
    },
    on: {
      "click": _vm.onClick
    }
  }, [_c('div', {
    staticClass: "ui-close-button__icon"
  }, [_c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z"
    }
  })])])], 1), _vm._v(" "), _c('span', {
    staticClass: "ui-close-button__focus-ring"
  }), _vm._v(" "), (!_vm.disableRipple && !_vm.disabled) ? _c('ui-ripple-ink') : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7ba5f488", esExports)
  }
}

/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": _vm.disableTransition ? null : 'ui-progress-circular--transition-fade'
    }
  }, [_c('div', {
    staticClass: "ui-progress-circular",
    class: _vm.classes,
    style: ({
      'width': _vm.size + 'px',
      'height': _vm.size + 'px'
    })
  }, [(_vm.type === 'determinate') ? _c('svg', {
    staticClass: "ui-progress-circular__determinate",
    attrs: {
      "role": "progressbar",
      "aria-valuemax": 100,
      "aria-valuemin": 0,
      "aria-valuenow": _vm.progress,
      "height": _vm.size,
      "width": _vm.size
    }
  }, [_c('circle', {
    staticClass: "ui-progress-circular__determinate-path",
    style: ({
      'stroke-dashoffset': _vm.strokeDashOffset,
      'stroke-width': _vm.calculatedStroke
    }),
    attrs: {
      "fill": "transparent",
      "stroke-dashoffset": "0",
      "cx": _vm.size / 2,
      "cy": _vm.size / 2,
      "r": _vm.radius,
      "stroke-dasharray": _vm.strokeDashArray
    }
  })]) : _c('svg', {
    staticClass: "ui-progress-circular__indeterminate",
    attrs: {
      "role": "progressbar",
      "viewBox": "25 25 50 50",
      "aria-valuemax": 100,
      "aria-valuemin": 0
    }
  }, [_c('circle', {
    staticClass: "ui-progress-circular__indeterminate-path",
    attrs: {
      "cx": "50",
      "cy": "50",
      "fill": "none",
      "r": "20",
      "stroke-miterlimit": "10",
      "stroke-width": _vm.calculatedStroke
    }
  })])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7bea93ea", esExports)
  }
}

/***/ }),
/* 176 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-autocomplete",
    class: _vm.classes
  }, [(_vm.icon || _vm.$slots.icon) ? _c('div', {
    staticClass: "ui-autocomplete__icon-wrapper"
  }, [_vm._t("icon", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-autocomplete__content"
  }, [_c('label', {
    staticClass: "ui-autocomplete__label"
  }, [(_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-autocomplete__label-text",
    class: _vm.labelClasses
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e(), _vm._v(" "), _c('ui-icon', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.disabled && _vm.valueLength > 0),
      expression: "!disabled && valueLength > 0"
    }],
    staticClass: "ui-autocomplete__clear-button",
    attrs: {
      "title": "Clear"
    },
    nativeOn: {
      "click": function($event) {
        _vm.updateValue('')
      }
    }
  }, [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z"
    }
  })])]), _vm._v(" "), _c('input', {
    directives: [{
      name: "autofocus",
      rawName: "v-autofocus",
      value: (_vm.autofocus),
      expression: "autofocus"
    }],
    ref: "input",
    staticClass: "ui-autocomplete__input",
    attrs: {
      "autocomplete": "off",
      "disabled": _vm.disabled,
      "name": _vm.name,
      "placeholder": _vm.hasFloatingLabel ? null : _vm.placeholder,
      "readonly": _vm.readonly ? _vm.readonly : null,
      "tabindex": _vm.tabindex
    },
    domProps: {
      "value": _vm.value
    },
    on: {
      "blur": _vm.onBlur,
      "change": _vm.onChange,
      "focus": _vm.onFocus,
      "input": function($event) {
        _vm.updateValue($event.target.value)
      },
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) { return null; }
        $event.preventDefault();
        _vm.highlightSuggestion(_vm.highlightedIndex + 1)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        _vm.selectHighlighted(_vm.highlightedIndex, $event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) { return null; }
        return _vm.closeDropdown($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) { return null; }
        return _vm.closeDropdown($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) { return null; }
        $event.preventDefault();
        _vm.highlightSuggestion(_vm.highlightedIndex - 1)
      }]
    }
  }), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showDropdown),
      expression: "showDropdown"
    }],
    staticClass: "ui-autocomplete__suggestions"
  }, _vm._l((_vm.matchingSuggestions), function(suggestion, index) {
    return _c('ui-autocomplete-suggestion', {
      key: index,
      ref: "suggestions",
      refInFor: true,
      attrs: {
        "highlighted": _vm.highlightedIndex === index,
        "keys": _vm.keys,
        "suggestion": suggestion,
        "type": _vm.type
      },
      nativeOn: {
        "click": function($event) {
          _vm.selectSuggestion(suggestion)
        }
      }
    }, [_vm._t("suggestion", null, {
      highlighted: _vm.highlightedIndex === index,
      index: index,
      suggestion: suggestion
    })], 2)
  }), 1)], 1), _vm._v(" "), (_vm.hasFeedback) ? _c('div', {
    staticClass: "ui-autocomplete__feedback"
  }, [(_vm.showError) ? _c('div', {
    staticClass: "ui-autocomplete__feedback-text"
  }, [_vm._t("error", [_vm._v(_vm._s(_vm.error))])], 2) : (_vm.showHelp) ? _c('div', {
    staticClass: "ui-autocomplete__feedback-text"
  }, [_vm._t("help", [_vm._v(_vm._s(_vm.help))])], 2) : _vm._e()]) : _vm._e()])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7ede18e6", esExports)
  }
}

/***/ }),
/* 177 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isActive),
      expression: "isActive"
    }],
    staticClass: "ui-tab",
    attrs: {
      "role": "tabpanel",
      "aria-hidden": !_vm.isActive ? 'true' : null,
      "id": _vm.id,
      "tabindex": _vm.isActive ? '0' : null
    }
  }, [_vm._t("default")], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-813aeaf2", esExports)
  }
}

/***/ }),
/* 178 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "ui-fileupload",
    class: _vm.classes
  }, [(_vm.renderInput) ? _c('input', {
    ref: "input",
    staticClass: "ui-fileupload__input",
    attrs: {
      "type": "file",
      "accept": _vm.accept,
      "disabled": _vm.disabled,
      "multiple": _vm.multiple,
      "name": _vm.name,
      "required": _vm.required,
      "tabindex": _vm.tabindex
    },
    on: {
      "blur": _vm.onBlur,
      "input": _vm.onInput,
      "change": _vm.onChange,
      "focus": _vm.onFocus
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-fileupload__content"
  }, [_c('div', {
    staticClass: "ui-fileupload__icon"
  }, [_vm._t("icon", [_c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M5.016 18h13.969v2.016H5.016V18zM9 15.984v-6H5.016L12 3l6.984 6.984H15v6H9z"
    }
  })])])])], 2), _vm._v(" "), (_vm.hasSelection) ? _c('span', {
    staticClass: "ui-fileupload__display-text"
  }, [_vm._v(_vm._s(_vm.displayText))]) : _vm._t("default", [_vm._v(_vm._s(_vm.placeholder))])], 2), _vm._v(" "), _c('div', {
    staticClass: "ui-fileupload__focus-ring"
  }), _vm._v(" "), (!_vm.disableRipple && !_vm.disabled) ? _c('ui-ripple-ink') : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-965da30a", esExports)
  }
}

/***/ }),
/* 179 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c(_vm.isAnchor ? 'a' : 'button', {
    tag: "component",
    staticClass: "ui-icon-button",
    class: _vm.classes,
    attrs: {
      "aria-label": _vm.ariaLabel || _vm.tooltip,
      "disabled": _vm.disabled || _vm.loading,
      "href": _vm.isAnchor ? (_vm.disabled ? null : _vm.href) : null,
      "type": _vm.isAnchor ? null : _vm.buttonType
    },
    on: {
      "click": _vm.onClick
    }
  }, [(_vm.icon || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-icon-button__icon"
  }, [_vm._t("default", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-icon-button__focus-ring"
  }), _vm._v(" "), (_vm.loading) ? _c('ui-progress-circular', {
    staticClass: "ui-icon-button__progress",
    attrs: {
      "color": _vm.progressColor,
      "size": _vm.size === 'large' ? 24 : 18,
      "stroke": 4.5
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.disableRipple && !_vm.disabled) ? _c('ui-ripple-ink') : _vm._e(), _vm._v(" "), (_vm.hasDropdown) ? _c('ui-popover', {
    ref: "dropdown",
    attrs: {
      "constain-focus": "",
      "append-to-body": _vm.appendDropdownToBody,
      "constrain-to-scroll-parent": _vm.constrainDropdownToScrollParent,
      "position": _vm.dropdownPosition,
      "open-on": _vm.openDropdownOn
    },
    on: {
      "close": _vm.onDropdownClose,
      "open": _vm.onDropdownOpen
    }
  }, [_vm._t("dropdown")], 2) : _vm._e(), _vm._v(" "), (_vm.tooltip) ? _c('ui-tooltip', {
    attrs: {
      "open-on": _vm.openTooltipOn,
      "position": _vm.tooltipPosition
    }
  }, [_vm._v(_vm._s(_vm.tooltip))]) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-9db4dbee", esExports)
  }
}

/***/ }),
/* 180 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "ui-select-option",
    class: _vm.classes
  }, [_vm._t("default", [(_vm.type === 'basic') ? _c('div', {
    staticClass: "ui-select-option__basic"
  }, [_vm._v("\n            " + _vm._s(_vm.option[_vm.keys.label] || _vm.option) + "\n        ")]) : _vm._e(), _vm._v(" "), (_vm.type === 'image') ? _c('div', {
    staticClass: "ui-select-option__image"
  }, [_c('div', {
    staticClass: "ui-select-option__image-object",
    style: (_vm.imageStyle)
  }), _vm._v(" "), _c('div', {
    staticClass: "ui-select-option__image-text"
  }, [_vm._v(_vm._s(_vm.option[_vm.keys.label]))])]) : _vm._e(), _vm._v(" "), (_vm.multiple) ? _c('div', {
    staticClass: "ui-select-option__checkbox"
  }, [(_vm.selected) ? _c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563L5.016 12zm9-14.016C20.11 3 21 3.938 21 5.016v13.97C21 20.062 20.11 21 18.984 21H5.014C3.89 21 3 20.064 3 18.986V5.015C3 3.94 3.89 3 5.014 3h13.97z"
    }
  })])]) : _c('ui-icon', [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M18.984 3C20.062 3 21 3.938 21 5.016v13.97C21 20.062 20.062 21 18.984 21H5.014C3.938 21 3 20.064 3 18.986V5.015C3 3.94 3.936 3 5.014 3h13.97zm0 2.016H5.014v13.97h13.97V5.015z"
    }
  })])])], 1) : _vm._e()])], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-a05cade2", esExports)
  }
}

/***/ }),
/* 181 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-textbox",
    class: _vm.classes
  }, [(_vm.icon || _vm.$slots.icon) ? _c('div', {
    staticClass: "ui-textbox__icon-wrapper"
  }, [_vm._t("icon", [_c('ui-icon', {
    attrs: {
      "icon": _vm.icon
    }
  })])], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "ui-textbox__content"
  }, [_c('label', {
    staticClass: "ui-textbox__label"
  }, [(!_vm.multiLine) ? _c('input', {
    directives: [{
      name: "autofocus",
      rawName: "v-autofocus",
      value: (_vm.autofocus),
      expression: "autofocus"
    }],
    ref: "input",
    staticClass: "ui-textbox__input",
    attrs: {
      "autocomplete": _vm.autocomplete ? _vm.autocomplete : null,
      "disabled": _vm.disabled,
      "max": _vm.maxValue,
      "maxlength": _vm.enforceMaxlength ? _vm.maxlength : null,
      "minlength": _vm.minlength,
      "min": _vm.minValue,
      "name": _vm.name,
      "number": _vm.type === 'number' ? true : null,
      "placeholder": _vm.hasFloatingLabel ? null : _vm.placeholder,
      "readonly": _vm.readonly,
      "required": _vm.required,
      "step": _vm.stepValue,
      "tabindex": _vm.tabindex,
      "type": _vm.type
    },
    domProps: {
      "value": _vm.value
    },
    on: {
      "blur": _vm.onBlur,
      "change": _vm.onChange,
      "focus": _vm.onFocus,
      "input": function($event) {
        _vm.updateValue($event.target.value)
      },
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        return _vm.onKeydownEnter($event)
      }, _vm.onKeydown]
    }
  }) : _c('textarea', {
    directives: [{
      name: "autofocus",
      rawName: "v-autofocus",
      value: (_vm.autofocus),
      expression: "autofocus"
    }],
    ref: "textarea",
    staticClass: "ui-textbox__textarea",
    attrs: {
      "autocomplete": _vm.autocomplete ? _vm.autocomplete : null,
      "disabled": _vm.disabled,
      "maxlength": _vm.enforceMaxlength ? _vm.maxlength : null,
      "minlength": _vm.minlength,
      "name": _vm.name,
      "placeholder": _vm.hasFloatingLabel ? null : _vm.placeholder,
      "readonly": _vm.readonly,
      "required": _vm.required,
      "rows": _vm.rows,
      "tabindex": _vm.tabindex
    },
    domProps: {
      "value": _vm.value
    },
    on: {
      "blur": _vm.onBlur,
      "change": _vm.onChange,
      "focus": _vm.onFocus,
      "input": function($event) {
        _vm.updateValue($event.target.value)
      },
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        return _vm.onKeydownEnter($event)
      }, _vm.onKeydown]
    }
  }), _vm._v(" "), (_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-textbox__label-text",
    class: _vm.labelClasses
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e()]), _vm._v(" "), (_vm.hasFeedback || _vm.maxlength) ? _c('div', {
    staticClass: "ui-textbox__feedback"
  }, [(_vm.showError) ? _c('div', {
    staticClass: "ui-textbox__feedback-text"
  }, [_vm._t("error", [_vm._v(_vm._s(_vm.error))])], 2) : (_vm.showHelp) ? _c('div', {
    staticClass: "ui-textbox__feedback-text"
  }, [_vm._t("help", [_vm._v(_vm._s(_vm.help))])], 2) : _vm._e(), _vm._v(" "), (_vm.maxlength) ? _c('div', {
    staticClass: "ui-textbox__counter"
  }, [_vm._v("\n                " + _vm._s(_vm.valueLength + '/' + _vm.maxlength) + "\n            ")]) : _vm._e()]) : _vm._e()])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ac038220", esExports)
  }
}

/***/ }),
/* 182 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-toolbar",
    class: _vm.classes
  }, [_c('div', {
    staticClass: "ui-toolbar__left"
  }, [(!_vm.removeNavIcon) ? _c('div', {
    staticClass: "ui-toolbar__nav-icon"
  }, [_vm._t("icon", [_c('ui-icon-button', {
    attrs: {
      "size": "large",
      "type": "secondary",
      "color": _vm.textColor,
      "icon": _vm.navIcon
    },
    on: {
      "click": _vm.navIconClick
    }
  })])], 2) : _vm._e(), _vm._v(" "), (_vm.brand || _vm.$slots.brand) ? _c('div', {
    staticClass: "ui-toolbar__brand"
  }, [_vm._t("brand", [_c('div', {
    staticClass: "ui-toolbar__brand-text"
  }, [_vm._v(_vm._s(_vm.brand))])])], 2) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "ui-toolbar__body",
    class: {
      'has-brand-divider': _vm.hasBrandDivider
    }
  }, [_vm._t("default", [(_vm.title) ? _c('div', {
    staticClass: "ui-toolbar__title"
  }, [_vm._v(_vm._s(_vm.title))]) : _vm._e()])], 2), _vm._v(" "), _c('div', {
    staticClass: "ui-toolbar__right"
  }, [_vm._t("actions")], 2), _vm._v(" "), _c('ui-progress-linear', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.loading),
      expression: "loading"
    }],
    staticClass: "ui-toolbar__progress",
    attrs: {
      "color": _vm.progressColor
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-b19a1326", esExports)
  }
}

/***/ }),
/* 183 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-datepicker-calendar",
    class: _vm.classes
  }, [_c('div', {
    staticClass: "ui-datepicker-calendar__header"
  }, [_c('div', {
    staticClass: "ui-datepicker-calendar__header-year",
    class: {
      'is-active': _vm.showYearPicker
    },
    attrs: {
      "tabindex": "0"
    },
    on: {
      "click": function($event) {
        _vm.$emit('update:currentView', 'year')
      },
      "keydown": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        _vm.$emit('update:currentView', 'year')
      }
    }
  }, [_vm._v(_vm._s(_vm.headerYear))]), _vm._v(" "), _c('div', {
    staticClass: "ui-datepicker-calendar__header-date",
    class: {
      'is-active': !_vm.showYearPicker
    },
    attrs: {
      "tabindex": "0"
    },
    on: {
      "click": function($event) {
        _vm.$emit('update:currentView', 'date')
      },
      "keydown": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        _vm.$emit('update:currentView', 'date')
      }
    }
  }, [_c('span', {
    staticClass: "ui-datepicker-calendar__header-weekday"
  }, [_vm._v(_vm._s(_vm.headerWeekday) + ", ")]), _vm._v(" "), _c('span', {
    staticClass: "ui-datepicker-calendar__header-day"
  }, [_vm._v(_vm._s(_vm.headerDay))])])]), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showYearPicker),
      expression: "showYearPicker"
    }],
    ref: "years",
    staticClass: "ui-datepicker-calendar__years"
  }, _vm._l((_vm.yearRange), function(year) {
    return (!_vm.isYearOutOfRange(year)) ? _c('li', {
      staticClass: "ui-datepicker-calendar__year",
      class: _vm.getYearClasses(year),
      attrs: {
        "tabindex": "0"
      },
      on: {
        "click": function($event) {
          _vm.selectYear(year)
        },
        "keydown": function($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
          _vm.selectYear(year)
        }
      }
    }, [_vm._v(_vm._s(year))]) : _vm._e()
  }), 0), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.showYearPicker),
      expression: "!showYearPicker"
    }],
    staticClass: "ui-datepicker-calendar__body"
  }, [_c('ui-calendar-controls', {
    ref: "controls",
    attrs: {
      "date-in-view": _vm.dateInView,
      "lang": _vm.lang,
      "max-date": _vm.maxDate,
      "min-date": _vm.minDate,
      "year-range": _vm.yearRange
    },
    on: {
      "go-to-date": _vm.onGoToDate
    }
  }), _vm._v(" "), _c('ui-calendar-month', {
    ref: "month",
    attrs: {
      "square-cells": "",
      "color": _vm.color,
      "date-filter": _vm.dateFilter,
      "date-in-view": _vm.dateInView,
      "lang": _vm.lang,
      "max-date": _vm.maxDate,
      "min-date": _vm.minDate,
      "selected": _vm.value,
      "start-of-week": _vm.startOfWeek
    },
    on: {
      "change": _vm.onMonthChange,
      "date-select": _vm.onDateSelect
    }
  })], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-b37986d0", esExports)
  }
}

/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "ui-switch",
    class: _vm.classes
  }, [_c('div', {
    staticClass: "ui-switch__input-wrapper"
  }, [_c('input', {
    ref: "input",
    staticClass: "ui-switch__input",
    attrs: {
      "type": "checkbox",
      "disabled": _vm.disabled,
      "name": _vm.name,
      "tabindex": _vm.tabindex
    },
    domProps: {
      "checked": _vm.isChecked,
      "value": _vm.submittedValue
    },
    on: {
      "blur": _vm.onBlur,
      "click": _vm.onClick,
      "focus": _vm.onFocus
    }
  }), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "ui-switch__track"
  })]), _vm._v(" "), (_vm.label || _vm.$slots.default) ? _c('div', {
    staticClass: "ui-switch__label-text"
  }, [_vm._t("default", [_vm._v(_vm._s(_vm.label))])], 2) : _vm._e()])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-switch__thumb"
  }, [_c('div', {
    staticClass: "ui-switch__focus-ring"
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ba5ec29c", esExports)
  }
}

/***/ }),
/* 185 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ui-collapsible",
    class: _vm.classes
  }, [_c('div', {
    staticClass: "ui-collapsible__header",
    attrs: {
      "aria-controls": _vm.id,
      "aria-expanded": _vm.isOpen ? 'true' : 'false',
      "tabindex": _vm.disabled ? null : 0
    },
    on: {
      "click": _vm.toggleCollapsible,
      "keydown": [function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) { return null; }
        $event.preventDefault();
        return _vm.toggleCollapsible($event)
      }, function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])) { return null; }
        $event.preventDefault();
        return _vm.toggleCollapsible($event)
      }]
    }
  }, [_c('div', {
    staticClass: "ui-collapsible__header-content"
  }, [_vm._t("header", [_vm._v(_vm._s(_vm.title))])], 2), _vm._v(" "), (!_vm.removeIcon) ? _c('ui-icon', {
    staticClass: "ui-collapsible__header-icon"
  }, [_c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24"
    }
  }, [_c('path', {
    attrs: {
      "d": "M7.406 7.828L12 12.422l4.594-4.594L18 9.234l-6 6-6-6z"
    }
  })])]) : _vm._e(), _vm._v(" "), (!_vm.disableRipple && !_vm.disabled) ? _c('ui-ripple-ink') : _vm._e()], 1), _vm._v(" "), _c('transition', {
    on: {
      "enter": _vm.onEnter,
      "after-enter": _vm.afterEnter,
      "before-leave": _vm.beforeLeave,
      "leave": _vm.onLeave
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isOpen),
      expression: "isOpen"
    }],
    ref: "bodyWrapper",
    staticClass: "ui-collapsible__body-wrapper",
    attrs: {
      "aria-hidden": _vm.isOpen ? null : 'true',
      "id": _vm.id
    }
  }, [_c('div', {
    staticClass: "ui-collapsible__body"
  }, [_vm._t("default")], 2)])])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ca040308", esExports)
  }
}

/***/ }),
/* 186 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('table', {
    staticClass: "ui-calendar-month"
  }, [_c('thead', {
    staticClass: "ui-calendar-month__header"
  }, [_c('tr', _vm._l((_vm.daysOfWeek), function(day) {
    return _c('th', [_vm._v(_vm._s(day))])
  }), 0)]), _vm._v(" "), _c('tbody', {
    staticClass: "ui-calendar-month__body"
  }, _vm._l((_vm.currentWeekStartDates), function(date) {
    return _c("ui-calendar-week", {
      key: date.toString(),
      tag: "tr",
      attrs: {
        "color": _vm.color,
        "date-filter": _vm.dateFilter,
        "max-date": _vm.maxDate,
        "min-date": _vm.minDate,
        "month": _vm.currentWeekStartDates[1].getMonth(),
        "selected": _vm.selected,
        "square-cells": _vm.squareCells,
        "week-start": date
      },
      on: {
        "date-select": _vm.onDateSelect
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function(props) {
          return (_vm.$scopedSlots.date) ? [_vm._t("date", null, {
            date: props.date
          })] : undefined
        }
      }])
    })
  }), 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = esExports;
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e023bc58", esExports)
  }
}

/***/ }),
/* 187 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 188 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrap__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__configure__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_util__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UiAlert_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__UiAutocomplete_vue__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__UiButton_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__UiCalendar_vue__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__UiCheckbox_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__UiCheckboxGroup_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__UiCloseButton_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__UiCollapsible_vue__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__UiConfirm_vue__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__UiDatepicker_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__UiDatepickerCalendar_vue__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__UiFab_vue__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__UiFileupload_vue__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__UiIcon_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__UiIconButton_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__UiMenu_vue__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__UiModal_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__UiPopover_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__UiPreloader_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__UiProgressCircular_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__UiProgressLinear_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__UiRadio_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__UiRadioGroup_vue__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__UiRippleInk_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__UiSelect_vue__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__UiSlider_vue__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__UiSnackbar_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__UiSnackbarContainer_vue__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__UiSwitch_vue__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__UiTab_vue__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__UiTabs_vue__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__UiTextbox_vue__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__UiToolbar_vue__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__UiTooltip_vue__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiAlert", function() { return __WEBPACK_IMPORTED_MODULE_3__UiAlert_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiAutocomplete", function() { return __WEBPACK_IMPORTED_MODULE_4__UiAutocomplete_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiButton", function() { return __WEBPACK_IMPORTED_MODULE_5__UiButton_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiCalendar", function() { return __WEBPACK_IMPORTED_MODULE_6__UiCalendar_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiCheckbox", function() { return __WEBPACK_IMPORTED_MODULE_7__UiCheckbox_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiCheckboxGroup", function() { return __WEBPACK_IMPORTED_MODULE_8__UiCheckboxGroup_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiCloseButton", function() { return __WEBPACK_IMPORTED_MODULE_9__UiCloseButton_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiCollapsible", function() { return __WEBPACK_IMPORTED_MODULE_10__UiCollapsible_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiConfirm", function() { return __WEBPACK_IMPORTED_MODULE_11__UiConfirm_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiDatepicker", function() { return __WEBPACK_IMPORTED_MODULE_12__UiDatepicker_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiDatepickerCalendar", function() { return __WEBPACK_IMPORTED_MODULE_13__UiDatepickerCalendar_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiFab", function() { return __WEBPACK_IMPORTED_MODULE_14__UiFab_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiFileupload", function() { return __WEBPACK_IMPORTED_MODULE_15__UiFileupload_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiIcon", function() { return __WEBPACK_IMPORTED_MODULE_16__UiIcon_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiIconButton", function() { return __WEBPACK_IMPORTED_MODULE_17__UiIconButton_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiMenu", function() { return __WEBPACK_IMPORTED_MODULE_18__UiMenu_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiModal", function() { return __WEBPACK_IMPORTED_MODULE_19__UiModal_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiPopover", function() { return __WEBPACK_IMPORTED_MODULE_20__UiPopover_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiPreloader", function() { return __WEBPACK_IMPORTED_MODULE_21__UiPreloader_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiProgressCircular", function() { return __WEBPACK_IMPORTED_MODULE_22__UiProgressCircular_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiProgressLinear", function() { return __WEBPACK_IMPORTED_MODULE_23__UiProgressLinear_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiRadio", function() { return __WEBPACK_IMPORTED_MODULE_24__UiRadio_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiRadioGroup", function() { return __WEBPACK_IMPORTED_MODULE_25__UiRadioGroup_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiRippleInk", function() { return __WEBPACK_IMPORTED_MODULE_26__UiRippleInk_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiSelect", function() { return __WEBPACK_IMPORTED_MODULE_27__UiSelect_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiSlider", function() { return __WEBPACK_IMPORTED_MODULE_28__UiSlider_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiSnackbar", function() { return __WEBPACK_IMPORTED_MODULE_29__UiSnackbar_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiSnackbarContainer", function() { return __WEBPACK_IMPORTED_MODULE_30__UiSnackbarContainer_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiSwitch", function() { return __WEBPACK_IMPORTED_MODULE_31__UiSwitch_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiTab", function() { return __WEBPACK_IMPORTED_MODULE_32__UiTab_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiTabs", function() { return __WEBPACK_IMPORTED_MODULE_33__UiTabs_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiTextbox", function() { return __WEBPACK_IMPORTED_MODULE_34__UiTextbox_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiToolbar", function() { return __WEBPACK_IMPORTED_MODULE_35__UiToolbar_vue__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UiTooltip", function() { return __WEBPACK_IMPORTED_MODULE_36__UiTooltip_vue__["a"]; });







































var KeenUI = {
    UiAlert: __WEBPACK_IMPORTED_MODULE_3__UiAlert_vue__["a" /* default */],
    UiAutocomplete: __WEBPACK_IMPORTED_MODULE_4__UiAutocomplete_vue__["a" /* default */],
    UiButton: __WEBPACK_IMPORTED_MODULE_5__UiButton_vue__["a" /* default */],
    UiCalendar: __WEBPACK_IMPORTED_MODULE_6__UiCalendar_vue__["a" /* default */],
    UiCheckbox: __WEBPACK_IMPORTED_MODULE_7__UiCheckbox_vue__["a" /* default */],
    UiCheckboxGroup: __WEBPACK_IMPORTED_MODULE_8__UiCheckboxGroup_vue__["a" /* default */],
    UiCloseButton: __WEBPACK_IMPORTED_MODULE_9__UiCloseButton_vue__["a" /* default */],
    UiCollapsible: __WEBPACK_IMPORTED_MODULE_10__UiCollapsible_vue__["a" /* default */],
    UiConfirm: __WEBPACK_IMPORTED_MODULE_11__UiConfirm_vue__["a" /* default */],
    UiDatepicker: __WEBPACK_IMPORTED_MODULE_12__UiDatepicker_vue__["a" /* default */],
    UiDatepickerCalendar: __WEBPACK_IMPORTED_MODULE_13__UiDatepickerCalendar_vue__["a" /* default */],
    UiFab: __WEBPACK_IMPORTED_MODULE_14__UiFab_vue__["a" /* default */],
    UiFileupload: __WEBPACK_IMPORTED_MODULE_15__UiFileupload_vue__["a" /* default */],
    UiIcon: __WEBPACK_IMPORTED_MODULE_16__UiIcon_vue__["a" /* default */],
    UiIconButton: __WEBPACK_IMPORTED_MODULE_17__UiIconButton_vue__["a" /* default */],
    UiMenu: __WEBPACK_IMPORTED_MODULE_18__UiMenu_vue__["a" /* default */],
    UiModal: __WEBPACK_IMPORTED_MODULE_19__UiModal_vue__["a" /* default */],
    UiPopover: __WEBPACK_IMPORTED_MODULE_20__UiPopover_vue__["a" /* default */],
    UiPreloader: __WEBPACK_IMPORTED_MODULE_21__UiPreloader_vue__["a" /* default */],
    UiProgressCircular: __WEBPACK_IMPORTED_MODULE_22__UiProgressCircular_vue__["a" /* default */],
    UiProgressLinear: __WEBPACK_IMPORTED_MODULE_23__UiProgressLinear_vue__["a" /* default */],
    UiRadio: __WEBPACK_IMPORTED_MODULE_24__UiRadio_vue__["a" /* default */],
    UiRadioGroup: __WEBPACK_IMPORTED_MODULE_25__UiRadioGroup_vue__["a" /* default */],
    UiRippleInk: __WEBPACK_IMPORTED_MODULE_26__UiRippleInk_vue__["a" /* default */],
    UiSelect: __WEBPACK_IMPORTED_MODULE_27__UiSelect_vue__["a" /* default */],
    UiSlider: __WEBPACK_IMPORTED_MODULE_28__UiSlider_vue__["a" /* default */],
    UiSnackbar: __WEBPACK_IMPORTED_MODULE_29__UiSnackbar_vue__["a" /* default */],
    UiSnackbarContainer: __WEBPACK_IMPORTED_MODULE_30__UiSnackbarContainer_vue__["a" /* default */],
    UiSwitch: __WEBPACK_IMPORTED_MODULE_31__UiSwitch_vue__["a" /* default */],
    UiTab: __WEBPACK_IMPORTED_MODULE_32__UiTab_vue__["a" /* default */],
    UiTabs: __WEBPACK_IMPORTED_MODULE_33__UiTabs_vue__["a" /* default */],
    UiTextbox: __WEBPACK_IMPORTED_MODULE_34__UiTextbox_vue__["a" /* default */],
    UiToolbar: __WEBPACK_IMPORTED_MODULE_35__UiToolbar_vue__["a" /* default */],
    UiTooltip: __WEBPACK_IMPORTED_MODULE_36__UiTooltip_vue__["a" /* default */]
};

KeenUI.install = function (Vue) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Object.keys(config).forEach(function (key) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__helpers_util__["a" /* startsWith */])(key, 'Ui')) {
            if (KeenUI[key] === undefined) {
                return;
            }

            var Component = KeenUI[key];
            var props = config[key];

            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__configure__["a" /* default */])(Component, props);
        }
    });

    Object.keys(KeenUI).forEach(function (key) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__helpers_util__["a" /* startsWith */])(key, 'Ui')) {
            var Component = KeenUI[key];
            Vue.component(Component.name, Component);
        }
    });
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(KeenUI, window.KeenUiConfig);
}

/* harmony default export */ __webpack_exports__["default"] = KeenUI;



/***/ })
/******/ ]);
});
},{}],"node_modules/keen-ui/dist/keen-ui.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/plugins/keen-ui-plugin.js":[function(require,module,exports) {
"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _keenUi = _interopRequireDefault(require("keen-ui"));

require("keen-ui/dist/keen-ui.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue.default.use(_keenUi.default);
},{"vue":"node_modules/vue/dist/vue.runtime.esm.js","keen-ui":"node_modules/keen-ui/dist/keen-ui.js","keen-ui/dist/keen-ui.css":"node_modules/keen-ui/dist/keen-ui.css"}],"node_modules/vue-router/dist/vue-router.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
  * vue-router v3.4.0
  * (c) 2020 Evan You
  * @license MIT
  */

/*  */
function assert(condition, message) {
  if (!condition) {
    throw new Error("[vue-router] " + message);
  }
}

function warn(condition, message) {
  if ("development" !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn("[vue-router] " + message);
  }
}

function extend(a, b) {
  for (var key in b) {
    a[key] = b[key];
  }

  return a;
}

var View = {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render(_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data; // used by devtools to display a router-view badge

    data.routerView = true; // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots

    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {}); // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.

    var depth = 0;
    var inactive = false;

    while (parent && parent._routerRoot !== parent) {
      var vnodeData = parent.$vnode ? parent.$vnode.data : {};

      if (vnodeData.routerView) {
        depth++;
      }

      if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
        inactive = true;
      }

      parent = parent.$parent;
    }

    data.routerViewDepth = depth; // render previous view if the tree is inactive and kept-alive

    if (inactive) {
      var cachedData = cache[name];
      var cachedComponent = cachedData && cachedData.component;

      if (cachedComponent) {
        // #2301
        // pass props
        if (cachedData.configProps) {
          fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
        }

        return h(cachedComponent, data, children);
      } else {
        // render previous empty view
        return h();
      }
    }

    var matched = route.matched[depth];
    var component = matched && matched.components[name]; // render empty node if no matched route or no config component

    if (!matched || !component) {
      cache[name] = null;
      return h();
    } // cache component


    cache[name] = {
      component: component
    }; // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks

    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];

      if (val && current !== vm || !val && current === vm) {
        matched.instances[name] = val;
      }
    } // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;

    (data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    }; // register instance in init hook
    // in case kept-alive component be actived when routes changed


    data.hook.init = function (vnode) {
      if (vnode.data.keepAlive && vnode.componentInstance && vnode.componentInstance !== matched.instances[name]) {
        matched.instances[name] = vnode.componentInstance;
      }
    };

    var configProps = matched.props && matched.props[name]; // save route and configProps in cache

    if (configProps) {
      extend(cache[name], {
        route: route,
        configProps: configProps
      });
      fillPropsinData(component, data, route, configProps);
    }

    return h(component, data, children);
  }
};

function fillPropsinData(component, data, route, configProps) {
  // resolve props
  var propsToPass = data.props = resolveProps(route, configProps);

  if (propsToPass) {
    // clone to prevent mutation
    propsToPass = data.props = extend({}, propsToPass); // pass non-declared props as attrs

    var attrs = data.attrs = data.attrs || {};

    for (var key in propsToPass) {
      if (!component.props || !(key in component.props)) {
        attrs[key] = propsToPass[key];
        delete propsToPass[key];
      }
    }
  }
}

function resolveProps(route, config) {
  switch (typeof config) {
    case 'undefined':
      return;

    case 'object':
      return config;

    case 'function':
      return config(route);

    case 'boolean':
      return config ? route.params : undefined;

    default:
      if ("development" !== 'production') {
        warn(false, "props in \"" + route.path + "\" is a " + typeof config + ", " + "expecting an object, function or boolean.");
      }

  }
}
/*  */


var encodeReserveRE = /[!'()*]/g;

var encodeReserveReplacer = function (c) {
  return '%' + c.charCodeAt(0).toString(16);
};

var commaRE = /%2C/g; // fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas

var encode = function (str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};

var decode = decodeURIComponent;

function resolveQuery(query, extraQuery, _parseQuery) {
  if (extraQuery === void 0) extraQuery = {};
  var parse = _parseQuery || parseQuery;
  var parsedQuery;

  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "development" !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }

  for (var key in extraQuery) {
    var value = extraQuery[key];
    parsedQuery[key] = Array.isArray(value) ? value.map(function (v) {
      return '' + v;
    }) : '' + value;
  }

  return parsedQuery;
}

function parseQuery(query) {
  var res = {};
  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res;
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0 ? decode(parts.join('=')) : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });
  return res;
}

function stringifyQuery(obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return '';
    }

    if (val === null) {
      return encode(key);
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }

        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&');
    }

    return encode(key) + '=' + encode(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?" + res : '';
}
/*  */


var trailingSlashRE = /\/?$/;

function createRoute(record, location, redirectedFrom, router) {
  var stringifyQuery = router && router.options.stringifyQuery;
  var query = location.query || {};

  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || record && record.name,
    meta: record && record.meta || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  };

  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
  }

  return Object.freeze(route);
}

function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone);
  } else if (value && typeof value === 'object') {
    var res = {};

    for (var key in value) {
      res[key] = clone(value[key]);
    }

    return res;
  } else {
    return value;
  }
} // the starting route that represents the initial state


var START = createRoute(null, {
  path: '/'
});

function formatMatch(record) {
  var res = [];

  while (record) {
    res.unshift(record);
    record = record.parent;
  }

  return res;
}

function getFullPath(ref, _stringifyQuery) {
  var path = ref.path;
  var query = ref.query;
  if (query === void 0) query = {};
  var hash = ref.hash;
  if (hash === void 0) hash = '';
  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash;
}

function isSameRoute(a, b) {
  if (b === START) {
    return a === b;
  } else if (!b) {
    return false;
  } else if (a.path && b.path) {
    return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && a.hash === b.hash && isObjectEqual(a.query, b.query);
  } else if (a.name && b.name) {
    return a.name === b.name && a.hash === b.hash && isObjectEqual(a.query, b.query) && isObjectEqual(a.params, b.params);
  } else {
    return false;
  }
}

function isObjectEqual(a, b) {
  if (a === void 0) a = {};
  if (b === void 0) b = {}; // handle null value #1566

  if (!a || !b) {
    return a === b;
  }

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key]; // check nested equality

    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal);
    }

    return String(aVal) === String(bVal);
  });
}

function isIncludedRoute(current, target) {
  return current.path.replace(trailingSlashRE, '/').indexOf(target.path.replace(trailingSlashRE, '/')) === 0 && (!target.hash || current.hash === target.hash) && queryIncludes(current.query, target.query);
}

function queryIncludes(current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false;
    }
  }

  return true;
}
/*  */


function resolvePath(relative, base, append) {
  var firstChar = relative.charAt(0);

  if (firstChar === '/') {
    return relative;
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative;
  }

  var stack = base.split('/'); // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)

  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  } // resolve relative path


  var segments = relative.replace(/^\//, '').split('/');

  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];

    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  } // ensure leading slash


  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/');
}

function parsePath(path) {
  var hash = '';
  var query = '';
  var hashIndex = path.indexOf('#');

  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');

  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  };
}

function cleanPath(path) {
  return path.replace(/\/\//g, '/');
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};
/**
 * Expose `pathToRegexp`.
 */


var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;
/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */

var PATH_REGEXP = new RegExp([// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');
/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */

function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length; // Ignore already escaped sequences.

    if (escaped) {
      path += escaped[1];
      continue;
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7]; // Push the current path onto the tokens.

    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;
    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
    });
  } // Match any characters still remaining.


  if (index < str.length) {
    path += str.substr(index);
  } // If the path exists, push it onto the end.


  if (path) {
    tokens.push(path);
  }

  return tokens;
}
/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */


function compile(str, options) {
  return tokensToFunction(parse(str, options), options);
}
/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */


function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */


function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
/**
 * Expose a method for transforming tokens into the path function.
 */


function tokensToFunction(tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length); // Compile all the patterns before compilation.

  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;
        continue;
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue;
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined');
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
        }

        if (value.length === 0) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
      }

      path += token.prefix + segment;
    }

    return path;
  };
}
/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */


function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}
/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */


function escapeGroup(group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}
/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */


function attachKeys(re, keys) {
  re.keys = keys;
  return re;
}
/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */


function flags(options) {
  return options && options.sensitive ? '' : 'i';
}
/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */


function regexpToRegexp(path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys);
}
/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */


function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
  return attachKeys(regexp, keys);
}
/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */


function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */


function tokensToRegExp(tokens, keys, options) {
  if (!isarray(keys)) {
    options =
    /** @type {!Object} */
    keys || options;
    keys = [];
  }

  options = options || {};
  var strict = options.strict;
  var end = options.end !== false;
  var route = ''; // Iterate over the tokens and create our regexp string.

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';
      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter; // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".

  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */


function pathToRegexp(path, keys, options) {
  if (!isarray(keys)) {
    options =
    /** @type {!Object} */
    keys || options;
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path,
    /** @type {!Array} */
    keys);
  }

  if (isarray(path)) {
    return arrayToRegexp(
    /** @type {!Array} */
    path,
    /** @type {!Array} */
    keys, options);
  }

  return stringToRegexp(
  /** @type {string} */
  path,
  /** @type {!Array} */
  keys, options);
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;
/*  */
// $flow-disable-line

var regexpCompileCache = Object.create(null);

function fillParams(path, params, routeMsg) {
  params = params || {};

  try {
    var filler = regexpCompileCache[path] || (regexpCompileCache[path] = pathToRegexp_1.compile(path)); // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
    // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string

    if (typeof params.pathMatch === 'string') {
      params[0] = params.pathMatch;
    }

    return filler(params, {
      pretty: true
    });
  } catch (e) {
    if ("development" !== 'production') {
      // Fix #3072 no warn if `pathMatch` is string
      warn(typeof params.pathMatch === 'string', "missing param for " + routeMsg + ": " + e.message);
    }

    return '';
  } finally {
    // delete the 0 if it was added
    delete params[0];
  }
}
/*  */


function normalizeLocation(raw, current, append, router) {
  var next = typeof raw === 'string' ? {
    path: raw
  } : raw; // named target

  if (next._normalized) {
    return next;
  } else if (next.name) {
    next = extend({}, raw);
    var params = next.params;

    if (params && typeof params === 'object') {
      next.params = extend({}, params);
    }

    return next;
  } // relative params


  if (!next.path && next.params && current) {
    next = extend({}, next);
    next._normalized = true;
    var params$1 = extend(extend({}, current.params), next.params);

    if (current.name) {
      next.name = current.name;
      next.params = params$1;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params$1, "path " + current.path);
    } else if ("development" !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }

    return next;
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = current && current.path || '/';
  var path = parsedPath.path ? resolvePath(parsedPath.path, basePath, append || next.append) : basePath;
  var query = resolveQuery(parsedPath.query, next.query, router && router.options.parseQuery);
  var hash = next.hash || parsedPath.hash;

  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  };
}
/*  */
// work around weird flow bug


var toTypes = [String, Object];
var eventTypes = [String, Array];

var noop = function () {};

var Link = {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    ariaCurrentValue: {
      type: String,
      default: 'page'
    },
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render(h) {
    var this$1 = this;
    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;
    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass; // Support global empty active class

    var activeClassFallback = globalActiveClass == null ? 'router-link-active' : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null ? 'router-link-exact-active' : globalExactActiveClass;
    var activeClass = this.activeClass == null ? activeClassFallback : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null ? exactActiveClassFallback : this.exactActiveClass;
    var compareTarget = route.redirectedFrom ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router) : route;
    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact ? classes[exactActiveClass] : isIncludedRoute(current, compareTarget);
    var ariaCurrentValue = classes[exactActiveClass] ? this.ariaCurrentValue : null;

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location, noop);
        } else {
          router.push(location, noop);
        }
      }
    };

    var on = {
      click: guardEvent
    };

    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) {
        on[e] = handler;
      });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };
    var scopedSlot = !this.$scopedSlots.$hasNormal && this.$scopedSlots.default && this.$scopedSlots.default({
      href: href,
      route: route,
      navigate: handler,
      isActive: classes[activeClass],
      isExactActive: classes[exactActiveClass]
    });

    if (scopedSlot) {
      if (scopedSlot.length === 1) {
        return scopedSlot[0];
      } else if (scopedSlot.length > 1 || !scopedSlot.length) {
        if ("development" !== 'production') {
          warn(false, "RouterLink with to=\"" + this.to + "\" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.");
        }

        return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot);
      }
    }

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = {
        href: href,
        'aria-current': ariaCurrentValue
      };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);

      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var aData = a.data = extend({}, a.data);
        aData.on = aData.on || {}; // transform existing events in both objects into arrays so we can push later

        for (var event in aData.on) {
          var handler$1 = aData.on[event];

          if (event in on) {
            aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
          }
        } // append new listeners for router-link


        for (var event$1 in on) {
          if (event$1 in aData.on) {
            // on[event] is always a function
            aData.on[event$1].push(on[event$1]);
          } else {
            aData.on[event$1] = handler;
          }
        }

        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
        aAttrs['aria-current'] = ariaCurrentValue;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default);
  }
};

function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
    return;
  } // don't redirect when preventDefault called


  if (e.defaultPrevented) {
    return;
  } // don't redirect on right click


  if (e.button !== undefined && e.button !== 0) {
    return;
  } // don't redirect if `target="_blank"`


  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');

    if (/\b_blank\b/i.test(target)) {
      return;
    }
  } // this may be a Weex event which doesn't have this method


  if (e.preventDefault) {
    e.preventDefault();
  }

  return true;
}

function findAnchor(children) {
  if (children) {
    var child;

    for (var i = 0; i < children.length; i++) {
      child = children[i];

      if (child.tag === 'a') {
        return child;
      }

      if (child.children && (child = findAnchor(child.children))) {
        return child;
      }
    }
  }
}

var _Vue;

function install(Vue) {
  if (install.installed && _Vue === Vue) {
    return;
  }

  install.installed = true;
  _Vue = Vue;

  var isDef = function (v) {
    return v !== undefined;
  };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;

    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;

        this._router.init(this);

        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot || this;
      }

      registerInstance(this, this);
    },
    destroyed: function destroyed() {
      registerInstance(this);
    }
  });
  Object.defineProperty(Vue.prototype, '$router', {
    get: function get() {
      return this._routerRoot._router;
    }
  });
  Object.defineProperty(Vue.prototype, '$route', {
    get: function get() {
      return this._routerRoot._route;
    }
  });
  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);
  var strats = Vue.config.optionMergeStrategies; // use the same hook merging strategy for route hooks

  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}
/*  */


var inBrowser = typeof window !== 'undefined';
/*  */

function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || []; // $flow-disable-line

  var pathMap = oldPathMap || Object.create(null); // $flow-disable-line

  var nameMap = oldNameMap || Object.create(null);
  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  }); // ensure wildcard routes are always at the end

  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  if ("development" === 'development') {
    // warn if routes do not include leading slashes
    var found = pathList // check for missing leading slash
    .filter(function (path) {
      return path && path.charAt(0) !== '*' && path.charAt(0) !== '/';
    });

    if (found.length > 0) {
      var pathNames = found.map(function (path) {
        return "- " + path;
      }).join('\n');
      warn(false, "Non-nested routes must include a leading slash character. Fix the following routes: \n" + pathNames);
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  };
}

function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
  var path = route.path;
  var name = route.name;

  if ("development" !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(typeof route.component !== 'string', "route config \"component\" for path: " + String(path || name) + " cannot be a " + "string id. Use an actual component instead.");
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || {
      default: route.component
    },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null ? {} : route.components ? route.props : {
      default: route.props
    }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if ("development" !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) {
        return /^\/?$/.test(child.path);
      })) {
        warn(false, "Named Route '" + route.name + "' has a default child route. " + "When navigating to this named route (:to=\"{name: '" + route.name + "'\"), " + "the default child route will not be rendered. Remove the name from " + "this route and use the name of the default child route for named " + "links instead.");
      }
    }

    route.children.forEach(function (child) {
      var childMatchAs = matchAs ? cleanPath(matchAs + "/" + child.path) : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];

    for (var i = 0; i < aliases.length; ++i) {
      var alias = aliases[i];

      if ("development" !== 'production' && alias === path) {
        warn(false, "Found an alias with the same value as the path: \"" + path + "\". You have to remove that alias. It will be ignored in development."); // skip in dev to make it work

        continue;
      }

      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path || '/' // matchAs
      );
    }
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ("development" !== 'production' && !matchAs) {
      warn(false, "Duplicate named routes definition: " + "{ name: \"" + name + "\", path: \"" + record.path + "\" }");
    }
  }
}

function compileRouteRegex(path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);

  if ("development" !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], "Duplicate param keys in route with path: \"" + path + "\"");
      keys[key.name] = true;
    });
  }

  return regex;
}

function normalizePath(path, parent, strict) {
  if (!strict) {
    path = path.replace(/\/$/, '');
  }

  if (path[0] === '/') {
    return path;
  }

  if (parent == null) {
    return path;
  }

  return cleanPath(parent.path + "/" + path);
}
/*  */


function createMatcher(routes, router) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match(raw, currentRoute, redirectedFrom) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];

      if ("development" !== 'production') {
        warn(record, "Route with name '" + name + "' does not exist");
      }

      if (!record) {
        return _createRoute(null, location);
      }

      var paramNames = record.regex.keys.filter(function (key) {
        return !key.optional;
      }).map(function (key) {
        return key.name;
      });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      location.path = fillParams(record.path, location.params, "named route \"" + name + "\"");
      return _createRoute(record, location, redirectedFrom);
    } else if (location.path) {
      location.params = {};

      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];

        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom);
        }
      }
    } // no match


    return _createRoute(null, location);
  }

  function redirect(record, location) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function' ? originalRedirect(createRoute(record, location, null, router)) : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = {
        path: redirect
      };
    }

    if (!redirect || typeof redirect !== 'object') {
      if ("development" !== 'production') {
        warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      }

      return _createRoute(null, location);
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];

      if ("development" !== 'production') {
        assert(targetRecord, "redirect failed: named route \"" + name + "\" not found.");
      }

      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location);
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record); // 2. resolve params

      var resolvedPath = fillParams(rawPath, params, "redirect route with path \"" + rawPath + "\""); // 3. rematch with existing query and hash

      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location);
    } else {
      if ("development" !== 'production') {
        warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      }

      return _createRoute(null, location);
    }
  }

  function alias(record, location, matchAs) {
    var aliasedPath = fillParams(matchAs, location.params, "aliased route with path \"" + matchAs + "\"");
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });

    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location);
    }

    return _createRoute(null, location);
  }

  function _createRoute(record, location, redirectedFrom) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location);
    }

    if (record && record.matchAs) {
      return alias(record, location, record.matchAs);
    }

    return createRoute(record, location, redirectedFrom, router);
  }

  return {
    match: match,
    addRoutes: addRoutes
  };
}

function matchRoute(regex, path, params) {
  var m = path.match(regex);

  if (!m) {
    return false;
  } else if (!params) {
    return true;
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];

    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = val;
    }
  }

  return true;
}

function resolveRecordPath(path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true);
}
/*  */
// use User Timing api (if present) for more accurate key precision


var Time = inBrowser && window.performance && window.performance.now ? window.performance : Date;

function genStateKey() {
  return Time.now().toFixed(3);
}

var _key = genStateKey();

function getStateKey() {
  return _key;
}

function setStateKey(key) {
  return _key = key;
}
/*  */


var positionStore = Object.create(null);

function setupScroll() {
  // Prevent browser scroll behavior on History popstate
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  } // Fix for #1585 for Firefox
  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
  // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
  // window.location.protocol + '//' + window.location.host
  // location.host contains the port and location.hostname doesn't


  var protocolAndPath = window.location.protocol + '//' + window.location.host;
  var absolutePath = window.location.href.replace(protocolAndPath, ''); // preserve existing history state as it could be overriden by the user

  var stateCopy = extend({}, window.history.state);
  stateCopy.key = getStateKey();
  window.history.replaceState(stateCopy, '', absolutePath);
  window.addEventListener('popstate', handlePopState);
  return function () {
    window.removeEventListener('popstate', handlePopState);
  };
}

function handleScroll(router, to, from, isPop) {
  if (!router.app) {
    return;
  }

  var behavior = router.options.scrollBehavior;

  if (!behavior) {
    return;
  }

  if ("development" !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  } // wait until re-render finishes before scrolling


  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior.call(router, to, from, isPop ? position : null);

    if (!shouldScroll) {
      return;
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition(shouldScroll, position);
      }).catch(function (err) {
        if ("development" !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition() {
  var key = getStateKey();

  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function handlePopState(e) {
  saveScrollPosition();

  if (e.state && e.state.key) {
    setStateKey(e.state.key);
  }
}

function getScrollPosition() {
  var key = getStateKey();

  if (key) {
    return positionStore[key];
  }
}

function getElementPosition(el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  };
}

function isValidPosition(obj) {
  return isNumber(obj.x) || isNumber(obj.y);
}

function normalizePosition(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  };
}

function normalizeOffset(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  };
}

function isNumber(v) {
  return typeof v === 'number';
}

var hashStartsWithNumberRE = /^#\d/;

function scrollToPosition(shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';

  if (isObject && typeof shouldScroll.selector === 'string') {
    // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
    // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
    var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
    ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
    : document.querySelector(shouldScroll.selector);

    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}
/*  */


var supportsPushState = inBrowser && function () {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }

  return window.history && typeof window.history.pushState === 'function';
}();

function pushState(url, replace) {
  saveScrollPosition(); // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls

  var history = window.history;

  try {
    if (replace) {
      // preserve existing history state as it could be overriden by the user
      var stateCopy = extend({}, history.state);
      stateCopy.key = getStateKey();
      history.replaceState(stateCopy, '', url);
    } else {
      history.pushState({
        key: setStateKey(genStateKey())
      }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState(url) {
  pushState(url, true);
}
/*  */


function runQueue(queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };

  step(0);
}

var NavigationFailureType = {
  redirected: 2,
  aborted: 4,
  cancelled: 8,
  duplicated: 16
};

function createNavigationRedirectedError(from, to) {
  return createRouterError(from, to, NavigationFailureType.redirected, "Redirected when going from \"" + from.fullPath + "\" to \"" + stringifyRoute(to) + "\" via a navigation guard.");
}

function createNavigationDuplicatedError(from, to) {
  var error = createRouterError(from, to, NavigationFailureType.duplicated, "Avoided redundant navigation to current location: \"" + from.fullPath + "\"."); // backwards compatible with the first introduction of Errors

  error.name = 'NavigationDuplicated';
  return error;
}

function createNavigationCancelledError(from, to) {
  return createRouterError(from, to, NavigationFailureType.cancelled, "Navigation cancelled from \"" + from.fullPath + "\" to \"" + to.fullPath + "\" with a new navigation.");
}

function createNavigationAbortedError(from, to) {
  return createRouterError(from, to, NavigationFailureType.aborted, "Navigation aborted from \"" + from.fullPath + "\" to \"" + to.fullPath + "\" via a navigation guard.");
}

function createRouterError(from, to, type, message) {
  var error = new Error(message);
  error._isRouter = true;
  error.from = from;
  error.to = to;
  error.type = type;
  return error;
}

var propertiesToLog = ['params', 'query', 'hash'];

function stringifyRoute(to) {
  if (typeof to === 'string') {
    return to;
  }

  if ('path' in to) {
    return to.path;
  }

  var location = {};
  propertiesToLog.forEach(function (key) {
    if (key in to) {
      location[key] = to[key];
    }
  });
  return JSON.stringify(location, null, 2);
}

function isError(err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

function isNavigationFailure(err, errorType) {
  return isError(err) && err._isRouter && (errorType == null || err.type === errorType);
}
/*  */


function resolveAsyncComponents(matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;
    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;
        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          } // save resolved on async factory in case it's used elsewhere


          def.resolved = typeof resolvedDef === 'function' ? resolvedDef : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;

          if (pending <= 0) {
            next();
          }
        });
        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "development" !== 'production' && warn(false, msg);

          if (!error) {
            error = isError(reason) ? reason : new Error(msg);
            next(error);
          }
        });
        var res;

        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }

        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;

            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) {
      next();
    }
  };
}

function flatMapComponents(matched, fn) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return fn(m.components[key], m.instances[key], m, key);
    });
  }));
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

var hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

function isESModule(obj) {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === 'Module';
} // in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.


function once(fn) {
  var called = false;
  return function () {
    var args = [],
        len = arguments.length;

    while (len--) args[len] = arguments[len];

    if (called) {
      return;
    }

    called = true;
    return fn.apply(this, args);
  };
}
/*  */


var History = function History(router, base) {
  this.router = router;
  this.base = normalizeBase(base); // start with a route object that stands for "nowhere"

  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
  this.listeners = [];
};

History.prototype.listen = function listen(cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady(cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);

    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError(errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo(location, onComplete, onAbort) {
  var this$1 = this;
  var route; // catch redirect option https://github.com/vuejs/vue-router/issues/3201

  try {
    route = this.router.match(location, this.current);
  } catch (e) {
    this.errorCbs.forEach(function (cb) {
      cb(e);
    }); // Exception should still be thrown

    throw e;
  }

  this.confirmTransition(route, function () {
    var prev = this$1.current;
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();
    this$1.router.afterHooks.forEach(function (hook) {
      hook && hook(route, prev);
    }); // fire ready cbs once

    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) {
        cb(route);
      });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }

    if (err && !this$1.ready) {
      this$1.ready = true; // Initial redirection should still trigger the onReady onSuccess
      // https://github.com/vuejs/vue-router/issues/3225

      if (!isNavigationFailure(err, NavigationFailureType.redirected)) {
        this$1.readyErrorCbs.forEach(function (cb) {
          cb(err);
        });
      } else {
        this$1.readyCbs.forEach(function (cb) {
          cb(route);
        });
      }
    }
  });
};

History.prototype.confirmTransition = function confirmTransition(route, onComplete, onAbort) {
  var this$1 = this;
  var current = this.current;

  var abort = function (err) {
    // changed after adding errors with
    // https://github.com/vuejs/vue-router/pull/3047 before that change,
    // redirect and aborted navigation would produce an err == null
    if (!isNavigationFailure(err) && isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) {
          cb(err);
        });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }

    onAbort && onAbort(err);
  };

  var lastRouteIndex = route.matched.length - 1;
  var lastCurrentIndex = current.matched.length - 1;

  if (isSameRoute(route, current) && // in the case the route map has been dynamically appended to
  lastRouteIndex === lastCurrentIndex && route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]) {
    this.ensureURL();
    return abort(createNavigationDuplicatedError(current, route));
  }

  var ref = resolveQueue(this.current.matched, route.matched);
  var updated = ref.updated;
  var deactivated = ref.deactivated;
  var activated = ref.activated;
  var queue = [].concat( // in-component leave guards
  extractLeaveGuards(deactivated), // global before hooks
  this.router.beforeHooks, // in-component update hooks
  extractUpdateHooks(updated), // in-config enter guards
  activated.map(function (m) {
    return m.beforeEnter;
  }), // async components
  resolveAsyncComponents(activated));
  this.pending = route;

  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort(createNavigationCancelledError(current, route));
    }

    try {
      hook(route, current, function (to) {
        if (to === false) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(createNavigationAbortedError(current, route));
        } else if (isError(to)) {
          this$1.ensureURL(true);
          abort(to);
        } else if (typeof to === 'string' || typeof to === 'object' && (typeof to.path === 'string' || typeof to.name === 'string')) {
          // next('/') or next({ path: '/' }) -> redirect
          abort(createNavigationRedirectedError(current, route));

          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];

    var isValid = function () {
      return this$1.current === route;
    }; // wait until async components are resolved before
    // extracting in-component enter guards


    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort(createNavigationCancelledError(current, route));
      }

      this$1.pending = null;
      onComplete(route);

      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) {
            cb();
          });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute(route) {
  this.current = route;
  this.cb && this.cb(route);
};

History.prototype.setupListeners = function setupListeners() {// Default implementation is empty
};

History.prototype.teardownListeners = function teardownListeners() {
  this.listeners.forEach(function (cleanupListener) {
    cleanupListener();
  });
  this.listeners = [];
};

function normalizeBase(base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = baseEl && baseEl.getAttribute('href') || '/'; // strip full URL origin

      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  } // make sure there's the starting slash


  if (base.charAt(0) !== '/') {
    base = '/' + base;
  } // remove trailing slash


  return base.replace(/\/$/, '');
}

function resolveQueue(current, next) {
  var i;
  var max = Math.max(current.length, next.length);

  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break;
    }
  }

  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  };
}

function extractGuards(records, name, bind, reverse) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);

    if (guard) {
      return Array.isArray(guard) ? guard.map(function (guard) {
        return bind(guard, instance, match, key);
      }) : bind(guard, instance, match, key);
    }
  });
  return flatten(reverse ? guards.reverse() : guards);
}

function extractGuard(def, key) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }

  return def.options[key];
}

function extractLeaveGuards(deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
}

function extractUpdateHooks(updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard);
}

function bindGuard(guard, instance) {
  if (instance) {
    return function boundRouteGuard() {
      return guard.apply(instance, arguments);
    };
  }
}

function extractEnterGuards(activated, cbs, isValid) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid);
  });
}

function bindEnterGuard(guard, match, key, cbs, isValid) {
  return function routeEnterGuard(to, from, next) {
    return guard(to, from, function (cb) {
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }

      next(cb);
    });
  };
}

function poll(cb, // somehow flow cannot infer this is a function
instances, key, isValid) {
  if (instances[key] && !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
      cb(instances[key]);
    } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}
/*  */


var HTML5History = /*@__PURE__*/function (History) {
  function HTML5History(router, base) {
    History.call(this, router, base);
    this._startLocation = getLocation(this.base);
  }

  if (History) HTML5History.__proto__ = History;
  HTML5History.prototype = Object.create(History && History.prototype);
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.setupListeners = function setupListeners() {
    var this$1 = this;

    if (this.listeners.length > 0) {
      return;
    }

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      this.listeners.push(setupScroll());
    }

    var handleRoutingEvent = function () {
      var current = this$1.current; // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.

      var location = getLocation(this$1.base);

      if (this$1.current === START && location === this$1._startLocation) {
        return;
      }

      this$1.transitionTo(location, function (route) {
        if (supportsScroll) {
          handleScroll(router, route, current, true);
        }
      });
    };

    window.addEventListener('popstate', handleRoutingEvent);
    this.listeners.push(function () {
      window.removeEventListener('popstate', handleRoutingEvent);
    });
  };

  HTML5History.prototype.go = function go(n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push(location, onComplete, onAbort) {
    var this$1 = this;
    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace(location, onComplete, onAbort) {
    var this$1 = this;
    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL(push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation() {
    return getLocation(this.base);
  };

  return HTML5History;
}(History);

function getLocation(base) {
  var path = decodeURI(window.location.pathname);

  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length);
  }

  return (path || '/') + window.location.search + window.location.hash;
}
/*  */


var HashHistory = /*@__PURE__*/function (History) {
  function HashHistory(router, base, fallback) {
    History.call(this, router, base); // check history fallback deeplinking

    if (fallback && checkFallback(this.base)) {
      return;
    }

    ensureSlash();
  }

  if (History) HashHistory.__proto__ = History;
  HashHistory.prototype = Object.create(History && History.prototype);
  HashHistory.prototype.constructor = HashHistory; // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early

  HashHistory.prototype.setupListeners = function setupListeners() {
    var this$1 = this;

    if (this.listeners.length > 0) {
      return;
    }

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      this.listeners.push(setupScroll());
    }

    var handleRoutingEvent = function () {
      var current = this$1.current;

      if (!ensureSlash()) {
        return;
      }

      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }

        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    };

    var eventType = supportsPushState ? 'popstate' : 'hashchange';
    window.addEventListener(eventType, handleRoutingEvent);
    this.listeners.push(function () {
      window.removeEventListener(eventType, handleRoutingEvent);
    });
  };

  HashHistory.prototype.push = function push(location, onComplete, onAbort) {
    var this$1 = this;
    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace(location, onComplete, onAbort) {
    var this$1 = this;
    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go(n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL(push) {
    var current = this.current.fullPath;

    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation() {
    return getHash();
  };

  return HashHistory;
}(History);

function checkFallback(base) {
  var location = getLocation(base);

  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location));
    return true;
  }
}

function ensureSlash() {
  var path = getHash();

  if (path.charAt(0) === '/') {
    return true;
  }

  replaceHash('/' + path);
  return false;
}

function getHash() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#'); // empty path

  if (index < 0) {
    return '';
  }

  href = href.slice(index + 1); // decode the hash but not the search or hash
  // as search(query) is already decoded
  // https://github.com/vuejs/vue-router/issues/2708

  var searchIndex = href.indexOf('?');

  if (searchIndex < 0) {
    var hashIndex = href.indexOf('#');

    if (hashIndex > -1) {
      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
    } else {
      href = decodeURI(href);
    }
  } else {
    href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
  }

  return href;
}

function getUrl(path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return base + "#" + path;
}

function pushHash(path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash(path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}
/*  */


var AbstractHistory = /*@__PURE__*/function (History) {
  function AbstractHistory(router, base) {
    History.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if (History) AbstractHistory.__proto__ = History;
  AbstractHistory.prototype = Object.create(History && History.prototype);
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push(location, onComplete, onAbort) {
    var this$1 = this;
    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace(location, onComplete, onAbort) {
    var this$1 = this;
    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go(n) {
    var this$1 = this;
    var targetIndex = this.index + n;

    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return;
    }

    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    }, function (err) {
      if (isNavigationFailure(err, NavigationFailureType.duplicated)) {
        this$1.index = targetIndex;
      }
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation() {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/';
  };

  AbstractHistory.prototype.ensureURL = function ensureURL() {// noop
  };

  return AbstractHistory;
}(History);
/*  */


var VueRouter = function VueRouter(options) {
  if (options === void 0) options = {};
  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);
  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;

  if (this.fallback) {
    mode = 'hash';
  }

  if (!inBrowser) {
    mode = 'abstract';
  }

  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break;

    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break;

    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break;

    default:
      if ("development" !== 'production') {
        assert(false, "invalid mode: " + mode);
      }

  }
};

var prototypeAccessors = {
  currentRoute: {
    configurable: true
  }
};

VueRouter.prototype.match = function match(raw, current, redirectedFrom) {
  return this.matcher.match(raw, current, redirectedFrom);
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current;
};

VueRouter.prototype.init = function init(app
/* Vue component instance */
) {
  var this$1 = this;
  "development" !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueRouter)` " + "before creating root instance.");
  this.apps.push(app); // set up app destroyed handler
  // https://github.com/vuejs/vue-router/issues/2639

  app.$once('hook:destroyed', function () {
    // clean out app from this.apps array once destroyed
    var index = this$1.apps.indexOf(app);

    if (index > -1) {
      this$1.apps.splice(index, 1);
    } // ensure we still have a main app or null if no apps
    // we do not release the router so it can be reused


    if (this$1.app === app) {
      this$1.app = this$1.apps[0] || null;
    }

    if (!this$1.app) {
      // clean up event listeners
      // https://github.com/vuejs/vue-router/issues/2341
      this$1.history.teardownListeners();
    }
  }); // main app previously initialized
  // return as we don't need to set up new history listener

  if (this.app) {
    return;
  }

  this.app = app;
  var history = this.history;

  if (history instanceof HTML5History || history instanceof HashHistory) {
    var handleInitialScroll = function (routeOrError) {
      var from = history.current;
      var expectScroll = this$1.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll && 'fullPath' in routeOrError) {
        handleScroll(this$1, routeOrError, from, false);
      }
    };

    var setupListeners = function (routeOrError) {
      history.setupListeners();
      handleInitialScroll(routeOrError);
    };

    history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach(fn) {
  return registerHook(this.beforeHooks, fn);
};

VueRouter.prototype.beforeResolve = function beforeResolve(fn) {
  return registerHook(this.resolveHooks, fn);
};

VueRouter.prototype.afterEach = function afterEach(fn) {
  return registerHook(this.afterHooks, fn);
};

VueRouter.prototype.onReady = function onReady(cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError(errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push(location, onComplete, onAbort) {
  var this$1 = this; // $flow-disable-line

  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) {
      this$1.history.push(location, resolve, reject);
    });
  } else {
    this.history.push(location, onComplete, onAbort);
  }
};

VueRouter.prototype.replace = function replace(location, onComplete, onAbort) {
  var this$1 = this; // $flow-disable-line

  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) {
      this$1.history.replace(location, resolve, reject);
    });
  } else {
    this.history.replace(location, onComplete, onAbort);
  }
};

VueRouter.prototype.go = function go(n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back() {
  this.go(-1);
};

VueRouter.prototype.forward = function forward() {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents(to) {
  var route = to ? to.matched ? to : this.resolve(to).route : this.currentRoute;

  if (!route) {
    return [];
  }

  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key];
    });
  }));
};

VueRouter.prototype.resolve = function resolve(to, current, append) {
  current = current || this.history.current;
  var location = normalizeLocation(to, current, append, this);
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  };
};

VueRouter.prototype.addRoutes = function addRoutes(routes) {
  this.matcher.addRoutes(routes);

  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties(VueRouter.prototype, prototypeAccessors);

function registerHook(list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);

    if (i > -1) {
      list.splice(i, 1);
    }
  };
}

function createHref(base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path;
}

VueRouter.install = install;
VueRouter.version = '3.4.0';
VueRouter.isNavigationFailure = isNavigationFailure;
VueRouter.NavigationFailureType = NavigationFailureType;

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

var _default = VueRouter;
exports.default = _default;
},{}],"src/plugins/router-plugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Router", {
  enumerable: true,
  get: function () {
    return _vueRouter.default;
  }
});

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Routes
_vue.default.use(_vueRouter.default);
},{"vue":"node_modules/vue/dist/vue.runtime.esm.js","vue-router":"node_modules/vue-router/dist/vue-router.esm.js"}],"src/dummyData.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  labels: {
    "happy": {
      videoClipCount: 235,
      videoCount: 155
    },
    "sad": {
      videoClipCount: (Math.random() * 100).toFixed(0),
      videoCount: (Math.random() * 100).toFixed(0)
    },
    "angry": {
      videoClipCount: (Math.random() * 100).toFixed(0),
      videoCount: (Math.random() * 100).toFixed(0)
    },
    "neutral": {
      videoClipCount: (Math.random() * 100).toFixed(0),
      videoCount: (Math.random() * 100).toFixed(0)
    },
    "disgust": {
      videoClipCount: (Math.random() * 100).toFixed(0),
      videoCount: (Math.random() * 100).toFixed(0)
    }
  }
};
exports.default = _default;
},{}],"node_modules/vue-hot-reload-api/dist/index.js":[function(require,module,exports) {
var Vue // late bind
var version
var map = Object.create(null)
if (typeof window !== 'undefined') {
  window.__VUE_HOT_MAP__ = map
}
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }

  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cached together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }

      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)

      // 2.6: temporarily mark rendered scoped slots as unstable so that
      // child components can be forced to update
      var restore = patchScopedSlots(instance)
      instance.$forceUpdate()
      instance.$nextTick(restore)
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      // prevent record.options._Ctor from being overwritten accidentally
      newCtor.options._Ctor = record.options._Ctor
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

// 2.6 optimizes template-compiled scoped slots and skips updates if child
// only uses scoped slots. We need to patch the scoped slots resolving helper
// to temporarily mark all scoped slots as unstable in order to force child
// updates.
function patchScopedSlots (instance) {
  if (!instance._u) { return }
  // https://github.com/vuejs/vue/blob/dev/src/core/instance/render-helpers/resolve-scoped-slots.js
  var original = instance._u
  instance._u = function (slots) {
    try {
      // 2.6.4 ~ 2.6.6
      return original(slots, true)
    } catch (e) {
      // 2.5 / >= 2.6.7
      return original(slots, null, true)
    }
  }
  return function () {
    instance._u = original
  }
}

},{}],"node_modules/vue-waterfall/lib/waterfall.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
const MOVE_CLASS_PROP = '_wfMoveClass';
var _default = {
  props: {
    autoResize: {
      default: true
    },
    interval: {
      default: 200,
      validator: val => val >= 0
    },
    align: {
      default: 'left',
      validator: val => ~['left', 'right', 'center'].indexOf(val)
    },
    line: {
      default: 'v',
      validator: val => ~['v', 'h'].indexOf(val)
    },
    lineGap: {
      required: true,
      validator: val => val >= 0
    },
    minLineGap: {
      validator: val => val >= 0
    },
    maxLineGap: {
      validator: val => val >= 0
    },
    singleMaxWidth: {
      validator: val => val >= 0
    },
    fixedHeight: {
      default: false
    },
    grow: {
      validator: val => val instanceof Array
    },
    watch: {
      default: () => ({})
    }
  },
  data: () => ({
    style: {
      height: '',
      overflow: ''
    },
    token: null
  }),
  methods: {
    reflowHandler,
    autoResizeHandler,
    reflow
  },

  created() {
    this.virtualRects = [];
    this.$on('reflow', () => {
      this.reflowHandler();
    });
    this.$watch(() => (this.align, this.line, this.lineGap, this.minLineGap, this.maxLineGap, this.singleMaxWidth, this.fixedHeight, this.watch), this.reflowHandler);
    this.$watch('grow', this.reflowHandler);
  },

  mounted() {
    this.$watch('autoResize', this.autoResizeHandler);
    on(this.$el, getTransitionEndEvent(), tidyUpAnimations, true);
    this.autoResizeHandler(this.autoResize);
  },

  beforeDestroy() {
    this.autoResizeHandler(false);
    off(this.$el, getTransitionEndEvent(), tidyUpAnimations, true);
  }

};
exports.default = _default;

function autoResizeHandler(autoResize) {
  if (autoResize === false || !this.autoResize) {
    off(window, 'resize', this.reflowHandler, false);
  } else {
    on(window, 'resize', this.reflowHandler, false);
  }
}

function tidyUpAnimations(event) {
  let node = event.target;
  let moveClass = node[MOVE_CLASS_PROP];

  if (moveClass) {
    removeClass(node, moveClass);
  }
}

function reflowHandler() {
  clearTimeout(this.token);
  this.token = setTimeout(this.reflow, this.interval);
}

function reflow() {
  if (!this.$el) {
    return;
  }

  let width = this.$el.clientWidth;
  let metas = this.$children.map(slot => slot.getMeta());
  metas.sort((a, b) => a.order - b.order);
  this.virtualRects = metas.map(() => ({}));
  calculate(this, metas, this.virtualRects);
  setTimeout(() => {
    if (isScrollBarVisibilityChange(this.$el, width)) {
      calculate(this, metas, this.virtualRects);
    }

    this.style.overflow = 'hidden';
    render(this.virtualRects, metas);
    this.$emit('reflowed', this);
  }, 0);
}

function isScrollBarVisibilityChange(el, lastClientWidth) {
  return lastClientWidth !== el.clientWidth;
}

function calculate(vm, metas, styles) {
  let options = getOptions(vm);
  let processor = vm.line === 'h' ? horizontalLineProcessor : verticalLineProcessor;
  processor.calculate(vm, options, metas, styles);
}

function getOptions(vm) {
  const maxLineGap = vm.maxLineGap ? +vm.maxLineGap : vm.lineGap;
  return {
    align: ~['left', 'right', 'center'].indexOf(vm.align) ? vm.align : 'left',
    line: ~['v', 'h'].indexOf(vm.line) ? vm.line : 'v',
    lineGap: +vm.lineGap,
    minLineGap: vm.minLineGap ? +vm.minLineGap : vm.lineGap,
    maxLineGap: maxLineGap,
    singleMaxWidth: Math.max(vm.singleMaxWidth || 0, maxLineGap),
    fixedHeight: !!vm.fixedHeight,
    grow: vm.grow && vm.grow.map(val => +val)
  };
}

var verticalLineProcessor = (() => {
  function calculate(vm, options, metas, rects) {
    let width = vm.$el.clientWidth;
    let grow = options.grow;
    let strategy = grow ? getRowStrategyWithGrow(width, grow) : getRowStrategy(width, options);
    let tops = getArrayFillWith(0, strategy.count);
    metas.forEach((meta, index) => {
      let offset = tops.reduce((last, top, i) => top < tops[last] ? i : last, 0);
      let width = strategy.width[offset % strategy.count];
      let rect = rects[index];
      rect.top = tops[offset];
      rect.left = strategy.left + (offset ? sum(strategy.width.slice(0, offset)) : 0);
      rect.width = width;
      rect.height = meta.height * (options.fixedHeight ? 1 : width / meta.width);
      tops[offset] = tops[offset] + rect.height;
    });
    vm.style.height = Math.max.apply(Math, tops) + 'px';
  }

  function getRowStrategy(width, options) {
    let count = width / options.lineGap;
    let slotWidth;

    if (options.singleMaxWidth >= width) {
      count = 1;
      slotWidth = Math.max(width, options.minLineGap);
    } else {
      let maxContentWidth = options.maxLineGap * ~~count;
      let minGreedyContentWidth = options.minLineGap * ~~(count + 1);
      let canFit = maxContentWidth >= width;
      let canFitGreedy = minGreedyContentWidth <= width;

      if (canFit && canFitGreedy) {
        count = Math.round(count);
        slotWidth = width / count;
      } else if (canFit) {
        count = ~~count;
        slotWidth = width / count;
      } else if (canFitGreedy) {
        count = ~~(count + 1);
        slotWidth = width / count;
      } else {
        count = ~~count;
        slotWidth = options.maxLineGap;
      }

      if (count === 1) {
        slotWidth = Math.min(width, options.singleMaxWidth);
        slotWidth = Math.max(slotWidth, options.minLineGap);
      }
    }

    return {
      width: getArrayFillWith(slotWidth, count),
      count: count,
      left: getLeft(width, slotWidth * count, options.align)
    };
  }

  function getRowStrategyWithGrow(width, grow) {
    let total = sum(grow);
    return {
      width: grow.map(val => width * val / total),
      count: grow.length,
      left: 0
    };
  }

  return {
    calculate
  };
})();

var horizontalLineProcessor = (() => {
  function calculate(vm, options, metas, rects) {
    let width = vm.$el.clientWidth;
    let total = metas.length;
    let top = 0;
    let offset = 0;

    while (offset < total) {
      let strategy = getRowStrategy(width, options, metas, offset);

      for (let i = 0, left = 0, meta, rect; i < strategy.count; i++) {
        meta = metas[offset + i];
        rect = rects[offset + i];
        rect.top = top;
        rect.left = strategy.left + left;
        rect.width = meta.width * strategy.height / meta.height;
        rect.height = strategy.height;
        left += rect.width;
      }

      offset += strategy.count;
      top += strategy.height;
    }

    vm.style.height = top + 'px';
  }

  function getRowStrategy(width, options, metas, offset) {
    let greedyCount = getGreedyCount(width, options.lineGap, metas, offset);
    let lazyCount = Math.max(greedyCount - 1, 1);
    let greedySize = getContentSize(width, options, metas, offset, greedyCount);
    let lazySize = getContentSize(width, options, metas, offset, lazyCount);
    let finalSize = chooseFinalSize(lazySize, greedySize, width);
    let height = finalSize.height;
    let fitContentWidth = finalSize.width;

    if (finalSize.count === 1) {
      fitContentWidth = Math.min(options.singleMaxWidth, width);
      height = metas[offset].height * fitContentWidth / metas[offset].width;
    }

    return {
      left: getLeft(width, fitContentWidth, options.align),
      count: finalSize.count,
      height: height
    };
  }

  function getGreedyCount(rowWidth, rowHeight, metas, offset) {
    let count = 0;

    for (let i = offset, width = 0; i < metas.length && width <= rowWidth; i++) {
      width += metas[i].width * rowHeight / metas[i].height;
      count++;
    }

    return count;
  }

  function getContentSize(rowWidth, options, metas, offset, count) {
    let originWidth = 0;

    for (let i = count - 1; i >= 0; i--) {
      let meta = metas[offset + i];
      originWidth += meta.width * options.lineGap / meta.height;
    }

    let fitHeight = options.lineGap * rowWidth / originWidth;
    let canFit = fitHeight <= options.maxLineGap && fitHeight >= options.minLineGap;

    if (canFit) {
      return {
        cost: Math.abs(options.lineGap - fitHeight),
        count: count,
        width: rowWidth,
        height: fitHeight
      };
    } else {
      let height = originWidth > rowWidth ? options.minLineGap : options.maxLineGap;
      return {
        cost: Infinity,
        count: count,
        width: originWidth * height / options.lineGap,
        height: height
      };
    }
  }

  function chooseFinalSize(lazySize, greedySize, rowWidth) {
    if (lazySize.cost === Infinity && greedySize.cost === Infinity) {
      return greedySize.width < rowWidth ? greedySize : lazySize;
    } else {
      return greedySize.cost >= lazySize.cost ? lazySize : greedySize;
    }
  }

  return {
    calculate
  };
})();

function getLeft(width, contentWidth, align) {
  switch (align) {
    case 'right':
      return width - contentWidth;

    case 'center':
      return (width - contentWidth) / 2;

    default:
      return 0;
  }
}

function sum(arr) {
  return arr.reduce((sum, val) => sum + val);
}

function render(rects, metas) {
  let metasNeedToMoveByTransform = metas.filter(meta => meta.moveClass);
  let firstRects = getRects(metasNeedToMoveByTransform);
  applyRects(rects, metas);
  let lastRects = getRects(metasNeedToMoveByTransform);
  metasNeedToMoveByTransform.forEach((meta, i) => {
    meta.node[MOVE_CLASS_PROP] = meta.moveClass;
    setTransform(meta.node, firstRects[i], lastRects[i]);
  });
  document.body.clientWidth; // forced reflow

  metasNeedToMoveByTransform.forEach(meta => {
    addClass(meta.node, meta.moveClass);
    clearTransform(meta.node);
  });
}

function getRects(metas) {
  return metas.map(meta => meta.vm.rect);
}

function applyRects(rects, metas) {
  rects.forEach((rect, i) => {
    let style = metas[i].node.style;
    metas[i].vm.rect = rect;

    for (let prop in rect) {
      style[prop] = rect[prop] + 'px';
    }
  });
}

function setTransform(node, firstRect, lastRect) {
  let dx = firstRect.left - lastRect.left;
  let dy = firstRect.top - lastRect.top;
  let sw = firstRect.width / lastRect.width;
  let sh = firstRect.height / lastRect.height;
  node.style.transform = node.style.WebkitTransform = `translate(${dx}px,${dy}px) scale(${sw},${sh})`;
  node.style.transitionDuration = '0s';
}

function clearTransform(node) {
  node.style.transform = node.style.WebkitTransform = '';
  node.style.transitionDuration = '';
}

function getTransitionEndEvent() {
  let isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
  let transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
  return transitionEndEvent;
}
/**
 * util
 */


function getArrayFillWith(item, count) {
  let getter = typeof item === 'function' ? () => item() : () => item;
  let arr = [];

  for (let i = 0; i < count; i++) {
    arr[i] = getter();
  }

  return arr;
}

function addClass(elem, name) {
  if (!hasClass(elem, name)) {
    let cur = attr(elem, 'class').trim();
    let res = (cur + ' ' + name).trim();
    attr(elem, 'class', res);
  }
}

function removeClass(elem, name) {
  let reg = new RegExp('\\s*\\b' + name + '\\b\\s*', 'g');
  let res = attr(elem, 'class').replace(reg, ' ').trim();
  attr(elem, 'class', res);
}

function hasClass(elem, name) {
  return new RegExp('\\b' + name + '\\b').test(attr(elem, 'class'));
}

function attr(elem, name, value) {
  if (typeof value !== 'undefined') {
    elem.setAttribute(name, value);
  } else {
    return elem.getAttribute(name) || '';
  }
}

function on(elem, type, listener, useCapture = false) {
  elem.addEventListener(type, listener, useCapture);
}

function off(elem, type, listener, useCapture = false) {
  elem.removeEventListener(type, listener, useCapture);
}
        var $df1071 = exports.default || module.exports;
      
      if (typeof $df1071 === 'function') {
        $df1071 = $df1071.options;
      }
    
        /* template */
        Object.assign($df1071, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "vue-waterfall", style: _vm.style },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('$df1071', $df1071);
          } else {
            api.reload('$df1071', $df1071);
          }
        }

        
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
      }
    })();
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js","vue-hot-reload-api":"node_modules/vue-hot-reload-api/dist/index.js","vue":"node_modules/vue/dist/vue.runtime.esm.js"}],"node_modules/vue-waterfall/lib/waterfall-slot.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: () => ({
    isShow: false
  }),
  props: {
    width: {
      required: true,
      validator: val => val >= 0
    },
    height: {
      required: true,
      validator: val => val >= 0
    },
    order: {
      default: 0
    },
    moveClass: {
      default: ''
    }
  },
  methods: {
    notify() {
      this.$parent.$emit('reflow', this);
    },

    getMeta() {
      return {
        vm: this,
        node: this.$el,
        order: this.order,
        width: this.width,
        height: this.height,
        moveClass: this.moveClass
      };
    }

  },

  created() {
    this.rect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.$watch(() => (this.width, this.height), this.notify);
  },

  mounted() {
    this.$parent.$once('reflowed', () => {
      this.isShow = true;
    });
    this.notify();
  },

  destroyed() {
    this.notify();
  }

};
exports.default = _default;
        var $745c81 = exports.default || module.exports;
      
      if (typeof $745c81 === 'function') {
        $745c81 = $745c81.options;
      }
    
        /* template */
        Object.assign($745c81, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.isShow,
          expression: "isShow"
        }
      ],
      staticClass: "vue-waterfall-slot"
    },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('$745c81', $745c81);
          } else {
            api.reload('$745c81', $745c81);
          }
        }

        
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
      }
    })();
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js","vue-hot-reload-api":"node_modules/vue-hot-reload-api/dist/index.js","vue":"node_modules/vue/dist/vue.runtime.esm.js"}],"src/pages/Home.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dummyData = _interopRequireDefault(require("../dummyData"));

var _waterfall = _interopRequireDefault(require("vue-waterfall/lib/waterfall"));

var _waterfallSlot = _interopRequireDefault(require("vue-waterfall/lib/waterfall-slot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var colors = ["#4fc3f7", "#e57373", "#ba68c8", "#9ccc65", "#9575cd", "#ff8a65", "#a1887f"];
var colorCopy = [].concat(colors);
Object.keys(_dummyData.default.labels).forEach(function (each) {
  return _dummyData.default.labels[each].color = colorCopy.shift() || (colorCopy = [].concat(colors), colorCopy.shift());
});
var _default = {
  name: "HomePage",
  components: {
    Waterfall: _waterfall.default,
    WaterfallSlot: _waterfallSlot.default
  },
  data: function data() {
    return {
      items: _dummyData.default.labels,
      itemNames: Object.keys(_dummyData.default.labels),
      searchTerm: ""
    };
  },
  watch: {
    searchTerm: function searchTerm(value) {
      if (typeof value == 'string') {
        // TODO: improve this to be a fuzzy search
        this.items = {};

        for (var key in _dummyData.default.labels) {
          var each = _dummyData.default.labels[key];

          if (key.startsWith(value)) {
            this.items[key] = each;
          }
        }
      } else {
        this.items = _dummyData.default.labels;
      }
    }
  }
};
exports.default = _default;
        var $a2ff09 = exports.default || module.exports;
      
      if (typeof $a2ff09 === 'function') {
        $a2ff09 = $a2ff09.options;
      }
    
        /* template */
        Object.assign($a2ff09, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "column",
        { attrs: { width: "100vw" } },
        [
          _c(
            "column",
            { attrs: { padding: "1.2rem", "align-h": "left" } },
            [
              _c("ui-autocomplete", {
                staticClass: "rounded-search",
                attrs: {
                  name: "name1",
                  placeholder: "Search for a label, or a video",
                  suggestions: _vm.itemNames
                },
                model: {
                  value: _vm.searchTerm,
                  callback: function($$v) {
                    _vm.searchTerm = $$v
                  },
                  expression: "searchTerm"
                }
              })
            ],
            1
          )
        ],
        1
      ),
      _c(
        "div",
        { staticStyle: { padding: "2rem" } },
        [
          _c(
            "row",
            { attrs: { "align-h": "left", wrap: "wrap" } },
            _vm._l(_vm.items, function(item, index) {
              return _c(
                "column",
                {
                  staticClass: "search-card",
                  attrs: {
                    shadow: "1",
                    "align-h": "left",
                    "background-color": item.color
                  }
                },
                [
                  _c(
                    "h5",
                    { staticStyle: { "text-decoration": "underline" } },
                    [_vm._v(_vm._s(index))]
                  ),
                  _c(
                    "column",
                    { attrs: { width: "max-content", padding: "0.5rem" } },
                    [
                      _vm._v(
                        "total number of clips: " + _vm._s(item.videoClipCount)
                      ),
                      _c("br"),
                      _vm._v(
                        "total number of videos: " + _vm._s(item.videoCount)
                      )
                    ]
                  )
                ],
                1
              )
            }),
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('$a2ff09', $a2ff09);
          } else {
            api.reload('$a2ff09', $a2ff09);
          }
        }

        
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
      }
    })();
},{"../dummyData":"src/dummyData.js","vue-waterfall/lib/waterfall":"node_modules/vue-waterfall/lib/waterfall.vue","vue-waterfall/lib/waterfall-slot":"node_modules/vue-waterfall/lib/waterfall-slot.vue","_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js","vue-hot-reload-api":"node_modules/vue-hot-reload-api/dist/index.js","vue":"node_modules/vue/dist/vue.runtime.esm.js"}],"src/pages/*.vue":[function(require,module,exports) {
module.exports = {
  "Home": require("./Home.vue")
};
},{"./Home.vue":"src/pages/Home.vue"}],"src/App.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

require("./plugins/css-baseline-plugin");

require("./plugins/good-vue-plugin");

require("./plugins/keen-ui-plugin");

var _routerPlugin = require("./plugins/router-plugin");

var _ = _interopRequireDefault(require("./pages/*.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// make sure home page exists
if (!("Home" in _.default)) {
  throw Error("Hey, this template expects there to be a 'Home.vue' page.\nIf you don't want one that's fine. Just change the router in the App.vue file so it doesn't expect/need one");
}

var App; // create App instance and attach it (executed after this file)

setTimeout(function () {
  return new (_vue.default.extend(App))().$mount('#app');
}, 0); // actually create the App, user router to pick main pages

var _default = App = {
  name: 'App',
  components: {},
  // 
  // routes
  // 
  router: new _routerPlugin.Router({
    routes: [].concat(_toConsumableArray(Object.keys(_.default).map(function (eachPageName) {
      return {
        path: "/" + eachPageName.toLowerCase(),
        name: eachPageName,
        component: _.default[eachPageName].default
      };
    })), [// all other routes redirect to the home page
    // You can change this to a 404 page if you want
    {
      path: "*",
      redirect: "/home"
    }])
  })
};

exports.default = _default;
        var $5ffbab = exports.default || module.exports;
      
      if (typeof $5ffbab === 'function') {
        $5ffbab = $5ffbab.options;
      }
    
        /* template */
        Object.assign($5ffbab, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "app" } }, [_c("router-view")], 1)
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('$5ffbab', $5ffbab);
          } else {
            api.reload('$5ffbab', $5ffbab);
          }
        }

        
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
      }
    })();
},{"vue":"node_modules/vue/dist/vue.runtime.esm.js","./plugins/css-baseline-plugin":"src/plugins/css-baseline-plugin.js","./plugins/good-vue-plugin":"src/plugins/good-vue-plugin.js","./plugins/keen-ui-plugin":"src/plugins/keen-ui-plugin.js","./plugins/router-plugin":"src/plugins/router-plugin.js","./pages/*.vue":"src/pages/*.vue","_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js","vue-hot-reload-api":"node_modules/vue-hot-reload-api/dist/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49990" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/App.vue"], null)
//# sourceMappingURL=/App.a11a5c99.js.map