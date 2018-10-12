import * as types from './types';
import { createAliasedAction } from 'electron-redux';
// import AddressBookService from 'main/address-book/address-book-service';

// const addressBookService = new AddressBookService();

const addAddressBookEntry = createAliasedAction(types.ADD_ADDRESS_BOOK_ENTRY, entry => ({
	type: types.ADD_ADDRESS_BOOK_ENTRY,
	payload: entry
}));

export { addAddressBookEntry };
