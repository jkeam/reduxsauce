import { babel } from '@rollup/plugin-babel'
import ramda from 'rollup-plugin-ramda'
import filesize from 'rollup-plugin-filesize'

const ramdaFns = [
  'any',
  'equals',
  'reject',
  'isNil',
  'is',
  'has',
  'pipe',
  'trim',
  'merge',
  'split',
  'without',
  'map',
  'fromPairs',
  'anyPass',
  'isEmpty',
  'curry',
  'join',
  'keys',
  'mapObjIndexed',
  'replace',
  'toUpper',
  'pick',
  '__',
  'zipObj'
].map(fn => `ramda/src/${fn}`)

export default {
  input: 'lib/reduxsauce.js',
  plugins: [
    babel({
      babelHelpers: 'bundled',
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false }]]
    }),
    ramda(),
    filesize()
  ],
  external: [...ramdaFns],
  output: {
    file: 'dist/reduxsauce.js',
    format: 'cjs'
  }
}
