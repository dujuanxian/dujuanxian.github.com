var gulp = require('gulp');
var watch = require('gulp-watch');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-minify-html');

gulp.task('jekyll-build', function (done) {
    browserSync.notify('Building Jekyll');
    return require('child_process').spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync.init(null, {
        server: {
            baseDir: '_site'
        },
        host: "localhost"
    });
});

gulp.task('styles', function() {
    return sass('./css/main.scss', { style: 'expanded' })
        .pipe(plumber())
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCSS())
        .pipe(gulp.dest('css'))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function() {
    var opts = {comments:false, spare:false, quotes: false, empty: false};

    gulp.src('_site/posts/**/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('_site/posts/'))
});

gulp.task('watch', function() {
    gulp.watch('./_sass/*.scss', ['styles']);
    gulp.watch(['index.html', '_layouts/*.html', './_includes/*.html', '_posts/*'], ['jekyll-rebuild', 'html']);
    gulp.watch('./images/*.*', ['jekyll-rebuild']);
});

gulp.task('default', function() {
    gulp.start('styles', 'browser-sync', 'html', 'watch');
});