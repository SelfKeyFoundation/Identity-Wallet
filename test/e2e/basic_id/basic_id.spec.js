const tools = require('../../utils/tools.js');
const delay = require('delay');
const data = require('../../data/data.json');
jest.setTimeout(30000);

describe('Creates a New Wallet with Basic ID Details and a Password', () => {
	beforeAll(tools.appStart);
	afterAll(tools.appStop);

	it('PRE: Accepts The TOC and Confirms Setup Wallet', () => {
		return tools
			.scrollContainerToBottom(tools.app, '#container')
			.then(() => tools.regStep(tools.app, '#agree'))
			.then(() => tools.regStep(tools.app, '#setupWallet', 10000));
	});

	it('TC01: Navigating to Selfkey Basic ID screen', () => {
		return tools
			.regStep(tools.app, '#createWallet')
			.then(() => tools.regStep(tools.app, '#protectWallet'));
	});

	it('TC01.01: Close dialog', () => {
		return tools
			.regStep(tools.app, '.close-dialog')
			.then(() => tools.regStep(tools.app, '#createWallet'))
			.then(() => tools.regStep(tools.app, '#protectWallet'));
	});

	it('TC01.02: Close dialog on password confirmation', () => {
		return delay(2000)
			.then(() => tools.app.client.waitForVisible('#pwd1', 10000))
			.then(() => tools.app.client.setValue('#pwd1', data[0].strongPass))
			.then(() => tools.app.client.click('#pwdNext'))
			.then(() => delay(2000))
			.then(() => tools.app.client.waitForVisible('#pwd2', 10000))
			.then(() => tools.regStep(tools.app, '.close-dialog'))
			.then(() => tools.regStep(tools.app, '#createWallet'))
			.then(() => tools.regStep(tools.app, '#protectWallet'));
	});

	it('TC03: Create and Confirm Password', () => {
		return delay(2000)
			.then(() => tools.app.client.waitForVisible('#pwd1', 10000))
			.then(() => tools.app.client.setValue('#pwd1', data[0].strongPass))
			.then(() => tools.app.client.click('#pwdNext'))
			.then(() => delay(2000))
			.then(() => tools.app.client.waitForVisible('#pwd2', 10000))
			.then(() => tools.app.client.setValue('#pwd2', data[0].strongPass))
			.then(() => tools.app.client.click('#pwd2Next'));
	});

	it('TC04: Saving Keystore File', () => {
		return tools.regStep(tools.app, '#keystoreNext');
	});

	it('TC05: Saving Private Key', () => {
		return tools.app.client
			.getValue('#privateKey')
			.then(() => tools.regStep(tools.app, '#printWalletNext'))
			.then(() => tools.app.client.waitForVisible('#viewDashboard'));
	});

	it('TC06: Opening Selfkey ID', () => {
		return tools
			.regStep(tools.app, '.sk-icon-button')
			.then(() => tools.regStep(tools.app, '#selfkeyIdButton'));
	});

	it('TC06.01: Close dialog', () => {
		return tools
			.regStep(tools.app, '.close-dialog')
			.then(() => tools.regStep(tools.app, '.sk-icon-button'))
			.then(() => tools.regStep(tools.app, '#selfkeyIdButton'));
	});

	it('TC06.02: Adding National ID and Selfie with ID Document', () => {
		return delay(3000).then(() => tools.regStep(tools.app, '#createID'));
	});

	it('TC06.03: Close dialog on basic id form', () => {
		return delay(2000)
			.then(() => tools.app.client.waitForVisible('#firstName', 10000))
			.then(() => tools.regStep(tools.app, '.close-dialog'))
			.then(() => tools.regStep(tools.app, '#createID'));
	});

	it('TC07.01: Populating and submitting Selfkey Basic ID form', () => {
		return delay(2000)
			.then(() => tools.app.client.waitForVisible('#firstName', 10000))
			.then(() => tools.app.client.setValue('#firstName', data[0].firstName))
			.then(() => tools.app.client.setValue('#lastName', data[0].lastName))
			.then(() => tools.app.client.setValue('#middleName', data[0].middleName))
			.then(() => tools.app.client.click('#country'))
			.then(() => delay(3000))
			.then(() => tools.app.client.waitForExist('#Afghanistan', 10000))
			.then(() => tools.app.client.click('#Afghanistan'))
			.then(() => delay(1000))
			.then(() => tools.app.client.click('#submitBasic'));
	});

	it('TC07.02: Skipping ID and Selfie Upload', () => {
		return delay(5000)
			.then(() => tools.app.client.click('#skipDashboard'))
			.then(() => tools.regStep(tools.app, '#idWalletInfoContinueButton'))
			.then(() => tools.app.client.waitForVisible('.id-wallet-main'));
	});
});
