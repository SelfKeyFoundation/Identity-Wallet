import { defineFeature, loadFeature } from 'jest-cucumber';
import {
	givenUserHasOpenedAddressBookScreen,
	givenUserHasOpenedAddressBookScreenWithAPrivateKey,
	givenThereIsAlreadyAnAddressAddedWithLabelTest,
	whenUserClicksOnAddAddressButton
} from './common-steps';
const tools = require('../../utils/tools.js');
const data = require('../../data/data.json');
const delay = require('delay');
jest.setTimeout(120000);

const feature = loadFeature('./test/e2e/address-book/add-address-book.feature');

defineFeature(feature, test => {
	beforeEach(tools.appStart);
	afterEach(tools.appStop);

	test('Invalid Eth address', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		whenUserClicksOnAddAddressButton(when);

		when('enters invalid ETH address', () => {
			return tools.app.client
				.waitForVisible('#addressInput')
				.then(tools.app.client.setValue('#addressInput', 'invalidValue'))
				.then(() => delay(5000));
		});

		then('user can see error message informing of invalid ETH address entered', () => {
			return tools.app.client.waitForVisible('#addressError', 10000).then(() => delay(5000));
		});
	});

	test('Adding current user address', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreenWithAPrivateKey(given);

		whenUserClicksOnAddAddressButton(when);

		when('enters current wallet ETH address', () => {
			return tools.app.client
				.waitForVisible('#addressInput')
				.then(tools.app.client.setValue('#addressInput', data[1].pubKey))
				.then(() => delay(5000));
		});

		then(`user can see error message that current eth address can't be saved`, () => {
			return tools.app.client.waitForVisible('#addressError', 10000).then(() => delay(5000));
		});
	});

	test('Long label', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		whenUserClicksOnAddAddressButton(when);

		when('enters more than 25 characters label', () => {
			return tools.app.client
				.waitForVisible('#labelInput')
				.then(
					tools.app.client.setValue(
						'#labelInput',
						'invalidValueinvalidValueinvalidValueinvalidValueinvalidValueinvalidValueinvalidValueinvalidValue'
					)
				)
				.then(() => delay(5000));
		});

		then('user can see error message to enter 25 characters or less for label', () => {
			return tools.app.client.waitForVisible('#labelError', 10000).then(() => delay(5000));
		});
	});

	test('Label is already in use', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		givenThereIsAlreadyAnAddressAddedWithLabelTest(given);

		whenUserClicksOnAddAddressButton(when);

		when('enters existing label Test', () => {
			return tools.app.client
				.waitForVisible('#addressInput')
				.then(tools.app.client.setValue('#labelInput', 'Test'))
				.then(() => delay(5000));
		});

		then('user can see error message informing that label already exists', () => {
			return tools.app.client.waitForVisible('#labelError', 10000).then(() => delay(5000));
		});
	});

	test('Eth Address is already added', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		givenThereIsAlreadyAnAddressAddedWithLabelTest(given);

		whenUserClicksOnAddAddressButton(when);

		when('enters existing eth address', () => {
			return tools.app.client
				.waitForVisible('#addressInput')
				.then(() => tools.app.client.setValue('#addressInput', data[1].pubKey))
				.then(() => delay(5000));
		});

		then('user can see error message informing that eth address already exists', () => {
			return tools.app.client.waitForVisible('#addressError', 10000).then(() => delay(5000));
		});
	});

	test('Successfully added address', ({ given, when, then }) => {
		givenUserHasOpenedAddressBookScreen(given);

		whenUserClicksOnAddAddressButton(when);

		when('enters correct label and valid ETH address', () => {
			return tools.app.client
				.setValue('#labelInput', 'Test')
				.then(() => tools.app.client.setValue('#addressInput', data[1].pubKey))
				.then(() => delay(5000));
		});

		when('clicks Save button', () => {
			return tools.app.client.element('#saveButton').click();
		});

		then('user can see added address on the Address Book table', () => {
			return tools.app.client.waitForVisible('#Test', 10000).then(() => delay(5000));
		});
	});
});
