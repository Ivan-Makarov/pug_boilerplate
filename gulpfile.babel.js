//General
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import sourcemaps from 'gulp-sourcemaps'
import rename from 'gulp-rename'

//Webserver
import webserver from 'gulp-webserver'

//Pug
import pug from 'gulp-pug'

//CSS
import sass from 'gulp-sass'
import postCss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'

//JS
import uglify from 'gulp-uglify'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'

//Images
import imagemin from 'gulp-imagemin'

gulp.task('pug', () => {
  return gulp.src('./src/index.pug')
    .pipe(plumber())
    .pipe(pug({
      locals: {},
      pretty: true
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build'))
})

gulp.task('js', () => {
  return browserify({
    entries: './src/js/app.js',
      debug: true
    })
    .transform("babelify", {
      presets: ["env"],
      sourceMaps:true
    })
    .bundle()
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))       
    .pipe(rename({
      basename: "main",
            suffix: ".min"
        }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/js'))
})

gulp.task('css', () => {
  return gulp.src('./src/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postCss([
      autoprefixer(),
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
})

gulp.task('img', () => {
  return gulp.src('./src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'))
})

gulp.task('build', ['pug', 'css', 'js', 'img']);

gulp.task('watch', () => {
  gulp.watch(['./src/**/*.scss'], ['css']);
  gulp.watch(['./src/**/*.js'], ['js']);
  gulp.watch(['./src/**/*.pug'], ['pug']);
})

gulp.task('webserver', () => {
  gulp.src('./build/')
    .pipe(webserver({
      port: '3000',
      livereload: true,
      open: true
    }));
})

gulp.task('default', ['build', 'watch', 'webserver'])
