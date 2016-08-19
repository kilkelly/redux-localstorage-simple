"use strict"

import { fromJS } from "immutable"

const NAMESPACE_DEFAULT = "redux_localstorage_simple"

/**
	Saves specified parts of the Redux state tree into localstorage
	Note: this is Redux middleware. Read this for an explanation:
	http://redux.js.org/docs/advanced/Middleware.html
	
	PARAMETERS
	----------
	@config (Object) - 	Contains configuration options (leave blank to save entire state tree to localstorage)		

						Properties:
							states (Array of Strings, optional) - States to save e.g. ["user", "products"]						
							namespace (String, optional) - Namespace to prepend your LocalStorage items

	Usage example:
	
		save({
			states: ["user", "products"],
			namespace: "my_cool_app"
		}) 	
*/

export function save({ states = [], namespace = NAMESPACE_DEFAULT } = {}) {	

	return store => next => action => {

		next(action)		

		if (states.length === 0) {

			localStorage[namespace] 
					= JSON.stringify(store.getState())	

		} else {

			states.forEach(state => { 				
				localStorage[namespace + "_" + state] 
					= JSON.stringify(store.getState()[state])
			})
		}	

	}	

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
	
		// load previously saved parts of state tree
		load({
			states: ["user", "products"]
		})

		// load previously saved parts of state tree which were initially saved under the namespace "my_cool_app"
		load({
			states: ["user", "products"],
			namespace: "my_cool_app"
		})		 	

		// load previously saved parts of state tree which use Immutable.js data structures
		load({
			states: ["user", "products"],
			immutablejs: true
		}) 			

*/

export function load({ states = [], immutablejs = false, namespace = NAMESPACE_DEFAULT } = {}) {	

	let loadedState = {}	

	if (states.length === 0) {

		// does default localstorage token exist?
		if (localStorage[namespace]) {
			loadedState = JSON.parse(localStorage[namespace])		

			if (immutablejs) {
				for(let key in loadedState) {
					loadedState[key] = fromJS(loadedState[key])
				}
			}

		}							

	} else {	

		states.forEach(function(state) {		

			if (localStorage[namespace + "_" + state]) {

				loadedState[state] = JSON.parse(localStorage[namespace + "_" + state])

			}		
		})

		if (immutablejs) {
			for(let key in loadedState) {
				loadedState[key] = fromJS(loadedState[key])
			}
		}		

	}		

	return loadedState
}

/**
	Combines multiple 'load' method calls to return a single state for use in Redux's createStore method.
	Use this when parts of the loading process need to be handled differently e.g. some parts of your state tree are immutable and some are not
		
	PARAMETERS
	----------		
	@loads - 'load' method calls passed into this method as normal arguments

	Usage example:

		combineLoads( 
			load({ states: ["user"] }), // loading normal object
			load({ states: ["products"], immutablejs: true ) // this part of the state tree is an Immutable.js structure
		)	
*/

export function combineLoads(...loads) {	

	let combinedLoad = {}

	loads.forEach(load => {
		for (let state in load) {
			combinedLoad[state] = load[state]
		}
	})

	return combinedLoad
}

/**
	Clears all Redux state tree data from LocalStorage
	Remember to provide a namespace if you used one during the save process

	PARAMETERS
	----------		
	@config (Object) - 	Contains configuration options (leave blank to clear entire state tree from LocalStorage, if it was saved without a namespace)
						Properties:
							namespace (String, optional) - Namespace that you used during the save proces

	Usage example:

		// clear all Redux state tree data saved without a namespace
		clear()

		// clear Redux state tree data saved with a namespace
		clear({
			namespace: "my_cool_app"
		})			
*/

export function clear({ namespace = NAMESPACE_DEFAULT } = {}) {	

	for (let key in localStorage) {		

		// key starts with namespace
		if (key.slice(0, namespace.length) === namespace) {
			localStorage.removeItem(key)
		}
	}

}
