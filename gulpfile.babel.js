// VARIABLES

// npm packages
const gulp = require('gulp');
const args = require('yargs').argv;
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const cssnext = require('cssnext');
const del = require('del');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');

// configuration file (requiere and execute)
const config = require('./gulp.config')();

// implicit plugins
const gulpcssnext = require('gulp-cssnext');
const gulpautoprefixer = require('gulp-autoprefixer');

// plugin loader (gulp-eslint, gulp-util, gulp-print, gulp-if)
const $ = require('gulp-load-plugins')({lazy: true});

// FUNCTIONS

const log = (msg) => {
  if (typeof (msg) === 'object') {
    for (const item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
};

const clean = (path, done) => {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
};

// TASKS

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('clean-styles', (done) => {
  clean(config.stylesFolder + config.finalStyleFile, done);
});

gulp.task('clean-js', (done) => {
  clean(config.jsFolder + config.finalJSFile, done);
});

gulp.task('styles', ['clean-styles'], () => {
  log('Compiling Sass --> CSS');

  return gulp
    .src(config.styleFiles)
    .pipe($.plumber())
    .pipe(sass())
    .pipe(concat(config.finalStyleFile))
    .pipe($.autoprefixer(['last 2 version', '> 5%']))
    .pipe(gulp.dest(config.stylesFolder))
    .pipe(browserSync.stream());
});

gulp.task('js', ['clean-js'], () => {
  log('Combining + uglifying');

  return gulp
    .src(config.jsFiles)
    .pipe($.plumber())
    .pipe(concat(config.finalJSFile))
    .pipe(uglify())
    .pipe(gulp.dest(config.jsFolder))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['styles'], () => {
  log('Serving web application...');

  browserSync.init({
    server: './src/',
  });
  gulp.watch(config.stylesFolder + '**/*.scss', ['styles']);
  gulp.watch(config.sourceFolder + '**/*.js', ['js']);
  gulp.watch(config.sourceFolder + '**/*.html').on('change', browserSync.reload);
});

gulp.task('lint', () => {
  log('Analyzing source code with ESLint');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

// POSTCSS TEST TASKS

gulp.task('postcss', () => {
  const processors = [
    cssnext(),
    autoprefixer({browsers: ['last 2 version']}),
  ];

  log('Compiling styles with postcss');

  return gulp
    .src(config.css4)
    .pipe($.postcss(processors))
    .pipe(gulp.dest(config.temp));
});

gulp.task('plugins', () => {
  log('Compiling styles with plugins');

  return gulp
    .src(config.css4)
    .pipe(gulpcssnext())
    .pipe(gulpautoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest(config.temp));
});

gulp.task('lazy-plugins', () => {
  log('Compiling styles with lazy plugins');

  return gulp
    .src(config.css4)
    .pipe($.cssnext())
    .pipe($.autoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest(config.temp));
});
