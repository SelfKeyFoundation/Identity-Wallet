import { defineFeature, loadFeature } from 'jest-cucumber';
import {
	givenUserHasOpenedAddressBookScreen,
	givenThereIsAlreadyAnAddressAddedWithLabelTest
} from './common-steps';
const tools = require('../../utils/tools.js');
const delay = require('delay');
jest.setTimeout(120000);

const feature = loadFeature('./test/e2e/address-book/edit-address-book.feature');

defineFeature(feature, test => {
	beforeEach(tools.appStart);
	afterEach(tools.appStop);

	test('Label is already in use', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		givenThereIsAlreadyAnAddressAddedWithLabelTest(given);

		when('user clicks on pencil icon', () => {
			return tools.regStep(tools.app, '#editButtonTest').then(() => delay(5000));
		});

		when('enters existing label', () => {
			return tools.app.client.setValue('#labelInput', 'Test').then(() => delay(5000));
		});

		then('user can see error message informing that label already exists', () => {
			return tools.app.client.waitForVisible('#labelError', 10000);
		});
	});

	test('Successfully edited label', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		givenThereIsAlreadyAnAddressAddedWithLabelTest(given);

		when('user clicks on pencil icon', () => {
			return tools.regStep(tools.app, '#editButtonTest').then(() => delay(5000));
		});

		when('enters correct new label', () => {
			return tools.app.client.setValue('#labelInput', 'Test2').then(() => delay(5000));
		});

		when('clicks Save button', () => {
			return tools.app.client
				.element('#saveButton')
				.click()
				.then(() => delay(5000));
		});

		then('user can see updated label on the Address Book table', () => {
			return tools.app.client.waitForVisible('#Test2');
		});
	});
});
