import * as actions from './actions';
import * as types from './types';

describe('actions', () => {
	it('should create an action to add address to address book', () => {
		const entry = {
			label: 'Jack',
			address: '0xefd32a',
			walletId: 1
		};

		const expectedAction = {
			meta: {
				trigger: types.ADRESS_BOOK_ENTRY_ADD
			},
			type: 'ALIASED',
			payload: [entry]
		};
		expect(actions.addAddressBookEntry(entry)).toEqual(expectedAction);
	});

	it('should create an action to edit address on address book', () => {
		const entry = {
			label: 'Jack',
			address: '0xefd32a',
			walletId: 1
		};

		const expectedAction = {
			meta: {
				trigger: types.ADDRESS_BOOK_ENTRY_EDIT
			},
			type: 'ALIASED',
			payload: [entry]
		};
		expect(actions.editAddressBookEntry(entry)).toEqual(expectedAction);
	});

	it('should create an action to delete address from address book', () => {
		const id = 1;

		const expectedAction = {
			meta: {
				trigger: types.ADDRESS_BOOK_ENTRY_DELETE
			},
			type: 'ALIASED',
			payload: [id]
		};
		expect(actions.deleteAddressBookEntry(id)).toEqual(expectedAction);
	});

	it('should create an action to load addresses from address book', () => {
		const walletId = 1;

		const expectedAction = {
			meta: {
				trigger: types.ADDRESS_BOOK_ENTRIES_LOAD
			},
			type: 'ALIASED',
			payload: [walletId]
		};
		expect(actions.loadAddressBookEntries(walletId)).toEqual(expectedAction);
	});

	it('should create an action to set label error', () => {
		const error = 'error';

		const expectedAction = {
			type: types.ADDRESS_BOOK_LABEL_ERROR_SET,
			payload: error
		};
		expect(actions.setLabelError(error)).toEqual(expectedAction);
	});

	it('should create an action to set label error', () => {
		const error = 'error';

		const expectedAction = {
			type: types.ADDRESS_BOOK_ADDRESS_ERROR_SET,
			payload: error
		};
		expect(actions.setAddressError(error)).toEqual(expectedAction);
	});
});
