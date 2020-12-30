import { getGlobalContext } from 'common/context';
import _ from 'lodash';
import crypto from 'crypto';
import { createAliasedAction } from 'electron-redux';
import { walletOperations, walletSelectors } from '../wallet';
import { push } from 'connected-react-router';
import { identityOperations } from '../identity';
import timeoutPromise from 'common/utils/timeout-promise';
import EventEmitter from 'events';
import { Logger } from 'common/logger';
import { featureIsEnabled } from 'common/feature-flags';
import { kycOperations } from '../kyc';
import { schedulerOperations } from '../scheduler';
import { createWalletOperations } from '../create-wallet';

const log = new Logger('app-redux');

const eventEmitter = new EventEmitter();

export const appSelectors = {};

const transformErrorMessage = msg => {
	if (msg === 'Key derivation failed - possibly wrong password') {
		return 'Wrong password. Please try again';
	}
	return msg;
};

const initialState = {
	walletsLoading: false,
	wallets: [],
	seed: null,
	hardwareWallets: [],
	error: '',
	walletType: '',
	settings: {},
	isOnline: true,
	goBackPath: '',
	goNextPath: '',
	selectedPrivateKey: '',
	autoUpdate: {
		info: {},
		progress: {},
		downloaded: false
	},
	keyStoreValue: null
};

const appTypes = {
	APP_SET_WALLETS: 'app/set/WALLETS',
	APP_SET_SEED: 'app/set/SEED',
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
	APP_INSTALL_UPDATE: 'app/update/INSTALL',
	APP_UNLOCK_WALLET: 'app/unlock/wallet',
	APP_SET_KEYSTORE_VALUE: 'app/keystore/SET',
	LOAD_KEYSTORE_VALUE: 'app/keystore/LOAD',
	APP_SEED_UNLOCK_START: 'app/seed/unlock',
	APP_SEED_GENERATE: 'app/seed/generate',
	APP_RESET: 'app/reset',
	APP_SET_SELECTED_PK: 'app/set/selected/private-key'
};

const appActions = {
	setWalletsAction: wallets => ({
		type: appTypes.APP_SET_WALLETS,
		payload: wallets
	}),
	setSeedAction: seed => ({
		type: appTypes.APP_SET_SEED,
		payload: seed
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
	}),
	setKeystoreValue: payload => ({
		type: appTypes.APP_SET_KEYSTORE_VALUE,
		payload
	}),
	resetAppAction: payload => ({
		type: appTypes.APP_RESET,
		payload
	}),
	setSelectedPrivateKeyAction: key => ({
		type: appTypes.APP_SET_SELECTED_PK,
		payload: key
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

const unlockWalletOperation = (wallet, type) => async dispatch => {
	try {
		await dispatch(setEncryptedPrivateKey());
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.loadIdentitiesOperation(wallet.id));
		await dispatch(identityOperations.unlockIdentityOperation());
		if (type) {
			await dispatch(appActions.setWalletType(type));
		}
		getGlobalContext().matomoService.trackEvent(
			'wallet_login',
			'success',
			type,
			undefined,
			true
		);
	} catch (error) {
		getGlobalContext().matomoService.trackEvent(
			'wallet_login',
			'failure',
			type,
			undefined,
			true
		);
		throw error;
	} finally {
		dispatch(appActions.setSeedAction(null));
		dispatch(createWalletOperations.setPasswordAction(''));
		dispatch(appActions.setHardwareWalletsAction([]));
	}
};

const unlockWalletWithPassword = (walletId, password) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithPassword(walletId, password);
		await dispatch(appOperations.unlockWalletOperation(wallet, 'existingAddress'));
		await dispatch(setEncryptedPrivateKey(wallet.privateKey, password));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		getGlobalContext().matomoService.trackEvent(
			'wallet_login',
			'failure',
			'with-password',
			undefined,
			true
		);
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const unlockWalletWithNewFile = (filePath, password) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithNewFile(filePath, password);
		await dispatch(appOperations.unlockWalletOperation(wallet, 'newAddress'));
		await dispatch(setEncryptedPrivateKey(wallet.privateKey, password));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		getGlobalContext().matomoService.trackEvent(
			'wallet_login',
			'failure',
			'with-new-file',
			undefined,
			true
		);
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const unlockWalletWithPrivateKey = (privateKey, password, checkPassword = true) => async (
	dispatch,
	getState
) => {
	const walletService = getGlobalContext().walletService;
	const wallet = await walletService.unlockWalletWithPrivateKey(privateKey, password);
	const wallets = selectApp(getState()).wallets;
	try {
		if (checkPassword && !password && !wallets.find(w => w.address === wallet.address)) {
			await dispatch(appActions.setSelectedPrivateKeyAction(privateKey));
			await dispatch(push('/saveWallet'));
			return;
		}

		await dispatch(appActions.setSelectedPrivateKeyAction(''));
		await dispatch(appOperations.unlockWalletOperation(wallet, 'privateKey'));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		getGlobalContext().matomoService.trackEvent(
			'wallet_login',
			'failure',
			'with-private-key',
			undefined,
			true
		);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const setEncryptedPrivateKey = (privateKey, password) => async dispatch => {
	if (!privateKey || !password) {
		await dispatch(appActions.setKeystoreValue(null));
		return;
	}
	const hash = crypto.createHash('sha256');
	hash.update(password);
	const key = hash.digest();
	const iv = Buffer.concat([crypto.randomBytes(12), Buffer.alloc(4, 0)]);
	const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
	let ctext = iv.toString('hex') + cipher.update(privateKey, 'utf8', 'hex');
	ctext += cipher.final('hex');
	await dispatch(appActions.setKeystoreValue(ctext));
};

const unlockWalletWithPublicKey = (address, path) => async (dispatch, getState) => {
	const walletService = getGlobalContext().walletService;
	const walletType = selectApp(getState()).walletType;
	try {
		const wallet = await walletService.unlockWalletWithPublicKey(address, path, walletType);
		await dispatch(appOperations.unlockWalletOperation(wallet));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		const message = transformErrorMessage(error.message);
		getGlobalContext().matomoService.trackEvent(
			'wallet_login',
			'failure',
			'with-public-key',
			undefined,
			true
		);
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(message));
	}
};

const generateSeedPhraseOperation = () => async (dispatch, getState) => {
	const { walletService } = getGlobalContext();
	const seed = walletService.generateSeedPhrase();
	await dispatch(appActions.setSeedAction(seed));
	return seed;
};

const startSeedUnlockOperation = seed => async dispatch => {
	await dispatch(appActions.setSeedAction(seed));
	await dispatch(loadHDWalletsOperation());
};

const loadHDWalletsOperation = (page = 0) => async (dispatch, getState) => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallets = await walletService.getHDWalletAccounts(
			selectSeed(getState()),
			page * 6,
			6
		);
		await dispatch(appActions.setHardwareWalletsAction(wallets));
		await dispatch(appActions.setWalletType('local'));

		await dispatch(push('/selectAddress'));
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
	} else if (walletType === 'local') {
		await dispatch(loadHDWalletsOperation(page));
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
	const { guideSettingsService } = getGlobalContext();
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
		await dispatch(schedulerOperations.stopSchedulerOperation());
		await dispatch(push('/no-connection'));
	}
	if (!app.isOnline && isOnline) {
		dispatch(schedulerOperations.startSchedulerOperation());
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

const loadKeystoreValue = () => async (dispatch, getState) => {
	const walletService = getGlobalContext().walletService;
	const wallet = walletSelectors.getWallet(getState());
	if (wallet.profile !== 'local' || !wallet.keystoreFilePath) {
		return;
	}
	const keystore = await walletService.loadKeyStoreValue(wallet.keystoreFilePath, wallet.address);
	await dispatch(appActions.setKeystoreValue(Buffer.from(keystore).toString('base64')));
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
	installUpdate,
	unlockWalletOperation,
	loadKeystoreValue,
	startSeedUnlockOperation,
	generateSeedPhraseOperation
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
	),
	unlockWalletOperation: createAliasedAction(
		appTypes.APP_UNLOCK_WALLET,
		operations.unlockWalletOperation
	),
	loadKeystoreValueOperation: createAliasedAction(
		appTypes.LOAD_KEYSTORE_VALUE,
		operations.loadKeystoreValue
	),
	startSeedUnlockOperation: createAliasedAction(
		appTypes.APP_SEED_UNLOCK_START,
		operations.startSeedUnlockOperation
	),
	generateSeedPhraseOperation: createAliasedAction(
		appTypes.APP_SEED_GENERATE,
		operations.generateSeedPhraseOperation
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

const setKeystoreValueReducer = (state, action) => {
	return { ...state, keyStoreValue: action.payload };
};

const setSeedReducer = (state, action) => {
	return { ...state, seed: action.payload };
};

const appResetReducer = (state, action) => {
	return { ...initialState };
};

const appSelectedPrivateKeyReducer = (state, action) => {
	return { ...state, selectedPrivateKey: action.payload };
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
	setAutoUpdateDownloadedReducer,
	setKeystoreValueReducer,
	setSeedReducer,
	appResetReducer,
	appSelectedPrivateKeyReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case appTypes.APP_SET_WALLETS:
			return appReducers.setWalletsReducer(state, action);
		case appTypes.APP_SET_SEED:
			return appReducers.setSeedReducer(state, action);
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
		case appTypes.APP_SET_KEYSTORE_VALUE:
			return appReducers.setKeystoreValueReducer(state, action);
		case appTypes.APP_RESET:
			return appReducers.appResetReducer(state, action);
		case appTypes.APP_SET_SELECTED_PK:
			return appReducers.appSelectedPrivateKeyReducer(state, action);
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

const selectCanExportWallet = state => {
	const wallet = walletSelectors.getWallet(state);
	return (
		featureIsEnabled('walletExport') &&
		!!(wallet && wallet.profile === 'local' && wallet.keystoreFilePath)
	);
};

const selectKeystoreValue = state => selectApp(state).keyStoreValue;

const selectSeed = state => selectApp(state).seed;

_.merge(appSelectors, {
	selectApp,
	hasConnected,
	hasAcceptedTracking,
	selectGoBackPath,
	selectGoNextPath,
	selectWalletType,
	selectAutoUpdateInfo,
	selectAutoUpdateProgress,
	selectAutoUpdateDownloaded,
	selectCanExportWallet,
	selectKeystoreValue,
	selectSeed
});

export { appReducers, appActions, appOperations, appTypes, initialState };

export default reducer;
