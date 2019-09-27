import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletOperations, walletSelectors } from '../wallet';
import { appOperations } from '../app';

export const initialState = {
	password: '',
	fileDownloaded: false
};

export const createWalletTypes = {
	CREATE_WALLET_SET_PASSWORD: 'create/wallet/set/PASSWORD',
	CREATE_WALLET_CREATE: 'create/wallet/create',
	CREATE_WALLET_DOWNLOAD: 'create/wallet/download',
	CREATE_WALLET_SET_FILE_DOWNLOADED: 'create/wallet/set/file/downloaded'
};

const createWalletActions = {
	setPasswordAction: password => ({
		type: createWalletTypes.CREATE_WALLET_SET_PASSWORD,
		payload: password
	}),
	setFileDownloadedAction: hasDownloaded => ({
		type: createWalletTypes.CREATE_WALLET_SET_FILE_DOWNLOADED,
		payload: hasDownloaded
	})
};

const createWallet = () => async (dispatch, getState) => {
	const walletService = getGlobalContext().walletService;
	const wallet = await walletService.createWalletWithPassword(getState().createWallet.password);
	await dispatch(walletOperations.updateWalletWithBalance(wallet));
	await dispatch(appOperations.unlockWalletOperation(wallet, 'privateKey'));
};

const downloadFile = toPath => async (dispatch, getState) => {
	const walletService = getGlobalContext().walletService;
	const copied = await walletService.copyKeystoreFile(
		walletSelectors.getWallet(getState()).id,
		toPath
	);
	await dispatch(createWalletActions.setFileDownloadedAction(copied));
};

const operations = {
	createWallet,
	downloadFile
};

const createWalletOperations = {
	...createWalletActions,
	createWalletOperation: createAliasedAction(
		createWalletTypes.CREATE_WALLET_CREATE,
		operations.createWallet
	),
	downloadFileOperation: createAliasedAction(
		createWalletTypes.CREATE_WALLET_DOWNLOAD,
		operations.downloadFile
	)
};

const setPasswordReducer = (state, action) => {
	return { ...state, password: action.payload };
};

const setDownloadedReducer = (state, action) => {
	return { ...state, fileDownloaded: action.payload };
};

const createWalletReducers = {
	setPasswordReducer,
	setDownloadedReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case createWalletTypes.CREATE_WALLET_SET_PASSWORD:
			return createWalletReducers.setPasswordReducer(state, action);
		case createWalletTypes.CREATE_WALLET_SET_FILE_DOWNLOADED:
			return createWalletReducers.setDownloadedReducer(state, action);
	}
	return state;
};

const selectCreateWallet = state => state.createWallet;

const createWalletSelectors = {
	selectCreateWallet
};

export { createWalletSelectors, createWalletReducers, createWalletActions, createWalletOperations };

export default reducer;
