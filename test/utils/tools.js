const exec = require('child_process').exec;
const assert = require('assert');
const delay = require('delay');
const chalk = require('chalk');
const config = require('../config/config.js');
const fs = require('fs');

var Application = require('spectron').Application;
var app = new Application({
	path: config.appPath,
	chromeDriverLogPath: './chromedriver.log',
	args: ['.'],
	webdriverOptions: {
		logLevel: 'verbose'
	},
	waitTimeout: 40000
});

function init() {
	return new Promise((resolve, reject) => {
		exec(config.cacheCmd, err => (err ? reject(err) : resolve('done')));
	});
}

function appStart() {
	return new Promise((resolve, reject) => {
		if (
			process.env.OSENV === 'windows' ||
			process.env.OSENV === 'linux' ||
			process.env.OSENV === 'circle-linux'
		) {
			app.start()
				.then(
					delay(15000)
						.then(() => app.client.switchTab())
						.then(async () => {
							await app.browserWindow.focus();
							await app.browserWindow.setAlwaysOnTop(true);
							resolve();
						})
				)
				.catch(reject);
		} else {
			init().then(() =>
				app
					.start()
					.then(
						delay(15000)
							.then(() => app.client.switchTab())
							.then(resolve)
					)
					.catch(reject)
			);
		}
	});
}

// function appStart() {
// 	return new Promise((resolve, reject) => {
// 		return init().then(() => resolve(app.start()));
// 	});
// }

function appStop() {
	if (app && app.isRunning()) {
		app.stop();
		return app.stop();
	}
	return undefined;
}

function regStep(app, selector) {
	return new Promise((resolve, reject) => {
		delay(1000)
			.then(() => app.client.waitForVisible(selector, 15000))
			.then(() => app.client.click(selector))
			.then(() => resolve(console.log(chalk.green(selector + ' Step Done'))))
			.catch(err => reject(err));
	});
}

function clipboardCheck(check) {
	return new Promise((resolve, reject) => {
		app.electron.clipboard
			.readText()
			.then(cbt => assert.strictEqual(cbt, check))
			.then(() => resolve(console.log(chalk.green('Clipboard Check : ' + check))))
			.catch(err => reject(err));
	});
}

function writer(savePath, img) {
	return new Promise((resolve, reject) => {
		fs.writeFile(savePath, img, err => {
			err ? reject(err) : resolve(savePath + 'Saved');
		});
	});
}

function screenshotCheck(app, fileName) {
	return new Promise((resolve, reject) => {
		delay(1000)
			.then(() =>
				app.browserWindow
					.capturePage()
					.then(img => writer(process.cwd() + '/test/local/caps/screen/' + fileName, img))
					.then(() => resolve(console.log(chalk.green('Screencap Done ' + fileName))))
			)
			.catch(err => reject(err));
	});
}

function scrollContainerToBottom(app, selector) {
	return new Promise((resolve, reject) => {
		delay(1000)
			.then(() => app.client.waitForVisible(selector, 20000))
			.then(() =>
				app.client.execute(selector => {
					const objDiv = document.getElementById(selector.substr(1, selector.length - 1));
					objDiv.scrollTop = objDiv.scrollHeight;
				}, selector)
			)
			.then(() => resolve(console.log(chalk.green(selector + ' Step Done'))))
			.catch(err => reject(err));
	});
}

module.exports = {
	app,
	init,
	appStart,
	appStop,
	regStep,
	clipboardCheck,
	screenshotCheck,
	scrollContainerToBottom
};
