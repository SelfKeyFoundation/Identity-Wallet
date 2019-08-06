import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
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
			.filter(v => v.categories.includes(category) && v.status === status)
};

export default reducer;
