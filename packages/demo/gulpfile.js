var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var del = require('del');
var concat = require('gulp-concat');
var iife = require('gulp-iife');

gulp.task('serve', ['clean'], function() {
    var bs = browserSync.create();

    bs.use(browserSyncSpa({}));
    bs.init({
        open: false,
        startPath: '/',
        server: {
            baseDir: '.',
            routes: {
                '/': './dist',
            },
            ghostMode: false,
        },
    });

    gulp.src([
        './node_modules/angular/angular.js',
        './gulp-example/app.module.js',
        './gulp-example/**/*.js',
    ])
    .pipe(iife())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return del([
        'dist',
    ]);
});
