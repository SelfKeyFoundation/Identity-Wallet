'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const path = require('path');
const browserSync = require('browser-sync').create();

/**
 * wallet webapp tasks
 */
const walletWebAppTasks = require('./wallet-web-app/gulp-tasks/index.js')(gulp, runSequence, watch, path);
//http://ionicons.com/#cdn

/**
 * wallet desktop app tasks
 */
const walletDesktopAppTasks = require('./gulp-tasks/index.js')(gulp, runSequence, watch, path);

gulp.task('move:webapp', function (cb) {
	gulp
		.src(['./wallet-web-app/dist/**/*'])
		.pipe(gulp.dest('./wallet-desktop-app/dist'))
		.on('end', () => { cb(); });
});

/**
 * browser sync - for development
 */
gulp.task('default', ['watch:webapp'], function() {
	  browserSync.init([
		  './wallet-web-app/src/index.html', 
		  './wallet-web-app/src/assets/css/main.css', 
		  './wallet-web-app/src/app-bundle.js'
		], {
		server: "./wallet-web-app/src",
		port: 5000,
		notify: true,
		ui: {
		  port: 5001
		}
	  });
});