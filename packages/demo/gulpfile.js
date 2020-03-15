var gulp = require('gulp');
var iife = require('gulp-iife');
var inject = require('gulp-inject');
var watch = require('gulp-watch');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var del = require('del');
var path = require('path');

var ngHotReload = require('ng-hot-reload-standalone')({
  start: false,
});

function isJsSourceFile(file) {
  return /\.js$/.test(file.path) && !/node_modules/.test(file.path);
}

gulp.task('clean', function() {
  return del([
    'dist',
  ]);
});

gulp.task('serve', gulp.series('clean', function() {
  var bs = browserSync.create();

  bs.use(browserSyncSpa({}));
  bs.init({
    open: false,
    port: 8080,
    startPath: '/',
    server: {
      baseDir: path.join(__dirname, 'dist'),
      index: path.join(__dirname, 'dist', 'index.html'),
      routes: {
        '/gulp-example': 'dist',
        '/node_modules': 'node_modules',
      },
      ghostMode: false,
    },
  });

  var sourceFiles = [
    './gulp-example/app.module.js',
    './gulp-example/**/*.js',
    '!./gulp-example/protractor.config.js',
    '!./gulp-example/e2e/**/*',
    './gulp-example/**/*.html',
    './gulp-example/**/*.css',
  ];

  var allFiles = [
    './node_modules/angular/angular.js',
    './node_modules/angular-ui-router/release/angular-ui-router.js',
    './node_modules/angular-animate/angular-animate.js',
    './node_modules/ng-hot-reload-standalone/dist/client.js',
  ].concat(sourceFiles);

  // Move js files to dist folder.
  gulp.src(allFiles)
      .pipe(sourcemaps.init())
      .pipe(gulpIf(isJsSourceFile, iife()))
  // Wrap js files with ng-hot-reload's initial wrapper.
      .pipe(ngHotReload.stream({
        includeClient: false,
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist'));

  // Inject source file paths to index.html using gulp-inject plugin.
  gulp.src('./index.html')
      .pipe(inject(gulp.src(allFiles, {
        read: false,
      })))
      .pipe(gulp.dest('./dist'));

  ngHotReload.start();

  // Watch changes to the source files, pipe through `ngHotReload.stream`
  // and then to "dist" folder.
  return watch(sourceFiles)
      .pipe(ngHotReload.stream({
        includeClient: false,
      }))
      .pipe(gulp.dest('./dist'));
}));
