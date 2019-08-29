import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
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
	selectInventory: state =>
		inventorySelectors
			.selectInventoryRoot(state)
			.all.map(id => inventorySelectors.selectInventoryRoot(state).byId[id]),
	selectInventoryForCategory: (state, category, status = 'active') =>
		inventorySelectors
			.selectInventory(state)
			.filter(i => i.category === category && i.status === status),
	selectInventoryItemById: (state, id) => inventorySelectors.selectInventoryRoot(state).byId[id],
	isLoading: state => inventorySelectors.selectInventoryRoot(state).all.length === 0,
	selectInventoryItemByFilter: (state, category, filter) =>
		inventorySelectors.selectInventoryForCategory(state, category).find(filter)
};

export default reducer;
