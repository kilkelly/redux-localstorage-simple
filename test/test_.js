'use strict'

import { createStore, applyMiddleware, combineReducers } from 'redux'
import { fromJS, is } from 'immutable'
import { save, load, combineLoads, clear } from '../src/index' // redux-localstorage-simple dist
import equal from 'deep-equal'

const NAMESPACE_DEFAULT = 'redux_localstorage_simple'
const NAMESPACE_TEST = 'namespace_test'

// -------------------------------------------------------------------------------

// Actions
var APPEND = 'APPEND'
var ADD = 'ADD'
var MULTIPLY = 'MULTIPLY'
var NOOP = 'NOOP'

// -------------------------------------------------------------------------------

var initialStateReducerA = {
  x: 'abc'
}

var initialStateReducerB = {
  y: 1
}

var initialStateReducerImmutable = fromJS({
  z: 5
})

var initialStateReducers = {
  reducerA: initialStateReducerA,
  reducerB: initialStateReducerB
}

var initialStateReducersPlusImmutable = {
  reducerA: initialStateReducerA,
  reducerB: initialStateReducerB,
  reducerImmutable: initialStateReducerImmutable
}

// -------------------------------------------------------------------------------

var reducerA = function (state = initialStateReducerA, action) {
  switch (action.type) {
    case APPEND:
      return {
        x: state.x + 'x'
      }
    case NOOP:
      return state
    default:
      return state
  }
}

var reducerB = function (state = initialStateReducerB, action) {
  switch (action.type) {
    case ADD:
      return {
        y: state.y + 1
      }
    default:
      return state
  }
}

var reducerImmutable = function (state = initialStateReducerImmutable, action) {
  switch (action.type) {
    case MULTIPLY:
      return state.set('z', state.get('z') * 2)
    default:
      return state
  }
}

// -------------------------------------------------------------------------------
// TEST 0 - LocalStorage, are you there?
// -------------------------------------------------------------------------------

{
  if (typeof localStorage === 'object') {
    outputTestResult('test0', true)
  } else {
    outputTestResult('test0', false)
  }
}

// -------------------------------------------------------------------------------
// TEST 1 - Save and load entire Redux state tree
// -------------------------------------------------------------------------------
clearTestData()

{
  let middleware = save()

  // Store which saves to LocalStorage
  let storeA = applyMiddleware(middleware)(createStore)(
    combineReducers({ reducerA, reducerB }),
    initialStateReducers
  )

  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: NOOP })

  // Store which loads from LocalStorage
  let storeB = createStore(
    combineReducers({ reducerA, reducerB }),
    load()
  )

  let testResult = equal(
    storeA.getState(),
    storeB.getState()
  )

  outputTestResult('test1', testResult)
}

// -------------------------------------------------------------------------------
// TEST 2 - Save and load part of the Redux state tree
// -------------------------------------------------------------------------------
clearTestData()

{
  let middleware = save({ states: ['reducerA'] })

  // Store which saves to LocalStorage
  let storeA = applyMiddleware(middleware)(createStore)(
    combineReducers({ reducerA, reducerB }),
    initialStateReducers
  )

  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: APPEND })

  // Store which loads from LocalStorage
  let storeB = createStore(
    combineReducers({ reducerA, reducerB }),
    load({ states: ['reducerA'] })
  )

  let testResult = equal(
    storeA.getState(),
    storeB.getState()
  )

  outputTestResult('test2', testResult)
}

// -------------------------------------------------------------------------------
// TEST 3 - Save and load entire Redux state tree under a specified namespace
// -------------------------------------------------------------------------------
clearTestData()

{
  let middleware = save({ namespace: NAMESPACE_TEST })

  // Store which saves to LocalStorage
  let storeA = applyMiddleware(middleware)(createStore)(
    combineReducers({ reducerA, reducerB }),
    initialStateReducers
  )

  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: NOOP })

  // Store which loads from LocalStorage
  let storeB = createStore(
    combineReducers({ reducerA, reducerB }),
    load({ namespace: NAMESPACE_TEST })
  )

  let testResult = equal(
    storeA.getState(),
    storeB.getState()
  )

  outputTestResult('test3', testResult)
}

// -------------------------------------------------------------------------------
// TEST 4 - Save and load part of the Redux state tree under a specified namespace
// -------------------------------------------------------------------------------
clearTestData()

{
  let middleware = save({ states: ['reducerA'], namespace: NAMESPACE_TEST })

  // Store which saves to LocalStorage
  let storeA = applyMiddleware(middleware)(createStore)(
    combineReducers({ reducerA, reducerB }),
    initialStateReducers
  )

  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: APPEND })

  // Store which loads from LocalStorage
  let storeB = createStore(
    combineReducers({ reducerA, reducerB }),
    load({ states: ['reducerA'], namespace: NAMESPACE_TEST })
  )

  let testResult = equal(
    storeA.getState(),
    storeB.getState()
  )

  outputTestResult('test4', testResult)
}

// -------------------------------------------------------------------------------
// TEST 5 - Save and load Redux state tree containing an Immutable.js data structure
// -------------------------------------------------------------------------------
clearTestData()

{
  let middleware = save()

  // Store which saves to LocalStorage
  let storeA = applyMiddleware(middleware)(createStore)(
    reducerImmutable,
    initialStateReducerImmutable
  )

  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: MULTIPLY })

  // Store which loads from LocalStorage
  let storeB = createStore(
    reducerImmutable,
    load({ immutablejs: true })
  )

  // Using Immutable.js 'is' function to perform equality check
  let testResult = is(
    storeA.getState(),
    storeB.getState()
  )

  outputTestResult('test5', testResult)
}

// -------------------------------------------------------------------------------
// TEST 6 - Save and load entire Redux state tree containing both normal JavaScript objects
// and Immutable.js data structures
// -------------------------------------------------------------------------------
clearTestData()

{
  let middleware = save()

  // Store which saves to LocalStorage
  let storeA = applyMiddleware(middleware)(createStore)(
    combineReducers({ reducerA, reducerB, reducerImmutable }),
    initialStateReducersPlusImmutable
  )

  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: NOOP })

  // Store which loads from LocalStorage
  let storeB = createStore(
    combineReducers({ reducerA, reducerB, reducerImmutable }),
    combineLoads(
        load({ states: ['reducerA', 'reducerB'] }),
        load({ states: ['reducerImmutable'], immutablejs: true })
    )
  )

  let testResult = equal(storeA.getState()['reducerA'], storeB.getState()['reducerA']) &&
            equal(storeA.getState()['reducerB'], storeB.getState()['reducerB']) &&
            is(storeA.getState()['reducerImmutable'], storeB.getState()['reducerImmutable'])

  outputTestResult('test6', testResult)
}

// -------------------------------------------------------------------------------
// TEST 7 - Clear Redux state tree data saved without a specific namespace
// -------------------------------------------------------------------------------
clearTestData()

{
  // Store that saves without a namespace
  let storeA = applyMiddleware(save())(createStore)(reducerA, initialStateReducerA)
  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: NOOP })

  // Store that saves WITH a namespace
  let storeB = applyMiddleware(save({ namespace: NAMESPACE_TEST }))(createStore)(reducerA, initialStateReducerA)
  // Trigger a save to LocalStorage using a noop action
  storeB.dispatch({ type: NOOP })

  // Perform the LocalStorage clearing
  clear()

  outputTestResult('test7', true) // Default test result to true
  for (let key in localStorage) {
    // If data found with default namespace then clearing data has failed
    if (key.slice(0, NAMESPACE_DEFAULT.length) === NAMESPACE_DEFAULT) {
      // Fail the test
      outputTestResult('test7', false)
    }
  }
}

// -------------------------------------------------------------------------------
// TEST 8 - Clear Redux state tree data saved with a specific namespace
// -------------------------------------------------------------------------------
clearTestData()

{
  // Store that saves without a namespace
  let storeA = applyMiddleware(save())(createStore)(reducerA, initialStateReducerA)
  // Trigger a save to LocalStorage using a noop action
  storeA.dispatch({ type: NOOP })

  // Store that saves WITH a namespace
  let storeB = applyMiddleware(save({ namespace: NAMESPACE_TEST }))(createStore)(reducerA, initialStateReducerA)
  // Trigger a save to LocalStorage using a noop action
  storeB.dispatch({ type: NOOP })

  // Perform the LocalStorage clearing
  clear({ namespace: NAMESPACE_TEST })

  outputTestResult('test8', true) // Default test result to true
  for (let key in localStorage) {
    // If data found with specified namespace then clearing data has failed
    if (key.slice(0, NAMESPACE_TEST.length) === NAMESPACE_TEST) {
      // Fail the test
      outputTestResult('test8', false)
    }
  }
}

// -------------------------------------------------------------------------------

// Output result of test in browser
function outputTestResult (test, testResult) {
  document.getElementById(test).innerHTML = (testResult) ? 'SUCCESS' : 'FAILED'
  document.getElementById(test).className = (testResult) ? 'true' : 'false'
}

// Clear test data in LocalStorage
function clearTestData () {
  for (let key in localStorage) {
    if (key.slice(0, NAMESPACE_DEFAULT.length) === NAMESPACE_DEFAULT ||
        key.slice(0, NAMESPACE_TEST.length) === NAMESPACE_TEST) {
      localStorage.removeItem(key)
    }
  }
}
