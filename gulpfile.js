const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const tmplSrc = path.resolve(__dirname, './src/renderer/templates/**/*.pug');
const tmplDest = path.resolve(__dirname, './src/renderer/angular/');
const scssSrc = path.resolve(__dirname, './static/stylesheets/scss/main.scss');
const scssDest = path.resolve(__dirname, './static/stylesheets/css');
const htmlJsStr = require('js-string-escape');
const tap = require('gulp-tap');
const concat = require('gulp-concat');
const header = require('gulp-header');
const insert = require('gulp-insert');
const os = require('os');

gulp.task('templates', cb => {
	gulp.src(tmplSrc)
		.pipe(pug({ client: false }))
		.on('error', function(error) {
			console.log(error);
			this.emit('end');
		})
		.pipe(
			tap(function(file) {
				let fileBase = file.path.replace(file.base, '');
				if (os.platform() === 'win32') {
					// eslint-disable-next-line no-useless-escape
					fileBase = file.path.replace(file.base, '').replace(/\\/g, '/');
				}
				file.contents = Buffer.from(
					'$templateCache.put("' + fileBase + '","' + htmlJsStr(file.contents) + '");'
				);
			})
		)
		.pipe(concat('app.templates.js'))
		.pipe(
			header(
				'angular.module("templates").run(["$templateCache", function($templateCache) {\n'
			)
		)
		.pipe(insert.append('\n}]);'))
		.pipe(gulp.dest(tmplDest))
		.on('end', () => {
			cb();
		});
});

gulp.task('stylesheets', cb => {
	gulp.src(scssSrc)
		.pipe(sass({ outputStyle: 'nested' }).on('error', sass.logError))
		.pipe(gulp.dest(scssDest))
		.on('end', () => {
			cb();
		});
});

gulp.task('watch', cb => {
	watch([scssSrc, tmplSrc], () => {
		runSequence(['templates', 'stylesheets'], cb);
	});
});

gulp.task('default', cb => {
	runSequence(['templates', 'stylesheets'], cb);
});
