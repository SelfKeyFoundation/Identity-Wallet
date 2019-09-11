import * as actions from './actions';
import { getWallet, getDidOriginUrl } from './selectors';
import { identitySelectors, identityOperations } from '../identity';

import { getGlobalContext } from 'common/context';
import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';
const hardwalletConfirmationTime = '30000';

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

const resetAssociateDID = () => async dispatch => {
	await dispatch(actions.setAssociateError(''));
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

const createWalletDID = () => async (dispatch, getState) => {
	const walletFromStore = getWallet(getState());
	let identity = identitySelectors.selectCurrentIdentity(getState());
	const didOriginUrl = getDidOriginUrl(getState());
	try {
		let hardwalletConfirmationTimeout = null;
		const walletType = appSelectors.selectWalletType(getState());
		if (walletType === 'ledger' || walletType === 'trezor') {
			await dispatch(push('/main/hd-transaction-timer'));
			hardwalletConfirmationTimeout = setTimeout(async () => {
				clearTimeout(hardwalletConfirmationTimeout);
				await dispatch(push('/main/transaction-timeout'));
			}, hardwalletConfirmationTime);
		}

		const didService = getGlobalContext().didService;
		await dispatch(updateWalletWithBalance({ ...walletFromStore, didPending: true }));
		const gasLimit = await didService.getGasLimit(walletFromStore.publicKey);
		const transaction = didService.createDID(walletFromStore.publicKey, gasLimit);
		transaction.on('receipt', async receipt => {
			const did = receipt.events.CreatedDID.returnValues.id;
			const identityService = getGlobalContext().identityService;
			identity = await identityService.updateIdentityDID(did, identity.id);
			await dispatch(
				updateWalletWithBalance({
					...walletFromStore,
					didPending: false
				})
			);
			await dispatch(identityOperations.updateIdentity(identity));
			await dispatch(push(didOriginUrl));
		});
		transaction.on('transactionHash', async hash => {
			clearTimeout(hardwalletConfirmationTimeout);
			await dispatch(push('/main/create-did-processing'));
		});
		transaction.on('error', async error => {
			clearTimeout(hardwalletConfirmationTimeout);
			const message = error.toString().toLowerCase();
			if (message.indexOf('insufficient funds') !== -1) {
				await dispatch(push('/main/transaction-no-gas-error'));
			} else if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
				await dispatch(push('/main/transaction-declined/Ledger'));
			} else if (error.code === 'Failure_ActionCancelled') {
				await dispatch(push('/main/transaction-declined/Trezor'));
			} else if (error.statusText === 'UNKNOWN_ERROR') {
				await dispatch(push('/main/transaction-unlock'));
			} else {
				await dispatch(push('/main/transaction-error'));
			}
			await dispatch(updateWalletWithBalance({ ...walletFromStore, didPending: false }));
			console.error(error);
		});
	} catch (error) {
		await dispatch(updateWalletWithBalance({ ...walletFromStore, didPending: false }));
		console.error(error);
	}
};

const startCreateDidFlow = didOriginUrl => async (dispatch, getState) => {
	await dispatch(actions.setDidOriginUrl(didOriginUrl));
	await dispatch(push('/main/get-did'));
};

const startAssociateDidFlow = didOriginUrl => async (dispatch, getState) => {
	await dispatch(actions.setDidOriginUrl(didOriginUrl));
	await dispatch(push('/main/enter-did'));
};

const updateWalletDID = (walletId, did) => async (dispatch, getState) => {
	try {
		const walletFromStore = getWallet(getState());
		let identity = identitySelectors.selectCurrentIdentity(getState());
		const DIDService = getGlobalContext().didService;
		const controllerAddress = await DIDService.getControllerAddress(did);
		if (walletFromStore.publicKey.toLowerCase() === controllerAddress.toLowerCase()) {
			const identityService = getGlobalContext().identityService;
			identity = await identityService.updateIdentityDID(did, identity.id);
			await dispatch(identityOperations.updateIdentity(identity));
			await dispatch(actions.setAssociateError('none'));
		} else {
			await dispatch(
				actions.setAssociateError(
					'The DID provided is not derived from the current wallet.'
				)
			);
		}
	} catch (error) {
		console.error(error);
		await dispatch(actions.setAssociateError('Invalid DID'));
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
	resetAssociateDID,
	updateWalletAvatar: createAliasedAction(types.WALLET_AVATAR_UPDATE, updateWalletAvatar),
	updateWalletName: createAliasedAction(types.WALLET_NAME_UPDATE, updateWalletName),
	updateWalletSetup: createAliasedAction(types.WALLET_SETUP_UPDATE, updateWalletSetup),
	createWalletDID: createAliasedAction(types.WALLET_DID_CREATE, createWalletDID),
	updateWalletDID: createAliasedAction(types.WALLET_DID_UPDATE, updateWalletDID),
	startCreateDidFlow: createAliasedAction(types.WALLET_START_DID_FLOW, startCreateDidFlow),
	startAssociateDidFlow: createAliasedAction(
		types.WALLET_START_ASSOCIATE_DID_FLOW,
		startAssociateDidFlow
	)
};
