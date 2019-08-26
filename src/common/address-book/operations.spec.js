import sinon from 'sinon';
import { setGlobalContext } from '../context';
import * as actions from './actions';
import { addressBookOperations } from '.';
import { walletSelectors } from '../wallet';
import * as addressSelectors from './selectors';

describe('address book operations', () => {
	const state = {};
	const store = {
		dispatch() {},
		getState() {
			return state;
		}
	};
	const testAction = { type: 'test' };

	beforeEach(() => {
		sinon.restore();
	});

	it('loadAddressBook', async () => {
		const wallet = {
			id: 1
		};
		sinon.stub(walletSelectors, 'getWallet').returns(wallet);
		sinon.stub(store, 'dispatch');
		sinon.stub(actions, 'loadAddressBookEntries').returns(testAction);

		await addressBookOperations.loadAddressBook()(store.dispatch, store.getState.bind(store));

		expect(walletSelectors.getWallet.calledOnceWith(state)).toBeTruthy();
		expect(actions.loadAddressBookEntries.calledOnceWith(wallet.id)).toBeTruthy();
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});

	it('resetAdd', async () => {
		sinon.stub(store, 'dispatch');
		sinon.stub(actions, 'setLabelError').returns(testAction);
		sinon.stub(actions, 'setAddressError').returns(testAction);

		await addressBookOperations.resetAdd()(store.dispatch, store.getState.bind(store));

		expect(store.dispatch.alwaysCalledWith(testAction)).toBeTruthy();
	});

	it('resetEdit', async () => {
		sinon.stub(store, 'dispatch');
		sinon.stub(actions, 'setLabelError').returns(testAction);

		await addressBookOperations.resetEdit()(store.dispatch, store.getState.bind(store));

		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});

	it('addAddressBookEntry', async () => {
		const wallet = {
			id: 1
		};
		const entry = {
			label: 'test',
			address: '0x'
		};
		sinon.stub(walletSelectors, 'getWallet').returns(wallet);
		sinon.stub(store, 'dispatch');
		sinon.stub(actions, 'addAddressBookEntry').returns(testAction);

		await addressBookOperations.addAddressBookEntry(entry)(
			store.dispatch,
			store.getState.bind(store)
		);

		expect(walletSelectors.getWallet.calledOnceWith(state)).toBeTruthy();
		expect(
			actions.addAddressBookEntry.calledOnceWith({ ...entry, walletId: wallet.id })
		).toBeTruthy();
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});

	it('editAddressBookEntry', async () => {
		const entry = {
			label: 'test',
			address: '0x'
		};
		sinon.stub(store, 'dispatch');
		sinon.stub(actions, 'editAddressBookEntry').returns(testAction);

		await addressBookOperations.editAddressBookEntry(entry)(
			store.dispatch,
			store.getState.bind(store)
		);

		expect(actions.editAddressBookEntry.calledOnceWith(entry)).toBeTruthy();
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});

	it('deleteAddressBookEntry', async () => {
		const id = 1;
		sinon.stub(store, 'dispatch');
		sinon.stub(actions, 'deleteAddressBookEntry').returns(testAction);

		await addressBookOperations.deleteAddressBookEntry(id)(
			store.dispatch,
			store.getState.bind(store)
		);

		expect(actions.deleteAddressBookEntry.calledOnceWith(id)).toBeTruthy();
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});

	describe('address book operations label validation', () => {
		const entries = [
			{
				id: 1,
				label: 'one',
				address: '0x',
				walletId: 1
			},
			{
				id: 2,
				label: 'two',
				address: '0x4',
				walletId: 1
			}
		];

		it('validateLabel happy path', async () => {
			const label = 'new one';
			sinon.stub(addressSelectors, 'getAddresses').returns(entries);
			sinon.stub(store, 'dispatch');
			sinon.stub(actions, 'setLabelError').returns(testAction);

			await addressBookOperations.validateLabel(label)(
				store.dispatch,
				store.getState.bind(store)
			);

			expect(actions.setLabelError.calledOnceWith('')).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});

		it('validateLabel set error due to more than 25 characters', async () => {
			const label = '01234567890123456789012345';
			sinon.stub(addressSelectors, 'getAddresses').returns(entries);
			sinon.stub(store, 'dispatch');
			sinon.stub(actions, 'setLabelError').returns(testAction);

			await addressBookOperations.validateLabel(label)(
				store.dispatch,
				store.getState.bind(store)
			);

			expect(
				actions.setLabelError.calledOnceWith('Please enter 25 characters or less.')
			).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});

		it('validateLabel set error due to existent label', async () => {
			const label = 'two';
			sinon.stub(addressSelectors, 'getAddresses').returns(entries);
			sinon.stub(store, 'dispatch');
			sinon.stub(actions, 'setLabelError').returns(testAction);

			await addressBookOperations.validateLabel(label)(
				store.dispatch,
				store.getState.bind(store)
			);

			expect(
				actions.setLabelError.calledOnceWith('Label is already being used.')
			).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});
	});

	describe('address book operations address validation', () => {
		const addressBookService = {
			isValidAddress() {}
		};
		const wallet = {
			address: '0xdasdas'
		};

		const entries = [
			{
				id: 1,
				label: 'one',
				address: '0x',
				walletId: 1
			},
			{
				id: 2,
				label: 'two',
				address: '0x4',
				walletId: 1
			}
		];

		setGlobalContext({ addressBookService });

		it('validateAddress happy path', async () => {
			const address = '0xgdsgdsgds555';
			sinon.stub(addressBookService, 'isValidAddress').returns(true);
			sinon.stub(walletSelectors, 'getWallet').returns(wallet);
			sinon.stub(addressSelectors, 'getAddresses').returns(entries);
			sinon.stub(store, 'dispatch');
			sinon.stub(actions, 'setAddressError').returns(testAction);

			await addressBookOperations.validateAddress(address)(
				store.dispatch,
				store.getState.bind(store)
			);
			expect(actions.setAddressError.calledOnceWith('')).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});

		it('validateAddress not a valid address ', async () => {
			const address = '0x432423423';
			sinon.stub(addressBookService, 'isValidAddress').returns(false);
			sinon.stub(walletSelectors, 'getWallet').returns(wallet);
			sinon.stub(addressSelectors, 'getAddresses').returns(entries);
			sinon.stub(store, 'dispatch');
			sinon.stub(actions, 'setAddressError').returns(testAction);

			await addressBookOperations.validateAddress(address)(
				store.dispatch,
				store.getState.bind(store)
			);
			expect(actions.setAddressError.calledOnceWith('Invalid ETH address.')).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});

		it('validateAddress same as the wallet ', async () => {
			const address = '0xdasdas';
			sinon.stub(addressBookService, 'isValidAddress').returns(true);
			sinon.stub(walletSelectors, 'getWallet').returns(wallet);
			sinon.stub(addressSelectors, 'getAddresses').returns(entries);
			sinon.stub(store, 'dispatch');
			sinon.stub(actions, 'setAddressError').returns(testAction);

			await addressBookOperations.validateAddress(address)(
				store.dispatch,
				store.getState.bind(store)
			);
			expect(
				actions.setAddressError.calledOnceWith(`Sorry, you can't add your current address.`)
			).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});

		it('validateAddress already added ', async () => {
			const address = '0x4';
			sinon.stub(addressBookService, 'isValidAddress').returns(true);
			sinon.stub(walletSelectors, 'getWallet').returns(wallet);
			sinon.stub(addressSelectors, 'getAddresses').returns(entries);
			sinon.stub(store, 'dispatch');
			sinon.stub(actions, 'setAddressError').returns(testAction);

			await addressBookOperations.validateAddress(address)(
				store.dispatch,
				store.getState.bind(store)
			);
			expect(
				actions.setAddressError.calledOnceWith(`Address is already being used.`)
			).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});
	});
});
