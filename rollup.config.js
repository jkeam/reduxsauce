import babel from 'rollup-plugin-babel'
import ramda from 'rollup-plugin-ramda'

export default {
  entry: 'lib/reduxsauce.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ['es2015', { modules: false }],
        'stage-0'
      ],
      plugins: ['external-helpers'],
    }),
    ramda(),
  ],
  dest: 'dist/reduxsauce.js'
}
