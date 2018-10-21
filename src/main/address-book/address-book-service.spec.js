import { AddressBookService } from './address-book-service';
import AddressBook from './address-book';
import sinon from 'sinon';
import { setGlobalContext } from '../../common/context';

describe('AddressBookService', () => {
	afterEach(() => {
		sinon.restore();
	});

	let addressBookService;
	it('creates an address book', () => {
		addressBookService = new AddressBookService();
		expect(addressBookService).toBeTruthy();
	});

	it('adds an entry to the address book', () => {
		addressBookService = new AddressBookService();
		const entry = {
			label: 'Jack',
			address: '0xefd32a',
			walletId: 1
		};
		const stub = sinon.stub(AddressBook, 'create');
		addressBookService.addEntry(entry);
		expect(stub.getCall(0).args[0]).toEqual(entry);
	});

	it('updates an entry to the address book', () => {
		addressBookService = new AddressBookService();
		const entry = {
			id: 1,
			label: 'hey'
		};
		const stub = sinon.stub(AddressBook, 'update');
		addressBookService.editEntry(entry);
		expect(stub.getCall(0).args[0]).toEqual(entry);
	});

	it('deletes an entry to the address book', () => {
		addressBookService = new AddressBookService();
		const id = 1;
		const stub = sinon.stub(AddressBook, 'delete');
		addressBookService.deleteEntryById(id);
		expect(stub.getCall(0).args[0]).toEqual(id);
	});

	it('loads all entries from the address book', () => {
		addressBookService = new AddressBookService();
		const walletId = 1;
		const stub = sinon.stub(AddressBook, 'findAllByWalletId');
		addressBookService.loadEntriesByWalletId(walletId);
		expect(stub.getCall(0).args[0]).toEqual(walletId);
	});

	describe('AddressBookService Validate Eth address', () => {
		const service = {
			web3: {
				utils: {
					toChecksumAddress: () => {},
					isHex: () => {},
					isAddress: () => {}
				}
			}
		};

		setGlobalContext({ web3Service: service });

		it('should return true when checking a valid eth address', () => {
			sinon.stub(service.web3.utils, 'toChecksumAddress').returns('checkSum');
			sinon.stub(service.web3.utils, 'isHex').returns(true);
			sinon.stub(service.web3.utils, 'isAddress').returns(true);

			addressBookService = new AddressBookService();
			const address = '0x4184288c556524df9cb9e58b73265ee66dca4efe';
			expect(service.web3.utils.toChecksumAddress.calledOnceWith(address));
			expect(service.web3.utils.isHex.calledOnceWith(address));
			expect(service.web3.utils.isAddress.calledOnceWith('checkSum'));
			expect(addressBookService.isValidAddress(address)).toBeTruthy();
		});

		it('should return false when checking an invalid eth address hex ', () => {
			sinon.stub(service.web3.utils, 'toChecksumAddress').returns('checkSum');
			sinon.stub(service.web3.utils, 'isHex').returns(false);
			sinon.stub(service.web3.utils, 'isAddress').returns(true);

			addressBookService = new AddressBookService();
			const address = 'invalid';
			expect(service.web3.utils.toChecksumAddress.calledOnceWith(address));
			expect(service.web3.utils.isHex.calledOnceWith(address));
			expect(service.web3.utils.isAddress.notCalled);
			expect(addressBookService.isValidAddress(address)).toBeFalsy();
		});

		it('should return false when checking an invalid eth address checksum ', () => {
			sinon.stub(service.web3.utils, 'toChecksumAddress').returns('checkSum');
			sinon.stub(service.web3.utils, 'isHex').returns(true);
			sinon.stub(service.web3.utils, 'isAddress').returns(false);

			addressBookService = new AddressBookService();
			const address = 'invalid';
			expect(service.web3.utils.toChecksumAddress.calledOnceWith(address));
			expect(service.web3.utils.isHex.calledOnceWith(address));
			expect(service.web3.utils.isAddress.calledOnceWith('checkSum'));
			expect(addressBookService.isValidAddress(address)).toBeFalsy();
		});

		it('should return false when checking an invalid eth address throws and exception', () => {
			sinon.stub(service.web3.utils, 'toChecksumAddress').throws('Invalid address');
			addressBookService = new AddressBookService();
			const address = 'invalid';

			expect(service.web3.utils.toChecksumAddress.calledOnceWith(address));
			expect(service.web3.utils.isHex.notCalled);
			expect(service.web3.utils.isAddress.notCalled);

			expect(addressBookService.isValidAddress(address)).toBeFalsy();
		});
	});
});
