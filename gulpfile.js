'use strict';

const fs = require('fs');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const path = require('path');
const browserSync = require('browser-sync').create();
const electron = require('electron-connect').server.create();

const env = process.env.NODE_ENV;
const config = JSON.parse(fs.readFileSync('./config.json'));

/**
 * wallet webapp tasks
 */
const walletWebAppTasks = require('./wallet-web-app/gulp-tasks/index.js')(gulp, runSequence, watch, path, env);
//http://ionicons.com/#cdn

/**
 * wallet desktop app tasks
 */
const walletDesktopAppTasks = require('./gulp-tasks/index.js')(gulp, runSequence, watch, path, config, env);

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


// TODO
gulp.task('dev:desktop-app',  ['build:webapp'], () => {
	// Start browser process
	electron.start();

	// Restart browser process
	gulp.watch('./wallet-desktop-app/**/*', electron.restart);

	// Reload renderer process
	gulp.watch(['./wallet-web-app/dist/**/*'], electron.reload);
});