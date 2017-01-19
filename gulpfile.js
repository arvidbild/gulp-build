'use strict';

    var gulp = require('gulp'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
        sass = require('gulp-sass'),
        csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
         del = require('del');

gulp.task('concatscripts', function() {
  return gulp.src('js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js'));
});

gulp.task('scripts', ['concatscripts'], function (){
  return gulp.src('js/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('compilesass', function () {
  return gulp.src('sass/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('sass'));
});

gulp.task('styles', ['compilesass'], function (){
  return gulp.src('css/all.css')
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('images', function () {
  gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content'));
});

gulp.task('clean', function () {
  del(['dist/*']);
});

gulp.task('build', ['scripts', 'images'], function () {
  gulp.src('icons/*')
  .pipe(gulp.dest('dist/icons'));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});