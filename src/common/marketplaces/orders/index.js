import _ from 'lodash';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';
import { push } from 'connected-react-router';
import config from '../config';
import { Logger } from 'common/logger';

const log = new Logger('orders-duck');

const MARKETPLACE_ORDERS_ROOT_PATH = '/main/marketplace-orders';

export const orderStatus = {
	PENDING: 'PENDING',
	COMPLETE: 'ORDER_COMPLETE',
	CANCELED: 'CANCELED',
	PAYMENT_COMPLETE: 'PAYMENT_COMPLETE',
	PAYMENT_IN_PROGRESS: 'PAYMENT_IN_PROGRESS',
	PAYMENT_ERROR: 'PAYMENT_ERROR',
	ALLOWANCE_IN_PROGRESS: 'ALLOWANCE_IN_PROGRESS',
	ALLOWANCE_COMPLETE: 'ALLOWANCE_COMPLETE',
	ALLOWANCE_ERROR: 'ALLOWANCE_ERROR'
};

export const initialState = {
	all: [],
	byId: {},
	currentOrder: null
};

export const ordersTypes = {
	ORDERS_CREATE_OPERATION: 'orders/operations/CREATE',
	ORDERS_LOAD_OPERATION: 'orders/operations/LOAD',
	ORDERS_SET_ACTION: 'orders/actions/SET',
	ORDERS_SET_ONE_ACTION: 'orders/actions/SET_ONE',
	ORDERS_UPDATE_ACTION: 'orders/actions/UPDATE',
	ORDERS_UPDATE_OPERATION: 'orders/operations/UPDATE',
	ORDERS_PAYMENT_START_OPERATION: 'orders/operations/payment/START',
	ORDERS_SET_CURRENT_ACTION: 'orders/actions/current/SET',
	ORDERS_SHOW_UI_OPERATION: 'orders/operations/ui/SHOW',
	ORDERS_HIDE_UI_OPERATION: 'orders/operations/ui/HIDE',
	ORDERS_CHECK_ALLOWANCE_OPERATION: 'orders/operations/allowance/CHECK',

	ORDERS_CHECK_PAYMENT_PROGRESS_OPERATION: 'orders/operations/payment_progress/CHECK',
	ORDERS_CHECK_ALLOWANCE_PROGRESS_OPERATION: 'orders/operations/allowance_progress/CHECK',

	ORDERS_CANCEL_CURRENT_OPERATION: 'orders/operations/current/CANCEL'
};

const ordersActions = {
	setOrdersAction: payload => ({
		type: ordersTypes.ORDERS_SET_ACTION,
		payload
	}),
	setOneOrderAction: payload => ({
		type: ordersTypes.ORDERS_SET_ONE_ACTION,
		payload
	}),
	setCurrentOrderAction: payload => ({
		type: ordersTypes.ORDERS_SET_CURRENT_ACTION,
		payload
	})
};

const showOrderPaymentUIOperation = (orderId, backUrl, completeUrl) => async (
	dispatch,
	getState
) => {
	log.info('[showOrderPaymentUIOperation] %d %s %s', orderId, backUrl, completeUrl);

	await dispatch(
		ordersActions.setCurrentOrder({
			orderId,
			backUrl,
			completeUrl
		})
	);
	let order = ordersSelectors.getOrder(getState(), orderId);
	if (!order) {
		return dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	}

	await dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/loading`));

	await dispatch(
		ordersActions.setCurrentOrder({
			orderId,
			backUrl,
			completeUrl
		})
	);

	if (order.status === orderStatus.COMPLETE) {
		return dispatch(push(completeUrl));
	}

	if (order.status === orderStatus.PAYMENT_COMPLETE) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment/complete`));
	}

	if (order.status === orderStatus.PAYMENT_IN_PROGRESS) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment/in-progress`));
	}

	if (order.status === orderStatus.PAYMENT_ERROR) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment/error`));
	}

	await dispatch(ordersOperations.checkOrderAllowanceOperation(orderId));

	order = ordersSelectors.getOrder(getState(), orderId);

	if (order.status === orderStatus.PENDING) {
		await dispatch(operations.estimateCurrentPreapproveGasOperation());
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/allowance`));
	}

	if (order.status === orderStatus.ALLOWANCE_IN_PROGRESS) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/allowance/in-progress`));
	}

	if (order.status === orderStatus.ALLOWANCE_ERROR) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/allowance/error`));
	}

	if (order.status === orderStatus.ALLOWANCE_COMPLETE) {
		await dispatch(ordersOperations.estimateCurrentPaymentGasOperation());
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment`));
	}
};

const ordersLoadOperation = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState);
	const ordersService = getGlobalContext().marketplaceOrdersService;
	const orders = await ordersService.loadOrders(wallet.id);
	await dispatch(ordersActions.setOrdersAction(orders));
};

const ordersUpdateOperation = (id, update) => async (dispatch, getState) => {
	update = _.omit(update, 'walletId', 'id');
	const ordersService = getGlobalContext().marketplaceOrdersService;
	const order = await ordersService.updateOrder({ id, ...update });
	await dispatch(ordersActions.setOneOrderAction(order));
};

const checkOrderAllowanceOperation = orderId => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const selfkeyService = ctx.selfkeyService;
	let order = ordersSelectors.getOrder(getState(), orderId);
	const wallet = walletSelectors.getWallet(getState());

	const allowance = await selfkeyService.getAllowance(
		wallet.publicKey,
		config.paymentSplitterAddress
	);

	let update = null;

	if (allowance < order.amount && order.status === orderStatus.ALLOWANCE_COMPLETE) {
		update = { status: orderStatus.PENDING };
	}

	if (
		allowance >= order.amount &&
		[
			orderStatus.ALLOWANCE_IN_PROGRESS,
			orderStatus.ALLOWANCE_ERROR,
			orderStatus.PENDING
		].includes(order.status)
	) {
		update = { status: orderStatus.ALLOWANCE_COMPLETE };
	}

	if (!update) {
		return;
	}
	await dispatch(ordersOperations.ordersUpdateOperation(orderId, update));
};

const cancelCurrentOrderOperation = () => async (dispatch, getState) => {
	const { orderId } = ordersSelectors.getCurrentOrder(getState());
	await dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	await dispatch(ordersOperations.setCurrentOrderAction(null));
	await dispatch(
		ordersOperations.ordersUpdateOperation(orderId, { status: orderStatus.CANCELED })
	);
};

const hideCurrentPaymentUIOperation = () => async (dispatch, getState) => {
	const { backUrl } = ordersSelectors.getCurrentOrder(getState());
	await dispatch(push(backUrl));
};

const preapproveCurrentOrderOperation = () => (dispatch, getState) => {
	// TODO: implement
};

const payCurrentOrderOperation = () => (dispatch, getState) => {
	// TODO: implement
};

const estimateCurrentPaymentGasOperation = () => (dispatch, getState) => {
	// TODO: implement
};

const estimateCurrentPreapproveGasOperation = () => (dispatch, getState) => {
	// TODO: implement
};

const checkAllowanceProgressOperation = () => (dispatch, getState) => {
	// TODO: implement
};

const checkPaymentProgressOperation = () => (dispatch, getState) => {
	// TODO: implement
};

const operations = {
	ordersLoadOperation,
	ordersUpdateOperation,
	showOrderPaymentUIOperation,
	hideCurrentPaymentUIOperation,
	checkOrderAllowanceOperation,
	cancelCurrentOrderOperation,
	checkPaymentProgressOperation,
	checkAllowanceProgressOperation,
	estimateCurrentPreapproveGasOperation,
	estimateCurrentPaymentGasOperation,
	payCurrentOrderOperation,
	preapproveCurrentOrderOperation
};

const ordersOperations = {
	...ordersActions,
	ordersLoadOperation: createAliasedAction(
		ordersTypes.ORDERS_LOAD_OPERATION,
		operations.ordersLoadOperation
	),
	ordersUpdateOperation: createAliasedAction(
		ordersTypes.ORDERS_UPDATE_OPERATION,
		operations.ordersUpdateOperation
	),
	showOrderPaymentUIOperation: createAliasedAction(
		ordersTypes.ORDERS_SHOW_UI_OPERATION,
		operations.showOrderPaymentUIOperation
	),
	checkOrderAllowanceOperation: createAliasedAction(
		ordersTypes.ORDERS_CHECK_ALLOWANCE_OPERATION,
		operations.checkOrderAllowanceOperation
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
	},
	ordersSetOneReducer: (state, action) => {
		let all = state.all;
		const { id } = action.payload;
		if (!all.find(ord => ord.id === id)) {
			all = [...all, id];
		}
		return { ...state, all, byId: { ...action.byId, [id]: { ...action.payload } } };
	},
	setCurrentOrderReducer: (state, { payload }) => {
		if (!payload) {
			return { ...state, currentOrder: null };
		}
		return { ...state, currentOrder: { ...state.currentOrder, ...payload } };
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ordersTypes.ORDERS_SET_ACTION:
			return ordersReducers.ordersSetReducer(state, action);
		case ordersTypes.ORDERS_SET_ONE_ACTION:
			return ordersReducers.ordersSetOneReducer(state, action);
		case ordersTypes.ORDERS_SET_CURRENT_ACTION:
			return ordersReducers.setCurrentOrderReducer(state, action);
	}
	return state;
};

const ordersSelectors = {
	getRoot: state => state.orders,
	getOrder: (state, id) => ordersSelectors.getRoot(state).byId[id],
	getCurrentOrder: state => ordersSelectors.getRoot(state).currentOrder
};

export { ordersSelectors, ordersReducers, ordersActions, ordersOperations };

export default reducer;
