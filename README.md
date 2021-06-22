<img src='./_art/redux_sauce.png' align='left' />

[![npm module](https://badge.fury.io/js/reduxsauce.svg)](https://www.npmjs.org/package/reduxsauce)
[![Build Status](https://travis-ci.com/jkeam/reduxsauce.svg?branch=master)](https://travis-ci.com/jkeam/reduxsauce)
[![Coverage Status](https://coveralls.io/repos/github/jkeam/reduxsauce/badge.svg?branch=master)](https://coveralls.io/github/jkeam/reduxsauce?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# What's The Story?

Provides a few tools for working with Redux-based codebases.

**Currently includes:**

1. `createReducer` - declutter reducers for readability and testing
1. `createTypes` - DRY define your types object from a string
1. `createActions` - builds your Action Types and Action Creators at the same time
1. `resettableReducer` - allows your reducers to be reset

# createReducer

We're all familiar with the large switch statement and noise in our reducers, and because we all know this clutter, we can use `createReducer` to assume and clear it up!  There are a few patterns I've learned (and was taught), but let's break down the parts of a reducer first:

1. Determining the initial state.
1. Running
1. Knowing when to run.
1. Injecting into the global state tree

#### Initial State

Every reducer I've written has a known and expected state.  And it's always an object.

```js
const INITIAL_STATE = { name: null, age: null }
```

If you're using seamless-immutable, this just get's wrapped. This is optional.

```js
const INITIAL_STATE = Immutable({ name: null, age: null })
```

#### Running

A reducer is a function.  It has 2 inbound parameters and returns the new state.

```js
export const sayHello = (state = INITIAL_STATE, action) => {
  const { age, name } = action
  return { ...state, age, name }
}
```

Notice the `export`?  That's only needed if you would like to write some tests for your reducer.

#### Knowing When To Run

In Redux, all reducers fire in response to *any* action. It's up to the reducer to determine if it should run in response.  This is usually driven by a `switch` on `action.type`.

This works great until you start adding a bunch of code, so, I like to break out "routing" from "running" by registering reducers.

We can use a simple object registry to map action types to our reducer functions.

```js
import Types from './actionTypes'

export const HANDLERS = {
  [Types.SAY_HELLO]: sayHello,
  [Types.SAY_GOODBYE]: sayGoodbye
}
```

The `export` is only needed for testing.  It's optional.

#### Default handler

Sometimes you want to add a default handler to your reducers (such as delegating actions to sub reducers). To achieve that you can use `DEFAULT` action type in your configuration.

```js
import Types from './actionTypes'
import { Types as ReduxSauceTypes } from 'reduxsauce'

export const HANDLERS = {
  [Types.SAY_GOODBYE]: sayGoodbye,
  [ReduxSauceTypes.DEFAULT]: defaultHandler,
}
```

With code above `defaultHandler` will be invoked in case the action didn't match any type in the configuration.

#### Injecting Into The Global State Tree

I like to keep this in the root reducer.  Since reducers can't access other reducers (lies -- it can, but it's complicated), my preference is to not have the reducer file have an opinion.

I like to move that decision upstream.  Up to the root reducer where you use Redux's `combineReducers()`.

So, that brings us back to reduxsauce.  Here's how we handle exporting the reducer from our file:

```js
export default createReducer(INITIAL_STATE, HANDLERS)
```

That's it.


#### Complete Example

Here's a quick full example in action.

```js
// sampleReducer.js
import { createReducer } from 'reduxsauce'
import Types from './actionTypes'

// the initial state of this reducer
export const INITIAL_STATE = { error: false, goodies: null }

// the eagle has landed
export const success = (state = INITIAL_STATE, action) => {
  return { ...state, error: false, goodies: action.goodies }
}

// uh oh
export const failure = (state = INITIAL_STATE, action) => {
  return { ...state, error: true, goodies: null }
}

// map our action types to our reducer functions
export const HANDLERS = {
  [Types.GOODS_SUCCESS]: success,
  [Types.GOODS_FAILURE]: failure
}

export default createReducer(INITIAL_STATE, HANDLERS)
```

This becomes much more readable, testable, and manageable when your reducers start to grow in complexity or volume.

#  createTypes

Use `createTypes()` to create the object representing your action types.  It's whitespace friendly.

```js
// Types.js
import { createTypes } from 'reduxsauce'

export default createTypes(`
  LOGIN_REQUEST
  LOGIN_SUCCESS
  LOGIN_FAILURE

  CHANGE_PASSWORD_REQUEST
  CHANGE_PASSWORD_SUCCESS
  CHANGE_PASSWORD_FAILURE

  LOGOUT
`, { prefix: 'foo' })
```

The second parameter is optional.

```js
// Types.js - the 2nd parameter is optional
import { createTypes } from 'reduxsauce'

export default createTypes(`
  LOGIN_REQUEST
  LOGIN_SUCCESS
  LOGIN_FAILURE

  CHANGE_PASSWORD_REQUEST
  CHANGE_PASSWORD_SUCCESS
  CHANGE_PASSWORD_FAILURE

  LOGOUT
`)
```

### Options

 * `prefix`: prepend the string to all created types. This is handy if you're looking to namespace your actions.

# createActions

Use `createActions()` to build yourself an object which contains `Types` and `Creators`.

```js
import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: ['username'],
  loginFailure: ['error'],
  requestWithDefaultValues: { username: 'guest', password: null },
  logout: null,
  custom: (a, b) => ({ type: 'CUSTOM', total: a + b })
}, { prefix: 'foo' })
```

The second parameter is optional.

```js
// 2nd parameter is optional
import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: ['username'],
  loginFailure: ['error'],
  requestWithDefaultValues: { username: 'guest', password: null },
  logout: null,
  custom: (a, b) => ({ type: 'CUSTOM', total: a + b })
})
```

The keys of the object will become keys of the `Creators`.  They will also become the keys of the `Types` after being converted to SCREAMING_SNAKE_CASE.

The values will control the flavour of the action creator.  When null is passed, an action creator will be made that only has the type.  For example:

```js
Creators.logout() // { type: 'LOGOUT' }
```

By passing an array of items, these become the parameters of the creator and are attached to the action.

```js
Creators.loginRequest('steve', 'secret') // { type: 'LOGIN_REQUEST', username: 'steve', password: 'secret' }
```

By passing an object of `{ key: defaultValue }`, default values are applied.

In this case, invoke the action by putting all parameters into an object as the first argument.

```js
Creators.requestWithDefaultValues({
  password: '123456',
  undefinedKeyWontBeUsed: true
})
// { type: 'REQUEST_WITH_DEFAULT_VALUES', username: 'guest', password: '123456' }
```

### Options

 * `prefix`: prepend the string to all created types. This is handy if you're looking to namespace your actions.

# resettableReducer

Provides a "higher-order reducer" to help reset your state.  Instead of adding an additional reset command to your individual reducers, you can wrap them with this.

Check it out.

```js
import { resettableReducer } from 'reduxsauce'
import { combineReducers } from 'redux'

// some reducers you have already created
import firstReducer from './firstReducer'
import secondReducer from './secondReducer'
import thirdReducer from './thirdReducer'

// listen for the action type of 'RESET', you can change this.
const resettable = resettableReducer('RESET')

// reducers 1 & 3 will be resettable, but 2 won't.
export default combineReducers({
  first: resettable(firstReducer),
  second: secondReducer,
  third: resettable(thirdReducer)
})
```

# Changes
Note: `Latest` means the latest release.  This is also the latest version in [npmjs.com](https://www.npmjs.com/package/reduxsauce).

### Jun 22, 2021 - Latest
* `FIX` Update dependencies @jkeam
* `DOCS` Update readme @jkeam

### Jul 29, 2020 - 1.2.0

* `FIX` Update minor dependencies @jkeam
* `FIX` Handle numbers in action/type names @ahwatts
* `FIX` Allow creating an action without any overrides @jkeam

### Jun 01, 2020 - 1.1.3

* `FIX` Typescript definitions to fix createReducers @jkeam

### Jan 18, 2020 - 1.1.2

* `FIX` Typescript allow objects while creating actions @jkeam

### Oct 23, 2019 - 1.1.1

* `FIX` Upgrade dependencies @jkeam
* `FIX` Add more tests @jkeam
* `DOCS` Add badges @jkeam

### Apr 15, 2019 - 1.1.0
* `NEW` Generalize typedef @jkeam

### May 10, 2018 - 1.0.0 - 💃

* `NEW` drops redux dependency sinc we weren't using it @pewniak747

### September 26, 2017 - 0.7.0

* `NEW` Adds ability to have a default or fallback reducer for nesting reducers or catch-alls. @vaukalak
* `NEW` Adds default values to `createActions` if passed an object instead of an array or function. @zhang-z
* `DOCS` Fixes typos. @quajo

### July 10, 2017 - 0.6.0

* `NEW` Makes unbundled code available for all you tree-shakers out there. @skellock & @messense
* `FIX` Corrects issue with prefixed action names. @skellock
* `FIX` Upgrades dependencies. @messense

### April 7, 2017 - 0.5.0

* `NEW` adds `resettableReducer` for easier reducer uh... resetting. @skellock

### December 12, 2016 - 0.4.1

* `FIX` creators now get the `prefix` as well. @jbblanchet

### December 8, 2016 - 0.4.0

* `NEW` createActions and createTypes now take optional `options` object with `prefix` key. @jbblanchet & @skellock

### September 8, 2016 - 0.2.0

* `NEW` adds createActions for building your types & action creators. @gantman & @skellock

### May 17, 2016 - 0.1.0

* `NEW` adds createTypes for clean type object creation. @skellock

### May 17, 2016 - 0.0.3

* `DEL` removes the useless createAction function. @skellock

### May 17, 2016 - 0.0.2

* `FIX` removes the babel node from package.json as it was breaking stuff upstream. @skellock

### May 17, 2016 - 0.0.1

* `NEW` initial release. @skellock
