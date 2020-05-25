import createTypes from './createTypes'
import { is, isNil, isEmpty, join, keys, map, mapObjIndexed, merge, pick, pipe, replace, toUpper, zipObj } from 'ramda'

const defaultOptions = {
  prefix: ''
}

// matches each word in a camelCaseString (except the first)
// consecutive capitals are treated as one word
const RX_CAPS = /(?!^)([A-Z][a-z0-9]+|[A-Z][A-Z0-9]*(?=[A-Z]|\b))/g

// converts a camelCaseWord into a SCREAMING_SNAKE_CASE word
const camelToScreamingSnake = pipe(
  replace(RX_CAPS, '_$1'),
  toUpper
)

// build Action Types out of an object
const convertToTypes = (config, options) => {
  const opts = merge(defaultOptions, options)
  return pipe(
    keys, // just the keys
    map(camelToScreamingSnake), // CONVERT_THEM
    join(' '), // space separated
    types => createTypes(types, opts) // make them into Redux Types
  )(config)
}

// an action creator with additional properties
const createActionCreator = (name, extraPropNames, options) => {
  const { prefix } = merge(defaultOptions, options)
  // types are upcase and snakey
  const type = `${prefix}${camelToScreamingSnake(name)}`

  // do we need extra props for this?
  const noKeys = isNil(extraPropNames) || isEmpty(extraPropNames)

  // a type-only action creator
  if (noKeys) return () => ({ type })

  // an action creator with type + properties
  // "properties" is defined as an array of prop names
  if (is(Array, extraPropNames)) {
    return (...values) => {
      const extraProps = zipObj(extraPropNames, values)
      return { type, ...extraProps }
    }
  }

  // an action creator with type + properties
  // "properties" is defined as an object of {prop name: default value}
  if (is(Object, extraPropNames)) {
    const defaultProps = extraPropNames
    return (valueObject = {}) => {
      const providedProps = pick(Object.keys(defaultProps), valueObject)
      return { type, ...defaultProps, ...providedProps }
    }
  }

  throw new Error('action props must be a null/array/object/function')
}

// build Action Creators out of an object
const convertToCreators = (config, options) => mapObjIndexed((num, key, value) => {
  if (typeof value[key] === 'function') {
    // the user brought their own action creator
    return value[key]
  } else {
    // lets make an action creator for them!
    return createActionCreator(key, value[key], options)
  }
})(config)

export default (config, options) => {
  if (isNil(config)) {
    throw new Error('an object is required to setup types and creators')
  }
  if (isEmpty(config)) {
    throw new Error('empty objects are not supported')
  }

  return {
    Types: convertToTypes(config, options),
    Creators: convertToCreators(config, options)
  }
}
