let gulp = require('gulp');
let notify = require('gulp-notify');
let source = require('vinyl-source-stream');
let browserify = require('browserify');
let babelify = require('babelify');
let ngAnnotate = require('browserify-ngannotate');
let browserSync = require('browser-sync').create();
let rename = require('gulp-rename');
let templateCache = require('gulp-angular-templatecache');
let uglify = require('gulp-uglify');
let merge = require('merge-stream');

// Where our files are located
let jsFiles = "src/js/**/*.js";
let viewFiles = "src/js/**/*.html";

let interceptErrors = function(error) {
    let args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %> # <%= error %>'
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};


gulp.task('browserify', ['views'], function() {
    return browserify('./src/js/app.js')
        .transform(babelify, { presets: ["es2015"] })
        .transform(ngAnnotate)
        .bundle()
        .on('error', interceptErrors)
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('main.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/'));
});

gulp.task('html', function() {
    return gulp.src("src/index.html")
        .on('error', interceptErrors)
        .pipe(gulp.dest('./build/'));
});

gulp.task('views', function() {
    return gulp.src(viewFiles)
        .pipe(templateCache({
            standalone: true
        }))
        .on('error', interceptErrors)
        .pipe(rename("app.templates.js"))
        .pipe(gulp.dest('./src/js/config/'));
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['html', 'browserify'], function() {
    let html = gulp.src("build/index.html")
        .pipe(gulp.dest('./dist/'));

    let js = gulp.src("build/main.js")
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

    return merge(html, js);
});

gulp.task('default', ['html', 'browserify'], function() {

    browserSync.init(['./build/**/**.**'], {
        server: "./build",
        port: 4000,
        notify: false,
        ui: {
            port: 4001
        }
    });

    gulp.watch("src/index.html", ['html']);
    gulp.watch(viewFiles, ['views']);
    gulp.watch(jsFiles, ['browserify']);
});