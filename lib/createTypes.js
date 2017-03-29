import { pipe, trim, merge, split, without, map, fromPairs, anyPass, isNil, isEmpty } from 'ramda'

const isNilOrEmpty = anyPass([isNil, isEmpty]);

const defaultOptions = {
  prefix: ''
}

export default (types, options = {}) => {
  if (isNilOrEmpty(types)) throw new Error('valid types are required')

  const { prefix } = merge(defaultOptions, options)

  return pipe(
    trim,
    split(/\s/),
    map(pipe(trim)),
    without([null, '']),
    map((x) => [x, prefix + x]),
    fromPairs
  )(types)
}
