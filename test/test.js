/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // redux-localstorage-simple dist


	var _redux = __webpack_require__(2);

	var _index = __webpack_require__(24);

	var _deepEqual = __webpack_require__(28);

	var _deepEqual2 = _interopRequireDefault(_deepEqual);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var NAMESPACE_DEFAULT = 'redux_localstorage_simple';
	var NAMESPACE_TEST = 'namespace_test';
	var NAMESPACE_SEPARATOR_TEST = '**';

	// -------------------------------------------------------------------------------

	// Actions
	var APPEND = 'APPEND';
	var ADD = 'ADD';
	var MODIFY = 'MODIFY';
	var NOOP = 'NOOP';

	// -------------------------------------------------------------------------------

	var initialStateReducerA = {
	  x: 'abc'
	};

	var initialStateReducerB = {
	  y: 0
	};

	var initialStateReducerMultipleLevels = {
	  setting1: false,
	  setting2: false,
	  setting3: {
	    level1: {
	      level2: 'hello'
	    }
	  }
	};

	var initialStateReducers = {
	  reducerA: initialStateReducerA,
	  reducerB: initialStateReducerB
	};

	var initialStateReducersPlusMultipleLevels = {
	  reducerMultipleLevels: initialStateReducerMultipleLevels

	  // -------------------------------------------------------------------------------

	};var reducerA = function reducerA() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialStateReducerA;
	  var action = arguments[1];

	  switch (action.type) {
	    case APPEND:
	      return {
	        x: state.x + 'x'
	      };
	    case NOOP:
	      return state;
	    default:
	      return state;
	  }
	};

	var reducerB = function reducerB() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialStateReducerB;
	  var action = arguments[1];

	  switch (action.type) {
	    case ADD:
	      return {
	        y: state.y + 1
	      };
	    default:
	      return state;
	  }
	};

	var reducerMultipleLevels = function reducerMultipleLevels() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialStateReducerMultipleLevels;
	  var action = arguments[1];

	  switch (action.type) {
	    case MODIFY:
	      return {
	        setting1: true, // modified
	        setting2: false,
	        setting3: {
	          level1: {
	            level2: 'helloEdited' // modified
	          }
	        }
	      };
	    case NOOP:
	      return state;
	    default:
	      return state;
	  }
	};

	// -------------------------------------------------------------------------------
	// TEST 0 - LocalStorage, are you there?
	// -------------------------------------------------------------------------------

	{
	  if ((typeof localStorage === 'undefined' ? 'undefined' : _typeof(localStorage)) === 'object') {
	    outputTestResult('test0', true);
	  } else {
	    outputTestResult('test0', false);
	  }
	}

	// -------------------------------------------------------------------------------
	// TEST 1 - Save and load entire Redux state tree
	// -------------------------------------------------------------------------------
	clearTestData();

	{
	  var middleware = (0, _index.save)();

	  // Store which saves to LocalStorage
	  var storeA = (0, _redux.applyMiddleware)(middleware)(_redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), initialStateReducers);

	  // Trigger a save to LocalStorage using a noop action
	  storeA.dispatch({ type: NOOP });

	  // Store which loads from LocalStorage
	  var storeB = (0, _redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), (0, _index.load)());

	  var testResult = (0, _deepEqual2.default)(storeA.getState(), storeB.getState());

	  outputTestResult('test1', testResult);
	}

	// -------------------------------------------------------------------------------
	// TEST 2 - Save and load part of the Redux state tree
	// -------------------------------------------------------------------------------
	clearTestData();

	{
	  var _middleware = (0, _index.save)({ states: ['reducerA'] });

	  // Store which saves to LocalStorage
	  var _storeA = (0, _redux.applyMiddleware)(_middleware)(_redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), initialStateReducers);

	  // Trigger a save to LocalStorage using an append action
	  _storeA.dispatch({ type: APPEND });

	  // Store which loads from LocalStorage
	  var _storeB = (0, _redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), (0, _index.load)({ states: ['reducerA'] }));

	  var _testResult = (0, _deepEqual2.default)(_storeA.getState(), _storeB.getState());

	  outputTestResult('test2', _testResult);
	}

	// -------------------------------------------------------------------------------
	// TEST 3 - Save and load entire Redux state tree under a specified namespace
	// -------------------------------------------------------------------------------
	clearTestData();

	{
	  var _middleware2 = (0, _index.save)({ namespace: NAMESPACE_TEST });

	  // Store which saves to LocalStorage
	  var _storeA2 = (0, _redux.applyMiddleware)(_middleware2)(_redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), initialStateReducers);

	  // Trigger a save to LocalStorage using a noop action
	  _storeA2.dispatch({ type: NOOP });

	  // Store which loads from LocalStorage
	  var _storeB2 = (0, _redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), (0, _index.load)({ namespace: NAMESPACE_TEST }));

	  var _testResult2 = (0, _deepEqual2.default)(_storeA2.getState(), _storeB2.getState());

	  outputTestResult('test3', _testResult2);
	}

	// -------------------------------------------------------------------------------
	// TEST 4 - Save and load part of the Redux state tree under a specified namespace
	// -------------------------------------------------------------------------------
	clearTestData();

	{
	  var _middleware3 = (0, _index.save)({ states: ['reducerA'], namespace: NAMESPACE_TEST });

	  // Store which saves to LocalStorage
	  var _storeA3 = (0, _redux.applyMiddleware)(_middleware3)(_redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), initialStateReducers);

	  // Trigger a save to LocalStorage using an append action
	  _storeA3.dispatch({ type: APPEND });

	  // Store which loads from LocalStorage
	  var _storeB3 = (0, _redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), (0, _index.load)({ states: ['reducerA'], namespace: NAMESPACE_TEST }));

	  var _testResult3 = (0, _deepEqual2.default)(_storeA3.getState(), _storeB3.getState());

	  outputTestResult('test4', _testResult3);
	}

	// -------------------------------------------------------------------------------------------------
	// TEST 5 - Save and load entire Redux state tree under a specified namespace and namespaceSeparator
	// -------------------------------------------------------------------------------------------------
	clearTestData();

	{
	  var _middleware4 = (0, _index.save)({ namespace: NAMESPACE_TEST, namespaceSeparator: NAMESPACE_SEPARATOR_TEST });

	  // Store which saves to LocalStorage
	  var _storeA4 = (0, _redux.applyMiddleware)(_middleware4)(_redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), initialStateReducers);

	  // Trigger a save to LocalStorage using a noop action
	  _storeA4.dispatch({ type: NOOP });

	  // Store which loads from LocalStorage
	  var _storeB4 = (0, _redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), (0, _index.load)({ namespace: NAMESPACE_TEST, namespaceSeparator: NAMESPACE_SEPARATOR_TEST }));

	  var _testResult4 = (0, _deepEqual2.default)(_storeA4.getState(), _storeB4.getState());

	  outputTestResult('test5', _testResult4);
	}

	// ------------------------------------------------------------------------------------------------------
	// TEST 6 - Save and load part of the Redux state tree under a specified namespace and namespaceSeparator
	// ------------------------------------------------------------------------------------------------------
	clearTestData();

	{
	  var _middleware5 = (0, _index.save)({ states: ['reducerA'], namespace: NAMESPACE_TEST, namespaceSeparator: NAMESPACE_SEPARATOR_TEST });

	  // Store which saves to LocalStorage
	  var _storeA5 = (0, _redux.applyMiddleware)(_middleware5)(_redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), initialStateReducers);

	  // Trigger a save to LocalStorage using an append action
	  _storeA5.dispatch({ type: APPEND });

	  // Store which loads from LocalStorage
	  var _storeB5 = (0, _redux.createStore)((0, _redux.combineReducers)({ reducerA: reducerA, reducerB: reducerB }), (0, _index.load)({ states: ['reducerA'], namespace: NAMESPACE_TEST, namespaceSeparator: NAMESPACE_SEPARATOR_TEST }));

	  var _testResult5 = (0, _deepEqual2.default)(_storeA5.getState(), _storeB5.getState());

	  outputTestResult('test6', _testResult5);
	}

	// -------------------------------------------------------------------------------
	// TEST 7 - Clear Redux state tree data saved without a specific namespace
	// -------------------------------------------------------------------------------
	clearTestData();

	{
	  // Store that saves without a namespace
	  var _storeA6 = (0, _redux.applyMiddleware)((0, _index.save)())(_redux.createStore)(reducerA, initialStateReducerA);
	  // Trigger a save to LocalStorage using a noop action
	  _storeA6.dispatch({ type: NOOP });

	  // Store that saves WITH a namespace
	  var _storeB6 = (0, _redux.applyMiddleware)((0, _index.save)({ namespace: NAMESPACE_TEST }))(_redux.createStore)(reducerA, initialStateReducerA);
	  // Trigger a save to LocalStorage using a noop action
	  _storeB6.dispatch({ type: NOOP });

	  // Perform the LocalStorage clearing
	  (0, _index.clear)();

	  outputTestResult('test7', true); // Default test result to true
	  for (var key in localStorage) {
	    // If data found with default namespace then clearing data has failed
	    if (key.slice(0, NAMESPACE_DEFAULT.length) === NAMESPACE_DEFAULT) {
	      // Fail the test
	      outputTestResult('test7', false);
	    }
	  }
	}

	// -------------------------------------------------------------------------------
	// TEST 8 - Clear Redux state tree data saved with a specific namespace
	// -------------------------------------------------------------------------------
	clearTestData();

	{
	  // Store that saves without a namespace
	  var _storeA7 = (0, _redux.applyMiddleware)((0, _index.save)())(_redux.createStore)(reducerA, initialStateReducerA);
	  // Trigger a save to LocalStorage using a noop action
	  _storeA7.dispatch({ type: NOOP });

	  // Store that saves WITH a namespace
	  var _storeB7 = (0, _redux.applyMiddleware)((0, _index.save)({ namespace: NAMESPACE_TEST }))(_redux.createStore)(reducerA, initialStateReducerA);
	  // Trigger a save to LocalStorage using a noop action
	  _storeB7.dispatch({ type: NOOP });

	  // Perform the LocalStorage clearing
	  (0, _index.clear)({ namespace: NAMESPACE_TEST });

	  outputTestResult('test8', true); // Default test result to true
	  for (var _key in localStorage) {
	    // If data found with specified namespace then clearing data has failed
	    if (_key.slice(0, NAMESPACE_TEST.length) === NAMESPACE_TEST) {
	      // Fail the test
	      outputTestResult('test8', false);
	    }
	  }
	}

	// -------------------------------------------------------------------------------
	// TEST 9 - Save Redux state with debouncing
	// -------------------------------------------------------------------------------

	clearTestData();

	{
	  var debouncingPeriod = 500;

	  // Store that saves with a debouncing period
	  var _storeA8 = (0, _redux.applyMiddleware)((0, _index.save)({ debounce: debouncingPeriod }))(_redux.createStore)(reducerB, initialStateReducerB);
	  // Trigger a save to LocalStorage using an add action
	  _storeA8.dispatch({ type: ADD });

	  // Store which loads from LocalStorage
	  var _storeB8 = (0, _redux.createStore)(reducerB, (0, _index.load)());
	  // This test result should fail because the debouncing period has
	  // delayed the data being written to LocalStorage
	  var _testResult6 = _storeB8.getState()['y'] === 1;
	  outputTestResult('test9', _testResult6);

	  // This timeout will recheck LocalStorage after a period longer than
	  // our specified debouncing period. Therefore it will see the updated
	  // LocalStorage dataand the test should pass
	  setTimeout(function () {
	    // Store which loads from LocalStorage
	    var storeC = (0, _redux.createStore)(reducerB, (0, _index.load)());
	    var testResult = storeC.getState()['y'] === 1;
	    outputTestResult('test9', testResult);

	    // Perform the LocalStorage clearing
	    (0, _index.clear)();
	  }, debouncingPeriod + 200);
	}

	// -------------------------------------------------------------------------------
	// TEST 10 - Save and load specific properties of a <u>part</u> of Redux state tree under a specified <u>namespace</u>
	// -------------------------------------------------------------------------------
	clearTestData();

	{

	  var states = ['reducerMultipleLevels.setting1', 'reducerMultipleLevels.setting3.level1.level2'];

	  var _middleware6 = (0, _index.save)({ states: states, namespace: NAMESPACE_TEST });

	  // Store which saves to LocalStorage
	  var _storeA9 = (0, _redux.applyMiddleware)(_middleware6)(_redux.createStore)((0, _redux.combineReducers)({ reducerMultipleLevels: reducerMultipleLevels }), initialStateReducersPlusMultipleLevels);

	  _storeA9.dispatch({ type: MODIFY });

	  // Store which loads from LocalStorage
	  var _storeB9 = (0, _redux.createStore)((0, _redux.combineReducers)({ reducerMultipleLevels: reducerMultipleLevels }), (0, _index.load)({
	    states: states,
	    namespace: NAMESPACE_TEST,
	    preloadedState: initialStateReducersPlusMultipleLevels
	  }));

	  var _testResult7 = (0, _deepEqual2.default)(_storeA9.getState(), _storeB9.getState());

	  outputTestResult('test10', _testResult7);
	}

	// -------------------------------------------------------------------------------
	// TEST 11 - Save and load entire Redux state tree except the states we ignore
	// -------------------------------------------------------------------------------
	clearTestData();

	{

	  var initialState = {
	    z1: 0,
	    z2: 'z',
	    z3: 1
	  };

	  var successState = {
	    z2: 'z'
	  };

	  var reducer = function reducer() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	    var action = arguments[1];

	    switch (action.type) {
	      case NOOP:
	        return state;
	      default:
	        return state;
	    }
	  };

	  var _middleware7 = (0, _index.save)({ ignoreStates: ['z1', 'z3'] });

	  // Store which saves to LocalStorage
	  var _storeA10 = (0, _redux.applyMiddleware)(_middleware7)(_redux.createStore)(reducer);

	  // Trigger a save to LocalStorage using a noop action
	  _storeA10.dispatch({ type: NOOP });

	  // Store which loads from LocalStorage
	  var _storeB10 = (0, _redux.createStore)(reducer, (0, _index.load)());

	  var _testResult8 = (0, _deepEqual2.default)(successState, _storeB10.getState());

	  outputTestResult('test11', _testResult8);
	}

	// -------------------------------------------------------------------------------

	// Output result of test in browser
	function outputTestResult(test, testResult) {
	  document.getElementById(test).innerHTML = testResult ? 'SUCCESS' : 'FAILED';
	  document.getElementById(test).className = testResult ? 'true' : 'false';
	}

	// Clear test data in LocalStorage
	function clearTestData() {
	  for (var _key2 in localStorage) {
	    if (_key2.slice(0, NAMESPACE_DEFAULT.length) === NAMESPACE_DEFAULT || _key2.slice(0, NAMESPACE_TEST.length) === NAMESPACE_TEST) {
	      localStorage.removeItem(_key2);
	    }
	  }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

	var _createStore = __webpack_require__(4);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _combineReducers = __webpack_require__(19);

	var _combineReducers2 = _interopRequireDefault(_combineReducers);

	var _bindActionCreators = __webpack_require__(21);

	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

	var _applyMiddleware = __webpack_require__(22);

	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

	var _compose = __webpack_require__(23);

	var _compose2 = _interopRequireDefault(_compose);

	var _warning = __webpack_require__(20);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2['default'])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	exports.createStore = _createStore2['default'];
	exports.combineReducers = _combineReducers2['default'];
	exports.bindActionCreators = _bindActionCreators2['default'];
	exports.applyMiddleware = _applyMiddleware2['default'];
	exports.compose = _compose2['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports['default'] = createStore;

	var _isPlainObject = __webpack_require__(5);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _symbolObservable = __webpack_require__(15);

	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;

	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, preloadedState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!(0, _isPlainObject2['default'])(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[_symbolObservable2['default']] = function () {
	      return this;
	    }, _ref;
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(6),
	    getPrototype = __webpack_require__(12),
	    isObjectLike = __webpack_require__(14);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}

	module.exports = isPlainObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(7),
	    getRawTag = __webpack_require__(10),
	    objectToString = __webpack_require__(11);

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	module.exports = baseGetTag;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(8);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(9);

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	module.exports = root;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	module.exports = freeGlobal;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(7);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	module.exports = getRawTag;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	module.exports = objectToString;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(13);

	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);

	module.exports = getPrototype;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	module.exports = overArg;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ponyfill = __webpack_require__(18);

	var _ponyfill2 = _interopRequireDefault(_ponyfill);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var root; /* global window */


	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (true) {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = (0, _ponyfill2['default'])(root);
	exports['default'] = result;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(17)(module)))

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;

		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports['default'] = combineReducers;

	var _createStore = __webpack_require__(4);

	var _isPlainObject = __webpack_require__(5);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _warning = __webpack_require__(20);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!(0, _isPlainObject2['default'])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
	  });

	  unexpectedKeys.forEach(function (key) {
	    unexpectedKeyCache[key] = true;
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];

	    if (process.env.NODE_ENV !== 'production') {
	      if (typeof reducers[key] === 'undefined') {
	        (0, _warning2['default'])('No reducer provided for key "' + key + '"');
	      }
	    }

	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);

	  if (process.env.NODE_ENV !== 'production') {
	    var unexpectedKeyCache = {};
	  }

	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];

	    if (sanityError) {
	      throw sanityError;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
	      if (warningMessage) {
	        (0, _warning2['default'])(warningMessage);
	      }
	    }

	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}

	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }

	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = applyMiddleware;

	var _compose = __webpack_require__(23);

	var _compose2 = _interopRequireDefault(_compose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function (reducer, preloadedState, enhancer) {
	      var store = createStore(reducer, preloadedState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }

	  if (funcs.length === 1) {
	    return funcs[0];
	  }

	  var last = funcs[funcs.length - 1];
	  var rest = funcs.slice(0, -1);
	  return function () {
	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.save = save;
	exports.load = load;
	exports.combineLoads = combineLoads;
	exports.clear = clear;

	var _objectMerge = __webpack_require__(25);

	var _objectMerge2 = _interopRequireDefault(_objectMerge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var MODULE_NAME = '[Redux-LocalStorage-Simple]';
	var NAMESPACE_DEFAULT = 'redux_localstorage_simple';
	var NAMESPACE_SEPARATOR_DEFAULT = '_';
	var STATES_DEFAULT = [];
	var IGNORE_STATES_DEFAULT = [];
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

	function warnConsole(warningMessage) {
	  console.warn(MODULE_NAME, warningMessage);
	}

	function warnSilent(_warningMessage) {
	  // Empty
	}

	var warn = function warn(disableWarnings) {
	  return disableWarnings ? warnSilent : warnConsole;
	};

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
	// SafeLocalStorage wrapper to handle the minefield of exceptions
	// that localStorage can throw. JSON.parse() is handled here as well.

	function SafeLocalStorage(warnFn) {
	  this.warnFn = warnFn || warnConsole;
	}

	Object.defineProperty(SafeLocalStorage.prototype, 'length', {
	  get: function length() {
	    try {
	      return localStorage.length;
	    } catch (err) {
	      this.warnFn(err);
	    }
	    return 0;
	  },
	  configurable: true,
	  enumerable: true
	});

	SafeLocalStorage.prototype.key = function key(ind) {
	  try {
	    return localStorage.key(ind);
	  } catch (err) {
	    this.warnFn(err);
	  }
	  return null;
	};

	SafeLocalStorage.prototype.setItem = function setItem(key, val) {
	  try {
	    localStorage.setItem(key, JSON.stringify(val));
	  } catch (err) {
	    this.warnFn(err);
	  }
	};

	SafeLocalStorage.prototype.getItem = function getItem(key) {
	  try {
	    return JSON.parse(localStorage.getItem(key));
	  } catch (err) {
	    this.warnFn(err);
	  }
	  return null;
	};

	SafeLocalStorage.prototype.removeItem = function removeItem(key) {
	  try {
	    localStorage.removeItem(key);
	  } catch (err) {
	    this.warnFn(err);
	  }
	};

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
	      _ref$ignoreStates = _ref.ignoreStates,
	      ignoreStates = _ref$ignoreStates === undefined ? IGNORE_STATES_DEFAULT : _ref$ignoreStates,
	      _ref$namespace = _ref.namespace,
	      namespace = _ref$namespace === undefined ? NAMESPACE_DEFAULT : _ref$namespace,
	      _ref$namespaceSeparat = _ref.namespaceSeparator,
	      namespaceSeparator = _ref$namespaceSeparat === undefined ? NAMESPACE_SEPARATOR_DEFAULT : _ref$namespaceSeparat,
	      _ref$debounce = _ref.debounce,
	      debounce = _ref$debounce === undefined ? DEBOUNCE_DEFAULT : _ref$debounce,
	      _ref$disableWarnings = _ref.disableWarnings,
	      disableWarnings = _ref$disableWarnings === undefined ? DISABLE_WARNINGS_DEFAULT : _ref$disableWarnings;

	  return function (store) {
	    return function (next) {
	      return function (action) {
	        // Bake disableWarnings into the warn function
	        var warn_ = warn(disableWarnings);

	        var returnValue = next(action);
	        var state_ = void 0;

	        // Validate 'states' parameter
	        if (!isArray(states)) {
	          console.error(MODULE_NAME, "'states' parameter in 'save()' method was passed a non-array value. Setting default value instead. Check your 'save()' method.");
	          states = STATES_DEFAULT;
	        }

	        // Validate 'ignoreStates' parameter
	        if (!isArray(ignoreStates)) {
	          console.error(MODULE_NAME, "'ignoreStates' parameter in 'save()' method was passed a non-array value. Setting default value instead. Check your 'save()' method.");
	          ignoreStates = IGNORE_STATES_DEFAULT;
	        }

	        // Validate individual entries in'ignoreStates' parameter
	        if (ignoreStates.length > 0) {
	          ignoreStates = ignoreStates.filter(function (ignoreState) {
	            if (!isString(ignoreState)) {
	              console.error(MODULE_NAME, "'ignoreStates' array contains a non-string value. Ignoring this value. Check your 'ignoreStates' array.");
	            } else {
	              return ignoreState;
	            }
	          });
	        }

	        // Validate 'namespace' parameter
	        if (!isString(namespace)) {
	          console.error(MODULE_NAME, "'namespace' parameter in 'save()' method was passed a non-string value. Setting default value instead. Check your 'save()' method.");
	          namespace = NAMESPACE_DEFAULT;
	        }

	        // Validate 'namespaceSeparator' parameter
	        if (!isString(namespaceSeparator)) {
	          console.error(MODULE_NAME, "'namespaceSeparator' parameter in 'save()' method was passed a non-string value. Setting default value instead. Check your 'save()' method.");
	          namespaceSeparator = NAMESPACE_SEPARATOR_DEFAULT;
	        }

	        // Validate 'debounce' parameter
	        if (!isInteger(debounce)) {
	          console.error(MODULE_NAME, "'debounce' parameter in 'save()' method was passed a non-integer value. Setting default value instead. Check your 'save()' method.");
	          debounce = DEBOUNCE_DEFAULT;
	        }

	        // Check if there are states to ignore
	        if (ignoreStates.length > 0) {
	          state_ = handleIgnoreStates(ignoreStates, store.getState());
	        } else {
	          state_ = store.getState();
	        }

	        var storage = new SafeLocalStorage(warn_);

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
	            storage.setItem(namespace, state_);
	          } else {
	            states.forEach(function (state) {
	              var key = namespace + namespaceSeparator + state;
	              var stateForLocalStorage = getStateForLocalStorage(state, state_);
	              if (stateForLocalStorage) {
	                storage.setItem(key, stateForLocalStorage);
	              } else {
	                // Make sure nothing is ever saved for this incorrect state
	                storage.removeItem(key);
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
	      _ref2$namespaceSepara = _ref2.namespaceSeparator,
	      namespaceSeparator = _ref2$namespaceSepara === undefined ? NAMESPACE_SEPARATOR_DEFAULT : _ref2$namespaceSepara,
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

	  // Validate 'namespaceSeparator' parameter
	  if (!isString(namespaceSeparator)) {
	    console.error(MODULE_NAME, "'namespaceSeparator' parameter in 'load()' method was passed a non-string value. Setting default value instead. Check your 'load()' method.");
	    namespaceSeparator = NAMESPACE_SEPARATOR_DEFAULT;
	  }

	  // Display immmutablejs deprecation notice if developer tries to utilise it
	  if (immutablejs === true) {
	    warn_('Support for Immutable.js data structures has been deprecated as of version 2.0.0. Please use version 1.4.0 if you require this functionality.');
	  }

	  var storage = new SafeLocalStorage(warn_);

	  var loadedState = preloadedState;

	  // Load all of the namespaced Redux data from LocalStorage into local Redux state tree
	  if (states.length === 0) {
	    var val = storage.getItem(namespace);
	    if (val) {
	      loadedState = val;
	    }
	  } else {
	    // Load only specified states into the local Redux state tree
	    states.forEach(function (state) {
	      var key = namespace + namespaceSeparator + state;
	      var val = storage.getItem(key);
	      if (val) {
	        loadedState = (0, _objectMerge2.default)(loadedState, realiseObject(state, val));
	      } else {
	        warn_("Invalid load '" + key + "' provided. Check your 'states' in 'load()'. If this is your first time running this app you may see this message. To disable it in future use the 'disableWarnings' flag, see documentation.");
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
	      namespace = _ref3$namespace === undefined ? NAMESPACE_DEFAULT : _ref3$namespace,
	      _ref3$disableWarnings = _ref3.disableWarnings,
	      disableWarnings = _ref3$disableWarnings === undefined ? DISABLE_WARNINGS_DEFAULT : _ref3$disableWarnings;

	  // Bake disableWarnings into the warn function
	  var warn_ = warn(disableWarnings);

	  // Validate 'namespace' parameter
	  if (!isString(namespace)) {
	    console.error(MODULE_NAME, "'namespace' parameter in 'clear()' method was passed a non-string value. Setting default value instead. Check your 'clear()' method.");
	    namespace = NAMESPACE_DEFAULT;
	  }

	  var storage = new SafeLocalStorage(warn_);

	  var len = storage.length;
	  for (var ind = 0; ind < len; ind++) {
	    var key = storage.key(ind);

	    // key starts with namespace
	    if (key && key.slice(0, namespace.length) === namespace) {
	      storage.removeItem(key);
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

	// Removes ignored states from the main state object
	function handleIgnoreStates(ignoreStates, stateFull) {
	  var stateFullMinusIgnoreStates = Object.entries(stateFull).reduce(function (acc, _ref4) {
	    var _ref5 = _slicedToArray(_ref4, 2),
	        key = _ref5[0],
	        value = _ref5[1];

	    if (ignoreStates.indexOf(key) === -1) {
	      acc[key] = stateFull[key];
	    }
	    return acc;
	  }, {});
	  return stateFullMinusIgnoreStates;
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/*
	License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
	*/
	/*jslint
	    white: true,
	    vars: true,
	    node: true
	*/
	function ObjectMergeOptions(opts) {
	    'use strict';
	    opts = opts || {};
	    this.depth = opts.depth || false;
	    // circular ref check is true unless explicitly set to false
	    // ignore the jslint warning here, it's pointless.
	    this.throwOnCircularRef = 'throwOnCircularRef' in opts && opts.throwOnCircularRef === false ? false : true;
	}
	/*jslint unparam:true*/
	/**
	 * Creates a new options object suitable for use with objectMerge.
	 * @memberOf objectMerge
	 * @param {Object} [opts] An object specifying the options.
	 * @param {Object} [opts.depth = false] Specifies the depth to traverse objects
	 *  during merging. If this is set to false then there will be no depth limit.
	 * @param {Object} [opts.throwOnCircularRef = true] Set to false to suppress
	 *  errors on circular references.
	 * @returns {ObjectMergeOptions} Returns an instance of ObjectMergeOptions
	 *  to be used with objectMerge.
	 * @example
	 *  var opts = objectMerge.createOptions({
	 *      depth : 2,
	 *      throwOnCircularRef : false
	 *  });
	 *  var obj1 = {
	 *      a1 : {
	 *          a2 : {
	 *              a3 : {}
	 *          }
	 *      }
	 *  };
	 *  var obj2 = {
	 *      a1 : {
	 *          a2 : {
	 *              a3 : 'will not be in output'
	 *          },
	 *          a22 : {}
	 *      }
	 *  };
	 *  objectMerge(opts, obj1, obj2);
	 */
	function createOptions(opts) {
	    'use strict';
	    var argz = Array.prototype.slice.call(arguments, 0);
	    argz.unshift(null);
	    var F = ObjectMergeOptions.bind.apply(ObjectMergeOptions, argz);
	    return new F();
	}
	/*jslint unparam:false*/
	/**
	 * Merges JavaScript objects recursively without altering the objects merged.
	 * @namespace Merges JavaScript objects recursively without altering the objects merged.
	 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
	 * @param {ObjectMergeOptions} [opts] An options object created by 
	 *  objectMerge.createOptions. Options must be specified as the first argument
	 *  and must be an object created with createOptions or else the object will
	 *  not be recognized as an options object and will be merged instead.
	 * @param {Object} shadows [[shadows]...] One or more objects to merge. Each
	 *  argument given will be treated as an object to merge. Each object
	 *  overwrites the previous objects descendant properties if the property name
	 *  matches. If objects properties are objects they will be merged recursively
	 *  as well.
	 * @returns {Object} Returns a single merged object composed from clones of the
	 *  input objects.
	 * @example
	 *  var objectMerge = require('object-merge');
	 *  var x = {
	 *      a : 'a',
	 *      b : 'b',
	 *      c : {
	 *          d : 'd',
	 *          e : 'e',
	 *          f : {
	 *              g : 'g'
	 *          }
	 *      }
	 *  };
	 *  var y = {
	 *      a : '`a',
	 *      b : '`b',
	 *      c : {
	 *          d : '`d'
	 *      }
	 *  };
	 *  var z = {
	 *      a : {
	 *          b : '``b'
	 *      },
	 *      fun : function foo () {
	 *          return 'foo';
	 *      },
	 *      aps : Array.prototype.slice
	 *  };
	 *  var out = objectMerge(x, y, z);
	 *  // out.a will be {
	 *  //         b : '``b'
	 *  //     }
	 *  // out.b will be '`b'
	 *  // out.c will be {
	 *  //         d : '`d',
	 *  //         e : 'e',
	 *  //         f : {
	 *  //             g : 'g'
	 *  //         }
	 *  //     }
	 *  // out.fun will be a clone of z.fun
	 *  // out.aps will be equal to z.aps
	 */
	function objectMerge(shadows) {
	    'use strict';
	    var objectForeach = __webpack_require__(26);
	    var cloneFunction = __webpack_require__(27);
	    // this is the queue of visited objects / properties.
	    var visited = [];
	    // various merge options
	    var options = {};
	    // gets the sequential trailing objects from array.
	    function getShadowObjects(shadows) {
	        var out = shadows.reduce(function (collector, shadow) {
	                if (shadow instanceof Object) {
	                    collector.push(shadow);
	                } else {
	                    collector = [];
	                }
	                return collector;
	            }, []);
	        return out;
	    }
	    // gets either a new object of the proper type or the last primitive value
	    function getOutputObject(shadows) {
	        var out;
	        var lastShadow = shadows[shadows.length - 1];
	        if (lastShadow instanceof Array) {
	            out = [];
	        } else if (lastShadow instanceof Function) {
	            try {
	                out = cloneFunction(lastShadow);
	            } catch (e) {
	                throw new Error(e.message);
	            }
	        } else if (lastShadow instanceof Object) {
	            out = {};
	        } else {
	            // lastShadow is a primitive value;
	            out = lastShadow;
	        }
	        return out;
	    }
	    // checks for circular references
	    function circularReferenceCheck(shadows) {
	        // if any of the current objects to process exist in the queue
	        // then throw an error.
	        shadows.forEach(function (item) {
	            if (item instanceof Object && visited.indexOf(item) > -1) {
	                throw new Error('Circular reference error');
	            }
	        });
	        // if none of the current objects were in the queue
	        // then add references to the queue.
	        visited = visited.concat(shadows);
	    }
	    function objectMergeRecursor(shadows, currentDepth) {
	        if (options.depth !== false) {
	            currentDepth = currentDepth ? currentDepth + 1 : 1;
	        } else {
	            currentDepth = 0;
	        }
	        if (options.throwOnCircularRef === true) {
	            circularReferenceCheck(shadows);
	        }
	        var out = getOutputObject(shadows);
	        /*jslint unparam: true */
	        function shadowHandler(val, prop, shadow) {
	            if (out[prop]) {
	                out[prop] = objectMergeRecursor([
	                    out[prop],
	                    shadow[prop]
	                ], currentDepth);
	            } else {
	                out[prop] = objectMergeRecursor([shadow[prop]], currentDepth);
	            }
	        }
	        /*jslint unparam:false */
	        function shadowMerger(shadow) {
	            objectForeach(shadow, shadowHandler);
	        }
	        // short circuits case where output would be a primitive value
	        // anyway.
	        if (out instanceof Object && currentDepth <= options.depth) {
	            // only merges trailing objects since primitives would wipe out
	            // previous objects, as in merging {a:'a'}, 'a', and {b:'b'}
	            // would result in {b:'b'} so the first two arguments
	            // can be ignored completely.
	            var relevantShadows = getShadowObjects(shadows);
	            relevantShadows.forEach(shadowMerger);
	        }
	        return out;
	    }
	    // determines whether an options object was passed in and
	    // uses it if present
	    // ignore the jslint warning here too.
	    if (arguments[0] instanceof ObjectMergeOptions) {
	        options = arguments[0];
	        shadows = Array.prototype.slice.call(arguments, 1);
	    } else {
	        options = createOptions();
	        shadows = Array.prototype.slice.call(arguments, 0);
	    }
	    return objectMergeRecursor(shadows);
	}
	objectMerge.createOptions = createOptions;
	module.exports = objectMerge;

/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Executes a function on each of an objects own enumerable properties. The
	 *  callback function will receive three arguments: the value of the current
	 *  property, the name of the property, and the object being processed. This is
	 *  roughly equivalent to the signature for callbacks to
	 *  Array.prototype.forEach.
	 * @param {Object} obj The object to act on.
	 * @param {Function} callback The function to execute.
	 * @returns {Object} Returns the given object.
	 */
	function objectForeach(obj, callback) {
	    "use strict";
	    Object.keys(obj).forEach(function (prop) {
	        callback(obj[prop], prop, obj);
	    });
	    return obj;
	};
	module.exports = objectForeach;

/***/ },
/* 27 */
/***/ function(module, exports) {

	/*
	License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
	*/
	/*jslint
	    evil: true,
	    node: true
	*/
	'use strict';
	/**
	 * Clones non native JavaScript functions, or references native functions.
	 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
	 * @param {Function} func The function to clone.
	 * @returns {Function} Returns a clone of the non native function, or a
	 *  reference to the native function.
	 */
	function cloneFunction(func) {
	    var out, str;
	    try {
	        str = func.toString();
	        if (/\[native code\]/.test(str)) {
	            out = func;
	        } else {
	            out = eval('(function(){return ' + str + '}());');
	        }
	    } catch (e) {
	        throw new Error(e.message + '\r\n\r\n' + str);
	    }
	    return out;
	}
	module.exports = cloneFunction;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(29);
	var isArguments = __webpack_require__(30);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	}

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}


/***/ },
/* 29 */
/***/ function(module, exports) {

	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;

	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}


/***/ },
/* 30 */
/***/ function(module, exports) {

	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	};


/***/ }
/******/ ]);