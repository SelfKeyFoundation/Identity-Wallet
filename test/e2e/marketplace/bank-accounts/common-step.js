const tools = require('../../../utils/tools.js');
const data = require('../../../data/data.json');
const delay = require('delay');

let address;
let privateKey;

export const givenUserHasOpenedTheMarketplaceScreen = given => {
	given('user has opened the Marketplace Screen', () => {
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
			.then(() => delay(2000))
			.then(() => tools.app.client.getValue('#publicKey'))
			.then(pubKey => {
				address = pubKey;
				return tools.regStep(tools.app, '#keystoreNext');
			})
			.then(() => tools.app.client.getValue('#privateKey'))
			.then(privKey => {
				privateKey = privKey;
				return tools.regStep(tools.app, '#printWalletNext');
			})
			.then(() => tools.app.client.waitForVisible('#viewDashboard'))
			.then(() => tools.regStep(tools.app, '#drawer'))
			.then(() => tools.regStep(tools.app, '#marketplaceButton'))
			.then(() => delay(5000));
	});
};

export const whenUserClicksOnBankAccountsButton = when => {
	when('user clicks on Bank Accounts button', () => {
		return tools.app.client
			.waitForVisible('#viewMarketplace', 10000, true)
			.then(tools.app.client.element('#marketplaceBankAccountsButton').click());
	});
};

export const givenUserHasOpenedTheBankAccountsScreen = given => {
	given('user has opened the Bank Accounts Screen', () => {
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
			.then(() => delay(2000))
			.then(() => tools.app.client.getValue('#publicKey'))
			.then(pubKey => {
				address = pubKey;
				return tools.regStep(tools.app, '#keystoreNext');
			})
			.then(() => tools.app.client.getValue('#privateKey'))
			.then(privKey => {
				privateKey = privKey;
				return tools.regStep(tools.app, '#printWalletNext');
			})
			.then(() => tools.app.client.waitForVisible('#viewDashboard'))
			.then(() => tools.regStep(tools.app, '#drawer'))
			.then(() => tools.regStep(tools.app, '#marketplaceButton'))
			.then(() => delay(2000))
			.then(() => tools.app.client.waitForVisible('#viewMarketplace', 10000))
			.then(() => tools.app.client.element('#marketplaceBankAccountsButton').click())
			.then(() => delay(5000));
	});
};

export const givenUserHasOpenedTheJurisdictionDetailedScreen = given => {
	given('user has opened the Jurisdiction Detailed screen', () => {
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
			.then(() => delay(2000))
			.then(() => tools.app.client.getValue('#publicKey'))
			.then(pubKey => {
				address = pubKey;
				return tools.regStep(tools.app, '#keystoreNext');
			})
			.then(() => tools.app.client.getValue('#privateKey'))
			.then(privKey => {
				privateKey = privKey;
				return tools.regStep(tools.app, '#printWalletNext');
			})
			.then(() => tools.app.client.waitForVisible('#viewDashboard'))
			.then(() => tools.regStep(tools.app, '#drawer'))
			.then(() => tools.regStep(tools.app, '#marketplaceButton'))
			.then(() => delay(2000))
			.then(() => tools.app.client.waitForVisible('#viewMarketplace', 10000))
			.then(() => tools.app.client.element('#marketplaceBankAccountsButton').click())
			.then(() => delay(2000))
			.then(() => tools.app.client.element('#detailsAG').click())
			.then(() => tools.app.client.waitForVisible('#bankAccountDetails', 5000))
			.then(() => delay(2000));
	});
};

export const getPublicKey = () => {
	return address;
};

export const getPrivateKey = () => {
	return privateKey;
};
