var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    util = require('gulp-util'),
    gulpprint = require('gulp-print'),
    gulpif = require('gulp-if'),
    args = require('yargs').argv;

gulp.task('lint', function () {
  log('Analyzing source code with ESLint');

  return gulp.src([
      '*.js'
      ])
      .pipe(gulpif(args.verbose, gulpprint()))
      //.pipe(gulpprint())
      // eslint() attaches the lint output to the eslint property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failOnError last.
      .pipe(eslint.failOnError());
});

gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful...
});

//////// LOG FUNCTION ////////

function log (msg) {
  if(typeof(msg) === 'object') {
    for (var item in msg) {
      if(msg.hasOwnProperty(item)) {
          util.log(util.colors.blue(msg[item]));
      }
    }
  }
  else {
   util.log(util.colors.blue(msg));
 }
}
