import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import { getGlobalContext } from '../context';

const addEntry = entry => async () => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	const newAddress = await addressBookService.addEntry(entry);
	return newAddress;
};

const editEntry = entry => async () => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	const newAddress = await addressBookService.editEntry(entry);
	return newAddress;
};

const deleteEntry = id => async () => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	await addressBookService.deleteEntryById(id);
	return id;
};

const loadEntries = walletId => async () => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	const entries = await addressBookService.loadEntriesByWalletId(walletId);
	return entries;
};

const addAddressBookEntry = createAliasedAction(types.ADRESS_BOOK_ENTRY_ADD, entry => ({
	type: types.ADRESS_BOOK_ENTRY_ADD,
	payload: addEntry(entry)
}));

const editAddressBookEntry = createAliasedAction(types.ADDRESS_BOOK_ENTRY_EDIT, entry => ({
	type: types.ADDRESS_BOOK_ENTRY_EDIT,
	payload: editEntry(entry)
}));

const deleteAddressBookEntry = createAliasedAction(types.ADDRESS_BOOK_ENTRY_DELETE, id => ({
	type: types.ADDRESS_BOOK_ENTRY_DELETE,
	payload: deleteEntry(id)
}));

const loadAddressBookEntries = createAliasedAction(types.ADDRESS_BOOK_ENTRIES_LOAD, walletId => ({
	type: types.ADDRESS_BOOK_ENTRIES_LOAD,
	payload: loadEntries(walletId)
}));

const setLabelError = error => ({
	type: types.ADDRESS_BOOK_LABEL_ERROR_SET,
	payload: error
});

const setAddressError = error => ({
	type: types.ADDRESS_BOOK_ADDRESS_ERROR_SET,
	payload: error
});

export {
	addAddressBookEntry,
	editAddressBookEntry,
	deleteAddressBookEntry,
	loadAddressBookEntries,
	setLabelError,
	setAddressError
};
