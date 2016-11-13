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


var pathsConfig = function (appName) {
  // Relative paths function
  this.app = "./" + (appName || pjson.name);

  return {
    app: this.app,
    templates: this.app + '/templates',
    sass: this.app + '/static/sass',
    fonts: this.app + '/static/fonts',
    images: this.app + '/static/images',
    js: this.app + '/static/js',
    components: this.app + '/static/components',
    dist: {
      js: this.app + '/static/dist/js',
      css: this.app + '/static/dist/css',
      images: this.app + '/static/dist/images',
    }
  }
};

var sourcesConfig = function (paths) {
  return {
    js: [
      paths.components + '/jquery/dist/jquery.js',
      paths.components + '/uikit/js/uikit.js',
      paths.js + '/**/*.js'
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
  return del([paths.app + '/static/dist']);
});

// Styles autoprefixing and minification
gulp.task('styles', function() {
  return gulp.src(sources.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber()) // Checks for errors
    .pipe(autoprefixer({browsers: ['last 2 version']})) // Adds vendor prefixes
    .pipe(pixrem())  // add fallbacks for rem units
    .pipe(gulp.dest(paths.dist.css))
    .pipe(rename('app.min.css'))
    .pipe(cssnano()) // Minifies the result
    .pipe(gulp.dest(paths.dist.css));
});

// Javascript minification
gulp.task('scripts', function() {
  return gulp.src(sources.js)
    .pipe(plumber()) // Checks for errors
    .pipe(uglify()) // Minifies the js
    .pipe(gulp.dest(paths.dist.js))
    .pipe(concat('app.min.js')) // Concat files
    .pipe(gulp.dest(paths.dist.js));
});

// Image compression
gulp.task('images', function () {
  return gulp.src(sources.images)
    .pipe(imagemin()) // Compresses PNG, JPEG, GIF and SVG images
    .pipe(gulp.dest(paths.dist.images))
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
    [paths.dist.css + "/*.css", paths.dist.js + "*.js", paths.templates + '*.html'],
    {
      proxy:  "localhost:5000"
    }
  );
});

// Build and compile all files
gulp.task('build', function () {
  runSequence('clean', 'styles', 'scripts', 'images');
});

// Watch for file changes
gulp.task('watch', function () {
  gulp.watch(paths.sass + '/**/*.scss', ['styles']).on('change', reload);
  gulp.watch(paths.js + '/**/*.js', ['scripts']).on("change", reload);
  gulp.watch(paths.images + '/*', ['images']);
  gulp.watch(paths.templates + '/**/*.html').on("change", reload);
});

// Build all files, run the server, start BrowserSync and watch for file changes
gulp.task('default', function () {
  runSequence('build', 'runServer', 'browserSync', 'watch');
});

// Build all files, start BrowserSync and watch for file changes (use it when you want to start the server manually)
gulp.task('dev', function () {
  runSequence('build', 'browserSync', 'watch');
});
