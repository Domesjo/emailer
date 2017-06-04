const gulp        = require('gulp');
const sass        = require('gulp-sass');
const babel       = require('gulp-babel');
const cleanCSS    = require('gulp-clean-css');
const uglify      = require('gulp-uglify');

gulp.task('js', () => {
  return gulp.src('src/js/**/*.js')
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(uglify())
  .pipe(gulp.dest('public/js'));
});

gulp.task('sass', () => {
  return gulp.src('src/scss/style.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(cleanCSS({ compatibility: 'ie8' }))
  .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['sass', 'js'], () => {
  gulp.watch('src/scss/style.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
});
