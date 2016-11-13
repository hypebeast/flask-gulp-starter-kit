// Plugins
var gulp = require('gulp');
var pjson = require('./package.json');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var plumber = require('gulp-plumber');
var pixrem = require('gulp-pixrem');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var exec = require('child_process').exec;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


// Relative paths function
var pathsConfig = function (appName) {
  this.app = "./" + (appName || pjson.name);

  return {
    app: this.app,
    templates: this.app + '/templates',
    sass: this.app + '/static/sass',
    fonts: this.app + '/static/fonts',
    images: this.app + '/static/images',
    js: this.app + '/static/js',
    components: this.app + '/static/components',
    build: {
      js: this.app + '/static/build/js',
      css: this.app + '/static/build/css',
      images: this.app + '/static/build/images',
    }
  }
};

var sourcesConfig = function (paths) {
  return {
    js: [
      paths.components + '/jquery/dist/jquery.js',
      paths.components + '/uikit/js/uikit.js',
      paths.js + '/project.js'
    ],
    sass: [
      paths.sass + '/*.scss'
    ],
    images: [
      paths.images + '/*'
    ],
    fonts: []
  }
};

var paths = pathsConfig();
var sources = sourcesConfig(paths);

////////////////////////////////
// Tasks
////////////////////////////////

// Clean task
gulp.task('clean', function () {
  return del([paths.app + '/static/build']);
});

// Styles autoprefixing and minification
gulp.task('styles', function() {
  return gulp.src(sources.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber()) // Checks for errors
    .pipe(autoprefixer({browsers: ['last 2 version']})) // Adds vendor prefixes
    .pipe(pixrem())  // add fallbacks for rem units
    .pipe(gulp.dest(paths.build.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano()) // Minifies the result
    .pipe(gulp.dest(paths.build.css));
});

// Javascript minification
gulp.task('scripts', function() {
  return gulp.src(sources.js)
    .pipe(plumber()) // Checks for errors
    .pipe(uglify()) // Minifies the js
    .pipe(gulp.dest(paths.build.js))
    .pipe(concat('app.min.js')) // Concat files
    .pipe(gulp.dest(paths.build.js));
});

// Image compression
gulp.task('images', function () {
  return gulp.src(sources.images)
    .pipe(imagemin()) // Compresses PNG, JPEG, GIF and SVG images
    .pipe(gulp.dest(paths.build.images))
});

// Run Flask server
gulp.task('runServer', function () {
  exec('flask run', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// Browser sync server for live reload
gulp.task('browserSync', function () {
    browserSync.init(
      [paths.css + "/*.css", paths.js + "*.js", paths.templates + '*.html'], {
        proxy:  "localhost:5000"
    });
});

// Default task
gulp.task('default', function () {
    runSequence(['clean', 'styles', 'scripts', 'images'], 'runServer', 'browserSync');
});

// Build task
gulp.task('build', function () {
  runSequence('clean', 'styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', ['default'], function () {

  gulp.watch(paths.sass + '/**/*.scss', ['styles']);
  gulp.watch(paths.js + '/*.js', ['scripts']).on("change", reload);
  gulp.watch(paths.images + '/*', ['images']);
  gulp.watch(paths.templates + '/**/*.html').on("change", reload);

});
