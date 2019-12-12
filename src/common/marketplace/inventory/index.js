import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { schedulerSelectors } from '../../scheduler/index';
import { vendorSelectors } from '../vendors/index';
import { INVENTORY_SYNC_JOB } from '../../../main/marketplace/inventory/inventory-sync-job-handler';
export const initialState = {
	all: [],
	byId: {}
};

export const inventoryTypes = {
	INVENTORY_SET: 'marketplace/inventory/actions/SET',
	INVENTORY_LOAD_OPERATION: 'marketplace/inventory/operations/LOAD'
};

export const inventoryActions = {
	setInventory: inventory => ({
		type: inventoryTypes.INVENTORY_SET,
		payload: inventory
	})
};

const loadInventoryOperation = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const inventory = await ctx.inventoryService.loadInventory();
	await dispatch(inventoryActions.setInventory(inventory));
};

export const inventoryOperations = {
	...inventoryActions,
	loadInventoryOperation: createAliasedAction(
		inventoryTypes.INVENTORY_LOAD_OPERATION,
		loadInventoryOperation
	)
};

const setInventoryReducer = (state, action) => {
	const all = (action.payload || []).map(inv => inv.id);
	const byId = (action.payload || []).reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	return { ...state, all, byId };
};

export const inventoryReducers = {
	setInventoryReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case inventoryTypes.INVENTORY_SET:
			return inventoryReducers.setInventoryReducer(state, action);
	}
	return state;
};

export const inventorySelectors = {
	selectInventoryRoot: state => state.marketplace.inventory,
	selectInventory: (state, entityType = 'individual') =>
		inventorySelectors
			.selectInventoryRoot(state)
			.all.map(id => inventorySelectors.selectInventoryRoot(state).byId[id])
			.filter(inv => inv.entityType === entityType),
	selectInventoryForCategory: (state, category, status = 'active', entityType) =>
		inventorySelectors
			.selectInventory(state, entityType)
			.filter(i => i.category === category && i.status === status),
	selectInventoryItemById: (state, id) => inventorySelectors.selectInventoryRoot(state).byId[id],
	isInventoryLoading: state => {
		if (inventorySelectors.selectInventoryRoot(state).all.length) {
			return false;
		}
		if (vendorSelectors.isVendorsLoading(state)) {
			return true;
		}
		const jobs = schedulerSelectors.selectJobsInProgressByCategory(
			state,
			INVENTORY_SYNC_JOB,
			100
		);
		return !!jobs.length;
	},
	isInventoryLoadingError: state => {
		if (
			inventorySelectors.selectInventory(state).length ||
			inventorySelectors.isInventoryLoading(state)
		) {
			return false;
		}
		return vendorSelectors.isVendorsLoadingError(state);
	},
	selectInventoryItemByFilter: (state, category, filter, entityType) =>
		inventorySelectors
			.selectInventoryForCategory(state, category, 'active', entityType)
			.find(filter)
};

export default reducer;
