import { defineFeature, loadFeature } from 'jest-cucumber';
import { givenUserHasOpenedSelfKeyWallet } from '../common/common-steps';
const tools = require('../../utils/tools.js');
jest.setTimeout(120000);

const feature = loadFeature('./test/e2e/address-book/open-address-book.feature');

defineFeature(feature, test => {
	beforeAll(tools.appStart);
	afterAll(tools.appStop);

	test('Opened Address Book successfully', ({ given, when, then }) => {
		givenUserHasOpenedSelfKeyWallet(given);

		when('user clicks on Hamburger icon > Address Book', () => {
			return tools
				.regStep(tools.app, '.sk-icon-button')
				.then(() => tools.regStep(tools.app, '#addressBookButton'));
		});

		then('Address Book screen is displayed', () => {
			return tools.app.client.waitForVisible('.address-book', 10000);
		});
	});
});
