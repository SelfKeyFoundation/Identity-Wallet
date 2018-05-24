const 
	electron = require('electron')
	Application = require('spectron').Application
	delay = require('delay')
	chalk = require('chalk')
	exec = require('child_process').exec
	config = require('../config/config.js')

const app = new Application({
	path: config.appPath,
	//args: ['--', 'dev']
})

function init() {
	return new Promise((r, rj) => {
		exec(config.cacheCmd, err => {
			if (err) rj(err)
			r('done')
		})
	})
}

function appStart() {
	return new Promise((r, rj) => {
		init().then(() => r(app.start()))
	})
}

function appStop() {
	if (this.app && this.app.isRunning()) {
		return this.app.stop()
	}
	return undefined
}

function scrollContainerToBottom(app, selector) {
	return new Promise((r, rj) => {
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
	return new Promise((r, rj) => {
		delay(1000)
			.then(() => app.client.waitForVisible(selector, 15000))
			.then(() => app.client.click(selector))
			.then(() => r(console.log(chalk.green(selector + ' Step Done'))))
			.catch(err => {
				rj(err)
			})
	})
}

function clipboardCheck(check) {
	return new Promise((r, j) => {
		app.electron.clipboard
			.readText()
			.then(cbt => assert.equal(cbt, check))
			.then(() => r(console.log(chalk.green('Clipboard Check : ' + check))))
			.catch(err => {
				rj(err)
			})
	})
}

function writer(savePath, img) {
	return new Promise((r, rj) => {
		fs.writeFile(savePath, img, err => {
			if (err) rj(err)
			r(savePath + 'Saved')
		})
	})
}

function screenshotCheck(app, fileName) {
	return new Promise((r, rj) => {
		delay(1000)
			.then(() =>
				app.browserWindow
					.capturePage()
					.then(img => writer(pwd + '/test/local/caps/screen/' + fileName, img))
					.then(() => r(console.log(chalk.green('Screencap Done ' + fileName))))
			)
			.catch(err => {
				rj(err)
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
