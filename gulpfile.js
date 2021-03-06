var gulp = require('gulp'),
  less = require('gulp-less'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  plumber = require('gulp-plumber'),
  seajsCombo = require('gulp-seajs-combo'),
  watch = require('gulp-watch'),
  config = require('./gulpConfig.json')

// css
gulp.task('css', function () {
  return gulp.src(config.src.css)
  .pipe(watch(config.src.css))
  .pipe(plumber())
  .pipe(less())
  .pipe(autoprefixer())
  .pipe(minifycss())
  .pipe(gulp.dest(config.dest.css))
})

gulp.task('css-min', ['css'], function () {
  return gulp.src(config.res.css)
  .pipe(minifycss())
  .pipe(gulp.dest(config.dest.css))
})

// js
gulp.task('entry', function () {
  return gulp.src(config.src.entry)
  .pipe(seajsCombo({
    map: {
      'swiper': config.modulePath + 'swiper/swiper.js',
      'flexible': config.modulePath + 'flexible/flexible.js',
      'fastclick': config.modulePath + 'fastclick/fastclick.js'
    }
  }))
  .pipe(rename({
    basename: 'build'
  }))
  .pipe(gulp.dest(config.dest.js))
})

gulp.task('baseJs', function () {
  return gulp.src(config.src.baseJs)
  .pipe(concat('base.js'))
  .pipe(gulp.dest(config.dest.js))
})

gulp.task('js', ['entry', 'baseJs'], function () {
  gulp.start('entry', 'baseJs')
})

gulp.task('js-min', ['js'], function () {
  return gulp.src(config.res.js)
  .pipe(uglify())
  .pipe(gulp.dest(config.dest.js))
})

// img
gulp.task('img', function () {
  return gulp.src(config.src.img)
  .pipe(watch(config.src.img))
  .pipe(plumber())
  .pipe(gulp.dest(config.dest.img))
})

// html
gulp.task('html', function () {
  return gulp.src(config.src.html)
  .pipe(plumber())
  .pipe(gulp.dest(config.dest.html))
})

// watch
gulp.task('browserSync', function () {
  browserSync({
    files: [
      config.dest.css,
      config.dest.js,
      config.dest.img,
      config.dest.html
    ],
    open: false,
    server: {
      baseDir: './dist/'
    }
  })
})

// clean
gulp.task('clean', function () {
  return gulp.src(config.src.clean, {
    read: false
  })
  .pipe(clean())
})

gulp.task('dev', ['browserSync'], function () {
  gulp.watch(config.src.css, ['css'])
  gulp.watch(config.src.html, ['html'])
  gulp.watch(config.src.img, ['img'])
  gulp.watch(config.src.js, ['entry'])
  gulp.watch(config.src.baseJs, ['baseJs'])
})

gulp.task('default',function () {
  gulp.start('css', 'html', 'img', 'js')
  gulp.start('dev')
})

gulp.task('build', ['clean'], function () {
  gulp.start('css-min', 'js-min', 'html', 'img')
})
