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

const log = new Logger('MoonpayAuthDuck');

const SLICE_NAME = 'moonPayAuth';

const initialState = {
	loaded: false,
	agreedToTerms: false,
	loginEmail: null,
	authInfo: null,
	isServiceAllowed: false,
	settingsLoaded: false,
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

const selectors = {
	hasAgreedToTerms,
	getLoginEmail,
	isAuthenticated,
	selectAuthInfo,
	isServiceAllowed,
	haveSettingsLoaded
};

const authOperation = ops => ({ email, cancelUrl, completeUrl }) => async (dispatch, getState) => {
	const { moonPayService } = getGlobalContext();

	const state = getState();
	const wallet = getWallet(state);
	const identityInfo = identitySelectors.selectIdentity(state);
	const identity = new Identity(wallet, identityInfo);

	try {
		const authInfo = dispatch(
			hardwareWalletOperations(() => moonPayService.auth(identity, email), {
				cancelUrl,
				completeUrl
			})
		);
		await dispatch(ops.setAuthInfo(authInfo));
	} catch (error) {
		log.error(error);
	}
};

const agreeToTermsOperation = ops => () => async (dispatch, getState) => {
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonpayService } = getGlobalContext();
	await moonpayService.updateSettings(wallet.id, {
		agreedToTerms: true
	});
	await dispatch(ops.setAgreedToTerms(true));
};

const loginEmailChosenOperation = ops => opts => async (dispatch, getState) => {
	const { loginEmail } = validate(opts, ['loginEmail']);
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonpayService } = getGlobalContext();
	await moonpayService.updateSettings(wallet.id, {
		loginEmail
	});
	await dispatch(ops.setLoginEmail(loginEmail));
	await dispatch(ops.setAuthInfo(null));
};

const loadSettingsOperation = ops => opts => async (dispatch, getState) => {
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonpayService } = getGlobalContext();
	const settings = await moonpayService.getSettings(wallet.id);
	await dispatch(ops.setAgreedToTerms(!!settings.agreedToTerms));
	await dispatch(ops.setLoginEmail(settings.loginEmail || null));
	await dispatch(ops.setSettingsLoaded(true));
};

const loadLimitsOperation = ops => () => async (dispatch, getState) => {
	const authInfo = selectAuthInfo(getState());
	const { moonPayService } = getGlobalContext();
	const limits = await moonPayService.getLimits(authInfo);
	await dispatch(ops.setLimits(limits));
};

const connectFlowOperation = ops => ({ cancel, complete }) => async (dispatch, getState) => {
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

		if (loginEmail) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth',
					next: '/main/moonpay/loading'
				})
			);
		} else {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth/choose-email',
					next: '/main/moonpay/loading'
				})
			);
		}

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
