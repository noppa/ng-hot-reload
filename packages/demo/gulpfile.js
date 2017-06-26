var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var del = require('del');
var concat = require('gulp-concat');
var iife = require('gulp-iife');
var path = require('path');

gulp.task('serve', ['build'], function() {
    var bs = browserSync.create();

    bs.use(browserSyncSpa({}));
    bs.use({
        'plugin:name': 'reload-test',
        'hooks': {
            'client:js': (...args) =>
                console.log('HOOK', args),
        },
    });
    bs.init({
        open: false,
        startPath: '/',
        server: {
            baseDir: __dirname,
            routes: {
                '/': path.join(__dirname, 'dist'),
            },
            ghostMode: false,
        },
    });

    gulp.watch([
        './gulp-example/**/*.js',
    ], function(event) {
        console.log('update', Object.keys(event));
        bs.reload(event.path);
    });
});

gulp.task('build', ['clean'], function() {
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
