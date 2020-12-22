import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import { getWallet } from '../wallet/selectors';
import { identitySelectors } from 'common/identity';
import { Identity } from '../../main/platform/identity';
import { createSelector } from 'reselect';
import { createAliasedSlice } from '../utils/duck';
import { hardwareWalletOperations } from '../hardware-wallet';

const log = new Logger('MoonpayAuthDuck');

const SLICE_NAME = 'moonpayAuth';

const initialState = {
	agreedToTerms: false,
	authInfo: null,
	isAllowed: null,
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

const selectors = { isAuthenticated, selectAuthInfo };

const authOperation = ops => email => async (dispatch, getState) => {
	const { moonPayService } = getGlobalContext();

	const state = getState();
	const wallet = getWallet(state);
	const identityInfo = identitySelectors.selectIdentity(state);
	const identity = new Identity(wallet, identityInfo);

	try {
		const authInfo = dispatch(
			hardwareWalletOperations(() => moonPayService.auth(identity, email))
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

const agreedToTermsOperations = ops => agree => async (dispatch, getState) => {
	// record agreedToTerms
};

const moonpayAuthSlice = createAliasedSlice({
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
		loadLimitsOperation
	}
});

const { reducer, operations } = moonpayAuthSlice;

export { operations, selectors };

export default reducer;
