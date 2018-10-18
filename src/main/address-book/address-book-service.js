import AddressBook from './address-book';

export class AddressBookService {
	constructor() {
		this.addressBook = new AddressBook();
	}

	addEntry = entry => {
		AddressBook.query().insert(entry);
	};
}
