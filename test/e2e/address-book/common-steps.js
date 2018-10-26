const tools = require('../../utils/tools.js');
const data = require('../../data/data.json');
const delay = require('delay');

export const givenUserHasOpenedAddressBookScreen = given => {
	given('user has opened Address Book screen', () => {
		return tools
			.scrollContainerToBottom(tools.app, '#container')
			.then(() => tools.regStep(tools.app, '#agree'))
			.then(() => tools.regStep(tools.app, '#setupWallet', 10000))
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
			.then(() => tools.app.client.waitForVisible('#viewDashboard'))
			.then(() => tools.regStep(tools.app, '.sk-icon-button'))
			.then(() => tools.regStep(tools.app, '#addressBookButton'))
			.then(() => delay(5000));
	});
};

export const givenUserHasOpenedAddressBookScreenWithAPrivateKey = given => {
	given('user has opened Address Book screen with pirvate key', () => {
		return tools
			.scrollContainerToBottom(tools.app, '#container')
			.then(() => tools.regStep(tools.app, '#agree'))
			.then(() => tools.regStep(tools.app, '#setupWallet', 10000))
			.then(() => tools.regStep(tools.app, '#useExistingWalletButton'))
			.then(() => tools.regStep(tools.app, '#privateKey'))
			.then(() => tools.app.client.setValue('#privateKeyInput', data[1].privKey))
			.then(() => tools.regStep(tools.app, '#unlockButton'))
			.then(() => tools.app.client.waitForVisible('#viewDashboard'))
			.then(() => tools.regStep(tools.app, '.sk-icon-button'))
			.then(() => tools.regStep(tools.app, '#addressBookButton'))
			.then(() => delay(5000));
	});
};

export const givenThereIsAlreadyAnAddressAddedWithLabelTest = given => {
	given('there is already an address added with label Test', () => {
		return tools.app.client
			.waitForVisible('md-backdrop', 10000, true)
			.then(() => tools.app.client.element('#addAddressButton').click())
			.then(() => delay(2000))
			.then(() => tools.app.client.setValue('#labelInput', 'Test'))
			.then(() => tools.app.client.setValue('#addressInput', data[1].pubKey))
			.then(() => delay(2000))
			.then(() => tools.app.client.element('#saveButton').click());
	});
};

export const whenUserClicksOnAddAddressButton = when => {
	when('user clicks on Add Address button', () => {
		return tools.app.client
			.waitForVisible('md-backdrop', 10000, true)
			.then(tools.app.client.element('#addAddressButton').click());
	});
};
