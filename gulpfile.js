'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const pug = require('gulp-pug');
const templateCache = require('gulp-angular-templatecache');
const path = require('path');

const src = path.resolve(__dirname, './app/src/templates/**/*.pug');
const dest = path.resolve(__dirname, './app/src/');


gulp.task('default', (cb) => {
	gulp.src(src)
		.pipe(pug({client: false}))
		.on('error', function(error) {
			console.log(error);
			this.emit("end");
		})
		.pipe(templateCache({standalone: true, filename: "app.templates.js"}))
		.on('error', function(error) {
			console.log(error);
			this.emit("end");
		})
		.pipe(gulp.dest(dest))
		.on('end', () => {
			cb();
		});
});

gulp.task('watch', (cb) => {
	watch([src], () => {
		runSequence('default');
	});
});
