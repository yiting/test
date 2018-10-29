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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/@skpm/test-runner/test-runner.sketchplugin/Contents/Sketch/generated-tests.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Source/async/__tests__/async.test.js":
/*!**********************************************!*\
  !*** ./Source/async/__tests__/async.test.js ***!
  \**********************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect, Promise) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .. */ "./Source/async/index.ts");
/* globals expect, test, coscript */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a fiber', function () {
  var fiber = Object(___WEBPACK_IMPORTED_MODULE_0__["createFiber"])();
  fiber.cleanup();
  expect(fiber).toBeDefined();
  expect(fiber.cleanup).toBeDefined();
  fiber.cleanup();
  expect(fiber.onCleanup).toBeDefined();
});
test('onCleanup should be called when cleaning up the fiber', function () {
  var fiber = Object(___WEBPACK_IMPORTED_MODULE_0__["createFiber"])();
  var cleanedUp = false;
  fiber.onCleanup(function () {
    cleanedUp = true;
  });
  expect(cleanedUp).toBe(false);
  fiber.cleanup();
  expect(cleanedUp).toBe(true);
});
test.only('should keep the plugin around when using a fiber', function () {
  expect.assertions(1); // creates a fiber

  return new Promise(function (resolve) {
    coscript.scheduleWithInterval_jsFunction(0.1, // 0.1s
    function () {
      expect(true).toBe(true);
      resolve();
    });
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js"), __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js")))

/***/ }),

/***/ "./Source/async/async.ts":
/*!*******************************!*\
  !*** ./Source/async/async.ts ***!
  \*******************************/
/*! exports provided: createFiber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFiber", function() { return createFiber; });
/* globals coscript */

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

/***/ }),

/***/ "./Source/async/index.ts":
/*!*******************************!*\
  !*** ./Source/async/index.ts ***!
  \*******************************/
/*! exports provided: version, createFiber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var _async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./async */ "./Source/async/async.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createFiber", function() { return _async__WEBPACK_IMPORTED_MODULE_0__["createFiber"]; });


var version = {
  sketch: MSApplicationMetadata.metadata().appVersion,
  api: "2.0.0"
};

/***/ }),

/***/ "./Source/data-supplier/DataSupplier.ts":
/*!**********************************************!*\
  !*** ./Source/data-supplier/DataSupplier.ts ***!
  \**********************************************/
/*! exports provided: registerDataSupplier, deregisterDataSuppliers, supplyData, supplyDataAtIndex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerDataSupplier", function() { return registerDataSupplier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deregisterDataSuppliers", function() { return deregisterDataSuppliers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supplyData", function() { return supplyData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supplyDataAtIndex", function() { return supplyDataAtIndex; });
function getPluginIdentifier() {
  if (!__command.pluginBundle()) {
    throw new Error('It seems that the command is not running in a plugin. Bundle your command in a plugin to use the DataSupplier API.');
  }

  return __command.pluginBundle().identifier();
}
/**
 * Register a function to supply data on request.
 *
 * @param {string} dataType The data type. Currently "public.text" or "public.image" are the only allowed values.
 * @param {string} dataName The data name, will be used as the menu item title for the data.
 * @param {string} dynamicDataKey The key to use to select the dynamic data to supply in onSupplyData.
 */


function registerDataSupplier(dataType, dataName, dynamicDataKey) {
  var dataManager = AppController.sharedInstance().dataSupplierManager();
  var identifier = getPluginIdentifier();

  var commandIdentifier = __command.identifier();

  dataManager.registerPluginDataSupplier_withName_dataType_pluginIdentifier_commandIdentifier(dynamicDataKey, dataName, dataType, identifier, commandIdentifier);
}
/**
 * Deregister any static data or dynamic data providers for a particular plugin. Typically called from the Shutdown method of the plugin.
 */

function deregisterDataSuppliers() {
  var dataManager = AppController.sharedInstance().dataSupplierManager();
  var identifier = getPluginIdentifier();
  dataManager.deregisterDataSuppliersForPluginWithIdentifier(identifier);
}
/**
 * When the plugin providing the dynamic data has finished generating the data, it will call this function with the data key and the data.
 */

function supplyData(key, data) {
  var dataManager = AppController.sharedInstance().dataSupplierManager();
  dataManager.supplyData_forKey(data, key);
}
/**
 * When we want to only supply 1 bit of the requested data.
 */

function supplyDataAtIndex(key, datum, index) {
  var dataManager = AppController.sharedInstance().dataSupplierManager();
  dataManager.supplyData_atIndex_forKey(datum, index, key);
}

/***/ }),

/***/ "./Source/data-supplier/index.ts":
/*!***************************************!*\
  !*** ./Source/data-supplier/index.ts ***!
  \***************************************/
/*! exports provided: version, registerDataSupplier, deregisterDataSuppliers, supplyData, supplyDataAtIndex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var _DataSupplier__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DataSupplier */ "./Source/data-supplier/DataSupplier.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerDataSupplier", function() { return _DataSupplier__WEBPACK_IMPORTED_MODULE_0__["registerDataSupplier"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deregisterDataSuppliers", function() { return _DataSupplier__WEBPACK_IMPORTED_MODULE_0__["deregisterDataSuppliers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supplyData", function() { return _DataSupplier__WEBPACK_IMPORTED_MODULE_0__["supplyData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supplyDataAtIndex", function() { return _DataSupplier__WEBPACK_IMPORTED_MODULE_0__["supplyDataAtIndex"]; });


var version = {
  sketch: MSApplicationMetadata.metadata().appVersion,
  api: "2.0.0"
};

/***/ }),

/***/ "./Source/dom/Factory.js":
/*!*******************************!*\
  !*** ./Source/dom/Factory.js ***!
  \*******************************/
/*! exports provided: Factory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Factory", function() { return Factory; });
var Factory = {
  _typeToBox: {},
  _nativeToBox: {},
  _typeToNative: {},
  registerClass: function registerClass(boxedClass, nativeClass) {
    if (!this._typeToBox[boxedClass.type]) {
      this._typeToBox[boxedClass.type] = boxedClass;
      this._typeToNative[boxedClass.type] = nativeClass;
    }

    this._nativeToBox[String(nativeClass.class())] = boxedClass;
  },
  create: function create(type, props) {
    var _type = type && type.type ? type.type : type;

    var BoxedClass = this._typeToBox[_type];

    if (BoxedClass) {
      return new BoxedClass(props);
    }

    return undefined;
  },
  createNative: function createNative(type) {
    var _type = type && type.type ? type.type : type;

    var nativeClass = this._typeToNative[_type];

    if (!nativeClass) {
      throw new Error("don't know how to create a native ".concat(_type));
    }

    return nativeClass;
  }
};

/***/ }),

/***/ "./Source/dom/WrappedObject.js":
/*!*************************************!*\
  !*** ./Source/dom/WrappedObject.js ***!
  \*************************************/
/*! exports provided: DefinedPropertiesKey, WrappedObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefinedPropertiesKey", function() { return DefinedPropertiesKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WrappedObject", function() { return WrappedObject; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DefinedPropertiesKey = '_DefinedPropertiesKey';
/**
 * Base class for all objects that
 * wrap Sketch classes.
 */

var WrappedObject =
/*#__PURE__*/
function () {
  function WrappedObject(options) {
    _classCallCheck(this, WrappedObject);

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

  _createClass(WrappedObject, [{
    key: "update",
    value: function update() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var propertyList = this.constructor[DefinedPropertiesKey];
      Object.keys(options).sort(function (a, b) {
        if (propertyList[a] && propertyList[a].depends && propertyList[a].depends === b) {
          return 1;
        }

        if (propertyList[b] && propertyList[b].depends && propertyList[b].depends === a) {
          return -1;
        }

        return 0;
      }).forEach(function (k) {
        if (!propertyList[k]) {
          // ignore the properties that starts with _, they are workarounds
          if (k && k[0] !== '_') {
            console.warn("no idea what to do with \"".concat(k, "\" in ").concat(_this.type));
          }

          return;
        }

        if (!propertyList[k].importable) {
          return;
        }

        _this[k] = options[k];
      });
    }
    /**
     * Return a new wrapped object for a given Sketch model object.
     *
     * @param {Object} object - The Sketch model object to wrap.
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      var _this2 = this;

      var propertyList = this.constructor[DefinedPropertiesKey];
      var json = {};
      Object.keys(propertyList).forEach(function (k) {
        if (!propertyList[k].exportable) {
          return;
        }

        var value = _this2[k];

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
    }
  }, {
    key: "isImmutable",
    value: function isImmutable() {
      return /Immutable/.test(String(this.sketchObject.className()));
    }
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

  }, {
    key: "isEqual",
    value: function isEqual(wrappedObject) {
      return this.sketchObject == wrappedObject.sketchObject;
    }
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

  }], [{
    key: "fromNative",
    value: function fromNative(sketchObject) {
      return new this({
        sketchObject: sketchObject
      });
    }
  }, {
    key: "define",
    value: function define(propertyName, descriptor) {
      this._addDescriptor(propertyName, descriptor);

      Object.defineProperty(this.prototype, propertyName, descriptor);
    }
    /**
     * we want to keep track of the defined properties and their order
     *
     * @param {string} propertyName
     * @param {Object} descriptor
     */

  }, {
    key: "_addDescriptor",
    value: function _addDescriptor(propertyName, descriptor) {
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
      descriptor.exportable = descriptor.exportable && typeof descriptor.get !== 'undefined'; // properties starting with `_` are considered private

      if (propertyName[0] === '_') {
        return;
      }

      this[DefinedPropertiesKey][propertyName] = descriptor;
      /* eslint-enable */
    }
  }]);

  return WrappedObject;
}();
WrappedObject[DefinedPropertiesKey] = {};
WrappedObject.define('type', {
  exportable: true,
  importable: false,
  get: function get() {
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
  get: function get() {
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
  get: function get() {
    return this._object;
  }
});
WrappedObject.define('_isWrappedObject', {
  enumerable: false,
  exportable: false,
  get: function get() {
    return true;
  }
});

/***/ }),

/***/ "./Source/dom/__tests__/WrappedObject.test.js":
/*!****************************************************!*\
  !*** ./Source/dom/__tests__/WrappedObject.test.js ***!
  \****************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should keep the wrapped object in sketchObject', function () {
  var object = MSLayer.new();
  var wrapped = _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"].fromNative(object);
  expect(wrapped.sketchObject).toBe(object);
});
test('should expose the ID of the object', function () {
  var object = MSLayer.new();
  var wrapped = _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"].fromNative(object);
  expect(wrapped.id).toBe(String(object.objectID()));
});
test('should have _isWrappedObject set to true', function () {
  var object = MSLayer.new();
  var wrapped = _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"].fromNative(object);
  expect(wrapped._isWrappedObject).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/enums.js":
/*!*****************************!*\
  !*** ./Source/dom/enums.js ***!
  \*****************************/
/*! exports provided: Types */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Types", function() { return Types; });
var Types = {
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
  ImportableObject: 'ImportableObject',
  SharedStyle: 'SharedStyle',
  DataOverride: 'DataOverride',
  ShapePath: 'ShapePath'
};

/***/ }),

/***/ "./Source/dom/export.js":
/*!******************************!*\
  !*** ./Source/dom/export.js ***!
  \******************************/
/*! exports provided: DEFAULT_EXPORT_OPTIONS, exportObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_EXPORT_OPTIONS", function() { return DEFAULT_EXPORT_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportObject", function() { return exportObject; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./Source/dom/utils.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enums */ "./Source/dom/enums.js");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var DEFAULT_EXPORT_OPTIONS = {
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

};
function exportObject(object, options) {
  var merged = _objectSpread({}, DEFAULT_EXPORT_OPTIONS, options);

  var exporter = MSSelfContainedHighLevelExporter.alloc().initWithOptions(merged);

  function exportNativeLayers(layers) {
    exporter.exportLayers(layers);
  }

  function exportNativePage(page) {
    exporter.exportPage(page);
  }

  if (Array.isArray(object)) {
    var isArrayOfPages = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isWrappedObject"])(object[0]) ? object[0].type === _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].Page : String(object[0].class()) === 'MSPage';

    if (isArrayOfPages) {
      // support an array of pages
      object.forEach(function (o) {
        if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isWrappedObject"])(o)) {
          exportNativePage(o.sketchObject);
        } else {
          exportNativePage(o);
        }
      });
    } else {
      // support an array of layers
      exportNativeLayers(object.map(function (o) {
        if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isWrappedObject"])(o)) {
          return o.sketchObject;
        }

        return o;
      }));
    }
  } else if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isWrappedObject"])(object)) {
    // support a wrapped object
    if (object.type === _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].Page) {
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

/***/ }),

/***/ "./Source/dom/index.js":
/*!*****************************!*\
  !*** ./Source/dom/index.js ***!
  \*****************************/
/*! exports provided: export, Document, getDocuments, getSelectedDocument, Library, getLibraries, SharedStyle, Rectangle, Style, Group, Text, Image, Shape, ShapePath, Artboard, Page, SymbolMaster, SymbolInstance, HotSpot, Types, fromNative, Flow, version */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Flow", function() { return Flow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var _models_Flow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/Flow */ "./Source/dom/models/Flow.js");
/* harmony import */ var _models_DataOverride__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/DataOverride */ "./Source/dom/models/DataOverride.js");
/* harmony import */ var _export__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./export */ "./Source/dom/export.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "export", function() { return _export__WEBPACK_IMPORTED_MODULE_2__["exportObject"]; });

/* harmony import */ var _models_Document__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/Document */ "./Source/dom/models/Document.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Document", function() { return _models_Document__WEBPACK_IMPORTED_MODULE_3__["Document"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getDocuments", function() { return _models_Document__WEBPACK_IMPORTED_MODULE_3__["getDocuments"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSelectedDocument", function() { return _models_Document__WEBPACK_IMPORTED_MODULE_3__["getSelectedDocument"]; });

/* harmony import */ var _models_Library__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/Library */ "./Source/dom/models/Library.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Library", function() { return _models_Library__WEBPACK_IMPORTED_MODULE_4__["Library"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLibraries", function() { return _models_Library__WEBPACK_IMPORTED_MODULE_4__["getLibraries"]; });

/* harmony import */ var _models_SharedStyle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models/SharedStyle */ "./Source/dom/models/SharedStyle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SharedStyle", function() { return _models_SharedStyle__WEBPACK_IMPORTED_MODULE_5__["SharedStyle"]; });

/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Rectangle", function() { return _models_Rectangle__WEBPACK_IMPORTED_MODULE_6__["Rectangle"]; });

/* harmony import */ var _style_Style__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style/Style */ "./Source/dom/style/Style.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Style", function() { return _style_Style__WEBPACK_IMPORTED_MODULE_7__["Style"]; });

/* harmony import */ var _layers_Group__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./layers/Group */ "./Source/dom/layers/Group.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Group", function() { return _layers_Group__WEBPACK_IMPORTED_MODULE_8__["Group"]; });

/* harmony import */ var _layers_Text__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./layers/Text */ "./Source/dom/layers/Text.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return _layers_Text__WEBPACK_IMPORTED_MODULE_9__["Text"]; });

/* harmony import */ var _layers_Image__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./layers/Image */ "./Source/dom/layers/Image.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return _layers_Image__WEBPACK_IMPORTED_MODULE_10__["Image"]; });

/* harmony import */ var _layers_Shape__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./layers/Shape */ "./Source/dom/layers/Shape.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Shape", function() { return _layers_Shape__WEBPACK_IMPORTED_MODULE_11__["Shape"]; });

/* harmony import */ var _layers_ShapePath__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./layers/ShapePath */ "./Source/dom/layers/ShapePath.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ShapePath", function() { return _layers_ShapePath__WEBPACK_IMPORTED_MODULE_12__["ShapePath"]; });

/* harmony import */ var _layers_Artboard__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./layers/Artboard */ "./Source/dom/layers/Artboard.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Artboard", function() { return _layers_Artboard__WEBPACK_IMPORTED_MODULE_13__["Artboard"]; });

/* harmony import */ var _layers_Page__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./layers/Page */ "./Source/dom/layers/Page.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Page", function() { return _layers_Page__WEBPACK_IMPORTED_MODULE_14__["Page"]; });

/* harmony import */ var _layers_SymbolMaster__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./layers/SymbolMaster */ "./Source/dom/layers/SymbolMaster.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SymbolMaster", function() { return _layers_SymbolMaster__WEBPACK_IMPORTED_MODULE_15__["SymbolMaster"]; });

/* harmony import */ var _layers_SymbolInstance__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./layers/SymbolInstance */ "./Source/dom/layers/SymbolInstance.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SymbolInstance", function() { return _layers_SymbolInstance__WEBPACK_IMPORTED_MODULE_16__["SymbolInstance"]; });

/* harmony import */ var _layers_HotSpot__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./layers/HotSpot */ "./Source/dom/layers/HotSpot.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HotSpot", function() { return _layers_HotSpot__WEBPACK_IMPORTED_MODULE_17__["HotSpot"]; });

/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./enums */ "./Source/dom/enums.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Types", function() { return _enums__WEBPACK_IMPORTED_MODULE_18__["Types"]; });

/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fromNative", function() { return _wrapNativeObject__WEBPACK_IMPORTED_MODULE_19__["wrapObject"]; });





















var Flow = {
  AnimationType: _models_Flow__WEBPACK_IMPORTED_MODULE_0__["AnimationType"],
  BackTarget: _models_Flow__WEBPACK_IMPORTED_MODULE_0__["BackTarget"]
};
var version = {
  sketch: MSApplicationMetadata.metadata().appVersion,
  api: "2.0.0"
};

/***/ }),

/***/ "./Source/dom/layers/Artboard.js":
/*!***************************************!*\
  !*** ./Source/dom/layers/Artboard.js ***!
  \***************************************/
/*! exports provided: Artboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Artboard", function() { return Artboard; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Group */ "./Source/dom/layers/Group.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






/**
 * A Sketch artboard.
 */

var Artboard =
/*#__PURE__*/
function (_Group) {
  _inherits(Artboard, _Group);

  /**
   * Make a new artboard.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Artboard() {
    var artboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Artboard);

    if (!artboard.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      artboard.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].createNative(Artboard).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](0, 0, 100, 100).asCGRect());
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(Artboard).call(this, artboard));
  }
  /**
   * Adjust the Artboard to fit its children.
   * override the group's method
   */


  _createClass(Artboard, [{
    key: "adjustToFit",
    value: function adjustToFit() {
      this._object.resizeToFitChildren();

      return this;
    }
  }]);

  return Artboard;
}(_Group__WEBPACK_IMPORTED_MODULE_1__["Group"]);
Artboard.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].Artboard;
Artboard[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _Group__WEBPACK_IMPORTED_MODULE_1__["Group"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Artboard, MSArtboardGroup);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Artboard, MSImmutableArtboardGroup);
delete Artboard[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].flow;
delete Artboard[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].style;
delete Artboard[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].locked;
delete Artboard[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].hidden;
Artboard.define('flowStartPoint', {
  get: function get() {
    return !!this._object.isFlowHome();
  },
  set: function set(isFlowStartHome) {
    if (this.isImmutable()) {
      return;
    }

    this._object.isFlowHome = isFlowStartHome;
  }
});

/***/ }),

/***/ "./Source/dom/layers/Group.js":
/*!************************************!*\
  !*** ./Source/dom/layers/Group.js ***!
  \************************************/
/*! exports provided: Group */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Group", function() { return Group; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _StyledLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyledLayer */ "./Source/dom/layers/StyledLayer.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








/**
 * Represents a group of layers.
 */

var Group =
/*#__PURE__*/
function (_StyledLayer) {
  _inherits(Group, _StyledLayer);

  /**
   * Make a new group object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Group() {
    var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Group);

    if (!group.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      group.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].createNative(Group).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](0, 0, 100, 100).asCGRect());
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(Group).call(this, group));
  } // @deprecated


  _createClass(Group, [{
    key: "pageRectToLocalRect",
    value: function pageRectToLocalRect(rect) {
      console.warn('Group.pageRectToLocalRect(rect) is deprecated. Use rect.changeBasis({ to: group }) instead');
      return rect.changeBasis({
        to: this
      });
    }
    /**
     * Adjust the group to fit its children.
     */

  }, {
    key: "adjustToFit",
    value: function adjustToFit() {
      if (this.isImmutable()) {
        return this;
      }

      this._object.resizeToFitChildrenWithOption_(0);

      return this;
    }
  }]);

  return Group;
}(_StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"]);
Group.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].Group;
Group[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Group, MSLayerGroup);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Group, MSImmutableLayerGroup);
Group.define('layers', {
  get: function get() {
    return Object(_utils__WEBPACK_IMPORTED_MODULE_5__["toArray"])(this._object.layers()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_6__["wrapNativeObject"]);
  },
  set: function set(layers) {
    var _this = this;

    if (this.isImmutable()) {
      return;
    } // remove the existing layers


    Object(_utils__WEBPACK_IMPORTED_MODULE_5__["toArray"])(this._object.layers()).forEach(function (l) {
      return l.removeFromParent();
    });
    Object(_utils__WEBPACK_IMPORTED_MODULE_5__["toArray"])(layers).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_6__["wrapObject"]).forEach(function (layer) {
      layer.parent = _this; // eslint-disable-line
    });
  }
});

/***/ }),

/***/ "./Source/dom/layers/HotSpot.js":
/*!**************************************!*\
  !*** ./Source/dom/layers/HotSpot.js ***!
  \**************************************/
/*! exports provided: HotSpot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HotSpot", function() { return HotSpot; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Layer */ "./Source/dom/layers/Layer.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







/**
 * A Sketch HotSpot.
 */

var HotSpot =
/*#__PURE__*/
function (_Layer) {
  _inherits(HotSpot, _Layer);

  /**
   * Make a new hotspot.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function HotSpot() {
    var artboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HotSpot);

    if (!artboard.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      artboard.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].createNative(HotSpot).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](0, 0, 100, 100).asCGRect());
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(HotSpot).call(this, artboard));
  }

  _createClass(HotSpot, null, [{
    key: "fromLayer",
    value: function fromLayer(layer) {
      var wrappedObject = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(layer);

      if (!wrappedObject || !wrappedObject.flow || !wrappedObject.flow.targetId) {
        throw new Error('Can only create a HotSpot from a layer with an existing flow');
      }

      return new HotSpot({
        sketchObject: MSHotspotLayer.hotspotLayerFromLayer(wrappedObject.sketchObject)
      });
    }
  }]);

  return HotSpot;
}(_Layer__WEBPACK_IMPORTED_MODULE_1__["Layer"]);
HotSpot.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].HotSpot;
HotSpot[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _Layer__WEBPACK_IMPORTED_MODULE_1__["Layer"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(HotSpot, MSHotspotLayer);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(HotSpot, MSImmutableHotspotLayer);

/***/ }),

/***/ "./Source/dom/layers/Image.js":
/*!************************************!*\
  !*** ./Source/dom/layers/Image.js ***!
  \************************************/
/*! exports provided: Image */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return Image; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _StyledLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyledLayer */ "./Source/dom/layers/StyledLayer.js");
/* harmony import */ var _models_ImageData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/ImageData */ "./Source/dom/models/ImageData.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








/**
 * Represents an image layer.
 */

var Image =
/*#__PURE__*/
function (_StyledLayer) {
  _inherits(Image, _StyledLayer);

  /**
   * Make a new image layer object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Image() {
    var layer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Image);

    if (!layer.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      layer.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_5__["Factory"].createNative(Image).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_3__["Rectangle"](0, 0, 100, 100).asCGRect());
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this, layer));
  }

  return Image;
}(_StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"]);
Image.type = _enums__WEBPACK_IMPORTED_MODULE_4__["Types"].Image;
Image[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_5__["Factory"].registerClass(Image, MSBitmapLayer);
_Factory__WEBPACK_IMPORTED_MODULE_5__["Factory"].registerClass(Image, MSImmutableBitmapLayer);
Image.define('image', {
  get: function get() {
    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_6__["wrapObject"])(this._object.image());
  },
  set: function set(image) {
    if (this.isImmutable()) {
      return;
    }

    var imageData = _models_ImageData__WEBPACK_IMPORTED_MODULE_2__["ImageData"].from(image);

    this._object.setImage(imageData.sketchObject);
  }
});

/***/ }),

/***/ "./Source/dom/layers/Layer.js":
/*!************************************!*\
  !*** ./Source/dom/layers/Layer.js ***!
  \************************************/
/*! exports provided: Layer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Layer", function() { return Layer; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _models_Flow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/Flow */ "./Source/dom/models/Flow.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






/**
 * Abstract class that represents a Sketch layer.
 */

var Layer =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Layer, _WrappedObject);

  function Layer() {
    _classCallCheck(this, Layer);

    return _possibleConstructorReturn(this, _getPrototypeOf(Layer).apply(this, arguments));
  }

  _createClass(Layer, [{
    key: "duplicate",

    /**
     * Duplicate this layer.
     * A new identical layer will be inserted into the parent of this layer.
     *
     * @return {Layer} A new layer identical to this one.
     */
    value: function duplicate() {
      var object = this._object;
      var duplicate = object.copy();
      object.parentGroup().insertLayers_afterLayer([duplicate], object);
      return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapNativeObject"])(duplicate);
    }
    /**
     * Remove this layer from its parent.
     */

  }, {
    key: "remove",
    value: function remove() {
      if (this.isImmutable()) {
        return this;
      }

      var parent = this._object.parentGroup();

      if (parent) {
        parent.removeLayer(this._object);
      }

      return this;
    }
    /**
     * Move this layer to the front of its container.
     */

  }, {
    key: "moveToFront",
    value: function moveToFront() {
      if (this.isImmutable()) {
        return this;
      }

      MSLayerMovement.moveToFront([this._object]);
      return this;
    }
    /**
     * Move this layer forward in its container.
     */

  }, {
    key: "moveForward",
    value: function moveForward() {
      if (this.isImmutable()) {
        return this;
      }

      MSLayerMovement.moveForward([this._object]);
      return this;
    }
    /**
     * Move this layer to the back of its container.
     */

  }, {
    key: "moveToBack",
    value: function moveToBack() {
      if (this.isImmutable()) {
        return this;
      }

      MSLayerMovement.moveToBack([this._object]);
      return this;
    }
    /**
     * Move this layer backwards in its container.
     */

  }, {
    key: "moveBackward",
    value: function moveBackward() {
      if (this.isImmutable()) {
        return this;
      }

      MSLayerMovement.moveBackward([this._object]);
      return this;
    } // @deprecated

  }, {
    key: "localRectToPageRect",
    value: function localRectToPageRect(rect) {
      console.warn('Layer.layerRectToPageRect(rect) is deprecated. Use rect.changeBasis({ from: layer }) instead');
      return rect.changeBasis({
        from: this
      });
    } // @deprecated

  }, {
    key: "localRectToParentRect",
    value: function localRectToParentRect(rect) {
      console.warn('Layer.localRectToParentRect(rect) is deprecated. Use rect.changeBasis({ from: layer, to: layer.parent }) instead');
      return rect.changeBasis({
        from: this,
        to: this.parent
      });
    }
  }]);

  return Layer;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Layer[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_1__["Factory"].registerClass(Layer, MSLayer);
_Factory__WEBPACK_IMPORTED_MODULE_1__["Factory"].registerClass(Layer, MSImmutableLayer);
Layer.define('index', {
  exportable: false,

  /**
   * Return the index of this layer in it's container.
   * The layer at the back of the container (visually) will be layer 0. The layer at the front will be layer n - 1 (if there are n layers).
   *
   * @return {number} The layer order.
   */
  get: function get() {
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
  get: function get() {
    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapNativeObject"])(this._object.parentGroup());
  },
  set: function set(layer) {
    if (this.isImmutable()) {
      return;
    }

    if (this._object.parentGroup()) {
      this._object.removeFromParent();
    }

    layer = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(layer); // eslint-disable-line

    if (!layer) {
      // we want to remove the layer from its parent
      // without adding it somewhere else right away
      return;
    }

    if (!layer._object || typeof layer._object.addLayers !== 'function') {
      throw new Error("This object cannot accept layers: ".concat(layer));
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
  get: function get() {
    var f = this._object.frame();

    var rect = new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](f.x(), f.y(), f.width(), f.height());
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
  set: function set(value) {
    if (this.isImmutable()) {
      return;
    }

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
  get: function get() {
    return String(this._object.name());
  },

  /**
   * Set the name of the layer.
   *
   * @param {string} name The new name.
   */
  set: function set(value) {
    if (this.isImmutable()) {
      return;
    }

    this._object.setName(value);
  }
});
Layer.define('selected', {
  /**
   * Wether the layer is selected or not.
   *
   * @return {Boolean} selected.
   */
  get: function get() {
    // undefined when immutable
    return this._object.isSelected && !!this._object.isSelected();
  },
  set: function set(value) {
    if (this.isImmutable()) {
      return;
    }

    if (value) {
      this._object.select_byExtendingSelection(true, true);
    } else {
      this._object.select_byExtendingSelection(false, true);
    }
  }
});
Layer.define('flow', {
  get: function get() {
    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(this._object.flow());
  },
  set: function set(_flow) {
    if (this.isImmutable()) {
      return;
    }

    var flow = _models_Flow__WEBPACK_IMPORTED_MODULE_4__["Flow"].from(_flow);
    this._object.flow = flow.sketchObject;
  }
});
Layer.define('hidden', {
  get: function get() {
    return !this._object.isVisible();
  },
  set: function set(hidden) {
    if (this.isImmutable()) {
      return;
    }

    this._object.setIsVisible(!hidden);
  }
});
Layer.define('locked', {
  get: function get() {
    return !!this._object.isLocked();
  },
  set: function set(locked) {
    if (this.isImmutable()) {
      return;
    }

    this._object.setIsLocked(locked);
  }
});

/***/ }),

/***/ "./Source/dom/layers/Page.js":
/*!***********************************!*\
  !*** ./Source/dom/layers/Page.js ***!
  \***********************************/
/*! exports provided: Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Page", function() { return Page; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Group */ "./Source/dom/layers/Group.js");
/* harmony import */ var _models_Selection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Selection */ "./Source/dom/models/Selection.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







/**
 * Represents a Page in a Sketch document.
 */

var Page =
/*#__PURE__*/
function (_Group) {
  _inherits(Page, _Group);

  /**
   * Make a new page object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Page() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Page);

    if (!page.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      page.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].createNative(Page).alloc().init();
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(Page).call(this, page));
  } // eslint-disable-next-line


  _createClass(Page, [{
    key: "adjustToFit",
    value: function adjustToFit() {// obviously doesn't do anything
    }
  }, {
    key: "duplicate",
    value: function duplicate() {
      var object = this._object;
      var duplicate = object.copy();
      object.documentData().insertPage_afterPage(duplicate, object);
      return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapNativeObject"])(duplicate);
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this.isImmutable()) {
        return this;
      }

      this._object.documentData().removePages_detachInstances([this._object], true);

      return this;
    }
  }, {
    key: "moveToFront",
    value: function moveToFront() {
      // doesn't do anything
      return this;
    }
  }, {
    key: "moveToBack",
    value: function moveToBack() {
      // doesn't do anything
      return this;
    }
  }, {
    key: "moveForward",
    value: function moveForward() {
      // doesn't do anything
      return this;
    }
  }, {
    key: "moveBackward",
    value: function moveBackward() {
      // doesn't do anything
      return this;
    }
  }]);

  return Page;
}(_Group__WEBPACK_IMPORTED_MODULE_1__["Group"]);
Page.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].Page;
Page[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _Group__WEBPACK_IMPORTED_MODULE_1__["Group"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Page, MSPage);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Page, MSImmutablePage); // override setting up a flow which doesn't make sense for a Page

delete Page[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].flow;
delete Page[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].style;
delete Page[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].locked;
delete Page[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].hidden; // override setting up the parent as it's needs to a be a Document

Page.define('parent', {
  enumerable: false,
  exportable: false,
  get: function get() {
    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapNativeObject"])(this._object.documentData());
  },
  set: function set(document) {
    if (this.isImmutable()) {
      return;
    }

    document = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(document); // eslint-disable-line

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
  get: function get() {
    var ourLayer = this._object;
    return parseInt(ourLayer.parentGroup().indexOfLayer_(ourLayer), 10);
  }
});
Page.define('selected', {
  get: function get() {
    return this._object.documentData().currentPage() == this._object;
  },
  set: function set(value) {
    if (this.isImmutable()) {
      return;
    }

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
  get: function get() {
    return new _models_Selection__WEBPACK_IMPORTED_MODULE_2__["Selection"](this);
  }
});

/***/ }),

/***/ "./Source/dom/layers/Shape.js":
/*!************************************!*\
  !*** ./Source/dom/layers/Shape.js ***!
  \************************************/
/*! exports provided: Shape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Shape", function() { return Shape; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Group */ "./Source/dom/layers/Group.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





 // TODO: set and modify path

/**
 * Represents a shape group (which contains some layers with boolean ops).
 */

var Shape =
/*#__PURE__*/
function (_Group) {
  _inherits(Shape, _Group);

  /**
   * Make a new shape object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Shape() {
    var _this;

    var shape = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Shape);

    if (!shape.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      shape.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].createNative(Shape).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_4__["Rectangle"](0, 0, 100, 100).asCGRect());
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Shape).call(this, shape));

      var frame = _this._object.frame();

      _this.sketchObject.addLayer(MSRectangleShape.alloc().initWithFrame(CGRectMake(0, 0, frame.width(), frame.height())));
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Shape).call(this, shape));
    }

    return _possibleConstructorReturn(_this);
  }

  return Shape;
}(_Group__WEBPACK_IMPORTED_MODULE_1__["Group"]);
Shape.type = _enums__WEBPACK_IMPORTED_MODULE_2__["Types"].Shape;
Shape[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _Group__WEBPACK_IMPORTED_MODULE_1__["Group"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(Shape, MSShapeGroup);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(Shape, MSImmutableShapeGroup);

/***/ }),

/***/ "./Source/dom/layers/ShapePath.js":
/*!****************************************!*\
  !*** ./Source/dom/layers/ShapePath.js ***!
  \****************************************/
/*! exports provided: ShapePath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShapePath", function() { return ShapePath; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _StyledLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyledLayer */ "./Source/dom/layers/StyledLayer.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





 // TODO: set and modify path

/**
 * Represents a shape layer (a rectangle, oval, path, etc).
 */

var ShapePath =
/*#__PURE__*/
function (_StyledLayer) {
  _inherits(ShapePath, _StyledLayer);

  /**
   * Make a new shape object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function ShapePath() {
    var _this;

    var shape = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ShapePath);

    if (!shape.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      shape.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].createNative(ShapePath).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_4__["Rectangle"](0, 0, 100, 100).asCGRect());
      _this = _possibleConstructorReturn(this, _getPrototypeOf(ShapePath).call(this, shape));
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(ShapePath).call(this, shape));
    }

    return _possibleConstructorReturn(_this);
  }

  return ShapePath;
}(_StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"]);
ShapePath.type = _enums__WEBPACK_IMPORTED_MODULE_2__["Types"].ShapePath;
ShapePath[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSRectangleShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSShapePathLayer);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSImmutableShapePathLayer);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSOvalShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSPolygonShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSStarShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSTriangleShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSImmutableOvalShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSImmutablePolygonShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSImmutableRectangleShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSImmutableStarShape);
_Factory__WEBPACK_IMPORTED_MODULE_3__["Factory"].registerClass(ShapePath, MSImmutableTriangleShape);

/***/ }),

/***/ "./Source/dom/layers/StyledLayer.js":
/*!******************************************!*\
  !*** ./Source/dom/layers/StyledLayer.js ***!
  \******************************************/
/*! exports provided: StyledLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StyledLayer", function() { return StyledLayer; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _Layer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Layer */ "./Source/dom/layers/Layer.js");
/* harmony import */ var _style_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../style/Style */ "./Source/dom/style/Style.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _models_SharedStyle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/SharedStyle */ "./Source/dom/models/SharedStyle.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








/**
 * Represents a layer with style.
 */

var StyledLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(StyledLayer, _Layer);

  function StyledLayer() {
    _classCallCheck(this, StyledLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(StyledLayer).apply(this, arguments));
  }

  return StyledLayer;
}(_Layer__WEBPACK_IMPORTED_MODULE_2__["Layer"]);
StyledLayer[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _Layer__WEBPACK_IMPORTED_MODULE_2__["Layer"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_1__["Factory"].registerClass(StyledLayer, MSStyledLayer);
_Factory__WEBPACK_IMPORTED_MODULE_1__["Factory"].registerClass(StyledLayer, MSImmutableStyledLayer);
StyledLayer.define('style', {
  get: function get() {
    return _style_Style__WEBPACK_IMPORTED_MODULE_3__["Style"].fromNative(this._object.style());
  },
  set: function set(style) {
    if (this.isImmutable()) {
      return;
    } // we can then actually set the style


    if (Object(_utils__WEBPACK_IMPORTED_MODULE_4__["isNativeObject"])(style)) {
      this._object.style = style.copy();
    } else if (!style || !style.sketchObject) {
      this._object.style = new _style_Style__WEBPACK_IMPORTED_MODULE_3__["Style"](style).sketchObject;
    } else {
      this._object.style = style.sketchObject.copy();
    }
  }
});
StyledLayer.define('sharedStyleId', {
  get: function get() {
    var nativeSharedStyle = this._object.sharedStyleID();

    if (!nativeSharedStyle) {
      return null;
    }

    return String(nativeSharedStyle);
  },
  set: function set(sharedStyleId) {
    if (this.isImmutable()) {
      return;
    }

    if (!sharedStyleId) {
      this._object.setSharedStyleID(null);

      return;
    }

    this._object.setSharedStyleID(sharedStyleId);
  }
});
StyledLayer.define('sharedStyle', {
  enumerable: false,
  exportable: false,
  get: function get() {
    if (!this._object.sharedObject) {
      return null;
    }

    var nativeSharedStyle = this._object.sharedObject();

    if (!nativeSharedStyle) {
      return null;
    }

    return _models_SharedStyle__WEBPACK_IMPORTED_MODULE_5__["SharedStyle"].fromNative(nativeSharedStyle);
  },
  set: function set(sharedStyle) {
    if (this.isImmutable()) {
      return;
    }

    if (!sharedStyle) {
      this._object.setSharedStyleID(null);

      return;
    }

    var nativeSharedStyle = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_6__["wrapObject"])(sharedStyle);

    this._object.setSharedStyleID(nativeSharedStyle.id);
  }
});

/***/ }),

/***/ "./Source/dom/layers/SymbolInstance.js":
/*!*********************************************!*\
  !*** ./Source/dom/layers/SymbolInstance.js ***!
  \*********************************************/
/*! exports provided: SymbolInstance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymbolInstance", function() { return SymbolInstance; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _StyledLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyledLayer */ "./Source/dom/layers/StyledLayer.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _models_Override__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../models/Override */ "./Source/dom/models/Override.js");
/* harmony import */ var _models_ImageData__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../models/ImageData */ "./Source/dom/models/ImageData.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










/**
 * A Sketch symbol instance.
 */

var SymbolInstance =
/*#__PURE__*/
function (_StyledLayer) {
  _inherits(SymbolInstance, _StyledLayer);

  /**
   * Make a new symbol instance.
   */
  function SymbolInstance() {
    var master = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SymbolInstance);

    if (!master.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      master.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].createNative(SymbolInstance).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](0, 0, 100, 100).asCGRect());
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(SymbolInstance).call(this, master));
  } // Replaces the instance with a group that contains a copy of the Symbol this instance refers to. Returns null if the master contains no layers instead of inserting an empty group


  _createClass(SymbolInstance, [{
    key: "detach",
    value: function detach() {
      if (this.isImmutable()) {
        return null;
      }

      var group = this._object.detachByReplacingWithGroup();

      if (group) {
        return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(group);
      }

      return null;
    }
  }, {
    key: "setOverrideValue",
    value: function setOverrideValue(override, value) {
      if (this.isImmutable()) {
        return this;
      }

      var wrappedOverride = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(override);
      var overridePoint = wrappedOverride.sketchObject.overridePoint();

      if (wrappedOverride.property === 'image') {
        this._object.setValue_forOverridePoint(_models_ImageData__WEBPACK_IMPORTED_MODULE_8__["ImageData"].from(value).sketchObject, overridePoint);
      } else if (wrappedOverride.property === 'stringValue') {
        this._object.setValue_forOverridePoint(String(value), overridePoint);
      } else {
        this._object.setValue_forOverridePoint(value, overridePoint);
      }

      return this;
    }
  }]);

  return SymbolInstance;
}(_StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"]);
SymbolInstance.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].SymbolInstance;
SymbolInstance[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(SymbolInstance, MSSymbolInstance);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(SymbolInstance, MSImmutableSymbolInstance);
delete SymbolInstance[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].sharedStyle;
SymbolInstance.define('symbolId', {
  depends: 'parent',
  get: function get() {
    return String(this._object.symbolID());
  },
  set: function set(id) {
    if (this.isImmutable()) {
      return;
    } // we need to find the symbol master and change the master,
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
  get: function get() {
    var master = this._object.symbolMaster();

    if (master) {
      return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(this._object.symbolMaster());
    }

    return null; // this is a bit weird, if the instance is not inserted in the document, symbolMaster will be null
  },
  set: function set(master) {
    if (this.isImmutable()) {
      return;
    }

    var wrappedMaster = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(master);

    this._object.changeInstanceToSymbol(wrappedMaster.sketchObject);
  }
});
SymbolInstance.define('overrides', {
  get: function get() {
    var _this = this;

    // undefined when immutable
    if (!this._object.availableOverrides) {
      return undefined;
    }

    var overrides = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["toArray"])(this._object.availableOverrides()); // recursively find the overrides

    function findChildrenOverrides(instance) {
      var children = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["toArray"])(instance.children());
      children.forEach(function (c) {
        overrides.push(c);
        findChildrenOverrides(c);
      });
    }

    overrides.forEach(findChildrenOverrides);
    return overrides.map(function (o) {
      var wrapped = _models_Override__WEBPACK_IMPORTED_MODULE_7__["Override"].fromNative(o);
      Object.defineProperty(wrapped, '__symbolInstance', {
        writable: false,
        enumerable: false,
        value: _this
      });
      return wrapped;
    });
  },
  set: function set() {
    throw new Error('Cannot set the overrides directly. Set the value of each overrides instead.');
  }
});

/***/ }),

/***/ "./Source/dom/layers/SymbolMaster.js":
/*!*******************************************!*\
  !*** ./Source/dom/layers/SymbolMaster.js ***!
  \*******************************************/
/*! exports provided: SymbolMaster */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymbolMaster", function() { return SymbolMaster; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Artboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Artboard */ "./Source/dom/layers/Artboard.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








/**
 * A Sketch symbol master.
 */

var SymbolMaster =
/*#__PURE__*/
function (_Artboard) {
  _inherits(SymbolMaster, _Artboard);

  /**
   * Make a new symbol master.
   */
  function SymbolMaster() {
    var master = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SymbolMaster);

    if (!master.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      master.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].createNative(SymbolMaster).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](0, 0, 100, 100).asCGRect());
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(SymbolMaster).call(this, master));
  } // Replace the artboard with a symbol master


  _createClass(SymbolMaster, [{
    key: "toArtboard",
    // Replace the symbol with an artboard and detach all its instances converting them into groups.
    value: function toArtboard() {
      var artboard = MSSymbolMaster.convertSymbolToArtboard(this._object);
      return _Artboard__WEBPACK_IMPORTED_MODULE_1__["Artboard"].fromNative(artboard);
    } // Returns a new SymbolInstance linked to this artboard, ready for inserting in the document

  }, {
    key: "createNewInstance",
    value: function createNewInstance() {
      return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(this._object.newSymbolInstance());
    } // Returns all instances of the artboard in the document, on all pages

  }, {
    key: "getAllInstances",
    value: function getAllInstances() {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_6__["toArray"])(this._object.allInstances()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"]);
    }
  }, {
    key: "getLibrary",
    value: function getLibrary() {
      var libraryController = AppController.sharedInstance().librariesController();
      var lib = libraryController.libraryForShareableObject(this._object);

      if (!lib) {
        return null;
      }

      return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(lib);
    }
  }, {
    key: "syncWithLibrary",
    value: function syncWithLibrary() {
      if (this.isImmutable()) {
        return false;
      }

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
    }
  }, {
    key: "unlinkFromLibrary",
    value: function unlinkFromLibrary() {
      if (this.isImmutable()) {
        return false;
      }

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
    }
  }], [{
    key: "fromArtboard",
    value: function fromArtboard(artboard) {
      var wrappedArtboard = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(artboard);
      return SymbolMaster.fromNative(MSSymbolMaster.convertArtboardToSymbol(wrappedArtboard.sketchObject));
    }
  }]);

  return SymbolMaster;
}(_Artboard__WEBPACK_IMPORTED_MODULE_1__["Artboard"]);
SymbolMaster.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].SymbolMaster;
SymbolMaster[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _Artboard__WEBPACK_IMPORTED_MODULE_1__["Artboard"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(SymbolMaster, MSSymbolMaster);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(SymbolMaster, MSImmutableSymbolMaster);
SymbolMaster.define('symbolId', {
  get: function get() {
    return String(this._object.symbolID());
  },
  set: function set() {
    throw new Error('Changing the symbol ID of a SymbolMaster is forbidden.');
  }
});

/***/ }),

/***/ "./Source/dom/layers/Text.js":
/*!***********************************!*\
  !*** ./Source/dom/layers/Text.js ***!
  \***********************************/
/*! exports provided: TextLineSpacingBehaviourMap, TextAlignmentMap, Text */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextLineSpacingBehaviourMap", function() { return TextLineSpacingBehaviourMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextAlignmentMap", function() { return TextAlignmentMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _StyledLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyledLayer */ "./Source/dom/layers/StyledLayer.js");
/* harmony import */ var _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Rectangle */ "./Source/dom/models/Rectangle.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var TextBehaviour = {
  flexibleWidth: 0,
  // Width is adjusted to fit the content.
  fixedWidth: 1 // Width is fixed.

};
var TextLineSpacingBehaviour = {
  variable: 'variable',
  // Uses min & max line height on paragraph style
  constantBaseline: 'constantBaseline' // Uses MSConstantBaselineTypesetter for fixed line height

};
var TextLineSpacingBehaviourMap = {
  variable: 1,
  // Uses min & max line height on paragraph style
  constantBaseline: 2 // Uses MSConstantBaselineTypesetter for fixed line height
  // Mapping between text alignment names and values.

};
var TextAlignment = {
  left: 'left',
  // Visually left aligned
  right: 'right',
  // Visually right aligned
  center: 'center',
  // Visually centered
  justified: 'justified',
  // Fully-justified. The last line in a paragraph is natural-aligned.
  natural: 'natural' // Indicates the default alignment for script

};
var TextAlignmentMap = {
  left: 0,
  // Visually left aligned
  right: 1,
  // Visually right aligned
  center: 2,
  // Visually centered
  justified: 3,
  // Fully-justified. The last line in a paragraph is natural-aligned.
  natural: 4 // Indicates the default alignment for script

  /**
   * Represents a text layer.
   */

};
var Text =
/*#__PURE__*/
function (_StyledLayer) {
  _inherits(Text, _StyledLayer);

  /**
   * Make a new text object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Text() {
    var _this;

    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Text);

    if (!text.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      text.sketchObject = _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].createNative(Text).alloc().initWithFrame(new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](0, 0, 100, 100).asCGRect());
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, text));

    _this.adjustToFit();

    return _this;
  }
  /**
   * Set the font of the layer to an NSFont object.
   *
   * @param {NSFont} value The font to use.
   */


  _createClass(Text, [{
    key: "adjustToFit",

    /**
     * Adjust the frame of the layer to fit its contents.
     */
    value: function adjustToFit() {
      if (this.isImmutable()) {
        return this;
      }

      this._object.adjustFrameToFit();

      return this;
    }
    /**
     * Return a list of the text fragments for the text.
     *
     * @return {array} The line fragments. Each one is a dictionary containing a rectangle, and a baseline offset.
     */

  }, {
    key: "font",
    set: function set(value) {
      if (this.isImmutable()) {
        return;
      }

      this._object.font = value;
    }
    /**
     * Set the font of the layer to the system font at a given size.
     *
     * @param {number} size The system font size to use.
     */

  }, {
    key: "systemFontSize",
    set: function set(size) {
      if (this.isImmutable()) {
        return;
      }

      this._object.setFont(NSFont.systemFontOfSize_(size));
    }
  }, {
    key: "fragments",
    get: function get() {
      var textLayer = this._object;
      var storage = this.isImmutable() ? textLayer.createTextStorage() : textLayer.immutableModelObject().createTextStorage();
      var layout = storage.layoutManagers().firstObject();
      var glyphRangeStorage = NSMakeRange(0, 0);
      var actualCharacterRangePtr = MOPointer.new(glyphRangeStorage);
      var charRange = NSMakeRange(0, storage.length());
      var drawingPoint = textLayer.drawingPointForText();
      layout.glyphRangeForCharacterRange_actualCharacterRange_(charRange, actualCharacterRangePtr);
      var glyphRange = actualCharacterRangePtr.value();
      var fragments = [];
      var currentLocation = 0;

      while (currentLocation < NSMaxRange(glyphRange)) {
        var effectiveRangeStorage = NSMakeRange(0, 0);
        var effectiveRangePtr = MOPointer.new(effectiveRangeStorage);
        var localRect = layout.lineFragmentRectForGlyphAtIndex_effectiveRange_(currentLocation, effectiveRangePtr);
        var rect = new _models_Rectangle__WEBPACK_IMPORTED_MODULE_2__["Rectangle"](localRect.origin.x + drawingPoint.x, localRect.origin.y + drawingPoint.y, localRect.size.width, localRect.size.height);
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
    }
  }]);

  return Text;
}(_StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"]);
Text.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].Text;
Text[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _StyledLayer__WEBPACK_IMPORTED_MODULE_1__["StyledLayer"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Text, MSTextLayer);
_Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Text, MSImmutableTextLayer);
Text.define('text', {
  get: function get() {
    return String(this._object.stringValue());
  },

  /**
   * Set the text of the layer.
   * If the layer hasn't explicitly been given a name, this will also change
   * the layer's name to the text value.
   *
   * @param {string} value The text to use.
   */
  set: function set(value) {
    if (this.isImmutable()) {
      return;
    }

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
  get: function get() {
    var raw = this._object.textAlignment();

    return Object.keys(TextAlignmentMap).find(function (key) {
      return TextAlignmentMap[key] === raw;
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
  set: function set(mode) {
    if (this.isImmutable()) {
      return;
    }

    var translated = TextAlignmentMap[mode];
    this._object.textAlignment = typeof translated !== 'undefined' ? translated : mode;
  }
});
Text.LineSpacing = TextLineSpacingBehaviour;
Text.define('lineSpacing', {
  get: function get() {
    var raw = this._object.lineSpacingBehaviour();

    return Object.keys(TextLineSpacingBehaviourMap).find(function (key) {
      return TextLineSpacingBehaviourMap[key] === raw;
    }) || raw;
  },
  set: function set(mode) {
    if (this.isImmutable()) {
      return;
    }

    var translated = TextLineSpacingBehaviourMap[mode];
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
  get: function get() {
    return this._object.textBehaviour() === TextBehaviour.fixedWidth;
  },
  set: function set(fixed) {
    if (this.isImmutable()) {
      return;
    }

    if (fixed) {
      this._object.textBehaviour = TextBehaviour.fixedWidth;
    } else {
      this._object.textBehaviour = TextBehaviour.flexibleWidth;
    }
  }
});

/***/ }),

/***/ "./Source/dom/layers/__tests__/Artboard.test.js":
/*!******************************************************!*\
  !*** ./Source/dom/layers/__tests__/Artboard.test.js ***!
  \******************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create an artboard', function () {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test'
  }); // check that an artboard can be logged

  log(artboard);
  expect(artboard.type).toBe('Artboard');
});
test('should set the artboard as a flow start point', function () {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test',
    flowStartPoint: true
  });
  expect(artboard.flowStartPoint).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/Group.test.js":
/*!***************************************************!*\
  !*** ./Source/dom/layers/__tests__/Group.test.js ***!
  \***************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should return the layers and can iterate through them', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  });
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    parent: page
  }); // eslint-disable-line

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
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page,
    frame: new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](100, 100, 100, 100)
  });
  var local = group.pageRectToLocalRect(new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](125, 75, 50, 200));
  expect(local).toEqual(new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](25, -25, 50, 200));
});
test('should adjust the frame to fit its layers', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page,
    frame: new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](100, 100, 100, 100)
  });
  var shape = new ___WEBPACK_IMPORTED_MODULE_0__["Shape"]({
    parent: group,
    frame: new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](50, 50, 50, 50)
  });
  group.adjustToFit();
  expect(shape.parent).toEqual(group);
  expect(group.frame).toEqual(new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](150, 150, 50, 50));
});
test('should create a group', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  }); // check that a group can be logged

  log(group);
  expect(group.type).toBe('Group');
});
test('should create a group with some layers', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page,
    layers: [{
      type: 'Text',
      text: 'hello world'
    }]
  });
  expect(group.layers[0].type).toBe('Text');
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/HotSpot.test.js":
/*!*****************************************************!*\
  !*** ./Source/dom/layers/__tests__/HotSpot.test.js ***!
  \*****************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a new HotSpot', function () {
  var hotspot = new ___WEBPACK_IMPORTED_MODULE_0__["HotSpot"](); // check that a hotspot can be logged

  log(hotspot);
  expect(hotspot.type).toEqual('HotSpot');
});
test('should create a new HotSpot from a layer', function (context, document) {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1',
    parent: document.selectedPage
  });
  var artboard2 = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test2',
    parent: document.selectedPage
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: artboard,
    flow: {
      targetId: artboard2.id
    }
  });
  var hotspot = ___WEBPACK_IMPORTED_MODULE_0__["HotSpot"].fromLayer(rect);
  expect(rect.flow).toBe(null);
  expect(hotspot.type).toEqual('HotSpot');
  expect(hotspot.flow.toJSON()).toEqual({
    targetId: artboard2.id,
    type: 'Flow',
    animationType: 'slideFromRight'
  });
});
test('should throw an error when trying to create a new HotSpot from a layer without flow', function (context, document) {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1',
    parent: document.selectedPage
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: artboard
  });

  try {
    ___WEBPACK_IMPORTED_MODULE_0__["HotSpot"].fromLayer(rect);
    expect(false).toBe(true);
  } catch (err) {
    expect(err.message).toMatch('Can only create a HotSpot from a layer with an existing flow');
  }
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/Image.test.js":
/*!***************************************************!*\
  !*** ./Source/dom/layers/__tests__/Image.test.js ***!
  \***************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create an empty image', function (context, document) {
  var page = document.selectedPage;
  var image = new ___WEBPACK_IMPORTED_MODULE_0__["Image"]({
    parent: page
  }); // check that an image can be logged

  log(image);
  expect(image.type).toBe('Image');
  expect(image.parent).toEqual(page);
  expect(image.image).toBe(null);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/Layer.test.js":
/*!***************************************************!*\
  !*** ./Source/dom/layers/__tests__/Layer.test.js ***!
  \***************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should set the name of the layer', function (context, document) {
  // setting an existing name
  var page = document.selectedPage;
  page.name = 'This is a page';
  expect(page.name).toBe('This is a page'); // setting a name when creating a component

  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    name: 'blah'
  });
  expect(group.name).toBe('blah'); // default name

  var group2 = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]();
  expect(group2.name).toBe('Group');
});
test('should set the frame of the layer', function () {
  var frame = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](10, 10, 20, 20);
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    frame: frame
  });
  expect(group.frame).toEqual(frame);
  var newFrame = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](10, 10, 20, 20);
  group.frame = newFrame;
  expect(group.frame).toEqual(newFrame);
});
test('mutating a frame should change the frame of a layer', function () {
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]();
  expect(group.frame.width).toBe(100);
  group.frame.width = 400;
  expect(group.frame.width).toBe(400);
});
test('should duplicate the layer and add it as a sibling', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  });
  expect(page.layers.length).toBe(1);
  var result = group.duplicate();
  expect(page.layers.length).toBe(2);
  expect(result.type).toBe('Group');
});
test('should remove the layer from its parent', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  });
  expect(page.layers.length).toBe(1);
  var result = group.remove();
  expect(page.layers.length).toBe(0);
  expect(result).toEqual(group);
});
test('should select the layer', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  }); // start with nothing selected

  expect(group.selected).toBe(false);
  expect(page.selectedLayers.isEmpty).toBe(true); // select a layer

  group.selected = true;
  expect(page.selectedLayers.isEmpty).toBe(false); // deselect it - should go back to nothing selected

  group.selected = false;
  expect(page.selectedLayers.isEmpty).toBe(true); // select one layer then another - they both should be selected

  var group2 = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page,
    selected: true
  });
  group.selected = true;
  expect(group2.selected).toBe(true);
  expect(page.selectedLayers.length).toBe(2);
});
test('should be able to add the layer to a group', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  });
  expect(group.parent).toEqual(page);
  expect(group.parent.layers[0]).toEqual(group);
  var group2 = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]();
  group2.parent = page;
  expect(group2.parent).toEqual(page);
});
test('should reorder the layers', function (context, document) {
  var page = document.selectedPage;
  var group1 = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  });
  var group2 = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page
  });
  var group3 = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
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
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page,
    frame: {
      x: 100,
      y: 50,
      width: 10,
      height: 10
    }
  });
  var parentRect = group.localRectToParentRect(new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"]({
    x: 10,
    y: 10,
    width: 10,
    height: 10
  }));
  expect(parentRect.toJSON()).toEqual({
    x: 110,
    y: 60,
    width: 10,
    height: 10
  });
  var pageRect = group.localRectToPageRect(new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"]({
    x: 10,
    y: 10,
    width: 10,
    height: 10
  }));
  expect(pageRect.toJSON()).toEqual({
    x: 110,
    y: 60,
    width: 10,
    height: 10
  });
});
test('should hide the layer', function () {
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]();
  expect(group.hidden).toBe(false);
  group.hidden = true;
  expect(group.hidden).toBe(true);
});
test('should lock the layer', function () {
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]();
  expect(group.locked).toBe(false);
  group.locked = true;
  expect(group.locked).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/Page.test.js":
/*!**************************************************!*\
  !*** ./Source/dom/layers/__tests__/Page.test.js ***!
  \**************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should return a Selection with the selected layers of the page', function (context, document) {
  var page = document.selectedPage; // check that an artboard can be logged

  log(page);
  var selection = page.selectedLayers;
  expect(selection.isEmpty).toBe(true);
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page,
    name: 'Test',
    selected: true
  });
  expect(group.selected).toBe(true);
  expect(selection.isEmpty).toBe(false);
});
test('should create a page', function (context, document) {
  var page = new ___WEBPACK_IMPORTED_MODULE_0__["Page"]({
    parent: document
  });
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/Shape.test.js":
/*!***************************************************!*\
  !*** ./Source/dom/layers/__tests__/Shape.test.js ***!
  \***************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a new shape', function () {
  var shape = new ___WEBPACK_IMPORTED_MODULE_0__["Shape"](); // check that a shape can be logged

  log(shape);
  expect(shape.type).toBe('Shape');
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/ShapePath.test.js":
/*!*******************************************************!*\
  !*** ./Source/dom/layers/__tests__/ShapePath.test.js ***!
  \*******************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a new shape path', function () {
  var shapePath = new ___WEBPACK_IMPORTED_MODULE_0__["ShapePath"](); // check that a shapePath can be logged

  log(shapePath);
  expect(shapePath.type).toBe('ShapePath');
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/StyledLayer.test.js":
/*!*********************************************************!*\
  !*** ./Source/dom/layers/__tests__/StyledLayer.test.js ***!
  \*********************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should get a style', function () {
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Shape"]();
  expect(group.style.type).toBe('Style');
});
test('should create a Layer with a style property', function () {
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Shape"]({
    style: {
      fills: []
    }
  });
  expect(group.style.type).toBe('Style');
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/SymbolInstance.test.js":
/*!************************************************************!*\
  !*** ./Source/dom/layers/__tests__/SymbolInstance.test.js ***!
  \************************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../test-utils */ "./Source/test-utils.ts");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* globals expect, test */

/* eslint-disable no-param-reassign */


var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a instance by setting the master property', function (context, document) {
  var _createSymbolMaster = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSymbolMaster"])(document),
      master = _createSymbolMaster.master;

  var instance = new ___WEBPACK_IMPORTED_MODULE_0__["SymbolInstance"]({
    master: master
  }); // check that an instance can be logged

  log(instance);
  expect(instance.type).toBe('SymbolInstance');
  expect(instance.master).toBe(null); // by default, it's not anywhere in the document

  expect(master.getAllInstances()).toEqual([]); // add the instance to the page

  document.selectedPage.layers = document.selectedPage.layers.concat(instance);
  expect(master.getAllInstances()).toEqual([instance]);
  expect(instance.master).toEqual(master);
});
test('should create a instance by setting the symbolId property', function (context, document) {
  var _createSymbolMaster2 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSymbolMaster"])(document),
      master = _createSymbolMaster2.master;

  var instance = new ___WEBPACK_IMPORTED_MODULE_0__["SymbolInstance"]({
    symbolId: master.symbolId,
    parent: document.selectedPage
  });
  expect(instance.type).toBe('SymbolInstance');
  expect(master.getAllInstances()).toEqual([instance]);
  expect(instance.master).toEqual(master);
});
test('should have overrides', function (context, document) {
  var _createSymbolMaster3 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSymbolMaster"])(document),
      master = _createSymbolMaster3.master,
      text = _createSymbolMaster3.text;

  var instance = master.createNewInstance();
  document.selectedPage.layers = document.selectedPage.layers.concat(instance);
  expect(instance.overrides.length).toBe(1);
  var override = instance.overrides[0];
  expect(override.toJSON()).toEqual({
    type: 'Override',
    id: "".concat(text.id, "_stringValue"),
    path: text.id,
    property: 'stringValue',
    symbolOverride: false,
    value: 'Test value',
    isDefault: true,
    affectedLayer: _objectSpread({}, text.toJSON(), {
      selected: undefined,
      style: instance.overrides[0].affectedLayer.style.toJSON()
    })
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/SymbolMaster.test.js":
/*!**********************************************************!*\
  !*** ./Source/dom/layers/__tests__/SymbolMaster.test.js ***!
  \**********************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../test-utils */ "./Source/test-utils.ts");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* globals expect, test */

/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/named


var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a symbol master from an artboard', function (context, document) {
  // build the symbol master
  var _createSymbolMaster = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSymbolMaster"])(document),
      master = _createSymbolMaster.master; // check that a master can be logged


  log(master);
  expect(master.type).toBe('SymbolMaster');
  expect(document.getSymbolMasterWithID(master.symbolId)).toEqual(master);
});
test('should replace a symbol master by an artboard', function (context, document) {
  // build the symbol master
  var _createSymbolMaster2 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSymbolMaster"])(document),
      master = _createSymbolMaster2.master;

  expect(master.type).toBe('SymbolMaster');
  expect(document.getSymbolMasterWithID(master.symbolId)).toEqual(master);
  var artboard = master.toArtboard();
  expect(document.getSymbolMasterWithID(master.symbolId)).toBe(undefined);
  expect(artboard.type).toBe('Artboard');
});
test('should create a symbol instance from a master', function (context, document) {
  // build the symbol master
  var _createSymbolMaster3 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSymbolMaster"])(document),
      master = _createSymbolMaster3.master;

  expect(master.getAllInstances()).toEqual([]); // create an instance

  var instance = master.createNewInstance();
  expect(instance.type).toBe('SymbolInstance');
  expect(instance.master).toBe(null); // by default, it's not anywhere in the document

  expect(master.getAllInstances()).toEqual([]); // add the instance to the page

  document.selectedPage.layers = document.selectedPage.layers.concat(instance);
  expect(master.getAllInstances()).toEqual([instance]);
  expect(instance.master).toEqual(master);
});
test('should create a symbol master with a nested symbol', function (context, document) {
  // build the first symbol master
  var _createSymbolMaster4 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSymbolMaster"])(document),
      nestedMaster = _createSymbolMaster4.master,
      text = _createSymbolMaster4.text;

  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test2',
    parent: document.selectedPage
  });
  var text2 = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'Test value 2'
  });
  var nestedInstance = nestedMaster.createNewInstance();
  artboard.layers = [nestedInstance, text2];
  var master = ___WEBPACK_IMPORTED_MODULE_0__["SymbolMaster"].fromArtboard(artboard);
  var instance = master.createNewInstance(); // add the instance to the page

  document.selectedPage.layers = document.selectedPage.layers.concat(instance);
  expect(instance.overrides.length).toBe(3);
  expect(instance.overrides[0].toJSON()).toEqual({
    type: 'Override',
    id: "".concat(nestedInstance.id, "_symbolID"),
    path: nestedInstance.id,
    property: 'symbolID',
    symbolOverride: true,
    value: nestedInstance.symbolId,
    isDefault: true,
    affectedLayer: _objectSpread({}, nestedInstance.toJSON(), {
      overrides: undefined,
      selected: undefined,
      style: instance.overrides[0].affectedLayer.style.toJSON()
    })
  });
  expect(instance.overrides[1].toJSON()).toEqual({
    type: 'Override',
    id: "".concat(text2.id, "_stringValue"),
    path: text2.id,
    property: 'stringValue',
    symbolOverride: false,
    value: 'Test value 2',
    isDefault: true,
    affectedLayer: _objectSpread({}, text2.toJSON(), {
      selected: undefined,
      style: instance.overrides[1].affectedLayer.style.toJSON()
    })
  });
  expect(instance.overrides[2].toJSON()).toEqual({
    type: 'Override',
    id: "".concat(nestedInstance.id, "/").concat(text.id, "_stringValue"),
    path: "".concat(nestedInstance.id, "/").concat(text.id),
    property: 'stringValue',
    symbolOverride: false,
    value: 'Test value',
    isDefault: true,
    affectedLayer: _objectSpread({}, text.toJSON(), {
      selected: undefined,
      style: instance.overrides[2].affectedLayer.style.toJSON()
    })
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/layers/__tests__/Text.test.js":
/*!**************************************************!*\
  !*** ./Source/dom/layers/__tests__/Text.test.js ***!
  \**************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Text */ "./Source/dom/layers/Text.js");
/* globals expect, test */


var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a Text layer', function () {
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"](); // check that a text can be logged

  log(text);
  expect(text.type).toBe('Text');
});
test('should be able to change the text value', function () {
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'blah'
  });
  expect(text.text).toBe('blah');
  text.text = 'doodah';
  expect(text.text).toBe('doodah');
});
test('should adjust its size to the string with `adjustToFit`', function () {
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'blah',
    frame: new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](10, 10, 1000, 1000)
  });
  text.adjustToFit();
  expect(text.frame).toEqual(new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](10, 10, 23, 14));
});
test('should change the text alignment', function () {
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'blah',
    frame: new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](10, 10, 1000, 1000)
  }); // default to left

  expect(text.alignment).toBe(___WEBPACK_IMPORTED_MODULE_0__["Text"].Alignment.left);
  Object.keys(___WEBPACK_IMPORTED_MODULE_0__["Text"].Alignment).forEach(function (key) {
    // test setting by name
    text.alignment = key;
    expect(text.alignment).toBe(___WEBPACK_IMPORTED_MODULE_0__["Text"].Alignment[key]); // test setting by value

    text.alignment = _Text__WEBPACK_IMPORTED_MODULE_1__["TextAlignmentMap"][key];
    expect(text.alignment).toBe(___WEBPACK_IMPORTED_MODULE_0__["Text"].Alignment[key]);
  });
});
test('should change the line spacing behavior', function () {
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'blah',
    frame: new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](10, 10, 1000, 1000)
  }); // default to constant baseline

  expect(text.lineSpacing).toBe(___WEBPACK_IMPORTED_MODULE_0__["Text"].LineSpacing.constantBaseline);
  Object.keys(___WEBPACK_IMPORTED_MODULE_0__["Text"].LineSpacing).forEach(function (key) {
    // test setting by name
    text.lineSpacing = key;
    expect(text.lineSpacing).toBe(___WEBPACK_IMPORTED_MODULE_0__["Text"].LineSpacing[key]); // test setting by value

    text.lineSpacing = _Text__WEBPACK_IMPORTED_MODULE_1__["TextLineSpacingBehaviourMap"][key];
    expect(text.lineSpacing).toBe(___WEBPACK_IMPORTED_MODULE_0__["Text"].LineSpacing[key]);
  });
});
test('should fix the width', function () {
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'blah',
    frame: new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](10, 10, 1000, 1000)
  }); // default to true

  expect(text.fixedWidth).toBe(false);
  text.fixedWidth = true;
  expect(text.fixedWidth).toBe(true);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/models/DataOverride.js":
/*!*******************************************!*\
  !*** ./Source/dom/models/DataOverride.js ***!
  \*******************************************/
/*! exports provided: DataOverride */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataOverride", function() { return DataOverride; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _Override__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Override */ "./Source/dom/models/Override.js");
/* harmony import */ var _layers_SymbolInstance__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../layers/SymbolInstance */ "./Source/dom/layers/SymbolInstance.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






/**
 * An MSDataOverride. This is not exposed, only used by sketch.fromNative
 */

var DataOverride =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(DataOverride, _WrappedObject);

  function DataOverride() {
    _classCallCheck(this, DataOverride);

    return _possibleConstructorReturn(this, _getPrototypeOf(DataOverride).apply(this, arguments));
  }

  return DataOverride;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
DataOverride.type = _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].DataOverride;
DataOverride[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);

if (typeof MSDataOverride !== 'undefined') {
  _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(DataOverride, MSDataOverride);
}

DataOverride.define('override', {
  get: function get() {
    return _Override__WEBPACK_IMPORTED_MODULE_3__["Override"].fromNative(this._object.availableOverride());
  }
});
DataOverride.define('symbolInstance', {
  get: function get() {
    return _layers_SymbolInstance__WEBPACK_IMPORTED_MODULE_4__["SymbolInstance"].fromNative(this._object.symbolInstance());
  }
});
DataOverride.define('id', {
  exportable: true,
  importable: false,
  get: function get() {
    return String(this._object.overrideIdentifier());
  }
});

/***/ }),

/***/ "./Source/dom/models/Document.js":
/*!***************************************!*\
  !*** ./Source/dom/models/Document.js ***!
  \***************************************/
/*! exports provided: SaveModeType, getDocuments, getSelectedDocument, Document */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SaveModeType", function() { return SaveModeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDocuments", function() { return _getDocuments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectedDocument", function() { return _getSelectedDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Document", function() { return Document; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _layers_Page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layers/Page */ "./Source/dom/layers/Page.js");
/* harmony import */ var _Selection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Selection */ "./Source/dom/models/Selection.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _SharedStyle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SharedStyle */ "./Source/dom/models/SharedStyle.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }









var SaveModeType = {
  Save: NSSaveOperation,
  SaveTo: NSSaveToOperation,
  SaveAs: NSSaveAsOperation
  /* eslint-disable no-use-before-define, typescript/no-use-before-define */

};

function _getDocuments() {
  var app = NSDocumentController.sharedDocumentController();
  return Object(_utils__WEBPACK_IMPORTED_MODULE_3__["toArray"])(app.documents()).map(Document.fromNative.bind(Document));
}



function _getSelectedDocument() {
  var app = NSDocumentController.sharedDocumentController();
  var nativeDocument = app.currentDocument();

  if (!nativeDocument) {
    return undefined;
  }

  return Document.fromNative(nativeDocument);
}
/* eslint-enable */

/**
 * A Sketch document.
 */



var Document =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Document, _WrappedObject);

  /**
   * Make a new document object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Document() {
    var document = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Document);

    if (!document.sketchObject) {
      var app = NSDocumentController.sharedDocumentController();
      var error = MOPointer.alloc().init(); // eslint-disable-next-line no-param-reassign

      document.sketchObject = app.openUntitledDocumentAndDisplay_error(true, error);

      if (error.value() !== null) {
        throw new Error(error.value());
      }

      if (!document.sketchObject) {
        throw new Error('could not create a new Document');
      }
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(Document).call(this, document));
  }

  _createClass(Document, [{
    key: "_getMSDocument",
    value: function _getMSDocument() {
      var msdocument = this._object;

      if (msdocument && String(msdocument.class()) === 'MSDocumentData') {
        // we only have an MSDocumentData instead of a MSDocument
        // let's try to get back to the MSDocument
        msdocument = msdocument.delegate();
      }

      return msdocument;
    }
  }, {
    key: "_getMSDocumentData",
    value: function _getMSDocumentData() {
      var msdocument = this._object;

      if (msdocument && (String(msdocument.class()) === 'MSDocumentData' || String(msdocument.class()) === 'MSImmutableDocumentData')) {
        return msdocument;
      }

      return msdocument.documentData();
    }
  }, {
    key: "getLayerWithID",

    /**
     * Find the first layer in this document which has the given id.
     *
     * @return {Layer} A layer object, if one was found.
     */
    value: function getLayerWithID(layerId) {
      var documentData = this._getMSDocumentData();

      var layer = documentData.layerWithID(layerId);

      if (layer) {
        return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"])(layer);
      }

      return undefined;
    }
    /**
     * Find all the layers in this document which has the given name.
     */

  }, {
    key: "getLayersNamed",
    value: function getLayersNamed(layerName) {
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

      return Object(_utils__WEBPACK_IMPORTED_MODULE_3__["toArray"])(filteredArray).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"]);
    }
    /**
     * Find the first symbol master in this document which has the given id.
     *
     * @return {SymbolMaster} A symbol master object, if one was found.
     */

  }, {
    key: "getSymbolMasterWithID",
    value: function getSymbolMasterWithID(symbolId) {
      var documentData = this._getMSDocumentData();

      var symbol = documentData.symbolWithID(symbolId);

      if (symbol) {
        return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"])(symbol);
      }

      return undefined;
    }
  }, {
    key: "getSymbols",
    value: function getSymbols() {
      var documentData = this._getMSDocumentData();

      return Object(_utils__WEBPACK_IMPORTED_MODULE_3__["toArray"])(documentData.allSymbols()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"]);
    }
  }, {
    key: "_getSharedStyleWithIdAndType",
    value: function _getSharedStyleWithIdAndType(sharedId, type) {
      var documentData = this._getMSDocumentData();

      var sharedStyle = documentData[type === _SharedStyle__WEBPACK_IMPORTED_MODULE_7__["SharedStyleType"].Layer ? 'layerStyleWithID' : 'textStyleWithID'](sharedId);

      if (sharedStyle) {
        return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"])(sharedStyle);
      }

      return undefined;
    }
  }, {
    key: "getSharedLayerStyleWithID",
    value: function getSharedLayerStyleWithID(sharedId) {
      return this._getSharedStyleWithIdAndType(sharedId, _SharedStyle__WEBPACK_IMPORTED_MODULE_7__["SharedStyleType"].Layer);
    }
  }, {
    key: "getSharedLayerStyles",
    value: function getSharedLayerStyles() {
      var documentData = this._getMSDocumentData();

      return Object(_utils__WEBPACK_IMPORTED_MODULE_3__["toArray"])(documentData.allLayerStyles()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"]);
    }
  }, {
    key: "getSharedTextStyleWithID",
    value: function getSharedTextStyleWithID(sharedId) {
      return this._getSharedStyleWithIdAndType(sharedId, _SharedStyle__WEBPACK_IMPORTED_MODULE_7__["SharedStyleType"].Text);
    }
  }, {
    key: "getSharedTextStyles",
    value: function getSharedTextStyles() {
      var documentData = this._getMSDocumentData();

      return Object(_utils__WEBPACK_IMPORTED_MODULE_3__["toArray"])(documentData.allTextStyles()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"]);
    }
    /**
     * Center the view of the document window on a given layer.
     *
     * @param {Layer} layer The layer to center on.
     */

  }, {
    key: "centerOnLayer",
    value: function centerOnLayer(layer) {
      if (this.isImmutable()) {
        return;
      }

      var wrappedLayer = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"])(layer);

      this._object.contentDrawView().centerRect_(wrappedLayer.sketchObject.rect());
    }
  }, {
    key: "save",
    value: function save(path, options, callback) {
      /* eslint-disable no-param-reassign */
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else if (typeof path === 'function') {
        callback = path;
        options = {};
        path = undefined;
      }
      /* eslint-enable */


      var msdocument = this._getMSDocument();

      var saveMethod = 'saveToURL_ofType_forSaveOperation_completionHandler';

      if (!msdocument || !msdocument[saveMethod]) {
        if (callback) callback(new Error('Cannot save this document'), this);
        return;
      }

      if (!path && !this._tempURL) {
        try {
          msdocument.saveDocument(null);
          if (callback) callback(null, this);
        } catch (err) {
          if (callback) callback(err, this);
        }

        return;
      }

      var url = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["getURLFromPath"])(path) || this._tempURL;

      var _ref = options || {},
          saveMode = _ref.saveMode,
          iKnowThatImOverwritingAFolder = _ref.iKnowThatImOverwritingAFolder;

      if ((!url.pathExtension() || !String(url.pathExtension())) && !iKnowThatImOverwritingAFolder) {
        throw new Error('Attempting to overwrite a folder! If you really mean to do that, set the `iKnowThatImOverwritingAFolder` option to `true`');
      }

      var fiber = coscript.createFiber();
      var nativeSaveMode = SaveModeType[saveMode] || saveMode || NSSaveAsOperation;
      var that = this;
      msdocument.saveDocumentToURL_saveMode_context_callback(url, nativeSaveMode, coscript, function (err) {
        try {
          if (callback) {
            if (err && !err.isEqual(NSNull.null())) {
              callback(new Error(err.description()), that);
            } else {
              callback(null, that);
            }
          }

          fiber.cleanup();
        } catch (error) {
          fiber.cleanup();
          throw error;
        }
      });
    }
  }, {
    key: "close",
    value: function close() {
      var msdocument = this._getMSDocument();

      if (!msdocument || !msdocument.close) {
        throw new Error('Cannot close this document');
      }

      msdocument.close();
    }
  }], [{
    key: "getDocuments",
    value: function getDocuments() {
      return _getDocuments();
    }
  }, {
    key: "getSelectedDocument",
    value: function getSelectedDocument() {
      return _getSelectedDocument();
    }
  }, {
    key: "open",
    value: function open(path, callback) {
      if (typeof path === 'function') {
        /* eslint-disable no-param-reassign */
        callback = path;
        path = undefined;
        /* eslint-enable */
      }

      var app = NSDocumentController.sharedDocumentController();

      if (!path) {
        var dialog = NSOpenPanel.openPanel();
        dialog.allowedFileTypes = ['sketch'];
        dialog.canChooseFiles = true;
        dialog.canChooseDirectories = false;
        dialog.allowsMultipleSelection = false;
        var buttonClicked = dialog.runModal();

        if (buttonClicked != NSOKButton) {
          if (callback) callback(null, undefined);
          return undefined;
        }

        var _url = dialog.URLs()[0];
        var fiber = coscript.createFiber();
        app.openDocumentWithContentsOfURL_display_context_callback(_url, true, coscript, function (_document, documentWasAlreadyOpen, err) {
          try {
            if (callback) {
              if (err && !err.isEqual(NSNull.null())) {
                callback(new Error(err.description()));
              } else {
                callback(null, Document.fromNative(_document));
              }
            }

            fiber.cleanup();
          } catch (error) {
            fiber.cleanup();
            throw error;
          }
        }); // return the current document to maintain backward compatibility
        // but that's not the right document...

        var _document2 = app.currentDocument();

        return Document.fromNative(_document2);
      }

      var document;
      var url = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["getURLFromPath"])(path);

      if (app.documentForURL(url)) {
        document = Document.fromNative(app.documentForURL(url));
        if (callback) callback(null, document);
        return document;
      }

      var error = MOPointer.alloc().init();
      document = app.openDocumentWithContentsOfURL_display_error(url, true, error);

      if (error.value() !== null) {
        throw new Error(error.value());
      }

      document = Document.fromNative(document);
      if (callback) callback(null, document);
      return document;
    }
  }]);

  return Document;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Document.type = _enums__WEBPACK_IMPORTED_MODULE_5__["Types"].Document;
Document[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_6__["Factory"].registerClass(Document, MSDocumentData);
_Factory__WEBPACK_IMPORTED_MODULE_6__["Factory"].registerClass(Document, MSImmutableDocumentData); // also register MSDocument if it exists

if (typeof MSDocument !== 'undefined') {
  _Factory__WEBPACK_IMPORTED_MODULE_6__["Factory"].registerClass(Document, MSDocument);
}

Document.SaveMode = SaveModeType; // override getting the id to make sure it's fine if we have an MSDocument

Document.define('id', {
  exportable: true,
  importable: false,
  get: function get() {
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
  get: function get() {
    if (!this._object) {
      return [];
    }

    var pages = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["toArray"])(this._object.pages());
    return pages.map(function (page) {
      return _layers_Page__WEBPACK_IMPORTED_MODULE_1__["Page"].fromNative(page);
    });
  },
  set: function set(pages) {
    var _this = this;

    if (this.isImmutable()) {
      return;
    } // remove the existing pages


    this._object.removePages_detachInstances(this._object.pages(), true);

    Object(_utils__WEBPACK_IMPORTED_MODULE_3__["toArray"])(pages).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"]).forEach(function (page) {
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
  get: function get() {
    return new _Selection__WEBPACK_IMPORTED_MODULE_2__["Selection"](this.selectedPage);
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
  get: function get() {
    return _layers_Page__WEBPACK_IMPORTED_MODULE_1__["Page"].fromNative(this._object.currentPage());
  }
});
Document.define('path', {
  get: function get() {
    var url = this._tempURL || (this._getMSDocument() || {
      fileURL: function fileURL() {}
    }).fileURL();

    if (url) {
      return String(url.absoluteString()).replace('file://', '');
    }

    return undefined;
  },
  set: function set(path) {
    if (this.isImmutable()) {
      return;
    }

    var url = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["getURLFromPath"])(path);
    Object.defineProperty(this, '_tempURL', {
      enumerable: false,
      value: url
    });
  }
});

/***/ }),

/***/ "./Source/dom/models/Flow.js":
/*!***********************************!*\
  !*** ./Source/dom/models/Flow.js ***!
  \***********************************/
/*! exports provided: AnimationType, BackTarget, AnimationTypeMap, Flow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationType", function() { return AnimationType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BackTarget", function() { return BackTarget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationTypeMap", function() { return AnimationTypeMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Flow", function() { return Flow; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





 // Mapping between animation type names and values.

var AnimationType = {
  none: 'none',
  slideFromRight: 'slideFromRight',
  slideFromLeft: 'slideFromLeft',
  slideFromBottom: 'slideFromBottom',
  slideFromTop: 'slideFromTop'
};
var BackTarget = 'back';
var AnimationTypeMap = {
  none: -1,
  slideFromRight: 0,
  slideFromLeft: 1,
  slideFromBottom: 2,
  slideFromTop: 3
  /**
   * A MSFlowConnection. This is not exposed, only used by Layer
   */

};
var Flow =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Flow, _WrappedObject);

  function Flow() {
    _classCallCheck(this, Flow);

    return _possibleConstructorReturn(this, _getPrototypeOf(Flow).apply(this, arguments));
  }

  _createClass(Flow, [{
    key: "isBackAction",
    value: function isBackAction() {
      return !!this._object.isBackAction();
    }
  }, {
    key: "isValidConnection",
    value: function isValidConnection() {
      return !!this._object.isValidFlowConnection();
    }
  }], [{
    key: "from",

    /**
     * can accept a wide range of input:
     * - a wrapped Flow
     * - a native MSFlowConnection
     * - an object with a `target` or `targetId` property
     */
    value: function from(flow) {
      if (Object(_utils__WEBPACK_IMPORTED_MODULE_3__["isWrappedObject"])(flow) && flow.type === _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].Flow) {
        return flow;
      }

      if (Object(_utils__WEBPACK_IMPORTED_MODULE_3__["isNativeObject"])(flow)) {
        var className = String(flow.class());

        if (className !== 'MSFlowConnection') {
          throw new Error("Cannot create a flow from a ".concat(className));
        }

        return Flow.fromNative(flow);
      }

      if (flow && (flow.target || flow.targetId)) {
        return new Flow(_objectSpread({
          sketchObject: MSFlowConnection.new()
        }, flow));
      }

      throw new Error('`flow` needs to be an object');
    }
  }]);

  return Flow;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Flow.type = _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].Flow;
Flow[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(Flow, MSFlowConnection);
Flow.define('targetId', {
  get: function get() {
    return String(this._object.destinationArtboardID());
  },
  set: function set(targetId) {
    this._object.destinationArtboardID = targetId;
  }
});
Flow.define('target', {
  enumerable: false,
  exportable: false,
  get: function get() {
    var target = this._object.destinationArtboard();

    if (target == BackTarget) {
      return BackTarget;
    }

    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"])(target);
  },
  set: function set(target) {
    if (target == BackTarget) {
      this._object.destinationArtboardID = BackTarget;
      return;
    }

    this._object.destinationArtboardID = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapObject"])(target).id;
  }
});
Flow.define('animationType', {
  get: function get() {
    var raw = this._object.animationType();

    return Object.keys(AnimationTypeMap).find(function (key) {
      return AnimationTypeMap[key] === raw;
    }) || raw;
  },
  set: function set(animationType) {
    var translated = AnimationTypeMap[animationType];
    this._object.animationType = typeof translated !== 'undefined' ? translated : animationType;
  }
}); // override the WrappedObject id

delete Flow[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]].id;

/***/ }),

/***/ "./Source/dom/models/ImageData.js":
/*!****************************************!*\
  !*** ./Source/dom/models/ImageData.js ***!
  \****************************************/
/*! exports provided: ImageData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageData", function() { return ImageData; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





/**
 * An MSImageData. This is not exposed, only used by Image
 */

var ImageData =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(ImageData, _WrappedObject);

  function ImageData() {
    _classCallCheck(this, ImageData);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImageData).apply(this, arguments));
  }

  _createClass(ImageData, null, [{
    key: "from",

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
    value: function from(image) {
      if (Object(_utils__WEBPACK_IMPORTED_MODULE_3__["isWrappedObject"])(image) && image.type === _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].ImageData) {
        return image;
      }

      var nsImage;

      if (Object(_utils__WEBPACK_IMPORTED_MODULE_3__["isNativeObject"])(image)) {
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
          throw new Error("Cannot create an image from a ".concat(className));
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
    }
  }]);

  return ImageData;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
ImageData.type = _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].ImageData;
ImageData[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(ImageData, MSImageData); // make it explicit that we will get a native object

ImageData.define('nsimage', {
  get: function get() {
    return this._object.image();
  }
}); // make it explicit that we will get a native object

ImageData.define('nsdata', {
  get: function get() {
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
  get: function get() {
    return String(this._object.hash());
  }
});

/***/ }),

/***/ "./Source/dom/models/ImportableObject.js":
/*!***********************************************!*\
  !*** ./Source/dom/models/ImportableObject.js ***!
  \***********************************************/
/*! exports provided: ImportableObjectType, ImportableObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportableObjectType", function() { return ImportableObjectType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportableObject", function() { return ImportableObject; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }





var ObjectTypeMap = {
  Symbol: 0,
  LayerStyle: 1,
  TextStyle: 2,
  Unknown: 3
};
var ImportableObjectType = {
  Symbol: 'Symbol',
  LayerStyle: 'LayerStyle',
  TextStyle: 'TextStyle',
  Unknown: 'Unknown'
};
var ImportableObject =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(ImportableObject, _WrappedObject);

  /**
   * Make a new symbol instance.
   */
  function ImportableObject() {
    var _this;

    var master = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ImportableObject);

    if (!master.sketchObject) {
      throw new Error("Cannot create a ImportableObject directly");
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImportableObject).call(this, master));
    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), '_documentData', {
      enumerable: false,
      writable: true
    });
    return _this;
  }

  _createClass(ImportableObject, [{
    key: "import",
    value: function _import() {
      if (!this._documentData) {
        throw new Error('missing document data');
      }

      var importedObject = this._object.shareableObject && this._object.shareableObject();

      if (importedObject && !this._object.sourceLibrary()) {
        switch (this.objectType) {
          case ImportableObjectType.Symbol:
            {
              var symbol = this._documentData.symbolWithID(this._object.sharedObjectID());

              if (symbol) {
                return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapNativeObject"])(symbol);
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

      return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapNativeObject"])(importedObject.localObject());
    }
  }]);

  return ImportableObject;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
ImportableObject.type = _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].ImportableObject;
ImportableObject[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]); // need to check if we have MSShareableObjectReference because it won't be available on jenkins

if (typeof MSShareableObjectReference !== 'undefined') {
  _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(ImportableObject, MSShareableObjectReference);
  _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(ImportableObject, MSSymbolMasterReference);
  _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(ImportableObject, MSSharedStyleReference);
  _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(ImportableObject, MSSharedLayerReference);
  _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(ImportableObject, MSSharedTextReference);
}

ImportableObject.define('id', {
  exportable: true,
  importable: false,
  get: function get() {
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
  get: function get() {
    return String(this._object.name());
  }
});
ImportableObject.define('objectType', {
  exportable: true,
  importable: false,
  get: function get() {
    var raw = this._object.shareableObjectType();

    return Object.keys(ObjectTypeMap).find(function (key) {
      return ObjectTypeMap[key] === raw;
    }) || raw;
  }
});
ImportableObject.define('library', {
  exportable: false,
  enumerable: false,
  get: function get() {
    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapNativeObject"])(this._object.sourceLibrary());
  }
});

/***/ }),

/***/ "./Source/dom/models/Library.js":
/*!**************************************!*\
  !*** ./Source/dom/models/Library.js ***!
  \**************************************/
/*! exports provided: getLibraries, Library */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLibraries", function() { return _getLibraries; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Library", function() { return Library; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Document */ "./Source/dom/models/Document.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _ImportableObject__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ImportableObject */ "./Source/dom/models/ImportableObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








var AddStatus = {
  0: 'ok',
  1: 'the library has already been added',
  2: 'the document is not in the new JSON format',
  3: 'there was a problem reading the asset library file'
};
var LibraryTypeMap = {
  0: 'Internal',
  1: 'User',
  // Is this a library added by a user.
  2: 'Remote' // Is this a library that can be updated using an appcast.

};
var LibraryType = {
  Internal: 'Internal',
  User: 'User',
  Remote: 'Remote'
  /* eslint-disable no-use-before-define, typescript/no-use-before-define */

};

function _getLibraries() {
  var libraryController = AppController.sharedInstance().librariesController();
  return Object(_utils__WEBPACK_IMPORTED_MODULE_2__["toArray"])(libraryController.libraries()).map(Library.fromNative.bind(Library));
}
/* eslint-enable */

/**
 * A Sketch Library.
 */



var Library =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Library, _WrappedObject);

  function Library() {
    var library = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Library);

    if (!library.sketchObject) {
      throw new Error('Cannot create a new Library directly');
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(Library).call(this, library));
  }

  _createClass(Library, [{
    key: "getDocument",
    value: function getDocument() {
      if (!this._object.document() && !this._object.loadSynchronously()) {
        throw new Error("could not get the document: ".concat(this._object.status));
      }

      return _Document__WEBPACK_IMPORTED_MODULE_1__["Document"].fromNative(this._object.document());
    }
  }, {
    key: "getImportableReferencesForDocument",
    value: function getImportableReferencesForDocument(document, objectType) {
      var provider;

      switch (objectType) {
        case _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObjectType"].Symbol:
          provider = MSForeignSymbolProvider.alloc().initWithDocument(Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(document).sketchObject);
          break;

        case _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObjectType"].LayerStyle:
          provider = MSSharedLayerStyleProvider.alloc().initWithDocument(Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(document).sketchObject);
          break;

        case _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObjectType"].TextStyle:
          provider = MSSharedTextStyleProvider.alloc().initWithDocument(Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_5__["wrapObject"])(document).sketchObject);
          break;

        default:
          throw new Error('Unknown object type');
      }

      var collector = MSForeignObjectCollector.alloc().initWithProvider(provider);
      var shareableObjectRefsMap = collector.buildCollectionWithFilter(null);
      var currentId = this.id;
      var currentName = this.name;
      var shareableObjectRefsForCurrentLib = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["toArray"])(shareableObjectRefsMap).find(function (o) {
        return o.library && String(o.library.libraryID()) === currentId && String(o.library.name()) === currentName;
      });

      if (!shareableObjectRefsForCurrentLib) {
        return [];
      }

      var documentData = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["getDocumentData"])(document);
      return Object(_utils__WEBPACK_IMPORTED_MODULE_2__["toArray"])(shareableObjectRefsForCurrentLib.objectRefs).map(function (ref) {
        var obj = _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObject"].fromNative(ref);
        obj._documentData = documentData;
        return obj;
      });
    }
  }, {
    key: "getImportableSymbolReferencesForDocument",
    value: function getImportableSymbolReferencesForDocument(document) {
      return this.getImportableReferencesForDocument(document, _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObjectType"].Symbol);
    }
  }, {
    key: "getImportableLayerStyleReferencesForDocument",
    value: function getImportableLayerStyleReferencesForDocument(document) {
      return this.getImportableReferencesForDocument(document, _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObjectType"].LayerStyle);
    }
  }, {
    key: "getImportableTextStyleReferencesForDocument",
    value: function getImportableTextStyleReferencesForDocument(document) {
      return this.getImportableReferencesForDocument(document, _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObjectType"].TextStyle);
    }
  }, {
    key: "remove",
    value: function remove() {
      var libraryController = AppController.sharedInstance().librariesController();
      libraryController.removeAssetLibrary(this._object);
    }
  }], [{
    key: "getLibraries",
    value: function getLibraries() {
      return _getLibraries();
    }
  }, {
    key: "getLibraryForDocumentAtPath",
    value: function getLibraryForDocumentAtPath(path) {
      var libUrl = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["getURLFromPath"])(path);
      var libraryController = AppController.sharedInstance().librariesController(); // check if we already imported the library

      var existingLibraries = libraryController.libraries();

      for (var i = 0; i < existingLibraries.count(); i += 1) {
        var existingLibrary = existingLibraries.objectAtIndex(i);
        var location = existingLibrary.locationOnDisk();

        if (location && location.isEqual(libUrl)) {
          return Library.fromNative(existingLibrary);
        }
      } // otherwise, let's add it


      var status = libraryController.addAssetLibraryAtURL(libUrl);

      if (status !== 0) {
        throw new Error("Error while adding the library: ".concat(AddStatus[status], "."));
      }

      var lib = libraryController.userLibraries().firstObject();

      if (!lib) {
        throw new Error('could not find the added library');
      } // refresh the UI


      libraryController.notifyLibraryChange(lib);
      return Library.fromNative(lib);
    }
  }, {
    key: "getRemoteLibraryWithRSS",
    value: function getRemoteLibraryWithRSS(appcast, callback) {
      var libUrl = NSURL.URLWithString(appcast);
      var libraryController = AppController.sharedInstance().librariesController(); // check if we already imported the library

      var existingLibrary = libraryController.remoteLibraryWithAppcast(libUrl);

      if (existingLibrary) {
        callback(null, Library.fromNative(existingLibrary));
        return;
      }

      var fiber = coscript.createFiber(); // otherwise, let's add it

      libraryController.addRemoteLibraryFromAppcastURL_context_callback(libUrl, coscript, function (lib, err) {
        try {
          if (err && !err.isEqual(NSNull.null())) {
            callback(new Error(err.description()));
          } else {
            callback(null, Library.fromNative(lib));
          }

          fiber.cleanup();
        } catch (error) {
          fiber.cleanup();
          throw error;
        }
      });
    }
  }]);

  return Library;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Library.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].Library;
Library[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]); // need to check if we have MSAssetLibrary because it won't be available on jenkins

if (typeof MSAssetLibrary !== 'undefined') {
  _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Library, MSAssetLibrary);
  _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Library, MSUserAssetLibrary);
  _Factory__WEBPACK_IMPORTED_MODULE_4__["Factory"].registerClass(Library, MSRemoteAssetLibrary);
}

Library.ImportableObjectType = _ImportableObject__WEBPACK_IMPORTED_MODULE_6__["ImportableObjectType"];
Library.define('id', {
  exportable: true,
  importable: false,
  get: function get() {
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
  get: function get() {
    return String(this._object.name());
  }
});
Library.define('valid', {
  exportable: true,
  importable: false,
  get: function get() {
    return !!this._object.valid();
  }
});
Library.define('enabled', {
  get: function get() {
    return !!this._object.enabled();
  },
  set: function set(enabled) {
    this._object.setEnabled(enabled);
  }
});
Library.define('lastModifiedAt', {
  exportable: true,
  importable: false,
  get: function get() {
    var date = this._object.dateLastModified();

    if (!date) {
      return undefined;
    }

    return new Date(date.timeIntervalSince1970() * 1000);
  }
});
Library.LibraryType = LibraryType;
Library.define('libraryType', {
  exportable: true,
  importable: false,
  get: function get() {
    var type = this._object.libraryType();

    return LibraryTypeMap[type] || type;
  }
});

/***/ }),

/***/ "./Source/dom/models/Override.js":
/*!***************************************!*\
  !*** ./Source/dom/models/Override.js ***!
  \***************************************/
/*! exports provided: Override */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Override", function() { return Override; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _ImageData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ImageData */ "./Source/dom/models/ImageData.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






/**
 * An MSAvailableOverride. This is not exposed, only used by SymbolInstance
 */

var Override =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Override, _WrappedObject);

  function Override() {
    _classCallCheck(this, Override);

    return _possibleConstructorReturn(this, _getPrototypeOf(Override).apply(this, arguments));
  }

  return Override;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Override.type = _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].Override;
Override[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(Override, MSAvailableOverride);
Override.define('path', {
  get: function get() {
    return String(this._object.overridePoint().path());
  }
});
Override.define('property', {
  get: function get() {
    return String(this._object.overridePoint().property());
  }
});
Override.define('affectedLayer', {
  get: function get() {
    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_4__["wrapNativeObject"])(this._object.affectedLayer());
  }
});
Override.define('id', {
  exportable: true,
  importable: false,
  get: function get() {
    return String(this._object.overridePoint().name());
  }
});
Override.define('symbolOverride', {
  get: function get() {
    return Boolean(this._object.overridePoint().isSymbolOverride());
  }
});
Override.define('value', {
  get: function get() {
    var value = this._object.currentValue();

    if (this.property === 'image') {
      return _ImageData__WEBPACK_IMPORTED_MODULE_3__["ImageData"].fromNative(value);
    }

    return String(this._object.currentValue());
  },
  set: function set(value) {
    // __symbolInstance is set when building the Override
    this.__symbolInstance.setOverrideValue(this, value);
  }
});
Override.define('isDefault', {
  get: function get() {
    return !this._object.hasOverride();
  }
});

/***/ }),

/***/ "./Source/dom/models/Point.js":
/*!************************************!*\
  !*** ./Source/dom/models/Point.js ***!
  \************************************/
/*! exports provided: Point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var Point =
/*#__PURE__*/
function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    Object(_utils__WEBPACK_IMPORTED_MODULE_0__["initProxyProperties"])(this);
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__["proxyProperty"])(this, 'x', parseFloat(x));
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__["proxyProperty"])(this, 'y', parseFloat(y)); // if the argument is object

    if (_typeof(x) === 'object' && typeof x.x === 'number') {
      this._x = parseFloat(x.x);
      this._y = parseFloat(x.y);
    }
  }

  _createClass(Point, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        x: this._x,
        y: this._y
      };
    }
  }]);

  return Point;
}();

/***/ }),

/***/ "./Source/dom/models/Rectangle.js":
/*!****************************************!*\
  !*** ./Source/dom/models/Rectangle.js ***!
  \****************************************/
/*! exports provided: Rectangle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rectangle", function() { return Rectangle; });
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * Represents a rectangle.
 */

var Rectangle =
/*#__PURE__*/
function () {
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
    _classCallCheck(this, Rectangle);

    Object(_utils__WEBPACK_IMPORTED_MODULE_1__["initProxyProperties"])(this);
    Object(_utils__WEBPACK_IMPORTED_MODULE_1__["proxyProperty"])(this, 'x', parseFloat(x));
    Object(_utils__WEBPACK_IMPORTED_MODULE_1__["proxyProperty"])(this, 'y', parseFloat(y));
    Object(_utils__WEBPACK_IMPORTED_MODULE_1__["proxyProperty"])(this, 'width', parseFloat(width));
    Object(_utils__WEBPACK_IMPORTED_MODULE_1__["proxyProperty"])(this, 'height', parseFloat(height)); // if the argument is object

    if (_typeof(x) === 'object' && typeof x.x === 'number') {
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


  _createClass(Rectangle, [{
    key: "offset",
    value: function offset(x, y) {
      this._x += parseFloat(x);
      this._y += parseFloat(y);

      if (this._parent && this._parentKey) {
        this._parent[this._parentKey] = this;
      }

      return this;
    }
  }, {
    key: "scale",
    value: function scale(factorWidth, factorHeight) {
      this._width *= parseFloat(factorWidth);
      this._height *= parseFloat(typeof factorHeight === 'undefined' ? factorWidth : factorHeight);

      if (this._parent && this._parentKey) {
        this._parent[this._parentKey] = this;
      }

      return this;
    }
    /**
     * Return the Rectangle as a CGRect.
     *
     * @return {CGRect} The rectangle.
     */

  }, {
    key: "asCGRect",
    value: function asCGRect() {
      return CGRectMake(this._x, this._y, this._width, this._height);
    }
    /**
     * Return a string description of the rectangle.
     *
     * @return {string} Description of the rectangle.
     */

  }, {
    key: "toString",
    value: function toString() {
      return "{".concat(this._x, ", ").concat(this._y, ", ").concat(this._width, ", ").concat(this._height, "}");
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        x: this._x,
        y: this._y,
        width: this._width,
        height: this._height
      };
    }
    /**
     * Convert a rectangle in the coordinates that a layer uses to another layer's coordinates.
     *
     * @param {Layer} layerA The layer in which the rectangle's coordinates are expressed.
     * @param {Layer} layerB The layer in which the rectangle's coordinates will be expressed.
     * @return {Rectangle} The converted rectangle expressed in the coordinate system of the layerB layer.
     */

  }, {
    key: "changeBasis",
    value: function changeBasis() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          from = _ref.from,
          to = _ref.to;

      var fromLayer = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_0__["wrapObject"])(from);
      var toLayer = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_0__["wrapObject"])(to);

      if (!fromLayer) {
        if (!toLayer || !toLayer.sketchObject || !toLayer.sketchObject.convertPoint_fromCoordinateSpace) {
          throw new Error("Expected a coordinate space, got ".concat(to));
        }

        var _origin = toLayer.sketchObject.convertPoint_fromCoordinateSpace(NSMakePoint(this.x, this.y), null);

        return new Rectangle(_origin.x, _origin.y, this.width, this.height);
      }

      if (!fromLayer.sketchObject || !fromLayer.sketchObject.convertPoint_toCoordinateSpace) {
        throw new Error("Expected a coordinate space, got ".concat(from));
      }

      var origin = fromLayer.sketchObject.convertPoint_toCoordinateSpace(NSMakePoint(this.x, this.y), toLayer ? toLayer.sketchObject : null);
      return new Rectangle(origin.x, origin.y, this.width, this.height);
    }
  }]);

  return Rectangle;
}();

/***/ }),

/***/ "./Source/dom/models/Selection.js":
/*!****************************************!*\
  !*** ./Source/dom/models/Selection.js ***!
  \****************************************/
/*! exports provided: Selection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Selection", function() { return Selection; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * Represents the layers that the user has selected.
 */

var Selection =
/*#__PURE__*/
function () {
  /**
   * Make a new Selection object.
   *
   * @param {Page} page The page that the selection relates to.
   */
  function Selection(page) {
    _classCallCheck(this, Selection);

    this._object = page._object;
  }

  _createClass(Selection, [{
    key: "forEach",
    value: function forEach(fn) {
      return this.layers.forEach(fn);
    }
  }, {
    key: "map",
    value: function map(fn) {
      return this.layers.map(fn);
    }
  }, {
    key: "reduce",
    value: function reduce(fn, initial) {
      return this.layers.reduce(fn, initial);
    }
    /**
     * Return the wrapped Sketch layers in the selection.
     *
     * @return {array} The selected layers.
     * */

  }, {
    key: "clear",

    /**
     * Clear the selection.
     */
    value: function clear() {
      this._object.changeSelectionBySelectingLayers(null);

      return this;
    }
  }, {
    key: "layers",
    get: function get() {
      var layers = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["toArray"])(this._object.selectedLayers().layers()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_1__["wrapNativeObject"]);
      return layers;
    }
    /**
     * Return the number of selected layers.
     *
     * @return {number} The number of layers that are selected.
     */

  }, {
    key: "length",
    get: function get() {
      return this._object.selectedLayers().layers().count();
    }
    /**
     * Does the selection contain any layers?
     *
     * @return {boolean} true if the selection is empty.
     */

  }, {
    key: "isEmpty",
    get: function get() {
      return this.length === 0;
    }
  }]);

  return Selection;
}();

/***/ }),

/***/ "./Source/dom/models/SharedStyle.js":
/*!******************************************!*\
  !*** ./Source/dom/models/SharedStyle.js ***!
  \******************************************/
/*! exports provided: SharedStyleType, SharedStyle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedStyleType", function() { return SharedStyleType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedStyle", function() { return SharedStyle; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var SharedStyleTypeMap = {
  1: 'Layer',
  2: 'Text'
};
var SharedStyleType = {
  Layer: 'Layer',
  Text: 'Text'
  /**
   * A Sketch shared style, either Text style or Layer Style.
   */

};
var SharedStyle =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(SharedStyle, _WrappedObject);

  /**
   * Make a new symbol master.
   */
  function SharedStyle() {
    var master = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SharedStyle);

    if (!master.sketchObject) {
      throw new Error("Cannot create a SharedStyle directly, use SharedStyle.fromStyle({ name, style, document }) instead.");
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(SharedStyle).call(this, master));
  }

  _createClass(SharedStyle, [{
    key: "getAllInstances",
    value: function getAllInstances() {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["toArray"])(this._object.allInstances()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"]);
    }
  }, {
    key: "getAllInstancesLayers",
    value: function getAllInstancesLayers() {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["toArray"])(this._object.allLayersInstances()).map(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"]);
    }
  }, {
    key: "getLibrary",
    value: function getLibrary() {
      var libraryController = AppController.sharedInstance().librariesController();
      var lib = libraryController.libraryForShareableObject(this._object);

      if (!lib) {
        return null;
      }

      return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(lib);
    }
  }, {
    key: "syncWithLibrary",
    value: function syncWithLibrary() {
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
    }
  }, {
    key: "unlinkFromLibrary",
    value: function unlinkFromLibrary() {
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
    }
  }], [{
    key: "fromStyle",
    value: function fromStyle() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          name = _ref.name,
          style = _ref.style,
          document = _ref.document;

      var documentData = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(document)._getMSDocumentData();

      var wrappedStyle = Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(style);
      var sharedStyle = SharedStyle.fromNative(MSSharedStyle.alloc().initWithName_style(name, wrappedStyle.sketchObject));
      var container = documentData.sharedObjectContainerOfType(wrappedStyle.sketchObject.type());
      container.addSharedObject(sharedStyle._object);
      return sharedStyle;
    }
  }]);

  return SharedStyle;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
SharedStyle.type = _enums__WEBPACK_IMPORTED_MODULE_1__["Types"].SharedStyle;
SharedStyle[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].registerClass(SharedStyle, MSSharedStyle);
SharedStyle.StyleType = SharedStyleType;
SharedStyle.define('styleType', {
  get: function get() {
    return SharedStyleTypeMap[this._object.type()] || this._object.type();
  }
});
SharedStyle.define('name', {
  get: function get() {
    return String(this._object.name());
  },
  set: function set(name) {
    this._object.name = name;
  }
});
SharedStyle.define('style', {
  get: function get() {
    return Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(this._object.style());
  },
  set: function set(newStyle) {
    if (this._object.isForeign()) {
      throw new Error('Can not set the style of a shared style coming from a library');
    }

    this._object.updateToMatch(Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(newStyle).sketchObject);
  }
});

/***/ }),

/***/ "./Source/dom/models/__tests__/Document.test.js":
/*!******************************************************!*\
  !*** ./Source/dom/models/__tests__/Document.test.js ***!
  \******************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect, Promise) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../test-utils */ "./Source/test-utils.ts");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */


var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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
  var group = new ___WEBPACK_IMPORTED_MODULE_1__["Group"]({
    name: 'Test',
    parent: page,
    selected: true
  });
  expect(group.selected).not.toBe(false);
  expect(selection.isEmpty).toBe(false);
});
test('should look for a layer by its id', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_1__["Group"]({
    name: 'Test',
    parent: page
  });
  var id = group.id;
  var found = document.getLayerWithID(id);
  expect(found).toEqual(group);
});
test('should look for a layer by its name', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_1__["Group"]({
    name: 'Test',
    parent: page
  });
  var found = document.getLayersNamed('Test');
  expect(found).toEqual([group]);
});
test('should look for a symbol by its symbolId', function (context, document) {
  var _createSymbolMaster = Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["createSymbolMaster"])(document),
      master = _createSymbolMaster.master;

  expect(document.getSymbolMasterWithID(master.symbolId)).toEqual(master);
});
test('should list all the symbols', function (context, document) {
  var _createSymbolMaster2 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["createSymbolMaster"])(document),
      master = _createSymbolMaster2.master;

  expect(document.getSymbols()).toEqual([master]);
});
test('should look for a shared layer style by its id', function (context, document) {
  var _createSharedStyle = Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_1__["Shape"]),
      sharedStyle = _createSharedStyle.sharedStyle;

  expect(document.getSharedLayerStyleWithID(sharedStyle.id)).toEqual(sharedStyle);
});
test('should list all the shared layer styles', function (context, document) {
  var _createSharedStyle2 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_1__["Shape"]),
      sharedStyle = _createSharedStyle2.sharedStyle;

  expect(document.getSharedLayerStyles()).toEqual([sharedStyle]);
});
test('should look for a shared text style by its id', function (context, document) {
  var _createSharedStyle3 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_1__["Text"]),
      sharedStyle = _createSharedStyle3.sharedStyle;

  expect(document.getSharedTextStyleWithID(sharedStyle.id)).toEqual(sharedStyle);
});
test('should list all the shared text styles', function (context, document) {
  var _createSharedStyle4 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_1__["Text"]),
      sharedStyle = _createSharedStyle4.sharedStyle;

  expect(document.getSharedTextStyles()).toEqual([sharedStyle]);
}); // some tests cannot really run on jenkins because it doesn't have access to MSDocument

if (!Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
  var _document;

  var documentId;
  test('should create a new document', function () {
    _document = new ___WEBPACK_IMPORTED_MODULE_1__["Document"]();
    documentId = _document.id;
    var documents = ___WEBPACK_IMPORTED_MODULE_1__["Document"].getDocuments();
    expect(_document.type).toBe('Document');
    expect(documents.find(function (d) {
      return d.id === documentId;
    })).toEqual(_document);
  });
  test('path should be undefined before saving it', function () {
    expect(_document.path).toBe(undefined);
  });
  test('should save a file', function () {
    return new Promise(function (resolve, reject) {
      _document.save('~/Desktop/sketch-api-unit-tests.sketch', function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    }).then(function (result) {
      expect(result).toBe(_document);
      expect(_document.path).toBe(String(NSString.stringWithString('~/Desktop/sketch-api-unit-tests.sketch').stringByExpandingTildeInPath()));
    });
  });
  test('should save a file without specifying the path', function () {
    return new Promise(function (resolve, reject) {
      _document.save(function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    }).then(function (result) {
      expect(result).toBe(_document);
      expect(_document.path).toBe(String(NSString.stringWithString('~/Desktop/sketch-api-unit-tests.sketch').stringByExpandingTildeInPath()));
    });
  });
  test('should save a file to a specific path when setting the path', function () {
    _document.path = '~/Desktop/sketch-api-unit-tests-2.sketch';
    return new Promise(function (resolve, reject) {
      _document.save(function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    }).then(function (result) {
      expect(result).toBe(_document);
      expect(_document.path).toBe(String(NSString.stringWithString('~/Desktop/sketch-api-unit-tests-2.sketch').stringByExpandingTildeInPath()));
    });
  });
  test('should close a file', function () {
    _document.close();

    var documents = ___WEBPACK_IMPORTED_MODULE_1__["Document"].getDocuments();
    expect(documents.find(function (d) {
      return d.id === documentId;
    })).toBe(undefined);
  });
  test('should open a file', function () {
    var document = ___WEBPACK_IMPORTED_MODULE_1__["Document"].open('~/Desktop/sketch-api-unit-tests.sketch');
    var documents = ___WEBPACK_IMPORTED_MODULE_1__["Document"].getDocuments();
    expect(documents.find(function (d) {
      return d.id === document.id;
    })).toEqual(document); // close it again because when watching the tests, it will open dozens of documents

    document.close();
  });
  test('should fail to open a non-existing file', function () {
    try {
      ___WEBPACK_IMPORTED_MODULE_1__["Document"].open('~/Desktop/non-existing-sketch-api-unit-tests.sketch');
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toMatch('couldn’t be opened because there is no such file');
    }
  });
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js"), __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/Flow.test.js":
/*!**************************************************!*\
  !*** ./Source/dom/models/__tests__/Flow.test.js ***!
  \**************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a flow between a layer and an artboard with a default animation', function (context, document) {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1',
    parent: document.selectedPage
  });
  var artboard2 = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test2',
    parent: document.selectedPage
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: artboard,
    flow: {
      target: artboard2
    }
  }); // check that an flow can be logged

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
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1',
    parent: document.selectedPage
  });
  var artboard2 = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test2',
    parent: document.selectedPage
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
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
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1',
    parent: document.selectedPage
  });
  var artboard2 = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test2',
    parent: document.selectedPage
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: artboard,
    flow: {
      targetId: artboard2.id
    }
  });
  expect(rect.flow.target).toEqual(artboard2);
});
test('should create a flow between a layer and an artboard with a specific animation', function () {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1'
  });
  var artboard2 = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test2'
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: artboard,
    flow: {
      target: artboard2,
      animationType: ___WEBPACK_IMPORTED_MODULE_0__["Flow"].AnimationType.slideFromLeft
    }
  });
  expect(rect.flow.toJSON()).toEqual({
    targetId: artboard2.id,
    type: 'Flow',
    animationType: 'slideFromLeft'
  });
});
test('should create a back action', function () {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1'
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: artboard,
    flow: {
      target: ___WEBPACK_IMPORTED_MODULE_0__["Flow"].BackTarget
    }
  });
  expect(rect.flow.toJSON()).toEqual({
    targetId: ___WEBPACK_IMPORTED_MODULE_0__["Flow"].BackTarget,
    type: 'Flow',
    animationType: 'slideFromRight'
  });
  expect(rect.flow.isBackAction()).toBe(true);
});
test('adding a flow action with an unknow target work but isValidConnection should return false', function () {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test1'
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: artboard,
    flow: {
      targetId: 'unknown'
    }
  });
  expect(rect.flow.isValidConnection()).toBe(false);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/ImageData.test.js":
/*!*******************************************************!*\
  !*** ./Source/dom/models/__tests__/ImageData.test.js ***!
  \*******************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */
 // using a base64 image cause I'm not sure where and how to keep assets that would work with both local and jenkins tests

var base64Image = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAEDBJREFUWAm1WftvXcdxnt09z/u+uqQoUS+KtGQ7kZ3EERIHjuKmseNUhg07QI0qjeE6iAsU6QMoiqLtj/0v+mvzDxQFDARuixZp3DYp6jiW7cS24lAyRYqkSN73ee5uvtlzSTNGIlc/ZHFxeM6e3Z1vvpmdmT0UpbWSuAlLhF/VcCPcnTBEprq3xANF6YarYtZvFQlJWEOUhAEG9/vryJKEJhvyQiLjKwaTh9WsMAVNLWGKryhU5PFsHoAO/uvxpcJQ4cDDATh+A3lAVjXcSIcNj77DgZkYXeH2ZhNn+lSLHlwB1w1ziwuSknxDDmWF4UC6EyWM5YGCnPYsU800dr3ME8PSB8IdLqbEzBbCxJwoYKCGJMahH7rw6rymJoVFQRB3oFm8mXHBt1W3cNrxW56LxiME1pv93BOMUjVM+3C92XIFj+T+Q4PwPOt0f6rJfIsxlqwmIWbgKl5NpTkTjVUxRjFanoBx3AGjfgjIdeDCtt+/p9KwCjNMLGQf9D4Cz3kTuIMnsd+gOQoAyYA+pt+RqHkV2K4UhFt4odMF7x21mkrNw+QM1kxRnlz1sB3QDPsj5ldKOz90QAT7PC9WIXdW8909TAa/xiJetcJsGefDhvVhuFgRI8Aet+rKd2xuvK12FZ5hRDcDN+h2PIFiNw4ysK9YXbaYm4RrIFNehxucKWQ5VVMQB8IgQAgLV8NfKIbFeCdiCcbEpoHEUgkj4HKQA2TYsARVwTdWQBckukEsAJMA0F2dEryiG4pVgBiW5NGujdxkiAf7IcmQBWNb2IREOgsEEGABOnBeU7BxKRSC1cMqQMZgMJvZqmwCmWy+Sj56MQEAK1CMHQ+u8QbWxniiRllOPhjdIzVhqTonnZAdkpiSSKjMKbO2lAL44Nw05gX9iLw5ogWyDQoHpLFYjURT6phUCw4HLM6UparYhg4MS2Mhksw0YFmmB8AYe3VlTIDvgQ9YUkaUblE8GK5+P/SnQSaLcqTlUNtBUvSnaWJtLVC9xVMXbJoORhuj0SaJvB52ArFgyjAOR36tM85F2Drjdz9BysNLGWAXwjb4SWWl4K3IogUrxg2wAGcWx6su8Cysx7xhDOsF1kfZ+/8+2vuP1N8NMqyQiygRnoabhn6jEc83mqfJa4q42RGJMDt5ftPaG4UlrXMzUrE+Mk3UdHwyHA3aZx715SKVUekBGazgNgGYgTjscWQF1wALPzxjI8h9Czry4DxomAfz7b79zhv/fGZpGAZ7PkUAWvqpESC1GQRHw/opqi3SJKIgoOaptm/KSZqmv5BiV8VFaP0873dr7fEkW3v7dsuvixOPUF73VAuxhoWANEACOZW5nFhgcpufQTNSiU0D78ZAYGTetql8//rr/1QT6/Ay38+oaGC+LkWpIxmeCsL7SS7TuMO+n8JtOpDjSSOM1larYEJyANP4nmwHtDFc2/15u9dsUfM8aU/IBjSD40EWBCpQtZ/osMtAFXqBqSILmDEQaA0Vtylcn1z93uD2a2dPat8WNEo0nN3EVjQ8tRDX7qfGeVJHARhUmSSVBpl3nkJZ94pkOJlON6W/43s+5amU3qluMdp6LXsrDD/fACxsZGF9xDMgg3jsNyeYhXtVUEAY2Ye1/0r2yaza9f9cXf1epz3g/WjnKZGqNzVF4Mljqn4/RWdJ1ws9ybFBjC8C6VupEGFVSI2FqFhJ07DUYz+ISafw76aaaI1d8d/htR4tXSZRx3IA4TCVBWgmqMVtH4R7OPRYUjGgWv4/P3xZyt04zJPxHsGH4x5ihLal8hrUWKR4AUFLQ+Wal9mpZOVlmkz1eASbiu6p7sK9BtTmMAhMnKfDzXqQRHJ44+qrVPSpBFYWDO/SXA0gr8+aSO1OSTaimkKgSqwSPjub3qPRj+z/fjfd+Je4NR7FMgl1ba7e6DZ2tp/oHjkp22eJ2qZUcFsRYosjxuVSY5/HLoo670WQE7Y0/7h7a7Upx7HItzfW5DjviOa4H7aOPyoefoFqn8mzThCzf5el9lB9uakyK0pg0tYrSqkihynvE9221360fvOtMEJKEKOdcSTiRnBsb1u1ewuy0SEvQsQRKpAeIpzS1qUORETsKGRL/oF6BCLhtZa7jWUyPVPUG4iouS6ScbsZrK/9lN75IeWbQTDmNAX/tiDMsQffaiEcu8SCzJ5rpDzkkFV695WN91+O/VuyqUF+01I9a1ByuttaoNZxUnXYzmqvtEgj0lqjOcUBEdepswIBEQfbShg5PeO3F3x9I12/KsdbLUzRqc62WhGtvv3yUrdHZ79I9oSmhocqlWExXR6yJApYBCM4vcYN8sng2t57P2jo3WZoy+EU0awJF84VqTk6ci/5KPqQLZHgQl/55IGhzOdsWK2J9ApP4gchcw6PyEZRk9qno9Ee9a8TjbjkS5Jmz8sHk72fvtqNj9Jij2wdaBALKpf3KLVIBTkAheT7cMT12z/+r2RtdXkuMoP+dGpa3Q6lU665u23qb1GEdZH+GoQyAQg4/2IythFcFCvDvTjicARCP676CN0aUy2mFjhWtDV1mSUu3t9u91Zev/p2l06vLH5BSVUy5bMt6FEA7hkQZz/En1bsR+1310b9d9cWaipLs+F6miOB1q8tye9rP9wRtxT0kLE2PvuC1VIUSpaC3QvP2ARsSI6nkmNhQEcno2m30fWmyc3XrprbtBBTkWfUqG98cHMYn1yeX8IsY7Sn/AJVgauJENOgJXKSb3VmUBTIaO5zTy+v7938wcuetrEcJOM+RSLPis1rP1m493hPTSwfbzBbaovSCvFBS/4BFjdOYhUsXtYUYrvRCgO9s7O1m0+pHcOJ4vHUJsnc7jS455Fnjjx0mXRoUcmCnf14hSoBVMCgpadQFvmkscWOnXrmO14/W/+/fz0RhaHXTMqiFnlQl4Z9dQR2ASsTRAUPnHM4xqkLcFwGwfZz5RxW9CAKGKUJ9BQBx/YpRsmciGEqrd/dGHvnPve1xceeI9XFWKWCfJIHseOK7cabCUqijEFXg2SPguPkHT/+7IutlQsj4SGINqI47ScCzruawC3LokB60ZSXJqWgLHTpCjKUWdgWQAw9BQRZLu2RkgSlUg1pfIPCEt110+z9fJp1P31x8YknqY4oj+3G3DM5+2xxpnAFF/OPjYAwwedT1aDmiZXn/6wf9HZRLSRlO2pNUM+ltTI3XhxDNkeVAIWPRo4ujeaTKedad6PAIUag3wITsuTme9RWVKN6ngdbNrKnzy9dfobO3EMyTjOM5eLAYUMhxQ1Ke66KZZxwUfZSGARP/hzNf/KzL/ztRtGJo5ZJsqDW+GA7H+wVpHyN+gAbTvHZAFsYjBrYnwy04sQmy5JwXNdIKaSa0/c2Uc/6tibSKGos/CLzPnvlJTr3GVSqeB8hr1TRiktVXg+Nayze14caIIH4KQ7pcp7OX3rspb/7YK+Qtblx6Zuo279FNCgVymko5hSCs4J8aAuX4yCPYhPKlYhsXogKOBc3r1O92cnKdi6ObEy8373yJ+q+hxNqD8E2KALN7JogGxxhJjcmyTUgQWVtUH9hGJqKqJ/A8xbogccuPv2td/cK0Z4TtabdpWQDpmv5SFbYzzigTbF8QDqwhVKoypGuc/I0nDVUJiy29kKPhqmi9sk31vOHnvp2dPEy0ZyhHrqYcADCCcFtmAN3YljVxsZrsKgs7MB1DwbHbcrAhN+mS888+NiVnak/mIpQ0wTJHR6DrMwmV67+Rt1WVbmwIjIkaMONMdPpYIOKBGGn9+Pre1/+5p/T558kMadNHbue8zPEoPko8dl5UDy5Zz4X4RENf5GI4FxwE34uygSWUGGRgY3m6eaTf3zinkd03o5UlI11vj1gRYUwZRlECHCl8JAEMR+pSfPBG5W+Tvq7WbpJvfqZta38k5cuy69doXCRdKwoCIsUm5glAR1KTmTPCgN3sRGBYsYgY3VwYdDYo9wMNGVeXNcalcXc4uXfn++dRrrJU9rdKZh3KXLYqxaXDAvRYd814Aegr9T9AS10Tq/f2Dt77sHFr19hjv2YUKwCP2sF+dYiReLQq9PSlAFOWa4Jy/Hw1ze8QpMuT+EGx4Ysy/b+/lymk9xMzj1wLJ5HuQFSQ2PLspWNUxPFBMeyE4rDOHu9TLfFq+pLfr37+B+8QCufwoGHwrb1OWshlwLPjBH3XQNnbnTAFdDYt+7cAAgD4CthGNZqtbPP/WnfdI1ojHdTSkWZoBgKUYzj+I7CRGZ8fotbfrFTGNvY3MkpqD3+1LN09jzyG/khnMhZ50Amm+/g4eDmTrAABe3DoVIGOHI9+I2Lz/5NXsyPN/JsI/MaR7M0ZQISG3EQknZMetopzcmfXc+95srDjz9NFy6SqlEhKIgRcPENCOZjLB+uzU+ActBxJ1g80cEyrlW0kVj2vvDcxd978fptOdzxaeqHnir11JO+LLFphK8DNe3eWDV74vjyl5878sUnOGxmOBG1kY6A7ZCFgAYhHtZgWIfbx8DC0AoZMFXg2FXLOfnVF5a+8vzqTVHcSGAX+LCHU7yMskSL+jztRmtvjR/46h/RV75BqkMljrVz1g8nCCiueC1mMPCnMiIjOwz4N8ICiBk9UA9p1DV2f+wylO+mtfSHf9E8/6U3Vyc0MX4YsilR2/tNRNo3X7/5wMNPzT/6NIpSfNI1fgM84WyLGAAgGRK2+0B1mJ6PEPYbYR2Q9KuTXdTE4UqHSAD3feuvB8c+sT0IKAmgBrs9dbZvTNKFlaPffImaR5Hy4XbG9xMXT/gDklPKJRIg5M3EDf1wykPQ7gQLyCrbHdCGG8upz0aNuMgkHVu59PxfvnGdppNe3DxGVEuGwTvr5uKLf0W9Jc0nZlk4w6HoD7xZWosUZVnqjAlNHCbn6zPDVjgPRLrHj78gwKI+ZiOIAqkspIF+85WfvPIPD12w48HO1mZn+dKL9KmvJ7odq8AUhfAbWPRApKOB64xf7UNxxSU2WhW37hRO3bCPXizSUpn5/H0Ux1P+FkjDW+nP/m3tze922rXO6d/x7ntCNy+MKYxMGsIySJ1oznzIZs5wFUhcK1sxJmSMCmlVnlbgPir7Ds8C3xq4/sdO1yHyD6qteDm60OiMx7VW6H36cfJOWAqBJc8t0mUVobik5uYYmcXPGSYHbuZLsz/Q4m6NCHZQchrFhlD4XoIAjy8f0DS7ReXUdk4MkfOMCiXlOK/7+LgGQA4T4tNBQGfygAF/QBKDqVDjpiqr7hqWO6EgmDlrVKcmTtFOT1TJXEYDJEo3Unxq2TcUy8UP8CuDVoDwcEDQvp15xKFe9/jxF2nx1YhFoCJGceo+NOCIiYKcD6cZ3I01RlGd8D9VHAy3KB7gMJiKHzAzSfCnCiwGOFvjaAiluN21b5FFRSW0xHdBXgwFnI+vmDiG4csRBIoExx3+ioaQwOaTqAvQKk5wHsI9K3AIcIWU+2ZZiMdU43nm/7eV+KaLio8/ucOBS9yhWlKFLvB5nKIAK1bbzUnHCXcfRwWlwgRZBzzN5OIFI0M3t7v2rWrab/t692z9thG59X8JjZB/N6F8uAYAAAAASUVORK5CYII=';
var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should return an ImageData when accessing `image`', function (context, document) {
  var page = document.selectedPage;
  var image = new ___WEBPACK_IMPORTED_MODULE_0__["Image"]({
    parent: page,
    image: {
      base64: base64Image
    }
  });
  expect(image.image.type).toBe('ImageData');
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/ImportableObject.test.js":
/*!**************************************************************!*\
  !*** ./Source/dom/models/__tests__/ImportableObject.test.js ***!
  \**************************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise, expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../test-utils */ "./Source/test-utils.ts");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

 // some tests cannot really run on jenkins because it doesn't have access to MSDocument

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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



if (!Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
  test('should import a symbol from a lib', function () {
    var document = new ___WEBPACK_IMPORTED_MODULE_1__["Document"]();
    var artboard = new ___WEBPACK_IMPORTED_MODULE_1__["Artboard"]({
      name: 'Test',
      parent: document.selectedPage
    }); // eslint-disable-next-line

    var text = new ___WEBPACK_IMPORTED_MODULE_1__["Text"]({
      text: 'Test value',
      parent: artboard
    }); // eslint-disable-next-line

    var master = ___WEBPACK_IMPORTED_MODULE_1__["SymbolMaster"].fromArtboard(artboard);
    return new Promise(function (resolve, reject) {
      document.save('~/Desktop/sketch-api-unit-tests-importable-objects.sketch', function (err) {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    }).then(function () {
      var lib = ___WEBPACK_IMPORTED_MODULE_1__["Library"].getLibraryForDocumentAtPath('~/Desktop/sketch-api-unit-tests-importable-objects.sketch');
      var document2 = new ___WEBPACK_IMPORTED_MODULE_1__["Document"]();
      var symbolRefs = lib.getImportableSymbolReferencesForDocument(document2);
      expect(symbolRefs.length).toBe(1);
      expect(symbolRefs[0].id).toBe(master.symbolId);
      var importedMaster = symbolRefs[0].import();
      expect(importedMaster.layers[0].text).toBe('Test value');
      document.close();
      document2.close();
      lib.remove();
    });
  });
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js"), __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/Library.test.js":
/*!*****************************************************!*\
  !*** ./Source/dom/models/__tests__/Library.test.js ***!
  \*****************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect, Promise) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../test-utils */ "./Source/test-utils.ts");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */



function findValidLib(libs) {
  return libs.find(function (l) {
    return l.valid;
  });
} // some tests cannot really run on jenkins because it doesn't have access to MSDocument


var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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



if (!Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
  test('should list the libraries', function () {
    var libraries = ___WEBPACK_IMPORTED_MODULE_1__["Library"].getLibraries();
    expect(libraries[0].type).toBe('Library');
  });
  test('should be able to get the document', function () {
    var libraries = ___WEBPACK_IMPORTED_MODULE_1__["Library"].getLibraries();
    var lib = findValidLib(libraries);
    expect(lib.getDocument().type).toBe('Document');
  });
  test('should be able to get the list of symbols to be imported', function () {
    var document = new ___WEBPACK_IMPORTED_MODULE_1__["Document"]();
    var libraries = ___WEBPACK_IMPORTED_MODULE_1__["Library"].getLibraries();
    var lib = findValidLib(libraries);
    expect(lib.getImportableSymbolReferencesForDocument(document)[0].type).toBe('ImportableObject');
    document.close();
  });
  var lib;
  var libId;
  test('should create a library from a document', function () {
    var document = new ___WEBPACK_IMPORTED_MODULE_1__["Document"]();
    var artboard = new ___WEBPACK_IMPORTED_MODULE_1__["Artboard"]({
      name: 'Test',
      parent: document.selectedPage
    }); // eslint-disable-next-line

    var text = new ___WEBPACK_IMPORTED_MODULE_1__["Text"]({
      text: 'Test value',
      parent: artboard
    }); // eslint-disable-next-line

    var master = ___WEBPACK_IMPORTED_MODULE_1__["SymbolMaster"].fromArtboard(artboard);
    return new Promise(function (resolve, reject) {
      document.save('~/Desktop/sketch-api-unit-tests-library.sketch', function (err) {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    }).then(function () {
      document.close();
      lib = ___WEBPACK_IMPORTED_MODULE_1__["Library"].getLibraryForDocumentAtPath('~/Desktop/sketch-api-unit-tests-library.sketch');
      libId = lib.id;
      expect(lib.type).toBe('Library');
      var libraries = ___WEBPACK_IMPORTED_MODULE_1__["Library"].getLibraries();
      expect(libraries.find(function (d) {
        return d.id === libId;
      })).toEqual(lib);
    });
  });
  test('should disabled a library', function () {
    expect(lib.enabled).toBe(true);
    lib.enabled = false;
    expect(lib.enabled).toBe(false);
    lib.enabled = true;
    expect(lib.enabled).toBe(true);
  });
  test('should get the lastModifiedAt date', function () {
    expect(lib.lastModifiedAt instanceof Date).toBe(true);
  });
  test('should remove a library', function () {
    lib.remove();
    var libraries = ___WEBPACK_IMPORTED_MODULE_1__["Library"].getLibraries();
    expect(libraries.find(function (d) {
      return d.id === libId;
    })).toBe(undefined);
  });
  test('should add a remote library', function () {
    return new Promise(function (resolve, reject) {
      ___WEBPACK_IMPORTED_MODULE_1__["Library"].getRemoteLibraryWithRSS('https://client.sketch.cloud/v1/shares/PR8z1/rss', function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    }).then(function (result) {
      expect(result.libraryType).toBe(___WEBPACK_IMPORTED_MODULE_1__["Library"].LibraryType.Remote);
      result.remove();
    });
  });
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js"), __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/Override.test.js":
/*!******************************************************!*\
  !*** ./Source/dom/models/__tests__/Override.test.js ***!
  \******************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* globals expect, test */

/* eslint-disable no-param-reassign */
 // using a base64 image cause I'm not sure where and how to keep assets that would work with both local and jenkins tests

var base64Image = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAEDBJREFUWAm1WftvXcdxnt09z/u+uqQoUS+KtGQ7kZ3EERIHjuKmseNUhg07QI0qjeE6iAsU6QMoiqLtj/0v+mvzDxQFDARuixZp3DYp6jiW7cS24lAyRYqkSN73ee5uvtlzSTNGIlc/ZHFxeM6e3Z1vvpmdmT0UpbWSuAlLhF/VcCPcnTBEprq3xANF6YarYtZvFQlJWEOUhAEG9/vryJKEJhvyQiLjKwaTh9WsMAVNLWGKryhU5PFsHoAO/uvxpcJQ4cDDATh+A3lAVjXcSIcNj77DgZkYXeH2ZhNn+lSLHlwB1w1ziwuSknxDDmWF4UC6EyWM5YGCnPYsU800dr3ME8PSB8IdLqbEzBbCxJwoYKCGJMahH7rw6rymJoVFQRB3oFm8mXHBt1W3cNrxW56LxiME1pv93BOMUjVM+3C92XIFj+T+Q4PwPOt0f6rJfIsxlqwmIWbgKl5NpTkTjVUxRjFanoBx3AGjfgjIdeDCtt+/p9KwCjNMLGQf9D4Cz3kTuIMnsd+gOQoAyYA+pt+RqHkV2K4UhFt4odMF7x21mkrNw+QM1kxRnlz1sB3QDPsj5ldKOz90QAT7PC9WIXdW8909TAa/xiJetcJsGefDhvVhuFgRI8Aet+rKd2xuvK12FZ5hRDcDN+h2PIFiNw4ysK9YXbaYm4RrIFNehxucKWQ5VVMQB8IgQAgLV8NfKIbFeCdiCcbEpoHEUgkj4HKQA2TYsARVwTdWQBckukEsAJMA0F2dEryiG4pVgBiW5NGujdxkiAf7IcmQBWNb2IREOgsEEGABOnBeU7BxKRSC1cMqQMZgMJvZqmwCmWy+Sj56MQEAK1CMHQ+u8QbWxniiRllOPhjdIzVhqTonnZAdkpiSSKjMKbO2lAL44Nw05gX9iLw5ogWyDQoHpLFYjURT6phUCw4HLM6UparYhg4MS2Mhksw0YFmmB8AYe3VlTIDvgQ9YUkaUblE8GK5+P/SnQSaLcqTlUNtBUvSnaWJtLVC9xVMXbJoORhuj0SaJvB52ArFgyjAOR36tM85F2Drjdz9BysNLGWAXwjb4SWWl4K3IogUrxg2wAGcWx6su8Cysx7xhDOsF1kfZ+/8+2vuP1N8NMqyQiygRnoabhn6jEc83mqfJa4q42RGJMDt5ftPaG4UlrXMzUrE+Mk3UdHwyHA3aZx715SKVUekBGazgNgGYgTjscWQF1wALPzxjI8h9Czry4DxomAfz7b79zhv/fGZpGAZ7PkUAWvqpESC1GQRHw/opqi3SJKIgoOaptm/KSZqmv5BiV8VFaP0873dr7fEkW3v7dsuvixOPUF73VAuxhoWANEACOZW5nFhgcpufQTNSiU0D78ZAYGTetql8//rr/1QT6/Ay38+oaGC+LkWpIxmeCsL7SS7TuMO+n8JtOpDjSSOM1larYEJyANP4nmwHtDFc2/15u9dsUfM8aU/IBjSD40EWBCpQtZ/osMtAFXqBqSILmDEQaA0Vtylcn1z93uD2a2dPat8WNEo0nN3EVjQ8tRDX7qfGeVJHARhUmSSVBpl3nkJZ94pkOJlON6W/43s+5amU3qluMdp6LXsrDD/fACxsZGF9xDMgg3jsNyeYhXtVUEAY2Ye1/0r2yaza9f9cXf1epz3g/WjnKZGqNzVF4Mljqn4/RWdJ1ws9ybFBjC8C6VupEGFVSI2FqFhJ07DUYz+ISafw76aaaI1d8d/htR4tXSZRx3IA4TCVBWgmqMVtH4R7OPRYUjGgWv4/P3xZyt04zJPxHsGH4x5ihLal8hrUWKR4AUFLQ+Wal9mpZOVlmkz1eASbiu6p7sK9BtTmMAhMnKfDzXqQRHJ44+qrVPSpBFYWDO/SXA0gr8+aSO1OSTaimkKgSqwSPjub3qPRj+z/fjfd+Je4NR7FMgl1ba7e6DZ2tp/oHjkp22eJ2qZUcFsRYosjxuVSY5/HLoo670WQE7Y0/7h7a7Upx7HItzfW5DjviOa4H7aOPyoefoFqn8mzThCzf5el9lB9uakyK0pg0tYrSqkihynvE9221360fvOtMEJKEKOdcSTiRnBsb1u1ewuy0SEvQsQRKpAeIpzS1qUORETsKGRL/oF6BCLhtZa7jWUyPVPUG4iouS6ScbsZrK/9lN75IeWbQTDmNAX/tiDMsQffaiEcu8SCzJ5rpDzkkFV695WN91+O/VuyqUF+01I9a1ByuttaoNZxUnXYzmqvtEgj0lqjOcUBEdepswIBEQfbShg5PeO3F3x9I12/KsdbLUzRqc62WhGtvv3yUrdHZ79I9oSmhocqlWExXR6yJApYBCM4vcYN8sng2t57P2jo3WZoy+EU0awJF84VqTk6ci/5KPqQLZHgQl/55IGhzOdsWK2J9ApP4gchcw6PyEZRk9qno9Ee9a8TjbjkS5Jmz8sHk72fvtqNj9Jij2wdaBALKpf3KLVIBTkAheT7cMT12z/+r2RtdXkuMoP+dGpa3Q6lU665u23qb1GEdZH+GoQyAQg4/2IythFcFCvDvTjicARCP676CN0aUy2mFjhWtDV1mSUu3t9u91Zev/p2l06vLH5BSVUy5bMt6FEA7hkQZz/En1bsR+1310b9d9cWaipLs+F6miOB1q8tye9rP9wRtxT0kLE2PvuC1VIUSpaC3QvP2ARsSI6nkmNhQEcno2m30fWmyc3XrprbtBBTkWfUqG98cHMYn1yeX8IsY7Sn/AJVgauJENOgJXKSb3VmUBTIaO5zTy+v7938wcuetrEcJOM+RSLPis1rP1m493hPTSwfbzBbaovSCvFBS/4BFjdOYhUsXtYUYrvRCgO9s7O1m0+pHcOJ4vHUJsnc7jS455Fnjjx0mXRoUcmCnf14hSoBVMCgpadQFvmkscWOnXrmO14/W/+/fz0RhaHXTMqiFnlQl4Z9dQR2ASsTRAUPnHM4xqkLcFwGwfZz5RxW9CAKGKUJ9BQBx/YpRsmciGEqrd/dGHvnPve1xceeI9XFWKWCfJIHseOK7cabCUqijEFXg2SPguPkHT/+7IutlQsj4SGINqI47ScCzruawC3LokB60ZSXJqWgLHTpCjKUWdgWQAw9BQRZLu2RkgSlUg1pfIPCEt110+z9fJp1P31x8YknqY4oj+3G3DM5+2xxpnAFF/OPjYAwwedT1aDmiZXn/6wf9HZRLSRlO2pNUM+ltTI3XhxDNkeVAIWPRo4ujeaTKedad6PAIUag3wITsuTme9RWVKN6ngdbNrKnzy9dfobO3EMyTjOM5eLAYUMhxQ1Ke66KZZxwUfZSGARP/hzNf/KzL/ztRtGJo5ZJsqDW+GA7H+wVpHyN+gAbTvHZAFsYjBrYnwy04sQmy5JwXNdIKaSa0/c2Uc/6tibSKGos/CLzPnvlJTr3GVSqeB8hr1TRiktVXg+Nayze14caIIH4KQ7pcp7OX3rspb/7YK+Qtblx6Zuo279FNCgVymko5hSCs4J8aAuX4yCPYhPKlYhsXogKOBc3r1O92cnKdi6ObEy8373yJ+q+hxNqD8E2KALN7JogGxxhJjcmyTUgQWVtUH9hGJqKqJ/A8xbogccuPv2td/cK0Z4TtabdpWQDpmv5SFbYzzigTbF8QDqwhVKoypGuc/I0nDVUJiy29kKPhqmi9sk31vOHnvp2dPEy0ZyhHrqYcADCCcFtmAN3YljVxsZrsKgs7MB1DwbHbcrAhN+mS888+NiVnak/mIpQ0wTJHR6DrMwmV67+Rt1WVbmwIjIkaMONMdPpYIOKBGGn9+Pre1/+5p/T558kMadNHbue8zPEoPko8dl5UDy5Zz4X4RENf5GI4FxwE34uygSWUGGRgY3m6eaTf3zinkd03o5UlI11vj1gRYUwZRlECHCl8JAEMR+pSfPBG5W+Tvq7WbpJvfqZta38k5cuy69doXCRdKwoCIsUm5glAR1KTmTPCgN3sRGBYsYgY3VwYdDYo9wMNGVeXNcalcXc4uXfn++dRrrJU9rdKZh3KXLYqxaXDAvRYd814Aegr9T9AS10Tq/f2Dt77sHFr19hjv2YUKwCP2sF+dYiReLQq9PSlAFOWa4Jy/Hw1ze8QpMuT+EGx4Ysy/b+/lymk9xMzj1wLJ5HuQFSQ2PLspWNUxPFBMeyE4rDOHu9TLfFq+pLfr37+B+8QCufwoGHwrb1OWshlwLPjBH3XQNnbnTAFdDYt+7cAAgD4CthGNZqtbPP/WnfdI1ojHdTSkWZoBgKUYzj+I7CRGZ8fotbfrFTGNvY3MkpqD3+1LN09jzyG/khnMhZ50Amm+/g4eDmTrAABe3DoVIGOHI9+I2Lz/5NXsyPN/JsI/MaR7M0ZQISG3EQknZMetopzcmfXc+95srDjz9NFy6SqlEhKIgRcPENCOZjLB+uzU+ActBxJ1g80cEyrlW0kVj2vvDcxd978fptOdzxaeqHnir11JO+LLFphK8DNe3eWDV74vjyl5878sUnOGxmOBG1kY6A7ZCFgAYhHtZgWIfbx8DC0AoZMFXg2FXLOfnVF5a+8vzqTVHcSGAX+LCHU7yMskSL+jztRmtvjR/46h/RV75BqkMljrVz1g8nCCiueC1mMPCnMiIjOwz4N8ICiBk9UA9p1DV2f+wylO+mtfSHf9E8/6U3Vyc0MX4YsilR2/tNRNo3X7/5wMNPzT/6NIpSfNI1fgM84WyLGAAgGRK2+0B1mJ6PEPYbYR2Q9KuTXdTE4UqHSAD3feuvB8c+sT0IKAmgBrs9dbZvTNKFlaPffImaR5Hy4XbG9xMXT/gDklPKJRIg5M3EDf1wykPQ7gQLyCrbHdCGG8upz0aNuMgkHVu59PxfvnGdppNe3DxGVEuGwTvr5uKLf0W9Jc0nZlk4w6HoD7xZWosUZVnqjAlNHCbn6zPDVjgPRLrHj78gwKI+ZiOIAqkspIF+85WfvPIPD12w48HO1mZn+dKL9KmvJ7odq8AUhfAbWPRApKOB64xf7UNxxSU2WhW37hRO3bCPXizSUpn5/H0Ux1P+FkjDW+nP/m3tze922rXO6d/x7ntCNy+MKYxMGsIySJ1oznzIZs5wFUhcK1sxJmSMCmlVnlbgPir7Ds8C3xq4/sdO1yHyD6qteDm60OiMx7VW6H36cfJOWAqBJc8t0mUVobik5uYYmcXPGSYHbuZLsz/Q4m6NCHZQchrFhlD4XoIAjy8f0DS7ReXUdk4MkfOMCiXlOK/7+LgGQA4T4tNBQGfygAF/QBKDqVDjpiqr7hqWO6EgmDlrVKcmTtFOT1TJXEYDJEo3Unxq2TcUy8UP8CuDVoDwcEDQvp15xKFe9/jxF2nx1YhFoCJGceo+NOCIiYKcD6cZ3I01RlGd8D9VHAy3KB7gMJiKHzAzSfCnCiwGOFvjaAiluN21b5FFRSW0xHdBXgwFnI+vmDiG4csRBIoExx3+ioaQwOaTqAvQKk5wHsI9K3AIcIWU+2ZZiMdU43nm/7eV+KaLio8/ucOBS9yhWlKFLvB5nKIAK1bbzUnHCXcfRwWlwgRZBzzN5OIFI0M3t7v2rWrab/t692z9thG59X8JjZB/N6F8uAYAAAAASUVORK5CYII=';
var base64Image2 = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAEXRJREFUWAnNWVmPHcd5ra2rt7vOnYWLhqRWkiEhy5ZkJbIWJ6YMIbEhGUIgCEgQ6CVC/kx+RIA85yEIgsQPBgI4iGUnluNYVEiJFNfhcGbu2rfXWny+vsMhZSRS7KeULmu6q7urTn3r+Ur8b9wPOaOmPP3lnklOF94b9E5Q75lgTDgMe66dxbAXDr3luGaOnnLv8V0gPD6WnFnP8Mig9zylx06gp5e587yxzBQs95gY67JAMR3aKHCBdHIRFu3g6mXmneCCXuOOSUyBni4ZFiIE+IdrQs0VYaZBA5wOC9HsnPAQbIk90Dw0ii3hPYATAmjabeNTTMG5kEzTavSi4NgltnI4LQ0q3s7LeUNLABh+2IVTTCjvsWOPhWnTtHugFTUL6TsMc2DEzPhh+dU9ZlPMK8dpBBiByrBKtJLG8hKC9DQJ+gDqoYnQsCFMJQxp4LApSKCVCoYIRDtMwsDuPQEFJvphLgytdk/vYHZaFV/TXBANUBBK51q0kAl0ayECSN3Rq0CEeWgxaAGyBSx8iAWoB3rSA2FY6Rqw2j3T0xVagkLrsKbFVK8w4SnzIfPSikV7HWDrzAe0HHaP1lpYu4rx3HJaAz+g0zQ1idRBbAILwQw9U7hygIhNe4eZSK70SdjCJSXiM7yGvp0I4KBQtKYFBBFiJk1rAwcLGCkI1q1g5ECJlbB54SGklXRL8gxqkA0+0ZqkhfnRAIYMCP+1r9Awtk+iI4OzGLWkMUKiABSbsS4gZBymDd8BrMaxJYmM9qnxD9YA+dMfjBEISN1Jr0iypEpMXDEOE2xav4GFBfBa4A6gRw7vIJc+tBK84a3hRkrnHYQFZGReQAivI/wEDbv3mAWihkbQ6nYvmAHbhQVBnCRqwWG5FQTC7BwvcXIdgIO0MCWe4+0Km7G8pH27kPuE+xTThipzTFVeSx5ULMAuMIchGyIJSWGACj+YhGeBx4ItMLgDtgGh4rV2gKIECUSyWMJZvAwRjbBeM04DW9hJKnljcsbmUtSWVWVjBEujoGs9lI6plkAoZShZl/m+s2GHjysrve/pYFSWQkcjy1TDTCs8x70NECw4jEQrH0B2ZFKtIuE8cDLqW4FiHPigUxiM7IthXh7oYNkLluPsozCqfRVwnzl7UPhJXi+LAioYhmo0WjsO7y/MwWS245omjfpaDa0Ric7icFAWCWcnN6LTiBcHda51B/HMsQBag7UJipSCPMCJSkJRTLXoYIQNRSng4dAOnCtQLopFBH8YhklZfm7VZ/Pxv2ysu2wCm6m5nlpW4JMk7odhJ0SgdjWXKpQiDVzhdhtzi7Tk/GK+CPWoKgcsP8OCSTy80BF94xomoFD8sJyHVAR5T2s+D6QFPcKhK3pEQ3gKQ5aaa9+YADHa7XfV9Jf/+Y/bZ8aimsRhouCFKi9hCEIHehCooWD4rTWukcKv93ztbZZdY2wWhSwufV3vDKKmrPjtz3fPBNHp7vM7TVaytBEhFNrGN8oa8KHWyQgEMMHQ4JyQGkkPbiwYLIO7poqVq7Jbo+7k2pUfhezuQDmIsRHYgDQ2ViyRYlOxU85tGzeK1ZbztasXUsP8TCghS6dEmXZqlcObcmX25WJZ3ev5MErdOuebEITjsYFzo0GZ8ABKcm2AgNcgV3hohAIVEirFEWQHLZtAzFRwdz65vHf3wye2mapruGWFYGKtFR2ljgt1hquTlg1xOzd1ILUU3dpUkvWj8HhVLqcHd2XMQsFskYfGnOy78uDje1Wz+eRrCEkND4xEHAkQC2BqFAQotLWwoGAYAcW1VlbUUXAyWi7L6tNAfHL58t+dOuHLWdXpd8vFItli0K1i6yI85dTJwnQKUXsxK3ydcth1ACYhWS9A/BAVjKEu7sZJLFwWI9jENjPjZf6py45F/ajyYAtQV4KIAjVwXsOLBYsBAXGBkutDTGR3kJadF7tJaH/yk3/odhDJql7C6mXTDUd1xZq6gX6k6AjedV6T/zIbBLZii8IvjDPGSuvCMNw4tvmUdWldSsW1aMx8DF0ZzbKbV3+u/FIiEJKKDII7wjjAtVGeJKMymUFxIUspHpg6DpDnp8rcPqnu7P/HP71eT9KazTCTYtOY171oXLwcxsMgOlmIYcU0wqKSGn6IzKAgKEZhE+Qq913P+zAMd/zG3fF4S/WSsFv0dlXBhnzJFjfc1R+ePv8dY6pInXZY38SwnUCKklAhOMGuEGkp3cIAnXO5YHPdLMZ3r03v345jjWCa3WcdhqA5HO8v424viBOBpMIlEFAHR0YIha/QjaR0zIUQdCtE0GWbnXDdNpGvVU/pAN7VsPVBvLdzbe/2lZQtXb0H20OONQ4kZZVpmEpZCOIBfGR0YKg+71b70fLOzvWfd4Oqk+iyrHsNi4rYLoNe50QRxG2YhpFC7Ph5641zRkmMIEGYlj1in+AR6L02g1EyMs3+cv92Z6Z6tobH2yYbhMH+tZ+eGp4UcTRn/QycQ0SGR4y17DRRgCOQZiuGGRsJu1vsZTf/O22Kvg7KWY5oti5Du9R+GOl4uMeKlhgi3sAUkAGRYRsmQa2QhSg9IBo7hECgJSZiNAI9omxnVM+W4UGW1sbbelGxjWFgrM1uXjMbnWDrOBJQA8+hSEBKVMLNlQhKJhtbIvjDKxf7+3u/uvK17dTNsyI362udpjKhUMeHG/em02iwz0Xoec/7yFiEaS/AwIEdnICyKhgJUdw2oTXoe9pkB4t+1DsxGOY371e7Y3gpUuDujbw/3Pj4V9fkExtrWxcjpnPMIMjJCZb3RZuoyS7AlDFvZURe+F98eO1EzKqc5XczlAS8U1p1uXTlfmeJt1BNWKeNJT0BA+yLUhqJDrMKoge4FAawshAOaPKwlxX64KN9dcCOw6lRY3Tk1Ru3DrrbF17eLqomD/NBPCwtolcLCzZqSdog1yA7oChar28fP//i/o9/BCmMVF4sG5cg47HZlYOnn1xj8COYDIgSvAxei+YseTGiCqCAR0CDbaoj6gYtejPss7iul3tzGEg/Zh2eLmvkj3RRmGMvvrS2/Xu3wCjKUkP6sgILwpQwkbS0TQ3eQ2na1FIOj22f6KTqILv97/92JtZxYBsEn4gFGVNjEyJ9Y1X4DhQFtgYCB4wGemyTPpBBaiR/cEJKJSDXEaL4fimnLEUgL9hBXXrVvz4pz377jdErf/R5UQbxqBOIidmPFeoXgiUK22FioHgCjUupEf/HTE/jwZOvXUoeP58HncoGyB7FPhNLlu1U3EbAHurYegRIA1ylMSqKKlB/ATokLfKbUkLB9hW4dVQlapHqaVjeYqnjOlB+mH5aTR575cX+s2dnWjc6zuHQTGgFGR0qUcAnERhaxgPlgKqCQ6Zz0Z1Fmy+98+e3jdhruKnVIObZAmatbM07cQ9OCN8RGtPUMoLoG4Rx6BJxBoSltSoDl3NIn1O1GW1PPq9SPCx5XtsDJfkzp7vffK7Y3MwoWSVKQo4oG2XTFhYkLVIINaLICEg1ibxb+tE0On432nj+3b/Y8SFX3Sr3nZG+urvMZkWghLVI7UYq58DcIlMhRoS2EXWjLFU6CqYLI6PqMmLJrU9vIwkgztpa6v76x9Xy8bf/JDt24p6OlpSru8zFDbH2iJOeqYFPVB6pm7gO3cIYmI8NS/aa4B5L/Klzr7z3/vVpyTtr98vadNh8l9XTIrACSOB6oEGwIBiTg6FTuUEkhIiSpdIAxQni450bWRgjKwc+Htxa+ue+/0412r7O+G4NkXQCnjorTYP1gaytjYFD8JJqBwqGxPMD5GCnkIld2MmC9A7y+alzL7z93iezfK4Cudb1Y7bcKROXaNhVSTM1oFOoi5rAGwp8kBermEBicCq0upzc0wGbVJUYbf1sZ3ru0tubF16/WercD4ReD9VQsUh45AhwGl4TxW/FA0D4SzUMCnBwHxQVNGuFqIGANrZ8EnXDs89uv3KpCof3pnWE0D52rMS+qBrzVlCWRvlFmyE+Qn0rKuVVnRlI11VMJYOffrbz9bfe61546b5NRHRM81HMushEuc2AB/UkkDiD8omaEh48H2AFcpp0SNoge1APROqW5XI9Ho5ZWcjoqW9/j9f+sw//VXdsuTSzg6z7WIIMWNcuiLT1SggcPVA5T8cEDDJHXOHTsbP32MZm7792mjMvXNr+w7euFMChOyCHlPts6eewoRh6QMJ3pVaQUcu3uAMzh0mRM0JaSOQtHSsEqztxnPmiwKFFujZh6qkL3zh9+jxOWkCsxgeYhWJWVbMk6RCtVcjziA5U9MG8tdTGuPmcbfXVnZvz7TPnX3vzB9dRK8UDqQd5UcOoYXw4yeEKdmoasLm6CEF/28b/1v3z6op6Sh9H7dBD2/vDUInr7l9/kDc7PvGnn2GDDZHnLlY9w22VLpHDVUCExM3ZMbk+/mS52Cn+XvVOP3Pxyede7j12fsa7U6NqHgXI/b5RqGxI5QjNsH0ELdRiODKhtTD427WLb/zxXHYbnGPkoBoO7B2yASyYAdW7hvJXv5ve3p1UTu3P2OjEmcfPXhgde2xR1rMcpK+XyM68RAF81NpkenTXXvwfYeG1wzeLsy8+dendpumMrzGPfCLSpcsdirfK6QYkmvkFWxYKMfnyjYUajJ55/tV06/E6GDa6b1W8ZK6A5QXgIHCYh6tTpqc69lAtDx98Ee7/eneL9YYXXz/36p9e3UF+7dQzVF2oo6AOWAgq18CXWlbx7r18LKKTf/CdtSculnp40Egru0z3sspkTa0kwtmXta+EhReO3qHrUgx36ih+/runLr3zi0+ycoIaNMCxTAhnCtSkaGLdl2N+54o598Zb/BsvTZEzoo0q6I0bvgDhDFOIqmiIgqIdiQfXMDDiSW07WnJ1+9U9jn/qKL1p9dnv/kA+9swvby2cj3GqUSFOK6F15Jz+2Uc7T7/wtRMvfGsn6ucsqXhasaiBUdMJD61o2rD5KCYMwp0JW9u+BBYeHT1dXVNvwLcQPJS6WfDn3/+rm52t/VzVuWirqioO1O37e7NRePZ7b++xeA6mpno5oi9SewAHDGpb26ZMEQkeCGaFA3aGKN8io4GjhVdPv7o3Pm9YicpnKfUk2Xr5z/7yxx/fK3w3TAZ1E4zn5sp+/cr7H9xJ+nsVaMyoAR3jOD0EDJQjjWROtxG8VRmyKLhCe47cXqAIWCH4SlgkoUd/iovSLAMQ5UBfL6tZ58Tvv/vB5QPR+NH+VC7U1sU337mTHL/L13zUt4CCkwWOTIKTOINfLAELYjEYXCFAfjeeDjLBN9pTYxr+Slirbx/2KOdx6liBsUqwxi7KIrF57uTX37y6I2zydPLUt+yJZ6fs2NRFFUgFKgQ6wUMVefjDERCiqEIEXR0fgeOStChYQKIrGoPF2jrjaFFiu78R64+eHV4olqIqzQXCMeta8FZTic3ozDejXIRrw2LzdCZGxq/FyJIS7LgGxThqRzYOEKtBwvTAzDHSHuTSky/CWr37pT2oolSpobM8j5oaUbRQIgkGm+deNUJMWLzwibZprMA2s8Ys4Z6PaORBymtPf6EyMnOiBdQoAz1oKBIeyYMraa36B2/8xl9Uc6EKiYZYA5qEA0AUqrDrfRY2XjYc514a/5+mcpCTi2UIgvpwtQdzwePgmkeAMCzJCltkYH2/g7RwCrI6CClxyiVRnAscjeDIqxa6RD0Ebkini41DLYpDMqELUF8y4YfYWsUBE4YO5QhM9P9bKJyiSPidYHUlak+kaY0MUnqcePPUG2tMrNe8qKFS7nLYuYDufIzT/VUtuQpIQIILoAYg+B0Rowe6AyYJdoso0qr0t7Yt6WpQSo+zVTr5BDMFGYHS+MLOhNSJQk2GkhMkkzZNNUZr0W2ZTXZEg2Q2cDrqVza+imHAdGReX4T1qJ1hgv+pzWQfw6hDAqrF8Tm4bIj71UStquCjxDDJ2yUOhR9prXhaza3GyZ6ogT+2pyurO/SPeMnR2P+Di18D8cVdoZqZfR0AAAAASUVORK5CYII=';

function createSymbolMaster(document) {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test',
    parent: document.selectedPage
  });
  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'Test value',
    parent: artboard
  }); // build the symbol master

  return {
    master: ___WEBPACK_IMPORTED_MODULE_0__["SymbolMaster"].fromArtboard(artboard),
    text: text,
    artboard: artboard
  };
}

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should be able to set overrides', function (context, document) {
  var _createSymbolMaster = createSymbolMaster(document),
      master = _createSymbolMaster.master,
      text = _createSymbolMaster.text;

  var instance = master.createNewInstance();
  document.selectedPage.layers = document.selectedPage.layers.concat(instance);
  expect(instance.overrides.length).toBe(1);
  var override = instance.overrides[0]; // check that an override can be logged

  log(override);
  override.value = 'overridden';
  expect(instance.overrides.length).toBe(1);
  expect(instance.overrides[0].toJSON()).toEqual({
    type: 'Override',
    id: "".concat(text.id, "_stringValue"),
    path: text.id,
    property: 'stringValue',
    symbolOverride: false,
    value: 'overridden',
    isDefault: false,
    affectedLayer: _objectSpread({}, text.toJSON(), {
      selected: undefined,
      style: instance.overrides[0].affectedLayer.style.toJSON()
    })
  });
});
test('should change a nested symbol', function (context, document) {
  // build the first symbol master
  var _createSymbolMaster2 = createSymbolMaster(document),
      nestedMaster = _createSymbolMaster2.master;

  var _createSymbolMaster3 = createSymbolMaster(document),
      nestedMaster2 = _createSymbolMaster3.master;

  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test2',
    parent: document.selectedPage
  });
  var text2 = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    text: 'Test value 2'
  });
  var nestedInstance = nestedMaster.createNewInstance();
  artboard.layers = [nestedInstance, text2];
  var master = ___WEBPACK_IMPORTED_MODULE_0__["SymbolMaster"].fromArtboard(artboard);
  var instance = master.createNewInstance(); // add the instance to the page

  document.selectedPage.layers = document.selectedPage.layers.concat(instance);
  expect(instance.overrides.length).toBe(3);
  var override = instance.overrides[0];
  override.value = nestedMaster2.symbolId;
  expect(instance.overrides[0].toJSON()).toEqual({
    type: 'Override',
    id: "".concat(nestedInstance.id, "_symbolID"),
    path: nestedInstance.id,
    property: 'symbolID',
    affectedLayer: _objectSpread({}, nestedInstance.toJSON(), {
      overrides: undefined,
      selected: undefined,
      style: instance.overrides[0].affectedLayer.style.toJSON()
    }),
    symbolOverride: true,
    value: nestedMaster2.symbolId,
    isDefault: false
  });
});
test('should handle image override', function (context, document) {
  var artboard = new ___WEBPACK_IMPORTED_MODULE_0__["Artboard"]({
    name: 'Test',
    parent: document.selectedPage
  }); // eslint-disable-next-line

  var image = new ___WEBPACK_IMPORTED_MODULE_0__["Image"]({
    image: {
      base64: base64Image
    },
    parent: artboard
  }); // build the symbol master

  var master = ___WEBPACK_IMPORTED_MODULE_0__["SymbolMaster"].fromArtboard(artboard);
  var instance = master.createNewInstance(); // add the instance to the page

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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/Rectangle.test.js":
/*!*******************************************************!*\
  !*** ./Source/dom/models/__tests__/Rectangle.test.js ***!
  \*******************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a rectangle', function () {
  var r = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](1, 2, 3, 4); // check that a rectangle can be logged

  log(r);
  expect(r.x).toBe(1);
  expect(r.y).toBe(2);
  expect(r.width).toBe(3);
  expect(r.height).toBe(4);
});
test('should create a rectangle using an object', function () {
  var r = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"]({
    x: 1,
    y: 2,
    width: 3,
    height: 4
  });
  expect(r.x).toBe(1);
  expect(r.y).toBe(2);
  expect(r.width).toBe(3);
  expect(r.height).toBe(4);
});
test('should create a rectangle using an object when x === 0 (#133)', function () {
  var r = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"]({
    x: 0,
    y: 2,
    width: 3,
    height: 4
  });
  expect(r.x).toBe(0);
  expect(r.y).toBe(2);
  expect(r.width).toBe(3);
  expect(r.height).toBe(4);
});
test('should create a rectangle using another rectangle', function () {
  var r2 = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"]({
    x: 1,
    y: 2,
    width: 3,
    height: 4
  });
  var r = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](r2);
  expect(r.x).toBe(1);
  expect(r.y).toBe(2);
  expect(r.width).toBe(3);
  expect(r.height).toBe(4);
});
test('should offset a rectangle', function () {
  var r = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](1, 2, 3, 4);
  r.offset(10, 10);
  expect(r.x).toBe(11);
  expect(r.y).toBe(12);
  expect(r.width).toBe(3);
  expect(r.height).toBe(4);
});
test('should scale a rectangle', function () {
  var r = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](1, 2, 3, 4);
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
  var r = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"](1, 2, 3, 4);
  var c = r.asCGRect();
  expect(parseInt(c.origin.x, 10)).toBe(1);
  expect(parseInt(c.origin.y, 10)).toBe(2);
  expect(parseInt(c.size.width, 10)).toBe(3);
  expect(parseInt(c.size.height, 10)).toBe(4);
});
test('should convert rect to different coord system', function (context, document) {
  var page = document.selectedPage;
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: page,
    frame: {
      x: 100,
      y: 50,
      width: 10,
      height: 10
    }
  });
  var rect = new ___WEBPACK_IMPORTED_MODULE_0__["Rectangle"]({
    x: 10,
    y: 10,
    width: 10,
    height: 10
  });
  var parentRect = rect.changeBasis({
    from: group,
    to: group.parent
  });
  expect(parentRect.toJSON()).toEqual({
    x: 110,
    y: 60,
    width: 10,
    height: 10
  });
  var pageRect = rect.changeBasis({
    from: group
  });
  expect(pageRect.toJSON()).toEqual({
    x: 110,
    y: 60,
    width: 10,
    height: 10
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/Selection.test.js":
/*!*******************************************************!*\
  !*** ./Source/dom/models/__tests__/Selection.test.js ***!
  \*******************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('an empty document should have an empty selection', function (context, document) {
  expect(document.selectedLayers.isEmpty).toBe(true);
});
test('should clear the selection', function (context, document) {
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: document.selectedPage,
    selected: true
  });
  var selection = document.selectedLayers; // check that a selection can be logged

  log(selection);
  expect(group.selected).toBe(true);
  expect(selection.isEmpty).toBe(false);
  selection.clear();
  expect(group.selected).toBe(false);
  expect(selection.isEmpty).toBe(true);
});
test('should return the length without wrapping all the object', function (context, document) {
  // eslint-disable-next-line
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: document.selectedPage,
    selected: true
  }); // eslint-disable-next-line

  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    parent: document.selectedPage,
    selected: true
  });
  var selection = document.selectedLayers;
  expect(selection.length).toBe(2);
});
test('should be able to go through the layers', function (context, document) {
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: document.selectedPage,
    selected: true
  }); // eslint-disable-next-line

  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
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
  var group = new ___WEBPACK_IMPORTED_MODULE_0__["Group"]({
    parent: document.selectedPage,
    selected: true
  }); // eslint-disable-next-line

  var text = new ___WEBPACK_IMPORTED_MODULE_0__["Text"]({
    parent: document.selectedPage,
    selected: true
  });
  var selection = document.selectedLayers;
  expect(selection.forEach).toBeDefined();
  expect(selection.map).toBeDefined();
  expect(selection.reduce).toBeDefined();
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/models/__tests__/SharedStyle.test.js":
/*!*********************************************************!*\
  !*** ./Source/dom/models/__tests__/SharedStyle.test.js ***!
  \*********************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../test-utils */ "./Source/test-utils.ts");
/* globals expect, test */

/* eslint-disable no-param-reassign */


var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a shared text style from a normal style', function (context, document) {
  // build the shared style
  var _createSharedStyle = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_0__["Shape"]),
      sharedStyle = _createSharedStyle.sharedStyle,
      object = _createSharedStyle.object; // check that a shared style can be logged


  log(sharedStyle);
  expect(sharedStyle.type).toBe('SharedStyle');
  expect(sharedStyle.style).toEqual(object.style);
  expect(sharedStyle.name).toEqual('test shared style');
  expect(document.getSharedLayerStyles()).toEqual([sharedStyle]);
  expect(document.getSharedTextStyles()).toEqual([]);
});
test('should create a shared text style from a text style', function (context, document) {
  // build the shared style
  var _createSharedStyle2 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_0__["Text"]),
      sharedStyle = _createSharedStyle2.sharedStyle,
      object = _createSharedStyle2.object;

  expect(sharedStyle.style).toEqual(object.style);
  expect(document.getSharedLayerStyles()).toEqual([]);
  expect(document.getSharedTextStyles()).toEqual([sharedStyle]);
});
test('should return all instances', function (context, document) {
  var _createSharedStyle3 = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_0__["Shape"]),
      sharedStyle = _createSharedStyle3.sharedStyle; // 1st instance


  var shape = new ___WEBPACK_IMPORTED_MODULE_0__["Shape"]({
    parent: document.selectedPage,
    sharedStyle: sharedStyle // 2nd instance

  });
  expect(sharedStyle.getAllInstances().length).toBe(2); // eslint-disable-next-line

  var shape2 = new ___WEBPACK_IMPORTED_MODULE_0__["Shape"]({
    parent: document.selectedPage,
    sharedStyle: sharedStyle // 2nd instance

  });
  expect(sharedStyle.getAllInstances().length).toBe(3);
  shape.sharedStyle = undefined;
  expect(sharedStyle.getAllInstances().length).toBe(2);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/Blur.js":
/*!**********************************!*\
  !*** ./Source/dom/style/Blur.js ***!
  \**********************************/
/*! exports provided: BlurType, Blur */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlurType", function() { return BlurType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Blur", function() { return Blur; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _models_Point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/Point */ "./Source/dom/models/Point.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var BlurTypeMap = {
  Gaussian: 0,
  Motion: 1,
  Zoom: 2,
  Background: 3
};
var BlurType = {
  Gaussian: 'Gaussian',
  Motion: 'Motion',
  Zoom: 'Zoom',
  Background: 'Background'
};
var DEFAULT_BLUR = {
  center: {
    x: 0.5,
    y: 0.5
  },
  motionAngle: 0,
  radius: 10,
  enabled: false,
  blurType: BlurType.Gaussian
};
var Blur =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Blur, _WrappedObject);

  function Blur() {
    _classCallCheck(this, Blur);

    return _possibleConstructorReturn(this, _getPrototypeOf(Blur).apply(this, arguments));
  }

  _createClass(Blur, null, [{
    key: "updateNative",
    value: function updateNative(s, blur) {
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
    }
  }]);

  return Blur;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Blur.type = _enums__WEBPACK_IMPORTED_MODULE_2__["Types"].Blur;
Blur[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = {};
Blur.define('sketchObject', {
  exportable: false,
  enumerable: false,
  importable: false,
  get: function get() {
    return this._object;
  }
});
Blur.define('center', {
  get: function get() {
    var center = new _models_Point__WEBPACK_IMPORTED_MODULE_1__["Point"](this._object.center().x, this._object.center().y);
    center._parent = this;
    center._parentKey = 'center';
    return center;
  },
  set: function set(center) {
    this._object.setCenter(CGPointMake(center.x, center.y));
  }
});
Blur.define('motionAngle', {
  get: function get() {
    return Number(this._object.motionAngle());
  },
  set: function set(angle) {
    this._object.setMotionAngle(angle);
  }
});
Blur.define('radius', {
  get: function get() {
    return Number(this._object.radius());
  },
  set: function set(radius) {
    this._object.setRadius(radius);
  }
});
Blur.define('enabled', {
  get: function get() {
    return !!this._object.isEnabled();
  },
  set: function set(enabled) {
    this._object.isEnabled = enabled;
  }
});
Blur.define('blurType', {
  get: function get() {
    var blurType = this._object.type();

    return Object.keys(BlurTypeMap).find(function (key) {
      return BlurTypeMap[key] === blurType;
    }) || blurType;
  },
  set: function set(type) {
    var blurType = BlurTypeMap[type];

    this._object.setType(typeof blurType !== 'undefined' ? blurType : type);
  }
});

/***/ }),

/***/ "./Source/dom/style/Border.js":
/*!************************************!*\
  !*** ./Source/dom/style/Border.js ***!
  \************************************/
/*! exports provided: BorderPosition, Border */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BorderPosition", function() { return BorderPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Border", function() { return Border; });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Color */ "./Source/dom/style/Color.js");
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Gradient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Gradient */ "./Source/dom/style/Gradient.js");
/* harmony import */ var _Fill__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Fill */ "./Source/dom/style/Fill.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var BorderPositionMap = {
  Center: 0,
  Inside: 1,
  Outside: 2,
  Both: 3 // This is Sketch internal option - don't use it.

};
var BorderPosition = {
  Center: 'Center',
  Inside: 'Inside',
  Outside: 'Outside',
  Both: 'Both' // This is Sketch internal option - don't use it.

};
var Border =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Border, _WrappedObject);

  function Border() {
    _classCallCheck(this, Border);

    return _possibleConstructorReturn(this, _getPrototypeOf(Border).apply(this, arguments));
  }

  _createClass(Border, null, [{
    key: "toNative",
    value: function toNative(value) {
      var border = MSStyleBorder.new();
      var color = typeof value === 'string' ? _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(value) : _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(value.color);
      var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_2__["Gradient"].from(value.gradient);

      if (color) {
        border.color = color._object;
      }

      if (gradient) {
        border.gradient = gradient._object;
      }

      if (typeof value.thickness !== 'undefined') {
        border.thickness = value.thickness;
      }

      if (typeof value.position !== 'undefined') {
        var position = BorderPositionMap[value.position];
        border.position = typeof position !== 'undefined' ? position : value.position;
      }

      var fillType = _Fill__WEBPACK_IMPORTED_MODULE_3__["FillTypeMap"][value.fillType];
      border.fillType = typeof fillType !== 'undefined' ? fillType : value.fillType || _Fill__WEBPACK_IMPORTED_MODULE_3__["FillTypeMap"].Color;

      if (typeof value.enabled === 'undefined') {
        border.isEnabled = true;
      } else {
        border.isEnabled = value.enabled;
      }

      return border;
    }
  }]);

  return Border;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_1__["WrappedObject"]);
Border.type = _enums__WEBPACK_IMPORTED_MODULE_4__["Types"].Border;
Border[_WrappedObject__WEBPACK_IMPORTED_MODULE_1__["DefinedPropertiesKey"]] = {};
Border.define('sketchObject', {
  exportable: false,
  enumerable: false,
  importable: false,
  get: function get() {
    return this._object;
  }
});
Border.define('fillType', {
  get: function get() {
    var _this = this;

    return Object.keys(_Fill__WEBPACK_IMPORTED_MODULE_3__["FillTypeMap"]).find(function (key) {
      return _Fill__WEBPACK_IMPORTED_MODULE_3__["FillTypeMap"][key] === _this._object.fillType();
    }) || this._object.fillType();
  },
  set: function set(fillType) {
    var fillTypeMapped = _Fill__WEBPACK_IMPORTED_MODULE_3__["FillTypeMap"][fillType];
    this._object.fillType = typeof fillTypeMapped !== 'undefined' ? fillTypeMapped : fillType || _Fill__WEBPACK_IMPORTED_MODULE_3__["FillTypeMap"].Color;
  }
});
Border.define('position', {
  get: function get() {
    var _this2 = this;

    return Object.keys(BorderPositionMap).find(function (key) {
      return BorderPositionMap[key] === _this2._object.position();
    }) || this._object.position();
  },
  set: function set(position) {
    var positionMapped = BorderPositionMap[position];
    this._object.position = typeof positionMapped !== 'undefined' ? positionMapped : position;
  }
});
Border.define('color', {
  get: function get() {
    return Object(_Color__WEBPACK_IMPORTED_MODULE_0__["colorToString"])(this._object.color());
  },
  set: function set(_color) {
    var color = _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(_color);
    this._object.color = color._object;
  }
});
Border.define('gradient', {
  get: function get() {
    return _Gradient__WEBPACK_IMPORTED_MODULE_2__["Gradient"].from(this._object.gradient());
  },
  set: function set(_gradient) {
    var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_2__["Gradient"].from(_gradient);
    this._object.gradient = gradient;
  }
});
Border.define('thickness', {
  get: function get() {
    return Number(this._object.thickness());
  },
  set: function set(thickness) {
    this._object.thickness = thickness;
  }
});
Border.define('enabled', {
  get: function get() {
    return !!this._object.isEnabled();
  },
  set: function set(enabled) {
    this._object.isEnabled = enabled;
  }
});

/***/ }),

/***/ "./Source/dom/style/BorderOptions.js":
/*!*******************************************!*\
  !*** ./Source/dom/style/BorderOptions.js ***!
  \*******************************************/
/*! exports provided: Arrowhead, LineEnd, LineJoin, BorderOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Arrowhead", function() { return Arrowhead; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LineEnd", function() { return LineEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LineJoin", function() { return LineJoin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BorderOptions", function() { return BorderOptions; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var ArrowheadMap = {
  None: 0,
  OpenArrow: 1,
  FilledArrow: 2,
  Line: 3,
  OpenCircle: 4,
  FilledCircle: 5,
  OpenSquare: 6,
  FilledSquare: 7
};
var Arrowhead = {
  None: 'None',
  OpenArrow: 'OpenArrow',
  FilledArrow: 'FilledArrow',
  ClosedArrow: 'FilledArrow',
  // deprecated
  Line: 'Line',
  OpenCircle: 'OpenCircle',
  FilledCircle: 'FilledCircle',
  OpenSquare: 'OpenSquare',
  FilledSquare: 'FilledSquare'
};
var LineEndMap = {
  Butt: 0,
  Round: 1,
  Projecting: 2
};
var LineEnd = {
  Butt: 'Butt',
  Round: 'Round',
  Projecting: 'Projecting'
};
var LineJoinMap = {
  Miter: 0,
  Round: 1,
  Bevel: 2
};
var LineJoin = {
  Miter: 'Mitter',
  Round: 'Round',
  Bevel: 'Bevel'
};
var BORDER_OPTIONS_DEFAULT = {
  startArrowhead: Arrowhead.None,
  endArrowhead: Arrowhead.None,
  dashPattern: [],
  lineEnd: LineEnd.Butt,
  lineJoin: LineJoin.Miter
};
var BorderOptions =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(BorderOptions, _WrappedObject);

  function BorderOptions() {
    _classCallCheck(this, BorderOptions);

    return _possibleConstructorReturn(this, _getPrototypeOf(BorderOptions).apply(this, arguments));
  }

  _createClass(BorderOptions, null, [{
    key: "updateNative",
    value: function updateNative(s, borderOptions) {
      var optionsWithDefault = Object.assign({}, BORDER_OPTIONS_DEFAULT, borderOptions);

      if (typeof optionsWithDefault.startArrowhead !== 'undefined') {
        var startArrowhead = ArrowheadMap[optionsWithDefault.startArrowhead];
        s.setStartMarkerType(typeof startArrowhead !== 'undefined' ? startArrowhead : optionsWithDefault.startArrowhead);
      }

      if (typeof optionsWithDefault.endArrowhead !== 'undefined') {
        var endArrowhead = ArrowheadMap[optionsWithDefault.endArrowhead];
        s.setEndMarkerType(typeof endArrowhead !== 'undefined' ? endArrowhead : optionsWithDefault.endArrowhead);
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
    }
  }]);

  return BorderOptions;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
BorderOptions.type = _enums__WEBPACK_IMPORTED_MODULE_2__["Types"].BorderOptions;
BorderOptions[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = {};
BorderOptions.define('sketchObject', {
  exportable: false,
  enumerable: false,
  importable: false,
  get: function get() {
    return this._object;
  }
});
BorderOptions.define('startArrowhead', {
  get: function get() {
    var startType = this._object.startMarkerType();

    return Object.keys(ArrowheadMap).find(function (key) {
      return ArrowheadMap[key] === startType;
    }) || startType;
  },
  set: function set(arrowhead) {
    var arrowheadMapped = ArrowheadMap[arrowhead];

    this._object.setStartMarkerType(typeof arrowheadMapped !== 'undefined' ? arrowheadMapped : arrowhead);
  }
});
BorderOptions.define('endArrowhead', {
  get: function get() {
    var endType = this._object.endMarkerType();

    return Object.keys(ArrowheadMap).find(function (key) {
      return ArrowheadMap[key] === endType;
    }) || endType;
  },
  set: function set(arrowhead) {
    var arrowheadMapped = ArrowheadMap[arrowhead];

    this._object.setEndMarkerType(typeof arrowheadMapped !== 'undefined' ? arrowheadMapped : arrowhead);
  }
});
BorderOptions.define('dashPattern', {
  get: function get() {
    return Object(_utils__WEBPACK_IMPORTED_MODULE_1__["toArray"])(this._object.borderOptions().dashPattern()).map(Number);
  },
  set: function set(arrowhead) {
    this._object.borderOptions().setDashPattern(arrowhead);
  }
});
BorderOptions.define('lineEnd', {
  get: function get() {
    var lineCap = this._object.borderOptions().lineCapStyle();

    return Object.keys(LineEndMap).find(function (key) {
      return LineEndMap[key] === lineCap;
    }) || lineCap;
  },
  set: function set(lineEnd) {
    var lineEndMapped = LineEndMap[lineEnd];

    this._object.borderOptions().setLineCapStyle(typeof lineEndMapped !== 'undefined' ? lineEndMapped : lineEnd);
  }
});
BorderOptions.define('lineJoin', {
  get: function get() {
    var lineJoin = this._object.borderOptions().lineJoinStyle();

    return Object.keys(LineJoinMap).find(function (key) {
      return LineJoinMap[key] === lineJoin;
    }) || lineJoin;
  },
  set: function set(lineJoin) {
    var lineJoinMapped = LineJoinMap[lineJoin];

    this._object.borderOptions().setLineJoinStyle(typeof lineJoinMapped !== 'undefined' ? lineJoinMapped : lineJoin);
  }
});

/***/ }),

/***/ "./Source/dom/style/Color.js":
/*!***********************************!*\
  !*** ./Source/dom/style/Color.js ***!
  \***********************************/
/*! exports provided: colorFromString, colorToString, Color */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorFromString", function() { return colorFromString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorToString", function() { return colorToString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return Color; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * Given a string description of a color, return an MSColor.
 */

function colorFromString(value) {
  var immutable = MSImmutableColor.colorWithSVGString_(value);
  return MSColor.alloc().initWithImmutableObject_(immutable);
}
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
  return "#".concat(red).concat(green).concat(blue).concat(alpha);
}
var Color =
/*#__PURE__*/
function () {
  function Color(nativeColor) {
    _classCallCheck(this, Color);

    this._object = nativeColor;
  }

  _createClass(Color, [{
    key: "toString",
    value: function toString() {
      return colorToString(this._object);
    }
  }], [{
    key: "from",
    value: function from(object) {
      if (!object) {
        return undefined;
      }

      var nativeColor;

      if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isNativeObject"])(object)) {
        var className = String(object.class());

        if (className === 'MSColor') {
          nativeColor = object;
        } else {
          throw new Error("Cannot create a color from a ".concat(className));
        }
      } else if (typeof object === 'string') {
        nativeColor = colorFromString(object);
      } else {
        throw new Error('`color` needs to be a string');
      }

      return new Color(nativeColor);
    }
  }]);

  return Color;
}();

/***/ }),

/***/ "./Source/dom/style/Fill.js":
/*!**********************************!*\
  !*** ./Source/dom/style/Fill.js ***!
  \**********************************/
/*! exports provided: FillTypeMap, FillType, Fill */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FillTypeMap", function() { return FillTypeMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FillType", function() { return FillType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fill", function() { return Fill; });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Color */ "./Source/dom/style/Color.js");
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Gradient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Gradient */ "./Source/dom/style/Gradient.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var FillTypeMap = {
  Color: 0,
  // A solid fill/border.
  Gradient: 1,
  // A gradient fill/border.
  Pattern: 4,
  // A pattern fill/border.
  Noise: 5 // A noise fill/border.

};
var FillType = {
  Color: 'Color',
  // A solid fill/border.
  Gradient: 'Gradient',
  // A gradient fill/border.
  Pattern: 'Pattern',
  // A pattern fill/border.
  Noise: 'Noise',
  // A noise fill/border.

  /* @deprecated */
  color: 'Color',
  // A solid fill/border.
  gradient: 'Gradient',
  // A gradient fill/border.
  pattern: 'Pattern',
  // A pattern fill/border.
  noise: 'Noise' // A noise fill/border.

};
var Fill =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Fill, _WrappedObject);

  function Fill() {
    _classCallCheck(this, Fill);

    return _possibleConstructorReturn(this, _getPrototypeOf(Fill).apply(this, arguments));
  }

  _createClass(Fill, null, [{
    key: "toNative",
    value: function toNative(value) {
      var fill = MSStyleFill.new();
      var color = typeof value === 'string' ? _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(value) : _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(value.color);
      var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_2__["Gradient"].from(value.gradient);

      if (color) {
        fill.color = color._object;
      }

      if (gradient) {
        fill.gradient = gradient._object;
      }

      var fillType = FillTypeMap[value.fillType];
      fill.fillType = typeof fillType !== 'undefined' ? fillType : value.fillType || FillTypeMap.Color;

      if (typeof value.enabled === 'undefined') {
        fill.isEnabled = true;
      } else {
        fill.isEnabled = value.enabled;
      }

      return fill;
    }
  }]);

  return Fill;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_1__["WrappedObject"]);
Fill.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].Fill;
Fill[_WrappedObject__WEBPACK_IMPORTED_MODULE_1__["DefinedPropertiesKey"]] = {};
Fill.define('sketchObject', {
  exportable: false,
  enumerable: false,
  importable: false,
  get: function get() {
    return this._object;
  }
});
Fill.define('fill', {
  get: function get() {
    var _this = this;

    return Object.keys(FillTypeMap).find(function (key) {
      return FillTypeMap[key] === _this._object.fillType();
    }) || this._object.fillType();
  },
  set: function set(fillType) {
    var fillTypeMapped = FillTypeMap[fillType];
    this._object.fillType = typeof fillTypeMapped !== 'undefined' ? fillTypeMapped : fillType || FillTypeMap.Color;
  }
});
Fill.define('color', {
  get: function get() {
    return Object(_Color__WEBPACK_IMPORTED_MODULE_0__["colorToString"])(this._object.color());
  },
  set: function set(_color) {
    var color = _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(_color);
    this._object.color = color._object;
  }
});
Fill.define('gradient', {
  get: function get() {
    return _Gradient__WEBPACK_IMPORTED_MODULE_2__["Gradient"].from(this._object.gradient());
  },
  set: function set(_gradient) {
    var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_2__["Gradient"].from(_gradient);
    this._object.gradient = gradient;
  }
});
Fill.define('enabled', {
  get: function get() {
    return !!this._object.isEnabled();
  },
  set: function set(enabled) {
    this._object.isEnabled = enabled;
  }
});

/***/ }),

/***/ "./Source/dom/style/Gradient.js":
/*!**************************************!*\
  !*** ./Source/dom/style/Gradient.js ***!
  \**************************************/
/*! exports provided: GradientType, Gradient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GradientType", function() { return GradientType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gradient", function() { return Gradient; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _GradientStop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GradientStop */ "./Source/dom/style/GradientStop.js");
/* harmony import */ var _models_Point__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../models/Point */ "./Source/dom/models/Point.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var GradientTypeMap = {
  Linear: 0,
  Radial: 1,
  Angular: 2
};
var GradientType = {
  Linear: 'Linear',
  Radial: 'Radial',
  Angular: 'Angular'
};
var Gradient =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Gradient, _WrappedObject);

  function Gradient() {
    _classCallCheck(this, Gradient);

    return _possibleConstructorReturn(this, _getPrototypeOf(Gradient).apply(this, arguments));
  }

  _createClass(Gradient, null, [{
    key: "from",
    value: function from(object) {
      if (!object) {
        return undefined;
      }

      var nativeGradient;

      if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isNativeObject"])(object)) {
        var className = String(object.class());

        if (className === 'MSGradient') {
          nativeGradient = object;
        } else {
          throw new Error("Cannot create a gradient from a ".concat(className));
        }
      } else {
        nativeGradient = MSGradient.alloc().initBlankGradient();

        if (typeof object.gradientType !== 'undefined') {
          var type = GradientTypeMap[object.gradientType];
          nativeGradient.setGradientType(typeof type !== 'undefined' ? type : object.gradientType);
        }

        if (object.from) {
          nativeGradient.setFrom(CGPointMake(typeof object.from.x !== 'undefined' ? object.from.x : 0.5, typeof object.from.y !== 'undefined' ? object.from.y : 0));
        }

        if (typeof object.to !== 'undefined') {
          nativeGradient.setTo(CGPointMake(typeof object.to.x !== 'undefined' ? object.to.x : 0.5, typeof object.to.y !== 'undefined' ? object.to.y : 1));
        }

        if (object.stops) {
          nativeGradient.setStops(object.stops.map(_GradientStop__WEBPACK_IMPORTED_MODULE_2__["GradientStop"].from).map(function (g) {
            return g._object;
          }));
        }
      }

      return Gradient.fromNative(nativeGradient);
    }
  }]);

  return Gradient;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Gradient.type = _enums__WEBPACK_IMPORTED_MODULE_4__["Types"].Gradient;
Gradient[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = {};
Gradient.define('sketchObject', {
  exportable: false,
  enumerable: false,
  importable: false,
  get: function get() {
    return this._object;
  }
});
Gradient.define('gradientType', {
  get: function get() {
    var _this = this;

    return Object.keys(GradientTypeMap).find(function (key) {
      return GradientTypeMap[key] === _this._object.gradientType();
    }) || this._object.gradientType();
  },
  set: function set(gradientType) {
    var type = GradientTypeMap[gradientType];

    this._object.setGradientType(typeof type !== 'undefined' ? type : gradientType);
  }
});
Gradient.define('from', {
  get: function get() {
    var point = new _models_Point__WEBPACK_IMPORTED_MODULE_3__["Point"](this._object.from().x, this._object.from().y);
    point._parent = this;
    point._parentKey = 'from';
    return point;
  },
  set: function set(point) {
    this._object.setFrom(CGPointMake(point.x !== 'undefined' ? point.x : 0.5, point.y !== 'undefined' ? point.y : 0));
  }
});
Gradient.define('to', {
  get: function get() {
    var point = new _models_Point__WEBPACK_IMPORTED_MODULE_3__["Point"](this._object.to().x, this._object.to().y);
    point._parent = this;
    point._parentKey = 'to';
    return point;
  },
  set: function set(point) {
    this._object.setTo(CGPointMake(point.x !== 'undefined' ? point.x : 0.5, point.y !== 'undefined' ? point.y : 1));
  }
});
Gradient.define('stops', {
  get: function get() {
    return Object(_utils__WEBPACK_IMPORTED_MODULE_1__["toArray"])(this._object.stops()).map(_GradientStop__WEBPACK_IMPORTED_MODULE_2__["GradientStop"].from.bind(_GradientStop__WEBPACK_IMPORTED_MODULE_2__["GradientStop"]));
  },
  set: function set(stops) {
    this._object.setStops(stops.map(_GradientStop__WEBPACK_IMPORTED_MODULE_2__["GradientStop"].from.bind(_GradientStop__WEBPACK_IMPORTED_MODULE_2__["GradientStop"])).map(function (g) {
      return g._object;
    }));
  }
});

/***/ }),

/***/ "./Source/dom/style/GradientStop.js":
/*!******************************************!*\
  !*** ./Source/dom/style/GradientStop.js ***!
  \******************************************/
/*! exports provided: GradientStop */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GradientStop", function() { return GradientStop; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Color */ "./Source/dom/style/Color.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var GradientStop =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(GradientStop, _WrappedObject);

  function GradientStop() {
    _classCallCheck(this, GradientStop);

    return _possibleConstructorReturn(this, _getPrototypeOf(GradientStop).apply(this, arguments));
  }

  _createClass(GradientStop, null, [{
    key: "from",
    value: function from(object) {
      if (!object) {
        return undefined;
      }

      var nativeStop;

      if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isNativeObject"])(object)) {
        var className = String(object.class());

        if (className === 'MSGradientStop') {
          nativeStop = object;
        } else {
          throw new Error("Cannot create a gradient from a ".concat(className));
        }
      } else {
        nativeStop = MSGradientStop.stopWithPosition_color(object.position || 0, _Color__WEBPACK_IMPORTED_MODULE_2__["Color"].from(object.color || '#000000FF')._object);
      }

      return GradientStop.fromNative(nativeStop);
    }
  }]);

  return GradientStop;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
GradientStop.type = _enums__WEBPACK_IMPORTED_MODULE_3__["Types"].GradientStop;
GradientStop[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = {};
GradientStop.define('sketchObject', {
  exportable: false,
  enumerable: false,
  importable: false,
  get: function get() {
    return this._object;
  }
});
GradientStop.define('position', {
  get: function get() {
    return Number(this._object.position());
  },
  set: function set(position) {
    this._object.setPosition(position);
  }
});
GradientStop.define('color', {
  get: function get() {
    return Object(_Color__WEBPACK_IMPORTED_MODULE_2__["colorToString"])(this._object.color());
  },
  set: function set(_color) {
    var color = _Color__WEBPACK_IMPORTED_MODULE_2__["Color"].from(_color);
    this._object.color = color._object;
  }
});

/***/ }),

/***/ "./Source/dom/style/Shadow.js":
/*!************************************!*\
  !*** ./Source/dom/style/Shadow.js ***!
  \************************************/
/*! exports provided: Shadow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Shadow", function() { return Shadow; });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Color */ "./Source/dom/style/Color.js");
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Shadow =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Shadow, _WrappedObject);

  function Shadow() {
    _classCallCheck(this, Shadow);

    return _possibleConstructorReturn(this, _getPrototypeOf(Shadow).apply(this, arguments));
  }

  _createClass(Shadow, null, [{
    key: "toNative",
    value: function toNative(nativeClass, value) {
      var shadow = nativeClass.new();
      var color = typeof value === 'string' ? _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(value) : _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(value.color);

      if (color) {
        shadow.color = color._object;
      }

      if (typeof value.blur !== 'undefined') {
        shadow.blurRadius = value.blur;
      }

      if (typeof value.x !== 'undefined') {
        shadow.offsetX = value.x;
      }

      if (typeof value.y !== 'undefined') {
        shadow.offsetY = value.y;
      }

      if (typeof value.spread !== 'undefined') {
        shadow.spread = value.spread;
      }

      if (typeof value.enabled === 'undefined') {
        shadow.isEnabled = true;
      } else {
        shadow.isEnabled = value.enabled;
      }

      return shadow;
    }
  }]);

  return Shadow;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_1__["WrappedObject"]);
Shadow.type = _enums__WEBPACK_IMPORTED_MODULE_2__["Types"].Shadow;
Shadow[_WrappedObject__WEBPACK_IMPORTED_MODULE_1__["DefinedPropertiesKey"]] = {};
Shadow.define('sketchObject', {
  exportable: false,
  enumerable: false,
  importable: false,
  get: function get() {
    return this._object;
  }
});
Shadow.define('blur', {
  get: function get() {
    return Number(this._object.blurRadius());
  },
  set: function set(x) {
    this._object.blurRadius = x;
  }
});
Shadow.define('x', {
  get: function get() {
    return Number(this._object.offsetX());
  },
  set: function set(x) {
    this._object.offsetX = x;
  }
});
Shadow.define('y', {
  get: function get() {
    return Number(this._object.offsetY());
  },
  set: function set(x) {
    this._object.offsetY = x;
  }
});
Shadow.define('spread', {
  get: function get() {
    return Number(this._object.spread());
  },
  set: function set(x) {
    this._object.spread = x;
  }
});
Shadow.define('color', {
  get: function get() {
    return Object(_Color__WEBPACK_IMPORTED_MODULE_0__["colorToString"])(this._object.color());
  },
  set: function set(_color) {
    var color = _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from(_color);
    this._object.color = color._object;
  }
});
Shadow.define('enabled', {
  get: function get() {
    return !!this._object.isEnabled();
  },
  set: function set(enabled) {
    this._object.isEnabled = enabled;
  }
});

/***/ }),

/***/ "./Source/dom/style/Style.js":
/*!***********************************!*\
  !*** ./Source/dom/style/Style.js ***!
  \***********************************/
/*! exports provided: Style */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Style", function() { return Style; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Factory */ "./Source/dom/Factory.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./Source/dom/utils.js");
/* harmony import */ var _wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../wrapNativeObject */ "./Source/dom/wrapNativeObject.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../enums */ "./Source/dom/enums.js");
/* harmony import */ var _Gradient__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Gradient */ "./Source/dom/style/Gradient.js");
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Color */ "./Source/dom/style/Color.js");
/* harmony import */ var _Shadow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Shadow */ "./Source/dom/style/Shadow.js");
/* harmony import */ var _BorderOptions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./BorderOptions */ "./Source/dom/style/BorderOptions.js");
/* harmony import */ var _Blur__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Blur */ "./Source/dom/style/Blur.js");
/* harmony import */ var _Fill__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Fill */ "./Source/dom/style/Fill.js");
/* harmony import */ var _Border__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Border */ "./Source/dom/style/Border.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }













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
  /**
   * Represents a Sketch layer style.
   */

};
var Style =
/*#__PURE__*/
function (_WrappedObject) {
  _inherits(Style, _WrappedObject);

  /**
   * Make a new style object.
   *
   * @param [Object] properties - The properties to set on the object as a JSON object.
   *                              If `sketchObject` is provided, will wrap it.
   *                              Otherwise, creates a new native object.
   */
  function Style() {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Style);

    if (!style.sketchObject) {
      // eslint-disable-next-line no-param-reassign
      style = Object.assign({}, DEFAULT_STYLE, style); // eslint-disable-next-line no-param-reassign

      style.sketchObject = MSDefaultStyle.defaultStyle();
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(Style).call(this, style));
  }

  _createClass(Style, [{
    key: "isOutOfSyncWithSharedStyle",
    value: function isOutOfSyncWithSharedStyle(sharedStyle) {
      return !!Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(sharedStyle).sketchObject.isOutOfSyncWithInstance(this._object);
    }
  }, {
    key: "syncWithSharedStyle",
    value: function syncWithSharedStyle(sharedStyle) {
      this._object.syncWithTemplateInstance(Object(_wrapNativeObject__WEBPACK_IMPORTED_MODULE_3__["wrapObject"])(sharedStyle).style.sketchObject);
    }
  }, {
    key: "getParentLayer",
    value: function getParentLayer() {
      if (this._object.parentLayer) {
        return this._object.parentLayer();
      }

      return null;
    }
  }], [{
    key: "colorFromString",
    value: function colorFromString(color) {
      return Object(_Color__WEBPACK_IMPORTED_MODULE_6__["colorFromString"])(color);
    }
  }, {
    key: "colorToString",
    value: function colorToString(value) {
      return Object(_Color__WEBPACK_IMPORTED_MODULE_6__["colorToString"])(value);
    }
  }]);

  return Style;
}(_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"]);
Style.type = _enums__WEBPACK_IMPORTED_MODULE_4__["Types"].Style;
Style[_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]] = _objectSpread({}, _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"][_WrappedObject__WEBPACK_IMPORTED_MODULE_0__["DefinedPropertiesKey"]]);
_Factory__WEBPACK_IMPORTED_MODULE_1__["Factory"].registerClass(Style, MSStyle);
Style.GradientType = _Gradient__WEBPACK_IMPORTED_MODULE_5__["GradientType"];
Style.define('opacity', {
  get: function get() {
    return this._object.contextSettings().opacity();
  },
  set: function set(opacity) {
    this._object.contextSettings().setOpacity(Math.min(Math.max(opacity, 0), 1));
  }
});
Style.BlendingMode = BlendingMode;
Style.define('blendingMode', {
  get: function get() {
    var mode = this._object.contextSettings().blendMode();

    return Object.keys(BlendingModeMap).find(function (key) {
      return BlendingModeMap[key] === mode;
    }) || mode;
  },
  set: function set(mode) {
    var blendingMode = BlendingModeMap[mode];

    this._object.contextSettings().setBlendMode(typeof blendingMode !== 'undefined' ? blendingMode : mode);
  }
});
Style.Arrowhead = _BorderOptions__WEBPACK_IMPORTED_MODULE_8__["Arrowhead"];
Style.LineEnd = _BorderOptions__WEBPACK_IMPORTED_MODULE_8__["LineEnd"];
Style.LineJoin = _BorderOptions__WEBPACK_IMPORTED_MODULE_8__["LineJoin"];
Style.define('borderOptions', {
  get: function get() {
    return _BorderOptions__WEBPACK_IMPORTED_MODULE_8__["BorderOptions"].fromNative(this._object);
  },
  set: function set(borderOptions) {
    _BorderOptions__WEBPACK_IMPORTED_MODULE_8__["BorderOptions"].updateNative(this._object, borderOptions);
  }
});
Style.BlurType = _Blur__WEBPACK_IMPORTED_MODULE_9__["BlurType"];
Style.define('blur', {
  get: function get() {
    return _Blur__WEBPACK_IMPORTED_MODULE_9__["Blur"].fromNative(this._object.blur());
  },
  set: function set(blur) {
    _Blur__WEBPACK_IMPORTED_MODULE_9__["Blur"].updateNative(this._object.blur(), blur);
  }
});
Style.FillType = _Fill__WEBPACK_IMPORTED_MODULE_10__["FillType"];
Style.define('fills', {
  get: function get() {
    var fills = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["toArray"])(this._object.fills());
    return fills.map(_Fill__WEBPACK_IMPORTED_MODULE_10__["Fill"].fromNative.bind(_Fill__WEBPACK_IMPORTED_MODULE_10__["Fill"]));
  },
  set: function set(values) {
    var objects = values.map(_Fill__WEBPACK_IMPORTED_MODULE_10__["Fill"].toNative.bind(_Fill__WEBPACK_IMPORTED_MODULE_10__["Fill"]));

    this._object.setFills(objects);
  }
});
Style.BorderPosition = _Border__WEBPACK_IMPORTED_MODULE_11__["BorderPosition"];
Style.define('borders', {
  get: function get() {
    var borders = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["toArray"])(this._object.borders());
    return borders.map(_Border__WEBPACK_IMPORTED_MODULE_11__["Border"].fromNative.bind(_Border__WEBPACK_IMPORTED_MODULE_11__["Border"]));
  },
  set: function set(values) {
    var objects = values.map(_Border__WEBPACK_IMPORTED_MODULE_11__["Border"].toNative.bind(_Border__WEBPACK_IMPORTED_MODULE_11__["Border"]));

    this._object.setBorders(objects);
  }
});
Style.define('shadows', {
  get: function get() {
    return Object(_utils__WEBPACK_IMPORTED_MODULE_2__["toArray"])(this._object.shadows()).map(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"].fromNative.bind(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"]));
  },
  set: function set(values) {
    var objects = values.map(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"].toNative.bind(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"], MSStyleShadow));

    this._object.setShadows(objects);
  }
});
Style.define('innerShadows', {
  get: function get() {
    return Object(_utils__WEBPACK_IMPORTED_MODULE_2__["toArray"])(this._object.innerShadows()).map(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"].fromNative.bind(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"]));
  },
  set: function set(values) {
    var objects = values.map(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"].toNative.bind(_Shadow__WEBPACK_IMPORTED_MODULE_7__["Shadow"], MSStyleInnerShadow));

    this._object.setInnerShadows(objects);
  }
});

/***/ }),

/***/ "./Source/dom/style/__tests__/Blur.test.js":
/*!*************************************************!*\
  !*** ./Source/dom/style/__tests__/Blur.test.js ***!
  \*************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should change the blur', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  expect(style.blur.toJSON()).toEqual({
    center: {
      x: 0.5,
      y: 0.5
    },
    motionAngle: 0,
    radius: 10,
    enabled: false,
    blurType: 'Gaussian'
  });
  style.blur = {
    center: {
      x: 2,
      y: 6
    },
    motionAngle: 5,
    radius: 20,
    enabled: true,
    blurType: ___WEBPACK_IMPORTED_MODULE_0__["Style"].BlurType.Zoom
  };
  expect(style.blur.toJSON()).toEqual({
    center: {
      x: 2,
      y: 6
    },
    motionAngle: 5,
    radius: 20,
    enabled: true,
    blurType: 'Zoom'
  });
  style.blur.motionAngle = 10;
  expect(style.blur.toJSON()).toEqual({
    center: {
      x: 2,
      y: 6
    },
    motionAngle: 10,
    radius: 20,
    enabled: true,
    blurType: 'Zoom'
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/Border.test.js":
/*!***************************************************!*\
  !*** ./Source/dom/style/__tests__/Border.test.js ***!
  \***************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should set the borders', function () {
  // setting the borders after creation
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"](); // check that a style can be logged

  log(style);
  style.borders = ['#11223344', '#1234'];
  expect(style.sketchObject.borders().count()).toBe(2); // setting the borders during creation

  var style2 = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]({
    borders: ['#11223344', '#1234']
  });
  expect(style2.sketchObject.borders().count()).toBe(2); // setting the borders as an array of object

  var style3 = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]({
    borders: [{
      color: '#11223344',
      thickness: 30
    }, {
      color: '#1234',
      position: ___WEBPACK_IMPORTED_MODULE_0__["Style"].BorderPosition.Outside
    }, {
      gradient: {
        stops: [{
          position: 0,
          color: '#1234'
        }, {
          position: 0.5,
          color: '#0000'
        }, {
          position: 0,
          color: '#1234'
        }]
      }
    }]
  });
  expect(style3.sketchObject.borders().count()).toBe(3);
});
test('should get the borders', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  style.borders = [{
    color: '#11223344',
    thickness: 30
  }, {
    color: '#1234',
    position: ___WEBPACK_IMPORTED_MODULE_0__["Style"].BorderPosition.Outside
  }, {
    gradient: {
      stops: [{
        position: 0,
        color: '#1234'
      }, {
        position: 0.5,
        color: '#0000'
      }, {
        position: 1,
        color: '#1234'
      }]
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
      from: {
        x: 0.5,
        y: 0
      },
      to: {
        x: 0.5,
        y: 1
      },
      stops: [{
        position: 0,
        color: '#ffffffff'
      }, {
        position: 1,
        color: '#000000ff'
      }]
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
      from: {
        x: 0.5,
        y: 0
      },
      to: {
        x: 0.5,
        y: 1
      },
      stops: [{
        position: 0,
        color: '#ffffffff'
      }, {
        position: 1,
        color: '#000000ff'
      }]
    }
  });
  expect(style.borders[2].gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: [{
      position: 0,
      color: '#11223344'
    }, {
      position: 0.5,
      color: '#00000000'
    }, {
      position: 1,
      color: '#11223344'
    }]
  });
}); // https://github.com/BohemianCoding/SketchAPI/issues/230

test('should set the borders with 0s', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]({
    borders: [{
      color: '#11223344',
      thickness: 0
    }]
  });
  expect(style.borders[0].thickness).toBe(0);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/BorderOptions.test.js":
/*!**********************************************************!*\
  !*** ./Source/dom/style/__tests__/BorderOptions.test.js ***!
  \**********************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should change the border options', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  expect(style.borderOptions.toJSON()).toEqual({
    startArrowhead: 'None',
    endArrowhead: 'None',
    dashPattern: [],
    lineEnd: 'Butt',
    lineJoin: 'Miter'
  });
  style.borderOptions = {
    startArrowhead: ___WEBPACK_IMPORTED_MODULE_0__["Style"].Arrowhead.OpenArrow,
    endArrowhead: ___WEBPACK_IMPORTED_MODULE_0__["Style"].Arrowhead.FilledArrow,
    dashPattern: [20, 5],
    lineEnd: ___WEBPACK_IMPORTED_MODULE_0__["Style"].LineEnd.Round,
    lineJoin: ___WEBPACK_IMPORTED_MODULE_0__["Style"].LineJoin.Bevel
  };
  expect(style.borderOptions.toJSON()).toEqual({
    startArrowhead: 'OpenArrow',
    endArrowhead: 'FilledArrow',
    dashPattern: [20, 5],
    lineEnd: 'Round',
    lineJoin: 'Bevel'
  });
});
test('should be backward compatible with Style.Arrowhead.ClosedArrow', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  style.borderOptions = {
    startArrowhead: ___WEBPACK_IMPORTED_MODULE_0__["Style"].Arrowhead.OpenArrow,
    endArrowhead: ___WEBPACK_IMPORTED_MODULE_0__["Style"].Arrowhead.ClosedArrow,
    dashPattern: [20, 5],
    lineEnd: ___WEBPACK_IMPORTED_MODULE_0__["Style"].LineEnd.Round,
    lineJoin: ___WEBPACK_IMPORTED_MODULE_0__["Style"].LineJoin.Bevel
  };
  expect(style.borderOptions.toJSON()).toEqual({
    startArrowhead: 'OpenArrow',
    endArrowhead: 'FilledArrow',
    dashPattern: [20, 5],
    lineEnd: 'Round',
    lineJoin: 'Bevel'
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/Color.test.js":
/*!**************************************************!*\
  !*** ./Source/dom/style/__tests__/Color.test.js ***!
  \**************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Color */ "./Source/dom/style/Color.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a Color from a hex string', function () {
  // #rrggbbaa
  var color = _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from('#11223344');
  expect(String(color._object.class())).toBe('MSColor');
  expect(color.toString()).toBe('#11223344'); // #rrggbb

  var color2 = _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from('#112233');
  expect(color2.toString()).toBe('#112233ff'); // #rgb

  var color3 = _Color__WEBPACK_IMPORTED_MODULE_0__["Color"].from('#123');
  expect(color3.toString()).toBe('#112233ff');
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/Fill.test.js":
/*!*************************************************!*\
  !*** ./Source/dom/style/__tests__/Fill.test.js ***!
  \*************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should set the fills', function () {
  // setting the fills after creation
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  style.fills = ['#11223344', '#1234'];
  expect(style.sketchObject.fills().count()).toBe(2); // setting the fills during creation

  var style2 = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]({
    fills: ['#11223344', '#1234']
  });
  expect(style2.sketchObject.fills().count()).toBe(2); // setting the fills as an array of object

  var style3 = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]({
    fills: [{
      color: '#11223344',
      thickness: 30
    }, {
      color: '#1234',
      fillType: ___WEBPACK_IMPORTED_MODULE_0__["Style"].FillType.Color
    }]
  });
  expect(style3.sketchObject.fills().count()).toBe(2);
});
test('should get the fills', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  style.fills = ['#11223344', '#1234'];
  expect(style.fills.map(function (f) {
    return f.toJSON();
  })).toEqual([{
    color: '#11223344',
    fill: 'Color',
    enabled: true,
    gradient: {
      gradientType: 'Linear',
      from: {
        x: 0.5,
        y: 0
      },
      to: {
        x: 0.5,
        y: 1
      },
      stops: [{
        position: 0,
        color: '#ffffffff'
      }, {
        position: 1,
        color: '#000000ff'
      }]
    }
  }, {
    color: '#11223344',
    fill: 'Color',
    enabled: true,
    gradient: {
      gradientType: 'Linear',
      from: {
        x: 0.5,
        y: 0
      },
      to: {
        x: 0.5,
        y: 1
      },
      stops: [{
        position: 0,
        color: '#ffffffff'
      }, {
        position: 1,
        color: '#000000ff'
      }]
    }
  }]);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/Gradient.test.js":
/*!*****************************************************!*\
  !*** ./Source/dom/style/__tests__/Gradient.test.js ***!
  \*****************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _Gradient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Gradient */ "./Source/dom/style/Gradient.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a default gradient', function () {
  var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_0__["Gradient"].from({});
  expect(String(gradient._object.class())).toBe('MSGradient');
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: []
  });
});
test('should create a gradient with a specific type', function () {
  var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_0__["Gradient"].from({
    gradientType: _Gradient__WEBPACK_IMPORTED_MODULE_0__["GradientType"].Angular
  });
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Angular',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: []
  });
});
test('should create a gradient with a specific from and to coordinates', function () {
  var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_0__["Gradient"].from({
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
    from: {
      x: 1,
      y: 0.5
    },
    to: {
      x: 2,
      y: 5
    },
    stops: []
  });
});
test('should change the from', function () {
  var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_0__["Gradient"].from({});
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: []
  });
  gradient.from.x = 0.7;
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.7,
      y: 0
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: []
  });
  gradient.from.y = 0.1;
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.7,
      y: 0.1
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: []
  });
  gradient.from = {
    x: 0.1,
    y: 0.4
  };
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.1,
      y: 0.4
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: []
  });
}); // https://github.com/BohemianCoding/SketchAPI/issues/216

test('should change the to', function () {
  var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_0__["Gradient"].from({});
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: []
  });
  gradient.to.x = 0.7;
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.7,
      y: 1
    },
    stops: []
  });
  gradient.to.y = 0.1;
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.7,
      y: 0.1
    },
    stops: []
  });
  gradient.to = {
    x: 0.1,
    y: 0.4
  };
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.1,
      y: 0.4
    },
    stops: []
  });
}); // https://github.com/BohemianCoding/SketchAPI/issues/230

test('should create a gradient with a specific from and to coordinates including 0s', function () {
  var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_0__["Gradient"].from({
    from: {
      x: 0,
      y: 0
    },
    to: {
      x: 0,
      y: 0
    }
  });
  expect(gradient.toJSON()).toEqual({
    gradientType: 'Linear',
    from: {
      x: 0,
      y: 0
    },
    to: {
      x: 0,
      y: 0
    },
    stops: []
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/GradientStop.test.js":
/*!*********************************************************!*\
  !*** ./Source/dom/style/__tests__/GradientStop.test.js ***!
  \*********************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _Gradient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Gradient */ "./Source/dom/style/Gradient.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should create a gradient with some stops', function () {
  var gradient = _Gradient__WEBPACK_IMPORTED_MODULE_0__["Gradient"].from({
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
    from: {
      x: 0.5,
      y: 0
    },
    to: {
      x: 0.5,
      y: 1
    },
    stops: [{
      position: 1,
      color: '#112233ff'
    }, {
      position: 0,
      color: '#553344ff'
    }, {
      position: 0.5,
      color: '#11223344'
    }]
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/Shadow.test.js":
/*!***************************************************!*\
  !*** ./Source/dom/style/__tests__/Shadow.test.js ***!
  \***************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* globals expect, test */

var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should set the shadows', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
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
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
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
}); // https://github.com/BohemianCoding/SketchAPI/issues/230

test('should set the shadows with 0 values', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  style.shadows = [{
    spread: 0,
    blur: 0,
    x: 1,
    y: 0,
    color: '#ebc100'
  }];
  style.innerShadows = [{
    spread: 0,
    blur: 0,
    x: 1,
    y: 0,
    color: '#ebc100'
  }];
  expect(style.shadows[0].blur).toBe(0);
  expect(style.shadows[0].y).toBe(0);
  expect(style.innerShadows[0].blur).toBe(0);
  expect(style.innerShadows[0].y).toBe(0);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/style/__tests__/Style.test.js":
/*!**************************************************!*\
  !*** ./Source/dom/style/__tests__/Style.test.js ***!
  \**************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../.. */ "./Source/dom/index.js");
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../test-utils */ "./Source/test-utils.ts");
/* globals expect, test */


var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('should change the opacity', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  expect(style.opacity).toBe(1);
  style.opacity = 0.5;
  expect(style.opacity).toBe(0.5);
  style.opacity = 2;
  expect(style.opacity).toBe(1);
  style.opacity = -1;
  expect(style.opacity).toBe(0);
});
test('should change the blending mode', function () {
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  expect(style.blendingMode).toBe(___WEBPACK_IMPORTED_MODULE_0__["Style"].BlendingMode.Normal);
  style.blendingMode = ___WEBPACK_IMPORTED_MODULE_0__["Style"].BlendingMode.Multiply;
  expect(style.blendingMode).toBe('Multiply');
});
test('default style should not have any fills', function () {
  // setting the fills after creation
  var style = new ___WEBPACK_IMPORTED_MODULE_0__["Style"]();
  expect(style.sketchObject.fills().count()).toBe(0);
});
test('should be in and out of sync with its shared style', function (context, document) {
  var _createSharedStyle = Object(_test_utils__WEBPACK_IMPORTED_MODULE_1__["createSharedStyle"])(document, ___WEBPACK_IMPORTED_MODULE_0__["Shape"]),
      sharedStyle = _createSharedStyle.sharedStyle;

  var shape = new ___WEBPACK_IMPORTED_MODULE_0__["Shape"]({
    parent: document.selectedPage,
    sharedStyle: sharedStyle
  });
  var style = shape.style;
  expect(style.isOutOfSyncWithSharedStyle(sharedStyle)).toBe(false);
  sharedStyle.style.opacity = 0.5;
  expect(style.isOutOfSyncWithSharedStyle(sharedStyle)).toBe(true);
  expect(style.opacity).toBe(1);
  style.syncWithSharedStyle(sharedStyle);
  expect(style.isOutOfSyncWithSharedStyle(sharedStyle)).toBe(false);
  expect(style.opacity).toBe(0.5);
  style.opacity = 1;
  expect(style.isOutOfSyncWithSharedStyle(sharedStyle)).toBe(true);
  sharedStyle.style = style;
  expect(style.isOutOfSyncWithSharedStyle(sharedStyle)).toBe(false);
  expect(sharedStyle.style.opacity).toBe(1);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/dom/utils.js":
/*!*****************************!*\
  !*** ./Source/dom/utils.js ***!
  \*****************************/
/*! exports provided: getDocumentData, toArray, isNativeObject, isWrappedObject, getURLFromPath, initProxyProperties, proxyProperty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDocumentData", function() { return getDocumentData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return toArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNativeObject", function() { return isNativeObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWrappedObject", function() { return isWrappedObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getURLFromPath", function() { return getURLFromPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initProxyProperties", function() { return initProxyProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "proxyProperty", function() { return proxyProperty; });
function getDocumentData(document) {
  var documentData = document;

  if (document && document.sketchObject && document.sketchObject.documentData) {
    documentData = document.sketchObject.documentData();
  } else if (document && document.documentData) {
    documentData = document.documentData();
  }

  return documentData;
}
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
function isNativeObject(object) {
  return object && object.class && typeof object.class === 'function';
}
function isWrappedObject(object) {
  return object && object._isWrappedObject;
}
function getURLFromPath(path) {
  return typeof path === 'string' ? NSURL.fileURLWithPath(NSString.stringWithString(path).stringByExpandingTildeInPath()) : path;
}
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
function proxyProperty(object, property, value, parser) {
  Object.defineProperty(object, "_".concat(property), {
    enumerable: false,
    writable: true,
    value: value
  });
  /* eslint-disable no-param-reassign */

  if (parser) {
    Object.defineProperty(object, property, {
      enumerable: true,
      get: function get() {
        return object["_".concat(property)];
      },
      set: function set(x) {
        object["_".concat(property)] = parser(x);

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
      get: function get() {
        return object["_".concat(property)];
      },
      set: function set(x) {
        object["_".concat(property)] = x;

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

/***/ }),

/***/ "./Source/dom/wrapNativeObject.js":
/*!****************************************!*\
  !*** ./Source/dom/wrapNativeObject.js ***!
  \****************************************/
/*! exports provided: wrapNativeObject, wrapObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapNativeObject", function() { return wrapNativeObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapObject", function() { return wrapObject; });
/* harmony import */ var _WrappedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WrappedObject */ "./Source/dom/WrappedObject.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./Source/dom/utils.js");
/* harmony import */ var _Factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Factory */ "./Source/dom/Factory.js");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




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
  var JsClass = _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"]._nativeToBox[String(nativeObject.class())];

  if (!JsClass) {
    console.warn("no mapped wrapper for ".concat(String(nativeObject.class())));
    JsClass = _WrappedObject__WEBPACK_IMPORTED_MODULE_0__["WrappedObject"];
  }

  return JsClass.fromNative(nativeObject);
}
function wrapObject(object) {
  if (!object) {
    return object;
  }

  if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isNativeObject"])(object)) {
    return wrapNativeObject(object);
  }

  if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__["isWrappedObject"])(object)) {
    return object;
  }

  var type = object.type,
      rest = _objectWithoutProperties(object, ["type"]);

  if (!type) {
    throw new Error("You need to specify a \"type\" when creating a nested layer. Received: ".concat(JSON.stringify(object, null, 2)));
  }

  return _Factory__WEBPACK_IMPORTED_MODULE_2__["Factory"].create(type, rest);
}

/***/ }),

/***/ "./Source/index.ts":
/*!*************************!*\
  !*** ./Source/index.ts ***!
  \*************************/
/*! exports provided: Async, DataSupplier, Settings, UI, export, Document, getDocuments, getSelectedDocument, Library, getLibraries, SharedStyle, Rectangle, Style, Group, Text, Image, Shape, ShapePath, Artboard, Page, SymbolMaster, SymbolInstance, HotSpot, Types, fromNative, Flow, version */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./async */ "./Source/async/index.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Async", function() { return _async__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _data_supplier__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data-supplier */ "./Source/data-supplier/index.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "DataSupplier", function() { return _data_supplier__WEBPACK_IMPORTED_MODULE_1__; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings */ "./Source/settings/index.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Settings", function() { return _settings__WEBPACK_IMPORTED_MODULE_2__; });
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui */ "./Source/ui/index.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "UI", function() { return _ui__WEBPACK_IMPORTED_MODULE_3__; });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom */ "./Source/dom/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "export", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["export"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Document", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Document"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getDocuments", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["getDocuments"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSelectedDocument", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["getSelectedDocument"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Library", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Library"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLibraries", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["getLibraries"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SharedStyle", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["SharedStyle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Rectangle", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Rectangle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Style", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Style"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Group", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Group"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Text"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Image"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Shape", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Shape"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ShapePath", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["ShapePath"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Artboard", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Artboard"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Page", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Page"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SymbolMaster", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["SymbolMaster"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SymbolInstance", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["SymbolInstance"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HotSpot", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["HotSpot"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Types", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Types"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fromNative", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["fromNative"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Flow", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["Flow"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "version", function() { return _dom__WEBPACK_IMPORTED_MODULE_4__["version"]; });








/***/ }),

/***/ "./Source/settings/Settings.js":
/*!*************************************!*\
  !*** ./Source/settings/Settings.js ***!
  \*************************************/
/*! exports provided: globalSettingForKey, setGlobalSettingForKey, settingForKey, setSettingForKey, layerSettingForKey, setLayerSettingForKey, documentSettingForKey, setDocumentSettingForKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "globalSettingForKey", function() { return globalSettingForKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setGlobalSettingForKey", function() { return setGlobalSettingForKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settingForKey", function() { return settingForKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSettingForKey", function() { return setSettingForKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "layerSettingForKey", function() { return layerSettingForKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setLayerSettingForKey", function() { return setLayerSettingForKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "documentSettingForKey", function() { return documentSettingForKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDocumentSettingForKey", function() { return setDocumentSettingForKey; });
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! util */ "./core-modules/node_modules/@skpm/util/index.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dom_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom/utils */ "./Source/dom/utils.js");



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
  var stringifiedValue = JSON.stringify(value, function (k, v) {
    return util__WEBPACK_IMPORTED_MODULE_0__["toJSObject"](v);
  });

  if (!stringifiedValue) {
    store.removeObjectForKey(key);
  } else {
    store.setObject_forKey_(stringifiedValue, key);
  }
}
var SUITE_PREFIX = 'plugin.sketch.';
/**
 * Return the value of a plugin setting for a given key.
 *
 * @param key The setting to look up.
 * @return The setting value.
 * */

function settingForKey(key) {
  var store = NSUserDefaults.alloc().initWithSuiteName("".concat(SUITE_PREFIX).concat(getPluginIdentifier()));
  var value = store.objectForKey_(key);

  if (typeof value === 'undefined' || value == 'undefined' || value === null) {
    return undefined;
  }

  return JSON.parse(value);
}
/**
 * Set the value of a global setting for a given key.
 *
 * @param key The setting to set.
 * @param value The value to set it to.
 */

function setSettingForKey(key, value) {
  var store = NSUserDefaults.alloc().initWithSuiteName("".concat(SUITE_PREFIX).concat(getPluginIdentifier()));
  var stringifiedValue = JSON.stringify(value, function (k, v) {
    return util__WEBPACK_IMPORTED_MODULE_0__["toJSObject"](v);
  });

  if (!stringifiedValue) {
    store.removeObjectForKey(key);
  } else {
    store.setObject_forKey_(stringifiedValue, key);
  }
}

function getNativeStorageObject(layer) {
  var object;

  if (!Object(_dom_utils__WEBPACK_IMPORTED_MODULE_1__["isWrappedObject"])(layer)) {
    object = layer;
  } else if (layer.type === 'DataOverride') {
    object = layer.sketchObject.availableOverride().overrideValue();
  } else if (layer.type === 'Override') {
    object = layer.sketchObject.overrideValue();
  } else {
    object = layer.sketchObject;
  }

  return object;
}

function layerSettingForKey(layer, key) {
  var value = __command.valueForKey_onLayer(key, getNativeStorageObject(layer));

  if (typeof value === 'undefined' || value == 'undefined' || value === null) {
    return undefined;
  }

  return JSON.parse(value);
}
function setLayerSettingForKey(layer, key, value) {
  var stringifiedValue = JSON.stringify(value, function (k, v) {
    return util__WEBPACK_IMPORTED_MODULE_0__["toJSObject"](v);
  });

  __command.setValue_forKey_onLayer(stringifiedValue, key, getNativeStorageObject(layer));
}
function documentSettingForKey(document, key) {
  var documentData = Object(_dom_utils__WEBPACK_IMPORTED_MODULE_1__["getDocumentData"])(document);

  var value = __command.valueForKey_onDocument(key, documentData);

  if (typeof value === 'undefined' || value == 'undefined' || value === null) {
    return undefined;
  }

  return JSON.parse(value);
}
function setDocumentSettingForKey(document, key, value) {
  var documentData = Object(_dom_utils__WEBPACK_IMPORTED_MODULE_1__["getDocumentData"])(document);
  var stringifiedValue = JSON.stringify(value, function (k, v) {
    return util__WEBPACK_IMPORTED_MODULE_0__["toJSObject"](v);
  });

  __command.setValue_forKey_onDocument(stringifiedValue, key, documentData);
}

/***/ }),

/***/ "./Source/settings/__tests__/Settings.test.js":
/*!****************************************************!*\
  !*** ./Source/settings/__tests__/Settings.test.js ***!
  \****************************************************/
/*! exports provided: tests, logs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(expect) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tests", function() { return __skpm_tests__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logs", function() { return __skpm_logs__; });
/* harmony import */ var _test_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../test-utils */ "./Source/test-utils.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../dom */ "./Source/dom/index.js");
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! .. */ "./Source/settings/index.ts");
/* globals expect, test */



var __skpm_logs__ = [];
var __skpm_console_log__ = console.log;

var __hookedLogs = function __hookedLogs(string) {
  __skpm_logs__.push(string);

  return __skpm_console_log__(string);
};

var __skpm_tests__ = {};

var test = function test(description, fn) {
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


test('non existing settings should return undefined', function () {
  if (Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
    try {
      expect(Object(___WEBPACK_IMPORTED_MODULE_2__["settingForKey"])('non-existing-key')).toBe(undefined);
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toMatch('It seems that the command is not running in a plugin.');
    }
  } else {
    expect(Object(___WEBPACK_IMPORTED_MODULE_2__["settingForKey"])('non-existing-key')).toBe(undefined);
  }
});
test('should set a boolean', function () {
  if (Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
    try {
      Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('false-key', false);
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toMatch('It seems that the command is not running in a plugin.');
    }
  } else {
    Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('false-key', false);
    expect(Object(___WEBPACK_IMPORTED_MODULE_2__["settingForKey"])('false-key')).toBe(false);
    Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('true-key', true);
    expect(Object(___WEBPACK_IMPORTED_MODULE_2__["settingForKey"])('true-key')).toBe(true);
  }
});
test('should set a string', function () {
  if (Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
    try {
      Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('string-key', 'test');
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toMatch('It seems that the command is not running in a plugin.');
    }
  } else {
    Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('string-key', 'test');
    expect(Object(___WEBPACK_IMPORTED_MODULE_2__["settingForKey"])('string-key')).toBe('test');
  }
});
test('should set undefined', function () {
  if (Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
    try {
      Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('undefined-key', undefined);
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toMatch('It seems that the command is not running in a plugin.');
    }
  } else {
    Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('undefined-key', undefined);
    expect(Object(___WEBPACK_IMPORTED_MODULE_2__["settingForKey"])('undefined-key')).toBe(undefined);
  }
});
test('should set object', function () {
  if (Object(_test_utils__WEBPACK_IMPORTED_MODULE_0__["isRunningOnJenkins"])()) {
    try {
      Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('object-key', {
        a: 1
      });
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toMatch('It seems that the command is not running in a plugin.');
    }
  } else {
    Object(___WEBPACK_IMPORTED_MODULE_2__["setSettingForKey"])('object-key', {
      a: 1
    });
    expect(Object(___WEBPACK_IMPORTED_MODULE_2__["settingForKey"])('object-key')).toEqual({
      a: 1
    });
  }
});
test('should set a setting on a layer', function (context, document) {
  var layer = new _dom__WEBPACK_IMPORTED_MODULE_1__["Text"]({
    parent: document.selectedPage
  });
  Object(___WEBPACK_IMPORTED_MODULE_2__["setLayerSettingForKey"])(layer, 'object-key', {
    a: 1
  });
  expect(Object(___WEBPACK_IMPORTED_MODULE_2__["layerSettingForKey"])(layer, 'object-key')).toEqual({
    a: 1
  });
});
test('should set a setting on a document', function (context, document) {
  Object(___WEBPACK_IMPORTED_MODULE_2__["setDocumentSettingForKey"])(document, 'object-key', {
    a: 1
  });
  expect(Object(___WEBPACK_IMPORTED_MODULE_2__["documentSettingForKey"])(document, 'object-key')).toEqual({
    a: 1
  });
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./Source/settings/index.ts":
/*!**********************************!*\
  !*** ./Source/settings/index.ts ***!
  \**********************************/
/*! exports provided: version, globalSettingForKey, setGlobalSettingForKey, settingForKey, setSettingForKey, layerSettingForKey, setLayerSettingForKey, documentSettingForKey, setDocumentSettingForKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings */ "./Source/settings/Settings.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "globalSettingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["globalSettingForKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setGlobalSettingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["setGlobalSettingForKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "settingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["settingForKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setSettingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["setSettingForKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "layerSettingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["layerSettingForKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setLayerSettingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["setLayerSettingForKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "documentSettingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["documentSettingForKey"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setDocumentSettingForKey", function() { return _Settings__WEBPACK_IMPORTED_MODULE_0__["setDocumentSettingForKey"]; });


var version = {
  sketch: MSApplicationMetadata.metadata().appVersion,
  api: "2.0.0"
};

/***/ }),

/***/ "./Source/test-utils.ts":
/*!******************************!*\
  !*** ./Source/test-utils.ts ***!
  \******************************/
/*! exports provided: isRunningOnJenkins, createSymbolMaster, createSharedStyle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRunningOnJenkins", function() { return isRunningOnJenkins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSymbolMaster", function() { return createSymbolMaster; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSharedStyle", function() { return createSharedStyle; });
var _require = __webpack_require__(/*! ./dom */ "./Source/dom/index.js"),
    SymbolMaster = _require.SymbolMaster,
    SharedStyle = _require.SharedStyle,
    Text = _require.Text,
    Artboard = _require.Artboard;

function isRunningOnJenkins() {
  return !__command.pluginBundle();
}
function createSymbolMaster(document) {
  var artboard = new Artboard({
    name: 'Test',
    parent: document.selectedPage
  });
  var text = new Text({
    text: 'Test value',
    parent: artboard
  }); // build the symbol master

  return {
    master: SymbolMaster.fromArtboard(artboard),
    text: text,
    artboard: artboard
  };
}
function createSharedStyle(document, Primitive) {
  var object = new Primitive({
    name: 'Test',
    parent: document.selectedPage
  });
  var sharedStyle = SharedStyle.fromStyle({
    name: 'test shared style',
    style: object.style,
    document: document
  });
  object.sharedStyle = sharedStyle;
  return {
    sharedStyle: sharedStyle,
    object: object
  };
}

/***/ }),

/***/ "./Source/ui/UI.js":
/*!*************************!*\
  !*** ./Source/ui/UI.js ***!
  \*************************/
/*! exports provided: message, alert, getStringFromUser, getSelectionFromUser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "message", function() { return message; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "alert", function() { return alert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStringFromUser", function() { return getStringFromUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectionFromUser", function() { return getSelectionFromUser; });
/* harmony import */ var _dom_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/utils */ "./Source/dom/utils.js");
/* globals NSAlertFirstButtonReturn */


function getPluginAlertIcon() {
  if (__command.pluginBundle() && __command.pluginBundle().alertIcon()) {
    return __command.pluginBundle().alertIcon();
  }

  return NSImage.imageNamed('plugins');
}
/**
 * Show a small, temporary, message to the user.
 * The message appears at the bottom of the selected document,
 * and is visible for a short period of time. It should consist of a single
 * line of text.
 *
 * @param {string} text The message to show.
 * @param [Document] document The document in which we will show the message
 */


function message(text, document) {
  if (!document) {
    NSApplication.sharedApplication().orderedDocuments().firstObject().showMessage(text);
  } else if (Object(_dom_utils__WEBPACK_IMPORTED_MODULE_0__["isNativeObject"])(document)) {
    document.showMessage(text);
  } else {
    document.sketchObject.showMessage(text);
  }
}
/**
 * Show an alert with a custom title and message.
 *
 * @param {string} title The title of the alert.
 * @param {string} text The text of the message.
 *
 * The alert is modal, so it will stay around until the user dismisses it
 * by pressing the OK button.
 */

function alert(title, text) {
  var dialog = NSAlert.alloc().init();
  dialog.setMessageText(title);
  dialog.setInformativeText(text);
  dialog.icon = getPluginAlertIcon();
  return dialog.runModal();
}
/**
 * Shows a simple input sheet which displays a message, and asks for a single string
 * input.
 * @param msg The prompt message to show.
 * @param initial The initial value of the input string.
 * @return The string that the user input.
 */

function getStringFromUser(msg, initial) {
  var panel = MSModalInputSheet.alloc().init();
  var result = panel.runPanelWithNibName_ofType_initialString_label_('MSModalInputSheet', 0, String(typeof initial === 'undefined' ? '' : initial), msg);
  return String(result);
}
/**
 * Shows an input sheet which displays a popup with a series of options,
 * from which the user is asked to choose.
 *
 * @param msg The prompt message to show.
 * @param items A list of option items.
 * @param selectedItemIndex The index of the item to select initially.
 * @return An array with three items: [responseCode, selection, ok].
 */

function getSelectionFromUser(msg, items) {
  var selectedItemIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 200, 25));
  accessory.addItemsWithObjectValues(items);
  accessory.selectItemAtIndex(selectedItemIndex);
  accessory.editable = false;
  var dialog = NSAlert.alloc().init();
  dialog.setMessageText(msg);
  dialog.addButtonWithTitle('OK');
  dialog.addButtonWithTitle('Cancel');
  dialog.setAccessoryView(accessory);
  dialog.icon = getPluginAlertIcon();
  var responseCode = dialog.runModal();
  var sel = accessory.indexOfSelectedItem();
  return [responseCode, sel, responseCode === NSAlertFirstButtonReturn];
}

/***/ }),

/***/ "./Source/ui/index.ts":
/*!****************************!*\
  !*** ./Source/ui/index.ts ***!
  \****************************/
/*! exports provided: version, message, alert, getStringFromUser, getSelectionFromUser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI */ "./Source/ui/UI.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "message", function() { return _UI__WEBPACK_IMPORTED_MODULE_0__["message"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "alert", function() { return _UI__WEBPACK_IMPORTED_MODULE_0__["alert"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getStringFromUser", function() { return _UI__WEBPACK_IMPORTED_MODULE_0__["getStringFromUser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSelectionFromUser", function() { return _UI__WEBPACK_IMPORTED_MODULE_0__["getSelectionFromUser"]; });


var version = {
  sketch: MSApplicationMetadata.metadata().appVersion,
  api: "2.0.0"
};

/***/ }),

/***/ "./core-modules/node_modules/@skpm/util/callbackify.js":
/*!*************************************************************!*\
  !*** ./core-modules/node_modules/@skpm/util/callbackify.js ***!
  \*************************************************************/
/*! no static exports found */
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

/***/ "./core-modules/node_modules/@skpm/util/deep-equal.js":
/*!************************************************************!*\
  !*** ./core-modules/node_modules/@skpm/util/deep-equal.js ***!
  \************************************************************/
/*! no static exports found */
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
    Array.isArray(b) ||
    a === null ||
    b === null
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

/***/ "./core-modules/node_modules/@skpm/util/deprecate.js":
/*!***********************************************************!*\
  !*** ./core-modules/node_modules/@skpm/util/deprecate.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Mark that a method should not be used.
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


/***/ }),

/***/ "./core-modules/node_modules/@skpm/util/index.js":
/*!*******************************************************!*\
  !*** ./core-modules/node_modules/@skpm/util/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
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

exports.callbackify = __webpack_require__(/*! ./callbackify */ "./core-modules/node_modules/@skpm/util/callbackify.js")

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

exports.deprecate = __webpack_require__(/*! ./deprecate */ "./core-modules/node_modules/@skpm/util/deprecate.js");

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

  var base = '';
  var formatter = formatObject;
  var braces = ['{', '}'];
  var noIterator = true;
  var raw;

  // if it's a MOStruct, we need to catch it early so that it doesn't fail
  if (getNativeClass(value) === 'MOStruct') {
    braces = [value.name() + ' {', '}']
    value = toObject(value)
  }

  if (value && value._isWrappedObject) {
    const propertyList = value.constructor._DefinedPropertiesKey
    const json = {}
    Object.keys(propertyList).forEach(k => {
      if (!propertyList[k].exportable) {
        return
      }
      json[k] = value[k]
      if (json[k] && !json[k]._isWrappedObject && json[k].toJSON) {
        json[k] = json[k].toJSON()
      }
    })
    value = json
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

  if (isArray(value)) {
    noIterator = false
    // Only set the constructor for non ordinary ("Array [...]") arrays.
    braces = [(prefix === 'Array ' ? '' : prefix) + '[', ']'];
    if (value.length === 0 && keyLength === 0)
      return braces[0] + ']';
    formatter = formatArray;
  } else if (isFunction(value)) {
    var name = (constructor === 'Object' ? 'function MOMethod' : constructor) + (value.name ? (': ' + value.name) : '');
    if (keyLength === 0)
      return ctx.stylize(`[${name}]`, 'special');
    base = '[' + name + ']';
  } else if (prefix === 'Object ') {
    // Object fast path
    if (keyLength === 0)
      return '{}';
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
  } else if (isObject(value) && getNativeClass(value)) {
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
    return fn('' + Boolean(Number(value)), 'boolean');
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
    output[i] = formatProperty(ctx, value, recurseTimes, keys[i] || i, 1);
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
exports.getNativeClass = getNativeClass

function isNativeObject(arg) {
  return !!getNativeClass(arg)
}
exports.isNativeObject = isNativeObject

/**
 * Coerce common NSObjects to their JS counterparts
 * @param arg Any object
 *
 * Converts NSDictionary, NSArray, NSString, and NSNumber to
 * native JS equivilents.
 *
 * Note that NSDictionary and NSArray elements are not recursively converted
 */
function toJSObject(arg) {
  if (arg) {
    if (isObject(arg)) {
      return toObject(arg)
    } else if (isArray(arg)) {
      return toArray(arg)
    } else if (isString(arg)) {
      return String(arg)
    } else if (isNumber(arg)) {
      return Number(arg)
    } else if (isBoolean(arg)) {
      return Boolean(Number(arg))
    }
  }
  return arg
}
exports.toJSObject = toJSObject

var assimilatedArrays = ['NSArray', 'NSMutableArray', '__NSArrayM', '__NSSingleObjectArrayI', '__NSArray0', '__NSArrayI', '__NSArrayReversed', '__NSCFArray', '__NSPlaceholderArray']
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

var assimilatedBooleans = ['__NSCFBoolean']
function isBoolean(arg) {
  if (typeof arg === 'boolean') {
    return true
  }
  var type = getNativeClass(arg)
  return assimilatedBooleans.indexOf(type) !== -1
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

var assimilatedStrings = ['NSString', 'NSMutableString', '__NSCFString', 'NSTaggedPointerString', '__NSCFConstantString']
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

var assimilatedObjects = ['NSDictionary', 'NSMutableDictionary', '__NSDictionaryM', '__NSSingleEntryDictionaryI', '__NSDictionaryI', '__NSCFDictionary', 'MOStruct', '__NSFrozenDictionaryM', '__NSDictionary0', '__NSPlaceholderDictionary']
function isObject(arg) {
  var type = getNativeClass(arg)
  if (typeof arg === 'object' && arg !== null && !type) {
    return true
  }
  return assimilatedObjects.indexOf(type) !== -1
}
exports.isObject = isObject;

function toObject(obj) {
  var type = getNativeClass(obj)
  if (type === 'MOStruct') {
    return obj.memberNames().reduce(function(prev, k) {
      prev[k] = obj[k]
      return prev
    }, {})
  } else if (typeof obj === 'object') {
    return obj
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
  return typeof arg === 'function' || arg instanceof MOMethod;
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

exports.isDeepStrictEqual = __webpack_require__(/*! ./deep-equal */ "./core-modules/node_modules/@skpm/util/deep-equal.js")

exports.promisify = __webpack_require__(/*! ./promisify */ "./core-modules/node_modules/@skpm/util/promisify.js")

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./core-modules/node_modules/@skpm/util/promisify.js":
/*!***********************************************************!*\
  !*** ./core-modules/node_modules/@skpm/util/promisify.js ***!
  \***********************************************************/
/*! no static exports found */
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js")))

/***/ }),

/***/ "./node_modules/@skpm/test-runner/expect/assertion-check.js":
/*!******************************************************************!*\
  !*** ./node_modules/@skpm/test-runner/expect/assertion-check.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable prefer-template */
var _require = __webpack_require__(/*! ./utils */ "./node_modules/@skpm/test-runner/expect/utils.js"),
    EXPECTED_COLOR = _require.EXPECTED_COLOR,
    RECEIVED_COLOR = _require.RECEIVED_COLOR,
    matcherHint = _require.matcherHint,
    pluralize = _require.pluralize;

var _require2 = __webpack_require__(/*! ./matchers_object */ "./node_modules/@skpm/test-runner/expect/matchers_object.js"),
    getState = _require2.getState,
    setState = _require2.setState;

module.exports.resetAssertionsLocalState = function resetAssertionsLocalState() {
  setState({
    assertionCalls: 0,
    expectedAssertionsNumber: null,
    isExpectingAssertions: false
  });
}; // Create and format all errors related to the mismatched number of `expect`
// calls and reset the matchers state.


module.exports.extractExpectedAssertionsErrors = function extractExpectedAssertionsErrors() {
  var _getState = getState(),
      assertionCalls = _getState.assertionCalls,
      expectedAssertionsNumber = _getState.expectedAssertionsNumber,
      isExpectingAssertions = _getState.isExpectingAssertions;

  if (typeof expectedAssertionsNumber === 'number' && assertionCalls !== expectedAssertionsNumber) {
    var numOfAssertionsExpected = EXPECTED_COLOR(pluralize('assertion', expectedAssertionsNumber));
    var error = new Error(matcherHint('.assertions', '', String(expectedAssertionsNumber), {
      isDirectExpectCall: true
    }) + '\n\n' + "Expected ".concat(numOfAssertionsExpected, " to be called but received ") + RECEIVED_COLOR(pluralize('assertion call', assertionCalls || 0)) + '.');
    return {
      actual: assertionCalls,
      error: error,
      expected: expectedAssertionsNumber
    };
  }

  if (isExpectingAssertions && assertionCalls === 0) {
    var expected = EXPECTED_COLOR('at least one assertion');
    var received = RECEIVED_COLOR('received none');

    var _error = new Error(matcherHint('.hasAssertions', '', '', {
      isDirectExpectCall: true
    }) + '\n\n' + "Expected ".concat(expected, " to be called but ").concat(received, "."));

    return {
      actual: 'none',
      error: _error,
      expected: 'at least one'
    };
  }

  return undefined;
};

/***/ }),

/***/ "./node_modules/@skpm/test-runner/expect/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@skpm/test-runner/expect/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = __webpack_require__(/*! ./matchers_object */ "./node_modules/@skpm/test-runner/expect/matchers_object.js"),
    getState = _require.getState,
    setState = _require.setState,
    getMatchers = _require.getMatchers,
    setMatchers = _require.setMatchers;

var utils = __webpack_require__(/*! ./utils */ "./node_modules/@skpm/test-runner/expect/utils.js");

var matchers = __webpack_require__(/*! ./matchers */ "./node_modules/@skpm/test-runner/expect/matchers.js");

var sketchMatchers = __webpack_require__(/*! ./sketch_matchers */ "./node_modules/@skpm/test-runner/expect/sketch_matchers.js");

var _require2 = __webpack_require__(/*! ./assertion-check */ "./node_modules/@skpm/test-runner/expect/assertion-check.js"),
    extractExpectedAssertionsErrors = _require2.extractExpectedAssertionsErrors,
    resetAssertionsLocalState = _require2.resetAssertionsLocalState;

function validateResult(result) {
  if (_typeof(result) !== 'object' || typeof result.pass !== 'boolean' || result.message && typeof result.message !== 'string' && typeof result.message !== 'function') {
    throw new Error('Unexpected return from a matcher function.\n' + 'Matcher functions should ' + 'return an object in the following format:\n' + '  {message?: string | function, pass: boolean}\n' + "'".concat(utils.stringify(result), "' was returned"));
  }
}

function getMessage(message) {
  return message && message() || 'No message was specified for this matcher.';
}

function makeThrowingMatcher(matcher, isNot, actual) {
  return function throwingMatcher() {
    var throws = true;
    var matcherContext = Object.assign( // When throws is disabled, the matcher will not throw errors during test
    // execution but instead add them to the global matcher state. If a
    // matcher throws, test execution is normally stopped immediately. The
    // snapshot matcher uses it because we want to log all snapshot
    // failures in a test.
    {
      dontThrow: function dontThrow() {
        throws = false;
      }
    }, getState(), {
      isNot: isNot,
      utils: utils
    });
    var result;

    try {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      result = matcher.apply(matcherContext, [actual].concat(args));
    } catch (error) {
      throw error;
    }

    validateResult(result);
    getState().assertionCalls += 1; // XOR

    if (result.pass && isNot || !result.pass && !isNot) {
      var message = getMessage(result.message);
      var error = new Error(message); // Passing the result of the matcher with the error so that a custom
      // reporter could access the actual and expected objects of the result
      // for example in order to display a custom visual diff

      error.matcherResult = result; // Try to remove this function from the stack trace frame.
      // Guard for some environments (browsers) that do not support this feature.

      if (Error.captureStackTrace) {
        Error.captureStackTrace(error, throwingMatcher);
      }

      if (throws) {
        throw error;
      } else {
        getState().suppressedErrors.push(error);
      }
    }
  };
}

var expect = function expect(actual) {
  if ((arguments.length <= 1 ? 0 : arguments.length - 1) !== 0) {
    throw new Error('Expect takes at most one argument.');
  }

  var allMatchers = getMatchers();
  var expectation = {
    not: {},
    rejects: {
      not: {}
    },
    resolves: {
      not: {}
    }
  };
  Object.keys(allMatchers).forEach(function (name) {
    var matcher = allMatchers[name];
    expectation[name] = makeThrowingMatcher(matcher, false, actual);
    expectation.not[name] = makeThrowingMatcher(matcher, true, actual);
  });
  return expectation;
};

expect.extend = function (_matchers) {
  return setMatchers(_matchers);
}; // add default jest matchers


expect.extend(matchers);
expect.extend(sketchMatchers);

expect.assertions = function (expected) {
  setState({
    expectedAssertionsNumber: expected
  });
};

expect.hasAssertions = function (expected) {
  utils.ensureNoExpected(expected, '.hasAssertions');
  setState({
    isExpectingAssertions: true
  });
};

expect.getState = getState;
expect.setState = setState;
expect.resetAssertionsLocalState = resetAssertionsLocalState;
expect.extractExpectedAssertionsErrors = extractExpectedAssertionsErrors;
module.exports = expect;

/***/ }),

/***/ "./node_modules/@skpm/test-runner/expect/matchers.js":
/*!***********************************************************!*\
  !*** ./node_modules/@skpm/test-runner/expect/matchers.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable prefer-template, no-restricted-properties, no-void, eqeqeq, no-nested-ternary */
var _require = __webpack_require__(/*! util */ "./core-modules/node_modules/@skpm/util/index.js"),
    isDeepStrictEqual = _require.isDeepStrictEqual;

var _require2 = __webpack_require__(/*! ./utils */ "./node_modules/@skpm/test-runner/expect/utils.js"),
    EXPECTED_COLOR = _require2.EXPECTED_COLOR,
    RECEIVED_COLOR = _require2.RECEIVED_COLOR,
    SUGGEST_TO_EQUAL = _require2.SUGGEST_TO_EQUAL,
    ensureNoExpected = _require2.ensureNoExpected,
    ensureNumbers = _require2.ensureNumbers,
    matcherHint = _require2.matcherHint,
    printReceived = _require2.printReceived,
    printExpected = _require2.printExpected,
    printWithType = _require2.printWithType,
    getType = _require2.getType;

var escapeStrForRegex = function escapeStrForRegex(string) {
  return string.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
};

var getPath = function getPath(object, propertyPath) {
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
  toBe: function toBe(received, expected) {
    var pass = Object.is(received, expected);
    var message = pass ? function () {
      return matcherHint('.not.toBe') + '\n\n' + "Expected value to not be (using Object.is):\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(received));
    } : function () {
      var suggestToEqual = getType(received) === getType(expected) && (getType(received) === 'object' || getType(expected) === 'array' || getType(expected) === 'sketch-native') && isDeepStrictEqual(received, expected, [isDeepStrictEqual.iterableEquality]);
      return matcherHint('.toBe') + '\n\n' + "Expected value to be (using Object.is):\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(received)) + (suggestToEqual ? "\n\n".concat(SUGGEST_TO_EQUAL, "\n") : '');
    }; // Passing the the actual and expected objects so that a custom reporter
    // could access them, for example in order to display a custom visual diff,
    // or create a different error message

    return {
      actual: received,
      expected: expected,
      message: message,
      name: 'toBe',
      pass: pass
    };
  },
  toBeCloseTo: function toBeCloseTo(actual, expected) {
    var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
    ensureNumbers(actual, expected, '.toBeCloseTo');
    var pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
    var message = pass ? function () {
      return matcherHint('.not.toBeCloseTo', 'received', 'expected, precision') + '\n\n' + "Expected value not to be close to (with ".concat(printExpected(precision), "-digit precision):\n") + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeCloseTo', 'received', 'expected, precision') + '\n\n' + "Expected value to be close to (with ".concat(printExpected(precision), "-digit precision):\n") + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeDefined: function toBeDefined(actual, expected) {
    ensureNoExpected(expected, '.toBeDefined');
    var pass = actual !== void 0;
    var message = pass ? function () {
      return matcherHint('.not.toBeDefined', 'received', '') + '\n\n' + "Expected value not to be defined, instead received\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeDefined', 'received', '') + '\n\n' + "Expected value to be defined, instead received\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeFalsy: function toBeFalsy(actual, expected) {
    ensureNoExpected(expected, '.toBeFalsy');
    var pass = !actual;
    var message = pass ? function () {
      return matcherHint('.not.toBeFalsy', 'received', '') + '\n\n' + "Expected value not to be falsy, instead received\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeFalsy', 'received', '') + '\n\n' + "Expected value to be falsy, instead received\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeGreaterThan: function toBeGreaterThan(actual, expected) {
    ensureNumbers(actual, expected, '.toBeGreaterThan');
    var pass = actual > expected;
    var message = pass ? function () {
      return matcherHint('.not.toBeGreaterThan') + '\n\n' + "Expected value not to be greater than:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeGreaterThan') + '\n\n' + "Expected value to be greater than:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeGreaterThanOrEqual: function toBeGreaterThanOrEqual(actual, expected) {
    ensureNumbers(actual, expected, '.toBeGreaterThanOrEqual');
    var pass = actual >= expected;
    var message = pass ? function () {
      return matcherHint('.not.toBeGreaterThanOrEqual') + '\n\n' + "Expected value not to be greater than or equal:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeGreaterThanOrEqual') + '\n\n' + "Expected value to be greater than or equal:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeLessThan: function toBeLessThan(actual, expected) {
    ensureNumbers(actual, expected, '.toBeLessThan');
    var pass = actual < expected;
    var message = pass ? function () {
      return matcherHint('.not.toBeLessThan') + '\n\n' + "Expected value not to be less than:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeLessThan') + '\n\n' + "Expected value to be less than:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeLessThanOrEqual: function toBeLessThanOrEqual(actual, expected) {
    ensureNumbers(actual, expected, '.toBeLessThanOrEqual');
    var pass = actual <= expected;
    var message = pass ? function () {
      return matcherHint('.not.toBeLessThanOrEqual') + '\n\n' + "Expected value not to be less than or equal:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeLessThanOrEqual') + '\n\n' + "Expected value to be less than or equal:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeNaN: function toBeNaN(actual, expected) {
    ensureNoExpected(expected, '.toBeNaN');
    var pass = Number.isNaN(actual);
    var message = pass ? function () {
      return matcherHint('.not.toBeNaN', 'received', '') + '\n\n' + "Expected value not to be NaN, instead received\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeNaN', 'received', '') + '\n\n' + "Expected value to be NaN, instead received\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeNull: function toBeNull(actual, expected) {
    ensureNoExpected(expected, '.toBeNull');
    var pass = actual === null;
    var message = pass ? function () {
      return matcherHint('.not.toBeNull', 'received', '') + '\n\n' + "Expected value not to be null, instead received\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeNull', 'received', '') + '\n\n' + "Expected value to be null, instead received\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeTruthy: function toBeTruthy(actual, expected) {
    ensureNoExpected(expected, '.toBeTruthy');
    var pass = !!actual;
    var message = pass ? function () {
      return matcherHint('.not.toBeTruthy', 'received', '') + '\n\n' + "Expected value not to be truthy, instead received\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeTruthy', 'received', '') + '\n\n' + "Expected value to be truthy, instead received\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toBeUndefined: function toBeUndefined(actual, expected) {
    ensureNoExpected(expected, '.toBeUndefined');
    var pass = actual === void 0;
    var message = pass ? function () {
      return matcherHint('.not.toBeUndefined', 'received', '') + '\n\n' + "Expected value not to be undefined, instead received\n" + "  ".concat(printReceived(actual));
    } : function () {
      return matcherHint('.toBeUndefined', 'received', '') + '\n\n' + "Expected value to be undefined, instead received\n" + "  ".concat(printReceived(actual));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toContain: function toContain(collection, value) {
    var collectionType = getType(collection);
    var converted = null;

    if (Array.isArray(collection) || typeof collection === 'string') {
      // strings have `indexOf` so we don't need to convert
      // arrays have `indexOf` and we don't want to make a copy
      converted = collection;
    } else {
      try {
        converted = Array.from(collection);
      } catch (e) {
        throw new Error(matcherHint('[.not].toContainEqual', 'collection', 'value') + '\n\n' + "Expected ".concat(RECEIVED_COLOR('collection'), " to be an array-like structure.\n") + printWithType('Received', collection, printReceived));
      }
    } // At this point, we're either a string or an Array,
    // which was converted from an array-like structure.


    var pass = converted.indexOf(value) != -1;
    var message = pass ? function () {
      return matcherHint('.not.toContain', collectionType, 'value') + '\n\n' + "Expected ".concat(collectionType, ":\n") + "  ".concat(printReceived(collection), "\n") + "Not to contain value:\n" + "  ".concat(printExpected(value), "\n");
    } : function () {
      return matcherHint('.toContain', collectionType, 'value') + '\n\n' + "Expected ".concat(collectionType, ":\n") + "  ".concat(printReceived(collection), "\n") + "To contain value:\n" + "  ".concat(printExpected(value));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toContainEqual: function toContainEqual(collection, value) {
    var collectionType = getType(collection);
    var converted = null;

    if (Array.isArray(collection)) {
      converted = collection;
    } else {
      try {
        converted = Array.from(collection);
      } catch (e) {
        throw new Error(matcherHint('[.not].toContainEqual', 'collection', 'value') + '\n\n' + "Expected ".concat(RECEIVED_COLOR('collection'), " to be an array-like structure.\n") + printWithType('Received', collection, printReceived));
      }
    }

    var pass = converted.findIndex(function (item) {
      return isDeepStrictEqual(item, value, [isDeepStrictEqual.iterableEquality]);
    }) !== -1;
    var message = pass ? function () {
      return matcherHint('.not.toContainEqual', collectionType, 'value') + '\n\n' + "Expected ".concat(collectionType, ":\n") + "  ".concat(printReceived(collection), "\n") + "Not to contain a value equal to:\n" + "  ".concat(printExpected(value), "\n");
    } : function () {
      return matcherHint('.toContainEqual', collectionType, 'value') + '\n\n' + "Expected ".concat(collectionType, ":\n") + "  ".concat(printReceived(collection), "\n") + "To contain a value equal to:\n" + "  ".concat(printExpected(value));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toEqual: function toEqual(received, expected) {
    var pass = isDeepStrictEqual(received, expected, [isDeepStrictEqual.iterableEquality]);
    var message = pass ? function () {
      return matcherHint('.not.toEqual') + '\n\n' + "Expected value to not equal:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(received));
    } : function () {
      return matcherHint('.toEqual') + '\n\n' + "Expected value to equal:\n" + "  ".concat(printExpected(expected), "\n") + "Received:\n" + "  ".concat(printReceived(received));
    }; // Passing the the actual and expected objects so that a custom reporter
    // could access them, for example in order to display a custom visual diff,
    // or create a different error message

    return {
      actual: received,
      expected: expected,
      message: message,
      name: 'toEqual',
      pass: pass
    };
  },
  toHaveLength: function toHaveLength(received, length) {
    if (typeof received !== 'string' && (!received || typeof received.length !== 'number')) {
      throw new Error(matcherHint('[.not].toHaveLength', 'received', 'length') + '\n\n' + "Expected value to have a 'length' property that is a number. " + "Received:\n" + "  ".concat(printReceived(received), "\n") + (received ? "received.length:\n  ".concat(printReceived(received.length)) : ''));
    }

    var pass = received.length === length;
    var message = pass ? function () {
      return matcherHint('.not.toHaveLength', 'received', 'length') + '\n\n' + "Expected value to not have length:\n" + "  ".concat(printExpected(length), "\n") + "Received:\n" + "  ".concat(printReceived(received), "\n") + "received.length:\n" + "  ".concat(printReceived(received.length));
    } : function () {
      return matcherHint('.toHaveLength', 'received', 'length') + '\n\n' + "Expected value to have length:\n" + "  ".concat(printExpected(length), "\n") + "Received:\n" + "  ".concat(printReceived(received), "\n") + "received.length:\n" + "  ".concat(printReceived(received.length));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toHaveProperty: function toHaveProperty(object, keyPath, value) {
    var valuePassed = arguments.length === 3;

    if (!object && typeof object !== 'string' && typeof object !== 'number') {
      throw new Error(matcherHint('[.not].toHaveProperty', 'object', 'path', {
        secondArgument: valuePassed ? 'value' : null
      }) + '\n\n' + "Expected ".concat(RECEIVED_COLOR('object'), " to be an object. Received:\n") + "  ".concat(getType(object), ": ").concat(printReceived(object)));
    }

    if (getType(keyPath) !== 'string') {
      throw new Error(matcherHint('[.not].toHaveProperty', 'object', 'path', {
        secondArgument: valuePassed ? 'value' : null
      }) + '\n\n' + "Expected ".concat(EXPECTED_COLOR('path'), " to be a string. Received:\n") + "  ".concat(getType(keyPath), ": ").concat(printReceived(keyPath)));
    }

    var result = getPath(object, keyPath);
    var lastTraversedObject = result.lastTraversedObject,
        hasEndProp = result.hasEndProp;
    var pass = valuePassed ? isDeepStrictEqual(result.value, value, [isDeepStrictEqual.iterableEquality]) : hasEndProp;
    var traversedPath = result.traversedPath.join('.');
    var message = pass ? function () {
      return matcherHint('.not.toHaveProperty', 'object', 'path', {
        secondArgument: valuePassed ? 'value' : null
      }) + '\n\n' + "Expected the object:\n" + "  ".concat(printReceived(object), "\n") + "Not to have a nested property:\n" + "  ".concat(printExpected(keyPath), "\n") + (valuePassed ? "With a value of:\n  ".concat(printExpected(value), "\n") : '');
    } : function () {
      return matcherHint('.toHaveProperty', 'object', 'path', {
        secondArgument: valuePassed ? 'value' : null
      }) + '\n\n' + "Expected the object:\n" + "  ".concat(printReceived(object), "\n") + "To have a nested property:\n" + "  ".concat(printExpected(keyPath), "\n") + (valuePassed ? "With a value of:\n  ".concat(printExpected(value), "\n") : '') + (hasEndProp ? "Received:\n  ".concat(printReceived(result.value)) : traversedPath ? "Received:\n  ".concat(RECEIVED_COLOR('object'), ".").concat(traversedPath, ": ").concat(printReceived(lastTraversedObject)) : '');
    };

    if (pass === undefined) {
      throw new Error('pass must be initialized');
    }

    return {
      message: message,
      pass: pass
    };
  },
  toMatch: function toMatch(received, expected) {
    if (typeof received !== 'string') {
      throw new Error(matcherHint('[.not].toMatch', 'string', 'expected') + '\n\n' + "".concat(RECEIVED_COLOR('string'), " value must be a string.\n") + printWithType('Received', received, printReceived));
    }

    if (!(expected instanceof RegExp) && !(typeof expected === 'string')) {
      throw new Error(matcherHint('[.not].toMatch', 'string', 'expected') + '\n\n' + "".concat(EXPECTED_COLOR('expected'), " value must be a string or a regular expression.\n") + printWithType('Expected', expected, printExpected));
    }

    var pass = new RegExp(typeof expected === 'string' ? escapeStrForRegex(expected) : expected).test(received);
    var message = pass ? function () {
      return matcherHint('.not.toMatch') + "\n\nExpected value not to match:\n" + "  ".concat(printExpected(expected)) + "\nReceived:\n" + "  ".concat(printReceived(received));
    } : function () {
      return matcherHint('.toMatch') + "\n\nExpected value to match:\n" + "  ".concat(printExpected(expected)) + "\nReceived:\n" + "  ".concat(printReceived(received));
    };
    return {
      message: message,
      pass: pass
    };
  },
  toMatchObject: function toMatchObject(receivedObject, expectedObject) {
    if (_typeof(receivedObject) !== 'object' || receivedObject === null) {
      throw new Error(matcherHint('[.not].toMatchObject', 'object', 'expected') + '\n\n' + "".concat(RECEIVED_COLOR('received'), " value must be an object.\n") + printWithType('Received', receivedObject, printReceived));
    }

    if (_typeof(expectedObject) !== 'object' || expectedObject === null) {
      throw new Error(matcherHint('[.not].toMatchObject', 'object', 'expected') + '\n\n' + "".concat(EXPECTED_COLOR('expected'), " value must be an object.\n") + printWithType('Expected', expectedObject, printExpected));
    }

    var pass = isDeepStrictEqual(receivedObject, expectedObject, [isDeepStrictEqual.iterableEquality, isDeepStrictEqual.subsetEquality]);
    var message = pass ? function () {
      return matcherHint('.not.toMatchObject') + "\n\nExpected value not to match object:\n" + "  ".concat(printExpected(expectedObject)) + "\nReceived:\n" + "  ".concat(printReceived(receivedObject));
    } : function () {
      return matcherHint('.toMatchObject') + "\n\nExpected value to match object:\n" + "  ".concat(printExpected(expectedObject)) + "\nReceived:\n" + "  ".concat(printReceived(receivedObject));
    };
    return {
      message: message,
      pass: pass
    };
  }
};
module.exports = matchers;

/***/ }),

/***/ "./node_modules/@skpm/test-runner/expect/matchers_object.js":
/*!******************************************************************!*\
  !*** ./node_modules/@skpm/test-runner/expect/matchers_object.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

module.exports.getState = function getState() {
  return MATCHERS_OBJECT.state;
};

module.exports.setState = function setState(state) {
  Object.assign(MATCHERS_OBJECT.state, state);
};

module.exports.getMatchers = function getMatchers() {
  return MATCHERS_OBJECT.matchers;
};

module.exports.setMatchers = function setMatchers(matchers) {
  Object.assign(MATCHERS_OBJECT.matchers, matchers);
};

/***/ }),

/***/ "./node_modules/@skpm/test-runner/expect/sketch_matchers.js":
/*!******************************************************************!*\
  !*** ./node_modules/@skpm/test-runner/expect/sketch_matchers.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable prefer-template */
var _require = __webpack_require__(/*! ./utils */ "./node_modules/@skpm/test-runner/expect/utils.js"),
    matcherHint = _require.matcherHint,
    printReceived = _require.printReceived,
    printExpected = _require.printExpected,
    getType = _require.getType; // /* Sketch specific matchers */


module.exports = {
  toBeInstanceOf: function toBeInstanceOf(received, constructor) {
    var constType = getType(constructor);

    if (constType !== 'function' && constType !== 'sketch-native') {
      throw new Error(matcherHint('[.not].toBeInstanceOf', 'value', 'constructor') + "\n\n" + "Expected constructor to be a function. Instead got:\n" + "  ".concat(printExpected(constType)));
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
      return matcherHint('.not.toBeInstanceOf', 'value', 'constructor') + '\n\n' + "Expected value not to be an instance of:\n" + "  ".concat(printExpected(expectedString), "\n") + "Received:\n" + "  ".concat(printReceived(receivedString), "\n");
    } : function () {
      return matcherHint('.toBeInstanceOf', 'value', 'constructor') + '\n\n' + "Expected value to be an instance of:\n" + "  ".concat(printExpected(expectedString), "\n") + "Received:\n" + "  ".concat(printReceived(received), "\n") + "Constructor:\n" + "  ".concat(printReceived(receivedString));
    };
    return {
      message: message,
      pass: pass
    };
  }
};

/***/ }),

/***/ "./node_modules/@skpm/test-runner/expect/utils.js":
/*!********************************************************!*\
  !*** ./node_modules/@skpm/test-runner/expect/utils.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable prefer-template, import/first */
var _require = __webpack_require__(/*! util */ "./core-modules/node_modules/@skpm/util/index.js"),
    inspect = _require.inspect;

module.exports.stringify = inspect;
var chalk = {
  green: function green(s) {
    return "{{{CHALK_green}}}".concat(s, "{{{/CHALK_green}}}");
  },
  red: function red(s) {
    return "{{{CHALK_red}}}".concat(s, "{{{/CHALK_red}}}");
  },
  dim: function dim(s) {
    return "{{{CHALK_dim}}}".concat(s, "{{{/CHALK_dim}}}");
  },
  inverse: function inverse(s) {
    return "{{{CHALK_inverse}}}".concat(s, "{{{/CHALK_inverse}}}");
  }
};
var REVERSE_REGEX = /{{{CHALK_([a-z]+)}}}([\s\S]*?){{{\/CHALK_\1}}}/gm;

var reverseChalk = function reverseChalk(realChalk, s) {
  return s.replace(REVERSE_REGEX, function (match, mode, inside) {
    return realChalk[mode](reverseChalk(realChalk, inside));
  });
};

module.exports.reverseChalk = reverseChalk;
var EXPECTED_COLOR = chalk.green;
var RECEIVED_COLOR = chalk.red;
module.exports.EXPECTED_COLOR = EXPECTED_COLOR;
module.exports.RECEIVED_COLOR = RECEIVED_COLOR;
var NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen'];
module.exports.SUGGEST_TO_EQUAL = chalk.dim('Looks like you wanted to test for object/array equality with strict `toBe` matcher. You probably need to use `toEqual` instead.');

var highlightTrailingWhitespace = function highlightTrailingWhitespace(text) {
  return text.replace(/\s+$/gm, chalk.inverse('$&'));
};

module.exports.highlightTrailingWhitespace = highlightTrailingWhitespace;

var printReceived = function printReceived(object) {
  return RECEIVED_COLOR(highlightTrailingWhitespace(inspect(object)));
};

var printExpected = function printExpected(value) {
  return EXPECTED_COLOR(highlightTrailingWhitespace(inspect(value)));
};

module.exports.printReceived = printReceived;
module.exports.printExpected = printExpected;

var getType = function getType(value) {
  if (typeof value === 'undefined') {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (typeof value === 'function') {
    return 'function';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (typeof value === 'string') {
    return 'string';
  }

  if (_typeof(value) === 'object') {
    if (value.constructor === RegExp) {
      return 'regexp';
    }

    if (value.constructor === Map) {
      return 'map';
    }

    if (value.constructor === Set) {
      return 'set';
    }

    if (value.class && typeof value.class === 'function') {
      return 'sketch-native';
    }

    return 'object'; // $FlowFixMe https://github.com/facebook/flow/issues/1015
  }

  if (_typeof(value) === 'symbol') {
    return 'symbol';
  }

  throw new Error("value of unknown type: ".concat(value));
};

module.exports.getType = getType;

var printWithType = function printWithType(name, received, print) {
  var type = getType(received);
  return name + ':' + (type !== 'null' && type !== 'undefined' ? '\n  ' + type + ': ' : ' ') + print(received);
};

module.exports.printWithType;

var matcherHint = function matcherHint(matcherName) {
  var received = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'received';
  var expected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'expected';
  var options = arguments.length > 3 ? arguments[3] : undefined;
  var secondArgument = options && options.secondArgument;
  var isDirectExpectCall = options && options.isDirectExpectCall;
  return chalk.dim('expect' + (isDirectExpectCall ? '' : '(')) + RECEIVED_COLOR(received) + chalk.dim((isDirectExpectCall ? '' : ')') + matcherName + '(') + EXPECTED_COLOR(expected) + (secondArgument ? ", ".concat(EXPECTED_COLOR(secondArgument)) : '') + chalk.dim(')');
};

module.exports.matcherHint = matcherHint;

var ensureNoExpected = function ensureNoExpected(expected, matcherName) {
  if (typeof expected !== 'undefined') {
    throw new Error("".concat(matcherHint("[.not]".concat(matcherName || 'This'), undefined, ''), "\n\nMatcher does not accept any arguments.\n").concat(printWithType('Got', expected, printExpected)));
  }
};

module.exports.ensureNoExpected = ensureNoExpected;

var ensureActualIsNumber = function ensureActualIsNumber(actual, matcherName) {
  if (typeof actual !== 'number') {
    throw new Error(matcherHint("[.not]".concat(matcherName || 'This matcher')) + '\n\n' + "Received value must be a number.\n" + printWithType('Received', actual, printReceived));
  }
};

module.exports.ensureActualIsNumber = ensureActualIsNumber;

var ensureExpectedIsNumber = function ensureExpectedIsNumber(expected, matcherName) {
  if (typeof expected !== 'number') {
    throw new Error(matcherHint("[.not]".concat(matcherName || 'This matcher')) + '\n\n' + "Expected value must be a number.\n" + printWithType('Got', expected, printExpected));
  }
};

module.exports.ensureExpectedIsNumber = ensureExpectedIsNumber;

var ensureNumbers = function ensureNumbers(actual, expected, matcherName) {
  ensureActualIsNumber(actual, matcherName);
  ensureExpectedIsNumber(expected, matcherName);
};

module.exports.ensureNumbers = ensureNumbers;

var pluralize = function pluralize(word, count) {
  return (NUMBERS[count] || count) + ' ' + word + (count === 1 ? '' : 's');
};

module.exports.pluralize = pluralize;

/***/ }),

/***/ "./node_modules/@skpm/test-runner/test-runner.sketchplugin/Contents/Sketch/generated-tests.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/@skpm/test-runner/test-runner.sketchplugin/Contents/Sketch/generated-tests.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise, expect) {/* ⛔⚠️ THIS IS A GENERATED FILE. DO NOT MODIFY THIS ⛔⚠️ */

/* globals MSDocumentData, log, expect, coscript */
var prepareStackTrace = __webpack_require__(/*! sketch-utils/prepare-stack-trace */ "./node_modules/sketch-utils/prepare-stack-trace.js");

var sketch = __webpack_require__(/*! sketch */ "./Source/index.ts"); // eslint-disable-line


function SerialPromise(promises) {
  return promises.reduce(function (prev, p) {
    return prev.then(function () {
      return p();
    });
  }, Promise.resolve());
}

function getTestFailure(err) {
  var testFailure;

  if (err instanceof Error) {
    testFailure = {
      message: err.message,
      name: err.name,
      stack: prepareStackTrace(err.stack || '')
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

  return testFailure;
}

module.exports = function runTests(context) {
  var testResults = [];
  var testSuites = {
    suites: {}
  };

  try {
    testSuites.suites["async"] = __webpack_require__(/*! ../../../../../../Source/async/__tests__/async.test.js */ "./Source/async/__tests__/async.test.js");
  } catch (err) {
    testResults.push({
      name: "async",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["WrappedObject"] = __webpack_require__(/*! ../../../../../../Source/dom/__tests__/WrappedObject.test.js */ "./Source/dom/__tests__/WrappedObject.test.js");
  } catch (err) {
    testResults.push({
      name: "WrappedObject",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Artboard"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/Artboard.test.js */ "./Source/dom/layers/__tests__/Artboard.test.js");
  } catch (err) {
    testResults.push({
      name: "Artboard",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Group"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/Group.test.js */ "./Source/dom/layers/__tests__/Group.test.js");
  } catch (err) {
    testResults.push({
      name: "Group",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["HotSpot"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/HotSpot.test.js */ "./Source/dom/layers/__tests__/HotSpot.test.js");
  } catch (err) {
    testResults.push({
      name: "HotSpot",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Image"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/Image.test.js */ "./Source/dom/layers/__tests__/Image.test.js");
  } catch (err) {
    testResults.push({
      name: "Image",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Layer"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/Layer.test.js */ "./Source/dom/layers/__tests__/Layer.test.js");
  } catch (err) {
    testResults.push({
      name: "Layer",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Page"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/Page.test.js */ "./Source/dom/layers/__tests__/Page.test.js");
  } catch (err) {
    testResults.push({
      name: "Page",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Shape"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/Shape.test.js */ "./Source/dom/layers/__tests__/Shape.test.js");
  } catch (err) {
    testResults.push({
      name: "Shape",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["ShapePath"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/ShapePath.test.js */ "./Source/dom/layers/__tests__/ShapePath.test.js");
  } catch (err) {
    testResults.push({
      name: "ShapePath",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["StyledLayer"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/StyledLayer.test.js */ "./Source/dom/layers/__tests__/StyledLayer.test.js");
  } catch (err) {
    testResults.push({
      name: "StyledLayer",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["SymbolInstance"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/SymbolInstance.test.js */ "./Source/dom/layers/__tests__/SymbolInstance.test.js");
  } catch (err) {
    testResults.push({
      name: "SymbolInstance",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["SymbolMaster"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/SymbolMaster.test.js */ "./Source/dom/layers/__tests__/SymbolMaster.test.js");
  } catch (err) {
    testResults.push({
      name: "SymbolMaster",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Text"] = __webpack_require__(/*! ../../../../../../Source/dom/layers/__tests__/Text.test.js */ "./Source/dom/layers/__tests__/Text.test.js");
  } catch (err) {
    testResults.push({
      name: "Text",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Document"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/Document.test.js */ "./Source/dom/models/__tests__/Document.test.js");
  } catch (err) {
    testResults.push({
      name: "Document",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Flow"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/Flow.test.js */ "./Source/dom/models/__tests__/Flow.test.js");
  } catch (err) {
    testResults.push({
      name: "Flow",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["ImageData"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/ImageData.test.js */ "./Source/dom/models/__tests__/ImageData.test.js");
  } catch (err) {
    testResults.push({
      name: "ImageData",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["ImportableObject"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/ImportableObject.test.js */ "./Source/dom/models/__tests__/ImportableObject.test.js");
  } catch (err) {
    testResults.push({
      name: "ImportableObject",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Library"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/Library.test.js */ "./Source/dom/models/__tests__/Library.test.js");
  } catch (err) {
    testResults.push({
      name: "Library",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Override"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/Override.test.js */ "./Source/dom/models/__tests__/Override.test.js");
  } catch (err) {
    testResults.push({
      name: "Override",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Rectangle"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/Rectangle.test.js */ "./Source/dom/models/__tests__/Rectangle.test.js");
  } catch (err) {
    testResults.push({
      name: "Rectangle",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Selection"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/Selection.test.js */ "./Source/dom/models/__tests__/Selection.test.js");
  } catch (err) {
    testResults.push({
      name: "Selection",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["SharedStyle"] = __webpack_require__(/*! ../../../../../../Source/dom/models/__tests__/SharedStyle.test.js */ "./Source/dom/models/__tests__/SharedStyle.test.js");
  } catch (err) {
    testResults.push({
      name: "SharedStyle",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Blur"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/Blur.test.js */ "./Source/dom/style/__tests__/Blur.test.js");
  } catch (err) {
    testResults.push({
      name: "Blur",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Border"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/Border.test.js */ "./Source/dom/style/__tests__/Border.test.js");
  } catch (err) {
    testResults.push({
      name: "Border",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["BorderOptions"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/BorderOptions.test.js */ "./Source/dom/style/__tests__/BorderOptions.test.js");
  } catch (err) {
    testResults.push({
      name: "BorderOptions",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Color"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/Color.test.js */ "./Source/dom/style/__tests__/Color.test.js");
  } catch (err) {
    testResults.push({
      name: "Color",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Fill"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/Fill.test.js */ "./Source/dom/style/__tests__/Fill.test.js");
  } catch (err) {
    testResults.push({
      name: "Fill",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Gradient"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/Gradient.test.js */ "./Source/dom/style/__tests__/Gradient.test.js");
  } catch (err) {
    testResults.push({
      name: "Gradient",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["GradientStop"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/GradientStop.test.js */ "./Source/dom/style/__tests__/GradientStop.test.js");
  } catch (err) {
    testResults.push({
      name: "GradientStop",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Shadow"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/Shadow.test.js */ "./Source/dom/style/__tests__/Shadow.test.js");
  } catch (err) {
    testResults.push({
      name: "Shadow",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Style"] = __webpack_require__(/*! ../../../../../../Source/dom/style/__tests__/Style.test.js */ "./Source/dom/style/__tests__/Style.test.js");
  } catch (err) {
    testResults.push({
      name: "Style",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
    });
  }

  try {
    testSuites.suites["Settings"] = __webpack_require__(/*! ../../../../../../Source/settings/__tests__/Settings.test.js */ "./Source/settings/__tests__/Settings.test.js");
  } catch (err) {
    testResults.push({
      name: "Settings",
      type: 'failed',
      exec: true,
      reason: getTestFailure(err)
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


  function runUnitTests() {
    var specification = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var suiteName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var _specification$suites = specification.suites,
        suites = _specification$suites === void 0 ? {} : _specification$suites,
        _specification$logs = specification.logs,
        logs = _specification$logs === void 0 ? [] : _specification$logs,
        _specification$tests = specification.tests,
        tests = _specification$tests === void 0 ? {} : _specification$tests,
        skipped = specification.skipped,
        only = specification.only,
        _specification$ancest = specification.ancestorSuites,
        ancestorSuites = _specification$ancest === void 0 ? [] : _specification$ancest; // if there are suites with `only`

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
            logs: i === 0 ? logs : [] // only push the logs once per suite

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
            testResults.push({
              name: name,
              only: test.only,
              type: 'failed',
              reason: getTestFailure(err),
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

  sketch.Async.createFiber();
  runUnitTests(testSuites).then(function (results) {
    if (results.some(function (t) {
      return t.only;
    })) {
      results = results.filter(function (t) {
        return t.only;
      }); // eslint-disable-line
    }

    log("".concat(results.length, " tests ran."));
    log("".concat(results.filter(function (t) {
      return t.type === 'passed';
    }).length, " tests succeeded."));
    log("".concat(results.filter(function (t) {
      return t.type === 'failed';
    }).length, " tests failed."));
    log("json results: ".concat(JSON.stringify(results)));
    coscript.cleanupFibers(); // cleanup all the fibers to avoid getting stuck
  }).catch(function (err) {
    coscript.cleanupFibers(); // cleanup all the fibers to avoid getting stuck

    throw err;
  });
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js"), __webpack_require__(/*! ./node_modules/@skpm/test-runner/expect/index.js */ "./node_modules/@skpm/test-runner/expect/index.js")))

/***/ }),

/***/ "./node_modules/@skpm/timers/immediate.js":
/*!************************************************!*\
  !*** ./node_modules/@skpm/timers/immediate.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var timeout = __webpack_require__(/*! ./timeout */ "./node_modules/@skpm/timers/timeout.js")

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

/***/ "./node_modules/@skpm/timers/test-if-fiber.js":
/*!****************************************************!*\
  !*** ./node_modules/@skpm/timers/test-if-fiber.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function () {
  return typeof coscript !== 'undefined' && coscript.createFiber
}


/***/ }),

/***/ "./node_modules/@skpm/timers/timeout.js":
/*!**********************************************!*\
  !*** ./node_modules/@skpm/timers/timeout.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var fiberAvailable = __webpack_require__(/*! ./test-if-fiber */ "./node_modules/@skpm/timers/test-if-fiber.js")

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

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/timers/timeout.js */ "./node_modules/@skpm/timers/timeout.js")["setTimeout"], __webpack_require__(/*! ./node_modules/@skpm/timers/timeout.js */ "./node_modules/@skpm/timers/timeout.js")["clearTimeout"]))

/***/ }),

/***/ "./node_modules/promise-polyfill/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/promise-polyfill/lib/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setTimeout, setImmediate) {

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
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
}

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

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
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

/**
 * @constructor
 */
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
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/timers/timeout.js */ "./node_modules/@skpm/timers/timeout.js")["setTimeout"], __webpack_require__(/*! ./node_modules/@skpm/timers/immediate.js */ "./node_modules/@skpm/timers/immediate.js")["setImmediate"]))

/***/ }),

/***/ "./node_modules/sketch-utils/prepare-stack-trace.js":
/*!**********************************************************!*\
  !*** ./node_modules/sketch-utils/prepare-stack-trace.js ***!
  \**********************************************************/
/*! no static exports found */
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


/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=compiled-tests.js.map