'use strict';

  var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'),
      csso = require('gulp-csso'),
  imagemin = require('gulp-imagemin'),
       del = require('del'),
    eslint = require('gulp-eslint'),
    useref = require('gulp-useref');

//---lints .js files and stops build on error
gulp.task('eslint', function () {
  return gulp.src(['/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

//---concatinates, minifies, creates source maps for .js files
gulp.task('scripts', ['eslint'], function() {
  return gulp.src('js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
});

//---compiles, minifies, creates source maps for sass files
gulp.task('styles', function () {
  return gulp.src('sass/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('all.min.css'))
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'));
});

//---optimizes images
gulp.task('images', function () {
  gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content'));
});

//---watches global.scss and javascript files for changes and runs tasks
gulp.task('watch', function () {
  gulp.watch('sass/global.scss', ['styles']);
  gulp.watch('js/**/*.js', ['scripts']);
});

//---clears out dist folder
gulp.task('clean', function () {
  del(['dist/*']);
});

//---build task that runs scripts, styles, and images tasks. Moves icons folder to dist directory
gulp.task('build', ['scripts', 'styles', 'images'], function () {
  gulp.src('icons/*')
  .pipe(gulp.dest('dist/icons'));
});


//---sets build as default gulp task and runs clean task prior to build
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});