const gulp = require('gulp');
const iife = require('gulp-iife');
const inject = require('gulp-inject');
const watch = require('gulp-watch');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const browserSyncSpa = require('browser-sync-spa');
const del = require('del');
const path = require('path');

const ngHotReload = require('ng-hot-reload-standalone')({
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
  const bs = browserSync.create();

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

  const sourceFiles = [
    './gulp-example/app.module.js',
    './gulp-example/**/*.js',
    '!./gulp-example/protractor.config.js',
    '!./gulp-example/e2e/**/*',
    './gulp-example/**/*.html',
    './gulp-example/**/*.css',
  ];

  const allFiles = [
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
