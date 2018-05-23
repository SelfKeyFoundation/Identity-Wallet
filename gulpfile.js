const 
	path = require('path')
	gulp = require('gulp')
	runSequence = require('run-sequence')
	watch = require('gulp-watch')
	pug = require('gulp-pug')
	templateCache = require('gulp-angular-templatecache')
	sass = require('gulp-sass')	
	tmplSrc = path.resolve(__dirname, './app/src/templates/**/*.pug')
	tmplDest = path.resolve(__dirname, './app/src/angular/')
	scssSrc = path.resolve(__dirname, './app/src/stylesheets/scss/main.scss')
	scssDest = path.resolve(__dirname, './app/src/stylesheets/css')

gulp.task('templates', cb => {
	gulp.src(tmplSrc)
		.pipe(pug({client: false}))
		.on('error', function(error) {
			console.log(error)
			this.emit('end')
		})
		.pipe(templateCache({standalone: true, filename: 'app.templates.js'}))
		.on('error', function(error) {
			console.log(error)
			this.emit('end')
		})
		.pipe(gulp.dest(tmplDest))
		.on('end', () => {
			cb()
		})
})

gulp.task('stylesheets', cb => {
	gulp.src(scssSrc)
		.pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
		.pipe(gulp.dest(scssDest))
		.on('end', () => {
			cb()
		})
})

gulp.task('watch', cb => {
	watch([scssSrc, tmplSrc], () => {
		runSequence(['templates', 'stylesheets'], cb)
	})
})

gulp.task('default', cb => {
	runSequence(['templates', 'stylesheets'], cb)
})
