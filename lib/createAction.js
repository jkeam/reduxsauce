import R from 'ramda'
import RS from 'ramdasauce'

/**
  Creates an action.
  @param {string} type - The type of action.
  @param {object} params - The rest of the properties of the action.
  @return {object} The assembled action object.
 */
export default (type, params = null) => {
  // sanity check type
  if (RS.isNilOrEmpty(type)) {
    throw new Error('Type is required when creating an action')
  }

  // sanity check params
  if (params && !R.is(Object, params)) {
    throw new Error('When passing params, it must be an object')
  }

  // prevents type from being overwritten
  if (params && R.has('type', params)) {
    throw new Error('`type` must not exist in the params')
  }

  return { type, ...params }
}
