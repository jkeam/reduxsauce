import babel from 'rollup-plugin-babel'
import ramda from 'rollup-plugin-ramda'

export default {
  entry: 'lib/reduxsauce.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      // presets: ['es2015-rollup', 'stage-1']
      presets: ['stage-0']
    }),
    ramda(),
  ],
  dest: 'dist/reduxsauce.js'
}
