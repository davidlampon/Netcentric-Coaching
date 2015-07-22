// VARIABLES

// npm packages
const gulp = require('gulp');
const args = require('yargs').argv;
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const cssnext = require('cssnext');
const del = require('del');

// configuration file (requiere and execute)
const config = require('./gulp.config')();

const port = config.defaultPort;

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

const startBrowserSync = () => {
  if (browserSync.active) {
    return;
  }

  log('Starting browser-sync on port ' + port);

  const options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: [config.client + '**/*.*'],
    ghostMode: {
      click: true,
      location: false,
      forms: true,
      scroll: true,
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 1000,
  };

  browserSync(options);
};

const clean = (path, done) => {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
};

// TASKS

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('lint', () => {
  log('Analyzing source code with ESLint');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

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

gulp.task('sass', ['clean-styles'], () => {
  log('Compiling Sass --> CSS');

  return gulp
    .src(config.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer(['last 2 version', '> 5%']))
    .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', (done) => {
  const files = config.temp + '**/*.css';
  clean(files, done);
});

gulp.task('sass-watcher', () => {
  gulp.watch([config.sass], ['styles']);
});

gulp.task('serve-dev', () => {
  const isDev = true;

  const nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build',
    },
    watch: [config.server],
  };

  return $.nodemon(nodeOptions)
    .on('restart', ['lint'], (ev) => {
      log('*** nodemon restarted');
      log('files changed on restart:\n' + ev);
    })
    .on('start', () => {
      log('*** nodemon started');
      startBrowserSync();
    })
    .on('crash', () => {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', () => {
      log('*** nodemon exited cleanly');
    });
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './src/test',
    },
    files: ['./**/*.*'],
    ghostMode: {
      click: true,
      location: false,
      forms: true,
      scroll: true,
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 1000,
  });
});
