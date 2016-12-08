import R from 'ramda'
import RS from 'ramdasauce'

const defaultOptions = {
  prefix: ''
}

export default (types, options) => {
  if (RS.isNilOrEmpty(types)) throw new Error('valid types are required')

  const { prefix } = R.merge(defaultOptions, options)

  return R.pipe(
    R.trim,
    R.split(/\s/),
    R.map(R.pipe(R.trim)),
    R.without([null, '']),
    R.map((x) => [x, prefix + x]),
    R.fromPairs
  )(types)
}
