# Redux-LocalStorage-Simple

Save and load Redux state to and from LocalStorage. Supports Immutable.js data structures.

### Installation
```sh
npm install --save redux-localstorage-simple
```
### Usage Example (ES6 code)
```sh
import { applyMiddleware, createStore } from "redux"
import reducer from "./reducer"

// Import the necessary methods for saving and loading
import { save, load } from "redux-localstorage-simple"

/*
    Saving to LocalStorage is achieved using Redux 
    middleware. The 'save' method is called by Redux 
    each time an action is handled by your reducer.
*/    
const createStoreWithMiddleware 
    = applyMiddleware(
        save() // Saving done here
    )(createStore)
    
/*
    Loading from LocalStorage happens during
    creation of the Redux store.
*/  
const store = createStoreWithMiddleware(
    reducer,    
    load() // Loading done here
)    
```

### API
.
#### save([object config])

Saving to LocalStorage is achieved using [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) and saves each time an action is handled by your reducer. You will need to pass the **save** method into Redux's **applyMiddleware** method, like so...
```sh
applyMiddleware(save())
```
See the Usage Example above to get a better idea of how this works.

##### Arguments
The **save** method takes a optional configuration object as an argument. It has the following properties:
```sh
{
    [Array states]
}
```
- states - This is an optional array of strings specifying which parts of the Redux state tree you would like to save to LocalStorage. e.g. ["user", "products"]. Typically states have identical names to your Redux reducers. If you do not specify any states then your entire Redux state tree will be saved to LocalStorage.

##### Examples

```sh
// save entire state tree
save()
```
```sh
// save specific parts of the state tree
save({ states: ["user", "products"] })
```
.
#### load([object config])
Loading Redux state from LocalStorage happens during creation of the Redux store.
```sh
createStore(reducer, load())    
```
See the Usage Example above to get a better idea of how this works.

##### Arguments
The **load** method takes a optional configuration object as an argument. It has the following properties:
```sh
{
    [Array states],
    [Boolean immutablejs]
}
```
- states (array of strings, optional) - This is an optional array of strings specifying which parts of the Redux state tree you would like to load from LocalStorage. e.g. ["user", "products"]. These parts of the state tree must have been previously saved using the **save** method. Typically states have identical names to your Redux reducers. If you do not specify any states then your entire Redux state tree will be loaded from LocalStorage.

- immutablejs (boolean, optional) - If the parts of the state tree you are loading use [Immutable.js](https://facebook.github.io/immutable-js/) data structures set this property to true or else they won't be handled correctly.


##### Examples

```sh
// load entire state tree
load()
```
```sh
// load specific parts of the state tree
load({ states: ["user", "products"] })
```
```sh
// load specific parts of the state tree which use Immutable.js data structures
load({ 
    states: ["user", "products"],
    immutablejs: true
})
```
.
#### combineLoads(...loads)
If your state tree is a mixture of vanilla JavaScript objects and Immutable.js data structures your can use **combineLoads** for a more intricate loading process.
##### Arguments
- loads - This method takes any number of **load** methods, with each load handling a different part of the state tree. This is best described by viewing the following examples...
##### Examples
```sh
// load both vanilla JavaScript and Immutable.js parts of the state tree from LocalStorage
combineLoads( 
    load({ states: ["user", "categories"] }),
    load({ states: ["products"], immutablejs: true )
)   
```
.
#### clear()
Clears all Redux state tree data from LocalStorage. Note: only clears data which was saved using this module's functionality
##### Examples
```sh
clear() 
```
### Feedback
Pull requests and opened issues are welcome!
### License
MIT