import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import { getWallet } from '../wallet/selectors';
import { identitySelectors } from 'common/identity';
import { Identity } from '../../main/platform/identity';
import { createSelector } from 'reselect';
import { createAliasedSlice } from '../utils/duck';
import { hardwareWalletOperations } from '../hardware-wallet';
import { navigationFlowOperations } from '../navigation/flow';
import { sleep } from '../utils/async';

const log = new Logger('MoonpayAuthDuck');

const SLICE_NAME = 'moonPayAuth';

const initialState = {
	agreedToTerms: false,
	authInfo: null,
	isServiceAllowed: false,
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

const selectors = { isAuthenticated, selectAuthInfo, isServiceAllowed };

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
	await sleep(5000);
	await dispatch(ops.connectFlowNextStepOperation());
};

const connectFlowNextStepOperation = ops => opt => async (dispatch, getState) => {
	const authenticated = isAuthenticated(getState());

	if (!authenticated) {
		await dispatch(
			navigationFlowOperations.navigateToStepOperation({
				current: '/main/moonpay/auth'
			})
		);
		return;
	}

	await dispatch(navigationFlowOperations.navigateCancelOperation());
};

const agreedToTermsOperations = ops => agree => async (dispatch, getState) => {
	// record agreedToTerms
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
		}
	},
	aliasedOperations: {
		authOperation,
		agreedToTermsOperations,
		loadLimitsOperation,
		connectFlowOperation,
		connectFlowNextStepOperation
	}
});

const { reducer, operations } = moonPayAuthSlice;

export { operations, selectors };

export default reducer;
