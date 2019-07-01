import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';
// import config from '../config';
// import { Logger } from 'common/logger';

// const log = new Logger('orders-redux');

export const initialState = {
	all: [],
	byId: {}
};

export const ordersTypes = {
	ORDERS_CREATE_OPERATION: 'orders/operations/CREATE',
	ORDERS_LOAD_OPERATION: 'orders/operations/LOAD',
	ORDERS_SET_ACTION: 'orders/actions/SET'
};

const ordersActions = {
	setOrdersAction: payload => ({
		type: ordersTypes.ORDERS_SET_ACTION,
		payload
	})
};

const ordersLoadOperation = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState);
	const ordersService = getGlobalContext().marketplaceOrdersService;
	const orders = await ordersService.loadOrders(wallet.id);
	await dispatch(ordersActions.setOrdersAction(orders));
};

const operations = {
	ordersLoadOperation
};

const ordersOperations = {
	...ordersActions,
	ordersLoadOperation: createAliasedAction(
		ordersTypes.ORDERS_LOAD_OPERATION,
		operations.ordersLoadOperation
	)
};

const ordersReducers = {
	ordersSetReducer: (state, action) => {
		const { payload } = action;
		const all = payload.map(order => order.id);
		const byId = payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});

		return { ...state, all, byId };
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ordersTypes.ORDERS_SET_ACTION:
			return ordersReducers.ordersSetReducer(state, action);
	}
	return state;
};

const ordersSelectors = {};

export { ordersSelectors, ordersReducers, ordersActions, ordersOperations };

export default reducer;
