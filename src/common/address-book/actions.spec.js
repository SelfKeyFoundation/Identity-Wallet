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
				trigger: types.ADD_ADDRESS_BOOK_ENTRY
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
				trigger: types.EDIT_ADDRESS_BOOK_ENTRY
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
				trigger: types.DELETE_ADDRESS_BOOK_ENTRY
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
				trigger: types.LOAD_ADDRESS_BOOK_ENTRIES
			},
			type: 'ALIASED',
			payload: [walletId]
		};
		expect(actions.loadAddressBookEntries(walletId)).toEqual(expectedAction);
	});

	it('should create an action to set label error', () => {
		const error = 'error';

		const expectedAction = {
			type: types.SET_ADDRESS_BOOK_LABEL_ERROR,
			payload: error
		};
		expect(actions.setLabelError(error)).toEqual(expectedAction);
	});

	it('should create an action to set label error', () => {
		const error = 'error';

		const expectedAction = {
			type: types.SET_ADDRESS_BOOK_ADDRESS_ERROR,
			payload: error
		};
		expect(actions.setAddressError(error)).toEqual(expectedAction);
	});
});
