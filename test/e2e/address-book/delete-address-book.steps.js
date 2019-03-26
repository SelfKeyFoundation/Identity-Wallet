import { defineFeature, loadFeature } from 'jest-cucumber';
import {
	givenUserHasOpenedAddressBookScreen,
	givenThereIsAlreadyAnAddressAddedWithLabelTest,
	givenThereIsAlreadyAnAddressAddedWithLabelTest2
} from './common-steps';
const tools = require('../../utils/tools.js');
jest.setTimeout(120000);

const feature = loadFeature('./test/e2e/address-book/delete-address-book.feature');

defineFeature(feature, test => {
	beforeEach(tools.appStart);
	afterEach(tools.appStop);

	test('Delete address', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		givenThereIsAlreadyAnAddressAddedWithLabelTest(given);

		givenThereIsAlreadyAnAddressAddedWithLabelTest2(given);

		when('user clicks on x icon of an address', () => {
			return tools.regStep(tools.app, '#deleteButtonTest');
		});

		then('user could no longer see address on Address Book table', () => {
			return tools.app.client.waitForVisible('#Test2', 10000, true);
		});
	});
});
