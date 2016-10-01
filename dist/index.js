"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.save = save;
exports.load = load;
exports.combineLoads = combineLoads;
exports.clear = clear;

var _immutable = require("immutable");

var NAMESPACE_DEFAULT = "redux_localstorage_simple";

var localStorageMock = {
	removeItem: function removeItem(key) {
		delete this[key];
	}
}

var localStorage = (typeof window === "undefined") ? localStorageMock : window.localStorage

// when running in a non-browser environment, for example during unit tests, then mock localStorage
if (typeof window === "undefined") {
	console.warn("LocalStorage not detected. Package 'redux-localstorage-simple' will mock it to prevent crashing.");
}

/**
	Saves specified parts of the Redux state tree into localstorage
	Note: this is Redux middleware. Read this for an explanation:
	http://redux.js.org/docs/advanced/Middleware.html
	
	PARAMETERS
	----------
	@config (Object) - 	Contains configuration options (leave blank to save entire state tree to localstorage)		

						Properties:
							states (Array of Strings, optional) - States to save e.g. ["user", "products"]						
							namespace (String, optional) - Namespace to add before your LocalStorage items

	Usage examples:

		// save entire state tree - EASIEST OPTION
		save()

		// save specific parts of the state tree
		save({ 
			states: ["user", "products"]
		})		

		// save the entire state tree under the namespace "my_cool_app". The key "my_cool_app" will appear in LocalStorage
		save({
			namespace: "my_cool_app"
		})
	
		// save specific parts of the state tree with the namespace "my_cool_app". The keys "my_cool_app_user" and "my_cool_app_products" will appear in LocalStorage
		save({
		    states: ["user", "products"],
		    namespace: "my_cool_app"
		})
*/

function save() {
	var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var _ref$states = _ref.states;
	var states = _ref$states === undefined ? [] : _ref$states;
	var _ref$namespace = _ref.namespace;
	var namespace = _ref$namespace === undefined ? NAMESPACE_DEFAULT : _ref$namespace;


	return function (store) {
		return function (next) {
			return function (action) {

				next(action);

				if (states.length === 0) {

					localStorage[namespace] = JSON.stringify(store.getState());
				} else {

					states.forEach(function (state) {
						localStorage[namespace + "_" + state] = JSON.stringify(store.getState()[state]);
					});
				}
			};
		};
	};
}

/**
	Loads specified states from localstorage into the Redux state tree. 
		
	PARAMETERS
	----------
	@config (Object) - 	Contains configuration options (leave blank to load entire state tree, if it was saved previously that is)
						Properties:
							states (Array of Strings, optional) - Parts of state tree to load e.g. ["user", "products"]
							namespace (String, optional) - Namespace required to retrieve your LocalStorage items, if any
							immutablejs (Boolean, optional) - If dealing with Immutable.js data structures, set this to true to load them correctly

	Usage examples:
			
		// load entire state tree - EASIEST OPTION
		load()

		// load specific parts of the state tree
		load({
			states: ["user", "products"]
		})

		// load the entire state tree which was previously saved with the namespace "my_cool_app"
		load({
			namespace: "my_cool_app"
		})

		// load specific parts of the state tree which use Immutable.js data structures
		load({ 
		    states: ["user", "products"],
		    immutablejs: true
		})

		// load specific parts of the state tree which was previously saved with the namespace "my_cool_app"
		load({ 
		    states: ["user", "products"],
		    namespace: "my_cool_app"
		})

*/

function load() {
	var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var _ref2$states = _ref2.states;
	var states = _ref2$states === undefined ? [] : _ref2$states;
	var _ref2$immutablejs = _ref2.immutablejs;
	var immutablejs = _ref2$immutablejs === undefined ? false : _ref2$immutablejs;
	var _ref2$namespace = _ref2.namespace;
	var namespace = _ref2$namespace === undefined ? NAMESPACE_DEFAULT : _ref2$namespace;


	var loadedState = {};

	if (states.length === 0) {

		if (localStorage[namespace]) {
			loadedState = JSON.parse(localStorage[namespace]);

			if (immutablejs) {
				for (var key in loadedState) {
					loadedState[key] = (0, _immutable.fromJS)(loadedState[key]);
				}
			}
		}
	} else {

		states.forEach(function (state) {

			if (localStorage[namespace + "_" + state]) {

				loadedState[state] = JSON.parse(localStorage[namespace + "_" + state]);
			}
		});

		if (immutablejs) {
			for (var _key in loadedState) {
				loadedState[_key] = (0, _immutable.fromJS)(loadedState[_key]);
			}
		}
	}

	return loadedState;
}

/**
	Combines multiple 'load' method calls to return a single state for use in Redux's createStore method.
	Use this when parts of the loading process need to be handled differently e.g. some parts of your state tree are immutable and some are not
		
	PARAMETERS
	----------		
	@loads - 'load' method calls passed into this method as normal arguments

	Usage example:

		// load both vanilla JavaScript and Immutable.js parts of the state tree from LocalStorage
		combineLoads( 
			load({ states: ["user"] }), // loading normal object
			load({ states: ["products"], immutablejs: true ) // this part of the state tree is an Immutable.js structure
		)	

		// Load parts of the state tree saved with different namespaces
		combineLoads( 
		    load({ states: ["user"], namespace: "account_stuff" }),
		    load({ states: ["products", "categories"], namespace: "site_stuff" )
		)   		
*/

function combineLoads() {

	var combinedLoad = {};

	for (var _len = arguments.length, loads = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
		loads[_key2] = arguments[_key2];
	}

	loads.forEach(function (load) {
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
	@config (Object) - 	Contains configuration options (leave blank to clear entire state tree from LocalStorage, if it was saved without a namespace)
						Properties:
							namespace (String, optional) - Namespace that you used during the save process

	Usage example:

		// clear all Redux state tree data saved without a namespace
		clear()

		// clear Redux state tree data saved with a namespace
		clear({
			namespace: "my_cool_app"
		})			
*/

function clear() {
	var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var _ref3$namespace = _ref3.namespace;
	var namespace = _ref3$namespace === undefined ? NAMESPACE_DEFAULT : _ref3$namespace;


	for (var key in localStorage) {

		// key starts with namespace
		if (key.slice(0, namespace.length) === namespace) {
			localStorage.removeItem(key);
		}
	}
}