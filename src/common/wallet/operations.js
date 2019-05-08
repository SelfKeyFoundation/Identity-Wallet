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

const createWalletDID = walletId => async (dispatch, getState) => {
	try {
		const DIDService = getGlobalContext().DIDService;
		const transaction = await DIDService.createDID();
		const did = transaction.events.CreatedDID.returnValues.id;

		const walletService = getGlobalContext().walletService;
		const wallet = await walletService.updateDID(walletId, did);
		const walletFromStore = getWallet(getState());
		await dispatch(updateWalletWithBalance({ ...walletFromStore, did: wallet.did }));
	} catch (error) {
		console.error(error);
	}
};

const updateWalletDID = (walletId, did) => async (dispatch, getState) => {
	try {
		const walletFromStore = getWallet(getState());
		const DIDService = getGlobalContext().DIDService;
		const controllerAddress = await DIDService.getControllerAddress();

		if (walletFromStore.publicKey === controllerAddress) {
			const walletService = getGlobalContext().walletService;
			const wallet = await walletService.updateDID(walletId, did);
			await dispatch(updateWalletWithBalance({ ...walletFromStore, did: wallet.did }));
		} else {
			// TODO - dispatch action with error to show that DID is not devived from the current wallet
		}
	} catch (error) {
		console.error(error);
	}
};

const updateWalletSetup = (setup, walletId) => async (dispatch, getState) => {
	try {
		const walletService = getGlobalContext().walletService;
		const wallet = await walletService.updateWalletSetup(setup, walletId);
		const walletFromStore = getWallet(getState());
		await dispatch(
			updateWalletWithBalance({ ...walletFromStore, isSetupFinished: wallet.isSetupFinished })
		);
	} catch (error) {
		console.error(error);
	}
};

export default {
	...actions,
	updateWalletWithBalance,
	refreshWalletBalance,
	updateWalletAvatar: createAliasedAction(types.WALLET_AVATAR_UPDATE, updateWalletAvatar),
	updateWalletName: createAliasedAction(types.WALLET_NAME_UPDATE, updateWalletName),
	updateWalletSetup: createAliasedAction(types.WALLET_SETUP_UPDATE, updateWalletSetup),
	createWalletDID: createAliasedAction(types.WALLET_DID_CREATE, createWalletDID),
	updateWalletDID: createAliasedAction(types.WALLET_DID_UPDATE, updateWalletDID)
};
