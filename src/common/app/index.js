import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletOperations } from '../wallet';
import { push } from 'connected-react-router';
import { identityOperations } from '../identity';

export const initialState = {
	wallets: [],
	error: ''
};

export const appTypes = {
	APP_SET_WALLETS: 'app/set/WALLETS',
	APP_SET_UNLOCK_WALLET_ERROR: 'app/set/unlock/wallet/ERROR',
	APP_UNLOCK_WALLET_WITH_PASSWORD: 'app/unlock/wallet/with/PASSWORD',
	APP_LOAD_WALLETS: 'app/load/WALLETS'
};

const appActions = {
	setWalletsAction: wallets => ({
		type: appTypes.APP_SET_WALLETS,
		payload: wallets
	}),
	setUnlockWalletErrorAction: error => ({
		type: appTypes.APP_SET_UNLOCK_WALLET_ERROR,
		payload: error
	})
};

const loadWallets = () => async dispatch => {
	const walletService = getGlobalContext().walletService;
	const wallets = await walletService.getWallets();
	await dispatch(appActions.setWalletsAction(wallets));
};

const unlockWalletWithPassword = (walletId, password) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithPassword(walletId, password);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.unlockIdentityOperation(wallet.id));
		await dispatch(push('/main'));
	} catch (error) {
		await dispatch(appActions.setUnlockWalletErrorAction(error.message));
	}
};

const operations = {
	loadWallets,
	unlockWalletWithPassword
};

const appOperations = {
	...appActions,
	loadWalletsOperation: createAliasedAction(appTypes.APP_LOAD_WALLETS, operations.loadWallets),
	unlockWalletWithPasswordOperation: createAliasedAction(
		appTypes.APP_UNLOCK_WALLET_WITH_PASSWORD,
		operations.unlockWalletWithPassword
	)
};

const setWalletsReducer = (state, action) => {
	return { ...state, wallets: action.payload };
};

const setUnlockWalletErrorReducer = (state, action) => {
	return { ...state, error: action.payload };
};

const appReducers = {
	setWalletsReducer,
	setUnlockWalletErrorReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case appTypes.APP_SET_WALLETS:
			return appReducers.setWalletsReducer(state, action);
		case appTypes.APP_SET_UNLOCK_WALLET_ERROR:
			return appReducers.setUnlockWalletErrorReducer(state, action);
	}
	return state;
};

const selectApp = state => state.app;

const appSelectors = {
	selectApp
};

export { appSelectors, appReducers, appActions, appOperations };

export default reducer;
