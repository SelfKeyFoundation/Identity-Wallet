import AddressBook from './address-book';
import { getGlobalContext } from 'common/context';

export class AddressBookService {
	addEntry = entry => {
		return AddressBook.create(entry);
	};

	editEntry = entry => {
		return AddressBook.update(entry);
	};

	deleteEntryById = id => {
		return AddressBook.delete(id);
	};

	loadEntriesByWalletId = walletId => {
		return AddressBook.findAllByWalletId(walletId);
	};

	isValidAddress = address => {
		try {
			const web3Utils = getGlobalContext().web3Service.web3.utils;
			let toChecksumAddress = web3Utils.toChecksumAddress(address);
			return web3Utils.isHex(address) && web3Utils.isAddress(toChecksumAddress);
		} catch (e) {
			return false;
		}
	};
}

export default AddressBookService;
