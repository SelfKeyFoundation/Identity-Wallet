import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import { getWallet } from '../wallet/selectors';
import { identitySelectors } from 'common/identity';
import { Identity } from '../../main/platform/identity';
import { createSelector } from 'reselect';
import { createAliasedSlice } from '../utils/duck';
import { hardwareWalletOperations } from '../hardware-wallet';
import { navigationFlowOperations } from '../navigation/flow';
import { validate } from 'parameter-validator';
import { sleep } from '../utils/async';

const log = new Logger('MoonpayAuthDuck');

const SLICE_NAME = 'moonPayAuth';

const initialState = {
	agreedToTerms: false,
	loginEmail: null,
	authInfo: null,
	authError: null,
	authenticatedPreviously: false,
	isServiceAllowed: false,
	settingsLoaded: false,
	authInProgress: false,
	limits: null
};

const selectSelf = state => state[SLICE_NAME];

const selectAuthInfo = createSelector(
	selectSelf,
	state => state.authInfo
);

const isAuthenticated = createSelector(
	selectAuthInfo,
	auth => !!auth
);

const isServiceAllowed = createSelector(
	selectSelf,
	({ isServiceAllowed }) => isServiceAllowed
);

const hasAgreedToTerms = createSelector(
	selectSelf,
	({ agreedToTerms }) => agreedToTerms
);

const getLoginEmail = createSelector(
	selectSelf,
	({ loginEmail }) => loginEmail
);

const haveSettingsLoaded = createSelector(
	selectSelf,
	({ settingsLoaded }) => settingsLoaded
);

const hasAuthenticatedPreviously = createSelector(
	selectSelf,
	({ authenticatedPreviously }) => authenticatedPreviously
);

const isAuthInProgress = createSelector(
	selectSelf,
	({ authInProgress }) => authInProgress
);

const getAuthError = createSelector(
	selectSelf,
	({ authError }) => authError
);

const selectors = {
	hasAgreedToTerms,
	getLoginEmail,
	isAuthenticated,
	selectAuthInfo,
	isServiceAllowed,
	haveSettingsLoaded,
	hasAuthenticatedPreviously,
	isAuthInProgress,
	getAuthError
};

const authOperation = ops => ({ email, cancelUrl, completeUrl }) => async (dispatch, getState) => {
	try {
		const { moonPayService } = getGlobalContext();
		const state = getState();
		const wallet = getWallet(state);
		const identityInfo = identitySelectors.selectIdentity(state);
		const identity = new Identity(wallet, identityInfo);
		if (isAuthInProgress(getState())) {
			return;
		}
		await dispatch(ops.setAuthInProgress(true));
		const authInfo = await dispatch(
			hardwareWalletOperations.useHardwareWalletOperation(
				() => moonPayService.auth(identity, email),
				{
					cancelUrl,
					completeUrl
				}
			)
		);
		await dispatch(ops.setAuthInfo(authInfo));
		await dispatch(ops.setPreviousAuthentication(true));
	} catch (error) {
		log.error(error);
		console.error(error);
		await dispatch(ops.setAuthError(error.message));
	} finally {
		await dispatch(ops.setAuthInProgress(false));
	}
};

const agreeToTermsOperation = ops => () => async (dispatch, getState) => {
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonPayService } = getGlobalContext();
	await moonPayService.updateSettings(wallet.id, {
		agreedToTerms: true
	});
	await dispatch(ops.setAgreedToTerms(true));
};

const loginEmailChosenOperation = ops => opts => async (dispatch, getState) => {
	const { loginEmail } = validate(opts, ['loginEmail']);
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonPayService } = getGlobalContext();
	await moonPayService.updateSettings(wallet.id, {
		loginEmail
	});
	await dispatch(ops.setLoginEmail(loginEmail));
	await dispatch(ops.setAuthInfo(null));
};

const loadSettingsOperation = ops => opts => async (dispatch, getState) => {
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonPayService } = getGlobalContext();
	const settings = await moonPayService.getSettings(wallet.id);
	await dispatch(ops.setAgreedToTerms(!!settings.agreedToTerms));
	await dispatch(ops.setLoginEmail(settings.loginEmail || null));
	await dispatch(ops.setPreviousAuthentication(settings.authenticatedPreviously));
	await dispatch(ops.setSettingsLoaded(true));
};

const loadLimitsOperation = ops => () => async (dispatch, getState) => {
	const authInfo = selectAuthInfo(getState());
	const { moonPayService } = getGlobalContext();
	const limits = await moonPayService.getLimits(authInfo);
	await dispatch(ops.setLimits(limits));
};

const connectFlowOperation = ops => ({ cancel, complete }) => async (dispatch, getState) => {
	await dispatch(ops.setAuthError(null));
	await dispatch(
		navigationFlowOperations.startFlowOperation({
			name: 'moonpay-connect',
			current: '/main/moonpay/loading',
			cancel,
			complete
		})
	);
};

const connectFlowNextStepOperation = ops => opt => async (dispatch, getState) => {
	if (!haveSettingsLoaded(getState())) {
		await dispatch(ops.loadSettingsOperation());
	}
	const agreedToTerms = hasAgreedToTerms(getState());

	if (!agreedToTerms) {
		await dispatch(
			navigationFlowOperations.navigateToStepOperation({
				current: '/main/moonpay/auth/terms',
				next: '/main/moonpay/loading'
			})
		);
		return;
	}

	const authenticated = isAuthenticated(getState());

	if (!authenticated) {
		const loginEmail = getLoginEmail(getState());
		const authInProgress = isAuthInProgress(getState());

		if (!loginEmail) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth/choose-email',
					next: '/main/moonpay/loading'
				})
			);
			return;
		}
		if (authInProgress) {
			while (isAuthInProgress(getState())) {
				await sleep(500);
			}
			if (!isAuthenticated(getState())) {
				await dispatch(
					navigationFlowOperations.navigateToStepOperation({
						current: '/main/moonpay/auth/error',
						next: '/main/moonpay/auth'
					})
				);
				return;
			}
			await dispatch(navigationFlowOperations.navigateCompleteOperation());
			return;
		}
		if (getAuthError(getState())) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth/error',
					next: '/main/moonpay/auth'
				})
			);
			return;
		}
		await dispatch(
			navigationFlowOperations.navigateToStepOperation({
				current: '/main/moonpay/auth',
				next: '/main/moonpay/loading'
			})
		);

		return;
	}

	await dispatch(navigationFlowOperations.navigateCancelOperation());
};

const moonPayAuthSlice = createAliasedSlice({
	name: SLICE_NAME,
	initialState,
	reducers: {
		setAuthInfo(state, action) {
			state.authInfo = action.payload;
		},
		clearAuthInfo(state) {
			state.authInfo = null;
		},
		setLimits(state, action) {
			state.limits = action.payload;
		},
		setAgreedToTerms(state, action) {
			state.agreedToTerms = action.payload;
		},
		setLoginEmail(state, action) {
			state.loginEmail = action.payload;
		},
		setSettingsLoaded(state, action) {
			state.settingsLoaded = action.payload;
		},
		setPreviousAuthentication(state, action) {
			state.authenticatedPreviously = action.payload;
		},
		setAuthInProgress(state, action) {
			state.authInProgress = action.payload;
		},
		setAuthError(state, action) {
			state.authError = action.payload;
		}
	},
	aliasedOperations: {
		authOperation,
		agreeToTermsOperation,
		loginEmailChosenOperation,
		loadLimitsOperation,
		connectFlowOperation,
		connectFlowNextStepOperation,
		loadSettingsOperation
	}
});

const { reducer, operations } = moonPayAuthSlice;

export { operations, selectors };

export default reducer;
