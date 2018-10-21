import * as actions from './actions';
import { walletSelectors } from '../wallet';
import { getAddresses } from './selectors';
import { getGlobalContext } from '../context';

const init = () => async (dispatch, getState) => {
	await dispatch(actions.loadAddressBookEntries(walletSelectors.getWallet(getState()).id));
};

const initAdd = () => async dispatch => {
	await dispatch(actions.setLabelError(''));
	await dispatch(actions.setAddressError(''));
};

const initEdit = () => async dispatch => {
	await dispatch(actions.setLabelError(''));
};

const addAddressBookEntry = entry => async (dispatch, getState) => {
	await dispatch(
		actions.addAddressBookEntry({
			...entry,
			walletId: walletSelectors.getWallet(getState()).id
		})
	);
};

const editAddressBookEntry = entry => async dispatch => {
	dispatch(actions.editAddressBookEntry(entry));
};

const deleteAddressBookEntry = id => async dispatch => {
	dispatch(actions.deleteAddressBookEntry(id));
};

const validateLabel = label => async (dispatch, getState) => {
	const hasLessThanTwentyFiveCharacters = label && label.length <= 25;
	const existentAddress = getAddresses(getState()).filter(address => {
		return address.label === label;
	});

	if (hasLessThanTwentyFiveCharacters && existentAddress.length === 0) {
		await dispatch(actions.setLabelError(''));
	}

	if (!hasLessThanTwentyFiveCharacters) {
		await dispatch(actions.setLabelError('Please enter 25 characters or less.'));
	}

	if (existentAddress.length > 0) {
		await dispatch(actions.setLabelError('Label is already being used.'));
	}
};

const validateAddress = address => async (dispatch, getState) => {
	const addressBookService = (getGlobalContext() || {}).addressBookService;
	const isValidAddress = addressBookService.isValidAddress(address);
	const currentWalletAddress = walletSelectors.getWallet(getState()).address;

	if (isValidAddress && currentWalletAddress !== address) {
		await dispatch(actions.setAddressError(''));
	}

	if (!isValidAddress) {
		await dispatch(actions.setAddressError('Invalid ETH address.'));
	}

	if (currentWalletAddress === address) {
		await dispatch(actions.setAddressError(`Sorry, you can't add your current address.`));
	}
};

export default {
	...actions,
	init,
	addAddressBookEntry,
	editAddressBookEntry,
	deleteAddressBookEntry,
	validateLabel,
	validateAddress,
	initAdd,
	initEdit
};
