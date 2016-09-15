const gulp = require('gulp');
const gulpif = require('gulp-if');
const eslint = require('gulp-eslint');
const sequence = require('gulp-sequence');
const beeper = require('beeper');

const source = {
  js: ['*.js', 'lib/**/*.js', 'test/**/*.js'],
  lib: ['lib/**/*.js'],
  test: ['test/**/*.test.js']
};

gulp.task('lint', () => {
  return gulp.src(source.js)
    .pipe(eslint())
    .pipe(eslint.results((results) => {
      if (results.warningCount || results.errorCount) {
        beeper();
      }
    }))
    .pipe(eslint.format())
    .pipe(gulpif(gulp.seq.indexOf('watch') < 0, eslint.failAfterError()));
});

gulp.task('watch', ['default'], () => {
  gulp.watch(source.js, ['default']);
});

gulp.task('default', (done) => {
  sequence('lint', done);
});
