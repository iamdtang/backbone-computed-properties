var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
	gulp
		.src('src/*.js')
		.pipe(concat('backbone-computed.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});