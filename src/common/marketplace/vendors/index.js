import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { getTokens } from 'common/wallet-tokens/selectors';
import CONFIG from 'common/config.js';
import { schedulerSelectors, schedulerOperations } from '../../scheduler/index';
import { VENDOR_SYNC_JOB } from '../../../main/marketplace/vendors/vendor-sync-job-handler';

export const initialState = {
	all: [],
	byId: {}
};

export const vendorTypes = {
	VENDORS_SET: 'marketplace/vendor/actions/SET',
	VENDORS_LOAD_OPERATION: 'marketplace/vendor/operations/LOAD',
	VENDORS_REFRESH_OPERATION: 'marketplace/vendor/operations/REFRESH'
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

const refreshVendorsOperation = () => async (dispatch, getState) => {
	await dispatch(schedulerOperations.queueJobAction(null, VENDOR_SYNC_JOB));
};

export const vendorOperations = {
	...vendorActions,
	loadVendorsOperation: createAliasedAction(
		vendorTypes.VENDORS_LOAD_OPERATION,
		loadVendorsOperation
	),
	refreshVendorsOperation: createAliasedAction(
		vendorTypes.VENDORS_REFRESH_OPERATION,
		refreshVendorsOperation
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
	selectActiveVendors: state =>
		vendorSelectors
			.selectVendorRoot(state)
			.all.filter(id => vendorSelectors.selectVendorRoot(state).byId[id].status === 'active')
			.map(id => vendorSelectors.selectVendorRoot(state).byId[id]),
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
	isVendorsLoading: state => {
		if (vendorSelectors.selectVendors(state).length) {
			return false;
		}
		const jobs = schedulerSelectors.selectJobsInProgressByCategory(state, VENDOR_SYNC_JOB, 100);
		return !!jobs.length;
	},
	isVendorsLoadingError: state => {
		if (
			vendorSelectors.selectVendors(state).length ||
			vendorSelectors.isVendorsLoading(state)
		) {
			return false;
		}
		return true;
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
