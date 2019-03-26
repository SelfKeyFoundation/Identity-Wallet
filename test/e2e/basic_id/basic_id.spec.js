const tools = require('../../utils/tools.js');
const delay = require('delay');
const data = require('../../data/data.json');
jest.setTimeout(30000);

describe('Creates a New Wallet with Basic ID Details and a Password', () => {
	beforeAll(tools.appStart);
	afterAll(tools.appStop);

	it('PRE: Accepts The TOC', () => {
		return tools.regStep(tools.app, '#agree');
	});

	it('TC01: Navigating to Home screen and close Protect dialog', () => {
		return delay(2000)
			.then(() => tools.regStep(tools.app, '#createWallet'))
			.then(() => tools.regStep(tools.app, '#protectWallet'));
	});

	it('TC02: Create Password', () => {
		return delay(2000)
			.then(() => tools.app.client.waitForVisible('#pwd1', 10000))
			.then(() => tools.app.client.setValue('#pwd1', data[0].strongPass))
			.then(() => tools.app.client.click('#pwdNext'));
	});

	it('TC03: Confirm Password', () => {
		return delay(2000)
			.then(() => tools.app.client.waitForVisible('#pwd2', 10000))
			.then(() => tools.app.client.setValue('#pwd2', data[0].strongPass))
			.then(() => tools.app.client.click('#pwd2Next'));
	});

	it('TC04: Saving Keystore File', () => {
		return delay(2000).then(() => tools.regStep(tools.app, '#keystoreNext'));
	});

	it('TC05: Saving Private Key and navigating to Dashboard screen', () => {
		return tools.app.client
			.getValue('#privateKey')
			.then(() => tools.regStep(tools.app, '#printWalletNext'))
			.then(() => tools.app.client.waitForVisible('#viewDashboard'));
	});

	it('TC06: Opening Selfkey ID', () => {
		return delay(2000)
			.then(() => tools.regStep(tools.app, '#drawer'))
			.then(() => tools.regStep(tools.app, '#selfkeyIdButton'));
	});

	it('TC07: Confirm Create Selfkey ID dialog', () => {
		return delay(2000).then(() => tools.regStep(tools.app, '#selfkeyIdDialogButton'));
	});

	it('TC08: Populating and submitting Selfkey Basic ID form', () => {
		return delay(2000)
			.then(() => tools.app.client.waitForVisible('#nickName', 10000))
			.then(() => tools.app.client.setValue('#nickName', data[0].nickName))
			.then(() => tools.app.client.setValue('#firstName', data[0].firstName))
			.then(() => tools.app.client.setValue('#email', data[0].email))
			.then(() => tools.regStep(tools.app, '#selfkeyIdCreateButton'));
	});

	it('TC09: Confirm About dialog', () => {
		return delay(2000).then(() => tools.regStep(tools.app, '#selfkeyIdAboutButton'));
	});

	it('TC10: Confirm Disclaimer dialog and navigating to Selfkey Identity Wallet screen', () => {
		return delay(2000)
			.then(() => tools.regStep(tools.app, '#selfkeyIdDisclaimerButton'))
			.then(() => tools.app.client.waitForVisible('#viewOverview'));
	});
});
