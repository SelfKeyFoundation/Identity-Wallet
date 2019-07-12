import { defineFeature, loadFeature } from 'jest-cucumber';
import {
	givenUserHasOpenedTheMarketplaceScreen,
	whenUserClicksOnBankAccountsButton
} from './common-steps';
const tools = require('../../utils/tools.js');
const delay = require('delay');
jest.setTimeout(120000);

const feature = loadFeature('./test/e2e/marketplace/bank-accounts/browse-marketplace.feature');

defineFeature(feature, test => {
	beforeEach(tools.appStart);
	afterEach(tools.appStop);

	test('Bank accounts data is loading', ({ given, when, then }) => {
		givenUserHasOpenedTheMarketplaceScreen(given);

		whenUserClicksOnBankAccountsButton(when);

		when('bank accounts data has not loaded', () => {
			return tools.app.client.waitForVisible('#backToMarketplace').then(() => delay(2000));
		});

		then('user sees a loading animation', () => {
			return tools.app.client
				.waitForVisible('#loadingBankAccounts', 5000)
				.then(() => delay(2000));
		});
	});

	test('Bank accounts data has loaded', ({ given, when, then }) => {
		givenUserHasOpenedTheMarketplaceScreen(given);

		whenUserClicksOnBankAccountsButton(when);

		when('bank accounts data has loaded', () => {
			return tools.app.client.waitForVisible('#backToMarketplace').then(() => delay(10000));
		});

		then(
			'user sees a table with information on each jurisdiction (Type, Interest, Min Deposit, Fiat, Remote, Fee)',
			() => {
				return tools.app.client
					.waitForVisible('#bankAccounts', 5000)
					.then(() => delay(2000));
			}
		);
	});

	test('Open Specific Jurisdiction Screen', ({ given, when, then }) => {
		givenUserHasOpenedTheMarketplaceScreen(given);

		whenUserClicksOnBankAccountsButton(when);

		when('bank accounts data has loaded', () => {
			return tools.app.client.waitForVisible('#backToMarketplace').then(() => delay(10000));
		});

		when('user clicks the Antigua and Barbuda Details button', () => {
			return tools.app.client.element('#detailsAG').click();
		});

		then('the jurisdiction detailed screen is displayed', () => {
			return tools.app.client
				.waitForVisible('#bankAccountDetails', 5000)
				.then(() => delay(2000));
		});
	});

	test('Filter programs by Type', ({ given, when, then }) => {
		givenUserHasOpenedTheMarketplaceScreen(given);

		whenUserClicksOnBankAccountsButton(when);

		when('bank accounts data has loaded', () => {
			return tools.app.client.waitForVisible('#backToMarketplace').then(() => delay(10000));
		});

		when('user clicks one of the top tab options (Personal, Corporate, Private)', () => {
			return tools.app.client.element('#businessType').click();
		});

		then('bank accounts list is updated showing only offers for that specific type', () => {
			return tools.app.client.waitForVisible('#businessView', 5000).then(() => delay(2000));
		});
	});
});
