import * as actions from './actions';
import { getWallet } from './selectors';

import { getGlobalContext } from 'common/context';
import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const getWalletWithBalance = async wallet => {
	const walletService = getGlobalContext().walletService;
	const balance = await walletService.getBalance(wallet.id);

	return {
		...wallet,
		balance
	};
};

const updateWalletWithBalance = wallet => async dispatch => {
	await dispatch(actions.updateWallet(await getWalletWithBalance(wallet)));
};

const refreshWalletBalance = () => async (dispatch, getState) => {
	await dispatch(actions.updateWallet(await getWalletWithBalance(getWallet(getState()))));
};

const updateWalletName = (name, walletId) => async (dispatch, getState) => {
	try {
		const walletService = getGlobalContext().walletService;
		const wallet = await walletService.updateWalletName(name, walletId);
		const walletFromStore = getWallet(getState());
		await dispatch(updateWalletWithBalance({ ...walletFromStore, name: wallet.name }));
	} catch (error) {
		console.error(error);
	}
};

const setLoanCardStatus = (status = false) => async (dispatch, getState) => {
	const walletFromStore = getWallet(getState());
	console.log(walletFromStore);
	walletFromStore.loanCardStatus = status;
	await dispatch(updateWalletWithBalance({ ...walletFromStore, loanCardStatus: status }));
};

export default {
	...actions,
	updateWalletWithBalance,
	refreshWalletBalance,
	setLoanCardStatusOperation: createAliasedAction(
		types.WALLET_SET_LOAN_CALCULATOR_CARD_STATUS,
		setLoanCardStatus
	),
	updateWalletName: createAliasedAction(types.WALLET_NAME_UPDATE, updateWalletName)
};
