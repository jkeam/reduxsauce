import { curry, is } from 'ramda'
/**
 * Allows your reducers to be reset.
 *
 * @param {string} typeToReset - The action type to listen for.
 * @param {function} originalReducer - The reducer to wrap.
 */
function resettableReducer (typeToReset, originalReducer) {
  // a valid type is required
  if (!is(String, typeToReset) || typeToReset === '') {
    throw new Error('A valid reset type is required.')
  }

  // an original reducer is required
  if (typeof originalReducer !== 'function') {
    throw new Error('A reducer is required.')
  }
  // run it through first to get what the default state should be
  const resetState = originalReducer(undefined, {})

  // create our own reducer that wraps the original one and hijacks the reset
  function reducer (state = resetState, action) {
    if (action && action.type === typeToReset) {
      return resetState
    } else {
      return originalReducer(state, action)
    }
  }
  return reducer
}

export default curry(resettableReducer)
