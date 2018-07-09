const tools = require('../../utils/tools.js');
const delay = require('delay');
const data = require('../../data/data.json');

describe('Creates a New Wallet with Basic ID Details and a Password', () => {
	before(tools.appStart);
	after(tools.appStop);

	it('Accepts The TOC', () => {
		return tools.regStep(tools.app, '#agree');
	});

	it('Confirms Setup Wallet', () => {
		return tools.regStep(tools.app, '#setupWallet', 10000);
	});

	it('Chooses Create New Wallet', () => {
		return tools.regStep(tools.app, '#createWallet');
	});

	it('Step 1: Chooses Basic ID', () => {
		return tools.regStep(tools.app, '#createBasic');
	});

	it('Step 2: Fills Out the Basic ID Form', () => {
		return delay(1000)
			.then(() => tools.app.client.waitForVisible('#firstName', 10000))
			.then(() => tools.app.client.setValue('#firstName', data[0].firstName))
			.then(() => tools.app.client.setValue('#lastName', data[0].lastName))
			.then(() => tools.app.client.setValue('#middleName', data[0].middleName))
			.then(() => tools.app.client.click('#country'))
			.then(() => delay(3000))
			.then(() => tools.app.client.waitForExist('#Afghanistan', 10000))
			.then(() => tools.app.client.click('#Afghanistan'))
			.then(() => tools.app.client.click('#submitBasic'));
	});

	it('Confirms Password Warning', () => {
		return tools.regStep(tools.app, '#pwWarningNext');
	});

	it('Step 3: Create Password', () => {
		return delay(1000)
			.then(() => tools.app.client.waitForVisible('#pwd1', 10000))
			.then(() => tools.app.client.setValue('#pwd1', data[0].strongPass))
			.then(() => tools.app.client.click('#pwdNext'));
	});

	it('Step 4: Confirm Password', () => {
		return delay(1000)
			.then(() => tools.app.client.waitForVisible('#pwd2', 10000))
			.then(() => tools.app.client.setValue('#pwd2', data[0].strongPass))
			.then(() => tools.app.client.click('#pwd2Next'));
	});

	it('Step 5: Download JSON Keystore', () => {
		return tools.regStep(tools.app, '#keystoreNext');
	});

	it('Step 6: Print Wallet', () => {
		return tools.app.client
			.getValue('#privateKey')
			.then(pkey => {})
			.then(() => tools.regStep(tools.app, '#printWalletNext'));
	});

	it('Goes To Add Document', () => {
		return tools.regStep(tools.app, '#goToAddDocument');
	});

	it('Goes To Dashboard', () => {
		return tools.regStep(tools.app, '#goToDashboard');
	});

	it('Checks The Copy ETH Address On The Clipboard', () => {
		return tools.regStep(tools.app, '#eth-copy');
		// .then(() => {
		// 	console.log(privvy)
		// 	tools.clipboardCheck(privvy)
		// })
	});

	it('Checks The Copy KEY Address On The Clipboard', () => {
		return tools.regStep(tools.app, '#key-copy');
		// .then(() => tools.clipboardCheck(privvy))
	});

	it('TC25: Navigating to Help', () => {
		return tools
			.regStep(tools.app, '#navLink')
			.then(() => tools.regStep(tools.app, '#helpLink'));
	});

	it('TC26: Navigating to About', () => {
		return tools.regStep(tools.app, '#aboutLink');
	});

	it('TC29: Navigating to Version', () => {
		return tools.app.client.getText('#version');
		// .then(v => assert(v,  'V' + appVersion))
		// .then(() => console.log(chalk.green('Version Assert Correct: ' + v + ' == ' + appVersion)))
	});
});
