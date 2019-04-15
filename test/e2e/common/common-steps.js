const tools = require('../../utils/tools.js');
const data = require('../../data/data.json');
const delay = require('delay');

export const givenUserHasOpenedSelfKeyWallet = given => {
	given('user has opened SelfKey Wallet', () => {
		return tools
			.regStep(tools.app, '#agree')
			.then(() => tools.regStep(tools.app, '#createWallet'))
			.then(() => tools.regStep(tools.app, '#protectWallet'))
			.then(() => delay(2000))
			.then(() => tools.app.client.waitForVisible('#pwd1', 10000))
			.then(() => tools.app.client.setValue('#pwd1', data[0].strongPass))
			.then(() => tools.app.client.click('#pwdNext'))
			.then(() => delay(2000))
			.then(() => tools.app.client.waitForVisible('#pwd2', 10000))
			.then(() => tools.app.client.setValue('#pwd2', data[0].strongPass))
			.then(() => tools.app.client.click('#pwd2Next'))
			.then(() => tools.regStep(tools.app, '#keystoreNext'))
			.then(() => tools.app.client.getValue('#privateKey'))
			.then(() => tools.regStep(tools.app, '#printWalletNext'))
			.then(() => tools.app.client.waitForVisible('#viewDashboard'));
	});
};

export const givenUserHasOpenedSelfKeyWalletWithAPrivateKey = given => {
	given('user has opened SelfKey Wallet with pirvate key', () => {
		return tools
			.regStep(tools.app, '#agree')
			.then(() => tools.regStep(tools.app, '#useExistingWalletButton'))
			.then(() => tools.regStep(tools.app, '#privateKey'))
			.then(() => tools.app.client.setValue('#privateKeyInput', data[1].privKey))
			.then(() => tools.regStep(tools.app, '#unlockPrivateKeyButton'))
			.then(() => tools.app.client.waitForVisible('#viewDashboard'));
	});
};
