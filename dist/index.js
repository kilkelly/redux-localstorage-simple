'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.save = save;
exports.load = load;
exports.combineLoads = combineLoads;
exports.clear = clear;

var _objectMerge = require('object-merge');

var _objectMerge2 = _interopRequireDefault(_objectMerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MODULE_NAME = '[Redux-LocalStorage-Simple]';
var NAMESPACE_DEFAULT = 'redux_localstorage_simple';
var STATES_DEFAULT = [];
var DEBOUNCE_DEFAULT = 0;
var IMMUTABLEJS_DEFAULT = false;
var DISABLE_WARNINGS_DEFAULT = false;
var debounceTimeout = null;

// ---------------------------------------------------
/* warn

  DESCRIPTION
  ----------
  Write a warning to the console if warnings are enabled

  PARAMETERS
  ----------
  @disableWarnings (Boolean) - If set to true then the warning is not written to the console
  @warningMessage (String) - The message to write to the console

*/

function warn(disableWarnings) {
  return function (warningMessage) {
    if (!disableWarnings) {
      console.warn(MODULE_NAME, warningMessage);
    }
  };
}

// ---------------------------------------------------
/* lensPath

  DESCRIPTION
  ----------
  Gets inner data from an object based on a specified path

  PARAMETERS
  ----------
  @path (Array of Strings) - Path used to get an object's inner data
                              e.g. ['prop', 'innerProp']
  @obj (Object) - Object to get inner data from

  USAGE EXAMPLE
  -------------
  lensPath(
    ['prop', 'innerProp'],
    { prop: { innerProp: 123 } }
  )

    returns

  123
*/

function lensPath(path, obj) {
  if (obj === undefined) {
    return null;
  } else if (path.length === 1) {
    return obj[path[0]];
  } else {
    return lensPath(path.slice(1), obj[path[0]]);
  }
}

// ---------------------------------------------------
/* realiseObject

  DESCRIPTION
  ----------
  Create an object from a specified path, with
  the innermost property set with an initial value

  PARAMETERS
  ----------
  @objectPath (String) - Object path e.g. 'myObj.prop1.prop2'
  @objectInitialValue (Any, optional) - Value of the innermost property once object is created

  USAGE EXAMPLE
  -------------

  realiseObject('myObj.prop1.prop2', 123)

    returns

  {
    myObj: {
      prop1: {
          prop2: 123
        }
      }
  }
*/

function realiseObject(objectPath) {
  var objectInitialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  function realiseObject_(objectPathArr, objectInProgress) {
    if (objectPathArr.length === 0) {
      return objectInProgress;
    } else {
      return realiseObject_(objectPathArr.slice(1), _defineProperty({}, objectPathArr[0], objectInProgress));
    }
  }
  return realiseObject_(objectPath.split('.').reverse(), objectInitialValue);
}

// ---------------------------------------------------

/**
  Saves specified parts of the Redux state tree into localstorage
  Note: this is Redux middleware. Read this for an explanation:
  http://redux.js.org/docs/advanced/Middleware.html

  PARAMETERS
  ----------
  @config (Object) - Contains configuration options (leave blank to save entire state tree to localstorage)

            Properties:
              states (Array of Strings, optional) - States to save e.g. ['user', 'products']
              namespace (String, optional) - Namespace to add before your LocalStorage items
              debounce (Number, optional) - Debouncing period (in milliseconds) to wait before saving to LocalStorage
                                            Use this as a performance optimization if you feel you are saving
                                            to LocalStorage too often. Recommended value: 500 - 1000 milliseconds

  USAGE EXAMPLES
  -------------

    // save entire state tree - EASIEST OPTION
    save()

    // save specific parts of the state tree
    save({
      states: ['user', 'products']
    })

    // save the entire state tree under the namespace 'my_cool_app'. The key 'my_cool_app' will appear in LocalStorage
    save({
      namespace: 'my_cool_app'
    })

    // save the entire state tree only after a debouncing period of 500 milliseconds has elapsed
    save({
      debounce: 500
    })

    // save specific parts of the state tree with the namespace 'my_cool_app'. The keys 'my_cool_app_user' and 'my_cool_app_products' will appear in LocalStorage
    save({
        states: ['user', 'products'],
        namespace: 'my_cool_app',
        debounce: 500
    })
*/

function save() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$states = _ref.states,
      states = _ref$states === undefined ? STATES_DEFAULT : _ref$states,
      _ref$namespace = _ref.namespace,
      namespace = _ref$namespace === undefined ? NAMESPACE_DEFAULT : _ref$namespace,
      _ref$debounce = _ref.debounce,
      debounce = _ref$debounce === undefined ? DEBOUNCE_DEFAULT : _ref$debounce;

  return function (store) {
    return function (next) {
      return function (action) {
        var returnValue = next(action);

        // Validate 'states' parameter
        if (!isArray(states)) {
          console.error(MODULE_NAME, "'states' parameter in 'save()' method was passed a non-array value. Setting default value instead. Check your 'save()' method.");
          states = STATES_DEFAULT;
        }

        // Validate 'namespace' parameter
        if (!isString(namespace)) {
          console.error(MODULE_NAME, "'namespace' parameter in 'save()' method was passed a non-string value. Setting default value instead. Check your 'save()' method.");
          namespace = NAMESPACE_DEFAULT;
        }

        // Validate 'debounce' parameter
        if (!isInteger(debounce)) {
          console.error(MODULE_NAME, "'debounce' parameter in 'save()' method was passed a non-integer value. Setting default value instead. Check your 'save()' method.");
          debounce = DEBOUNCE_DEFAULT;
        }

        // Check to see whether to debounce LocalStorage saving
        if (debounce) {
          // Clear the debounce timeout if it was previously set
          if (debounceTimeout) {
            clearTimeout(debounceTimeout);
          }

          // Save to LocalStorage after the debounce period has elapsed
          debounceTimeout = setTimeout(function () {
            _save(states, namespace);
          }, debounce);
          // No debouncing necessary so save to LocalStorage right now
        } else {
          _save(states, namespace);
        }

        // Digs into rootState for the data to put in LocalStorage
        function getStateForLocalStorage(state, rootState) {
          var delimiter = '.';

          if (state.split(delimiter).length > 1) {
            return lensPath(state.split(delimiter), rootState);
          } else {
            return lensPath([state], rootState);
          }
        }

        // Local function to avoid duplication of code above
        function _save() {
          if (states.length === 0) {
            localStorage[namespace] = JSON.stringify(store.getState());
          } else {
            states.forEach(function (state) {
              var stateForLocalStorage = getStateForLocalStorage(state, store.getState());
              if (stateForLocalStorage) {
                localStorage[namespace + '_' + state] = JSON.stringify(stateForLocalStorage);
              } else {
                // Make sure nothing is ever saved for this incorrect state
                localStorage.removeItem(namespace + '_' + state);
              }
            });
          }
        }

        return returnValue;
      };
    };
  };
}

/**
  Loads specified states from localstorage into the Redux state tree.

  PARAMETERS
  ----------
  @config (Object) - Contains configuration options (leave blank to load entire state tree, if it was saved previously that is)
            Properties:
              states (Array of Strings, optional) - Parts of state tree to load e.g. ['user', 'products']
              namespace (String, optional) - Namespace required to retrieve your LocalStorage items, if any

  Usage examples:

    // load entire state tree - EASIEST OPTION
    load()

    // load specific parts of the state tree
    load({
      states: ['user', 'products']
    })

    // load the entire state tree which was previously saved with the namespace "my_cool_app"
    load({
      namespace: 'my_cool_app'
    })

    // load specific parts of the state tree which was previously saved with the namespace "my_cool_app"
    load({
        states: ['user', 'products'],
        namespace: 'my_cool_app'
    })

*/

function load() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$states = _ref2.states,
      states = _ref2$states === undefined ? STATES_DEFAULT : _ref2$states,
      _ref2$immutablejs = _ref2.immutablejs,
      immutablejs = _ref2$immutablejs === undefined ? IMMUTABLEJS_DEFAULT : _ref2$immutablejs,
      _ref2$namespace = _ref2.namespace,
      namespace = _ref2$namespace === undefined ? NAMESPACE_DEFAULT : _ref2$namespace,
      _ref2$preloadedState = _ref2.preloadedState,
      preloadedState = _ref2$preloadedState === undefined ? {} : _ref2$preloadedState,
      _ref2$disableWarnings = _ref2.disableWarnings,
      disableWarnings = _ref2$disableWarnings === undefined ? DISABLE_WARNINGS_DEFAULT : _ref2$disableWarnings;

  // Bake disableWarnings into the warn function
  var warn_ = warn(disableWarnings);

  // Validate 'states' parameter
  if (!isArray(states)) {
    console.error(MODULE_NAME, "'states' parameter in 'load()' method was passed a non-array value. Setting default value instead. Check your 'load()' method.");
    states = STATES_DEFAULT;
  }

  // Validate 'namespace' parameter
  if (!isString(namespace)) {
    console.error(MODULE_NAME, "'namespace' parameter in 'load()' method was passed a non-string value. Setting default value instead. Check your 'load()' method.");
    namespace = NAMESPACE_DEFAULT;
  }

  // Display immmutablejs deprecation notice if developer tries to utilise it
  if (immutablejs === true) {
    warn_('Support for Immutable.js data structures has been deprecated as of version 2.0.0. Please use version 1.4.0 if you require this functionality.');
  }

  var loadedState = preloadedState;

  // Load all of the namespaced Redux data from LocalStorage into local Redux state tree
  if (states.length === 0) {
    if (localStorage[namespace]) {
      loadedState = JSON.parse(localStorage[namespace]);
    }
  } else {
    // Load only specified states into the local Redux state tree
    states.forEach(function (state) {
      if (localStorage.getItem(namespace + '_' + state)) {
        loadedState = (0, _objectMerge2.default)(loadedState, realiseObject(state, JSON.parse(localStorage[namespace + '_' + state])));
      } else {
        warn_("Invalid load '" + (namespace + '_' + state) + "' provided. Check your 'states' in 'load()'. If this is your first time running this app you may see this message. To disable it in future use the 'disableWarnings' flag, see documentation.");
      }
    });
  }

  return loadedState;
}

/**
  Combines multiple 'load' method calls to return a single state for use in Redux's createStore method.
  Use this when parts of the loading process need to be handled differently e.g. some parts of your state tree use different namespaces

  PARAMETERS
  ----------
  @loads - 'load' method calls passed into this method as normal arguments

  Usage example:

    // Load parts of the state tree saved with different namespaces
    combineLoads(
        load({ states: ['user'], namespace: 'account_stuff' }),
        load({ states: ['products', 'categories'], namespace: 'site_stuff' )
    )
*/

function combineLoads() {
  var combinedLoad = {};

  for (var _len = arguments.length, loads = Array(_len), _key = 0; _key < _len; _key++) {
    loads[_key] = arguments[_key];
  }

  loads.forEach(function (load) {
    // Make sure current 'load' is an object
    if (!isObject(load)) {
      console.error(MODULE_NAME, "One or more loads provided to 'combineLoads()' is not a valid object. Ignoring the invalid load/s. Check your 'combineLoads()' method.");
      load = {};
    }

    for (var state in load) {
      combinedLoad[state] = load[state];
    }
  });

  return combinedLoad;
}

/**
  Clears all Redux state tree data from LocalStorage
  Remember to provide a namespace if you used one during the save process

  PARAMETERS
  ----------
  @config (Object) -Contains configuration options (leave blank to clear entire state tree from LocalStorage, if it was saved without a namespace)
            Properties:
              namespace (String, optional) - Namespace that you used during the save process

  Usage example:

    // clear all Redux state tree data saved without a namespace
    clear()

    // clear Redux state tree data saved with a namespace
    clear({
      namespace: 'my_cool_app'
    })
*/

function clear() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$namespace = _ref3.namespace,
      namespace = _ref3$namespace === undefined ? NAMESPACE_DEFAULT : _ref3$namespace;

  // Validate 'namespace' parameter
  if (!isString(namespace)) {
    console.error(MODULE_NAME, "'namespace' parameter in 'clear()' method was passed a non-string value. Setting default value instead. Check your 'clear()' method.");
    namespace = NAMESPACE_DEFAULT;
  }

  for (var key in localStorage) {
    // key starts with namespace
    if (key.slice(0, namespace.length) === namespace) {
      localStorage.removeItem(key);
    }
  }
}

// ---------------------------------------------------
// Utility functions

function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

function isString(value) {
  return typeof value === 'string';
}

function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

function isObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}