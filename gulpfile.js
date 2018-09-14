var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	csso = require('gulp-csso'),
	jade = require('gulp-jade'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	notify = require('gulp-notify'),
	del = require('del'),
	gulpif = require('gulp-if'),
	wiredep = require('gulp-wiredep'),
	useref = require('gulp-useref'),
	tiny = require('gulp-tinypng'),
	uncss = require('gulp-uncss'),
	wait = require('gulp-wait'),
	newer = require('gulp-newer');

// BUILD
gulp.task('build', ['clean', 'tiny', 'combine'], function () {
	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
	var buildFonts = gulp.src('app/js/all4site-fontawesome/dist/fonts/**/*')
		.pipe(gulp.dest('dist/fonts/'))
	var buildFonts = gulp.src('app/img/*.svg')
		.pipe(gulp.dest('dist/img/'))
	var buildUncss = gulp.src('dist/css/main.min.css')
		.pipe(uncss({
			html: ['dist/index.html']
		}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('tiny', function () {
	gulp.src(['app/img/*.jpg', 'app/img/*.png'])
		.pipe(newer('dist/img'))
		.pipe(tiny('eKJf273ZwggolXsloo3tDizmOiER9tgr'))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('combine', function () {
	return gulp.src(['app/*.jade','!app/*.jade'])
		.pipe(jade({
			pretty: true
		}))
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Jade Error!"
		}))
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', csso()))
		.pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
	return del.sync(['dist/css', 'dist/fonts', 'dist/js', 'dist/*.html']);
});


// WORK
gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.sass')
		.pipe(wait(500))
		.pipe(sass.sync())
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Sass Error!"
		}))
		.pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 8'], {
			cascade: true
		}))
		.pipe(gulp.dest('app/css/'))
});

gulp.task('jade', function () {
	gulp.src(['app/*.jade', '!app/_*.jade'])
		.pipe(jade({
			pretty: true
		}))
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Jade Error!"
		}))
		.pipe(gulp.dest('app'))
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('bower', function () {
	gulp.src(['app/_header.jade', 'app/_footer.jade'])
		.pipe(wiredep({
			diewctory: 'app/wendor'
		}))
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('default', ['browser-sync', 'jade', 'bower'], function () {
	gulp.watch('app/sass/*.sass', ['sass']);
	gulp.watch('app/*.jade', ['jade']);
	gulp.watch('bower.json', ['bower']);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/css/*.css', browserSync.reload);
});