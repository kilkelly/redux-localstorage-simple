# Redux-LocalStorage-Simple

Save and load Redux state to and from LocalStorage. Supports Immutable.js data structures.

## Installation
```sh
npm install --save redux-localstorage-simple
```

## Usage Example (ES6 code)

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

## API

### save([Object config])

Saving to LocalStorage is achieved using [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) and saves each time an action is handled by your reducer. You will need to pass the **save** method into Redux's **applyMiddleware** method, like so...

```sh
applyMiddleware(save())
```

See the Usage Example above to get a better idea of how this works.

#### Arguments
The **save** method takes a optional configuration object as an argument. It has the following properties:

```sh
{
    [Array states],
    [String namespace]
}
```

- states (Array, optional) - This is an optional array of strings specifying which parts of the Redux state tree you would like to save to LocalStorage. e.g. ["user", "products"]. Typically states have identical names to your Redux reducers. If you do not specify any states then your entire Redux state tree will be saved to LocalStorage.
- namespace (String, optional) - This is an optional string specifying the namespace to add to your LocalStorage items. For example if you have a part of your Redux state tree called "user" and you specify the namespace "my_cool_app", it will be saved to LocalStorage as "my_cool_app_user"

#### Examples

Save entire state tree - EASIEST OPTION.

```sh
save()
```

Save specific parts of the state tree.

```sh
save({ states: ["user", "products"] })
```

Save the entire state tree under the namespace "my_cool_app". The key "my_cool_app" will appear in LocalStorage.

```sh
save({ namespace: "my_cool_app" })
```

Save specific parts of the state tree with the namespace "my_cool_app". The keys "my_cool_app_user" and "my_cool_app_products" will appear in LocalStorage.

```sh
save({
    states: ["user", "products"],
    namespace: "my_cool_app"
})
```

### load([Object config])
Loading Redux state from LocalStorage happens during creation of the Redux store.

```sh
createStore(reducer, load())    
```

See the Usage Example above to get a better idea of how this works.

#### Arguments
The **load** method takes a optional configuration object as an argument. It has the following properties:

```sh
{
    [Array states],    
    [String namespace],
    [Boolean immutablejs]
}
```

- states (Array, optional) - This is an optional array of strings specifying which parts of the Redux state tree you would like to load from LocalStorage. e.g. ["user", "products"]. These parts of the state tree must have been previously saved using the **save** method. Typically states have identical names to your Redux reducers. If you do not specify any states then your entire Redux state tree will be loaded from LocalStorage.
- namespace (String, optional) - If you have saved your entire state tree or parts of your state tree with a namespace you will need to specify it in order to load it from LocalStorage.
- immutablejs (Boolean, optional) - If the parts of the state tree you are loading use [Immutable.js](https://facebook.github.io/immutable-js/) data structures set this property to true or else they won't be handled correctly.


#### Examples

Load entire state tree - EASIEST OPTION.

```sh
load()
```

Load specific parts of the state tree.

```sh
load({ states: ["user", "products"] })
```

Load the entire state tree which was previously saved with the namespace "my_cool_app".

```sh
load({ namespace: "my_cool_app" })
```

Load specific parts of the state tree which use Immutable.js data structures.

```sh
load({ 
    states: ["user", "products"],
    immutablejs: true
})
```

Load specific parts of the state tree which was previously saved with the namespace "my_cool_app".

```sh
load({ 
    states: ["user", "products"],
    namespace: "my_cool_app"
})
```

### combineLoads(...loads)
If your state tree is a mixture of vanilla JavaScript objects and Immutable.js data structures, or if you have used various different namespaces you can use **combineLoads** for a more intricate loading process.

#### Arguments
- loads - This method takes any number of **load** methods as arguments, with each load handling a different part of the state tree. This is best described by viewing the following examples...

#### Examples

Load both vanilla JavaScript and Immutable.js parts of the state tree.

```sh
combineLoads( 
    load({ states: ["user", "categories"] }),
    load({ states: ["products"], immutablejs: true })
)   
```

Load parts of the state tree saved with different namespaces.

```sh
combineLoads( 
    load({ states: ["user"], namespace: "account_stuff" }),
    load({ states: ["products", "categories"], namespace: "site_stuff" )
)   
```

### clear([Object config])

Clears all Redux state tree data from LocalStorage. Note: only clears data which was saved using this module's functionality

#### Arguments

The **clear** method takes a optional configuration object as an argument. It has the following properties:

```sh
{
    [String namespace]
}
```

- namespace - If you have saved your entire state tree or parts of your state tree under a namespace you will need to specify it in order to clear that data from LocalStorage.

#### Examples

Clear all Redux state tree data saved without a namespace.

```sh
clear()
```

Clear Redux state tree data saved with a namespace.

```sh
clear({
    namespace: "my_cool_app"
})  
```

## Feedback

Pull requests and opened issues are welcome!

## License

MIT