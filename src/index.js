"use strict"

import { fromJS } from "immutable"

const NAMESPACE = "redux_localstorage_simple"

/**
	Saves specified parts of the Redux state tree into localstorage
	Note: this is Redux middleware. Read this for an explanation:
	http://redux.js.org/docs/advanced/Middleware.html
	
	PARAMETERS
	----------
	@config (Object) - 	Contains configuration options (leave blank to save entire state tree to localstorage)		
						Properties of object:
							states (Array of Strings) - States to save e.g. ["user", "products"]						

	Usage example:
	
		save({
			states: ["user", "products"]
		}) 	
*/

export const save = (config = {}) => {
	
	const states = ("states" in config) ? config.states : [];		

	return store => next => action => {

		next(action)		

		if (states.length === 0) {

			localStorage[NAMESPACE] 
					= JSON.stringify(store.getState())	

		} else {

			states.forEach(state => { 				
				localStorage[NAMESPACE + "_" + state] 
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
						Properties of object:
							states (Array of Strings) - Parts of state tree to load e.g. ["user", "products"]
							immutablejs (Boolean) - If dealing with Immutable.js data structures, set this to true to load them correctly

	Usage examples:
	
		// load previously saved parts of state tree
		load({
			states: ["user", "products"]
		}) 	

		// load previously saved parts of state tree which use Immutable.js data structures
		load({
			states: ["user", "products"],
			immutablejs: true
		}) 			

*/

export function load(config = {}) {	

	const states = ("states" in config) ? config.states : [];
	const immutablejs = ("immutablejs" in config) ? config.immutablejs : false;	

	let loadedState = {}	

	if (states.length === 0) {

		// does default localstorage token exist?
		if (localStorage[NAMESPACE]) {
			loadedState = JSON.parse(localStorage[NAMESPACE])		

			if (immutablejs) {
				for(let key in loadedState) {
					loadedState[key] = fromJS(loadedState[key])
				}
			}

		}							

	} else {	

		states.forEach(function(state) {		

			if (localStorage[NAMESPACE + "_" + state]) {

				loadedState[state] = JSON.parse(localStorage[NAMESPACE + "_" + state])

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
	Note: only clears data which was saved using this module's functionality
*/

export function clear() {	

	for (let key in localStorage) {
		if (key.indexOf(NAMESPACE) === 0) {
			localStorage.removeItem(key)
		}
	}

}
