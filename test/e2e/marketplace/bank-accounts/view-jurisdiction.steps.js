import { defineFeature, loadFeature } from 'jest-cucumber';
import {
	givenUserHasOpenedTheBankAccountsScreen,
	givenUserHasOpenedTheJurisdictionDetailedScreen
} from './common-steps';
const tools = require('../../utils/tools.js');
const delay = require('delay');
jest.setTimeout(120000);

const feature = loadFeature('./test/e2e/marketplace/bank-accounts/view-jurisdiction.feature');

defineFeature(feature, test => {
	beforeEach(tools.appStart);
	afterEach(tools.appStop);

	test('Open Specific Jurisdiction Screen', ({ given, when, then }) => {
		givenUserHasOpenedTheBankAccountsScreen(given);

		when('user clicks the Antigua and Barbuda Details button', () => {
			return tools.app.client.element('#detailsAG').click();
		});

		then('the jurisdiction detailed screen is displayed', () => {
			return tools.app.client
				.waitForVisible('#bankAccountDetails', 5000)
				.then(() => delay(2000));
		});

		then('information on fees, and banking option is displayed', () => {
			return tools.app.client.waitForVisible('#fees', 2000).then(() => delay(2000));
		});

		then('default Account Types tab is opened', () => {
			return tools.app.client.waitForVisible('#accountTab', 2000).then(() => delay(2000));
		});
	});

	test('Browse detailed jurisdiction account info', ({ given, when, then }) => {
		givenUserHasOpenedTheJurisdictionDetailedScreen(given);

		when('user clicks the Account Types tab', () => {
			return tools.app.client.element('#accountButton').click();
		});

		then('the jurisdiction account types from airtable is displayed', () => {
			return tools.app.client.waitForVisible('#accountTab', 2000).then(() => delay(2000));
		});
	});

	test('Browse detailed jurisdiction description info', ({ given, when, then }) => {
		givenUserHasOpenedTheJurisdictionDetailedScreen(given);

		when('user clicks the Description tab', () => {
			return tools.app.client.element('#descriptionButton').click();
		});

		then('the jurisdiction detailed description from airtable is displayed', () => {
			return tools.app.client.waitForVisible('#descriptionTab', 2000).then(() => delay(2000));
		});
	});

	test('Browse detailed jurisdiction country info', ({ given, when, then }) => {
		givenUserHasOpenedTheJurisdictionDetailedScreen(given);

		when('user clicks the Country Details tab', () => {
			return tools.app.client.element('#countryButton').click();
		});

		then('the selected country details from airtable is displayed', () => {
			return tools.app.client.waitForVisible('#countryTab', 2000).then(() => delay(2000));
		});
	});

	test('Browse detailed jurisdiction services info', ({ given, when, then }) => {
		givenUserHasOpenedTheJurisdictionDetailedScreen(given);

		when('user clicks the Services tab', () => {
			return tools.app.client.element('#servicesButton').click();
		});

		then('the services information from airtable is displayed', () => {
			return tools.app.client.waitForVisible('#servicesTab', 2000).then(() => delay(2000));
		});
	});
});
