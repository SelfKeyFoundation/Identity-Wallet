import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletOperations } from '../wallet';
import { push } from 'connected-react-router';
import { identityOperations } from '../identity';
import timeoutPromise from 'common/utils/timeout-promise';
import EventEmitter from 'events';
import { Logger } from 'common/logger';

const log = new Logger('app-redux');

const eventEmitter = new EventEmitter();

export const initialState = {
	wallets: [],
	hardwareWallets: [],
	error: '',
	hardwareWalletType: '',
	settings: {}
};

export const appTypes = {
	APP_SET_WALLETS: 'app/set/WALLETS',
	APP_SET_SETTINGS: 'app/set/SETTINGS',
	APP_SET_HARDWARE_WALLETS: 'app/set/hardware/WALLETS',
	APP_SET_HARDWARE_WALLET_TYPE: 'app/set/hardware/wallet/TYPE',
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
	APP_SET_TERMS_ACCEPTED: 'app/set/term/ACCEPTED'
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
	setHardwareWalletType: type => ({
		type: appTypes.APP_SET_HARDWARE_WALLET_TYPE,
		payload: type
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
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		await dispatch(appActions.setUnlockWalletErrorAction(error.message));
	}
};

const unlockWalletWithNewFile = (filePath, password) => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithNewFile(filePath, password);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.unlockIdentityOperation(wallet.id));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		await dispatch(appActions.setUnlockWalletErrorAction(error.message));
	}
};

const unlockWalletWithPrivateKey = privateKey => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithPrivateKey(privateKey);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(identityOperations.unlockIdentityOperation(wallet.id));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		await dispatch(appActions.setUnlockWalletErrorAction(error.message));
	}
};

const unlockWalletWithPublicKey = publicKey => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallet = await walletService.unlockWalletWithPublicKey(publicKey);
		await dispatch(walletOperations.updateWalletWithBalance(wallet));
		await dispatch(push('/main/dashboard'));
	} catch (error) {
		await dispatch(appActions.setUnlockWalletErrorAction(error.message));
	}
};

const loadLedgerWallets = page => async dispatch => {
	const walletService = getGlobalContext().walletService;
	try {
		const wallets = await timeoutPromise(30000, walletService.getLedgerWallets(page)).promise;
		await dispatch(appActions.setHardwareWalletsAction(wallets));
		await dispatch(appActions.setHardwareWalletType('ledger'));
		await dispatch(push('/selectAddress'));
	} catch (error) {
		log.error(error);
		await dispatch(appActions.setUnlockWalletErrorAction(error.message));
	}
};

const loadTrezorWallets = page => async dispatch => {
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
		const timeoutPromiseObject = timeoutPromise(
			60000,
			walletService.getTrezorWallets(page, eventEmitter)
		);
		timeoutId = timeoutPromiseObject.id;
		const wallets = await timeoutPromiseObject.promise;
		await dispatch(appActions.setHardwareWalletsAction(wallets));
		await dispatch(appActions.setHardwareWalletType('trezor'));
		await dispatch(push('/selectAddress'));
	} catch (error) {
		clearTimeout(timeoutId);
		eventEmitter.off('TREZOR_PIN_REQUEST', () => {});
		if (error.message.indexOf('PIN canceled') === -1) {
			await dispatch(appActions.setUnlockWalletErrorAction(error.message));
		}
		if (error.message.indexOf('PIN invalid') !== -1) {
			await dispatch(loadTrezorWallets(page));
		}
	}
};

const loadOtherHardwareWallets = page => async (dispatch, getState) => {
	const hardwareWalletType = selectApp(getState()).hardwareWalletType;
	if (hardwareWalletType === 'ledger') {
		await dispatch(loadLedgerWallets(page));
	} else if (hardwareWalletType === 'trezor') {
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

const setTermsAccepted = (isTermsAccepted, crashReportAgreement) => async (dispatch, getState) => {
	const guideSettingsService = getGlobalContext().guideSettingsService;
	const settings = selectApp(getState()).settings;
	settings.termsAccepted = isTermsAccepted;
	settings.crashReportAgreement = crashReportAgreement ? 1 : 0;
	const newSettings = await guideSettingsService.setSettings(settings);
	await dispatch(appActions.setSettingsAction(newSettings));
	await dispatch(push('/home'));
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
	setTermsAccepted
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
	)
};

const setWalletsReducer = (state, action) => {
	return { ...state, wallets: action.payload };
};

const setHardwareWalletsReducer = (state, action) => {
	return { ...state, hardwareWallets: action.payload };
};

const setUnlockWalletErrorReducer = (state, action) => {
	return { ...state, error: action.payload };
};

const setHardwareWalletTypeReducer = (state, action) => {
	return { ...state, hardwareWalletType: action.payload };
};

const setSettingsReducer = (state, action) => {
	return { ...state, settings: action.payload };
};

const appReducers = {
	setWalletsReducer,
	setSettingsReducer,
	setHardwareWalletsReducer,
	setUnlockWalletErrorReducer,
	setHardwareWalletTypeReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case appTypes.APP_SET_WALLETS:
			return appReducers.setWalletsReducer(state, action);
		case appTypes.APP_SET_SETTINGS:
			return appReducers.setSettingsReducer(state, action);
		case appTypes.APP_SET_HARDWARE_WALLETS:
			return appReducers.setHardwareWalletsReducer(state, action);
		case appTypes.APP_SET_UNLOCK_WALLET_ERROR:
			return appReducers.setUnlockWalletErrorReducer(state, action);
		case appTypes.APP_SET_HARDWARE_WALLET_TYPE:
			return appReducers.setHardwareWalletTypeReducer(state, action);
	}
	return state;
};

const selectApp = state => state.app;

const hasConnected = state => {
	const app = selectApp(state);
	return app.hardwareWallets.length > 0;
};

const appSelectors = {
	selectApp,
	hasConnected
};

export { appSelectors, appReducers, appActions, appOperations };

export default reducer;
