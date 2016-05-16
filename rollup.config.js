import babel from 'rollup-plugin-babel'

export default {
  entry: 'lib/reduxsauce.js',
  format: 'cjs',
  plugins: [babel()],
  dest: 'dist/reduxsauce.js'
}
