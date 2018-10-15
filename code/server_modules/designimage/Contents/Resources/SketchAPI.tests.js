var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {/* globals log */

if (true) {
  var sketchUtils = __webpack_require__(38)
  var sketchDebugger = __webpack_require__(40)
  var actions = __webpack_require__(42)

  function getStack() {
    return sketchUtils.prepareStackTrace(new Error().stack)
  }
}

console._skpmPrefix = 'console> '

function logEverywhere(type, args) {
  var values = Array.prototype.slice.call(args)

  // log to the System logs
  values.forEach(function(v) {
    try {
      log(console._skpmPrefix + indentString() + v)
    } catch (e) {
      log(v)
    }
  })

  if (true) {
    if (!sketchDebugger.isDebuggerPresent()) {
      return
    }

    var payload = {
      ts: Date.now(),
      type: type,
      plugin: String(context.scriptPath),
      values: values.map(sketchUtils.prepareValue),
      stack: getStack(),
    }

    sketchDebugger.sendToDebugger(actions.ADD_LOG, payload)
  }
}

var indentLevel = 0
function indentString() {
  var indent = ''
  for (var i = 0; i < indentLevel; i++) {
    indent += '  '
  }
  if (indentLevel > 0) {
    indent += '| '
  }
  return indent
}

var oldGroup = console.group

console.group = function() {
  // log to the JS context
  oldGroup && oldGroup.apply(this, arguments)
  indentLevel += 1
  if (true) {
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
      collapsed: false,
    })
  }
}

var oldGroupCollapsed = console.groupCollapsed

console.groupCollapsed = function() {
  // log to the JS context
  oldGroupCollapsed && oldGroupCollapsed.apply(this, arguments)
  indentLevel += 1
  if (true) {
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
      collapsed: true
    })
  }
}

var oldGroupEnd = console.groupEnd

console.groupEnd = function() {
  // log to the JS context
  oldGroupEnd && oldGroupEnd.apply(this, arguments)
  indentLevel -= 1
  if (indentLevel < 0) {
    indentLevel = 0
  }
  if (true) {
    sketchDebugger.sendToDebugger(actions.GROUP_END, {
      plugin: context.scriptPath,
    })
  }
}

var counts = {}
var oldCount = console.count

console.count = function(label) {
  label = typeof label !== 'undefined' ? label : 'Global'
  counts[label] = (counts[label] || 0) + 1

  // log to the JS context
  oldCount && oldCount.apply(this, arguments)
  return logEverywhere('log', [label + ': ' + counts[label]])
}

var timers = {}
var oldTime = console.time

console.time = function(label) {
  // log to the JS context
  oldTime && oldTime.apply(this, arguments)

  label = typeof label !== 'undefined' ? label : 'default'
  if (timers[label]) {
    return logEverywhere('warn', ['Timer "' + label + '" already exists'])
  }

  timers[label] = Date.now()
  return
}

var oldTimeEnd = console.timeEnd

console.timeEnd = function(label) {
  // log to the JS context
  oldTimeEnd && oldTimeEnd.apply(this, arguments)

  label = typeof label !== 'undefined' ? label : 'default'
  if (!timers[label]) {
    return logEverywhere('warn', ['Timer "' + label + '" does not exist'])
  }

  var duration = Date.now() - timers[label]
  delete timers[label]
  return logEverywhere('log', [label + ': ' + (duration / 1000) + 'ms'])
}

var oldLog = console.log

console.log = function() {
  // log to the JS context
  oldLog && oldLog.apply(this, arguments)
  return logEverywhere('log', arguments)
}

var oldWarn = console.warn

console.warn = function() {
  // log to the JS context
  oldWarn && oldWarn.apply(this, arguments)
  return logEverywhere('warn', arguments)
}

var oldError = console.error

console.error = function() {
  // log to the JS context
  oldError && oldError.apply(this, arguments)
  return logEverywhere('error', arguments)
}

var oldAssert = console.assert

console.assert = function(condition, text) {
  // log to the JS context
  oldAssert && oldAssert.apply(this, arguments)
  if (!condition) {
    return logEverywhere('assert', [text])
  }
  return undefined
}

var oldInfo = console.info

console.info = function() {
  // log to the JS context
  oldInfo && oldInfo.apply(this, arguments)
  return logEverywhere('info', arguments)
}

var oldClear = console.clear

console.clear = function() {
  oldClear && oldClear()
  if (true) {
    return sketchDebugger.sendToDebugger(actions.CLEAR_LOGS)
  }
}

console._skpmEnabled = true

module.exports = console

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var _matchers_object = __webpack_require__(28);
var _utils = __webpack_require__(17);
var utils = _interopRequireWildcard(_utils);
var _matchers2 = __webpack_require__(48);
var _matchers3 = _interopRequireDefault(_matchers2);
var _sketch_matchers = __webpack_require__(49);
var _sketch_matchers2 = _interopRequireDefault(_sketch_matchers);
var _assertionCheck = __webpack_require__(50);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
var validateResult = function (result) {
    if (typeof result !== 'object' || typeof result.pass !== 'boolean' || result.message && typeof result.message !== 'string' && typeof result.message !== 'function') {
        throw new Error('Unexpected return from a matcher function.\n' + 'Matcher functions should ' + 'return an object in the following format:\n' + '  {message?: string | function, pass: boolean}\n' + ("'" + utils.stringify(result) + "' was returned"));
    }
};
var getMessage = function (message) {
    return message && message() || 'No message was specified for this matcher.';
};
var makeThrowingMatcher = function (matcher, isNot, actual) {
    return function throwingMatcher() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var throws = true;
        var matcherContext = Object.assign(
        // When throws is disabled, the matcher will not throw errors during test
        // execution but instead add them to the global matcher state. If a
        // matcher throws, test execution is normally stopped immediately. The
        // snapshot matcher uses it because we want to log all snapshot
        // failures in a test.
        {
            dontThrow: function () {
                throws = false;
            }
        }, (0, _matchers_object.getState)(), {
            isNot: isNot,
            utils: utils
        });
        var result;
        try {
            result = matcher.apply(matcherContext, [actual].concat(args));
        } catch (error) {
            throw error;
        }
        validateResult(result);
        (0, _matchers_object.getState)().assertionCalls += 1;
        // XOR
        if (result.pass && isNot || !result.pass && !isNot) {
            var message = getMessage(result.message);
            var error = new Error(message);
            // Passing the result of the matcher with the error so that a custom
            // reporter could access the actual and expected objects of the result
            // for example in order to display a custom visual diff
            error.matcherResult = result;
            // Try to remove this function from the stack trace frame.
            // Guard for some environments (browsers) that do not support this feature.
            if (Error.captureStackTrace) {
                Error.captureStackTrace(error, throwingMatcher);
            }
            if (throws) {
                throw error;
            } else {
                (0, _matchers_object.getState)().suppressedErrors.push(error);
            }
        }
    };
};
var expect = function (actual) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (rest.length !== 0) {
        throw new Error('Expect takes at most one argument.');
    }
    var allMatchers = (0, _matchers_object.getMatchers)();
    var expectation = {
        not: {},
        rejects: { not: {} },
        resolves: { not: {} }
    };
    Object.keys(allMatchers).forEach(function (name) {
        var matcher = allMatchers[name];
        expectation[name] = makeThrowingMatcher(matcher, false, actual);
        expectation.not[name] = makeThrowingMatcher(matcher, true, actual);
    });
    return expectation;
};
expect.extend = function (_matchers) {
    return (0, _matchers_object.setMatchers)(_matchers);
};
// add default jest matchers
expect.extend(_matchers3.default);
expect.extend(_sketch_matchers2.default);
expect.assertions = function (expected) {
    (0, _matchers_object.setState)({
        expectedAssertionsNumber: expected
    });
};
expect.hasAssertions = function (expected) {
    utils.ensureNoExpected(expected, '.hasAssertions');
    (0, _matchers_object.setState)({
        isExpectingAssertions: true
    });
};
expect.getState = _matchers_object.getState;
expect.setState = _matchers_object.setState;
expect.resetAssertionsLocalState = _assertionCheck.resetAssertionsLocalState;
expect.extractExpectedAssertionsErrors = _assertionCheck.extractExpectedAssertionsErrors;
exports.default = expect;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinedPropertiesKey = '_DefinedPropertiesKey';
/**
 * Base class for all objects that
 * wrap Sketch classes.
 */
var WrappedObject = /** @class */function () {
    function WrappedObject(options) {
        Object.defineProperty(this, '_object', {
            enumerable: false,
            value: options.sketchObject
        });
        Object.defineProperty(this, 'type', {
            enumerable: true,
            value: this.constructor.type
        });
        this.update(options);
    }
    WrappedObject.prototype.update = function (options) {
        var _this = this;
        if (options === void 0) {
            options = {};
        }
        var propertyList = this.constructor[exports.DefinedPropertiesKey];
        Object.keys(options).sort(function (a, b) {
            if (propertyList[a] && propertyList[a].depends && propertyList[a].depends === b) {
                return 1;
            } else if (propertyList[b] && propertyList[b].depends && propertyList[b].depends === a) {
                return -1;
            }
            return 0;
        }).forEach(function (k) {
            if (!propertyList[k]) {
                console.warn("no idea what to do with \"" + k + "\" in " + _this.type);
                return;
            }
            if (!propertyList[k].importable) {
                return;
            }
            _this[k] = options[k];
        });
    };
    /**
     * Return a new wrapped object for a given Sketch model object.
     *
     * @param {Object} object - The Sketch model object to wrap.
     */
    WrappedObject.fromNative = function (sketchObject) {
        return new this({
            sketchObject: sketchObject
        });
    };
    WrappedObject.prototype.toJSON = function () {
        var _this = this;
        var propertyList = this.constructor[exports.DefinedPropertiesKey];
        var json = {};
        Object.keys(propertyList).forEach(function (k) {
            if (!propertyList[k].exportable) {
                return;
            }
            var value = _this[k];
            if (value && Array.isArray(value)) {
                json[k] = value.map(function (x) {
                    if (x && typeof x.toJSON === 'function') {
                        return x.toJSON();
                    }
                    return x;
                });
            } else if (value && typeof value.toJSON === 'function') {
                json[k] = value.toJSON();
            } else {
                json[k] = value;
            }
        });
        return json;
    };
    /**
     * Because the API objects are thin wrappers, they are created on demand and are
     * thrown away regularly.
     *
     * No attempt is made to have a one-to-one correspondence between wrapper and model
     * object - many wrapper instances may exist which point to the same model object.
     *
     * This is not the most efficient solution in some respects, but it's pragmatic and
     * works well for simple cases.
        * Because multiple wrappers might exist for a given model object, if you're
     * testing two for equality, you should test the things that they wrap, rather than
     * the wrapper objects themselves
     * @param {WrappedObject} wrappedObject
     * @return {Boolean} whether the objects are equal or not
     */
    WrappedObject.prototype.isEqual = function (wrappedObject) {
        return this.sketchObject == wrappedObject.sketchObject;
    };
    /**
     * Define getter and setter for a property
     * The descriptor needs to at least define `get`
     * There are 2 additional fields in the descriptor that you can set: `importable` and `exportable`
     *
     * a property that is `importable` is a property that can be set when creating the object or updating it
     * a property that is `exportable` is a property that will show when calling `toJSON`
     *
     * @param {string} propertyName - the name of the property
     * @param {Object} descriptor - the descriptor for the property (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
     */
    WrappedObject.define = function (propertyName, descriptor) {
        this._addDescriptor(propertyName, descriptor);
        Object.defineProperty(this.prototype, propertyName, descriptor);
    };
    /**
     * we want to keep track of the defined properties and their order
     *
     * @param {string} propertyName
     * @param {Object} descriptor
     */
    WrappedObject._addDescriptor = function (propertyName, descriptor) {
        /* eslint-disable no-param-reassign */
        descriptor.propertyName = propertyName;
        if (descriptor.enumerable == null) {
            descriptor.enumerable = true;
        }
        if (descriptor.exportable == null) {
            descriptor.exportable = true;
        }
        if (descriptor.importable == null) {
            descriptor.importable = true;
        }
        descriptor.importable = descriptor.importable && typeof descriptor.set !== 'undefined';
        descriptor.exportable = descriptor.exportable && typeof descriptor.get !== 'undefined';
        // properties starting with `_` are considered private
        if (propertyName[0] === '_') {
            return;
        }
        this[exports.DefinedPropertiesKey][propertyName] = descriptor;
        /* eslint-enable */
    };
    return WrappedObject;
}();
exports.WrappedObject = WrappedObject;
WrappedObject[exports.DefinedPropertiesKey] = {};
WrappedObject.define('type', {
    exportable: true,
    importable: false,
    get: function () {
        return this.type;
    }
});
WrappedObject.define('id', {
    exportable: true,
    importable: false,
    /**
     * Returns the object ID of the wrapped Sketch model object.
     *
     * @return {string} The id.
     */
    get: function () {
        return String(this._object.objectID());
    }
});
WrappedObject.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    /**
     * Returns the wrapped Sketch object.
     */
    get: function () {
        return this._object;
    }
});
WrappedObject.define('_isWrappedObject', {
    enumerable: false,
    exportable: false,
    get: function () {
        return true;
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = {
    Group: 'Group',
    Page: 'Page',
    Artboard: 'Artboard',
    Shape: 'Shape',
    Style: 'Style',
    Blur: 'Blur',
    Border: 'Border',
    BorderOptions: 'BorderOptions',
    Fill: 'Fill',
    Gradient: 'Gradient',
    GradientStop: 'GradientStop',
    Shadow: 'Shadow',
    Image: 'Image',
    Text: 'Text',
    Document: 'Document',
    Library: 'Library',
    SymbolMaster: 'SymbolMaster',
    SymbolInstance: 'SymbolInstance',
    Override: 'Override',
    ImageData: 'ImageData',
    Flow: 'Flow',
    HotSpot: 'HotSpot',
    ImportableObject: 'ImportableObject'
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function getDocumentData(document) {
    var documentData = document;
    if (document && document.sketchObject && document.sketchObject.documentData) {
        documentData = document.sketchObject.documentData();
    } else if (document && document.documentData) {
        documentData = document.documentData();
    }
    return documentData;
}
exports.getDocumentData = getDocumentData;
function toArray(object) {
    if (Array.isArray(object)) {
        return object;
    }
    var arr = [];
    for (var j = 0; j < (object || []).length; j += 1) {
        arr.push(object.objectAtIndex(j));
    }
    return arr;
}
exports.toArray = toArray;
function isNativeObject(object) {
    return object && object.class && typeof object.class === 'function';
}
exports.isNativeObject = isNativeObject;
function isWrappedObject(object) {
    return object && object._isWrappedObject;
}
exports.isWrappedObject = isWrappedObject;
function getURLFromPath(path) {
    return typeof path === 'string' ? NSURL.fileURLWithPath(NSString.stringWithString(path).stringByExpandingTildeInPath()) : path;
}
exports.getURLFromPath = getURLFromPath;
function initProxyProperties(object) {
    Object.defineProperty(object, '_parent', {
        enumerable: false,
        writable: true
    });
    Object.defineProperty(object, '_parentKey', {
        enumerable: false,
        writable: true
    });
    Object.defineProperty(object, '_inArray', {
        enumerable: false,
        writable: true
    });
}
exports.initProxyProperties = initProxyProperties;
function proxyProperty(object, property, value, parser) {
    Object.defineProperty(object, "_" + property, {
        enumerable: false,
        writable: true,
        value: value
    });
    /* eslint-disable no-param-reassign */
    if (parser) {
        Object.defineProperty(object, property, {
            enumerable: true,
            get: function () {
                return object["_" + property];
            },
            set: function (x) {
                object["_" + property] = parser(x);
                if (object._parent && object._parentKey) {
                    if (object._inArray) {
                        object._parent[object._parentKey][object._parent[object._parentKey].indexOf(object)] = object;
                    } else {
                        object._parent[object._parentKey] = object;
                    }
                }
            }
        });
    } else {
        Object.defineProperty(object, property, {
            enumerable: true,
            get: function () {
                return object["_" + property];
            },
            set: function (x) {
                object["_" + property] = x;
                if (object._parent && object._parentKey) {
                    if (object._inArray) {
                        object._parent[object._parentKey][object._parent[object._parentKey].indexOf(object)] = object;
                    } else {
                        object._parent[object._parentKey] = object;
                    }
                }
            }
        });
    }
}
exports.proxyProperty = proxyProperty;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = {
    _typeToBox: {},
    _nativeToBox: {},
    _typeToNative: {},
    registerClass: function (boxedClass, nativeClass) {
        if (!this._typeToBox[boxedClass.type]) {
            this._typeToBox[boxedClass.type] = boxedClass;
            this._typeToNative[boxedClass.type] = nativeClass;
        }
        this._nativeToBox[String(nativeClass.class())] = boxedClass;
    },
    create: function (type, props) {
        var _type = type && type.type ? type.type : type;
        var BoxedClass = this._typeToBox[_type];
        if (BoxedClass) {
            return new BoxedClass(props);
        }
        return undefined;
    },
    createNative: function (type) {
        var _type = type && type.type ? type.type : type;
        var nativeClass = this._typeToNative[_type];
        if (!nativeClass) {
            throw new Error("don't know how to create a native " + _type);
        }
        return nativeClass;
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var wrapNativeObject_1 = __webpack_require__(7);
var utils_1 = __webpack_require__(4);
/**
 * Represents a rectangle.
 */
var Rectangle = /** @class */function () {
    /**
     * Return a new Rectangle object for a given x,y, width and height.
     *
     * @param {number | Rectangle} x The x coordinate of the top-left corner of the rectangle. Or a Rectangle.
     * @param {number} y The y coordinate of the top-left corner of the rectangle.
     * @param {number} width The width of the rectangle.
     * @param {number} height The height of the rectangle.
     * @return The new Rectangle object.
     */
    function Rectangle(x, y, width, height) {
        utils_1.initProxyProperties(this);
        utils_1.proxyProperty(this, 'x', parseFloat(x));
        utils_1.proxyProperty(this, 'y', parseFloat(y));
        utils_1.proxyProperty(this, 'width', parseFloat(width));
        utils_1.proxyProperty(this, 'height', parseFloat(height));
        // if the argument is object
        if (typeof x === 'object' && typeof x.x === 'number') {
            this._x = parseFloat(x.x);
            this._y = parseFloat(x.y);
            this._width = parseFloat(x.width);
            this._height = parseFloat(x.height);
        }
    }
    /**
     * Adjust this rectangle by offsetting it.
     *
     * @param {number} x The x offset to apply.
     * @param {number} y The y offset to apply.
     */
    Rectangle.prototype.offset = function (x, y) {
        this._x += parseFloat(x);
        this._y += parseFloat(y);
        if (this._parent && this._parentKey) {
            this._parent[this._parentKey] = this;
        }
        return this;
    };
    Rectangle.prototype.scale = function (factorWidth, factorHeight) {
        this._width *= parseFloat(factorWidth);
        this._height *= parseFloat(typeof factorHeight === 'undefined' ? factorWidth : factorHeight);
        if (this._parent && this._parentKey) {
            this._parent[this._parentKey] = this;
        }
        return this;
    };
    /**
     * Return the Rectangle as a CGRect.
     *
     * @return {CGRect} The rectangle.
     */
    Rectangle.prototype.asCGRect = function () {
        return CGRectMake(this._x, this._y, this._width, this._height);
    };
    /**
     * Return a string description of the rectangle.
     *
     * @return {string} Description of the rectangle.
     */
    Rectangle.prototype.toString = function () {
        return "{" + this._x + ", " + this._y + ", " + this._width + ", " + this._height + "}";
    };
    Rectangle.prototype.toJSON = function () {
        return {
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height
        };
    };
    /**
     * Convert a rectangle in the coordinates that a layer uses to another layer's coordinates.
     *
     * @param {Layer} layerA The layer in which the rectangle's coordinates are expressed.
     * @param {Layer} layerB The layer in which the rectangle's coordinates will be expressed.
     * @return {Rectangle} The converted rectangle expressed in the coordinate system of the layerB layer.
     */
    Rectangle.prototype.changeBasis = function (_a) {
        var _b = _a === void 0 ? {} : _a,
            from = _b.from,
            to = _b.to;
        var fromLayer = wrapNativeObject_1.wrapObject(from);
        var toLayer = wrapNativeObject_1.wrapObject(to);
        if (!fromLayer) {
            if (!toLayer || !toLayer.sketchObject || !toLayer.sketchObject.convertPoint_fromLayer) {
                throw new Error("Expected a Layer, got " + to);
            }
            var origin_1 = toLayer.sketchObject.convertPoint_fromLayer(NSMakePoint(this.x, this.y), null);
            return new Rectangle(origin_1.x, origin_1.y, this.width, this.height);
        }
        if (!fromLayer.sketchObject || !fromLayer.sketchObject.convertPoint_toLayer) {
            throw new Error("Expected a Layer, got " + from);
        }
        var origin = fromLayer.sketchObject.convertPoint_toLayer(NSMakePoint(this.x, this.y), toLayer ? toLayer.sketchObject : null);
        return new Rectangle(origin.x, origin.y, this.width, this.height);
    };
    return Rectangle;
}();
exports.Rectangle = Rectangle;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console) {

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(4);
var Factory_1 = __webpack_require__(5);
/**
 * Return a wrapped version of a Sketch object.
 * We don't know about *all* Sketch object types, but
 * for some we will return a special subclass.
 * The fallback position is just to return an instance of WrappedObject.
 *
 * @param {object} sketchObject The underlying sketch object that we're wrapping.
 * @return {WrappedObject} A javascript object (subclass of WrappedObject), which represents the Sketch object we were given.
 */
function wrapNativeObject(nativeObject) {
    var JsClass = Factory_1.Factory._nativeToBox[String(nativeObject.class())];
    if (!JsClass) {
        console.warn("no mapped wrapper for " + String(nativeObject.class()));
        JsClass = WrappedObject_1.WrappedObject;
    }
    return JsClass.fromNative(nativeObject);
}
exports.wrapNativeObject = wrapNativeObject;
function wrapObject(object) {
    if (!object) {
        return object;
    }
    if (utils_1.isNativeObject(object)) {
        return wrapNativeObject(object);
    }
    if (utils_1.isWrappedObject(object)) {
        return object;
    }
    var type = object.type,
        rest = __rest(object, ["type"]);
    if (!type) {
        throw new Error("You need to specify a \"type\" when creating a nested layer. Received: " + JSON.stringify(object, null, 2));
    }
    return Factory_1.Factory.create(type, rest);
}
exports.wrapObject = wrapObject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console) {

var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var StyledLayer_1 = __webpack_require__(11);
var Rectangle_1 = __webpack_require__(6);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var utils_1 = __webpack_require__(4);
var wrapNativeObject_1 = __webpack_require__(7);
/**
 * Represents a group of layers.
 */
var Group = /** @class */function (_super) {
    __extends(Group, _super);
    /**
     * Make a new group object.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Group(group) {
        if (group === void 0) {
            group = {};
        }
        var _this = this;
        if (!group.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            group.sketchObject = Factory_1.Factory.createNative(Group).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
        }
        _this = _super.call(this, group) || this;
        return _this;
    }
    // @deprecated
    Group.prototype.pageRectToLocalRect = function (rect) {
        console.warn('Group.pageRectToLocalRect(rect) is deprecated. Use rect.changeBasis({ to: group }) instead');
        return rect.changeBasis({
            to: this
        });
    };
    /**
     * Adjust the group to fit its children.
     */
    Group.prototype.adjustToFit = function () {
        this._object.resizeToFitChildrenWithOption_(0);
        return this;
    };
    return Group;
}(StyledLayer_1.StyledLayer);
exports.Group = Group;
Group.type = enums_1.Types.Group;
Group[WrappedObject_1.DefinedPropertiesKey] = __assign({}, StyledLayer_1.StyledLayer[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Group, MSLayerGroup);
Group.define('layers', {
    get: function () {
        return utils_1.toArray(this._object.layers()).map(wrapNativeObject_1.wrapNativeObject);
    },
    set: function (layers) {
        var _this = this;
        // remove the existing layers
        utils_1.toArray(this._object.layers()).forEach(function (l) {
            return l.removeFromParent();
        });
        utils_1.toArray(layers).map(wrapNativeObject_1.wrapObject).forEach(function (layer) {
            layer.parent = _this; // eslint-disable-line
        });
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(4);
var enums_1 = __webpack_require__(3);
var Gradient_1 = __webpack_require__(12);
var Color_1 = __webpack_require__(10);
var Shadow_1 = __webpack_require__(56);
var BorderOptions_1 = __webpack_require__(57);
var Blur_1 = __webpack_require__(58);
var Fill_1 = __webpack_require__(32);
var Border_1 = __webpack_require__(59);
var BlendingModeMap = {
    Normal: 0,
    Darken: 1,
    Multiply: 2,
    ColorBurn: 3,
    Lighten: 4,
    Screen: 5,
    ColorDodge: 6,
    Overlay: 7,
    SoftLight: 8,
    HardLight: 9,
    Difference: 10,
    Exclusion: 11,
    Hue: 12,
    Saturation: 13,
    Color: 14,
    Luminosity: 15
};
var BlendingMode = {
    Normal: 'Normal',
    Darken: 'Darken',
    Multiply: 'Multiply',
    ColorBurn: 'ColorBurn',
    Lighten: 'Lighten',
    Screen: 'Screen',
    ColorDodge: 'ColorDodge',
    Overlay: 'Overlay',
    SoftLight: 'SoftLight',
    HardLight: 'HardLight',
    Difference: 'Difference',
    Exclusion: 'Exclusion',
    Hue: 'Hue',
    Saturation: 'Saturation',
    Color: 'Color',
    Luminosity: 'Luminosity'
};
var DEFAULT_STYLE = {
    fills: []
};
/**
 * Represents a Sketch layer style.
 */
var Style = /** @class */function (_super) {
    __extends(Style, _super);
    /**
     * Make a new style object.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Style(style) {
        if (style === void 0) {
            style = {};
        }
        var _this = this;
        if (!style.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            style = Object.assign({}, DEFAULT_STYLE, style);
            // eslint-disable-next-line no-param-reassign
            style.sketchObject = MSDefaultStyle.defaultStyle();
        }
        _this = _super.call(this, style) || this;
        return _this;
    }
    Style.colorFromString = function (color) {
        return Color_1.colorFromString(color);
    };
    Style.colorToString = function (value) {
        return Color_1.colorToString(value);
    };
    return Style;
}(WrappedObject_1.WrappedObject);
exports.Style = Style;
Style.type = enums_1.Types.Style;
Style[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
Style.GradientType = Gradient_1.GradientType;
Style.define('opacity', {
    get: function () {
        return this._object.contextSettings().opacity();
    },
    set: function (opacity) {
        this._object.contextSettings().setOpacity(Math.min(Math.max(opacity, 0), 1));
    }
});
Style.BlendingMode = BlendingMode;
Style.define('blendingMode', {
    get: function () {
        var mode = this._object.contextSettings().blendMode();
        return Object.keys(BlendingModeMap).find(function (key) {
            return BlendingModeMap[key] === mode;
        }) || mode;
    },
    set: function (mode) {
        var blendingMode = BlendingModeMap[mode];
        this._object.contextSettings().setBlendMode(typeof blendingMode !== 'undefined' ? blendingMode : mode);
    }
});
Style.Arrowhead = BorderOptions_1.Arrowhead;
Style.LineEnd = BorderOptions_1.LineEnd;
Style.LineJoin = BorderOptions_1.LineJoin;
Style.define('borderOptions', {
    get: function () {
        return BorderOptions_1.BorderOptions.fromNative(this._object);
    },
    set: function (borderOptions) {
        BorderOptions_1.BorderOptions.updateNative(this._object, borderOptions);
    }
});
Style.BlurType = Blur_1.BlurType;
Style.define('blur', {
    get: function () {
        return Blur_1.Blur.fromNative(this._object.blur());
    },
    set: function (blur) {
        Blur_1.Blur.updateNative(this._object.blur(), blur);
    }
});
Style.FillType = Fill_1.FillType;
Style.define('fills', {
    get: function () {
        var fills = utils_1.toArray(this._object.fills());
        return fills.map(Fill_1.Fill.fromNative.bind(Fill_1.Fill));
    },
    set: function (values) {
        var objects = values.map(Fill_1.Fill.toNative.bind(Fill_1.Fill));
        this._object.setFills(objects);
    }
});
Style.BorderPosition = Border_1.BorderPosition;
Style.define('borders', {
    get: function () {
        var borders = utils_1.toArray(this._object.borders());
        return borders.map(Border_1.Border.fromNative.bind(Border_1.Border));
    },
    set: function (values) {
        var objects = values.map(Border_1.Border.toNative.bind(Border_1.Border));
        this._object.setBorders(objects);
    }
});
Style.define('shadows', {
    get: function () {
        return utils_1.toArray(this._object.shadows()).map(Shadow_1.Shadow.fromNative.bind(Shadow_1.Shadow));
    },
    set: function (values) {
        var objects = values.map(Shadow_1.Shadow.toNative.bind(Shadow_1.Shadow, MSStyleShadow));
        this._object.setShadows(objects);
    }
});
Style.define('innerShadows', {
    get: function () {
        return utils_1.toArray(this._object.innerShadows()).map(Shadow_1.Shadow.fromNative.bind(Shadow_1.Shadow));
    },
    set: function (values) {
        var objects = values.map(Shadow_1.Shadow.toNative.bind(Shadow_1.Shadow, MSStyleInnerShadow));
        this._object.setInnerShadows(objects);
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(4);
/**
 * Given a string description of a color, return an MSColor.
 */
function colorFromString(value) {
    var immutable = MSImmutableColor.colorWithSVGString_(value);
    return MSColor.alloc().initWithImmutableObject_(immutable);
}
exports.colorFromString = colorFromString;
/**
 * Given a MSColor, return string description of a color.
 */
function colorToString(value) {
    function toHex(v) {
        // eslint-disable-next-line
        return (Math.round(v * 255) | 1 << 8).toString(16).slice(1);
    }
    var red = toHex(value.red());
    var green = toHex(value.green());
    var blue = toHex(value.blue());
    var alpha = toHex(value.alpha());
    return "#" + red + green + blue + alpha;
}
exports.colorToString = colorToString;
var Color = /** @class */function () {
    function Color(nativeColor) {
        this._object = nativeColor;
    }
    Color.from = function (object) {
        if (!object) {
            return undefined;
        }
        var nativeColor;
        if (utils_1.isNativeObject(object)) {
            var className = String(object.class());
            if (className === 'MSColor') {
                nativeColor = object;
            } else {
                throw new Error("Cannot create a color from a " + className);
            }
        } else if (typeof object === 'string') {
            nativeColor = colorFromString(object);
        } else {
            throw new Error('`color` needs to be a string');
        }
        return new Color(nativeColor);
    };
    Color.prototype.toString = function () {
        return colorToString(this._object);
    };
    return Color;
}();
exports.Color = Color;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Layer_1 = __webpack_require__(30);
var Style_1 = __webpack_require__(9);
var utils_1 = __webpack_require__(4);
/**
 * Represents a layer with style.
 */
var StyledLayer = /** @class */function (_super) {
    __extends(StyledLayer, _super);
    function StyledLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StyledLayer;
}(Layer_1.Layer);
exports.StyledLayer = StyledLayer;
StyledLayer[WrappedObject_1.DefinedPropertiesKey] = __assign({}, Layer_1.Layer[WrappedObject_1.DefinedPropertiesKey]);
StyledLayer.define('style', {
    get: function () {
        var style = Style_1.Style.fromNative(this._object.style());
        return style;
    },
    set: function (style) {
        if (utils_1.isNativeObject(style)) {
            this._object.style = style;
        } else if (!style || !style.sketchObject) {
            this._object.style = new Style_1.Style(style).sketchObject;
        } else {
            this._object.style = style.sketchObject;
        }
    }
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(4);
var GradientStop_1 = __webpack_require__(55);
var Point_1 = __webpack_require__(31);
var enums_1 = __webpack_require__(3);
var GradientTypeMap = {
    Linear: 0,
    Radial: 1,
    Angular: 2
};
exports.GradientType = {
    Linear: 'Linear',
    Radial: 'Radial',
    Angular: 'Angular'
};
var Gradient = /** @class */function (_super) {
    __extends(Gradient, _super);
    function Gradient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gradient.from = function (object) {
        if (!object) {
            return undefined;
        }
        var nativeGradient;
        if (utils_1.isNativeObject(object)) {
            var className = String(object.class());
            if (className === 'MSGradient') {
                nativeGradient = object;
            } else {
                throw new Error("Cannot create a gradient from a " + className);
            }
        } else {
            nativeGradient = MSGradient.alloc().initBlankGradient();
            if (object.gradientType) {
                var type = GradientTypeMap[object.gradientType];
                nativeGradient.setGradientType(typeof type !== 'undefined' ? type : object.gradientType);
            }
            if (object.from) {
                nativeGradient.setFrom(CGPointMake(object.from.x || 0.5, object.from.y || 0));
            }
            if (object.to) {
                nativeGradient.setTo(CGPointMake(object.to.x || 0.5, object.to.y || 1));
            }
            if (object.stops) {
                nativeGradient.setStops(object.stops.map(GradientStop_1.GradientStop.from).map(function (g) {
                    return g._object;
                }));
            }
        }
        return Gradient.fromNative(nativeGradient);
    };
    return Gradient;
}(WrappedObject_1.WrappedObject);
exports.Gradient = Gradient;
Gradient.type = enums_1.Types.Gradient;
Gradient[WrappedObject_1.DefinedPropertiesKey] = {};
Gradient.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    get: function () {
        return this._object;
    }
});
Gradient.define('gradientType', {
    get: function () {
        var _this = this;
        return Object.keys(GradientTypeMap).find(function (key) {
            return GradientTypeMap[key] === _this._object.gradientType();
        }) || this._object.gradientType();
    },
    set: function (gradientType) {
        var type = GradientTypeMap[gradientType];
        this._object.setGradientType(typeof type !== 'undefined' ? type : gradientType);
    }
});
Gradient.define('from', {
    get: function () {
        var point = new Point_1.Point(this._object.from().x, this._object.from().y);
        point._parent = this;
        point._parentKey = 'from';
        return point;
    },
    set: function (point) {
        this._object.setFrom(CGPointMake(point.x || 0.5, point.y || 0));
    }
});
Gradient.define('to', {
    get: function () {
        var point = new Point_1.Point(this._object.to().x, this._object.to().y);
        point._parent = this;
        point._parentKey = 'to';
        return point;
    },
    set: function (point) {
        this._object.setFrom(CGPointMake(point.x || 0.5, point.y || 0));
    }
});
Gradient.define('stops', {
    get: function () {
        return utils_1.toArray(this._object.stops()).map(GradientStop_1.GradientStop.from.bind(GradientStop_1.GradientStop));
    },
    set: function (stops) {
        this._object.setStops(stops.map(GradientStop_1.GradientStop.from.bind(GradientStop_1.GradientStop)).map(function (g) {
            return g._object;
        }));
    }
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var StyledLayer_1 = __webpack_require__(11);
var Rectangle_1 = __webpack_require__(6);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var TextBehaviour = {
    flexibleWidth: 0,
    fixedWidth: 1
};
var TextLineSpacingBehaviour = {
    variable: 'variable',
    constantBaseline: 'constantBaseline'
};
exports.TextLineSpacingBehaviourMap = {
    variable: 1,
    constantBaseline: 2
};
// Mapping between text alignment names and values.
var TextAlignment = {
    left: 'left',
    right: 'right',
    center: 'center',
    justified: 'justified',
    natural: 'natural'
};
exports.TextAlignmentMap = {
    left: 0,
    right: 1,
    center: 2,
    justified: 3,
    natural: 4
};
/**
 * Represents a text layer.
 */
var Text = /** @class */function (_super) {
    __extends(Text, _super);
    /**
     * Make a new text object.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Text(text) {
        if (text === void 0) {
            text = {};
        }
        var _this = this;
        if (!text.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            text.sketchObject = Factory_1.Factory.createNative(Text).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
        }
        _this = _super.call(this, text) || this;
        _this.adjustToFit();
        return _this;
    }
    Object.defineProperty(Text.prototype, "font", {
        /**
         * Set the font of the layer to an NSFont object.
         *
         * @param {NSFont} value The font to use.
         */
        set: function (value) {
            this._object.font = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "systemFontSize", {
        /**
         * Set the font of the layer to the system font at a given size.
         *
         * @param {number} size The system font size to use.
         */
        set: function (size) {
            this._object.setFont(NSFont.systemFontOfSize_(size));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adjust the frame of the layer to fit its contents.
     */
    Text.prototype.adjustToFit = function () {
        this._object.adjustFrameToFit();
        return this;
    };
    Object.defineProperty(Text.prototype, "fragments", {
        /**
         * Return a list of the text fragments for the text.
         *
         * @return {array} The line fragments. Each one is a dictionary containing a rectangle, and a baseline offset.
         */
        get: function () {
            var textLayer = this._object;
            var storage = textLayer.immutableModelObject().createTextStorage();
            var layout = storage.layoutManagers().firstObject();
            var actualCharacterRangePtr = MOPointer.new();
            var charRange = NSMakeRange(0, storage.length());
            var drawingPoint = textLayer.drawingPointForText();
            layout.glyphRangeForCharacterRange_actualCharacterRange_(charRange, actualCharacterRangePtr);
            var glyphRange = actualCharacterRangePtr.value();
            var fragments = [];
            var currentLocation = 0;
            while (currentLocation < NSMaxRange(glyphRange)) {
                var effectiveRangePtr = MOPointer.new();
                var localRect = layout.lineFragmentRectForGlyphAtIndex_effectiveRange_(currentLocation, effectiveRangePtr);
                var rect = new Rectangle_1.Rectangle(localRect.origin.x + drawingPoint.x, localRect.origin.y + drawingPoint.y, localRect.size.width, localRect.size.height);
                var effectiveRange = effectiveRangePtr.value();
                var baselineOffset = layout.typesetter().baselineOffsetInLayoutManager_glyphIndex_(layout, currentLocation);
                fragments.push({
                    rect: rect,
                    baselineOffset: baselineOffset,
                    range: effectiveRange
                });
                currentLocation = NSMaxRange(effectiveRange) + 1;
            }
            return fragments;
        },
        enumerable: true,
        configurable: true
    });
    return Text;
}(StyledLayer_1.StyledLayer);
exports.Text = Text;
Text.type = enums_1.Types.Text;
Text[WrappedObject_1.DefinedPropertiesKey] = __assign({}, StyledLayer_1.StyledLayer[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Text, MSTextLayer);
Text.define('text', {
    get: function () {
        return String(this._object.stringValue());
    },
    /**
     * Set the text of the layer.
     * If the layer hasn't explicitly been given a name, this will also change
     * the layer's name to the text value.
     *
     * @param {string} value The text to use.
     */
    set: function (value) {
        var object = this._object;
        object.stringValue = value;
        if (!object.nameIsFixed()) {
            object.name = value;
        }
    }
});
Text.Alignment = TextAlignment;
Text.define('alignment', {
    /**
     * The alignment of the layer.
     * This will be one of the values: "left", "center", "right", "justified", "natural".
     *
     * @return {string} The alignment mode.
     */
    get: function () {
        var raw = this._object.textAlignment();
        return Object.keys(exports.TextAlignmentMap).find(function (key) {
            return exports.TextAlignmentMap[key] === raw;
        }) || raw;
    },
    /**
     * Set the alignment of the layer.
     *
     * The mode supplied can be a string or a number.
     * If it's a string, it should be one of the values: "left", "center", "right", "justified", "natural".
     *
     * @param {string} mode The alignment mode to use.
     */
    set: function (mode) {
        var translated = exports.TextAlignmentMap[mode];
        this._object.textAlignment = typeof translated !== 'undefined' ? translated : mode;
    }
});
Text.LineSpacing = TextLineSpacingBehaviour;
Text.define('lineSpacing', {
    get: function () {
        var raw = this._object.lineSpacingBehaviour();
        return Object.keys(exports.TextLineSpacingBehaviourMap).find(function (key) {
            return exports.TextLineSpacingBehaviourMap[key] === raw;
        }) || raw;
    },
    set: function (mode) {
        var translated = exports.TextLineSpacingBehaviourMap[mode];
        var lineSpacingBehaviour = typeof translated !== 'undefined' ? translated : mode;
        var textLayer = this._object;
        var layout = textLayer.immutableModelObject().textLayout();
        var initialBaselineOffset = layout.firstBaselineOffset();
        textLayer.lineSpacingBehaviour = lineSpacingBehaviour;
        var baselineOffset = layout.firstBaselineOffset();
        var rect = this.frame;
        rect.y -= baselineOffset - initialBaselineOffset;
        this.frame = rect;
    }
});
Text.define('fixedWidth', {
    get: function () {
        return this._object.textBehaviour() === TextBehaviour.fixedWidth;
    },
    set: function (fixed) {
        if (fixed) {
            this._object.textBehaviour = TextBehaviour.fixedWidth;
        } else {
            this._object.textBehaviour = TextBehaviour.flexibleWidth;
        }
    }
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Group_1 = __webpack_require__(8);
var Rectangle_1 = __webpack_require__(6);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
/**
 * A Sketch artboard.
 */
var Artboard = /** @class */function (_super) {
    __extends(Artboard, _super);
    /**
     * Make a new artboard.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Artboard(artboard) {
        if (artboard === void 0) {
            artboard = {};
        }
        var _this = this;
        if (!artboard.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            artboard.sketchObject = Factory_1.Factory.createNative(Artboard).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
        }
        _this = _super.call(this, artboard) || this;
        return _this;
    }
    /**
     * Adjust the Artboard to fit its children.
     * override the group's method
     */
    Artboard.prototype.adjustToFit = function () {
        this._object.resizeToFitChildren();
        return this;
    };
    return Artboard;
}(Group_1.Group);
exports.Artboard = Artboard;
Artboard.type = enums_1.Types.Artboard;
Artboard[WrappedObject_1.DefinedPropertiesKey] = __assign({}, Group_1.Group[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Artboard, MSArtboardGroup);
delete Artboard[WrappedObject_1.DefinedPropertiesKey].flow;
delete Artboard[WrappedObject_1.DefinedPropertiesKey].style;
delete Artboard[WrappedObject_1.DefinedPropertiesKey].locked;
delete Artboard[WrappedObject_1.DefinedPropertiesKey].hidden;
Artboard.define('flowStartPoint', {
    get: function () {
        return !!this._object.isFlowHome();
    },
    set: function (isFlowStartHome) {
        this._object.isFlowHome = isFlowStartHome;
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var export_1 = __webpack_require__(70);
var Rectangle_1 = __webpack_require__(6);
var Style_1 = __webpack_require__(9);
var Document_1 = __webpack_require__(22);
var Group_1 = __webpack_require__(8);
var Text_1 = __webpack_require__(13);
var Image_1 = __webpack_require__(25);
var Shape_1 = __webpack_require__(24);
var Artboard_1 = __webpack_require__(14);
var Page_1 = __webpack_require__(23);
var SymbolMaster_1 = __webpack_require__(71);
var SymbolInstance_1 = __webpack_require__(72);
var Library_1 = __webpack_require__(74);
var HotSpot_1 = __webpack_require__(34);
var Flow_1 = __webpack_require__(21);
var enums_1 = __webpack_require__(3);
var wrapNativeObject_1 = __webpack_require__(7);
var api = {};
api.Document = Document_1.Document;
api.Group = Group_1.Group;
api.Text = Text_1.Text;
api.Image = Image_1.Image;
api.Shape = Shape_1.Shape;
api.Artboard = Artboard_1.Artboard;
api.Page = Page_1.Page;
api.SymbolMaster = SymbolMaster_1.SymbolMaster;
api.SymbolInstance = SymbolInstance_1.SymbolInstance;
api.Library = Library_1.Library;
api.HotSpot = HotSpot_1.HotSpot;
api.Flow = {
    AnimationType: Flow_1.AnimationType,
    BackTarget: Flow_1.BackTarget
};
api.export = export_1.exportObject;
api.Style = Style_1.Style;
api.Rectangle = Rectangle_1.Rectangle;
api.Types = enums_1.Types;
api.fromNative = wrapNativeObject_1.wrapObject;
api.getDocuments = Document_1.Document.getDocuments;
api.getSelectedDocument = Document_1.Document.getSelectedDocument;
api.getLibraries = Library_1.Library.getLibraries;
api.version = {
    sketch: MSApplicationMetadata.metadata().appVersion,
    api: "2.0.0"
};
module.exports = api;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var fiberAvailable = __webpack_require__(36)

var setTimeout
var clearTimeout

var fibers = []

if (fiberAvailable()) {
  var fibers = []

  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    // fibers takes care of keeping coscript around
    var id = fibers.length
    fibers.push(coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
      }
    ))
    return id
  }

  clearTimeout = function (id) {
    var timeout = fibers[id]
    if (timeout) {
      timeout.cancel() // fibers takes care of keeping coscript around
      fibers[id] = undefined // garbage collect the fiber
    }
  }
} else {
  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    coscript.shouldKeepAround = true
    var id = fibers.length
    fibers.push(true)
    coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        if (fibers[id]) { // if not cleared
          func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
        }
        clearTimeout(id)
        if (fibers.every(function (_id) { return !_id })) { // if everything is cleared
          coscript.shouldKeepAround = false
        }
      }
    )
    return id
  }

  clearTimeout = function (id) {
    fibers[id] = false
  }
}

module.exports = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.pluralize = exports.ensureNumbers = exports.ensureExpectedIsNumber = exports.ensureActualIsNumber = exports.ensureNoExpected = exports.matcherHint = exports.printWithType = exports.getType = exports.printExpected = exports.printReceived = exports.highlightTrailingWhitespace = exports.SUGGEST_TO_EQUAL = exports.RECEIVED_COLOR = exports.EXPECTED_COLOR = exports.reverseChalk = exports.stringify = undefined;
var _util = __webpack_require__(29);
var stringify = exports.stringify = _util.inspect; /* eslint-disable prefer-template, import/first */
var chalk = {
    green: function (s) {
        return "{{{CHALK_green}}}" + s + "{{{/CHALK_green}}}";
    },
    red: function (s) {
        return "{{{CHALK_red}}}" + s + "{{{/CHALK_red}}}";
    },
    dim: function (s) {
        return "{{{CHALK_dim}}}" + s + "{{{/CHALK_dim}}}";
    },
    inverse: function (s) {
        return "{{{CHALK_inverse}}}" + s + "{{{/CHALK_inverse}}}";
    }
};
var REVERSE_REGEX = /{{{CHALK_([a-z]+)}}}([\s\S]*?){{{\/CHALK_\1}}}/gm;
var reverseChalk = exports.reverseChalk = function (realChalk, s) {
    return s.replace(REVERSE_REGEX, function (match, mode, inside) {
        return realChalk[mode](reverseChalk(realChalk, inside));
    });
};
var EXPECTED_COLOR = exports.EXPECTED_COLOR = chalk.green;
var RECEIVED_COLOR = exports.RECEIVED_COLOR = chalk.red;
var NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen'];
var SUGGEST_TO_EQUAL = exports.SUGGEST_TO_EQUAL = chalk.dim('Looks like you wanted to test for object/array equality with strict `toBe` matcher. You probably need to use `toEqual` instead.');
var highlightTrailingWhitespace = exports.highlightTrailingWhitespace = function (text) {
    return text.replace(/\s+$/gm, chalk.inverse('$&'));
};
var printReceived = exports.printReceived = function (object) {
    return RECEIVED_COLOR(highlightTrailingWhitespace(stringify(object)));
};
var printExpected = exports.printExpected = function (value) {
    return EXPECTED_COLOR(highlightTrailingWhitespace(stringify(value)));
};
var getType = exports.getType = function (value) {
    if (typeof value === 'undefined') {
        return 'undefined';
    } else if (value === null) {
        return 'null';
    } else if (Array.isArray(value)) {
        return 'array';
    } else if (typeof value === 'boolean') {
        return 'boolean';
    } else if (typeof value === 'function') {
        return 'function';
    } else if (typeof value === 'number') {
        return 'number';
    } else if (typeof value === 'string') {
        return 'string';
    } else if (typeof value === 'object') {
        if (value.constructor === RegExp) {
            return 'regexp';
        } else if (value.constructor === Map) {
            return 'map';
        } else if (value.constructor === Set) {
            return 'set';
        } else if (value.class && typeof value.class === 'function') {
            return 'sketch-native';
        }
        return 'object';
        // $FlowFixMe https://github.com/facebook/flow/issues/1015
    } else if (typeof value === 'symbol') {
        return 'symbol';
    }
    throw new Error("value of unknown type: " + value);
};
var printWithType = exports.printWithType = function (name, received, print) {
    var type = getType(received);
    return name + ':' + (type !== 'null' && type !== 'undefined' ? '\n  ' + type + ': ' : ' ') + print(received);
};
var matcherHint = exports.matcherHint = function (matcherName, received, expected, options) {
    if (received === void 0) {
        received = 'received';
    }
    if (expected === void 0) {
        expected = 'expected';
    }
    var secondArgument = options && options.secondArgument;
    var isDirectExpectCall = options && options.isDirectExpectCall;
    return chalk.dim('expect' + (isDirectExpectCall ? '' : '(')) + RECEIVED_COLOR(received) + chalk.dim((isDirectExpectCall ? '' : ')') + matcherName + '(') + EXPECTED_COLOR(expected) + (secondArgument ? ", " + EXPECTED_COLOR(secondArgument) : '') + chalk.dim(')');
};
var ensureNoExpected = exports.ensureNoExpected = function (expected, matcherName) {
    if (typeof expected !== 'undefined') {
        throw new Error(matcherHint("[.not]" + (matcherName || 'This'), undefined, '') + "\n\nMatcher does not accept any arguments.\n" + printWithType('Got', expected, printExpected));
    }
};
var ensureActualIsNumber = exports.ensureActualIsNumber = function (actual, matcherName) {
    if (typeof actual !== 'number') {
        throw new Error(matcherHint("[.not]" + (matcherName || 'This matcher')) + '\n\n' + "Received value must be a number.\n" + printWithType('Received', actual, printReceived));
    }
};
var ensureExpectedIsNumber = exports.ensureExpectedIsNumber = function (expected, matcherName) {
    if (typeof expected !== 'number') {
        throw new Error(matcherHint("[.not]" + (matcherName || 'This matcher')) + '\n\n' + "Expected value must be a number.\n" + printWithType('Got', expected, printExpected));
    }
};
var ensureNumbers = exports.ensureNumbers = function (actual, expected, matcherName) {
    ensureActualIsNumber(actual, matcherName);
    ensureExpectedIsNumber(expected, matcherName);
};
var pluralize = exports.pluralize = function (word, count) {
    return (NUMBERS[count] || count) + ' ' + word + (count === 1 ? '' : 's');
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function isRunningOnJenkins() {
    return !__command.pluginBundle();
}
exports.isRunningOnJenkins = isRunningOnJenkins;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setTimeout, setImmediate, console) {

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
};

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

module.exports = Promise;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)["setTimeout"], __webpack_require__(37)["setImmediate"], __webpack_require__(0)))

/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */

module.exports = function prepareStackTrace(stackTrace) {
  var stack = stackTrace.split('\n')
  stack = stack.map(function (s) {
    return s.replace(/\sg/, '')
  })

  stack = stack.map(function (entry) {
    // entry is something like `functionName@path/to/my/file:line:column`
    // or `path/to/my/file:line:column`
    // or `path/to/my/file`
    // or `path/to/@my/file:line:column`
    var parts = entry.split('@')
    var fn = parts.shift()
    var filePath = parts.join('@') // the path can contain @

    if (fn.indexOf('/Users/') === 0) {
      // actually we didn't have a fn so just put it back in the filePath
      filePath = fn + (filePath ? ('@' + filePath) : '')
      fn = null
    }

    if (!filePath) {
      // we should always have a filePath, so if we don't have one here, it means that the function what actually anonymous and that it is the filePath instead
      filePath = entry
      fn = null
    }

    var filePathParts = filePath.split(':')
    filePath = filePathParts[0]

    // the file is the last part of the filePath
    var file = filePath.split('/')
    file = file[file.length - 1]

    return {
      fn: fn,
      file: file,
      filePath: filePath,
      line: filePathParts[1],
      column: filePathParts[2],
    }
  })

  return stack
}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var utils_1 = __webpack_require__(4);
var wrapNativeObject_1 = __webpack_require__(7);
// Mapping between animation type names and values.
exports.AnimationType = {
    none: 'none',
    slideFromRight: 'slideFromRight',
    slideFromLeft: 'slideFromLeft',
    slideFromBottom: 'slideFromBottom',
    slideFromTop: 'slideFromTop'
};
exports.BackTarget = 'back';
exports.AnimationTypeMap = {
    none: -1,
    slideFromRight: 0,
    slideFromLeft: 1,
    slideFromBottom: 2,
    slideFromTop: 3
};
/**
 * A MSFlowConnection. This is not exposed, only used by Layer
 */
var Flow = /** @class */function (_super) {
    __extends(Flow, _super);
    function Flow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * can accept a wide range of input:
     * - a wrapped Flow
     * - a native MSFlowConnection
     * - an object with a `target` or `targetId` property
     */
    Flow.from = function (flow) {
        if (utils_1.isWrappedObject(flow) && flow.type === enums_1.Types.Flow) {
            return flow;
        }
        if (utils_1.isNativeObject(flow)) {
            var className = String(flow.class());
            if (className !== 'MSFlowConnection') {
                throw new Error("Cannot create a flow from a " + className);
            }
            return Flow.fromNative(flow);
        } else if (flow && (flow.target || flow.targetId)) {
            return new Flow(__assign({ sketchObject: MSFlowConnection.new() }, flow));
        }
        throw new Error('`flow` needs to be an object');
    };
    Flow.prototype.isBackAction = function () {
        return !!this._object.isBackAction();
    };
    Flow.prototype.isValidConnection = function () {
        return !!this._object.isValidFlowConnection();
    };
    return Flow;
}(WrappedObject_1.WrappedObject);
exports.Flow = Flow;
Flow.type = enums_1.Types.Flow;
Flow[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Flow, MSFlowConnection);
Flow.define('targetId', {
    get: function () {
        return String(this._object.destinationArtboardID());
    },
    set: function (targetId) {
        this._object.destinationArtboardID = targetId;
    }
});
Flow.define('target', {
    enumerable: false,
    exportable: false,
    get: function () {
        var target = this._object.destinationArtboard();
        if (target == exports.BackTarget) {
            return exports.BackTarget;
        }
        return wrapNativeObject_1.wrapObject(target);
    },
    set: function (target) {
        if (target == exports.BackTarget) {
            this._object.destinationArtboardID = exports.BackTarget;
            return;
        }
        this._object.destinationArtboardID = wrapNativeObject_1.wrapObject(target).id;
    }
});
Flow.define('animationType', {
    get: function () {
        var raw = this._object.animationType();
        return Object.keys(exports.AnimationTypeMap).find(function (key) {
            return exports.AnimationTypeMap[key] === raw;
        }) || raw;
    },
    set: function (animationType) {
        var translated = exports.AnimationTypeMap[animationType];
        this._object.animationType = typeof translated !== 'undefined' ? translated : animationType;
    }
});
// override the WrappedObject id
delete Flow[WrappedObject_1.DefinedPropertiesKey].id;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Page_1 = __webpack_require__(23);
var Selection_1 = __webpack_require__(33);
var utils_1 = __webpack_require__(4);
var wrapNativeObject_1 = __webpack_require__(7);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
/**
 * A Sketch document.
 */
var Document = /** @class */function (_super) {
    __extends(Document, _super);
    /**
     * Make a new document object.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Document(document) {
        if (document === void 0) {
            document = {};
        }
        var _this = this;
        if (!document.sketchObject) {
            var app = NSDocumentController.sharedDocumentController();
            var error = MOPointer.alloc().init();
            // eslint-disable-next-line no-param-reassign
            document.sketchObject = app.openUntitledDocumentAndDisplay_error(true, error);
            if (error.value() !== null) {
                throw new Error(error.value());
            }
            if (!document.sketchObject) {
                throw new Error('could not create a new Document');
            }
        }
        _this = _super.call(this, document) || this;
        return _this;
    }
    Document.getDocuments = function () {
        var app = NSDocumentController.sharedDocumentController();
        return utils_1.toArray(app.documents()).map(function (doc) {
            return Document.fromNative(doc);
        });
    };
    Document.getSelectedDocument = function () {
        var app = NSDocumentController.sharedDocumentController();
        var nativeDocument = app.currentDocument();
        if (!nativeDocument) {
            return undefined;
        }
        return Document.fromNative(nativeDocument);
    };
    /**
     * Find the first layer in this document which has the given id.
     *
     * @return {Layer} A layer object, if one was found.
     */
    Document.prototype.getLayerWithID = function (layerId) {
        var documentData = utils_1.getDocumentData(this._object);
        var layer = documentData.layerWithID(layerId);
        if (layer) {
            return wrapNativeObject_1.wrapObject(layer);
        }
        return undefined;
    };
    /**
     * Find all the layers in this document which has the given name.
     */
    Document.prototype.getLayersNamed = function (layerName) {
        // search all pages
        var filteredArray = NSArray.array();
        var loopPages = this._object.pages().objectEnumerator();
        var page = loopPages.nextObject();
        var predicate = NSPredicate.predicateWithFormat('name == %@', layerName);
        while (page) {
            var scope = page.children();
            filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate));
            page = loopPages.nextObject();
        }
        return utils_1.toArray(filteredArray).map(wrapNativeObject_1.wrapObject);
    };
    /**
     * Find the first symbol master in this document which has the given id.
     *
     * @return {SymbolMaster} A symbol master object, if one was found.
     */
    Document.prototype.getSymbolMasterWithID = function (symbolId) {
        var documentData = utils_1.getDocumentData(this._object);
        var symbol = documentData.symbolWithID(symbolId);
        if (symbol) {
            return wrapNativeObject_1.wrapObject(symbol);
        }
        return undefined;
    };
    Document.prototype.getSymbols = function () {
        var documentData = utils_1.getDocumentData(this._object);
        return utils_1.toArray(documentData.allSymbols()).map(wrapNativeObject_1.wrapObject);
    };
    /**
     * Center the view of the document window on a given layer.
     *
     * @param {Layer} layer The layer to center on.
     */
    Document.prototype.centerOnLayer = function (layer) {
        var wrappedLayer = wrapNativeObject_1.wrapObject(layer);
        this._object.contentDrawView().centerRect_(wrappedLayer.sketchObject.rect());
    };
    Document.open = function (path) {
        var app = NSDocumentController.sharedDocumentController();
        var document;
        if (!path) {
            app.openDocument();
            document = app.currentDocument();
        } else {
            var url = utils_1.getURLFromPath(path);
            if (app.documentForURL(url)) {
                return Document.fromNative(app.documentForURL(url));
            }
            var error = MOPointer.alloc().init();
            document = app.openDocumentWithContentsOfURL_display_error(url, true, error);
            if (error.value() !== null) {
                throw new Error(error.value());
            }
        }
        return Document.fromNative(document);
    };
    Document.prototype.save = function (path) {
        var msdocument = this._object;
        var saveMethod = 'writeToURL_ofType_forSaveOperation_originalContentsURL_error';
        if (!msdocument[saveMethod]) {
            // we only have an MSDocumentData instead of a MSDocument
            // let's try to get back to the MSDocument
            msdocument = this._object.delegate();
        }
        if (!msdocument || !msdocument[saveMethod]) {
            throw new Error('Cannot save this document');
        }
        var error = MOPointer.alloc().init();
        if (!path) {
            msdocument.saveDocument();
        } else {
            var url = utils_1.getURLFromPath(path);
            var oldUrl = NSURL.URLWithString('not used');
            msdocument[saveMethod](url, 0, NSSaveToOperation, oldUrl, error);
            if (error.value() !== null) {
                throw new Error(error.value());
            }
        }
        return this;
    };
    Document.prototype.close = function () {
        var msdocument = this._object;
        if (!msdocument.close) {
            // we only have an MSDocumentData instead of a MSDocument
            // let's try to get back to the MSDocument
            msdocument = this._object.delegate();
        }
        if (!msdocument || !msdocument.close) {
            throw new Error('Cannot close this document');
        }
        msdocument.close();
    };
    return Document;
}(WrappedObject_1.WrappedObject);
exports.Document = Document;
Document.type = enums_1.Types.Document;
Document[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Document, MSDocumentData);
// also register MSDocument if it exists
if (typeof MSDocument !== 'undefined') {
    Factory_1.Factory.registerClass(Document, MSDocument);
}
// override getting the id to make sure it's fine if we have an MSDocument
Document.define('id', {
    exportable: true,
    importable: false,
    get: function () {
        if (!this._object) {
            return undefined;
        }
        if (!this._object.objectID) {
            return String(this._object.documentData().objectID());
        }
        return String(this._object.objectID());
    }
});
Document.define('pages', {
    get: function () {
        if (!this._object) {
            return [];
        }
        var pages = utils_1.toArray(this._object.pages());
        return pages.map(function (page) {
            return Page_1.Page.fromNative(page);
        });
    },
    set: function (pages) {
        var _this = this;
        // remove the existing pages
        this._object.removePages_detachInstances(this._object.pages(), true);
        utils_1.toArray(pages).map(wrapNativeObject_1.wrapObject).forEach(function (page) {
            page.parent = _this; // eslint-disable-line
        });
    }
});
/**
 * The layers that the user has selected in the currently selected page.
 *
 * @return {Selection} A selection object representing the layers that the user has selected in the currently selected page.
 */
Document.define('selectedLayers', {
    enumerable: false,
    exportable: false,
    importable: false,
    get: function () {
        return new Selection_1.Selection(this.selectedPage);
    }
});
/**
 * The current page that the user has selected.
 *
 * @return {Page} A page object representing the page that the user is currently viewing.
 */
Document.define('selectedPage', {
    enumerable: false,
    exportable: false,
    importable: false,
    get: function () {
        return Page_1.Page.fromNative(this._object.currentPage());
    }
});

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Group_1 = __webpack_require__(8);
var Selection_1 = __webpack_require__(33);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var wrapNativeObject_1 = __webpack_require__(7);
/**
 * Represents a Page in a Sketch document.
 */
var Page = /** @class */function (_super) {
    __extends(Page, _super);
    /**
     * Make a new page object.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Page(page) {
        if (page === void 0) {
            page = {};
        }
        var _this = this;
        if (!page.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            page.sketchObject = Factory_1.Factory.createNative(Page).alloc().init();
        }
        _this = _super.call(this, page) || this;
        return _this;
    }
    // eslint-disable-next-line
    Page.prototype.adjustToFit = function () {
        // obviously doesn't do anything
    };
    Page.prototype.duplicate = function () {
        var object = this._object;
        var duplicate = object.copy();
        object.documentData().insertPage_afterPage(duplicate, object);
        return wrapNativeObject_1.wrapNativeObject(duplicate);
    };
    Page.prototype.remove = function () {
        this._object.documentData().removePages_detachInstances([this._object], true);
        return this;
    };
    Page.prototype.moveToFront = function () {
        // doesn't do anything
        return this;
    };
    Page.prototype.moveToBack = function () {
        // doesn't do anything
        return this;
    };
    Page.prototype.moveForward = function () {
        // doesn't do anything
        return this;
    };
    Page.prototype.moveBackward = function () {
        // doesn't do anything
        return this;
    };
    return Page;
}(Group_1.Group);
exports.Page = Page;
Page.type = enums_1.Types.Page;
Page[WrappedObject_1.DefinedPropertiesKey] = __assign({}, Group_1.Group[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Page, MSPage);
// override setting up a flow which doesn't make sense for a Page
delete Page[WrappedObject_1.DefinedPropertiesKey].flow;
delete Page[WrappedObject_1.DefinedPropertiesKey].style;
delete Page[WrappedObject_1.DefinedPropertiesKey].locked;
delete Page[WrappedObject_1.DefinedPropertiesKey].hidden;
// override setting up the parent as it's needs to a be a Document
Page.define('parent', {
    enumerable: false,
    exportable: false,
    get: function () {
        return wrapNativeObject_1.wrapNativeObject(this._object.documentData());
    },
    set: function (document) {
        document = wrapNativeObject_1.wrapObject(document); // eslint-disable-line
        if (this._object.documentData()) {
            this._object.documentData().removePages_detachInstances([this._object], false);
        }
        if (typeof document._object.addPage === 'function') {
            document._object.addPage(this._object);
        } else {
            document._object.documentData().addPage(this._object);
        }
    }
});
Page.define('index', {
    exportable: false,
    get: function () {
        var ourLayer = this._object;
        return parseInt(ourLayer.parentGroup().indexOfLayer_(ourLayer), 10);
    }
});
Page.define('selected', {
    get: function () {
        return this._object.documentData().currentPage() == this._object;
    },
    set: function (value) {
        if (value) {
            this._object.documentData().setCurrentPage(this._object);
        } else {
            // let's just select the first page, not sure what else we could do
            this._object.documentData().setCurrentPageIndex(0);
        }
    }
});
/**
 * The layers that the user has selected.
 *
 * @return {Selection} A selection object representing the layers that the user has selected.
 */
Page.define('selectedLayers', {
    enumerable: false,
    exportable: false,
    importable: false,
    get: function () {
        return new Selection_1.Selection(this);
    }
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var StyledLayer_1 = __webpack_require__(11);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var Rectangle_1 = __webpack_require__(6);
// TODO: set and modify path
/**
 * Represents a shape layer (a rectangle, oval, path, etc).
 */
var Shape = /** @class */function (_super) {
    __extends(Shape, _super);
    /**
     * Make a new shape object.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Shape(shape) {
        if (shape === void 0) {
            shape = {};
        }
        var _this = this;
        if (!shape.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            shape.sketchObject = Factory_1.Factory.createNative(Shape).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
            _this = _super.call(this, shape) || this;
            var frame = _this._object.frame();
            _this.sketchObject.addLayer(MSRectangleShape.alloc().initWithFrame(CGRectMake(0, 0, frame.width(), frame.height())));
        } else {
            _this = _super.call(this, shape) || this;
        }
        return _this;
    }
    return Shape;
}(StyledLayer_1.StyledLayer);
exports.Shape = Shape;
Shape.type = enums_1.Types.Shape;
Shape[WrappedObject_1.DefinedPropertiesKey] = __assign({}, StyledLayer_1.StyledLayer[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Shape, MSShapeGroup);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var StyledLayer_1 = __webpack_require__(11);
var ImageData_1 = __webpack_require__(26);
var Rectangle_1 = __webpack_require__(6);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var wrapNativeObject_1 = __webpack_require__(7);
/**
 * Represents an image layer.
 */
var Image = /** @class */function (_super) {
    __extends(Image, _super);
    /**
     * Make a new image layer object.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function Image(layer) {
        if (layer === void 0) {
            layer = {};
        }
        var _this = this;
        if (!layer.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            layer.sketchObject = Factory_1.Factory.createNative(Image).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
        }
        _this = _super.call(this, layer) || this;
        return _this;
    }
    return Image;
}(StyledLayer_1.StyledLayer);
exports.Image = Image;
Image.type = enums_1.Types.Image;
Image[WrappedObject_1.DefinedPropertiesKey] = __assign({}, StyledLayer_1.StyledLayer[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Image, MSBitmapLayer);
Image.define('image', {
    get: function () {
        return wrapNativeObject_1.wrapObject(this._object.image());
    },
    set: function (image) {
        var imageData = ImageData_1.ImageData.from(image);
        this._object.setImage(imageData.sketchObject);
    }
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var utils_1 = __webpack_require__(4);
/**
 * An MSImageData. This is not exposed, only used by Image
 */
var ImageData = /** @class */function (_super) {
    __extends(ImageData, _super);
    function ImageData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * can accept a wide range of input:
     * - a wrapped ImageData
     * - a native NSImage
     * - a native NSURL
     * - a native MSImageData
     * - a string: path to the file to load the image from
     * - an object with a `path` property: path to the file to load the image from
     * - an object with a `base64` string: a base64 encoded image
     */
    ImageData.from = function (image) {
        if (utils_1.isWrappedObject(image) && image.type === enums_1.Types.ImageData) {
            return image;
        }
        var nsImage;
        if (utils_1.isNativeObject(image)) {
            var className = String(image.class());
            if (className === 'NSImage') {
                nsImage = image;
            } else if (className === 'NSData') {
                nsImage = NSImage.alloc().initWithData(image);
            } else if (className === 'NSURL') {
                nsImage = NSImage.alloc().initWithContentsOfURL(image);
            } else if (className === 'MSImageData') {
                return ImageData.fromNative(image);
            } else {
                throw new Error("Cannot create an image from a " + className);
            }
        } else if (typeof image === 'string' || image && image.path) {
            nsImage = NSImage.alloc().initByReferencingFile(image.path || image);
        } else if (image && image.base64) {
            try {
                var data = NSData.alloc().initWithBase64EncodedString_options(image.base64, NSDataBase64DecodingIgnoreUnknownCharacters);
                nsImage = NSImage.alloc().initWithData(data);
            } catch (err) {
                throw new Error(err);
            }
        } else {
            throw new Error('`image` needs to be a string');
        }
        return ImageData.fromNative(MSImageData.alloc().initWithImage(nsImage));
    };
    return ImageData;
}(WrappedObject_1.WrappedObject);
exports.ImageData = ImageData;
ImageData.type = enums_1.Types.ImageData;
ImageData[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(ImageData, MSImageData);
// make it explicit that we will get a native object
ImageData.define('nsimage', {
    get: function () {
        return this._object.image();
    }
});
// make it explicit that we will get a native object
ImageData.define('nsdata', {
    get: function () {
        return this._object.data();
    }
});
ImageData.define('id', {
    exportable: true,
    importable: false,
    /**
     * Returns the object ID of the wrapped Sketch model object.
     *
     * @return {string} The id.
     */
    get: function () {
        return String(this._object.hash());
    }
});

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = function toArray(object) {
  if (Array.isArray(object)) {
    return object
  }
  var arr = []
  for (var j = 0; j < (object || []).length; j += 1) {
    arr.push(object[j])
  }
  return arr
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
// Global matchers object holds the list of available matchers and
// the state, that can hold matcher specific values that change over time.
var MATCHERS_OBJECT = {
    matchers: {},
    state: {
        assertionCalls: 0,
        expectedAssertionsNumber: null,
        isExpectingAssertions: false,
        suppressedErrors: [] // errors that are not thrown immediately.
    }
};
var getState = exports.getState = function () {
    return MATCHERS_OBJECT.state;
};
var setState = exports.setState = function (state) {
    Object.assign(MATCHERS_OBJECT.state, state);
};
var getMatchers = exports.getMatchers = function () {
    return MATCHERS_OBJECT.matchers;
};
var setMatchers = exports.setMatchers = function (matchers) {
    Object.assign(MATCHERS_OBJECT.matchers, matchers);
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, console) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

exports.callbackify = __webpack_require__(44)

var debugs = {};
var debugEnviron;
exports.debuglog = function debuglog(set) {
  if (isUndefined(debugEnviron) && typeof process != 'undefined') {
    debugEnviron = process && Object({"NODE_ENV":"development","API_VERSION":"2.0.0"}) && Object({"NODE_ENV":"development","API_VERSION":"2.0.0"}).NODE_DEBUG || '';
  }
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s: %s', set, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};

exports.deprecate = __webpack_require__(45);

var formatRegExp = /%[sdifjoO%]/g;
exports.format = function(f) {
  if (arguments.length <= 1) {
    return inspect(f)
  }
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%i': return Number(args[i++]);
      case '%f': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      case '%o': return inspect(args[i++], { showHidden: true, depth: 4, showProxy: true });
      case '%O': return inspect(args[i++]);
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  exports.inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  exports.inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = Object.assign({
    seen: [],
    indentationLvl: 0,
    stylize: stylizeNoColor
  }, inspect.defaultOptions, opts);

  // set default options
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  if (ctx.maxArrayLength === null) ctx.maxArrayLength = Infinity
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;

inspect.defaultOptions = {
  showHidden: false,
  depth: 2,
  colors: false,
  customInspect: true,
  showProxy: false,
  maxArrayLength: 100,
  breakLength: 60
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan', // only applied to function
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  'regexp': 'red'
};

inspect.custom = 'inspect'


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}

// getConstructorOf is wrapped into this to save iterations
function getIdentificationOf(obj) {
  var type = getNativeClass(obj)
  if (type) {
    return type
  }
  var original = obj;
  var constructor = undefined;

  while (obj) {
    if (constructor === undefined) {
      var desc = Object.getOwnPropertyDescriptor(obj, 'constructor');
      if (desc !== undefined &&
          typeof desc.value === 'function' &&
          desc.value.name !== '')
        constructor = desc.value.name;
    }

    if (constructor !== undefined)
      break;

    obj = Object.getPrototypeOf(obj);
  }

  return constructor;
}

function formatValue(ctx, value, recurseTimes, ln) {
  var primitive = formatPrimitive(ctx.stylize, value, ctx);
  if (primitive) {
    return primitive;
  }

  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value) {
    try {
      var customInspect = value[inspect.custom] // can fail for some NSDistantObject
      if (isFunction(customInspect) &&
        // Filter out the util module, it's inspect function is special
        customInspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
        var ret = customInspect(recurseTimes, ctx);

        // If the custom inspection method returned `this`, don't go into
        // infinite recursion.
        if (ret !== value) {
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
        }
        return ret;
      }
    } catch (err) {}
  }

  if (value && value._isWrappedObject) {
    value = value.toJSON()
  }

  var keys;

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } else {
    keys = Object.keys(value)
  }

  var keyLength = keys.length

  var constructor = getIdentificationOf(value);
  var prefix = constructor ? (constructor + ' ') : '';

  var base = '';
  var formatter = formatObject;
  var braces = ['{', '}'];
  var noIterator = true;
  var raw;

  if (isArray(value)) {
    noIterator = false
    // Only set the constructor for non ordinary ("Array [...]") arrays.
    braces = [(prefix === 'Array ' ? '' : prefix) + '[', ']'];
    if (value.length === 0 && keyLength === 0)
      return braces[0] + ']';
    formatter = formatArray;
  } else if (prefix === 'Object ') {
    // Object fast path
    if (keyLength === 0)
      return '{}';
  } else if (isFunction(value)) {
    var name = constructor + (value.name ? (': ' + value.name) : '');
    if (keyLength === 0)
      return ctx.stylize(`[${name}]`, 'special');
    base = '[' + name + ']';
  } else if (isRegExp(value)) {
    // Make RegExps say that they are RegExps
    if (keyLength === 0 || recurseTimes < 0)
      return ctx.stylize(value.toString(), 'regexp');
    base = RegExp.prototype.toString.call(value);
  } else if (isDate(value)) {
    if (keyLength === 0) {
      if (Number.isNaN(value.getTime()))
        return ctx.stylize(value.toString(), 'date');
      return ctx.stylize(value.toISOString(), 'date');
    }
    // Make dates with properties first say the date
    base = value.toISOString();
  } else if (isError(value)) {
    // Make error with message first say the error
    if (keyLength === 0)
      return formatError(value);
    base = `${formatError(value)}`;
  } else if (!isObject(value) && getNativeClass(value)) {
    var description = value && value.description && String(value.description())
    var nativeClass = getNativeClass(value)
    if (description && description[0] === '<' && description.indexOf('>') > 0) {
      // most of the MS* classes
      return ctx.stylize(description.slice(0, description.indexOf('>') + 1), 'special')
    } else if (description) {
      // prefix the description with the class otherwise it can lead to some misunderstanding
      return ctx.stylize('<' + nativeClass + '> ' + description, 'special')
    } else {
      return ctx.stylize('<' + getNativeClass(value) + '>', 'special')
    }
  } else  if (isObject(value) && getNativeClass(value)) {
    braces = [prefix + '{', '}'];
  }

  if (ctx.seen.indexOf(value) !== -1)
    return ctx.stylize('[Circular]', 'special')

  if (recurseTimes != null) {
    if (recurseTimes < 0)
      return ctx.stylize('[' + (constructor || 'Object') + ']', 'special');
    recurseTimes -= 1;
  }

  ctx.seen.push(value);

  var output = formatter(ctx, value, recurseTimes, keys);

  ctx.seen.pop();

  return reduceToSingleString(ctx, output, base, braces, ln);
}

function formatObject(ctx, value, recurseTimes, keys) {
  value = toObject(value)
  var len = keys.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++)
    output[i] = formatProperty(ctx, value, recurseTimes, keys[i], 0);
  return output;
}

function formatNumber(fn, value) {
  // Format -0 as '-0'. Checking `value === -0` won't distinguish 0 from -0.
  if (Object.is(value, -0))
    return fn('-0', 'number');
  return fn('' + value, 'number');
}

var MIN_LINE_LENGTH = 16;
var readableRegExps = {};

var strEscapeSequencesRegExp = /[\x00-\x1f\x27\x5c]/;
var strEscapeSequencesReplacer = /[\x00-\x1f\x27\x5c]/g;

// Escaped special characters. Use empty strings to fill up unused entries.
var meta = [
  '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004',
  '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t',
  '\\n', '\\u000b', '\\f', '\\r', '\\u000e',
  '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013',
  '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018',
  '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d',
  '\\u001e', '\\u001f', '', '', '',
  '', '', '', '', "\\'", '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '\\\\'
];

function escapeFn (str) { return meta[str.charCodeAt(0)] }

// Escape control characters, single quotes and the backslash.
// This is similar to JSON stringify escaping.
function strEscape(str) {
  // Some magic numbers that worked out fine while benchmarking with v8 6.0
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str))
    return '\'' + str + '\'';
  if (str.length > 100)
    return '\'' + str.replace(strEscapeSequencesReplacer, escapeFn) + '\'';
  var result = '';
  var last = 0;
  for (var i = 0; i < str.length; i++) {
    var point = str.charCodeAt(i);
    if (point === 39 || point === 92 || point < 32) {
      if (last === i) {
        result += meta[point];
      } else {
        result += str.slice(last, i) + meta[point];
      }
      last = i + 1;
    }
  }
  if (last === 0) {
    result = str;
  } else if (last !== i) {
    result += str.slice(last);
  }
  return '\'' + result + '\'';
}

function formatPrimitive(fn, value, ctx) {
  if (isUndefined(value)) {
    return fn('undefined', 'undefined');
  }
  if (isString(value)) {
    if (ctx.compact === false &&
      value.length > MIN_LINE_LENGTH &&
      ctx.indentationLvl + value.length > ctx.breakLength) {
      var minLineLength = Math.max(ctx.breakLength - ctx.indentationLvl, MIN_LINE_LENGTH);
      var averageLineLength = Math.ceil(value.length / Math.ceil(value.length / minLineLength));
      var divisor = Math.max(averageLineLength, MIN_LINE_LENGTH);
      var res = '';
      if (readableRegExps[divisor] === undefined) {
        // Build a new RegExp that naturally breaks text into multiple lines.
        //
        // Rules
        // 1. Greedy match all text up the max line length that ends with a
        //    whitespace or the end of the string.
        // 2. If none matches, non-greedy match any text up to a whitespace or
        //    the end of the string.
        //
        // eslint-disable-next-line max-len, node-core/no-unescaped-regexp-dot
        readableRegExps[divisor] = new RegExp(`(.|\\n){1,${divisor}}(\\s|$)|(\\n|.)+?(\\s|$)`, 'gm');
      }
      var indent = getIndentation(ctx.indentationLvl);
      var matches = value.match(readableRegExps[divisor]);
      if (matches.length > 1) {
        res += fn(strEscape(matches[0]), 'string') + ' +\n';
        for (var i = 1; i < matches.length - 1; i++) {
          res += indent + '  ' + fn(strEscape(matches[i]), 'string') + ' +\n';
        }
        res += indent + '  ' + fn(strEscape(matches[i]), 'string');
        return res;
      }
    }
    return fn(strEscape(value), 'string');
  }
  if (isNumber(value)) {
    return formatNumber(fn, Number(value));
  }
  if (isBoolean(value)) {
    return fn('' + value, 'boolean');
  }
  if (isNull(value)) {
    return fn('null', 'null');
  }
}


function formatError(value) {
  return value.stack || '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, keys) {
  value = toArray(value)
  var len = Math.min(Math.max(0, ctx.maxArrayLength), value.length);
  var hidden = ctx.showHidden ? 1 : 0;
  var valLen = value.length;

  var remaining = valLen - len;
  var output = new Array(len + (remaining > 0 ? 1 : 0) + hidden);
  for (var i = 0; i < len; i++)
    output[i] = formatProperty(ctx, value, recurseTimes, keys[i], 1);
  if (remaining > 0)
    output[i++] = '... ' + remaining + ' more item' + (remaining > 1 ? 's' : '');
  if (ctx.showHidden === true)
    output[i] = formatProperty(ctx, value, recurseTimes, 'length', 2);
  return output;
}

var keyStrRegExp = /^[a-zA-Z_][a-zA-Z_0-9]*$/;

function formatProperty(ctx, value, recurseTimes, key, array) {
  var name, str, desc;
  if (getNativeClass(value)) { // special case for native object
    desc = { value: value[key], enumerable: true }
  } else {
    desc = Object.getOwnPropertyDescriptor(value, key) ||
    { value: value[key], enumerable: true }
  }

  if (desc.value !== undefined) {
    var diff = array !== 0 || ctx.compact === false ? 2 : 3;
    ctx.indentationLvl += diff;
    str = formatValue(ctx, desc.value, recurseTimes, array === 0);
    ctx.indentationLvl -= diff;
  } else if (desc.get !== undefined) {
    if (desc.set !== undefined) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else if (desc.set !== undefined) {
    str = ctx.stylize('[Setter]', 'special');
  } else {
    str = ctx.stylize('undefined', 'undefined');
  }
  if (array === 1) {
    return str;
  }
  if (typeof key === 'symbol') {
    name = '[' + ctx.stylize(key.toString(), 'symbol') + ']';
  } else if (desc.enumerable === false) {
    name = '[' + key + ']';
  } else if (keyStrRegExp.test(key)) {
    name = ctx.stylize(key, 'name');
  } else {
    name = ctx.stylize(strEscape(key), 'string');
  }

  return name + ': ' + str;
}

var colorRegExp = /\u001b\[\d\d?m/g;

function removeColors(str) {
  return str.replace(colorRegExp, '');
}

function getIndentation(indentationLvl) {
  return Array.apply(null, Array(indentationLvl)).reduce(function(prev) { return prev + ' '}, '')
}

function reduceToSingleString(ctx, output, base, braces, addLn) {
  var breakLength = ctx.breakLength;
  var i = 0;
  if (ctx.compact === false) {
    var indentation = getIndentation(ctx.indentationLvl);
    var res = (base ? (base + ' ') : '') + braces[0] + '\n' + indentation + '  ';
    for (; i < output.length - 1; i++) {
      res += output[i] + ',\n' + indentation + '  ';
    }
    res += output[i] + '\n' + indentation + braces[1];
    return res;
  }
  if (output.length * 2 <= breakLength) {
    var length = 0;
    for (; i < output.length && length <= breakLength; i++) {
      if (ctx.colors) {
        length += removeColors(output[i]).length + 1;
      } else {
        length += output[i].length + 1;
      }
    }
    if (length <= breakLength)
      return braces[0] + (base ? (' ' + base) : '') + ' ' + output.join(', ') + ' ' +
        braces[1];
  }

  var indentation = getIndentation(ctx.indentationLvl);

  // If the opening "brace" is too large, like in the case of "Set {",
  // we need to force the first item to be on the next line or the
  // items will not line up correctly.
  var extraLn = addLn === true ? ('\n' + indentation) : '';

  var ln = base === '' && braces[0].length === 1 ?
    ' ' : ((base ? (' ' + base) : base) + '\n' + indentation + '  ');
  var str = output.join(',\n' + indentation + '  ');
  return extraLn + braces[0] + ln + str + ' ' + braces[1];
}

// check if the argument is a native sketch object
function getNativeClass(arg) {
  try {
    return arg && arg.isKindOfClass && typeof arg.class === 'function' && String(arg.class())
  } catch (err) {
    return undefined
  }
}


var assimilatedArrays = ['NSArray', 'NSMutableArray', '__NSArrayM', '__NSSingleObjectArrayI', '__NSArray0']
function isArray(ar) {
  if (Array.isArray(ar)) {
    return true
  }
  var type = getNativeClass(ar)
  return assimilatedArrays.indexOf(type) !== -1
}
exports.isArray = isArray;

function toArray(object) {
  if (Array.isArray(object)) {
    return object
  }
  var arr = []
  for (var j = 0; j < (object || []).length; j += 1) {
    arr.push(object[j])
  }
  return arr
}
exports.toArray = toArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

var assimilatedNumbers = ['__NSCFNumber', 'NSNumber']
function isNumber(arg) {
  if (typeof arg === 'number') {
    return true
  }
  var type = getNativeClass(arg)
  return assimilatedNumbers.indexOf(type) !== -1
}
exports.isNumber = isNumber;

var assimilatedStrings = ['NSString', '__NSCFString', 'NSTaggedPointerString', '__NSCFConstantString']
function isString(arg) {
  if (typeof arg === 'string') {
    return true
  }
  var type = getNativeClass(arg)
  return assimilatedStrings.indexOf(type) !== -1
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return typeof arg === 'undefined';
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

var assimilatedObjects = ['NSDictionary', '__NSDictionaryM', '__NSSingleEntryDictionaryI', '__NSDictionaryI', '__NSCFDictionary', 'MOStruct']
function isObject(arg) {
  var type = getNativeClass(arg)
  if (typeof arg === 'object' && arg !== null && !type) {
    return true
  }
  return assimilatedObjects.indexOf(type) !== -1
}
exports.isObject = isObject;

function toObject(obj) {
  if (typeof obj === 'object') {
    return obj
  }
  var type = getNativeClass(obj)
  if (type === 'MOStruct') {
    return obj.memberNames().reduce(function(prev, k) {
      prev[k] = value[k]
      return prev
    }, {})
  }
  return Object(obj)
}
exports.toObject = toObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return isNull(arg) ||
         isBoolean(arg) ||
         isNumber(arg) ||
         isString(arg) ||
         isSymbol(arg) ||
         isUndefined(arg);
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
};

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

exports.isDeepStrictEqual = __webpack_require__(46)

exports.promisify = __webpack_require__(47)

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(43), __webpack_require__(0)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console) {

var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Rectangle_1 = __webpack_require__(6);
var wrapNativeObject_1 = __webpack_require__(7);
var Flow_1 = __webpack_require__(21);
/**
 * Abstract class that represents a Sketch layer.
 */
var Layer = /** @class */function (_super) {
    __extends(Layer, _super);
    function Layer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Duplicate this layer.
     * A new identical layer will be inserted into the parent of this layer.
     *
     * @return {Layer} A new layer identical to this one.
     */
    Layer.prototype.duplicate = function () {
        var object = this._object;
        var duplicate = object.copy();
        object.parentGroup().insertLayers_afterLayer([duplicate], object);
        return wrapNativeObject_1.wrapNativeObject(duplicate);
    };
    /**
     * Remove this layer from its parent.
     */
    Layer.prototype.remove = function () {
        var parent = this._object.parentGroup();
        if (parent) {
            parent.removeLayer(this._object);
        }
        return this;
    };
    /**
     * Move this layer to the front of its container.
     */
    Layer.prototype.moveToFront = function () {
        MSLayerMovement.moveToFront([this._object]);
        return this;
    };
    /**
     * Move this layer forward in its container.
     */
    Layer.prototype.moveForward = function () {
        MSLayerMovement.moveForward([this._object]);
        return this;
    };
    /**
     * Move this layer to the back of its container.
     */
    Layer.prototype.moveToBack = function () {
        MSLayerMovement.moveToBack([this._object]);
        return this;
    };
    /**
     * Move this layer backwards in its container.
     */
    Layer.prototype.moveBackward = function () {
        MSLayerMovement.moveBackward([this._object]);
        return this;
    };
    // @deprecated
    Layer.prototype.localRectToPageRect = function (rect) {
        console.warn('Layer.layerRectToPageRect(rect) is deprecated. Use rect.changeBasis({ from: layer }) instead');
        return rect.changeBasis({
            from: this
        });
    };
    // @deprecated
    Layer.prototype.localRectToParentRect = function (rect) {
        console.warn('Layer.localRectToParentRect(rect) is deprecated. Use rect.changeBasis({ from: layer, to: layer.parent }) instead');
        return rect.changeBasis({
            from: this,
            to: this.parent
        });
    };
    return Layer;
}(WrappedObject_1.WrappedObject);
exports.Layer = Layer;
Layer[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
Layer.define('index', {
    exportable: false,
    /**
     * Return the index of this layer in it's container.
     * The layer at the back of the container (visually) will be layer 0. The layer at the front will be layer n - 1 (if there are n layers).
     *
     * @return {number} The layer order.
     */
    get: function () {
        var ourLayer = this._object;
        return parseInt(ourLayer.parentGroup().indexOfLayer_(ourLayer), 10);
    }
});
Layer.define('parent', {
    enumerable: false,
    exportable: false,
    /**
     * Return the parent container of this layer.
     *
     * @return {Group} The containing layer of this layer.
     */
    get: function () {
        return wrapNativeObject_1.wrapNativeObject(this._object.parentGroup());
    },
    set: function (layer) {
        if (this._object.parentGroup()) {
            this._object.removeFromParent();
        }
        layer = wrapNativeObject_1.wrapObject(layer); // eslint-disable-line
        if (!layer) {
            // we want to remove the layer from its parent
            // without adding it somewhere else right away
            return;
        }
        if (!layer._object || typeof layer._object.addLayers !== 'function') {
            throw new Error("This object cannot accept layers: " + layer);
        }
        layer._object.addLayers([this._object]);
    }
});
Layer.define('frame', {
    /**
     * The frame of the layer.
     * This is given in coordinates that are local to the parent of the layer.
     *
     * @return {Rectangle} The layer's frame.
     */
    get: function () {
        var f = this._object.frame();
        var rect = new Rectangle_1.Rectangle(f.x(), f.y(), f.width(), f.height());
        rect._parent = this;
        rect._parentKey = 'frame';
        return rect;
    },
    /**
     * Set the frame of the layer.
     * This will move and/or resize the layer as appropriate.
     * The new frame should be given in coordinates that are local to the parent of the layer.
     *
     * @param {Rectangle} frame - The new frame of the layer.
     */
    set: function (value) {
        var f = this._object.frame();
        f.setRect(NSMakeRect(value.x, value.y, value.width, value.height));
    }
});
Layer.define('name', {
    /**
     * The name of the layer.
     *
     * @return {string} The layer's name.
     */
    get: function () {
        return String(this._object.name());
    },
    /**
     * Set the name of the layer.
     *
     * @param {string} name The new name.
     */
    set: function (value) {
        this._object.setName(value);
    }
});
Layer.define('selected', {
    /**
     * Wether the layer is selected or not.
     *
     * @return {Boolean} selected.
     */
    get: function () {
        return !!this._object.isSelected();
    },
    set: function (value) {
        if (value) {
            this._object.select_byExtendingSelection(true, true);
        } else {
            this._object.select_byExtendingSelection(false, true);
        }
    }
});
Layer.define('flow', {
    get: function () {
        return wrapNativeObject_1.wrapObject(this._object.flow());
    },
    set: function (_flow) {
        var flow = Flow_1.Flow.from(_flow);
        this._object.flow = flow.sketchObject;
    }
});
Layer.define('hidden', {
    get: function () {
        return !this._object.isVisible();
    },
    set: function (hidden) {
        this._object.setIsVisible(!hidden);
    }
});
Layer.define('locked', {
    get: function () {
        return !!this._object.isLocked();
    },
    set: function (locked) {
        this._object.setIsLocked(locked);
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(4);
var Point = /** @class */function () {
    function Point(x, y) {
        utils_1.initProxyProperties(this);
        utils_1.proxyProperty(this, 'x', parseFloat(x));
        utils_1.proxyProperty(this, 'y', parseFloat(y));
        // if the argument is object
        if (typeof x === 'object' && typeof x.x === 'number') {
            this._x = parseFloat(x.x);
            this._y = parseFloat(x.y);
        }
    }
    Point.prototype.toJSON = function () {
        return {
            x: this._x,
            y: this._y
        };
    };
    return Point;
}();
exports.Point = Point;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = __webpack_require__(10);
var WrappedObject_1 = __webpack_require__(2);
var Gradient_1 = __webpack_require__(12);
var enums_1 = __webpack_require__(3);
exports.FillTypeMap = {
    Color: 0,
    Gradient: 1,
    Pattern: 4,
    Noise: 5
};
exports.FillType = {
    Color: 'Color',
    Gradient: 'Gradient',
    Pattern: 'Pattern',
    Noise: 'Noise',
    /* @deprecated */
    color: 'Color',
    gradient: 'Gradient',
    pattern: 'Pattern',
    noise: 'Noise'
};
var Fill = /** @class */function (_super) {
    __extends(Fill, _super);
    function Fill() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fill.toNative = function (value) {
        var fill = MSStyleFill.new();
        var color = typeof value === 'string' ? Color_1.Color.from(value) : Color_1.Color.from(value.color);
        var gradient = Gradient_1.Gradient.from(value.gradient);
        if (color) {
            fill.color = color._object;
        }
        if (gradient) {
            fill.gradient = gradient._object;
        }
        var fillType = exports.FillTypeMap[value.fillType];
        fill.fillType = typeof fillType !== 'undefined' ? fillType : value.fillType || exports.FillTypeMap.Color;
        if (typeof value.enabled === 'undefined') {
            fill.isEnabled = true;
        } else {
            fill.isEnabled = value.enabled;
        }
        return fill;
    };
    return Fill;
}(WrappedObject_1.WrappedObject);
exports.Fill = Fill;
Fill.type = enums_1.Types.Fill;
Fill[WrappedObject_1.DefinedPropertiesKey] = {};
Fill.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    get: function () {
        return this._object;
    }
});
Fill.define('fill', {
    get: function () {
        var _this = this;
        return Object.keys(exports.FillTypeMap).find(function (key) {
            return exports.FillTypeMap[key] === _this._object.fillType();
        }) || this._object.fillType();
    },
    set: function (fillType) {
        var fillTypeMapped = exports.FillTypeMap[fillType];
        this._object.fillType = typeof fillTypeMapped !== 'undefined' ? fillTypeMapped : fillType || exports.FillTypeMap.Color;
    }
});
Fill.define('color', {
    get: function () {
        return Color_1.colorToString(this._object.color());
    },
    set: function (_color) {
        var color = Color_1.Color.from(_color);
        this._object.color = color._object;
    }
});
Fill.define('gradient', {
    get: function () {
        return Gradient_1.Gradient.from(this._object.gradient());
    },
    set: function (_gradient) {
        var gradient = Gradient_1.Gradient.from(_gradient);
        this._object.gradient = gradient;
    }
});
Fill.define('enabled', {
    get: function () {
        return !!this._object.isEnabled();
    },
    set: function (enabled) {
        this._object.isEnabled = enabled;
    }
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(4);
var wrapNativeObject_1 = __webpack_require__(7);
/**
 * Represents the layers that the user has selected.
 */
var Selection = /** @class */function () {
    /**
     * Make a new Selection object.
     *
     * @param {Page} page The page that the selection relates to.
     */
    function Selection(page) {
        this._object = page._object;
    }
    Selection.prototype.forEach = function (fn) {
        return this.layers.forEach(fn);
    };
    Selection.prototype.map = function (fn) {
        return this.layers.map(fn);
    };
    Selection.prototype.reduce = function (fn, initial) {
        return this.layers.reduce(fn, initial);
    };
    Object.defineProperty(Selection.prototype, "layers", {
        /**
         * Return the wrapped Sketch layers in the selection.
         *
         * @return {array} The selected layers.
         * */
        get: function () {
            var layers = utils_1.toArray(this._object.selectedLayers().layers()).map(wrapNativeObject_1.wrapNativeObject);
            return layers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "length", {
        /**
         * Return the number of selected layers.
         *
         * @return {number} The number of layers that are selected.
         */
        get: function () {
            return this._object.selectedLayers().layers().count();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "isEmpty", {
        /**
         * Does the selection contain any layers?
         *
         * @return {boolean} true if the selection is empty.
         */
        get: function () {
            return this.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clear the selection.
     */
    Selection.prototype.clear = function () {
        this._object.changeSelectionBySelectingLayers(null);
        return this;
    };
    return Selection;
}();
exports.Selection = Selection;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Layer_1 = __webpack_require__(30);
var Rectangle_1 = __webpack_require__(6);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var wrapNativeObject_1 = __webpack_require__(7);
/**
 * A Sketch HotSpot.
 */
var HotSpot = /** @class */function (_super) {
    __extends(HotSpot, _super);
    /**
     * Make a new hotspot.
     *
     * @param [Object] properties - The properties to set on the object as a JSON object.
     *                              If `sketchObject` is provided, will wrap it.
     *                              Otherwise, creates a new native object.
     */
    function HotSpot(artboard) {
        if (artboard === void 0) {
            artboard = {};
        }
        var _this = this;
        if (!artboard.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            artboard.sketchObject = Factory_1.Factory.createNative(HotSpot).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
        }
        _this = _super.call(this, artboard) || this;
        return _this;
    }
    HotSpot.fromLayer = function (layer) {
        var wrappedObject = wrapNativeObject_1.wrapObject(layer);
        if (!wrappedObject || !wrappedObject.flow || !wrappedObject.flow.targetId) {
            throw new Error('Can only create a HotSpot from a layer with an existing flow');
        }
        return new HotSpot({
            sketchObject: MSHotspotLayer.hotspotLayerFromLayer(wrappedObject.sketchObject)
        });
    };
    return HotSpot;
}(Layer_1.Layer);
exports.HotSpot = HotSpot;
HotSpot.type = enums_1.Types.HotSpot;
HotSpot[WrappedObject_1.DefinedPropertiesKey] = __assign({}, Layer_1.Layer[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(HotSpot, MSHotspotLayer);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise, expect) {
/* ⛔⚠️ THIS IS A GENERATED FILE. DO NOT MODIFY THIS ⛔⚠️ */
/* globals MSDocumentData, log, expect, coscript */

var prepareStackTrace = __webpack_require__(20);
var sketch = __webpack_require__(51); // eslint-disable-line
function SerialPromise(promises) {
    return promises.reduce(function (prev, p) {
        return prev.then(function () {
            return p();
        });
    }, Promise.resolve());
}
module.exports = function runTests(context) {
    var testResults = [];
    var testSuites = {
        suites: {}
    };
    try {
        testSuites.suites["async"] = __webpack_require__(52);
    } catch (err) {
        testResults.push({
            name: "async",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Rectangle"] = __webpack_require__(54);
    } catch (err) {
        testResults.push({
            name: "Rectangle",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Selection"] = __webpack_require__(60);
    } catch (err) {
        testResults.push({
            name: "Selection",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["WrappedObject"] = __webpack_require__(61);
    } catch (err) {
        testResults.push({
            name: "WrappedObject",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Artboard"] = __webpack_require__(62);
    } catch (err) {
        testResults.push({
            name: "Artboard",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Document"] = __webpack_require__(63);
    } catch (err) {
        testResults.push({
            name: "Document",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Flow"] = __webpack_require__(64);
    } catch (err) {
        testResults.push({
            name: "Flow",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Group"] = __webpack_require__(65);
    } catch (err) {
        testResults.push({
            name: "Group",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["HotSpot"] = __webpack_require__(66);
    } catch (err) {
        testResults.push({
            name: "HotSpot",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Image"] = __webpack_require__(67);
    } catch (err) {
        testResults.push({
            name: "Image",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["ImageData"] = __webpack_require__(68);
    } catch (err) {
        testResults.push({
            name: "ImageData",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["ImportableObject"] = __webpack_require__(69);
    } catch (err) {
        testResults.push({
            name: "ImportableObject",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Layer"] = __webpack_require__(76);
    } catch (err) {
        testResults.push({
            name: "Layer",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Library"] = __webpack_require__(77);
    } catch (err) {
        testResults.push({
            name: "Library",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Override"] = __webpack_require__(78);
    } catch (err) {
        testResults.push({
            name: "Override",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Page"] = __webpack_require__(79);
    } catch (err) {
        testResults.push({
            name: "Page",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Shape"] = __webpack_require__(80);
    } catch (err) {
        testResults.push({
            name: "Shape",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["SymbolInstance"] = __webpack_require__(81);
    } catch (err) {
        testResults.push({
            name: "SymbolInstance",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["SymbolMaster"] = __webpack_require__(82);
    } catch (err) {
        testResults.push({
            name: "SymbolMaster",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Text"] = __webpack_require__(83);
    } catch (err) {
        testResults.push({
            name: "Text",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Blur"] = __webpack_require__(84);
    } catch (err) {
        testResults.push({
            name: "Blur",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Border"] = __webpack_require__(85);
    } catch (err) {
        testResults.push({
            name: "Border",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["BorderOptions"] = __webpack_require__(86);
    } catch (err) {
        testResults.push({
            name: "BorderOptions",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Color"] = __webpack_require__(87);
    } catch (err) {
        testResults.push({
            name: "Color",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Fill"] = __webpack_require__(88);
    } catch (err) {
        testResults.push({
            name: "Fill",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Gradient"] = __webpack_require__(89);
    } catch (err) {
        testResults.push({
            name: "Gradient",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["GradientStop"] = __webpack_require__(90);
    } catch (err) {
        testResults.push({
            name: "GradientStop",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Shadow"] = __webpack_require__(91);
    } catch (err) {
        testResults.push({
            name: "Shadow",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Style"] = __webpack_require__(92);
    } catch (err) {
        testResults.push({
            name: "Style",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    try {
        testSuites.suites["Settings"] = __webpack_require__(93);
    } catch (err) {
        testResults.push({
            name: "Settings",
            type: 'failed',
            exec: true,
            reason: {
                message: err.message,
                name: err.name,
                stack: prepareStackTrace(err.stack)
            }
        });
    }
    /**
     * Run a collection of tests.
     *
     * The method takes a dictionary describing the tests to run.
     * The dictionary can contain two keys:
     * - suites: this is a dictionary of sub-collections, each of which is recursively run by calling this method again.
     * - tests: this is a dictionary of test functions, each of which is executed.
     *
     * The test functions are passed this tester object when they are executed, and should use the assertion methods on it
     * to perform tests.
     *
     * @param {dictionary} specification A dictionary describing the tests to run. See discussion.
     * @param {string} suiteName The name of the suite, if we're running a sub-collection. This will be null for the top level tests.
     * @return {dictionary} Returns a dictionary indicating how many tests ran, and a list of the passed, failed, and crashed tests.
     */
    function runUnitTests(specification, suiteName) {
        if (specification === void 0) {
            specification = {};
        }
        if (suiteName === void 0) {
            suiteName = '';
        }
        var _a = specification.suites,
            suites = _a === void 0 ? {} : _a,
            _b = specification.logs,
            logs = _b === void 0 ? [] : _b,
            _c = specification.tests,
            tests = _c === void 0 ? {} : _c,
            skipped = specification.skipped,
            only = specification.only,
            _d = specification.ancestorSuites,
            ancestorSuites = _d === void 0 ? [] : _d;
        // if there are suites with `only`
        var suiteContainsOnly = Object.keys(suites).some(function (name) {
            return suites[name].only;
        });
        return SerialPromise(Object.keys(suites).map(function (suite) {
            if (suiteName) {
                suites[suite].ancestorSuites = ancestorSuites.concat([suiteName]);
            }
            if (logs && !suites[suite].logs) {
                suites[suite].logs = logs;
            }
            if (skipped) {
                suites[suite].skipped = true;
                return function () {
                    return Promise.resolve();
                };
            }
            if (suiteContainsOnly && !suites[suite].only) {
                return function () {
                    return Promise.resolve();
                };
            }
            if (only) {
                suites[suite].only = true;
            }
            return function () {
                return runUnitTests(suites[suite], suite);
            };
        })).then(function () {
            // if there are tests with `only`
            var containsOnly = Object.keys(tests).some(function (name) {
                return tests[name].only;
            });
            return SerialPromise(Object.keys(tests).map(function (name, i) {
                var test = tests[name];
                if (containsOnly && !test.only) {
                    // there are tests with `only` and it's not this one so skip
                    return function () {
                        return Promise.resolve();
                    };
                }
                if (only) {
                    test.only = true;
                }
                if (suiteName) {
                    test.ancestorSuites = ancestorSuites.concat([suiteName]);
                }
                if (skipped || test.skipped) {
                    testResults.push({
                        name: name,
                        type: 'skipped',
                        only: test.only,
                        ancestorSuites: test.ancestorSuites,
                        logs: i === 0 ? logs : []
                    });
                    return function () {
                        return Promise.resolve();
                    };
                }
                return function () {
                    return Promise.resolve().then(function () {
                        expect.resetAssertionsLocalState();
                        return test(context, sketch.fromNative(MSDocumentData.new()));
                    }).then(function () {
                        var assertionError = expect.extractExpectedAssertionsErrors();
                        if (assertionError) {
                            throw assertionError.error;
                        }
                    }).then(function () {
                        testResults.push({
                            name: name,
                            type: 'passed',
                            only: test.only,
                            ancestorSuites: test.ancestorSuites,
                            logs: i === 0 ? logs : []
                        });
                    }).catch(function (err) {
                        var testFailure;
                        if (err instanceof Error) {
                            testFailure = {
                                message: err.message,
                                name: err.name,
                                stack: prepareStackTrace(err.stack)
                            };
                            if (err.actual) {
                                testFailure.actual = err.actual;
                                testFailure.expected = err.expected;
                                testFailure.operator = err.operator;
                            }
                        } else if (err.reason && err.name) {
                            testFailure = {
                                message: String(err.reason()),
                                name: String(err.name())
                            };
                        } else {
                            testFailure = err;
                        }
                        testResults.push({
                            name: name,
                            only: test.only,
                            type: 'failed',
                            reason: testFailure,
                            ancestorSuites: test.ancestorSuites,
                            logs: i === 0 ? logs : []
                        });
                    });
                };
            }));
        }).then(function () {
            return testResults;
        });
    }
    var fiber = sketch.Async.createFiber();
    runUnitTests(testSuites).then(function (results) {
        if (results.some(function (t) {
            return t.only;
        })) {
            results = results.filter(function (t) {
                return t.only;
            }); // eslint-disable-line
        }
        log(results.length + " tests ran.");
        log(results.filter(function (t) {
            return t.type === 'passed';
        }).length + " tests succeeded.");
        log(results.filter(function (t) {
            return t.type === 'failed';
        }).length + " tests failed.");
        log("json results: " + JSON.stringify(results));
        fiber.cleanup();
        coscript.cleanupFibers(); // cleanup all the fibers to avoid getting stuck
    }).catch(function (err) {
        coscript.cleanupFibers(); // cleanup all the fibers to avoid getting stuck
        throw err;
    });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19), __webpack_require__(1)["default"]))

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = function () {
  return typeof coscript !== 'undefined' && coscript.createFiber
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var timeout = __webpack_require__(16)

function setImmediate(func, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  return timeout.setTimeout(func, 0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
}

function clearImmediate(id) {
  return timeout.clearTimeout(id)
}

module.exports = {
  setImmediate: setImmediate,
  clearImmediate: clearImmediate
}


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var prepareValue = __webpack_require__(39)

module.exports.toArray = __webpack_require__(27)
module.exports.prepareStackTrace = __webpack_require__(20)
module.exports.prepareValue = prepareValue
module.exports.prepareObject = prepareValue.prepareObject
module.exports.prepareArray = prepareValue.prepareArray


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var prepareStackTrace = __webpack_require__(20)
var toArray = __webpack_require__(27)

function prepareArray(array, options) {
  return array.map(function(i) {
    return prepareValue(i, options)
  })
}

function prepareObject(object, options) {
  const deep = {}
  Object.keys(object).forEach(function(key) {
    deep[key] = prepareValue(object[key], options)
  })
  return deep
}

function getName(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.name()),
  }
}

function getSelector(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.selector()),
  }
}

function introspectMochaObject(value, options) {
  options = options || {}
  var mocha = value.class().mocha()
  var introspection = {
    properties: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['properties' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getName),
    },
    classMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['classMethods' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getSelector),
    },
    instanceMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['instanceMethods' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getSelector),
    },
    protocols: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['protocols' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getName),
    },
  }
  if (mocha.treeAsDictionary && options.withTree) {
    introspection.treeAsDictionary = {
      type: 'Object',
      primitive: 'Object',
      value: prepareObject(mocha.treeAsDictionary())
    }
  }
  return introspection
}

function prepareValue(value, options) {
  var type = 'String'
  var primitive = 'String'
  const typeOf = typeof value
  if (value instanceof Error) {
    type = 'Error'
    primitive = 'Error'
    value = {
      message: value.message,
      name: value.name,
      stack: prepareStackTrace(value.stack),
    }
  } else if (Array.isArray(value)) {
    type = 'Array'
    primitive = 'Array'
    value = prepareArray(value, options)
  } else if (value === null || value === undefined || Number.isNaN(value)) {
    type = 'Empty'
    primitive = 'Empty'
    value = String(value)
  } else if (typeOf === 'object') {
    if (value.isKindOfClass && typeof value.class === 'function') {
      type = String(value.class())
      // TODO: Here could come some meta data saved as value
      if (
        type === 'NSDictionary' ||
        type === '__NSDictionaryM' ||
        type === '__NSSingleEntryDictionaryI' ||
        type === '__NSDictionaryI' ||
        type === '__NSCFDictionary'
      ) {
        primitive = 'Object'
        value = prepareObject(Object(value), options)
      } else if (
        type === 'NSArray' ||
        type === 'NSMutableArray' ||
        type === '__NSArrayM' ||
        type === '__NSSingleObjectArrayI' ||
        type === '__NSArray0'
      ) {
        primitive = 'Array'
        value = prepareArray(toArray(value), options)
      } else if (
        type === 'NSString' ||
        type === '__NSCFString' ||
        type === 'NSTaggedPointerString' ||
        type === '__NSCFConstantString'
      ) {
        primitive = 'String'
        value = String(value)
      } else if (type === '__NSCFNumber' || type === 'NSNumber') {
        primitive = 'Number'
        value = 0 + value
      } else if (type === 'MOStruct') {
        type = String(value.name())
        primitive = 'Object'
        value = value.memberNames().reduce(function(prev, k) {
          prev[k] = prepareValue(value[k], options)
          return prev
        }, {})
      } else if (value.class().mocha) {
        primitive = 'Mocha'
        value = (options || {}).skipMocha ? type : introspectMochaObject(value, options)
      } else {
        primitive = 'Unknown'
        value = type
      }
    } else {
      type = 'Object'
      primitive = 'Object'
      value = prepareObject(value, options)
    }
  } else if (typeOf === 'function') {
    type = 'Function'
    primitive = 'Function'
    value = String(value)
  } else if (value === true || value === false) {
    type = 'Boolean'
    primitive = 'Boolean'
  } else if (typeOf === 'number') {
    primitive = 'Number'
    type = 'Number'
  }

  return {
    value,
    type,
    primitive,
  }
}

module.exports = prepareValue
module.exports.prepareObject = prepareObject
module.exports.prepareArray = prepareArray


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var remoteWebview = __webpack_require__(41)

module.exports.identifier = 'skpm.debugger'

module.exports.isDebuggerPresent = remoteWebview.isWebviewPresent.bind(
  this,
  module.exports.identifier
)

module.exports.sendToDebugger = function sendToDebugger(name, payload) {
  return remoteWebview.sendToWebview(
    module.exports.identifier,
    'sketchBridge(' +
      JSON.stringify({
        name: name,
        payload: payload,
      }) +
      ');'
  )
}


/***/ }),
/* 41 */
/***/ (function(module, exports) {

/* globals NSThread */

var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.isWebviewPresent = function isWebviewPresent (identifier) {
  return !!threadDictionary[identifier]
}

module.exports.sendToWebview = function sendToWebview (identifier, evalString) {
  if (!module.exports.isWebviewPresent(identifier)) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  var webview = threadDictionary[identifier]
    .contentView()
    .subviews()
  webview = webview[webview.length - 1]

  return webview.stringByEvaluatingJavaScriptFromString(evalString)
}


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports.SET_TREE = 'elements/SET_TREE'
module.exports.SET_PAGE_METADATA = 'elements/SET_PAGE_METADATA'
module.exports.SET_LAYER_METADATA = 'elements/SET_LAYER_METADATA'
module.exports.ADD_LOG = 'logs/ADD_LOG'
module.exports.CLEAR_LOGS = 'logs/CLEAR_LOGS'
module.exports.GROUP = 'logs/GROUP'
module.exports.GROUP_END = 'logs/GROUP_END'
module.exports.TIMER_START = 'logs/TIMER_START'
module.exports.TIMER_END = 'logs/TIMER_END'
module.exports.ADD_REQUEST = 'network/ADD_REQUEST'
module.exports.SET_RESPONSE = 'network/SET_RESPONSE'
module.exports.ADD_ACTION = 'actions/ADD_ACTION'
module.exports.SET_SCRIPT_RESULT = 'playground/SET_SCRIPT_RESULT'


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setTimeout, clearTimeout) {// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)["setTimeout"], __webpack_require__(16)["clearTimeout"]))

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = function callbackify(original) {
  return function(callback) {
    original().then(function (result) {
      callback(null, result)
    }).catch(function (err) {
      if (err === null) {
        err = new Error()
        err.reason = null
      }
      callback(err)
    })
  }
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
module.exports = function deprecate(fn, msg) {
  var warned = false;
  function deprecated() {
    if (!warned) {
      console.error(msg);
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 46 */
/***/ (function(module, exports) {

/*
Copyright (c) 2008-2016 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/* eslint-disable */

function iterableEquality(a, b) {
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    Array.isArray(a) ||
    Array.isArray(b)
  ) {
    return undefined
  }
  if (a && b && a.constructor !== b.constructor) {
    // check if the object are natives and then shallow equal them
    return a.sketchObject && b.sketchObject && a.sketchObject == b.sketchObject
  }

  if (a.size !== undefined) {
    if (a.size !== b.size) {
      return false
    } else if (isA('Set', a)) {
      var allFound = true
      for (var aValue of a) {
        if (!b.has(aValue)) {
          allFound = false
          break
        }
      }
      if (allFound) {
        return true
      }
    } else if (isA('Map', a)) {
      var allFound = true
      for (var aEntry of a) {
        if (
          !b.has(aEntry[0]) ||
          !equals(aEntry[1], b.get(aEntry[0]), [iterableEquality])
        ) {
          allFound = false
          break
        }
      }
      if (allFound) {
        return true
      }
    }
  }

  if (Object.keys(a).length !== Object.keys(a).length) {
    return false
  }

  var aKeys = Object.keys(a).sort()
  var bKeys = Object.keys(b).sort()

  for (var i = 0; i < aKeys.length; i += 1) {
    var aKey = aKeys[i]
    var bKey = bKeys[i]
    if (aKey !== bKey || !equals(a[aKey], b[bKey], [iterableEquality])) {
      return false
    }
  }

  return true
}

function isObjectWithKeys(a) {
  return (
    a !== null &&
    typeof a === 'object' &&
    !(a instanceof Error) &&
    !(a instanceof Array) &&
    !(a instanceof Date)
  )
}

function subsetEquality(object, subset) {
  if (!isObjectWithKeys(object) || !isObjectWithKeys(subset)) {
    return undefined
  }

  return Object.keys(subset).every(function (key) {
    return hasOwnProperty(object, key) &&
      equals(object[key], subset[key], [iterableEquality, subsetEquality])
  })
}

// Extracted out of jasmine 2.5.2
function equals(a, b, customTesters) {
  customTesters = customTesters || [iterableEquality]
  return eq(a, b, [], [], customTesters)
}

function isAsymmetric(obj) {
  return obj && isA('Function', obj.asymmetricMatch)
}

function asymmetricMatch(a, b) {
  var asymmetricA = isAsymmetric(a),
    asymmetricB = isAsymmetric(b)

  if (asymmetricA && asymmetricB) {
    return undefined
  }

  if (asymmetricA) {
    return a.asymmetricMatch(b)
  }

  if (asymmetricB) {
    return b.asymmetricMatch(a)
  }
}

// Equality function lovingly adapted from isEqual in
//   [Underscore](http://underscorejs.org)
function eq(a, b, aStack, bStack, customTesters) {
  var result = true

  var asymmetricResult = asymmetricMatch(a, b)
  if (asymmetricResult !== undefined) {
    return asymmetricResult
  }

  for (var i = 0; i < customTesters.length; i++) {
    var customTesterResult = customTesters[i](a, b)
    if (customTesterResult !== undefined) {
      return customTesterResult
    }
  }

  if (a instanceof Error && b instanceof Error) {
    return a.message == b.message
  }

  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) {
    return a !== 0 || 1 / a == 1 / b
  }
  // A strict comparison is necessary because `null == undefined`.
  if (a === null || b === null) {
    return a === b
  }
  var className = Object.prototype.toString.call(a)
  if (className != Object.prototype.toString.call(b)) {
    return false
  }
  switch (className) {
    // Strings, numbers, dates, and booleans are compared by value.
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return a == String(b)
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
      // other numeric values.
      return a != +a ? b != +b : a === 0 ? 1 / a == 1 / b : a == +b
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a == +b
    // RegExps are compared by their source patterns and flags.
    case '[object RegExp]':
      return (
        a.source == b.source &&
        a.global == b.global &&
        a.multiline == b.multiline &&
        a.ignoreCase == b.ignoreCase
      )
  }
  if (typeof a != 'object' || typeof b != 'object') {
    return false
  }

  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  var length = aStack.length
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] == a) {
      return bStack[length] == b
    }
  }
  // Add the first object to the stack of traversed objects.
  aStack.push(a)
  bStack.push(b)
  var size = 0
  // Recursively compare objects and arrays.
  // Compare array lengths to determine if a deep comparison is necessary.
  if (className == '[object Array]') {
    size = a.length
    if (size !== b.length) {
      return false
    }

    while (size--) {
      result = eq(a[size], b[size], aStack, bStack, customTesters)
      if (!result) {
        return false
      }
    }
  }

  // Deep compare objects.
  var aKeys = keys(a, className == '[object Array]'),
    key
  size = aKeys.length

  // Ensure that both objects contain the same number of properties before comparing deep equality.
  if (keys(b, className == '[object Array]').length !== size) {
    return false
  }

  while (size--) {
    key = aKeys[size]

    // Deep compare each member
    result = has(b, key) && eq(a[key], b[key], aStack, bStack, customTesters)

    if (!result) {
      return false
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop()
  bStack.pop()

  return result
}

function keys(obj, isArray) {
  var allKeys = (function(o) {
    var keys = []
    for (var key in o) {
      if (has(o, key)) {
        keys.push(key)
      }
    }
    return keys.concat(Object.getOwnPropertySymbols(o))
  })(obj)

  if (!isArray) {
    return allKeys
  }

  var extraKeys = []
  if (allKeys.length === 0) {
    return allKeys
  }

  for (var x = 0; x < allKeys.length; x++) {
    if (!allKeys[x].match(/^[0-9]+$/)) {
      extraKeys.push(allKeys[x])
    }
  }

  return extraKeys
}

function has(obj, key) {
  return (
    Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined
  )
}

function isA(typeName, value) {
  return Object.prototype.toString.apply(value) === '[object ' + typeName + ']'
}

module.exports = equals
module.exports.iterableEquality = iterableEquality
module.exports.subsetEquality = subsetEquality


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {var customPromisify = 'promisify'

function promisify(fn) {
  if (fn[customPromisify]) {
    return fn[customPromisify]
  }
  return function () {
    var args = toArray(arguments)
    return new Promise(function (resolve, reject) {
      args.push(function (err, value) {
        if (typeof err !== 'undefined' && err !== null) {
          return reject(err)
        }
        return resolve(value)
      })
      fn.apply(this, args)
    })
  }
}
promisify.custom = customPromisify

module.exports = promisify

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var _util = __webpack_require__(29);
var _utils = __webpack_require__(17);
/* eslint-disable prefer-template, no-restricted-properties, no-void, eqeqeq, no-nested-ternary */
var escapeStrForRegex = function (string) {
    return string.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
};
var getPath = function (object, propertyPath) {
    if (!Array.isArray(propertyPath)) {
        propertyPath = propertyPath.split('.'); // eslint-disable-line
    }
    var lastProp = propertyPath.length === 1;
    if (propertyPath.length) {
        var prop = propertyPath[0];
        var newObject = object[prop];
        if (!lastProp && (newObject === null || newObject === undefined)) {
            // This is not the last prop in the chain. If we keep recursing it will
            // hit a `can't access property X of undefined | null`. At this point we
            // know that the chain broken and we return right away.
            return {
                hasEndProp: false,
                lastTraversedObject: object,
                traversedPath: []
            };
        }
        var result = getPath(newObject, propertyPath.slice(1));
        result.lastTraversedObject || (result.lastTraversedObject = object);
        result.traversedPath.unshift(prop);
        if (propertyPath.length === 1) {
            result.hasEndProp = hasOwnProperty(object, prop);
            if (!result.hasEndProp) {
                delete result.value;
                result.traversedPath.shift();
            }
        }
        return result;
    }
    return {
        lastTraversedObject: null,
        traversedPath: [],
        value: object
    };
};
var matchers = {
    toBe: function (received, expected) {
        var pass = Object.is(received, expected);
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBe') + '\n\n' + "Expected value to not be (using Object.is):\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(received));
        } : function () {
            var suggestToEqual = (0, _utils.getType)(received) === (0, _utils.getType)(expected) && ((0, _utils.getType)(received) === 'object' || (0, _utils.getType)(expected) === 'array' || (0, _utils.getType)(expected) === 'sketch-native') && (0, _util.isDeepStrictEqual)(received, expected, [_util.isDeepStrictEqual.iterableEquality]);
            return (0, _utils.matcherHint)('.toBe') + '\n\n' + "Expected value to be (using Object.is):\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(received)) + (suggestToEqual ? "\n\n" + _utils.SUGGEST_TO_EQUAL + "\n" : '');
        };
        // Passing the the actual and expected objects so that a custom reporter
        // could access them, for example in order to display a custom visual diff,
        // or create a different error message
        return { actual: received, expected: expected, message: message, name: 'toBe', pass: pass };
    },
    toBeCloseTo: function (actual, expected, precision) {
        if (precision === void 0) {
            precision = 2;
        }
        (0, _utils.ensureNumbers)(actual, expected, '.toBeCloseTo');
        var pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeCloseTo', 'received', 'expected, precision') + '\n\n' + ("Expected value not to be close to (with " + (0, _utils.printExpected)(precision) + "-digit precision):\n") + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeCloseTo', 'received', 'expected, precision') + '\n\n' + ("Expected value to be close to (with " + (0, _utils.printExpected)(precision) + "-digit precision):\n") + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeDefined: function (actual, expected) {
        (0, _utils.ensureNoExpected)(expected, '.toBeDefined');
        var pass = actual !== void 0;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeDefined', 'received', '') + '\n\n' + "Expected value not to be defined, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeDefined', 'received', '') + '\n\n' + "Expected value to be defined, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeFalsy: function (actual, expected) {
        (0, _utils.ensureNoExpected)(expected, '.toBeFalsy');
        var pass = !actual;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeFalsy', 'received', '') + '\n\n' + "Expected value not to be falsy, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeFalsy', 'received', '') + '\n\n' + "Expected value to be falsy, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeGreaterThan: function (actual, expected) {
        (0, _utils.ensureNumbers)(actual, expected, '.toBeGreaterThan');
        var pass = actual > expected;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeGreaterThan') + '\n\n' + "Expected value not to be greater than:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeGreaterThan') + '\n\n' + "Expected value to be greater than:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeGreaterThanOrEqual: function (actual, expected) {
        (0, _utils.ensureNumbers)(actual, expected, '.toBeGreaterThanOrEqual');
        var pass = actual >= expected;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeGreaterThanOrEqual') + '\n\n' + "Expected value not to be greater than or equal:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeGreaterThanOrEqual') + '\n\n' + "Expected value to be greater than or equal:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeLessThan: function (actual, expected) {
        (0, _utils.ensureNumbers)(actual, expected, '.toBeLessThan');
        var pass = actual < expected;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeLessThan') + '\n\n' + "Expected value not to be less than:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeLessThan') + '\n\n' + "Expected value to be less than:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeLessThanOrEqual: function (actual, expected) {
        (0, _utils.ensureNumbers)(actual, expected, '.toBeLessThanOrEqual');
        var pass = actual <= expected;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeLessThanOrEqual') + '\n\n' + "Expected value not to be less than or equal:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeLessThanOrEqual') + '\n\n' + "Expected value to be less than or equal:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeNaN: function (actual, expected) {
        (0, _utils.ensureNoExpected)(expected, '.toBeNaN');
        var pass = Number.isNaN(actual);
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeNaN', 'received', '') + '\n\n' + "Expected value not to be NaN, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeNaN', 'received', '') + '\n\n' + "Expected value to be NaN, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeNull: function (actual, expected) {
        (0, _utils.ensureNoExpected)(expected, '.toBeNull');
        var pass = actual === null;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeNull', 'received', '') + '\n\n' + "Expected value not to be null, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeNull', 'received', '') + '\n\n' + "Expected value to be null, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeTruthy: function (actual, expected) {
        (0, _utils.ensureNoExpected)(expected, '.toBeTruthy');
        var pass = !!actual;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeTruthy', 'received', '') + '\n\n' + "Expected value not to be truthy, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeTruthy', 'received', '') + '\n\n' + "Expected value to be truthy, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toBeUndefined: function (actual, expected) {
        (0, _utils.ensureNoExpected)(expected, '.toBeUndefined');
        var pass = actual === void 0;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeUndefined', 'received', '') + '\n\n' + "Expected value not to be undefined, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        } : function () {
            return (0, _utils.matcherHint)('.toBeUndefined', 'received', '') + '\n\n' + "Expected value to be undefined, instead received\n" + ("  " + (0, _utils.printReceived)(actual));
        };
        return { message: message, pass: pass };
    },
    toContain: function (collection, value) {
        var collectionType = (0, _utils.getType)(collection);
        var converted = null;
        if (Array.isArray(collection) || typeof collection === 'string') {
            // strings have `indexOf` so we don't need to convert
            // arrays have `indexOf` and we don't want to make a copy
            converted = collection;
        } else {
            try {
                converted = Array.from(collection);
            } catch (e) {
                throw new Error((0, _utils.matcherHint)('[.not].toContainEqual', 'collection', 'value') + '\n\n' + ("Expected " + (0, _utils.RECEIVED_COLOR)('collection') + " to be an array-like structure.\n") + (0, _utils.printWithType)('Received', collection, _utils.printReceived));
            }
        }
        // At this point, we're either a string or an Array,
        // which was converted from an array-like structure.
        var pass = converted.indexOf(value) != -1;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toContain', collectionType, 'value') + '\n\n' + ("Expected " + collectionType + ":\n") + ("  " + (0, _utils.printReceived)(collection) + "\n") + "Not to contain value:\n" + ("  " + (0, _utils.printExpected)(value) + "\n");
        } : function () {
            return (0, _utils.matcherHint)('.toContain', collectionType, 'value') + '\n\n' + ("Expected " + collectionType + ":\n") + ("  " + (0, _utils.printReceived)(collection) + "\n") + "To contain value:\n" + ("  " + (0, _utils.printExpected)(value));
        };
        return { message: message, pass: pass };
    },
    toContainEqual: function (collection, value) {
        var collectionType = (0, _utils.getType)(collection);
        var converted = null;
        if (Array.isArray(collection)) {
            converted = collection;
        } else {
            try {
                converted = Array.from(collection);
            } catch (e) {
                throw new Error((0, _utils.matcherHint)('[.not].toContainEqual', 'collection', 'value') + '\n\n' + ("Expected " + (0, _utils.RECEIVED_COLOR)('collection') + " to be an array-like structure.\n") + (0, _utils.printWithType)('Received', collection, _utils.printReceived));
            }
        }
        var pass = converted.findIndex(function (item) {
            return (0, _util.isDeepStrictEqual)(item, value, [_util.isDeepStrictEqual.iterableEquality]);
        }) !== -1;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toContainEqual', collectionType, 'value') + '\n\n' + ("Expected " + collectionType + ":\n") + ("  " + (0, _utils.printReceived)(collection) + "\n") + "Not to contain a value equal to:\n" + ("  " + (0, _utils.printExpected)(value) + "\n");
        } : function () {
            return (0, _utils.matcherHint)('.toContainEqual', collectionType, 'value') + '\n\n' + ("Expected " + collectionType + ":\n") + ("  " + (0, _utils.printReceived)(collection) + "\n") + "To contain a value equal to:\n" + ("  " + (0, _utils.printExpected)(value));
        };
        return { message: message, pass: pass };
    },
    toEqual: function (received, expected) {
        var pass = (0, _util.isDeepStrictEqual)(received, expected, [_util.isDeepStrictEqual.iterableEquality]);
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toEqual') + '\n\n' + "Expected value to not equal:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(received));
        } : function () {
            return (0, _utils.matcherHint)('.toEqual') + '\n\n' + "Expected value to equal:\n" + ("  " + (0, _utils.printExpected)(expected) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(received));
        };
        // Passing the the actual and expected objects so that a custom reporter
        // could access them, for example in order to display a custom visual diff,
        // or create a different error message
        return { actual: received, expected: expected, message: message, name: 'toEqual', pass: pass };
    },
    toHaveLength: function (received, length) {
        if (typeof received !== 'string' && (!received || typeof received.length !== 'number')) {
            throw new Error((0, _utils.matcherHint)('[.not].toHaveLength', 'received', 'length') + '\n\n' + "Expected value to have a 'length' property that is a number. " + "Received:\n" + ("  " + (0, _utils.printReceived)(received) + "\n") + (received ? "received.length:\n  " + (0, _utils.printReceived)(received.length) : ''));
        }
        var pass = received.length === length;
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toHaveLength', 'received', 'length') + '\n\n' + "Expected value to not have length:\n" + ("  " + (0, _utils.printExpected)(length) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(received) + "\n") + "received.length:\n" + ("  " + (0, _utils.printReceived)(received.length));
        } : function () {
            return (0, _utils.matcherHint)('.toHaveLength', 'received', 'length') + '\n\n' + "Expected value to have length:\n" + ("  " + (0, _utils.printExpected)(length) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(received) + "\n") + "received.length:\n" + ("  " + (0, _utils.printReceived)(received.length));
        };
        return { message: message, pass: pass };
    },
    toHaveProperty: function (object, keyPath, value) {
        var valuePassed = arguments.length === 3;
        if (!object && typeof object !== 'string' && typeof object !== 'number') {
            throw new Error((0, _utils.matcherHint)('[.not].toHaveProperty', 'object', 'path', {
                secondArgument: valuePassed ? 'value' : null
            }) + '\n\n' + ("Expected " + (0, _utils.RECEIVED_COLOR)('object') + " to be an object. Received:\n") + ("  " + (0, _utils.getType)(object) + ": " + (0, _utils.printReceived)(object)));
        }
        if ((0, _utils.getType)(keyPath) !== 'string') {
            throw new Error((0, _utils.matcherHint)('[.not].toHaveProperty', 'object', 'path', {
                secondArgument: valuePassed ? 'value' : null
            }) + '\n\n' + ("Expected " + (0, _utils.EXPECTED_COLOR)('path') + " to be a string. Received:\n") + ("  " + (0, _utils.getType)(keyPath) + ": " + (0, _utils.printReceived)(keyPath)));
        }
        var result = getPath(object, keyPath);
        var lastTraversedObject = result.lastTraversedObject,
            hasEndProp = result.hasEndProp;
        var pass = valuePassed ? (0, _util.isDeepStrictEqual)(result.value, value, [_util.isDeepStrictEqual.iterableEquality]) : hasEndProp;
        var traversedPath = result.traversedPath.join('.');
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toHaveProperty', 'object', 'path', {
                secondArgument: valuePassed ? 'value' : null
            }) + '\n\n' + "Expected the object:\n" + ("  " + (0, _utils.printReceived)(object) + "\n") + "Not to have a nested property:\n" + ("  " + (0, _utils.printExpected)(keyPath) + "\n") + (valuePassed ? "With a value of:\n  " + (0, _utils.printExpected)(value) + "\n" : '');
        } : function () {
            return (0, _utils.matcherHint)('.toHaveProperty', 'object', 'path', {
                secondArgument: valuePassed ? 'value' : null
            }) + '\n\n' + "Expected the object:\n" + ("  " + (0, _utils.printReceived)(object) + "\n") + "To have a nested property:\n" + ("  " + (0, _utils.printExpected)(keyPath) + "\n") + (valuePassed ? "With a value of:\n  " + (0, _utils.printExpected)(value) + "\n" : '') + (hasEndProp ? "Received:\n  " + (0, _utils.printReceived)(result.value) : traversedPath ? "Received:\n  " + (0, _utils.RECEIVED_COLOR)('object') + "." + traversedPath + ": " + (0, _utils.printReceived)(lastTraversedObject) : '');
        };
        if (pass === undefined) {
            throw new Error('pass must be initialized');
        }
        return { message: message, pass: pass };
    },
    toMatch: function (received, expected) {
        if (typeof received !== 'string') {
            throw new Error((0, _utils.matcherHint)('[.not].toMatch', 'string', 'expected') + '\n\n' + ((0, _utils.RECEIVED_COLOR)('string') + " value must be a string.\n") + (0, _utils.printWithType)('Received', received, _utils.printReceived));
        }
        if (!(expected instanceof RegExp) && !(typeof expected === 'string')) {
            throw new Error((0, _utils.matcherHint)('[.not].toMatch', 'string', 'expected') + '\n\n' + ((0, _utils.EXPECTED_COLOR)('expected') + " value must be a string or a regular expression.\n") + (0, _utils.printWithType)('Expected', expected, _utils.printExpected));
        }
        var pass = new RegExp(typeof expected === 'string' ? escapeStrForRegex(expected) : expected).test(received);
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toMatch') + "\n\nExpected value not to match:\n" + ("  " + (0, _utils.printExpected)(expected)) + "\nReceived:\n" + ("  " + (0, _utils.printReceived)(received));
        } : function () {
            return (0, _utils.matcherHint)('.toMatch') + "\n\nExpected value to match:\n" + ("  " + (0, _utils.printExpected)(expected)) + "\nReceived:\n" + ("  " + (0, _utils.printReceived)(received));
        };
        return { message: message, pass: pass };
    },
    toMatchObject: function (receivedObject, expectedObject) {
        if (typeof receivedObject !== 'object' || receivedObject === null) {
            throw new Error((0, _utils.matcherHint)('[.not].toMatchObject', 'object', 'expected') + '\n\n' + ((0, _utils.RECEIVED_COLOR)('received') + " value must be an object.\n") + (0, _utils.printWithType)('Received', receivedObject, _utils.printReceived));
        }
        if (typeof expectedObject !== 'object' || expectedObject === null) {
            throw new Error((0, _utils.matcherHint)('[.not].toMatchObject', 'object', 'expected') + '\n\n' + ((0, _utils.EXPECTED_COLOR)('expected') + " value must be an object.\n") + (0, _utils.printWithType)('Expected', expectedObject, _utils.printExpected));
        }
        var pass = (0, _util.isDeepStrictEqual)(receivedObject, expectedObject, [_util.isDeepStrictEqual.iterableEquality, _util.isDeepStrictEqual.subsetEquality]);
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toMatchObject') + "\n\nExpected value not to match object:\n" + ("  " + (0, _utils.printExpected)(expectedObject)) + "\nReceived:\n" + ("  " + (0, _utils.printReceived)(receivedObject));
        } : function () {
            return (0, _utils.matcherHint)('.toMatchObject') + "\n\nExpected value to match object:\n" + ("  " + (0, _utils.printExpected)(expectedObject)) + "\nReceived:\n" + ("  " + (0, _utils.printReceived)(receivedObject));
        };
        return { message: message, pass: pass };
    }
};
exports.default = matchers;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var _utils = __webpack_require__(17);
// /* Sketch specific matchers */
exports.default = {
    toBeInstanceOf: function (received, constructor) {
        var constType = (0, _utils.getType)(constructor);
        if (constType !== 'function' && constType !== 'sketch-native') {
            throw new Error((0, _utils.matcherHint)('[.not].toBeInstanceOf', 'value', 'constructor') + "\n\n" + "Expected constructor to be a function. Instead got:\n" + ("  " + (0, _utils.printExpected)(constType)));
        }
        var pass;
        var expectedString;
        var receivedString;
        if (constType === 'sketch-native') {
            pass = received && typeof received.class === 'function' && String(received.class()) === String(constructor.class());
            expectedString = String(constructor.class());
            receivedString = received && typeof received.class === 'function' ? String(received.class()) : received.constructor && received.constructor.name;
        } else {
            pass = received instanceof constructor;
            expectedString = constructor.name || constructor;
            receivedString = received.constructor && received.constructor.name;
        }
        var message = pass ? function () {
            return (0, _utils.matcherHint)('.not.toBeInstanceOf', 'value', 'constructor') + '\n\n' + "Expected value not to be an instance of:\n" + ("  " + (0, _utils.printExpected)(expectedString) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(receivedString) + "\n");
        } : function () {
            return (0, _utils.matcherHint)('.toBeInstanceOf', 'value', 'constructor') + '\n\n' + "Expected value to be an instance of:\n" + ("  " + (0, _utils.printExpected)(expectedString) + "\n") + "Received:\n" + ("  " + (0, _utils.printReceived)(received) + "\n") + "Constructor:\n" + ("  " + (0, _utils.printReceived)(receivedString));
        };
        return { message: message, pass: pass };
    }
}; /* eslint-disable prefer-template */

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.extractExpectedAssertionsErrors = exports.resetAssertionsLocalState = undefined;
var _utils = __webpack_require__(17);
var _matchers_object = __webpack_require__(28);
/* eslint-disable prefer-template */
var resetAssertionsLocalState = exports.resetAssertionsLocalState = function () {
    (0, _matchers_object.setState)({
        assertionCalls: 0,
        expectedAssertionsNumber: null,
        isExpectingAssertions: false
    });
};
// Create and format all errors related to the mismatched number of `expect`
// calls and reset the matchers state.
var extractExpectedAssertionsErrors = exports.extractExpectedAssertionsErrors = function () {
    var _getState = (0, _matchers_object.getState)();
    var assertionCalls = _getState.assertionCalls,
        expectedAssertionsNumber = _getState.expectedAssertionsNumber,
        isExpectingAssertions = _getState.isExpectingAssertions;
    if (typeof expectedAssertionsNumber === 'number' && assertionCalls !== expectedAssertionsNumber) {
        var numOfAssertionsExpected = (0, _utils.EXPECTED_COLOR)((0, _utils.pluralize)('assertion', expectedAssertionsNumber));
        var error = new Error((0, _utils.matcherHint)('.assertions', '', String(expectedAssertionsNumber), {
            isDirectExpectCall: true
        }) + '\n\n' + ("Expected " + numOfAssertionsExpected + " to be called but received ") + (0, _utils.RECEIVED_COLOR)((0, _utils.pluralize)('assertion call', assertionCalls || 0)) + '.');
        return {
            actual: assertionCalls,
            error: error,
            expected: expectedAssertionsNumber
        };
    }
    if (isExpectingAssertions && assertionCalls === 0) {
        var expected = (0, _utils.EXPECTED_COLOR)('at least one assertion');
        var received = (0, _utils.RECEIVED_COLOR)('received none');
        var error = new Error((0, _utils.matcherHint)('.hasAssertions', '', '', {
            isDirectExpectCall: true
        }) + '\n\n' + ("Expected " + expected + " to be called but " + received + "."));
        return {
            actual: 'none',
            error: error,
            expected: 'at least one'
        };
    }
    return undefined;
};

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect, Promise) {
/* globals expect, test, coscript */

Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = __webpack_require__(53);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a fiber', function () {
    var fiber = async_1.createFiber();
    fiber.cleanup();
    expect(fiber).toBeDefined();
    expect(fiber.cleanup).toBeDefined();
    fiber.cleanup();
    expect(fiber.onCleanup).toBeDefined();
});
test('onCleanup should be called when cleaning up the fiber', function () {
    var fiber = async_1.createFiber();
    var cleanedUp = false;
    fiber.onCleanup(function () {
        cleanedUp = true;
    });
    expect(cleanedUp).toBe(false);
    fiber.cleanup();
    expect(cleanedUp).toBe(true);
});
test.only('should keep the plugin around when using a fiber', function () {
    expect.assertions(1);
    // creates a fiber
    return new Promise(function (resolve) {
        coscript.scheduleWithInterval_jsFunction(0.1, // 0.1s
        function () {
            expect(true).toBe(true);
            resolve();
        });
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"], __webpack_require__(19)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* globals coscript */

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A fiber is a way to keep track of a asynchronous task. The script will stay
 * alive as long as at least one fiber is running.
 *
 * To end a fiber, call `fiber.cleanup()`. This will tell Sketch that it can
 * garbage collect the script if no other fiber is running.
 *
 * You can run a function when the fiber is about to be cleaned up by setting a
 * callback: `fiber.onCleanup(function () {...})`.
 * Always do your clean up in this function instead of doing before calling
 * `fiber.cleanup`: there might be some cases where the fiber will be cleaned
 * up by Sketch so you need to account for that.
 *
 * @return {Fiber} fiber
 */
function createFiber() {
  return coscript.createFiber();
}
exports.createFiber = createFiber;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var Rectangle_1 = __webpack_require__(6);
var Group_1 = __webpack_require__(8);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a rectangle', function () {
    var r = new Rectangle_1.Rectangle(1, 2, 3, 4);
    // check that a rectangle can be logged
    log(r);
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
});
test('should create a rectangle using an object', function () {
    var r = new Rectangle_1.Rectangle({ x: 1, y: 2, width: 3, height: 4 });
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
});
test('should create a rectangle using an object when x === 0 (#133)', function () {
    var r = new Rectangle_1.Rectangle({ x: 0, y: 2, width: 3, height: 4 });
    expect(r.x).toBe(0);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
});
test('should create a rectangle using another rectangle', function () {
    var r2 = new Rectangle_1.Rectangle({ x: 1, y: 2, width: 3, height: 4 });
    var r = new Rectangle_1.Rectangle(r2);
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
});
test('should offset a rectangle', function () {
    var r = new Rectangle_1.Rectangle(1, 2, 3, 4);
    r.offset(10, 10);
    expect(r.x).toBe(11);
    expect(r.y).toBe(12);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
});
test('should scale a rectangle', function () {
    var r = new Rectangle_1.Rectangle(1, 2, 3, 4);
    r.scale(10, 10);
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(30);
    expect(r.height).toBe(40);
    r.scale(0.5);
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(15);
    expect(r.height).toBe(20);
});
test('should return a CGRect', function () {
    var r = new Rectangle_1.Rectangle(1, 2, 3, 4);
    var c = r.asCGRect();
    expect(parseInt(c.origin.x, 10)).toBe(1);
    expect(parseInt(c.origin.y, 10)).toBe(2);
    expect(parseInt(c.size.width, 10)).toBe(3);
    expect(parseInt(c.size.height, 10)).toBe(4);
});
test('should convert rect to different coord system', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page,
        frame: {
            x: 100,
            y: 50,
            width: 10,
            height: 10
        }
    });
    var rect = new Rectangle_1.Rectangle({ x: 10, y: 10, width: 10, height: 10 });
    var parentRect = rect.changeBasis({ from: group, to: group.parent });
    expect(parentRect.toJSON()).toEqual({
        x: 110,
        y: 60,
        width: 10,
        height: 10
    });
    var pageRect = rect.changeBasis({ from: group });
    expect(pageRect.toJSON()).toEqual({
        x: 110,
        y: 60,
        width: 10,
        height: 10
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(4);
var Color_1 = __webpack_require__(10);
var enums_1 = __webpack_require__(3);
var GradientStop = /** @class */function (_super) {
    __extends(GradientStop, _super);
    function GradientStop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GradientStop.from = function (object) {
        if (!object) {
            return undefined;
        }
        var nativeStop;
        if (utils_1.isNativeObject(object)) {
            var className = String(object.class());
            if (className === 'MSGradientStop') {
                nativeStop = object;
            } else {
                throw new Error("Cannot create a gradient from a " + className);
            }
        } else {
            nativeStop = MSGradientStop.stopWithPosition_color(object.position || 0, Color_1.Color.from(object.color || '#000000FF')._object);
        }
        return GradientStop.fromNative(nativeStop);
    };
    return GradientStop;
}(WrappedObject_1.WrappedObject);
exports.GradientStop = GradientStop;
GradientStop.type = enums_1.Types.GradientStop;
GradientStop[WrappedObject_1.DefinedPropertiesKey] = {};
GradientStop.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    get: function () {
        return this._object;
    }
});
GradientStop.define('position', {
    get: function () {
        return Number(this._object.position());
    },
    set: function (position) {
        this._object.setPosition(position);
    }
});
GradientStop.define('color', {
    get: function () {
        return Color_1.colorToString(this._object.color());
    },
    set: function (_color) {
        var color = Color_1.Color.from(_color);
        this._object.color = color._object;
    }
});

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = __webpack_require__(10);
var WrappedObject_1 = __webpack_require__(2);
var enums_1 = __webpack_require__(3);
var Shadow = /** @class */function (_super) {
    __extends(Shadow, _super);
    function Shadow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Shadow.toNative = function (nativeClass, value) {
        var shadow = nativeClass.new();
        var color = typeof value === 'string' ? Color_1.Color.from(value) : Color_1.Color.from(value.color);
        if (color) {
            shadow.color = color._object;
        }
        if (value.blur) {
            shadow.blurRadius = value.blur;
        }
        if (value.x) {
            shadow.offsetX = value.x;
        }
        if (value.y) {
            shadow.offsetY = value.y;
        }
        if (value.spread) {
            shadow.spread = value.spread;
        }
        if (typeof value.enabled === 'undefined') {
            shadow.isEnabled = true;
        } else {
            shadow.isEnabled = value.enabled;
        }
        return shadow;
    };
    return Shadow;
}(WrappedObject_1.WrappedObject);
exports.Shadow = Shadow;
Shadow.type = enums_1.Types.Shadow;
Shadow[WrappedObject_1.DefinedPropertiesKey] = {};
Shadow.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    get: function () {
        return this._object;
    }
});
Shadow.define('blur', {
    get: function () {
        return Number(this._object.blurRadius());
    },
    set: function (x) {
        this._object.blurRadius = x;
    }
});
Shadow.define('x', {
    get: function () {
        return Number(this._object.offsetX());
    },
    set: function (x) {
        this._object.offsetX = x;
    }
});
Shadow.define('y', {
    get: function () {
        return Number(this._object.offsetY());
    },
    set: function (x) {
        this._object.offsetY = x;
    }
});
Shadow.define('spread', {
    get: function () {
        return Number(this._object.spread());
    },
    set: function (x) {
        this._object.spread = x;
    }
});
Shadow.define('color', {
    get: function () {
        return Color_1.colorToString(this._object.color());
    },
    set: function (_color) {
        var color = Color_1.Color.from(_color);
        this._object.color = color._object;
    }
});
Shadow.define('enabled', {
    get: function () {
        return !!this._object.isEnabled();
    },
    set: function (enabled) {
        this._object.isEnabled = enabled;
    }
});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(4);
var enums_1 = __webpack_require__(3);
var ArrowheadMap = {
    None: 0,
    OpenArrow: 1,
    ClosedArrow: 2,
    Line: 3
};
exports.Arrowhead = {
    None: 'None',
    OpenArrow: 'OpenArrow',
    ClosedArrow: 'ClosedArrow',
    Line: 'Line'
};
var LineEndMap = {
    Butt: 0,
    Round: 1,
    Projecting: 2
};
exports.LineEnd = {
    Butt: 'Butt',
    Round: 'Round',
    Projecting: 'Projecting'
};
var LineJoinMap = {
    Miter: 0,
    Round: 1,
    Bevel: 2
};
exports.LineJoin = {
    Miter: 'Mitter',
    Round: 'Round',
    Bevel: 'Bevel'
};
var BORDER_OPTIONS_DEFAULT = {
    startArrowhead: exports.Arrowhead.None,
    endArrowhead: exports.Arrowhead.None,
    dashPattern: [],
    lineEnd: exports.LineEnd.Butt,
    lineJoin: exports.LineJoin.Miter
};
var BorderOptions = /** @class */function (_super) {
    __extends(BorderOptions, _super);
    function BorderOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BorderOptions.updateNative = function (s, borderOptions) {
        var optionsWithDefault = Object.assign({}, BORDER_OPTIONS_DEFAULT, borderOptions);
        if (typeof optionsWithDefault.startArrowhead !== 'undefined') {
            var startArrowhead = ArrowheadMap[optionsWithDefault.startArrowhead];
            s.setStartDecorationType(typeof startArrowhead !== 'undefined' ? startArrowhead : optionsWithDefault.startArrowhead);
        }
        if (typeof optionsWithDefault.endArrowhead !== 'undefined') {
            var endArrowhead = ArrowheadMap[optionsWithDefault.endArrowhead];
            s.setEndDecorationType(typeof endArrowhead !== 'undefined' ? endArrowhead : optionsWithDefault.endArrowhead);
        }
        if (typeof optionsWithDefault.dashPattern !== 'undefined') {
            s.borderOptions().setDashPattern(optionsWithDefault.dashPattern);
        }
        if (typeof optionsWithDefault.lineEnd !== 'undefined') {
            var lineEnd = LineEndMap[optionsWithDefault.lineEnd];
            s.borderOptions().setLineCapStyle(typeof lineEnd !== 'undefined' ? lineEnd : optionsWithDefault.lineEnd);
        }
        if (typeof optionsWithDefault.lineJoin !== 'undefined') {
            var lineJoin = LineJoinMap[optionsWithDefault.lineJoin];
            s.borderOptions().setLineJoinStyle(typeof lineJoin !== 'undefined' ? lineJoin : optionsWithDefault.lineJoin);
        }
    };
    return BorderOptions;
}(WrappedObject_1.WrappedObject);
exports.BorderOptions = BorderOptions;
BorderOptions.type = enums_1.Types.BorderOptions;
BorderOptions[WrappedObject_1.DefinedPropertiesKey] = {};
BorderOptions.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    get: function () {
        return this._object;
    }
});
BorderOptions.define('startArrowhead', {
    get: function () {
        var startType = this._object.startDecorationType();
        return Object.keys(ArrowheadMap).find(function (key) {
            return ArrowheadMap[key] === startType;
        }) || startType;
    },
    set: function (arrowhead) {
        var arrowheadMapped = ArrowheadMap[arrowhead];
        this._object.setStartDecorationType(typeof arrowheadMapped !== 'undefined' ? arrowheadMapped : arrowhead);
    }
});
BorderOptions.define('endArrowhead', {
    get: function () {
        var endType = this._object.endDecorationType();
        return Object.keys(ArrowheadMap).find(function (key) {
            return ArrowheadMap[key] === endType;
        }) || endType;
    },
    set: function (arrowhead) {
        var arrowheadMapped = ArrowheadMap[arrowhead];
        this._object.setEndDecorationType(typeof arrowheadMapped !== 'undefined' ? arrowheadMapped : arrowhead);
    }
});
BorderOptions.define('dashPattern', {
    get: function () {
        return utils_1.toArray(this._object.borderOptions().dashPattern()).map(Number);
    },
    set: function (arrowhead) {
        this._object.borderOptions().setDashPattern(arrowhead);
    }
});
BorderOptions.define('lineEnd', {
    get: function () {
        var lineCap = this._object.borderOptions().lineCapStyle();
        return Object.keys(LineEndMap).find(function (key) {
            return LineEndMap[key] === lineCap;
        }) || lineCap;
    },
    set: function (lineEnd) {
        var lineEndMapped = LineEndMap[lineEnd];
        this._object.borderOptions().setLineCapStyle(typeof lineEndMapped !== 'undefined' ? lineEndMapped : lineEnd);
    }
});
BorderOptions.define('lineJoin', {
    get: function () {
        var lineJoin = this._object.borderOptions().lineJoinStyle();
        return Object.keys(LineJoinMap).find(function (key) {
            return LineJoinMap[key] === lineJoin;
        }) || lineJoin;
    },
    set: function (lineJoin) {
        var lineJoinMapped = LineJoinMap[lineJoin];
        this._object.borderOptions().setLineJoinStyle(typeof lineJoinMapped !== 'undefined' ? lineJoinMapped : lineJoin);
    }
});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Point_1 = __webpack_require__(31);
var enums_1 = __webpack_require__(3);
var BlurTypeMap = {
    Gaussian: 0,
    Motion: 1,
    Zoom: 2,
    Background: 3
};
exports.BlurType = {
    Gaussian: 'Gaussian',
    Motion: 'Motion',
    Zoom: 'Zoom',
    Background: 'Background'
};
var DEFAULT_BLUR = {
    center: { x: 0.5, y: 0.5 },
    motionAngle: 0,
    radius: 10,
    enabled: false,
    blurType: exports.BlurType.Gaussian
};
var Blur = /** @class */function (_super) {
    __extends(Blur, _super);
    function Blur() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Blur.updateNative = function (s, blur) {
        var blurWithDefault = Object.assign({}, DEFAULT_BLUR, blur);
        if (typeof blurWithDefault.center !== 'undefined') {
            s.setCenter(CGPointMake(blurWithDefault.center.x, blurWithDefault.center.y));
        }
        if (typeof blurWithDefault.motionAngle !== 'undefined') {
            s.setMotionAngle(blurWithDefault.motionAngle);
        }
        if (typeof blurWithDefault.radius !== 'undefined') {
            s.setRadius(blurWithDefault.radius);
        }
        if (typeof blurWithDefault.blurType !== 'undefined') {
            var blurType = BlurTypeMap[blurWithDefault.blurType];
            s.setType(typeof blurType !== 'undefined' ? blurType : blurWithDefault.blurType);
        }
        if (typeof blurWithDefault.enabled !== 'undefined') {
            s.isEnabled = blurWithDefault.enabled; // eslint-disable-line
        }
    };
    return Blur;
}(WrappedObject_1.WrappedObject);
exports.Blur = Blur;
Blur.type = enums_1.Types.Blur;
Blur[WrappedObject_1.DefinedPropertiesKey] = {};
Blur.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    get: function () {
        return this._object;
    }
});
Blur.define('center', {
    get: function () {
        var center = new Point_1.Point(this._object.center().x, this._object.center().y);
        center._parent = this;
        center._parentKey = 'center';
        return center;
    },
    set: function (center) {
        this._object.setCenter(CGPointMake(center.x, center.y));
    }
});
Blur.define('motionAngle', {
    get: function () {
        return Number(this._object.motionAngle());
    },
    set: function (angle) {
        this._object.setMotionAngle(angle);
    }
});
Blur.define('radius', {
    get: function () {
        return Number(this._object.radius());
    },
    set: function (radius) {
        this._object.setRadius(radius);
    }
});
Blur.define('enabled', {
    get: function () {
        return !!this._object.isEnabled();
    },
    set: function (enabled) {
        this._object.isEnabled = enabled;
    }
});
Blur.define('blurType', {
    get: function () {
        var blurType = this._object.type();
        return Object.keys(BlurTypeMap).find(function (key) {
            return BlurTypeMap[key] === blurType;
        }) || blurType;
    },
    set: function (type) {
        var blurType = BlurTypeMap[type];
        this._object.setType(typeof blurType !== 'undefined' ? blurType : type);
    }
});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = __webpack_require__(10);
var WrappedObject_1 = __webpack_require__(2);
var Gradient_1 = __webpack_require__(12);
var Fill_1 = __webpack_require__(32);
var enums_1 = __webpack_require__(3);
var BorderPositionMap = {
    Center: 0,
    Inside: 1,
    Outside: 2,
    Both: 3
};
exports.BorderPosition = {
    Center: 'Center',
    Inside: 'Inside',
    Outside: 'Outside',
    Both: 'Both'
};
var Border = /** @class */function (_super) {
    __extends(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Border.toNative = function (value) {
        var border = MSStyleBorder.new();
        var color = typeof value === 'string' ? Color_1.Color.from(value) : Color_1.Color.from(value.color);
        var gradient = Gradient_1.Gradient.from(value.gradient);
        if (color) {
            border.color = color._object;
        }
        if (gradient) {
            border.gradient = gradient._object;
        }
        if (value.thickness) {
            border.thickness = value.thickness;
        }
        if (value.position) {
            var position = BorderPositionMap[value.position];
            border.position = typeof position !== 'undefined' ? position : value.position;
        }
        var fillType = Fill_1.FillTypeMap[value.fillType];
        border.fillType = typeof fillType !== 'undefined' ? fillType : value.fillType || Fill_1.FillTypeMap.Color;
        if (typeof value.enabled === 'undefined') {
            border.isEnabled = true;
        } else {
            border.isEnabled = value.enabled;
        }
        return border;
    };
    return Border;
}(WrappedObject_1.WrappedObject);
exports.Border = Border;
Border.type = enums_1.Types.Border;
Border[WrappedObject_1.DefinedPropertiesKey] = {};
Border.define('sketchObject', {
    exportable: false,
    enumerable: false,
    importable: false,
    get: function () {
        return this._object;
    }
});
Border.define('fillType', {
    get: function () {
        var _this = this;
        return Object.keys(Fill_1.FillTypeMap).find(function (key) {
            return Fill_1.FillTypeMap[key] === _this._object.fillType();
        }) || this._object.fillType();
    },
    set: function (fillType) {
        var fillTypeMapped = Fill_1.FillTypeMap[fillType];
        this._object.fillType = typeof fillTypeMapped !== 'undefined' ? fillTypeMapped : fillType || Fill_1.FillTypeMap.Color;
    }
});
Border.define('position', {
    get: function () {
        var _this = this;
        return Object.keys(BorderPositionMap).find(function (key) {
            return BorderPositionMap[key] === _this._object.position();
        }) || this._object.position();
    },
    set: function (position) {
        var positionMapped = BorderPositionMap[position];
        this._object.position = typeof positionMapped !== 'undefined' ? positionMapped : position;
    }
});
Border.define('color', {
    get: function () {
        return Color_1.colorToString(this._object.color());
    },
    set: function (_color) {
        var color = Color_1.Color.from(_color);
        this._object.color = color._object;
    }
});
Border.define('gradient', {
    get: function () {
        return Gradient_1.Gradient.from(this._object.gradient());
    },
    set: function (_gradient) {
        var gradient = Gradient_1.Gradient.from(_gradient);
        this._object.gradient = gradient;
    }
});
Border.define('thickness', {
    get: function () {
        return Number(this._object.thickness());
    },
    set: function (thickness) {
        this._object.thickness = thickness;
    }
});
Border.define('enabled', {
    get: function () {
        return !!this._object.isEnabled();
    },
    set: function (enabled) {
        this._object.isEnabled = enabled;
    }
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var Group_1 = __webpack_require__(8);
var Text_1 = __webpack_require__(13);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('an empty document should have an empty selection', function (context, document) {
    expect(document.selectedLayers.isEmpty).toBe(true);
});
test('should clear the selection', function (context, document) {
    var group = new Group_1.Group({
        parent: document.selectedPage,
        selected: true
    });
    var selection = document.selectedLayers;
    // check that a selection can be logged
    log(selection);
    expect(group.selected).toBe(true);
    expect(selection.isEmpty).toBe(false);
    selection.clear();
    expect(group.selected).toBe(false);
    expect(selection.isEmpty).toBe(true);
});
test('should return the length without wrapping all the object', function (context, document) {
    // eslint-disable-next-line
    var group = new Group_1.Group({
        parent: document.selectedPage,
        selected: true
    });
    // eslint-disable-next-line
    var text = new Text_1.Text({
        parent: document.selectedPage,
        selected: true
    });
    var selection = document.selectedLayers;
    expect(selection.length).toBe(2);
});
test('should be able to go through the layers', function (context, document) {
    var group = new Group_1.Group({
        parent: document.selectedPage,
        selected: true
    });
    // eslint-disable-next-line
    var text = new Text_1.Text({
        parent: document.selectedPage,
        selected: true
    });
    var selection = document.selectedLayers;
    var iterations = 0;
    var groups = 0;
    selection.layers.forEach(function (layer) {
        iterations += 1;
        if (layer.isEqual(group)) {
            groups += 1;
        }
    });
    expect(iterations).toBe(2);
    expect(groups).toBe(1);
});
test('should define convenience array methods', function (context, document) {
    // eslint-disable-next-line
    var group = new Group_1.Group({
        parent: document.selectedPage,
        selected: true
    });
    // eslint-disable-next-line
    var text = new Text_1.Text({
        parent: document.selectedPage,
        selected: true
    });
    var selection = document.selectedLayers;
    expect(selection.forEach).toBeDefined();
    expect(selection.map).toBeDefined();
    expect(selection.reduce).toBeDefined();
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should keep the wrapped object in sketchObject', function () {
    var object = MSLayer.new();
    var wrapped = WrappedObject_1.WrappedObject.fromNative(object);
    expect(wrapped.sketchObject).toBe(object);
});
test('should expose the ID of the object', function () {
    var object = MSLayer.new();
    var wrapped = WrappedObject_1.WrappedObject.fromNative(object);
    expect(wrapped.id).toBe(String(object.objectID()));
});
test('should have _isWrappedObject set to true', function () {
    var object = MSLayer.new();
    var wrapped = WrappedObject_1.WrappedObject.fromNative(object);
    expect(wrapped._isWrappedObject).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Artboard_1 = __webpack_require__(14);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create an artboard', function () {
    var artboard = new Artboard_1.Artboard({ name: 'Test' });
    // check that an artboard can be logged
    log(artboard);
    expect(artboard.type).toBe('Artboard');
});
test('should set the artboard as a flow start point', function () {
    var artboard = new Artboard_1.Artboard({ name: 'Test', flowStartPoint: true });
    expect(artboard.flowStartPoint).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var test_utils_1 = __webpack_require__(18);
var Document_1 = __webpack_require__(22);
var Group_1 = __webpack_require__(8);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should be able to log a document', function (context, document) {
    log(document);
    expect(true).toBe(true);
});
test('should return the pages', function (context, document) {
    var pages = document.pages;
    expect(pages.length).toBe(1);
    expect(pages[0]).toEqual(document.selectedPage);
});
test('should return the selected layers', function (context, document) {
    var selection = document.selectedLayers;
    expect(selection.isEmpty).toBe(true);
    var page = document.selectedPage;
    var group = new Group_1.Group({ name: 'Test', parent: page, selected: true });
    expect(group.selected).not.toBe(false);
    expect(selection.isEmpty).toBe(false);
});
test('should look for a layer by its id', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({ name: 'Test', parent: page });
    var id = group.id;
    var found = document.getLayerWithID(id);
    expect(found).toEqual(group);
});
test('should look for a layer by its name', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({ name: 'Test', parent: page });
    var found = document.getLayersNamed('Test');
    expect(found).toEqual([group]);
});
// some tests cannot really run on jenkins because it doesn't have access to MSDocument
if (!test_utils_1.isRunningOnJenkins()) {
    var _document_1;
    var documentId_1;
    test('should create a new document', function () {
        _document_1 = new Document_1.Document();
        documentId_1 = _document_1.id;
        var documents = Document_1.Document.getDocuments();
        expect(_document_1.type).toBe('Document');
        expect(documents.find(function (d) {
            return d.id === documentId_1;
        })).toEqual(_document_1);
    });
    test('should save a file', function () {
        var result = _document_1.save('~/Desktop/sketch-api-unit-tests.sketch');
        expect(result).toBe(_document_1);
    });
    test('should close a file', function () {
        _document_1.close();
        var documents = Document_1.Document.getDocuments();
        expect(documents.find(function (d) {
            return d.id === documentId_1;
        })).toBe(undefined);
    });
    test('should open a file', function () {
        var document = Document_1.Document.open('~/Desktop/sketch-api-unit-tests.sketch');
        var documents = Document_1.Document.getDocuments();
        expect(documents.find(function (d) {
            return d.id === document.id;
        })).toEqual(document);
        // close it again because when watching the tests, it will open dozens of documents
        document.close();
    });
    test('should fail to open a non-existing file', function () {
        try {
            Document_1.Document.open('~/Desktop/non-existing-sketch-api-unit-tests.sketch');
            expect(true).toBe(false);
        } catch (err) {
            expect(err.message).toMatch('couldn’t be opened because there is no such file');
        }
    });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var Artboard_1 = __webpack_require__(14);
var Group_1 = __webpack_require__(8);
var Flow_1 = __webpack_require__(21);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a flow between a layer and an artboard with a default animation', function (context, document) {
    var artboard = new Artboard_1.Artboard({
        name: 'Test1',
        parent: document.selectedPage
    });
    var artboard2 = new Artboard_1.Artboard({
        name: 'Test2',
        parent: document.selectedPage
    });
    var rect = new Group_1.Group({
        parent: artboard,
        flow: {
            target: artboard2
        }
    });
    // check that an flow can be logged
    log(rect.flow);
    expect(rect.flow.toJSON()).toEqual({
        targetId: artboard2.id,
        type: 'Flow',
        animationType: 'slideFromRight'
    });
    expect(rect.flow.isBackAction()).toBe(false);
    expect(rect.flow.isValidConnection()).toBe(true);
});
test('should create a flow between a layer and an artboard with a targetId', function (context, document) {
    var artboard = new Artboard_1.Artboard({
        name: 'Test1',
        parent: document.selectedPage
    });
    var artboard2 = new Artboard_1.Artboard({
        name: 'Test2',
        parent: document.selectedPage
    });
    var rect = new Group_1.Group({
        parent: artboard,
        flow: {
            targetId: artboard2.id
        }
    });
    expect(rect.flow.toJSON()).toEqual({
        targetId: artboard2.id,
        type: 'Flow',
        animationType: 'slideFromRight'
    });
});
test('target should return the wrapped artboard', function (context, document) {
    var artboard = new Artboard_1.Artboard({
        name: 'Test1',
        parent: document.selectedPage
    });
    var artboard2 = new Artboard_1.Artboard({
        name: 'Test2',
        parent: document.selectedPage
    });
    var rect = new Group_1.Group({
        parent: artboard,
        flow: {
            targetId: artboard2.id
        }
    });
    expect(rect.flow.target).toEqual(artboard2);
});
test('should create a flow between a layer and an artboard with a specific animation', function () {
    var artboard = new Artboard_1.Artboard({ name: 'Test1' });
    var artboard2 = new Artboard_1.Artboard({ name: 'Test2' });
    var rect = new Group_1.Group({
        parent: artboard,
        flow: {
            target: artboard2,
            animationType: Flow_1.AnimationType.slideFromLeft
        }
    });
    expect(rect.flow.toJSON()).toEqual({
        targetId: artboard2.id,
        type: 'Flow',
        animationType: 'slideFromLeft'
    });
});
test('should create a back action', function () {
    var artboard = new Artboard_1.Artboard({ name: 'Test1' });
    var rect = new Group_1.Group({
        parent: artboard,
        flow: {
            target: Flow_1.BackTarget
        }
    });
    expect(rect.flow.toJSON()).toEqual({
        targetId: Flow_1.BackTarget,
        type: 'Flow',
        animationType: 'slideFromRight'
    });
    expect(rect.flow.isBackAction()).toBe(true);
});
test('adding a flow action with an unknow target work but isValidConnection should return false', function () {
    var artboard = new Artboard_1.Artboard({ name: 'Test1' });
    var rect = new Group_1.Group({
        parent: artboard,
        flow: {
            targetId: 'unknown'
        }
    });
    expect(rect.flow.isValidConnection()).toBe(false);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Group_1 = __webpack_require__(8);
var Text_1 = __webpack_require__(13);
var Shape_1 = __webpack_require__(24);
var Rectangle_1 = __webpack_require__(6);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should return the layers and can iterate through them', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({ parent: page });
    var text = new Text_1.Text({ parent: page }); // eslint-disable-line
    var iterations = 0;
    var groups = 0;
    page.layers.forEach(function (layer) {
        iterations += 1;
        if (layer.isEqual(group)) {
            groups += 1;
        }
    });
    expect(iterations).toBe(2);
    expect(groups).toBe(1);
});
test('should transform a rectangle in page coords to local coords', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page,
        frame: new Rectangle_1.Rectangle(100, 100, 100, 100)
    });
    var local = group.pageRectToLocalRect(new Rectangle_1.Rectangle(125, 75, 50, 200));
    expect(local).toEqual(new Rectangle_1.Rectangle(25, -25, 50, 200));
});
test('should adjust the frame to fit its layers', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page,
        frame: new Rectangle_1.Rectangle(100, 100, 100, 100)
    });
    var shape = new Shape_1.Shape({
        parent: group,
        frame: new Rectangle_1.Rectangle(50, 50, 50, 50)
    });
    group.adjustToFit();
    expect(shape.parent).toEqual(group);
    expect(group.frame).toEqual(new Rectangle_1.Rectangle(150, 150, 50, 50));
});
test('should create a group', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({ parent: page });
    // check that a group can be logged
    log(group);
    expect(group.type).toBe('Group');
});
test('should create a group with some layers', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page,
        layers: [{
            type: 'Text',
            text: 'hello world'
        }]
    });
    expect(group.layers[0].type).toBe('Text');
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var Artboard_1 = __webpack_require__(14);
var Group_1 = __webpack_require__(8);
var HotSpot_1 = __webpack_require__(34);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a new HotSpot', function () {
    var hotspot = new HotSpot_1.HotSpot();
    // check that a hotspot can be logged
    log(hotspot);
    expect(hotspot.type).toEqual('HotSpot');
});
test('should create a new HotSpot from a layer', function (context, document) {
    var artboard = new Artboard_1.Artboard({
        name: 'Test1',
        parent: document.selectedPage
    });
    var artboard2 = new Artboard_1.Artboard({
        name: 'Test2',
        parent: document.selectedPage
    });
    var rect = new Group_1.Group({
        parent: artboard,
        flow: {
            targetId: artboard2.id
        }
    });
    var hotspot = HotSpot_1.HotSpot.fromLayer(rect);
    expect(rect.flow).toBe(null);
    expect(hotspot.type).toEqual('HotSpot');
    expect(hotspot.flow.toJSON()).toEqual({
        targetId: artboard2.id,
        type: 'Flow',
        animationType: 'slideFromRight'
    });
});
test('should throw an error when trying to create a new HotSpot from a layer without flow', function (context, document) {
    var artboard = new Artboard_1.Artboard({
        name: 'Test1',
        parent: document.selectedPage
    });
    var rect = new Group_1.Group({
        parent: artboard
    });
    try {
        HotSpot_1.HotSpot.fromLayer(rect);
        expect(false).toBe(true);
    } catch (err) {
        expect(err.message).toMatch('Can only create a HotSpot from a layer with an existing flow');
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Image_1 = __webpack_require__(25);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create an empty image', function (context, document) {
    var page = document.selectedPage;
    var image = new Image_1.Image({ parent: page });
    // check that an image can be logged
    log(image);
    expect(image.type).toBe('Image');
    expect(image.parent).toEqual(page);
    expect(image.image).toBe(null);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Image_1 = __webpack_require__(25);
// using a base64 image cause I'm not sure where and how to keep assets that would work with both local and jenkins tests
var base64Image = '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';
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should return an ImageData when accessing `image`', function (context, document) {
    var page = document.selectedPage;
    var image = new Image_1.Image({
        parent: page,
        image: {
            base64: base64Image
        }
    });
    expect(image.image.type).toBe('ImageData');
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var test_utils_1 = __webpack_require__(18);
var _1 = __webpack_require__(15);
// some tests cannot really run on jenkins because it doesn't have access to MSDocument
if (!test_utils_1.isRunningOnJenkins()) {
    var __skpm_logs__ = [];
    var __skpm_console_log__ = console.log;

    var __hookedLogs = function (string) {
        __skpm_logs__.push(string);

        return __skpm_console_log__(string);
    };

    var __skpm_tests__ = {};

    var test = function (description, fn) {
        function withLogs(context, document) {
            console.log = __hookedLogs;
            return fn(context, document);
        }

        __skpm_tests__[description] = withLogs;
    };

    test.only = function (description, fn) {
        fn.only = true;
        return test(description, fn);
    };

    test.skip = function (description, fn) {
        fn.skipped = true;
        return test(description, fn);
    };

    module.exports.tests = __skpm_tests__;
    module.exports.logs = __skpm_logs__;

    test('should import a symbol from a lib', function () {
        var document = new _1.Document();
        var artboard = new _1.Artboard({
            name: 'Test',
            parent: document.selectedPage
        });
        // eslint-disable-next-line
        var text = new _1.Text({
            text: 'Test value',
            parent: artboard
        });
        // eslint-disable-next-line
        var master = _1.SymbolMaster.fromArtboard(artboard);
        document.save('~/Desktop/sketch-api-unit-tests-importable-objects.sketch');
        var lib = _1.Library.getLibraryForDocumentAtPath('~/Desktop/sketch-api-unit-tests-importable-objects.sketch');
        var document2 = new _1.Document();
        var symbolRefs = lib.getImportableSymbolReferencesForDocument(document2);
        expect(symbolRefs.length).toBe(1);
        expect(symbolRefs[0].id).toBe(master.symbolId);
        var importedMaster = symbolRefs[0].import();
        expect(importedMaster.layers[0].text).toBe('Test value');
        document.close();
        document2.close();
        lib.remove();
    });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(4);
var enums_1 = __webpack_require__(3);
exports.DEFAULT_EXPORT_OPTIONS = {
    compact: false,
    'include-namespaces': false,
    compression: 1.0,
    'group-contents-only': false,
    overwriting: false,
    progressive: false,
    'save-for-web': false,
    'use-id-for-name': false,
    trimmed: false,
    output: '~/Documents/Sketch Exports'
};
/**
 * Export an object, using the options supplied.
 *
 * The object can be a layer, an array of layers, a page or an array of pages
 *
 * @discussion
 *
 * You can specify a lot of different options for the exporting.
 *
 * ### General Options
 *
 * - use-id-for-name : normally the exported files are given the same names as the layers they represent, but if this options is true, then the layer ids are used instead; defaults to false.
 * - output : this is the path of the folder where all exported files are placed; defaults to "~/Documents/Sketch Exports"
 * - overwriting : if true, the exporter will overwrite any existing files with new ones; defaults to false.
 * - trimmed: if true, any transparent space around the exported image will be trimmed; defaults to false.
 * - scales: this should be a list of numbers; it will determine the sizes at which the layers are exported; defaults to "1"
 * - formats: this should be a list of one or more of "png", "jpg", "svg", and "pdf"; defaults to "png" (see discussion below)
 *
 * ### SVG options
 * - compact : if exporting as SVG, this option makes the output more compact; defaults to false.
 * - include-namespaces : if exporting as SVG, this option includes extra attributes; defaults to false.
 *
 * ### PNG options
 * - save-for-web : if exporting a PNG, this option removes metadata such as the colour profile from the exported file; defaults to false.
 *
 * ### JPG options
 * - compression : if exporting a JPG, this option determines the level of compression, with 0 being the minimum, 1.0 the maximum; defaults to 1.0
 * - progressive : if exporting a JPG, this option makes it progressive; defaults to false.
 * - group-contents-only : false,
 *
 *
 * @param {dictionary} options Options indicating which sizes and formats to use, etc.
 */
function exportObject(object, options) {
    var merged = __assign({}, exports.DEFAULT_EXPORT_OPTIONS, options);
    var exporter = MSSelfContainedHighLevelExporter.alloc().initWithOptions(merged);
    function exportNativeLayers(layers) {
        exporter.exportLayers(layers);
    }
    function exportNativePage(page) {
        exporter.exportPage(page);
    }
    if (Array.isArray(object)) {
        var isArrayOfPages = utils_1.isWrappedObject(object[0]) ? object[0].type === enums_1.Types.Page : String(object[0].class()) === 'MSPage';
        if (isArrayOfPages) {
            // support an array of pages
            object.forEach(function (o) {
                if (utils_1.isWrappedObject(o)) {
                    exportNativePage(o.sketchObject);
                } else {
                    exportNativePage(o);
                }
            });
        } else {
            // support an array of layers
            exportNativeLayers(object.map(function (o) {
                if (utils_1.isWrappedObject(o)) {
                    return o.sketchObject;
                }
                return o;
            }));
        }
    } else if (utils_1.isWrappedObject(object)) {
        // support a wrapped object
        if (object.type === enums_1.Types.Page) {
            exportNativePage(object.sketchObject);
        } else {
            exportNativeLayers([object.sketchObject]);
        }
    } else if (String(object.class()) === 'MSPage') {
        // support a native page
        exportNativePage(object);
    } else {
        // support a native layer
        exportNativeLayers([object]);
    }
}
exports.exportObject = exportObject;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Artboard_1 = __webpack_require__(14);
var Rectangle_1 = __webpack_require__(6);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var wrapNativeObject_1 = __webpack_require__(7);
var utils_1 = __webpack_require__(4);
/**
 * A Sketch symbol master.
 */
var SymbolMaster = /** @class */function (_super) {
    __extends(SymbolMaster, _super);
    /**
     * Make a new symbol master.
     */
    function SymbolMaster(master) {
        if (master === void 0) {
            master = {};
        }
        var _this = this;
        if (!master.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            master.sketchObject = Factory_1.Factory.createNative(SymbolMaster).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
        }
        _this = _super.call(this, master) || this;
        return _this;
    }
    // Replace the artboard with a symbol master
    SymbolMaster.fromArtboard = function (artboard) {
        var wrappedArtboard = wrapNativeObject_1.wrapObject(artboard);
        return SymbolMaster.fromNative(MSSymbolMaster.convertArtboardToSymbol(wrappedArtboard.sketchObject));
    };
    // Replace the symbol with an artboard and detach all its instances converting them into groups.
    SymbolMaster.prototype.toArtboard = function () {
        var artboard = MSSymbolMaster.convertSymbolToArtboard(this._object);
        return Artboard_1.Artboard.fromNative(artboard);
    };
    // Returns a new SymbolInstance linked to this artboard, ready for inserting in the document
    SymbolMaster.prototype.createNewInstance = function () {
        return wrapNativeObject_1.wrapObject(this._object.newSymbolInstance());
    };
    // Returns all instances of the artboard in the document, on all pages
    SymbolMaster.prototype.getAllInstances = function () {
        return utils_1.toArray(this._object.allInstances()).map(wrapNativeObject_1.wrapObject);
    };
    SymbolMaster.prototype.getLibrary = function () {
        var libraryController = AppController.sharedInstance().librariesController();
        var lib = libraryController.libraryForShareableObject(this._object);
        if (!lib) {
            return null;
        }
        return wrapNativeObject_1.wrapObject(lib);
    };
    SymbolMaster.prototype.syncWithLibrary = function () {
        var libraryController = AppController.sharedInstance().librariesController();
        var lib = libraryController.libraryForShareableObject(this._object);
        if (!lib) {
            return false;
        }
        var foreignObject = this._object.foreignObject();
        if (!foreignObject) {
            return false;
        }
        libraryController.syncForeignObject_withMaster_fromLibrary(foreignObject, null, lib);
        return true;
    };
    SymbolMaster.prototype.unlinkFromLibrary = function () {
        var libraryController = AppController.sharedInstance().librariesController();
        var lib = libraryController.libraryForShareableObject(this._object);
        if (!lib) {
            return false;
        }
        var foreignObject = this._object.foreignObject();
        if (!foreignObject) {
            return false;
        }
        foreignObject.unlinkFromRemote();
        return true;
    };
    return SymbolMaster;
}(Artboard_1.Artboard);
exports.SymbolMaster = SymbolMaster;
SymbolMaster.type = enums_1.Types.SymbolMaster;
SymbolMaster[WrappedObject_1.DefinedPropertiesKey] = __assign({}, Artboard_1.Artboard[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(SymbolMaster, MSSymbolMaster);
SymbolMaster.define('symbolId', {
    get: function () {
        return String(this._object.symbolID());
    },
    set: function () {
        throw new Error('Changing the symbol ID of a SymbolMaster is forbidden.');
    }
});

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var StyledLayer_1 = __webpack_require__(11);
var Rectangle_1 = __webpack_require__(6);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var wrapNativeObject_1 = __webpack_require__(7);
var utils_1 = __webpack_require__(4);
var Override_1 = __webpack_require__(73);
var ImageData_1 = __webpack_require__(26);
/**
 * A Sketch symbol instance.
 */
var SymbolInstance = /** @class */function (_super) {
    __extends(SymbolInstance, _super);
    /**
     * Make a new symbol instance.
     */
    function SymbolInstance(master) {
        if (master === void 0) {
            master = {};
        }
        var _this = this;
        if (!master.sketchObject) {
            // eslint-disable-next-line no-param-reassign
            master.sketchObject = Factory_1.Factory.createNative(SymbolInstance).alloc().initWithFrame(new Rectangle_1.Rectangle(0, 0, 100, 100).asCGRect());
        }
        _this = _super.call(this, master) || this;
        return _this;
    }
    // Replaces the instance with a group that contains a copy of the Symbol this instance refers to. Returns null if the master contains no layers instead of inserting an empty group
    SymbolInstance.prototype.detach = function () {
        var group = this._object.detachByReplacingWithGroup();
        if (group) {
            return wrapNativeObject_1.wrapObject(group);
        }
        return null;
    };
    SymbolInstance.prototype.setOverrideValue = function (override, value) {
        var wrappedOverride = wrapNativeObject_1.wrapObject(override);
        var overridePoint = wrappedOverride.sketchObject.overridePoint();
        if (wrappedOverride.property === 'image') {
            this._object.setValue_forOverridePoint(ImageData_1.ImageData.from(value), overridePoint);
        } else if (wrappedOverride.property === 'stringValue') {
            this._object.setValue_forOverridePoint(String(value), overridePoint);
        } else {
            this._object.setValue_forOverridePoint(value, overridePoint);
        }
        return this;
    };
    return SymbolInstance;
}(StyledLayer_1.StyledLayer);
exports.SymbolInstance = SymbolInstance;
SymbolInstance.type = enums_1.Types.SymbolInstance;
SymbolInstance[WrappedObject_1.DefinedPropertiesKey] = __assign({}, StyledLayer_1.StyledLayer[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(SymbolInstance, MSSymbolInstance);
SymbolInstance.define('symbolId', {
    depends: 'parent',
    get: function () {
        return String(this._object.symbolID());
    },
    set: function (id) {
        // we need to find the symbol master and change the master,
        // it's not enough to just call `this._object.setSymbolID`
        var parentPage = this._object.parentPage();
        if (!parentPage) {
            throw new Error('A symbol instance needs to be inserted in a page before setting the symbolId');
        }
        var master = parentPage.documentData().symbolWithID(id);
        this.master = master;
    }
});
SymbolInstance.define('master', {
    exportable: false,
    enumerable: false,
    get: function () {
        var master = this._object.symbolMaster();
        if (master) {
            return wrapNativeObject_1.wrapObject(this._object.symbolMaster());
        }
        return null; // this is a bit weird, if the instance is not inserted in the document, symbolMaster will be null
    },
    set: function (master) {
        var wrappedMaster = wrapNativeObject_1.wrapObject(master);
        this._object.changeInstanceToSymbol(wrappedMaster.sketchObject);
    }
});
SymbolInstance.define('overrides', {
    get: function () {
        var _this = this;
        var overrides = utils_1.toArray(this._object.availableOverrides());
        // recursively find the overrides
        function findChildrenOverrides(instance) {
            var children = utils_1.toArray(instance.children());
            children.forEach(function (c) {
                overrides.push(c);
                findChildrenOverrides(c);
            });
        }
        overrides.forEach(findChildrenOverrides);
        return overrides.map(function (o) {
            var wrapped = Override_1.Override.fromNative(o);
            Object.defineProperty(wrapped, '__symbolInstance', {
                writable: false,
                enumerable: false,
                value: _this
            });
            return wrapped;
        });
    },
    set: function () {
        throw new Error('Cannot set the overrides directly. Set the value of each overrides instead.');
    }
});

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var ImageData_1 = __webpack_require__(26);
/**
 * An MSAvailableOverride. This is not exposed, only used by SymbolInstance
 */
var Override = /** @class */function (_super) {
    __extends(Override, _super);
    function Override() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Override;
}(WrappedObject_1.WrappedObject);
exports.Override = Override;
Override.type = enums_1.Types.Override;
Override[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
Factory_1.Factory.registerClass(Override, MSAvailableOverride);
Override.define('path', {
    get: function () {
        return String(this._object.overridePoint().layerIDPath());
    }
});
Override.define('property', {
    get: function () {
        return String(this._object.overridePoint().property());
    }
});
Override.define('id', {
    exportable: true,
    importable: false,
    get: function () {
        return String(this._object.overridePoint().name());
    }
});
Override.define('symbolOverride', {
    get: function () {
        return Boolean(this._object.overridePoint().isSymbolOverride());
    }
});
Override.define('value', {
    get: function () {
        var value = this._object.currentValue();
        if (this.property === 'image') {
            return ImageData_1.ImageData.fromNative(value);
        }
        return String(this._object.currentValue());
    },
    set: function (value) {
        // __symbolInstance is set when building the Override
        this.__symbolInstance.setOverrideValue(this, value);
    }
});
Override.define('isDefault', {
    get: function () {
        return !this._object.hasOverride();
    }
});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var Document_1 = __webpack_require__(22);
var utils_1 = __webpack_require__(4);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var wrapNativeObject_1 = __webpack_require__(7);
var ImportableObject_1 = __webpack_require__(75);
var AddStatus = {
    0: 'ok',
    1: 'the library has already been added',
    2: 'the document is not in the new JSON format',
    3: 'there was a problem reading the asset library file'
};
var LibraryTypeMap = {
    0: 'Internal',
    1: 'User',
    2: 'Remote'
};
var LibraryType = {
    Internal: 'Internal',
    User: 'User',
    Remote: 'Remote'
};
/**
 * A Sketch Library.
 */
var Library = /** @class */function (_super) {
    __extends(Library, _super);
    function Library(library) {
        if (library === void 0) {
            library = {};
        }
        var _this = this;
        if (!library.sketchObject) {
            throw new Error('Cannot create a new Library directly');
        }
        _this = _super.call(this, library) || this;
        return _this;
    }
    Library.getLibraries = function () {
        var libraryController = AppController.sharedInstance().librariesController();
        return utils_1.toArray(libraryController.libraries()).map(Library.fromNative.bind(Library));
    };
    Library.getLibraryForDocumentAtPath = function (path) {
        var libUrl = utils_1.getURLFromPath(path);
        var libraryController = AppController.sharedInstance().librariesController();
        // check if we already imported the library
        var existingLibraries = libraryController.libraries();
        for (var i = 0; i < existingLibraries.count(); i += 1) {
            var existingLibrary = existingLibraries.objectAtIndex(i);
            var location = existingLibrary.locationOnDisk();
            if (location && location.isEqual(libUrl)) {
                return Library.fromNative(existingLibrary);
            }
        }
        // otherwise, let's add it
        var status = libraryController.addAssetLibraryAtURL(libUrl);
        if (status !== 0) {
            throw new Error("Error while adding the library: " + AddStatus[status] + ".");
        }
        var lib = libraryController.userLibraries().firstObject();
        if (!lib) {
            throw new Error('could not find the added library');
        }
        // refresh the UI
        libraryController.notifyLibraryChange(lib);
        return Library.fromNative(lib);
    };
    Library.prototype.getDocument = function () {
        if (!this._object.document() && !this._object.loadSynchronously()) {
            throw new Error("could not get the document: " + this._object.status);
        }
        return Document_1.Document.fromNative(this._object.document());
    };
    Library.prototype.getImportableSymbolReferencesForDocument = function (document) {
        var _this = this;
        var provider = MSForeignSymbolProvider.alloc().initWithDocument(wrapNativeObject_1.wrapObject(document).sketchObject);
        var collector = MSForeignObjectCollector.alloc().initWithProvider(provider);
        var shareableObjectRefsMap = collector.buildCollectionWithFilter(null);
        var shareableObjectRefsForCurrentLib = utils_1.toArray(shareableObjectRefsMap).find(function (o) {
            return o.library && String(o.library.libraryID()) === _this.id;
        });
        if (!shareableObjectRefsForCurrentLib) {
            return [];
        }
        var documentData = utils_1.getDocumentData(document);
        return utils_1.toArray(shareableObjectRefsForCurrentLib.objectRefs).map(function (ref) {
            var obj = ImportableObject_1.ImportableObject.fromNative(ref);
            obj._documentData = documentData;
            return obj;
        });
    };
    Library.prototype.remove = function () {
        var libraryController = AppController.sharedInstance().librariesController();
        libraryController.removeAssetLibrary(this._object);
    };
    return Library;
}(WrappedObject_1.WrappedObject);
exports.Library = Library;
Library.type = enums_1.Types.Library;
Library[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
// need to check if we have MSAssetLibrary because it won't be available on jenkins
if (typeof MSAssetLibrary !== 'undefined') {
    Factory_1.Factory.registerClass(Library, MSAssetLibrary);
    Factory_1.Factory.registerClass(Library, MSUserAssetLibrary);
    Factory_1.Factory.registerClass(Library, MSRemoteAssetLibrary);
}
Library.ImportableObjectType = ImportableObject_1.ImportableObjectType;
Library.define('id', {
    exportable: true,
    importable: false,
    get: function () {
        var id = this._object.libraryID();
        if (!id) {
            return undefined;
        }
        return String(id);
    }
});
Library.define('name', {
    exportable: true,
    importable: false,
    get: function () {
        return String(this._object.name());
    }
});
Library.define('valid', {
    exportable: true,
    importable: false,
    get: function () {
        return !!this._object.valid();
    }
});
Library.define('enabled', {
    exportable: true,
    importable: false,
    get: function () {
        return !!this._object.enabled();
    }
});
Library.LibraryType = LibraryType;
Library.define('libraryType', {
    exportable: true,
    importable: false,
    get: function () {
        var type = this._object.libraryType();
        return LibraryTypeMap[type] || type;
    }
});

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WrappedObject_1 = __webpack_require__(2);
var enums_1 = __webpack_require__(3);
var Factory_1 = __webpack_require__(5);
var wrapNativeObject_1 = __webpack_require__(7);
var ObjectTypeMap = {
    Symbol: 0,
    LayerStyle: 1,
    TextStyle: 2,
    Unknown: 3
};
exports.ImportableObjectType = {
    Symbol: 'Symbol',
    LayerStyle: 'LayerStyle',
    TextStyle: 'TextStyle',
    Unknown: 'Unknown'
};
var ImportableObject = /** @class */function (_super) {
    __extends(ImportableObject, _super);
    /**
     * Make a new symbol instance.
     */
    function ImportableObject(master) {
        if (master === void 0) {
            master = {};
        }
        var _this = this;
        if (!master.sketchObject) {
            throw new Error("Cannot create a ImportableObject directly");
        }
        _this = _super.call(this, master) || this;
        Object.defineProperty(_this, '_documentData', {
            enumerable: false,
            writable: true
        });
        return _this;
    }
    ImportableObject.prototype.import = function () {
        if (!this._documentData) {
            throw new Error('missing document data');
        }
        var importedObject = this._object.shareableObject && this._object.shareableObject();
        if (importedObject && !this._object.sourceLibrary()) {
            switch (this.objectType) {
                case exports.ImportableObjectType.Symbol:
                    {
                        var symbol = this._documentData.symbolWithID(this._object.sharedObjectID());
                        if (symbol) {
                            return wrapNativeObject_1.wrapNativeObject(symbol);
                        }
                        return undefined;
                    }
                default:
                    throw new Error('Cannot import an already imported object other than a Symbol');
            }
        }
        var libraryController = AppController.sharedInstance().librariesController();
        importedObject = libraryController.importShareableObjectReference_intoDocument(this._object, this._documentData);
        if (!importedObject) {
            throw new Error('Could not import the Object');
        }
        return wrapNativeObject_1.wrapNativeObject(importedObject.localObject());
    };
    return ImportableObject;
}(WrappedObject_1.WrappedObject);
exports.ImportableObject = ImportableObject;
ImportableObject.type = enums_1.Types.ImportableObject;
ImportableObject[WrappedObject_1.DefinedPropertiesKey] = __assign({}, WrappedObject_1.WrappedObject[WrappedObject_1.DefinedPropertiesKey]);
// need to check if we have MSShareableObjectReference because it won't be available on jenkins
if (typeof MSShareableObjectReference !== 'undefined') {
    Factory_1.Factory.registerClass(ImportableObject, MSShareableObjectReference);
    Factory_1.Factory.registerClass(ImportableObject, MSSymbolMasterReference);
    Factory_1.Factory.registerClass(ImportableObject, MSSharedStyleReference);
    Factory_1.Factory.registerClass(ImportableObject, MSSharedLayerReference);
    Factory_1.Factory.registerClass(ImportableObject, MSSharedTextReference);
}
ImportableObject.define('id', {
    exportable: true,
    importable: false,
    get: function () {
        var id = this._object.sharedObjectID();
        if (!id) {
            return undefined;
        }
        return String(id);
    }
});
ImportableObject.define('name', {
    exportable: true,
    importable: false,
    get: function () {
        return String(this._object.name());
    }
});
ImportableObject.define('objectType', {
    exportable: true,
    importable: false,
    get: function () {
        var raw = this._object.shareableObjectType();
        return Object.keys(ObjectTypeMap).find(function (key) {
            return ObjectTypeMap[key] === raw;
        }) || raw;
    }
});
ImportableObject.define('library', {
    exportable: false,
    enumerable: false,
    get: function () {
        return wrapNativeObject_1.wrapNativeObject(this._object.sourceLibrary());
    }
});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var Group_1 = __webpack_require__(8);
var Rectangle_1 = __webpack_require__(6);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should set the name of the layer', function (context, document) {
    // setting an existing name
    var page = document.selectedPage;
    page.name = 'This is a page';
    expect(page.name).toBe('This is a page');
    // setting a name when creating a component
    var group = new Group_1.Group({ name: 'blah' });
    expect(group.name).toBe('blah');
    // default name
    var group2 = new Group_1.Group();
    expect(group2.name).toBe('Group');
});
test('should set the frame of the layer', function () {
    var frame = new Rectangle_1.Rectangle(10, 10, 20, 20);
    var group = new Group_1.Group({ frame: frame });
    expect(group.frame).toEqual(frame);
    var newFrame = new Rectangle_1.Rectangle(10, 10, 20, 20);
    group.frame = newFrame;
    expect(group.frame).toEqual(newFrame);
});
test('mutating a frame should change the frame of a layer', function () {
    var group = new Group_1.Group();
    expect(group.frame.width).toBe(100);
    group.frame.width = 400;
    expect(group.frame.width).toBe(400);
});
test('should duplicate the layer and add it as a sibling', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({ parent: page });
    expect(page.layers.length).toBe(1);
    var result = group.duplicate();
    expect(page.layers.length).toBe(2);
    expect(result.type).toBe('Group');
});
test('should remove the layer from its parent', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page
    });
    expect(page.layers.length).toBe(1);
    var result = group.remove();
    expect(page.layers.length).toBe(0);
    expect(result).toEqual(group);
});
test('should select the layer', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page
    });
    // start with nothing selected
    expect(group.selected).toBe(false);
    expect(page.selectedLayers.isEmpty).toBe(true);
    // select a layer
    group.selected = true;
    expect(page.selectedLayers.isEmpty).toBe(false);
    // deselect it - should go back to nothing selected
    group.selected = false;
    expect(page.selectedLayers.isEmpty).toBe(true);
    // select one layer then another - they both should be selected
    var group2 = new Group_1.Group({
        parent: page,
        selected: true
    });
    group.selected = true;
    expect(group2.selected).toBe(true);
    expect(page.selectedLayers.length).toBe(2);
});
test('should be able to add the layer to a group', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page
    });
    expect(group.parent).toEqual(page);
    expect(group.parent.layers[0]).toEqual(group);
    var group2 = new Group_1.Group();
    group2.parent = page;
    expect(group2.parent).toEqual(page);
});
test('should reorder the layers', function (context, document) {
    var page = document.selectedPage;
    var group1 = new Group_1.Group({
        parent: page
    });
    var group2 = new Group_1.Group({
        parent: page
    });
    var group3 = new Group_1.Group({
        parent: page
    });
    expect(group1.index).toBe(0);
    expect(group2.index).toBe(1);
    expect(group3.index).toBe(2);
    group1.moveToFront();
    expect(group2.index).toBe(0);
    expect(group3.index).toBe(1);
    expect(group1.index).toBe(2);
    group3.moveToBack();
    expect(group3.index).toBe(0);
    expect(group2.index).toBe(1);
    expect(group1.index).toBe(2);
    group2.moveForward();
    expect(group3.index).toBe(0);
    expect(group1.index).toBe(1);
    expect(group2.index).toBe(2);
    group1.moveBackward();
    expect(group1.index).toBe(0);
    expect(group3.index).toBe(1);
    expect(group2.index).toBe(2);
});
test('should convert rect to different coord system', function (context, document) {
    var page = document.selectedPage;
    var group = new Group_1.Group({
        parent: page,
        frame: {
            x: 100,
            y: 50,
            width: 10,
            height: 10
        }
    });
    var parentRect = group.localRectToParentRect(new Rectangle_1.Rectangle({ x: 10, y: 10, width: 10, height: 10 }));
    expect(parentRect.toJSON()).toEqual({
        x: 110,
        y: 60,
        width: 10,
        height: 10
    });
    var pageRect = group.localRectToPageRect(new Rectangle_1.Rectangle({ x: 10, y: 10, width: 10, height: 10 }));
    expect(pageRect.toJSON()).toEqual({
        x: 110,
        y: 60,
        width: 10,
        height: 10
    });
});
test('should hide the layer', function () {
    var group = new Group_1.Group();
    expect(group.hidden).toBe(false);
    group.hidden = true;
    expect(group.hidden).toBe(true);
});
test('should lock the layer', function () {
    var group = new Group_1.Group();
    expect(group.locked).toBe(false);
    group.locked = true;
    expect(group.locked).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var test_utils_1 = __webpack_require__(18);
var _1 = __webpack_require__(15);
function findValidLib(libs) {
    return libs.find(function (l) {
        return l.valid;
    });
}
// some tests cannot really run on jenkins because it doesn't have access to MSDocument
if (!test_utils_1.isRunningOnJenkins()) {
    var __skpm_logs__ = [];
    var __skpm_console_log__ = console.log;

    var __hookedLogs = function (string) {
        __skpm_logs__.push(string);

        return __skpm_console_log__(string);
    };

    var __skpm_tests__ = {};

    var test = function (description, fn) {
        function withLogs(context, document) {
            console.log = __hookedLogs;
            return fn(context, document);
        }

        __skpm_tests__[description] = withLogs;
    };

    test.only = function (description, fn) {
        fn.only = true;
        return test(description, fn);
    };

    test.skip = function (description, fn) {
        fn.skipped = true;
        return test(description, fn);
    };

    module.exports.tests = __skpm_tests__;
    module.exports.logs = __skpm_logs__;

    test('should list the libraries', function () {
        var libraries = _1.Library.getLibraries();
        expect(libraries[0].type).toBe('Library');
    });
    test('should be able to get the document', function () {
        var libraries = _1.Library.getLibraries();
        var lib = findValidLib(libraries);
        expect(lib.getDocument().type).toBe('Document');
    });
    test('should be able to get the list of symbols to be imported', function () {
        var document = new _1.Document();
        var libraries = _1.Library.getLibraries();
        var lib = findValidLib(libraries);
        expect(lib.getImportableSymbolReferencesForDocument(document)[0].type).toBe('ImportableObject');
        document.close();
    });
    var lib_1;
    var libId_1;
    test('should create a library from a document', function () {
        var document = new _1.Document();
        var artboard = new _1.Artboard({
            name: 'Test',
            parent: document.selectedPage
        });
        // eslint-disable-next-line
        var text = new _1.Text({
            text: 'Test value',
            parent: artboard
        });
        // eslint-disable-next-line
        var master = _1.SymbolMaster.fromArtboard(artboard);
        document.save('~/Desktop/sketch-api-unit-tests-library.sketch');
        lib_1 = _1.Library.getLibraryForDocumentAtPath('~/Desktop/sketch-api-unit-tests-library.sketch');
        libId_1 = lib_1.id;
        expect(lib_1.type).toBe('Library');
        document.close();
        var libraries = _1.Library.getLibraries();
        expect(libraries.find(function (d) {
            return d.id === libId_1;
        })).toEqual(lib_1);
    });
    test('should remove a library', function () {
        lib_1.remove();
        var libraries = _1.Library.getLibraries();
        expect(libraries.find(function (d) {
            return d.id === libId_1;
        })).toBe(undefined);
    });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */
/* eslint-disable no-param-reassign */

Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(15);
// using a base64 image cause I'm not sure where and how to keep assets that would work with both local and jenkins tests
var base64Image = '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';
var base64Image2 = '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';
function createSymbolMaster(document) {
    var artboard = new _1.Artboard({
        name: 'Test',
        parent: document.selectedPage
    });
    var text = new _1.Text({
        text: 'Test value',
        parent: artboard
    });
    // build the symbol master
    return {
        master: _1.SymbolMaster.fromArtboard(artboard),
        text: text,
        artboard: artboard
    };
}
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should be able to set overrides', function (context, document) {
    var _a = createSymbolMaster(document),
        master = _a.master,
        text = _a.text;
    var instance = master.createNewInstance();
    document.selectedPage.layers = document.selectedPage.layers.concat(instance);
    expect(instance.overrides.length).toBe(1);
    var override = instance.overrides[0];
    // check that an override can be logged
    log(override);
    override.value = 'overridden';
    expect(instance.overrides.length).toBe(1);
    expect(instance.overrides[0].toJSON()).toEqual({
        type: 'Override',
        id: text.id + "_stringValue",
        path: text.id,
        property: 'stringValue',
        symbolOverride: false,
        value: 'overridden',
        isDefault: false
    });
});
test('should change a nested symbol', function (context, document) {
    // build the first symbol master
    var nestedMaster = createSymbolMaster(document).master;
    var nestedMaster2 = createSymbolMaster(document).master;
    var artboard = new _1.Artboard({
        name: 'Test2',
        parent: document.selectedPage
    });
    var text2 = new _1.Text({
        text: 'Test value 2'
    });
    var nestedInstance = nestedMaster.createNewInstance();
    artboard.layers = [nestedInstance, text2];
    var master = _1.SymbolMaster.fromArtboard(artboard);
    var instance = master.createNewInstance();
    // add the instance to the page
    document.selectedPage.layers = document.selectedPage.layers.concat(instance);
    expect(instance.overrides.length).toBe(3);
    var override = instance.overrides[0];
    override.value = nestedMaster2.symbolId;
    expect(instance.overrides[0].toJSON()).toEqual({
        type: 'Override',
        id: nestedInstance.id + "_symbolID",
        path: nestedInstance.id,
        property: 'symbolID',
        symbolOverride: true,
        value: nestedMaster2.symbolId,
        isDefault: false
    });
});
test('should handle image override', function (context, document) {
    var artboard = new _1.Artboard({
        name: 'Test',
        parent: document.selectedPage
    });
    // eslint-disable-next-line
    var image = new _1.Image({
        image: {
            base64: base64Image
        },
        parent: artboard
    });
    // build the symbol master
    var master = _1.SymbolMaster.fromArtboard(artboard);
    var instance = master.createNewInstance();
    // add the instance to the page
    document.selectedPage.layers = document.selectedPage.layers.concat(instance);
    expect(instance.overrides.length).toBe(1);
    expect(instance.overrides[0].property).toBe('image');
    expect(instance.overrides[0].isDefault).toBe(true);
    expect(instance.overrides[0].value.type).toBe('ImageData');
    instance.overrides[0].value = {
        base64: base64Image2
    };
    expect(instance.overrides[0].property).toBe('image');
    expect(instance.overrides[0].isDefault).toBe(false);
    expect(instance.overrides[0].value.type).toBe('ImageData');
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var Group_1 = __webpack_require__(8);
var Page_1 = __webpack_require__(23);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should return a Selection with the selected layers of the page', function (context, document) {
    var page = document.selectedPage;
    // check that an artboard can be logged
    log(page);
    var selection = page.selectedLayers;
    expect(selection.isEmpty).toBe(true);
    var group = new Group_1.Group({ parent: page, name: 'Test', selected: true });
    expect(group.selected).toBe(true);
    expect(selection.isEmpty).toBe(false);
});
test('should create a page', function (context, document) {
    var page = new Page_1.Page({ parent: document });
    expect(page.type).toBe('Page');
    expect(document.pages[1]).toEqual(page);
});
test('parent should be the document', function (context, document) {
    var page = document.selectedPage;
    expect(page.parent).toEqual(document);
});
test('should duplicate a page', function (context, document) {
    var page = document.selectedPage;
    var newPage = page.duplicate();
    expect(document.pages.length).toBe(2);
    expect(newPage).toEqual(document.pages[1]);
});
test('should remove a page', function (context, document) {
    var page = document.selectedPage;
    var newPage = page.duplicate();
    expect(document.pages.length).toBe(2);
    newPage.remove();
    expect(document.pages.length).toBe(1);
    expect(document.pages[0]).toEqual(page);
});
test('should return wether a page is selected or not', function (context, document) {
    var page = document.selectedPage;
    expect(page.selected).toBe(true);
    var newPage = page.duplicate();
    expect(page.selected).toBe(true);
    expect(newPage.selected).toBe(false);
    newPage.selected = true;
    expect(newPage.selected).toBe(true);
    expect(page.selected).toBe(false);
    newPage.remove();
    expect(newPage.selected).toBe(false);
    expect(page.selected).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var Shape_1 = __webpack_require__(24);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a new shape', function () {
    var shape = new Shape_1.Shape();
    // check that a shape can be logged
    log(shape);
    expect(shape.type).toBe('Shape');
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */
/* eslint-disable no-param-reassign */

Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(15);
function createSymbolMaster(document) {
    var artboard = new _1.Artboard({
        name: 'Test',
        parent: document.selectedPage
    });
    var text = new _1.Text({
        text: 'Test value',
        parent: artboard
    });
    // build the symbol master
    return {
        master: _1.SymbolMaster.fromArtboard(artboard),
        text: text,
        artboard: artboard
    };
}
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a instance by setting the master property', function (context, document) {
    var master = createSymbolMaster(document).master;
    var instance = new _1.SymbolInstance({
        master: master
    });
    // check that an instance can be logged
    log(instance);
    expect(instance.type).toBe('SymbolInstance');
    expect(instance.master).toBe(null);
    // by default, it's not anywhere in the document
    expect(master.getAllInstances()).toEqual([]);
    // add the instance to the page
    document.selectedPage.layers = document.selectedPage.layers.concat(instance);
    expect(master.getAllInstances()).toEqual([instance]);
    expect(instance.master).toEqual(master);
});
test('should create a instance by setting the symbolId property', function (context, document) {
    var master = createSymbolMaster(document).master;
    var instance = new _1.SymbolInstance({
        symbolId: master.symbolId,
        parent: document.selectedPage
    });
    expect(instance.type).toBe('SymbolInstance');
    expect(master.getAllInstances()).toEqual([instance]);
    expect(instance.master).toEqual(master);
});
test('should have overrides', function (context, document) {
    var _a = createSymbolMaster(document),
        master = _a.master,
        text = _a.text;
    var instance = master.createNewInstance();
    document.selectedPage.layers = document.selectedPage.layers.concat(instance);
    expect(instance.overrides.length).toBe(1);
    var override = instance.overrides[0];
    expect(override.toJSON()).toEqual({
        type: 'Override',
        id: text.id + "_stringValue",
        path: text.id,
        property: 'stringValue',
        symbolOverride: false,
        value: 'Test value',
        isDefault: true
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */
/* eslint-disable no-param-reassign */

Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(15);
function createSymbolMaster(document) {
    var artboard = new _1.Artboard({
        name: 'Test',
        parent: document.selectedPage
    });
    var text = new _1.Text({
        text: 'Test value',
        parent: artboard
    });
    // build the symbol master
    return {
        master: _1.SymbolMaster.fromArtboard(artboard),
        text: text,
        artboard: artboard
    };
}
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a symbol master from an artboard', function (context, document) {
    // build the symbol master
    var master = createSymbolMaster(document).master;
    // check that a master can be logged
    log(master);
    expect(master.type).toBe('SymbolMaster');
    expect(document.getSymbolMasterWithID(master.symbolId)).toEqual(master);
});
test('should replace a symbol master by an artboard', function (context, document) {
    // build the symbol master
    var master = createSymbolMaster(document).master;
    expect(master.type).toBe('SymbolMaster');
    expect(document.getSymbolMasterWithID(master.symbolId)).toEqual(master);
    var artboard = master.toArtboard();
    expect(document.getSymbolMasterWithID(master.symbolId)).toBe(undefined);
    expect(artboard.type).toBe('Artboard');
});
test('should create a symbol instance from a master', function (context, document) {
    // build the symbol master
    var master = createSymbolMaster(document).master;
    expect(master.getAllInstances()).toEqual([]);
    // create an instance
    var instance = master.createNewInstance();
    expect(instance.type).toBe('SymbolInstance');
    expect(instance.master).toBe(null);
    // by default, it's not anywhere in the document
    expect(master.getAllInstances()).toEqual([]);
    // add the instance to the page
    document.selectedPage.layers = document.selectedPage.layers.concat(instance);
    expect(master.getAllInstances()).toEqual([instance]);
    expect(instance.master).toEqual(master);
});
test('should create a symbol master with a nested symbol', function (context, document) {
    // build the first symbol master
    var _a = createSymbolMaster(document),
        nestedMaster = _a.master,
        text = _a.text;
    var artboard = new _1.Artboard({
        name: 'Test2',
        parent: document.selectedPage
    });
    var text2 = new _1.Text({
        text: 'Test value 2'
    });
    var nestedInstance = nestedMaster.createNewInstance();
    artboard.layers = [nestedInstance, text2];
    var master = _1.SymbolMaster.fromArtboard(artboard);
    var instance = master.createNewInstance();
    // add the instance to the page
    document.selectedPage.layers = document.selectedPage.layers.concat(instance);
    expect(instance.overrides.length).toBe(3);
    expect(instance.overrides[0].toJSON()).toEqual({
        type: 'Override',
        id: nestedInstance.id + "_symbolID",
        path: nestedInstance.id,
        property: 'symbolID',
        symbolOverride: true,
        value: nestedInstance.symbolId,
        isDefault: true
    });
    expect(instance.overrides[1].toJSON()).toEqual({
        type: 'Override',
        id: text2.id + "_stringValue",
        path: text2.id,
        property: 'stringValue',
        symbolOverride: false,
        value: 'Test value 2',
        isDefault: true
    });
    expect(instance.overrides[2].toJSON()).toEqual({
        type: 'Override',
        id: nestedInstance.id + "/" + text.id + "_stringValue",
        path: nestedInstance.id + "/" + text.id,
        property: 'stringValue',
        symbolOverride: false,
        value: 'Test value',
        isDefault: true
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Text_1 = __webpack_require__(13);
var Rectangle_1 = __webpack_require__(6);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a Text layer', function () {
    var text = new Text_1.Text();
    // check that a text can be logged
    log(text);
    expect(text.type).toBe('Text');
});
test('should be able to change the text value', function () {
    var text = new Text_1.Text({ text: 'blah' });
    expect(text.text).toBe('blah');
    text.text = 'doodah';
    expect(text.text).toBe('doodah');
});
test('should adjust its size to the string with `adjustToFit`', function () {
    var text = new Text_1.Text({
        text: 'blah',
        frame: new Rectangle_1.Rectangle(10, 10, 1000, 1000)
    });
    text.adjustToFit();
    expect(text.frame).toEqual(new Rectangle_1.Rectangle(10, 10, 23, 14));
});
test('should change the text alignment', function () {
    var text = new Text_1.Text({
        text: 'blah',
        frame: new Rectangle_1.Rectangle(10, 10, 1000, 1000)
    });
    // default to left
    expect(text.alignment).toBe(Text_1.Text.Alignment.left);
    Object.keys(Text_1.Text.Alignment).forEach(function (key) {
        // test setting by name
        text.alignment = key;
        expect(text.alignment).toBe(Text_1.Text.Alignment[key]);
        // test setting by value
        text.alignment = Text_1.TextAlignmentMap[key];
        expect(text.alignment).toBe(Text_1.Text.Alignment[key]);
    });
});
test('should change the line spacing behavior', function () {
    var text = new Text_1.Text({
        text: 'blah',
        frame: new Rectangle_1.Rectangle(10, 10, 1000, 1000)
    });
    // default to constant baseline
    expect(text.lineSpacing).toBe(Text_1.Text.LineSpacing.constantBaseline);
    Object.keys(Text_1.Text.LineSpacing).forEach(function (key) {
        // test setting by name
        text.lineSpacing = key;
        expect(text.lineSpacing).toBe(Text_1.Text.LineSpacing[key]);
        // test setting by value
        text.lineSpacing = Text_1.TextLineSpacingBehaviourMap[key];
        expect(text.lineSpacing).toBe(Text_1.Text.LineSpacing[key]);
    });
});
test('should fix the width', function () {
    var text = new Text_1.Text({
        text: 'blah',
        frame: new Rectangle_1.Rectangle(10, 10, 1000, 1000)
    });
    // default to true
    expect(text.fixedWidth).toBe(false);
    text.fixedWidth = true;
    expect(text.fixedWidth).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Style_1 = __webpack_require__(9);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should change the blur', function () {
    var style = new Style_1.Style();
    expect(style.blur.toJSON()).toEqual({
        center: { x: 0.5, y: 0.5 },
        motionAngle: 0,
        radius: 10,
        enabled: false,
        blurType: 'Gaussian'
    });
    style.blur = {
        center: { x: 2, y: 6 },
        motionAngle: 5,
        radius: 20,
        enabled: true,
        blurType: Style_1.Style.BlurType.Zoom
    };
    expect(style.blur.toJSON()).toEqual({
        center: { x: 2, y: 6 },
        motionAngle: 5,
        radius: 20,
        enabled: true,
        blurType: 'Zoom'
    });
    style.blur.motionAngle = 10;
    expect(style.blur.toJSON()).toEqual({
        center: { x: 2, y: 6 },
        motionAngle: 10,
        radius: 20,
        enabled: true,
        blurType: 'Zoom'
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Style_1 = __webpack_require__(9);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should set the borders', function () {
    // setting the borders after creation
    var style = new Style_1.Style();
    // check that a style can be logged
    log(style);
    style.borders = ['#11223344', '#1234'];
    expect(style.sketchObject.borders().count()).toBe(2);
    // setting the borders during creation
    var style2 = new Style_1.Style({
        borders: ['#11223344', '#1234']
    });
    expect(style2.sketchObject.borders().count()).toBe(2);
    // setting the borders as an array of object
    var style3 = new Style_1.Style({
        borders: [{
            color: '#11223344',
            thickness: 30
        }, {
            color: '#1234',
            position: Style_1.Style.BorderPosition.Outside
        }, {
            gradient: {
                stops: [{ position: 0, color: '#1234' }, { position: 0.5, color: '#0000' }, { position: 0, color: '#1234' }]
            }
        }]
    });
    expect(style3.sketchObject.borders().count()).toBe(3);
});
test('should get the borders', function () {
    var style = new Style_1.Style();
    style.borders = [{
        color: '#11223344',
        thickness: 30
    }, {
        color: '#1234',
        position: Style_1.Style.BorderPosition.Outside
    }, {
        gradient: {
            stops: [{ position: 0, color: '#1234' }, { position: 0.5, color: '#0000' }, { position: 1, color: '#1234' }]
        }
    }];
    expect(style.borders[0].toJSON()).toEqual({
        color: '#11223344',
        fillType: 'Color',
        position: 'Center',
        thickness: 30,
        enabled: true,
        gradient: {
            gradientType: 'Linear',
            from: { x: 0.5, y: 0 },
            to: { x: 0.5, y: 1 },
            stops: [{ position: 0, color: '#ffffffff' }, { position: 1, color: '#000000ff' }]
        }
    });
    expect(style.borders[1].toJSON()).toEqual({
        color: '#11223344',
        fillType: 'Color',
        position: 'Outside',
        thickness: 1,
        enabled: true,
        gradient: {
            gradientType: 'Linear',
            from: { x: 0.5, y: 0 },
            to: { x: 0.5, y: 1 },
            stops: [{ position: 0, color: '#ffffffff' }, { position: 1, color: '#000000ff' }]
        }
    });
    expect(style.borders[2].gradient.toJSON()).toEqual({
        gradientType: 'Linear',
        from: { x: 0.5, y: 0 },
        to: { x: 0.5, y: 1 },
        stops: [{ position: 0, color: '#11223344' }, { position: 0.5, color: '#00000000' }, { position: 1, color: '#11223344' }]
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Style_1 = __webpack_require__(9);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should change the border options', function () {
    var style = new Style_1.Style();
    expect(style.borderOptions.toJSON()).toEqual({
        startArrowhead: 'None',
        endArrowhead: 'None',
        dashPattern: [],
        lineEnd: 'Butt',
        lineJoin: 'Miter'
    });
    style.borderOptions = {
        startArrowhead: Style_1.Style.Arrowhead.OpenArrow,
        endArrowhead: Style_1.Style.Arrowhead.ClosedArrow,
        dashPattern: [20, 5],
        lineEnd: Style_1.Style.LineEnd.Round,
        lineJoin: Style_1.Style.LineJoin.Bevel
    };
    expect(style.borderOptions.toJSON()).toEqual({
        startArrowhead: 'OpenArrow',
        endArrowhead: 'ClosedArrow',
        dashPattern: [20, 5],
        lineEnd: 'Round',
        lineJoin: 'Bevel'
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = __webpack_require__(10);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a Color from a hex string', function () {
    // #rrggbbaa
    var color = Color_1.Color.from('#11223344');
    expect(String(color._object.class())).toBe('MSColor');
    expect(color.toString()).toBe('#11223344');
    // #rrggbb
    var color2 = Color_1.Color.from('#112233');
    expect(color2.toString()).toBe('#112233ff');
    // #rgb
    var color3 = Color_1.Color.from('#123');
    expect(color3.toString()).toBe('#112233ff');
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Style_1 = __webpack_require__(9);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should set the fills', function () {
    // setting the fills after creation
    var style = new Style_1.Style();
    style.fills = ['#11223344', '#1234'];
    expect(style.sketchObject.fills().count()).toBe(2);
    // setting the fills during creation
    var style2 = new Style_1.Style({
        fills: ['#11223344', '#1234']
    });
    expect(style2.sketchObject.fills().count()).toBe(2);
    // setting the fills as an array of object
    var style3 = new Style_1.Style({
        fills: [{
            color: '#11223344',
            thickness: 30
        }, {
            color: '#1234',
            fillType: Style_1.Style.FillType.Color
        }]
    });
    expect(style3.sketchObject.fills().count()).toBe(2);
});
test('should get the fills', function () {
    var style = new Style_1.Style();
    style.fills = ['#11223344', '#1234'];
    expect(style.fills.map(function (f) {
        return f.toJSON();
    })).toEqual([{
        color: '#11223344',
        fill: 'Color',
        enabled: true,
        gradient: {
            gradientType: 'Linear',
            from: { x: 0.5, y: 0 },
            to: { x: 0.5, y: 1 },
            stops: [{ position: 0, color: '#ffffffff' }, { position: 1, color: '#000000ff' }]
        }
    }, {
        color: '#11223344',
        fill: 'Color',
        enabled: true,
        gradient: {
            gradientType: 'Linear',
            from: { x: 0.5, y: 0 },
            to: { x: 0.5, y: 1 },
            stops: [{ position: 0, color: '#ffffffff' }, { position: 1, color: '#000000ff' }]
        }
    }]);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Gradient_1 = __webpack_require__(12);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a default gradient', function () {
    var gradient = Gradient_1.Gradient.from({});
    expect(String(gradient._object.class())).toBe('MSGradient');
    expect(gradient.toJSON()).toEqual({
        gradientType: 'Linear',
        from: { x: 0.5, y: 0 },
        to: { x: 0.5, y: 1 },
        stops: []
    });
});
test('should create a gradient with a specific type', function () {
    var gradient = Gradient_1.Gradient.from({ gradientType: Gradient_1.GradientType.Angular });
    expect(gradient.toJSON()).toEqual({
        gradientType: 'Angular',
        from: { x: 0.5, y: 0 },
        to: { x: 0.5, y: 1 },
        stops: []
    });
});
test('should create a gradient with a specific from and to coordinates', function () {
    var gradient = Gradient_1.Gradient.from({
        from: {
            x: 1,
            y: 0.5
        },
        to: {
            x: 2,
            y: 5
        }
    });
    expect(gradient.toJSON()).toEqual({
        gradientType: 'Linear',
        from: { x: 1, y: 0.5 },
        to: { x: 2, y: 5 },
        stops: []
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Gradient_1 = __webpack_require__(12);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should create a gradient with some stops', function () {
    var gradient = Gradient_1.Gradient.from({
        stops: [{
            position: 1,
            color: '#123'
        }, {
            position: 0,
            color: '#534'
        }, {
            position: 0.5,
            color: '#1234'
        }]
    });
    expect(gradient.toJSON()).toEqual({
        gradientType: 'Linear',
        from: { x: 0.5, y: 0 },
        to: { x: 0.5, y: 1 },
        stops: [{ position: 1, color: '#112233ff' }, { position: 0, color: '#553344ff' }, { position: 0.5, color: '#11223344' }]
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Style_1 = __webpack_require__(9);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should set the shadows', function () {
    var style = new Style_1.Style();
    style.shadows = [{
        color: '#11223344',
        blur: 10,
        x: 5,
        y: 8,
        spread: 20,
        enabled: false
    }];
    style.innerShadows = [{
        color: '#11223344',
        blur: 10,
        x: 5,
        y: 8,
        spread: 20,
        enabled: false
    }];
    expect(style.sketchObject.shadows().count()).toBe(1);
    expect(style.sketchObject.innerShadows().count()).toBe(1);
});
test('should get the shadows', function () {
    var style = new Style_1.Style();
    style.shadows = [{
        color: '#11223344',
        blur: 4,
        x: 5,
        y: 8,
        spread: 20,
        enabled: false
    }];
    expect(style.shadows[0].toJSON()).toEqual({
        color: '#11223344',
        blur: 4,
        x: 5,
        y: 8,
        spread: 20,
        enabled: false
    });
    style.innerShadows = [{
        color: '#11223344',
        blur: 5,
        x: 2,
        y: 23,
        spread: 10,
        enabled: true
    }];
    expect(style.innerShadows[0].toJSON()).toEqual({
        color: '#11223344',
        blur: 5,
        x: 2,
        y: 23,
        spread: 10,
        enabled: true
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {
/* globals expect, test */

Object.defineProperty(exports, "__esModule", { value: true });
var Style_1 = __webpack_require__(9);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('should change the opacity', function () {
    var style = new Style_1.Style();
    expect(style.opacity).toBe(1);
    style.opacity = 0.5;
    expect(style.opacity).toBe(0.5);
    style.opacity = 2;
    expect(style.opacity).toBe(1);
    style.opacity = -1;
    expect(style.opacity).toBe(0);
});
test('should change the blending mode', function () {
    var style = new Style_1.Style();
    expect(style.blendingMode).toBe(Style_1.Style.BlendingMode.Normal);
    style.blendingMode = Style_1.Style.BlendingMode.Multiply;
    expect(style.blendingMode).toBe('Multiply');
});
test('default style should not have any fills', function () {
    // setting the fills after creation
    var style = new Style_1.Style();
    expect(style.sketchObject.fills().count()).toBe(0);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console, expect) {

Object.defineProperty(exports, "__esModule", { value: true });
/* globals expect, test */
var test_utils_1 = __webpack_require__(18);
var Text_1 = __webpack_require__(13);
var Settings_1 = __webpack_require__(94);
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function (string) {
    __skpm_logs__.push(string);

    return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function (description, fn) {
    function withLogs(context, document) {
        console.log = __hookedLogs;
        return fn(context, document);
    }

    __skpm_tests__[description] = withLogs;
};

test.only = function (description, fn) {
    fn.only = true;
    return test(description, fn);
};

test.skip = function (description, fn) {
    fn.skipped = true;
    return test(description, fn);
};

module.exports.tests = __skpm_tests__;
module.exports.logs = __skpm_logs__;
test('non existing settings should return undefined', function () {
    if (test_utils_1.isRunningOnJenkins()) {
        try {
            expect(Settings_1.settingForKey('non-existing-key')).toBe(undefined);
            expect(false).toBe(true);
        } catch (err) {
            expect(err.message).toMatch('It seems that the command is not running in a plugin.');
        }
    } else {
        expect(Settings_1.settingForKey('non-existing-key')).toBe(undefined);
    }
});
test('should set a boolean', function () {
    if (test_utils_1.isRunningOnJenkins()) {
        try {
            Settings_1.setSettingForKey('false-key', false);
            expect(false).toBe(true);
        } catch (err) {
            expect(err.message).toMatch('It seems that the command is not running in a plugin.');
        }
    } else {
        Settings_1.setSettingForKey('false-key', false);
        expect(Settings_1.settingForKey('false-key')).toBe(false);
        Settings_1.setSettingForKey('true-key', true);
        expect(Settings_1.settingForKey('true-key')).toBe(true);
    }
});
test('should set a string', function () {
    if (test_utils_1.isRunningOnJenkins()) {
        try {
            Settings_1.setSettingForKey('string-key', 'test');
            expect(false).toBe(true);
        } catch (err) {
            expect(err.message).toMatch('It seems that the command is not running in a plugin.');
        }
    } else {
        Settings_1.setSettingForKey('string-key', 'test');
        expect(Settings_1.settingForKey('string-key')).toBe('test');
    }
});
test('should set undefined', function () {
    if (test_utils_1.isRunningOnJenkins()) {
        try {
            Settings_1.setSettingForKey('undefined-key', undefined);
            expect(false).toBe(true);
        } catch (err) {
            expect(err.message).toMatch('It seems that the command is not running in a plugin.');
        }
    } else {
        Settings_1.setSettingForKey('undefined-key', undefined);
        expect(Settings_1.settingForKey('undefined-key')).toBe(undefined);
    }
});
test('should set object', function () {
    if (test_utils_1.isRunningOnJenkins()) {
        try {
            Settings_1.setSettingForKey('object-key', { a: 1 });
            expect(false).toBe(true);
        } catch (err) {
            expect(err.message).toMatch('It seems that the command is not running in a plugin.');
        }
    } else {
        Settings_1.setSettingForKey('object-key', { a: 1 });
        expect(Settings_1.settingForKey('object-key')).toEqual({ a: 1 });
    }
});
test('should set a setting on a layer', function (context, document) {
    var layer = new Text_1.Text({ parent: document.selectedPage });
    Settings_1.setLayerSettingForKey(layer, 'object-key', { a: 1 });
    expect(Settings_1.layerSettingForKey(layer, 'object-key')).toEqual({ a: 1 });
});
test('should set a setting on a document', function (context, document) {
    Settings_1.setDocumentSettingForKey(document, 'object-key', { a: 1 });
    expect(Settings_1.documentSettingForKey(document, 'object-key')).toEqual({ a: 1 });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)["default"]))

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(4);
function getPluginIdentifier() {
    if (!__command.pluginBundle()) {
        throw new Error('It seems that the command is not running in a plugin. Bundle your command in a plugin to use the Settings API.');
    }
    return __command.pluginBundle().identifier();
}
/**
 * Return the value of a global setting for a given key.
 * @param key The setting to look up.
 * @return The setting value.
 *
 * This is equivalent to reading a setting for the currently
 * running version of Sketch using the `defaults` command line tool,
 * eg: defaults read com.bohemiancoding.sketch3 <key>
 * */
function globalSettingForKey(key) {
    var value = NSUserDefaults.standardUserDefaults().objectForKey_(key);
    if (typeof value === 'undefined' || value === 'undefined' || value === null) {
        return undefined;
    }
    return JSON.parse(value);
}
exports.globalSettingForKey = globalSettingForKey;
/**
 * Set the value of a global setting for a given key.
 *
 * @param key The setting to set.
 * @param value The value to set it to.
 *
 * This is equivalent to writing a setting for the currently
 * running version of Sketch using the `defaults` command line tool,
 * eg: defaults write com.bohemiancoding.sketch3 <key> <value>
 */
function setGlobalSettingForKey(key, value) {
    var store = NSUserDefaults.standardUserDefaults();
    var stringifiedValue = JSON.stringify(value);
    if (!stringifiedValue) {
        store.removeObjectForKey(key);
    } else {
        store.setObject_forKey_(stringifiedValue, key);
    }
}
exports.setGlobalSettingForKey = setGlobalSettingForKey;
var SUITE_PREFIX = 'plugin.sketch.';
/**
 * Return the value of a plugin setting for a given key.
 *
 * @param key The setting to look up.
 * @return The setting value.
 * */
function settingForKey(key) {
    var store = NSUserDefaults.alloc().initWithSuiteName("" + SUITE_PREFIX + getPluginIdentifier());
    var value = store.objectForKey_(key);
    if (typeof value === 'undefined' || value == 'undefined' || value === null) {
        return undefined;
    }
    return JSON.parse(value);
}
exports.settingForKey = settingForKey;
/**
 * Set the value of a global setting for a given key.
 *
 * @param key The setting to set.
 * @param value The value to set it to.
 */
function setSettingForKey(key, value) {
    var store = NSUserDefaults.alloc().initWithSuiteName("" + SUITE_PREFIX + getPluginIdentifier());
    var stringifiedValue = JSON.stringify(value);
    if (!stringifiedValue) {
        store.removeObjectForKey(key);
    } else {
        store.setObject_forKey_(stringifiedValue, key);
    }
}
exports.setSettingForKey = setSettingForKey;
function layerSettingForKey(layer, key) {
    var value = __command.valueForKey_onLayer(key, utils_1.isWrappedObject(layer) ? layer.sketchObject : layer);
    if (typeof value === 'undefined' || value == 'undefined' || value === null) {
        return undefined;
    }
    return JSON.parse(value);
}
exports.layerSettingForKey = layerSettingForKey;
function setLayerSettingForKey(layer, key, value) {
    __command.setValue_forKey_onLayer(JSON.stringify(value), key, utils_1.isWrappedObject(layer) ? layer.sketchObject : layer);
}
exports.setLayerSettingForKey = setLayerSettingForKey;
function documentSettingForKey(document, key) {
    var documentData = utils_1.getDocumentData(document);
    var value = __command.valueForKey_onDocument(key, documentData);
    if (typeof value === 'undefined' || value == 'undefined' || value === null) {
        return undefined;
    }
    return JSON.parse(value);
}
exports.documentSettingForKey = documentSettingForKey;
function setDocumentSettingForKey(document, key, value) {
    var documentData = utils_1.getDocumentData(document);
    __command.setValue_forKey_onDocument(JSON.stringify(value), key, documentData);
}
exports.setDocumentSettingForKey = setDocumentSettingForKey;

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=compiled-tests.js.map