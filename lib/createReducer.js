import { isNil, is, has, any, equals, keys } from 'ramda'
import { DEFAULT } from './Types'
/**
  Creates a reducer.
  @param {string} initialState - The initial state for this reducer.
  @param {object} handlers - Keys are action types (strings), values are reducers (functions).
  @return {object} A reducer object.
 */
export default (initialState, handlers) => {
  // initial state is required
  if (initialState === undefined) {
    throw new Error('initial state is required')
  }

  // handlers must be an object
  if (isNil(handlers) || !is(Object, handlers)) {
    throw new Error('handlers must be an object')
  }

  // handlers cannot have an undefined key
  if (any(equals('undefined'))(keys(handlers))) {
    throw new Error('handlers cannot have an undefined key')
  }

  // create the reducer function
  return (state = initialState, action = null) => {
    // wrong actions, just return state
    if (isNil(action)) return state
    if (!has('type', action)) return state

    // look for the handler
    const handler = handlers[action.type] || handlers[DEFAULT]

    // no handler no cry
    if (isNil(handler)) return state

    // execute the handler
    return handler(state, action)
  }
}
