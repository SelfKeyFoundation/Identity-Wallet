import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import { getGlobalContext } from '../context';

const addEntry = async entry => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	const newAddress = await addressBookService.addEntry(entry);
	return newAddress;
};

const editEntry = async entry => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	const newAddress = await addressBookService.editEntry(entry);
	return newAddress;
};

const deleteEntry = async id => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	await addressBookService.deleteEntryById(id);
	return id;
};

const loadEntries = async walletId => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	const entries = await addressBookService.loadEntriesByWalletId(walletId);
	return entries;
};

const addAddressBookEntry = createAliasedAction(types.ADD_ADDRESS_BOOK_ENTRY, entry => ({
	type: types.ADD_ADDRESS_BOOK_ENTRY,
	payload: addEntry(entry)
}));

const editAddressBookEntry = createAliasedAction(types.EDIT_ADDRESS_BOOK_ENTRY, entry => ({
	type: types.EDIT_ADDRESS_BOOK_ENTRY,
	payload: editEntry(entry)
}));

const deleteAddressBookEntry = createAliasedAction(types.DELETE_ADDRESS_BOOK_ENTRY, id => ({
	type: types.DELETE_ADDRESS_BOOK_ENTRY,
	payload: deleteEntry(id)
}));

const loadAddressBookEntries = createAliasedAction(types.LOAD_ADDRESS_BOOK_ENTRIES, walletId => ({
	type: types.LOAD_ADDRESS_BOOK_ENTRIES,
	payload: loadEntries(walletId)
}));

const setLabelError = error => ({
	type: types.SET_ADDRESS_BOOK_LABEL_ERROR,
	payload: error
});

const setAddressError = error => ({
	type: types.SET_ADDRESS_BOOK_ADDRESS_ERROR,
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
