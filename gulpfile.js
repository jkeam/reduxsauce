const gulp = require('gulp')
const babel = require('gulp-babel')
const rollup = require('gulp-rollup')

gulp.task('build', () => {
  return gulp.src('lib/reduxsauce.js')
    .pipe(rollup({}))
    .pipe(babel({
      presets: ['es2015', 'stage-0'],
      plugins: ['transform-object-rest-spread']
    }))
    .pipe(gulp.dest('./dist'))
})
