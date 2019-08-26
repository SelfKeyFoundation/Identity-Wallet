import * as actions from './actions';
import { walletSelectors } from '../wallet';
import { getAddresses } from './selectors';
import { getGlobalContext } from '../context';
import EthUtils from 'common/utils/eth-utils';

const loadAddressBook = () => async (dispatch, getState) => {
	await dispatch(actions.loadAddressBookEntries(walletSelectors.getWallet(getState()).id));
};

const resetAdd = () => async dispatch => {
	await dispatch(actions.setLabelError(''));
	await dispatch(actions.setAddressError(''));
};

const resetEdit = () => async dispatch => {
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
	await dispatch(actions.editAddressBookEntry(entry));
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
	const context = getGlobalContext() || {};
	const isValidAddress =
		'addressBookService' in context
			? context.addressBookService.isValidAddress(address)
			: EthUtils.isValidAddress(address);
	const currentWalletAddress = walletSelectors.getWallet(getState()).address;
	const existentAddress = getAddresses(getState()).filter(entry => {
		return entry.address === address;
	});

	if (isValidAddress && currentWalletAddress !== address && existentAddress.length === 0) {
		await dispatch(actions.setAddressError(''));
	}

	if (!isValidAddress) {
		await dispatch(actions.setAddressError('Invalid ETH address.'));
	}

	if (currentWalletAddress === address) {
		await dispatch(actions.setAddressError(`Sorry, you can't add your current address.`));
	}

	if (existentAddress.length > 0) {
		await dispatch(actions.setAddressError('Address is already being used.'));
	}
};

export default {
	...actions,
	loadAddressBook,
	addAddressBookEntry,
	editAddressBookEntry,
	deleteAddressBookEntry,
	validateLabel,
	validateAddress,
	resetAdd,
	resetEdit
};
