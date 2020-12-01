'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');

var config = {
    src           : './css/*.scss',
    dest          : './css'
};

        // browser-sync
function server() {
    const files = [
        './*.html',
        './css/*.css',
        './img/*.{png,jpg,gif}',
        './js/*.js'
        ];

    const syncConfig = {
        server: {
            baseDir : './'
        }
    };

    browserSync.init(files, syncConfig);
}

function scssTask(){    
    return gulp.src(config.src)
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest(config.dest));
}

function watch(done) {
    // CSS changes
    gulp.watch(config.src, gulp.series(scssTask));
    done();
}

    /**************** default task ****************/

exports.default = gulp.series(scssTask, watch, server);
    