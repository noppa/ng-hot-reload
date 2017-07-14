var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var del = require('del');
var iife = require('gulp-iife');
var path = require('path');
var inject = require('gulp-inject');
var injectString = require('gulp-inject-string');
var ngHotReload = require('ng-hot-reload-standalone')({ start: false });
var fs = require('fs');

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

    var files = [
        './node_modules/angular/angular.js',
        './gulp-example/app.module.js',
        './gulp-example/**/*.js',
    ];

    gulp.src(files)
        .pipe(iife())
        .pipe(injectString.)
        .pipe(injectString.append(ngHotReload.client))
        .pipe(gulp.dest('./dist'));

    ngHotReload.start();

    gulp.src('./index.html')
        .pipe(inject(gulp.src(files, { read: false })))
        .pipe(gulp.dest('./dist'));

    return gulp.watch(files, function({ path }) {
        fs.readFile(path, 'utf8', function(err, file) {
            if (!err) {
                ngHotReload.reload({
                    path,
                    file,
                });
            }
        });
    });
});

gulp.task('clean', function() {
    return del([
        'dist',
    ]);
});
