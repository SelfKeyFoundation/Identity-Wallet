import * as actions from './actions';
import { getGlobalContext } from '../context';

const addressBookService = (getGlobalContext() || {}).addressBookService;

const addAddressBookEntry = async entry => {
	return addressBookService.addEntry(entry);
};

export default { ...actions, addAddressBookEntry };
