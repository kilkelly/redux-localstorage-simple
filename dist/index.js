'use strict';var _merge=_interopRequireDefault(require("merge"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.save=save,exports.load=load,exports.combineLoads=combineLoads,exports.clear=clear;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var MODULE_NAME="[Redux-LocalStorage-Simple]",NAMESPACE_DEFAULT="redux_localstorage_simple",NAMESPACE_SEPARATOR_DEFAULT="_",STATES_DEFAULT=[],IGNORE_STATES_DEFAULT=[],DEBOUNCE_DEFAULT=0,IMMUTABLEJS_DEFAULT=!1,DISABLE_WARNINGS_DEFAULT=!1,debounceTimeout=null;// ---------------------------------------------------
/* warn

  DESCRIPTION
  ----------
  Write a warning to the console if warnings are enabled

  PARAMETERS
  ----------
  @disableWarnings (Boolean) - If set to true then the warning is not written to the console
  @warningMessage (String) - The message to write to the console

*/function warnConsole(a){console.warn(MODULE_NAME,a)}function warnSilent(){// Empty
}var warn=function(a){return a?warnSilent:warnConsole};// ---------------------------------------------------
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
*/function lensPath(a,b){return void 0===b?null:1===a.length?b[a[0]]:lensPath(a.slice(1),b[a[0]])}// ---------------------------------------------------
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
*/function realiseObject(a){function b(a,c){return 0===a.length?c:b(a.slice(1),_defineProperty({},a[0],c))}var c=1<arguments.length&&arguments[1]!==void 0?arguments[1]:{};return b(a.split(".").reverse(),c)}// ---------------------------------------------------
// SafeLocalStorage wrapper to handle the minefield of exceptions
// that localStorage can throw. JSON.parse() is handled here as well.
function SafeLocalStorage(a){this.warnFn=a||warnConsole}Object.defineProperty(SafeLocalStorage.prototype,"length",{get:function(){try{return localStorage.length}catch(a){this.warnFn(a)}return 0},configurable:!0,enumerable:!0}),SafeLocalStorage.prototype.key=function(a){try{return localStorage.key(a)}catch(a){this.warnFn(a)}return null},SafeLocalStorage.prototype.setItem=function(a,b){try{localStorage.setItem(a,JSON.stringify(b))}catch(a){this.warnFn(a)}},SafeLocalStorage.prototype.getItem=function(a){try{return JSON.parse(localStorage.getItem(a))}catch(a){this.warnFn(a)}return null},SafeLocalStorage.prototype.removeItem=function(a){try{localStorage.removeItem(a)}catch(a){this.warnFn(a)}};// ---------------------------------------------------
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
*/function save(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{},b=a.states,c=void 0===b?STATES_DEFAULT:b,d=a.ignoreStates,e=void 0===d?IGNORE_STATES_DEFAULT:d,f=a.namespace,g=void 0===f?NAMESPACE_DEFAULT:f,h=a.namespaceSeparator,i=void 0===h?NAMESPACE_SEPARATOR_DEFAULT:h,j=a.debounce,k=void 0===j?DEBOUNCE_DEFAULT:j,l=a.disableWarnings,m=void 0===l?DISABLE_WARNINGS_DEFAULT:l;return function(a){return function(b){return function(d){// Digs into rootState for the data to put in LocalStorage
function f(a,b){return 1<a.split(".").length?lensPath(a.split("."),b):lensPath([a],b)}// Local function to avoid duplication of code above
function h(){0===c.length?o.setItem(g,j):c.forEach(function(a){var b=g+i+a,c=f(a,j);c?o.setItem(b,c):o.removeItem(b)})}// Bake disableWarnings into the warn function
var j,l=warn(m),n=b(d);isArray(c)||(console.error(MODULE_NAME,"'states' parameter in 'save()' method was passed a non-array value. Setting default value instead. Check your 'save()' method."),c=STATES_DEFAULT),isArray(e)||(console.error(MODULE_NAME,"'ignoreStates' parameter in 'save()' method was passed a non-array value. Setting default value instead. Check your 'save()' method."),e=IGNORE_STATES_DEFAULT),0<e.length&&(e=e.filter(function(a){return isString(a)?a:void console.error(MODULE_NAME,"'ignoreStates' array contains a non-string value. Ignoring this value. Check your 'ignoreStates' array.")})),isString(g)||(console.error(MODULE_NAME,"'namespace' parameter in 'save()' method was passed a non-string value. Setting default value instead. Check your 'save()' method."),g=NAMESPACE_DEFAULT),isString(i)||(console.error(MODULE_NAME,"'namespaceSeparator' parameter in 'save()' method was passed a non-string value. Setting default value instead. Check your 'save()' method."),i=NAMESPACE_SEPARATOR_DEFAULT),isInteger(k)||(console.error(MODULE_NAME,"'debounce' parameter in 'save()' method was passed a non-integer value. Setting default value instead. Check your 'save()' method."),k=DEBOUNCE_DEFAULT),j=0<e.length?handleIgnoreStates(e,a.getState()):a.getState();var o=new SafeLocalStorage(l);// Check to see whether to debounce LocalStorage saving
return k?(debounceTimeout&&clearTimeout(debounceTimeout),debounceTimeout=setTimeout(function(){h(c,g)},k)):h(c,g),n}}}}/**
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

*/function load(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{},b=a.states,c=void 0===b?STATES_DEFAULT:b,d=a.immutablejs,e=void 0===d?IMMUTABLEJS_DEFAULT:d,f=a.namespace,g=void 0===f?NAMESPACE_DEFAULT:f,h=a.namespaceSeparator,i=void 0===h?NAMESPACE_SEPARATOR_DEFAULT:h,j=a.preloadedState,k=void 0===j?{}:j,l=a.disableWarnings,m=void 0===l?DISABLE_WARNINGS_DEFAULT:l,n=warn(m);isArray(c)||(console.error(MODULE_NAME,"'states' parameter in 'load()' method was passed a non-array value. Setting default value instead. Check your 'load()' method."),c=STATES_DEFAULT),isString(g)||(console.error(MODULE_NAME,"'namespace' parameter in 'load()' method was passed a non-string value. Setting default value instead. Check your 'load()' method."),g=NAMESPACE_DEFAULT),isString(i)||(console.error(MODULE_NAME,"'namespaceSeparator' parameter in 'load()' method was passed a non-string value. Setting default value instead. Check your 'load()' method."),i=NAMESPACE_SEPARATOR_DEFAULT),!0===e&&n("Support for Immutable.js data structures has been deprecated as of version 2.0.0. Please use version 1.4.0 if you require this functionality.");var o=new SafeLocalStorage(n),p=k;// Load all of the namespaced Redux data from LocalStorage into local Redux state tree
if(0===c.length){var q=o.getItem(g);q&&(p=q)}else// Load only specified states into the local Redux state tree
c.forEach(function(a){var b=g+i+a,c=o.getItem(b);c?p=_merge["default"].recursive(p,realiseObject(a,c)):n("Invalid load '"+b+"' provided. Check your 'states' in 'load()'. If this is your first time running this app you may see this message. To disable it in future use the 'disableWarnings' flag, see documentation.")});return p}/**
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
*/function combineLoads(){for(var a={},b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];return c.forEach(function(b){for(var c in isObject(b)||(console.error(MODULE_NAME,"One or more loads provided to 'combineLoads()' is not a valid object. Ignoring the invalid load/s. Check your 'combineLoads()' method."),b={}),b)a[c]=b[c]}),a}/**
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
*/function clear(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{},b=a.namespace,c=void 0===b?NAMESPACE_DEFAULT:b,d=a.disableWarnings,e=void 0===d?DISABLE_WARNINGS_DEFAULT:d,f=warn(e);isString(c)||(console.error(MODULE_NAME,"'namespace' parameter in 'clear()' method was passed a non-string value. Setting default value instead. Check your 'clear()' method."),c=NAMESPACE_DEFAULT);for(var g,h=new SafeLocalStorage(f),i=h.length,j=0;j<i;j++)g=h.key(j),g&&g.slice(0,c.length)===c&&h.removeItem(g)}// ---------------------------------------------------
// Utility functions
function isArray(a){return"[object Array]"===Object.prototype.toString.call(a)}function isString(a){return"string"==typeof a}function isInteger(a){return"number"==typeof a&&isFinite(a)&&Math.floor(a)===a}function isObject(a){return null!==a&&"object"===_typeof(a)}// Removes ignored states from the main state object
function handleIgnoreStates(a,b){var c=Object.entries(b).reduce(function(c,d){var e=_slicedToArray(d,2),f=e[0],g=e[1];return-1===a.indexOf(f)&&(c[f]=b[f]),c},{});return c}