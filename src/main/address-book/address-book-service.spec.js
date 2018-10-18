import { AddressBookService } from './address-book-service';

describe.only('AddressBookService', () => {
	let addressBookService;
	it('creates an address book', () => {
		addressBookService = new AddressBookService();
		expect(addressBookService).toBeTruthy();
	});

	it('adds an entry to the address book', async () => {
		addressBookService = new AddressBookService();
		const entry = {
			label: 'Jack',
			address: '0xefd32a'
		};
		await addressBookService.addEntry(entry);
	});
});
