'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

var config = {
    src           : './css/*.scss',
    dest          : './css'
};

//BUILD

// Clean
function clean() {
    return del(['dist']);
}

function copyfonts(done) {
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));

    done();
}

// Images
function images() {
    return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
}

function usemins() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
              css: [ rev() ],
              html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
              js: [ uglify(), rev() ],
              inlinejs: [ uglify() ],
              inlinecss: [ cleanCss(), 'concat' ]
          }))
      }))
      .pipe(gulp.dest('dist/'));
}
  
  gulp.task('build', gulp.series(clean, copyfonts, images, usemins));

////////   END BUILD ///////
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
    