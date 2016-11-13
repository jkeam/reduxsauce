import { pipe, trim, split, without, map, fromPaires } from 'ramda'
import { isNilOrEmpty } from 'ramdasauce'

export default (types) => {
  if (isNilOrEmpty(types)) throw new Error('valid types are required')

  return pipe(
    trim,
    split(/\s/),
    map(pipe(trim)),
    without([null, '']),
    map((x) => [x, x]),
    fromPairs
  )(types)
}
