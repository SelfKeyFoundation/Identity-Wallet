const 
	Application = require('spectron').Application
	assert = require('assert')
	fs = require('fs')
	exec = require('child_process').exec
	chalk = require('chalk')
	delay = require('delay')
	path = require('path')
	pwd = process.cwd()
	data = require(pwd + '/test/data/data.json')
	usr = process.argv[2] || 0
	APP_TITLE = require('../package.json').productName
	appPath = pwd + '/out/' + APP_TITLE + '-darwin-x64/' + APP_TITLE + '.app/Contents/MacOS/' + APP_TITLE


const app = new Application({
	path: appPath
})

// LIST
// ********
// - No Quit Button In Dashboard or Nav Menu
// - Press Unlock if no Private Key in Textarea Freezes App - BTN shoudl be disabled until form validation of text area has private key data X chars long
//   Console Error: TypeError: Cannot read property 'startsWith' of null
// - Upload KYC docs maybe needs hidden manual submission button for testing
// - 

app.start().then(() => {
	const
		c = app.client
		e = app.electron
		b = app.browserWindow
		w = app.webContents
		
	c.waitUntilWindowLoaded()
		.then(() => w.savePage('test/caps/source/index.html', 'HTMLComplete'))
		.then(() => console.log(chalk.green('Source Code Saved Done')))

// TOC Agree -> Import Key
// TOC Disagree -> Quit / Go Back & Agree
// Help -> External Window
// Quit -> Exit

	 	// Agree TOC
		.then(() => c.waitForExist('#agree', 10000))
		.then(() => console.log(chalk.blue('TOC Agree Loaded')))
		//.then(() => c.execute("window.scrollTo(0, document.body.scrollHeight)"))
		// .then(() => c.execute('arguments[0].scrollIntoView()', 'document.getElementById("#bottom")'))
		// .then(() => c.execute('document.getElementById("#agree").removeAttribute("disabled");'))
		// ** temp removed this from button #agree ** (ng-disabled="!scrolledBottom || storeSavePromise.$$state.status")
		.then(() => c.click("#agree"))
		.then(() => console.log(chalk.green('TOC Agree Test Done')))
		
		// Setup Wallet Confirm
		.then(() => c.waitForExist('#setupWallet', 10000))
		.then(() => c.click("#setupWallet"))
		.then(() => console.log(chalk.green('Setup Wallet Test Done')))

// Import Key -> Choose Import Method

		// Import Wallet
		.then(() => c.waitForVisible('#import', 10000))
		.then(() => delay(1000).then(() => console.log(chalk.green('Import Button Exists'))))
		.then(() => b.capturePage()
			.then(() => console.log(chalk.green('Screencap Start')))
			.then(img => fs.writeFile(pwd + '/test/caps/screen/1.png', img))
			.then(() => console.log(chalk.green('Screencap Done'))))
		.then(() => c.click('#import'))
		.then(() => console.log(chalk.green('Import Button Test Done')))

// Choose Import -> Private Key (Ignore other options for now, lack test data)
// Select Private Key Radio Button
// Select Private Key Text Area
// Add Value For Private Key Text Area
// Submit Private Key

		// Select Private Key And Submit
		.then(() => c.waitForExist('#pkey', 10000))
		.then(() => b.capturePage()
			.then(img => fs.writeFile(pwd + '/test/caps/screen/2.png', img)))
		.then(() => c.click("#pkey"))
		.then(() => c.click('#keyarea'))
		.then(() => c.setValue('#keyarea', data[usr].privKey))
		.then(() => c.click('#pkyunlock'))
		.then(() => console.log(chalk.green('Select And Add Private Key Test Done')))

// If no KYC upload KYC Docs
// Confirm Screen with Docs Info -> Goto Dashboard or Selfkey ICO view

		// Upload KYC Docs
		.then(() => c.waitForExist('#uploadKyc', 10000))
		.then(() => c.click('#uploadKyc', 10000))
		.then(() => c.element('#uploadKyc').keys(pwd + '/test/data/' + usr + '.zip'))
		// .then(() => c.chooseFile('#uploadKyc', pwd + '/test/data/' + usr + '.zip'))
			
// If KYC confirm private key -> Goto Dashboard

		// Confirm Private Key
		// .then(() => c.waitForExist('#pkycontinue', 10000))
		// .then(() => b.capturePage()
		// 	.then(img => fs.writeFile(pwd + '/test/caps/screen/3.png', img))
		// ).then(() => c.click('#pkycontinue'))
		// .then(() => console.log(chalk.green('Confirm Private Key Test Done')))
			
// Check ETH Address from Copy button
// Check KEY Address from Copy button
// Check Navbar works
// Check Navbar Links Work
// Check Transaction History for a correct value
// Send ETH
// Send KEY
// Airdrop Test

		// Dashboard
		.then(() => c.waitForExist('#eth-copy', 10000))
		.then(() => c.click('#eth-copy'))
		.then(() => e.clipboard.readText()
			.then(cbt => assert.equal(cbt, data[usr].pubKey))
			.then(() => console.log(chalk.green('ETH Address Copy Test Done'))))
		.then(() => c.click('#qey-copy'))
		.then(() => e.clipboard.readText()
			.then(cbt => assert.equal(cbt, data[usr].pubKey))
			.then(() => console.log(chalk.green('KEY Address Copy Test Done'))))
		.then(() => c.click('#aboutLink'))
		.then(() => c.click('#helpLink'))
		.then(() => console.log(chalk.green('Testing Completed Successfully'))
		.then(() => app.stop())
		).catch((err) => {
			console.log(chalk.red('Tests Failed With Error: '), err)
			app.stop()
		})
	
})
