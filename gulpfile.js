const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const autoprefix	= require('gulp-autoprefixer');
const del = require('del');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();

const reload = browserSync.reload;

gulp.task('concatScripts', () => gulp.src(['node_modules/jquery/dist/jquery.js', 'js/main.js'])
                                      .pipe(maps.init())
                                      .pipe(concat('app.js'))
                                      .pipe(maps.write('./'))
                                      .pipe(gulp.dest('js')));

gulp.task('minifyScripts', () => gulp.src('js/app.js')
                                      .pipe(uglify())
                                      .pipe(rename('app.min.js'))
                                      .pipe(gulp.dest('js')));

gulp.task('compileSass', () => gulp.src('stylesheets/main.scss')
                                    .pipe(maps.init())
                                    .pipe(sass().on('error', sass.logError))
                                    .pipe(autoprefix())
                                    .pipe(maps.write('./'))
                                    .pipe(gulp.dest('css'))
                                    .pipe(browserSync.stream()));

gulp.task('watchJS', ['concatScripts'], (done) => {
  reload();
  done();
});

gulp.task('clean', () => {
  del(['dist', 'css/main.css*', 'js/app*.js*']);
});

gulp.task('deploy',
          ['concatScripts', 'minifyScripts', 'compileSass'],
          () => gulp.src(['css/main.css', 'js/app.min.js', 'index.html', 'img/**', 'fonts/**'], { base: './' })
    .pipe(gulp.dest('dist')));

gulp.task('serve', ['concatScripts', 'compileSass'], () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  gulp.watch('stylesheets/**/*.scss', ['compileSass']);
  gulp.watch('js/main.js', ['watchJS']);
  gulp.watch('*.html').on('change', reload);
});

gulp.task('default', ['deploy']);
