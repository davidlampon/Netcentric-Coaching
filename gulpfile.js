////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////

// npm packages
var gulp = require('gulp');
var args = require('yargs').argv;
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var del = require('del');

// configuration file (requiere and execute)
var config = require('./gulp.config')();

// plugin loader (gulp-eslint, gulp-util, gulp-print, gulp-if)
var $ = require('gulp-load-plugins')({lazy: true});

////////////////////////////////////////////////
// TASKS
////////////////////////////////////////////////

gulp.task('lint', function () {
  log('Analyzing source code with ESLint');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

gulp.task('css', function () {
  var processors = [
    cssnext(),
    autoprefixer({browsers: ['last 2 version']})
  ];

  log('Compiling styles with cssnext and postcss');

  return gulp
    .src(config.css4)
    // .pipe($.cssnext())
    .pipe($.postcss(processors))                            // postcss + autoprefixor
    // .pipe($.autoprefixer({browsers: ['last 2 version']}))   // gulp-autoprefixor
    .pipe(gulp.dest(config.tmp));
});

gulp.task('styles', function () {
  log('Compiling Sass --> CSS');

  return gulp
    .src(config.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer(['last 2 version', '> 5%']))
    .pipe(gulp.dest(config.tmp));
});

gulp.task('clean-styles', function (done) {
  var files = config.tmp + '**/*.css';
  clean(files, done);
});

gulp.task('sass-watcher', function () {
  gulp.watch([config.sass], ['styles']);
});

////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////

function clean (path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
}

function log (msg) {
  if(typeof(msg) === 'object') {
    for (var item in msg) {
      if(msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  }
  else {
    $.util.log($.util.colors.blue(msg));
  }
}
