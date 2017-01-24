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
   connect = require('gulp-connect'),
    runsequence = require('run-sequence');

var paths = {
       js: 'js/**/*.js',
       scss: 'sass/**/*.scss',
       sass: 'sass/**/*.sass',
       icons: 'icons/*',
       images: 'images/*'
     };

var dist = {
       root: 'dist/*',
       styles: './dist/styles',
       scripts: './dist/scripts',
       icons: './dist/icons',
       content: './dist/content'
     };

//---lints .js files and stops build on error
gulp.task('eslint', function () {
  return gulp.src(['/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

//---concatinates, minifies, creates source maps for .js files
gulp.task('scripts', ['eslint'], function() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist.scripts))
    .pipe(connect.reload());
});

//---compiles, minifies, creates source maps for sass files
gulp.task('styles', function () {
  return gulp.src('sass/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('all.min.css'))
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist.styles))
    .pipe(connect.reload());
});

//---optimizes images
gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(dist.content));
});

//---watches global.scss and javascript files for changes and runs tasks
gulp.task('watch', function () {
  gulp.watch([paths.scss, paths.sass ], ['styles']);
  gulp.watch(paths.js, ['scripts']);
});

//---starts dev server with live reload on changes to .js , .scss , and .sass files
gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

//---reloads page on changes to .js , .scss , and .sass files
gulp.task('serve', ['watch', 'connect']);

//---clears out dist folder
gulp.task('clean', function () {
  del([dist.root]);
});

//---build task that runs scripts, styles, and images tasks. Moves icons folder to dist directory
gulp.task('build', function () {
  runsequence('clean','scripts', 'styles', 'images');
  gulp.src(paths.icons)
  .pipe(gulp.dest(dist.icons));
});

//---sets build as default gulp task and runs clean task prior to build
gulp.task('default', ['build'], function () {});