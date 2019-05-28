import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletOperations } from '../wallet';
import { push } from 'connected-react-router';
import { identityOperations } from '../identity';
import timeoutPromise from 'common/utils/timeout-promise';
import EventEmitter from 'events';
import { Logger } from 'common/logger';
import { kycOperations } from '../kyc';

const log = new Logger('app-redux');

const eventEmitter = new EventEmitter();

const transformErrorMessage = msg => {
	if (msg === 'Key derivation failed - possibly wrong password') {
		return 'Wrong password. Please try again';
	}
	return msg;
};

export const initialState = {
	walletsLoading: false,
	wallets: [],
	hardwareWallets: [],
	error: '',
	walletType: '',
	settings: {},
	isOnline: true,
	goBackPath: '',
	goNextPath: '',
	autoUpdate: {
		info: {},
		progress: {},
		downloaded: false
	}
};

export const appTypes = {
	APP_SET_WALLETS: 'app/set/WALLETS',
	APP_SET_WALLETS_LOADING: 'app/set/WALLETS_LOADING',
	APP_SET_SETTINGS: 'app/set/SETTINGS',
	APP_SET_HARDWARE_WALLETS: 'app/set/hardware/WALLETS',
	APP_SET_WALLET_TYPE: 'app/set/wallet/TYPE',
	APP_SET_UNLOCK_WALLET_ERROR: 'app/set/unlock/wallet/ERROR',
	APP_UNLOCK_WALLET_WITH_PASSWORD: 'app/unlock/wallet/with/PASSWORD',
	APP_UNLOCK_WALLET_WITH_NEW_FILE: 'app/unlock/wallet/with/new/FILE',
	APP_UNLOCK_WALLET_WITH_PRIVATE_KEY: 'app/unlock/wallet/with/private/KEY',
	APP_UNLOCK_WALLET_WITH_PUBLIC_KEY: 'app/unlock/wallet/with/public/KEY',
	APP_LOAD_LEDGER_WALLETS: 'app/load/ledger/WALLETS',
	APP_LOAD_TREZOR_WALLETS: 'app/load/trezor/WALLETS',
	APP_LOAD_WALLETS: 'app/load/WALLETS',
	APP_LOAD_OTHER_HARDWARE_WALLETS: 'app/load/other/hardware/WALLETS',
	APP_ENTER_TREZOR_PIN: 'app/enter/trezor/PIN',
	APP_ENTER_TREZOR_PASSPHRASE: 'app/enter/trezor/PASSPHRASE',
	APP_LOADING: 'app/LOADING',
	APP_SET_TERMS_ACCEPTED: 'app/set/term/ACCEPTED',
	APP_UPDATE_NETWORK_STATUS: 'app/network/status/UPDATE',
	APP_SET_NETWORK_STATUS: 'app/network/status/SET',
	APP_SET_GO_NEXT_PATH: 'app/go/next/path/SET',
	APP_SET_GO_BACK_PATH: 'app/go/back/path/SET',
	APP_START_AUTO_UPDATE: 'app/auto/update/START',
	APP_SET_AUTO_UPDATE_INFO: 'app/auto/update/info/SET',
	APP_SET_AUTO_UPDATE_PROGRESS: 'app/auto/update/progress/SET',
	APP_SET_AUTO_UPDATE_DOWNLOADED: 'app/auto/update/downloaded/SET',
	APP_DOWNLOAD_UPDATE: 'app/update/DOWNLOAD',
	APP_INSTALL_UPDATE: 'app/update/INSTALL'
};

const appActions = {
	setWalletsAction: wallets => ({
		type: appTypes.APP_SET_WALLETS,
		payload: wallets
	}),
	setSettingsAction: settings => ({
		type: appTypes.APP_SET_SETTINGS,
		payload: settings
	}),
	setHardwareWalletsAction: wallets => ({
		type: appTypes.APP_SET_HARDWARE_WALLETS,
		payload: wallets
	}),
	setUnlockWalletErrorAction: error => ({
		type: appTypes.APP_SET_UNLOCK_WALLET_ERROR,
		payload: error
	}),
	setWalletType: type => ({
		type: appTypes.APP_SET_WALLET_TYPE,
		payload: type
	}),
	setWalletsLoading: isLoading => ({
		type: appTypes.APP_SET_WALLETS_LOADING,
		payload: isLoading
	}),
	setNetworkStatus: isOnline => ({
		type: appTypes.APP_SET_NETWORK_STATUS,
		payload: isOnline
	}),
	setGoBackPath: path => ({
		type: appTypes.APP_SET_GO_BACK_PATH,
		payload: path
	}),
	setGoNextPath: path => ({
		type: appTypes.APP_SET_GO_NEXT_PATH,
		payload: path
	}),
	setAutoUpdateInfoAction: info => ({
		type: appTypes.APP_SET_AUTO_UPDATE_INFO,
		payload: info
	}),
	setAutoUpdateProgressAction: progress => ({
		type: appTypes.APP_SET_AUTO_UPDATE_PROGRESS,
		payload: progress
	}),
	setAutoUpdateDownloadedAction: downloaded => ({
		type: appTypes.APP_SET_AUTO_UPDATE_DOWNLOADED,
		payload: downloaded
	})
};

const loadWallets = () => async dispatch => {
	await dispatch(appActions.setWalletsLoading(true));
	await dispatch(appActions.setHardwareWalletsAction([]));
	await dispatch(appActions.setWalletsLoading(''));
	await dispatch(kycOperations.clearRelyingPartyOperation());
	await dispatch(appActions.setWalletType(''));
	await dispatch(appActions.setGoBackPath(''));
	await dispatch(appActions.setGoNextPath(''));

	try {
		const walletService = getGlobalContext().walletService;
		const wallets = await walletService.getWallets();
		await dispatch(appActions.setWalletsAction(wallets));
	} finally {
		await dispatch(appActions.setWalletsLoading(false));
	}
};

const unlockWalletWithPassword = (walletId, password) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithPassword(walletId, password);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.unlockIdentityOperation(wallet.id));
		await dispatch(appActions.setWalletType('existingAddress'));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const unlockWalletWithNewFile = (filePath, password) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithNewFile(filePath, password);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.unlockIdentityOperation(wallet.id));
		await dispatch(appActions.setWalletType('newAddress'));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const unlockWalletWithPrivateKey = privateKey => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithPrivateKey(privateKey);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.unlockIdentityOperation(wallet.id));
		await dispatch(appActions.setWalletType('privateKey'));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const unlockWalletWithPublicKey = (publicKey, path) => async (dispatch, getState) => {
	const walletService = getGlobalContext().walletService;
	const walletType = selectApp(getState()).walletType;
	try {
		const wallet = await walletService.unlockWalletWithPublicKey(publicKey, path, walletType);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.unlockIdentityOperation(wallet.id));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const loadLedgerWallets = (page = 0) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const accountsQuantity = 6;
		const wallets = await timeoutPromise(
			30000,
			walletService.getLedgerWallets(page, accountsQuantity)
		).promise;
		await dispatch(appActions.setHardwareWalletsAction(wallets));
		await dispatch(appActions.setWalletType('ledger'));
		await dispatch(push('/selectAddress'));
	} catch (error) {
		log.error(error);
		const message = transformErrorMessage(error.message);
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const loadTrezorWallets = (page = 0) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	let timeoutId = '';
	try {
		if (eventEmitter.listenerCount('TREZOR_PIN_REQUEST') === 0) {
			eventEmitter.on('TREZOR_PIN_REQUEST', async () => {
				await dispatch(push('/enterTrezorPin'));
			});
		}

		if (eventEmitter.listenerCount('TREZOR_PASSPHRASE_REQUEST') === 0) {
			eventEmitter.on('TREZOR_PASSPHRASE_REQUEST', async () => {
				await dispatch(push('/enterTrezorPassphrase'));
			});
		}
		const accountsQuantity = 6;
		const timeoutPromiseObject = timeoutPromise(
			60000,
			walletService.getTrezorWallets(page, accountsQuantity, eventEmitter)
		);
		timeoutId = timeoutPromiseObject.id;
		const wallets = await timeoutPromiseObject.promise;
		await dispatch(appActions.setHardwareWalletsAction(wallets));
		await dispatch(appActions.setWalletType('trezor'));
		await dispatch(push('/selectAddress'));
	} catch (error) {
		clearTimeout(timeoutId);
		eventEmitter.off('TREZOR_PIN_REQUEST', () => {});
		log.error(error);
		if (error.message.indexOf('PIN canceled') === -1) {
			const message = transformErrorMessage(error.message);
			await dispatch(appActions.setUnlockWalletErrorAction(message));
		}
		if (error.message.indexOf('PIN invalid') !== -1) {
			await dispatch(loadTrezorWallets(page));
		}
	}
};

const loadOtherHardwareWallets = page => async (dispatch, getState) => {
	const walletType = selectApp(getState()).walletType;
	if (walletType === 'ledger') {
		await dispatch(loadLedgerWallets(page));
	} else if (walletType === 'trezor') {
		await dispatch(loadTrezorWallets(page));
	}
};

const enterTrezorPin = (error, pin) => async () => {
	if (error !== null) {
		eventEmitter.off('TREZOR_PIN_REQUEST', () => {});
	}
	eventEmitter.emit('ON_PIN', error, pin);
};

const enterTrezorPassphrase = (error, passphrase) => async () => {
	if (error !== null) {
		eventEmitter.off('TREZOR_PASSPHRASE_REQUEST', () => {});
	}
	eventEmitter.emit('ON_PASSPHRASE', error, passphrase);
};

const loading = () => async dispatch => {
	const guideSettingsService = getGlobalContext().guideSettingsService;
	const settings = await guideSettingsService.getSettings();
	await dispatch(appActions.setSettingsAction(settings));

	if (!settings.termsAccepted) {
		await dispatch(push('/terms'));
	} else {
		await dispatch(push('/home'));
	}
};

const networkStatusUpdateOperation = isOnline => async (dispatch, getState) => {
	const app = appSelectors.selectApp(getState());
	if (app.isOnline === isOnline) return;
	if (app.isOnline && !isOnline) {
		await dispatch(push('/no-connection'));
	}
	if (!app.isOnline && isOnline) {
		await dispatch(push('/'));
	}
	await dispatch(appOperations.setNetworkStatus(isOnline));
};

const setTermsAccepted = (isTermsAccepted, crashReportAgreement) => async (dispatch, getState) => {
	const guideSettingsService = getGlobalContext().guideSettingsService;
	const settings = selectApp(getState()).settings;
	settings.termsAccepted = isTermsAccepted;
	settings.crashReportAgreement = crashReportAgreement ? 1 : 0;
	const newSettings = await guideSettingsService.setSettings(settings);
	await dispatch(appActions.setSettingsAction(newSettings));
	await dispatch(push('/home'));
};

const startAutoUpdate = () => async dispatch => {
	const autoUpdateService = getGlobalContext().autoUpdateService;

	autoUpdateService.on('update-available', async info => {
		await dispatch(appActions.setAutoUpdateInfoAction(info));
		await dispatch(push('/auto-update'));
	});

	autoUpdateService.on('download-progress', async progress => {
		await dispatch(appActions.setAutoUpdateProgressAction(progress));
	});

	autoUpdateService.on('update-downloaded', async () => {
		await dispatch(appActions.setAutoUpdateDownloadedAction(true));
	});

	await autoUpdateService.checkForUpdatesAndNotify();
};

const downloadUpdate = () => async dispatch => {
	const autoUpdateService = getGlobalContext().autoUpdateService;
	await dispatch(push('/auto-update-progress'));
	await autoUpdateService.downloadUpdate();
};

const installUpdate = () => async () => {
	const autoUpdateService = getGlobalContext().autoUpdateService;
	await autoUpdateService.quitAndInstall();
};

const operations = {
	loadWallets,
	unlockWalletWithPassword,
	unlockWalletWithNewFile,
	unlockWalletWithPrivateKey,
	unlockWalletWithPublicKey,
	loadLedgerWallets,
	loadTrezorWallets,
	enterTrezorPin,
	enterTrezorPassphrase,
	loadOtherHardwareWallets,
	loading,
	setTermsAccepted,
	networkStatusUpdateOperation,
	startAutoUpdate,
	downloadUpdate,
	installUpdate
};

const appOperations = {
	...appActions,
	loadWalletsOperation: createAliasedAction(appTypes.APP_LOAD_WALLETS, operations.loadWallets),
	unlockWalletWithPasswordOperation: createAliasedAction(
		appTypes.APP_UNLOCK_WALLET_WITH_PASSWORD,
		operations.unlockWalletWithPassword
	),
	unlockWalletWithNewFileOperation: createAliasedAction(
		appTypes.APP_UNLOCK_WALLET_WITH_NEW_FILE,
		operations.unlockWalletWithNewFile
	),
	unlockWalletWithPrivateKeyOperation: createAliasedAction(
		appTypes.APP_UNLOCK_WALLET_WITH_PRIVATE_KEY,
		operations.unlockWalletWithPrivateKey
	),
	unlockWalletWithPublicKeyOperation: createAliasedAction(
		appTypes.APP_UNLOCK_WALLET_WITH_PUBLIC_KEY,
		operations.unlockWalletWithPublicKey
	),
	loadLedgerWalletsOperation: createAliasedAction(
		appTypes.APP_LOAD_LEDGER_WALLETS,
		operations.loadLedgerWallets
	),
	loadTrezorWalletsOperation: createAliasedAction(
		appTypes.APP_LOAD_TREZOR_WALLETS,
		operations.loadTrezorWallets
	),
	enterTrezorPinOperation: createAliasedAction(
		appTypes.APP_ENTER_TREZOR_PIN,
		operations.enterTrezorPin
	),
	enterTrezorPassphraseOperation: createAliasedAction(
		appTypes.APP_ENTER_TREZOR_PASSPHRASE,
		operations.enterTrezorPassphrase
	),
	loadOtherHardwareWalletsOperation: createAliasedAction(
		appTypes.APP_LOAD_OTHER_HARDWARE_WALLETS,
		operations.loadOtherHardwareWallets
	),
	loadingOperation: createAliasedAction(appTypes.APP_LOADING, operations.loading),
	setTermsAcceptedOperation: createAliasedAction(
		appTypes.APP_SET_TERMS_ACCEPTED,
		operations.setTermsAccepted
	),
	networkStatusUpdateOperation: createAliasedAction(
		appTypes.APP_SET_NETWORK_STATUS,
		operations.networkStatusUpdateOperation
	),
	startAutoUpdateOperation: createAliasedAction(
		appTypes.APP_START_AUTO_UPDATE,
		operations.startAutoUpdate
	),
	downloadUpdateOperation: createAliasedAction(
		appTypes.APP_DOWNLOAD_UPDATE,
		operations.downloadUpdate
	),
	installUpdateOperation: createAliasedAction(
		appTypes.APP_INSTALL_UPDATE,
		operations.installUpdate
	)
};

const setWalletsReducer = (state, action) => {
	return { ...state, wallets: action.payload };
};

const setWalletsLoadingReducer = (state, action) => {
	return { ...state, walletsLoading: action.payload };
};

const setHardwareWalletsReducer = (state, action) => {
	return { ...state, hardwareWallets: action.payload };
};

const setSettingsReducer = (state, action) => {
	return { ...state, settings: action.payload };
};

const setUnlockWalletErrorReducer = (state, action) => {
	return { ...state, error: action.payload };
};

const setWalletTypeReducer = (state, action) => {
	return { ...state, walletType: action.payload };
};

const setNetworkStatusReducer = (state, action) => {
	return { ...state, isOnline: action.payload };
};

const setGoBackPathReducer = (state, action) => {
	return { ...state, goBackPath: action.payload };
};

const setGoNextPathReducer = (state, action) => {
	return { ...state, goNextPath: action.payload };
};

const setAutoUpdateInfoReducer = (state, action) => {
	return { ...state, autoUpdate: { ...state.autoUpdate, info: action.payload } };
};

const setAutoUpdateProgressReducer = (state, action) => {
	return { ...state, autoUpdate: { ...state.autoUpdate, progress: action.payload } };
};

const setAutoUpdateDownloadedReducer = (state, action) => {
	return { ...state, autoUpdate: { ...state.autoUpdate, downloaded: action.payload } };
};

const appReducers = {
	setWalletsReducer,
	setWalletsLoadingReducer,
	setSettingsReducer,
	setHardwareWalletsReducer,
	setUnlockWalletErrorReducer,
	setWalletTypeReducer,
	setNetworkStatusReducer,
	setGoNextPathReducer,
	setGoBackPathReducer,
	setAutoUpdateInfoReducer,
	setAutoUpdateProgressReducer,
	setAutoUpdateDownloadedReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case appTypes.APP_SET_WALLETS:
			return appReducers.setWalletsReducer(state, action);
		case appTypes.APP_SET_WALLETS_LOADING:
			return appReducers.setWalletsLoadingReducer(state, action);
		case appTypes.APP_SET_SETTINGS:
			return appReducers.setSettingsReducer(state, action);
		case appTypes.APP_SET_HARDWARE_WALLETS:
			return appReducers.setHardwareWalletsReducer(state, action);
		case appTypes.APP_SET_UNLOCK_WALLET_ERROR:
			return appReducers.setUnlockWalletErrorReducer(state, action);
		case appTypes.APP_SET_WALLET_TYPE:
			return appReducers.setWalletTypeReducer(state, action);
		case appTypes.APP_SET_NETWORK_STATUS:
			return appReducers.setNetworkStatusReducer(state, action);
		case appTypes.APP_SET_GO_BACK_PATH:
			return appReducers.setGoBackPathReducer(state, action);
		case appTypes.APP_SET_GO_NEXT_PATH:
			return appReducers.setGoNextPathReducer(state, action);
		case appTypes.APP_SET_AUTO_UPDATE_INFO:
			return appReducers.setAutoUpdateInfoReducer(state, action);
		case appTypes.APP_SET_AUTO_UPDATE_PROGRESS:
			return appReducers.setAutoUpdateProgressReducer(state, action);
		case appTypes.APP_SET_AUTO_UPDATE_DOWNLOADED:
			return appReducers.setAutoUpdateDownloadedReducer(state, action);
	}
	return state;
};

const selectApp = state => state.app;

const hasConnected = state => {
	const app = selectApp(state);
	return app.hardwareWallets.length > 0;
};

const hasAcceptedTracking = state => {
	const app = selectApp(state);
	return app.settings && app.settings.crashReportAgreement === 1;
};

const selectGoBackPath = state => {
	return selectApp(state).goBackPath;
};

const selectGoNextPath = state => {
	return selectApp(state).goNextPath;
};

const selectWalletType = state => {
	return selectApp(state).walletType;
};

const selectAutoUpdateInfo = state => {
	return selectApp(state).autoUpdate.info;
};

const selectAutoUpdateProgress = state => {
	return selectApp(state).autoUpdate.progress;
};

const selectAutoUpdateDownloaded = state => {
	return selectApp(state).autoUpdate.downloaded;
};

const appSelectors = {
	selectApp,
	hasConnected,
	hasAcceptedTracking,
	selectGoBackPath,
	selectGoNextPath,
	selectWalletType,
	selectAutoUpdateInfo,
	selectAutoUpdateProgress,
	selectAutoUpdateDownloaded
};

export { appSelectors, appReducers, appActions, appOperations };

export default reducer;
