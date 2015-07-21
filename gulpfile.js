////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////

// npm packages
var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var del = require('del');

// configuration file (requiere and execute)
var config = require('./gulp.config')();

var port = config.defaultPort;

// implicit plugins
var gulpcssnext = require('gulp-cssnext');
var gulpautoprefixer = require('gulp-autoprefixer');

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

gulp.task('postcss', function () {
  var processors = [
    cssnext(),
    autoprefixer({browsers: ['last 2 version']})
  ];

  log('Compiling styles with postcss');

  return gulp
    .src(config.css4)
    .pipe($.postcss(processors))
    .pipe(gulp.dest(config.temp));
});

gulp.task('plugins', function () {
  log('Compiling styles with plugins');

  return gulp
    .src(config.css4)
    .pipe(gulpcssnext())
    .pipe(gulpautoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest(config.temp));
});

gulp.task('lazy-plugins', function () {
  log('Compiling styles with lazy plugins');

  return gulp
    .src(config.css4)
    .pipe($.cssnext())
    .pipe($.autoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest(config.temp));
});

gulp.task('sass', ['clean-styles'], function () {
  log('Compiling Sass --> CSS');

  return gulp
    .src(config.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer(['last 2 version', '> 5%']))
    .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function (done) {
  var files = config.temp + '**/*.css';
  clean(files, done);
});

gulp.task('sass-watcher', function () {
  gulp.watch([config.sass], ['styles']);
});

gulp.task('serve-dev', function () {
  var isDev = true;

  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };

  return $.nodemon(nodeOptions)
    .on('restart', ['lint'], function (ev) {
      log('*** nodemon restarted');
      log('files changed on restart:\n' + ev);
    })
    .on('start', function () {
      log('*** nodemon started');
      startBrowserSync();
    })
    .on('crash', function () {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function () {
      log('*** nodemon exited cleanly');
    });

});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './src/test'
    },
    files: ['./**/*.*'],
    ghostMode: {
      click: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 1000
  });
});

////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////

function startBrowserSync () {
  if(browserSync.active) {
    return;
  }

  log('Starting browser-sync on port ' + port);

  var options = {
    proxy : 'localhost:' + port,
    port: 3000,
    files: [config.client + '**/*.*'],
    ghostMode: {
      click: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 1000
  };

  browserSync(options);
}

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
