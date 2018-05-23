const 
	exec = require('child_process').exec
	assert = require('assert')
	electron = require('electron')
	Application = require('spectron').Application
	delay = require('delay')
	chalk = require('chalk')
	config = require('../config/config.js')

const app = new Application({
	path: config.appPath,
	//args: ['--', 'dev']
})

function init() {
	return new Promise((resolve, reject) => {
		exec(config.cacheCmd, err => {
			if (err) reject(err)
			resolve('done')
		})
	})
}

function appStart() {
	return new Promise((resolve, reject) => {
		if (process.env.OSENV == 'osx') {
			init().then(() => resolve(app.start()))
		} else {
			resolve(app.start())
		}
	})
}

function appStop() {
	if (this.app && this.app.isRunning()) {
		return this.app.stop()
	}
	return undefined
}

function scrollContainerToBottom(app, selector) {
	return new Promise((resolve, reject) => {
		delay(1000)
			.then(() => app.client.waitForVisible(selector, 15000))
			.then(() => app.client.execute((selector) => {
				const objDiv = document.getElementById(selector.substr(1,selector.length-1));
				objDiv.scrollTop = objDiv.scrollHeight;
			},selector))
			.then(() => r(console.log(chalk.green(selector + ' Step Done'))))
			.catch(err => {
				rj(err)
			})
	})	
}

function regStep(app, selector) {
	return new Promise((resolve, reject) => {
		delay(1000)
			.then(() => app.client.waitForVisible(selector, 15000))
			.then(() => app.client.click(selector))
			.then(() => resolve(console.log(chalk.green(selector + ' Step Done'))))
			.catch(err => {
				reject(err)
			})
	})
}

function clipboardCheck(check) {
	return new Promise((resolve, reject) => {
		app.electron.clipboard
			.readText()
			.then(cbt => assert.equal(cbt, check))
			.then(() => resolve(console.log(chalk.green('Clipboard Check : ' + check))))
			.catch(err => {
				reject(err)
			})
	})
}

function writer(savePath, img) {
	return new Promise((resolve, reject) => {
		fs.writeFile(savePath, img, err => {
			if (err) reject(err)
			resolve(savePath + 'Saved')
		})
	})
}

function screenshotCheck(app, fileName) {
	return new Promise((resolve, reject) => {
		delay(1000)
			.then(() =>
				app.browserWindow
					.capturePage()
					.then(img => writer(pwd + '/test/local/caps/screen/' + fileName, img))
					.then(() => resolve(console.log(chalk.green('Screencap Done ' + fileName))))
			)
			.catch(err => {
				reject(err)
			})
	})
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
}
