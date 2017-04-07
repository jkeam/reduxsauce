import babel from 'rollup-plugin-babel'

export default {
  entry: 'lib/reduxsauce.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'stage-1']
    })
  ],
  external: ['ramda', 'ramdasauce'],
  dest: 'dist/reduxsauce.js'
}
