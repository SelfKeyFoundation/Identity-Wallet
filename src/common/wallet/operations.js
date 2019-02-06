import * as actions from './actions';
import { getWallet } from './selectors';
import EthUnits from 'common/utils/eth-units';
import { getGlobalContext } from 'common/context';
import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const getWalletWithBalance = async wallet => {
	const walletService = getGlobalContext().walletService;
	const balanceWei = await walletService.getBalance(wallet.id);

	return {
		...wallet,
		balance: EthUnits.toEther(balanceWei, 'wei')
	};
};

const updateWalletWithBalance = wallet => async dispatch => {
	await dispatch(actions.updateWallet(await getWalletWithBalance(wallet)));
};

const refreshWalletBalance = () => async (dispatch, getState) => {
	await dispatch(actions.updateWallet(await getWalletWithBalance(getWallet(getState()))));
};

const updateWalletAvatar = (avatar, walletId) => async (dispatch, getState) => {
	try {
		const walletService = getGlobalContext().walletService;
		await walletService.updateWalletAvatar(avatar, walletId);
		const wallet = getWallet(getState());
		await dispatch(updateWalletWithBalance({ ...wallet, profilePicture: avatar }));
	} catch (error) {
		console.error(error);
	}
};

export default {
	...actions,
	updateWalletWithBalance,
	refreshWalletBalance,
	updateWalletAvatar: createAliasedAction(types.WALLET_AVATAR_UPDATE, updateWalletAvatar)
};
