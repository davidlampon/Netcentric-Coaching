// npm packages
var gulp = require('gulp');
var args = require('yargs').argv;
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');

// configuration file (requiere and execute)
var config = require('./gulp.config')();

// plugin loader (gulp-eslint, gulp-util, gulp-print, gulp-if)
var $ = require('gulp-load-plugins')({lazy: true});

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
    .src(config.postcss)
    // .pipe($.cssnext())
    .pipe($.postcss(processors))                            // postcss + autoprefixor
    // .pipe($.autoprefixer({browsers: ['last 2 version']}))   // gulp-autoprefixor
    .pipe(gulp.dest(config.tmp));
});

//////////

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
