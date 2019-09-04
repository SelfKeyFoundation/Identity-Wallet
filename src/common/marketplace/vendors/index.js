import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { getTokens } from 'common/wallet-tokens/selectors';
import CONFIG from 'common/config.js';

export const initialState = {
	all: [],
	byId: {}
};

export const vendorTypes = {
	VENDORS_SET: 'marketplace/vendor/actions/SET',
	VENDORS_LOAD_OPERATION: 'marketplace/vendor/operations/LOAD'
};

export const vendorActions = {
	setVendors: vendors => ({
		type: vendorTypes.VENDORS_SET,
		payload: vendors
	})
};

const loadVendorsOperation = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const vendors = await ctx.vendorService.loadVendors();
	await dispatch(vendorActions.setVendors(vendors));
};

export const vendorOperations = {
	...vendorActions,
	loadVendorsOperation: createAliasedAction(
		vendorTypes.VENDORS_LOAD_OPERATION,
		loadVendorsOperation
	)
};

const setVendorsReducer = (state, action) => {
	const all = (action.payload || []).map(inv => inv.id);
	const byId = (action.payload || []).reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	return { ...state, all, byId };
};

export const vendorReducers = {
	setVendorsReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case vendorTypes.VENDORS_SET:
			return vendorReducers.setVendorsReducer(state, action);
	}
	return state;
};

export const vendorSelectors = {
	selectVendorRoot: state => state.marketplace.vendors,
	selectVendors: state =>
		vendorSelectors
			.selectVendorRoot(state)
			.all.map(id => vendorSelectors.selectVendorRoot(state).byId[id]),
	selectVendorsForCategory: (state, category, status = 'active') =>
		vendorSelectors
			.selectVendors(state)
			.filter(v => v.categories.includes(category) && v.status === status),
	selectVendorById: (state, vendorId) =>
		vendorSelectors.selectVendors(state).find(v => v.vendorId === vendorId),
	selectRPDetails: (state, vendorId) => {
		const vendor = vendorSelectors.selectVendorById(state, vendorId);
		return {
			serviceOwner: '0x0000000000000000000000000000000000000000',
			serviceId: 'global',
			lockPeriod: 2592000000,
			amount: CONFIG.depositPriceOverride || 25,
			name: vendorId,
			...vendor
		};
	},
	hasBalance: (state, vendorId) => {
		const service = vendorSelectors.selectRPDetails(state, vendorId);
		const keyToken = getTokens(state).find(token => {
			return token.symbol === CONFIG.constants.primaryToken.toUpperCase();
		}) || { balance: 0 };

		const requiredBalance = service.requiredBalance;
		return keyToken.balance >= requiredBalance;
	}
};

export default reducer;
