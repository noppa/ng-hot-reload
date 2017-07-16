var gulp = require('gulp');
var iife = require('gulp-iife');
var inject = require('gulp-inject');
var watch = require('gulp-watch');
var gulpIf = require('gulp-if');
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

gulp.task('serve', ['clean'], function() {
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
    './gulp-example/**/*.html',
  ];

  var allFiles = [
    './node_modules/angular/angular.js',
    './node_modules/ng-hot-reload-standalone/dist/client.js',
  ].concat(sourceFiles);

  // Move js files to dist folder
  gulp.src(allFiles)
    .pipe(gulpIf(isJsSourceFile, iife()))
    // Wrap js files with ng-hot-reload's initial wrapper
    .pipe(ngHotReload.stream({
      reload: false,
      includeClient: false,
    }))
    .pipe(gulp.dest('./dist'));

  // Inject to index.html
  gulp.src('./index.html')
    .pipe(inject(gulp.src(allFiles, {
      read: false,
    })))
    .pipe(gulp.dest('./dist'));

  ngHotReload.start();

  return watch(sourceFiles)
    .pipe(ngHotReload.stream({
      initial: false,
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function() {
  return del([
    'dist',
  ]);
});
