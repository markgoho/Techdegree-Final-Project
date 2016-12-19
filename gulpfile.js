'use strict';

var gulp        = require('gulp'),
	concat		= require('gulp-concat'),
	uglify      = require('gulp-uglify'),
	rename      = require('gulp-rename'),
	sass        = require('gulp-sass'),
    maps        = require('gulp-sourcemaps'),
    autoprefix	= require('gulp-autoprefixer'),
    del 		= require('del'),
	pug			= require('gulp-pug'),
    browserSync = require('browser-sync').create(),
    reload		= browserSync.reload;

gulp.task("concatScripts", function() {
	return gulp.src([
			 'node_modules/jquery/dist/jquery.js',
			 'js/main.js'
		   ])
		   .pipe(maps.init())
		   .pipe(concat('app.js'))
		   .pipe(maps.write('./'))
		   .pipe(gulp.dest('js'));
});

gulp.task("minifyScripts", function() {
	return gulp.src("js/app.js")
			   .pipe(uglify())
		       .pipe(rename('app.min.js'))
		       .pipe(gulp.dest('js'));
});

// Take style.scss and compile to css, also create a map file
gulp.task("compileSass", function() {
	return gulp.src("stylesheets/main.scss")
			   .pipe(maps.init())
			   .pipe(sass().on('error', sass.logError))
			   .pipe(autoprefix())
			   .pipe(maps.write('./'))
			   .pipe(gulp.dest('css'))
			   .pipe(browserSync.stream());
});

gulp.task("watchJS", ['concatScripts'], function(done) {
	reload();
	done();
});

gulp.task('clean', function() {
	del(['dist', 'css/main.css*', 'js/app*.js*'])
});

gulp.task("deploy", ['concatScripts', 'minifyScripts', 'compileSass'], function() {
	return gulp.src(['css/main.css', 'js/app.min.js', 'index.html', 'img/**', 'fonts/**'], { base: './'})
			   .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['concatScripts', 'compileSass', 'pug'], function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	gulp.watch('stylesheets/**/*.scss', ['compileSass']);
	gulp.watch('js/main.js', ['watchJS']);
	gulp.watch('src/templates/*.pug', ['pug']);
	gulp.watch('*.html').on('change', reload);
});

gulp.task('pug', function() {
	return gulp.src('./src/templates/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('watchPug', function() {
	gulp.watch('src/templates/*.pug', ['pug']);
});

gulp.task("default", ['deploy']);