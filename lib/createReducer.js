import R from 'ramda'

/**
  Creates a reducer.
  @param {string} initialState - The initial state for this reducer.
  @param {object} handlers - Keys are action types (strings), values are reducers (functions).
  @return {object} A reducer object.
 */
export default (initialState, handlers) => {
  // initial state is required
  if (R.isNil(initialState)) {
    throw new Error('initial state is required')
  }

  // handlers must be an object
  if (R.isNil(handlers) || !R.is(Object, handlers)) {
    throw new Error('handlers must be an object')
  }

  // handlers cannot have an undefined key
  if (R.any(R.equals('undefined'))(R.keys(handlers))) {
    throw new Error('handlers cannot have an undefined key')
  }

  // create the reducer function
  return (state = initialState, action) => {
    // wrong actions, just return state
    if (R.isNil(action)) return state
    if (!R.has('type', action)) return state

    // look for the handler
    const handler = handlers[action.type]

    // no handler no cry
    if (R.isNil(handler)) return state

    // execute the handler
    return handler(state, action)
  }
}
