import _ from 'lodash';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../../wallet';
import { identitySelectors } from '../../identity';
import { appSelectors } from '../../app';
import { transactionOperations } from 'common/transaction';
import { push } from 'connected-react-router';
import config from '../../config';
import { featureIsEnabled } from 'common/feature-flags';
import { Logger } from 'common/logger';
import { pricesSelectors } from '../../prices';
import { ethGasStationInfoSelectors } from '../../eth-gas-station';
import BN from 'bignumber.js';
import { fiatCurrencySelectors } from '../../fiatCurrency';
const hardwalletConfirmationTime = '30000';
const log = new Logger('orders-duck');

const MARKETPLACE_ORDERS_ROOT_PATH = '/main/marketplace/orders';

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
	ORDERS_START_OPERATION: 'orders/operations/START',
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
	ORDERS_CANCEL_CURRENT_OPERATION: 'orders/operations/current/CANCEL',
	ORDERS_FINISH_CURRENT_OPERATION: 'orders/operations/current/FINISH',
	ORDERS_PREAPPROVE_CURRENT_OPERATION: 'orders/operations/current/PREAPPROVE',
	ORDERS_PAY_CURRENT_OPERATION: 'orders/operations/current/PAY',
	ORDERS_DIRECT_PAY_CURRENT_OPERATION: 'orders/operations/current/DIRECT_PAY',
	ORDERS_PREAPPROVE_ESTIMATE_CURRENT_OPERATION: 'orders/operations/current/PREAPPROVE_ESTIMATE',
	ORDERS_PAY_ESTIMATE_CURRENT_OPERATION: 'orders/operations/current/PAY_ESTIMATE'
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

const createOrderOperation = ({
	amount,
	applicationId,
	vendorId,
	itemId,
	vendorDID,
	productInfo,
	vendorName,
	vendorWallet,
	cryptoCurrency = config.constants.primaryToken
}) => async (dispatch, getState) => {
	const ordersService = getGlobalContext().marketplaceOrdersService;
	const wallet = walletSelectors.getWallet(getState());
	const identity = identitySelectors.selectIdentity(getState());
	const order = await ordersService.createOrder({
		amount: '' + amount,
		applicationId,
		vendorId,
		itemId,
		vendorDID,
		productInfo,
		vendorName,
		did: identity.did,
		identityId: identity.id,
		walletId: wallet.id,
		vendorWallet,
		cryptoCurrency,
		// On marketplace direct payment orders, allowance is considered complete as initial state
		status: featureIsEnabled('paymentContract')
			? orderStatus.PENDING
			: orderStatus.ALLOWANCE_COMPLETE
	});
	await dispatch(ordersActions.setOneOrderAction(order));
	return order;
};

const startOrderOperation = ({
	amount,
	applicationId,
	vendorId,
	itemId,
	vendorDID,
	productInfo,
	vendorName,
	backUrl,
	completeUrl,
	vendorWallet,
	cryptoCurrency = config.constants.primaryToken
}) => async (dispatch, getState) => {
	let order = ordersSelectors.getLatestActiveOrderForApplication(getState(), applicationId);
	if (!order) {
		order = await dispatch(
			ordersOperations.createOrderOperation({
				amount,
				applicationId,
				vendorId,
				itemId,
				vendorDID,
				productInfo,
				vendorName,
				vendorWallet,
				cryptoCurrency
			})
		);
	}
	await dispatch(ordersOperations.showOrderPaymentUIOperation(order.id, backUrl, completeUrl));
};

const showOrderPaymentUIOperation = (orderId, backUrl, completeUrl) => async (
	dispatch,
	getState
) => {
	log.debug('[showOrderPaymentUIOperation] %d %s %s', orderId, backUrl, completeUrl);
	await dispatch(
		ordersActions.setCurrentOrderAction({
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
		ordersActions.setCurrentOrderAction({
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

	if (featureIsEnabled('paymentContract')) {
		await dispatch(ordersOperations.checkOrderAllowanceOperation(orderId));
	}

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
	const identity = identitySelectors.selectIdentity(getState());
	const ordersService = getGlobalContext().marketplaceOrdersService;
	const orders = await ordersService.loadOrders(identity.id);
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
	const amount = ordersSelectors.getContractFormattedAmount(getState(), orderId);

	let allowance = await selfkeyService.getAllowance(
		wallet.address,
		config.paymentSplitterAddress
	);
	let update = null;

	allowance = new BN(allowance);

	if (allowance.lt(amount) && order.status === orderStatus.ALLOWANCE_COMPLETE) {
		update = { status: orderStatus.PENDING };
	}

	if (
		allowance.gte(amount) &&
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

const finishCurrentOrderOperation = () => async (dispatch, getState) => {
	const { completeUrl, orderId } = ordersSelectors.getCurrentOrder(getState());
	await dispatch(push(`${completeUrl}/${orderId}`));
	await dispatch(ordersOperations.setCurrentOrderAction(null));
};

const cancelCurrentOrderOperation = () => async (dispatch, getState) => {
	const { orderId } = ordersSelectors.getCurrentOrder(getState());
	await dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	await dispatch(
		ordersOperations.ordersUpdateOperation(orderId, { status: orderStatus.CANCELED })
	);
};

const hideCurrentPaymentUIOperation = () => async (dispatch, getState) => {
	const { backUrl } = ordersSelectors.getCurrentOrder(getState());
	await dispatch(push(backUrl));
	await dispatch(ordersOperations.setCurrentOrderAction(null));
};

const preapproveCurrentOrderOperation = () => async (dispatch, getState) => {
	const selfkeyService = getGlobalContext().selfkeyService;
	const { orderId, backUrl, completeUrl, allowanceGas } = ordersSelectors.getCurrentOrder(
		getState()
	);
	let gasPriceEstimates = ethGasStationInfoSelectors.getEthGasStationInfoWEI(getState());
	let order = ordersSelectors.getOrder(getState(), orderId);
	const wallet = walletSelectors.getWallet(getState());
	await dispatch(
		ordersOperations.ordersUpdateOperation(orderId, {
			status: orderStatus.ALLOWANCE_IN_PROGRESS
		})
	);

	let hardwalletConfirmationTimeout = null;
	const walletType = appSelectors.selectWalletType(getState());

	if (walletType === 'ledger' || walletType === 'trezor') {
		await dispatch(push('/main/hd-transaction-timer'));
		hardwalletConfirmationTimeout = setTimeout(async () => {
			clearTimeout(hardwalletConfirmationTimeout);
			await dispatch(push('/main/transaction-timeout'));
		}, hardwalletConfirmationTime);
	}

	const onTransactionHash = async allowanceHash => {
		clearTimeout(hardwalletConfirmationTimeout);
		await dispatch(ordersOperations.ordersUpdateOperation(orderId, { allowanceHash }));
		await dispatch(ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl));
	};
	try {
		const amount = ordersSelectors.getContractFormattedAmount(getState(), orderId);

		const receipt = await selfkeyService.approve(
			wallet.address,
			config.paymentSplitterAddress,
			amount,
			allowanceGas,
			gasPriceEstimates.average,
			onTransactionHash
		);
		order = ordersSelectors.getOrder(getState(), orderId);
		if (order.status === orderStatus.ALLOWANCE_IN_PROGRESS) {
			await dispatch(
				ordersOperations.ordersUpdateOperation(orderId, {
					status: orderStatus.ALLOWANCE_COMPLETE
				})
			);
			if (orderId === ordersSelectors.getCurrentOrder(getState()).orderId) {
				await dispatch(
					ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl)
				);
			}
			return receipt;
		}
	} catch (error) {
		clearTimeout(hardwalletConfirmationTimeout);
		await dispatch(
			ordersOperations.ordersUpdateOperation(orderId, {
				status: orderStatus.ALLOWANCE_ERROR,
				statusMessage: error.message
			})
		);
		if (orderId === ordersSelectors.getCurrentOrder(getState()).orderId) {
			await dispatch(
				ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl)
			);
		}
		throw error;
	}
	throw new Error('operation canceled');
};

const directPayCurrentOrderOperation = ({ trezorAccountIndex }) => async (dispatch, getState) => {
	const { orderId, backUrl, completeUrl, paymentGas } = ordersSelectors.getCurrentOrder(
		getState()
	);
	let order = ordersSelectors.getOrder(getState(), orderId);
	const cryptoCurrency = order.cryptoCurrency;
	const { ethGasStationInfo } = ethGasStationInfoSelectors.getEthGasStationInfo(getState());
	const amount = new BN(order.amount).toFixed(18);

	await dispatch(
		ordersOperations.ordersUpdateOperation(orderId, { status: orderStatus.PAYMENT_IN_PROGRESS })
	);

	await dispatch(transactionOperations.init({ trezorAccountIndex, cryptoCurrency }));
	await dispatch(transactionOperations.setAddress(order.vendorWallet));
	await dispatch(transactionOperations.setAmount(amount));
	await dispatch(transactionOperations.setGasPrice(ethGasStationInfo.fast));
	await dispatch(transactionOperations.setLimitPrice(paymentGas));

	let hardwalletConfirmationTimeout = null;
	const walletType = appSelectors.selectWalletType(getState());

	if (walletType === 'ledger' || walletType === 'trezor') {
		await dispatch(push('/main/hd-transaction-timer'));
		hardwalletConfirmationTimeout = setTimeout(async () => {
			clearTimeout(hardwalletConfirmationTimeout);
			await dispatch(push('/main/transaction-timeout'));
		}, hardwalletConfirmationTime);
	}

	const onReceipt = async receipt => {
		await dispatch(
			ordersOperations.ordersUpdateOperation(orderId, {
				status: orderStatus.PAYMENT_COMPLETE
			})
		);
		await dispatch(ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl));
	};
	const onTransactionHash = async paymentHash => {
		clearTimeout(hardwalletConfirmationTimeout);
		await dispatch(ordersOperations.ordersUpdateOperation(orderId, { paymentHash }));
		await dispatch(ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl));
	};
	const onTransactionError = async error => {
		clearTimeout(hardwalletConfirmationTimeout);
		log.error(error);
		await dispatch(
			ordersOperations.ordersUpdateOperation(orderId, {
				status: orderStatus.PAYMENT_ERROR,
				statusMessage: error.message
			})
		);
		if (orderId === ordersSelectors.getCurrentOrder(getState()).orderId) {
			await dispatch(
				ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl)
			);
		}
		throw error;
	};

	await dispatch(
		transactionOperations.marketplaceSend({
			onTransactionHash,
			onTransactionError,
			onReceipt
		})
	);
};

const payCurrentOrderOperation = () => async (dispatch, getState) => {
	const paymentService = getGlobalContext().paymentService;
	const { orderId, backUrl, completeUrl, paymentGas } = ordersSelectors.getCurrentOrder(
		getState()
	);
	let gasPriceEstimates = ethGasStationInfoSelectors.getEthGasStationInfoWEI(getState());
	let order = ordersSelectors.getOrder(getState(), orderId);
	const wallet = walletSelectors.getWallet(getState());
	await dispatch(
		ordersOperations.ordersUpdateOperation(orderId, { status: orderStatus.PAYMENT_IN_PROGRESS })
	);

	let hardwalletConfirmationTimeout = null;
	const walletType = appSelectors.selectWalletType(getState());

	if (walletType === 'ledger' || walletType === 'trezor') {
		await dispatch(push('/main/hd-transaction-timer'));
		hardwalletConfirmationTimeout = setTimeout(async () => {
			clearTimeout(hardwalletConfirmationTimeout);
			await dispatch(push('/main/transaction-timeout'));
		}, hardwalletConfirmationTime);
	}

	const onTransactionHash = async paymentHash => {
		clearTimeout(hardwalletConfirmationTimeout);
		await dispatch(ordersOperations.ordersUpdateOperation(orderId, { paymentHash }));
		await dispatch(ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl));
	};
	try {
		const amount = ordersSelectors.getContractFormattedAmount(getState(), orderId);
		const receipt = await paymentService.makePayment(
			wallet.address,
			order.did,
			order.vendorDID,
			amount,
			order.productInfo,
			0,
			0,
			paymentGas,
			gasPriceEstimates.average,
			onTransactionHash
		);
		order = ordersSelectors.getOrder(getState(), orderId);
		if (order.status === orderStatus.PAYMENT_IN_PROGRESS) {
			await dispatch(
				ordersOperations.ordersUpdateOperation(orderId, {
					status: orderStatus.PAYMENT_COMPLETE
				})
			);
			if (orderId === ordersSelectors.getCurrentOrder(getState()).orderId) {
				await dispatch(
					ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl)
				);
			}
			return receipt;
		}
	} catch (error) {
		clearTimeout(hardwalletConfirmationTimeout);
		log.error(error);
		await dispatch(
			ordersOperations.ordersUpdateOperation(orderId, {
				status: orderStatus.PAYMENT_ERROR,
				statusMessage: error.message
			})
		);
		if (orderId === ordersSelectors.getCurrentOrder(getState()).orderId) {
			await dispatch(
				ordersOperations.showOrderPaymentUIOperation(orderId, backUrl, completeUrl)
			);
		}
		throw error;
	}
	throw new Error('operation canceled');
};

const estimateCurrentPaymentGasOperation = () => async (dispatch, getState) => {
	const gasLimit = await getGlobalContext().paymentService.getGasLimit();
	await dispatch(ordersActions.setCurrentOrderAction({ paymentGas: gasLimit }));
};

const estimateCurrentPreapproveGasOperation = () => async (dispatch, getState) => {
	const { orderId } = ordersSelectors.getCurrentOrder(getState());
	const wallet = walletSelectors.getWallet(getState());
	const amount = ordersSelectors.getContractFormattedAmount(getState(), orderId);
	const gasLimit = await getGlobalContext().selfkeyService.estimateApproveGasLimit(
		wallet.address,
		config.paymentSplitterAddress,
		amount
	);
	await dispatch(ordersActions.setCurrentOrderAction({ allowanceGas: gasLimit }));
};

const operations = {
	ordersLoadOperation,
	ordersUpdateOperation,
	showOrderPaymentUIOperation,
	hideCurrentPaymentUIOperation,
	checkOrderAllowanceOperation,
	cancelCurrentOrderOperation,
	estimateCurrentPreapproveGasOperation,
	estimateCurrentPaymentGasOperation,
	payCurrentOrderOperation,
	directPayCurrentOrderOperation,
	preapproveCurrentOrderOperation,
	createOrderOperation,
	finishCurrentOrderOperation,
	startOrderOperation
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
	),

	hideCurrentPaymentUIOperation: createAliasedAction(
		ordersTypes.ORDERS_HIDE_UI_OPERATION,
		operations.hideCurrentPaymentUIOperation
	),
	cancelCurrentOrderOperation: createAliasedAction(
		ordersTypes.ORDERS_CANCEL_CURRENT_OPERATION,
		operations.cancelCurrentOrderOperation
	),
	estimateCurrentPreapproveGasOperation: createAliasedAction(
		ordersTypes.ORDERS_PREAPPROVE_ESTIMATE_CURRENT_OPERATION,
		operations.estimateCurrentPreapproveGasOperation
	),
	estimateCurrentPaymentGasOperation: createAliasedAction(
		ordersTypes.ORDERS_PAY_ESTIMATE_CURRENT_OPERATION,
		operations.estimateCurrentPaymentGasOperation
	),
	payCurrentOrderOperation: createAliasedAction(
		ordersTypes.ORDERS_PAY_CURRENT_OPERATION,
		operations.payCurrentOrderOperation
	),
	directPayCurrentOrderOperation: createAliasedAction(
		ordersTypes.ORDERS_DIRECT_PAY_CURRENT_OPERATION,
		operations.directPayCurrentOrderOperation
	),
	preapproveCurrentOrderOperation: createAliasedAction(
		ordersTypes.ORDERS_PREAPPROVE_CURRENT_OPERATION,
		operations.preapproveCurrentOrderOperation
	),
	createOrderOperation: createAliasedAction(
		ordersTypes.ORDERS_CREATE_OPERATION,
		operations.createOrderOperation
	),
	finishCurrentOrderOperation: createAliasedAction(
		ordersTypes.ORDERS_FINISH_CURRENT_OPERATION,
		operations.finishCurrentOrderOperation
	),
	startOrderOperation: createAliasedAction(
		ordersTypes.ORDERS_START_OPERATION,
		operations.startOrderOperation
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

export const reducer = (state = initialState, action) => {
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
	getRoot: state => state.marketplace.orders,
	getOrder: (state, id) => ordersSelectors.getRoot(state).byId[id],
	getCurrentOrder: state => ordersSelectors.getRoot(state).currentOrder,
	getContractFormattedAmount: (state, id) => {
		const order = ordersSelectors.getOrder(state, id);
		return order.amount ? new BN(order.amount).times(new BN(10).pow(18)).toFixed(0) : 0;
	},
	getOrderPriceUsd: (state, id) => {
		const order = ordersSelectors.getOrder(state, id);
		let fiat = fiatCurrencySelectors.getFiatCurrency(state);
		let fiatRate = pricesSelectors.getRate(state, order.cryptoCurrency, fiat.fiatCurrency);
		return new BN(order.amount).multipliedBy(fiatRate).toFixed(2);
	},
	getCurrentPaymentFeeUsd: state => {
		let fiat = fiatCurrencySelectors.getFiatCurrency(state);
		let fiatRate = pricesSelectors.getRate(state, 'ETH', fiat.fiatCurrency);
		return new BN(ordersSelectors.getCurrentPaymentFeeEth(state))
			.multipliedBy(fiatRate)
			.toString();
	},
	getCurrentPaymentFeeEth: state => {
		let gasPriceEstimates = ethGasStationInfoSelectors.getEthGasStationInfoWEI(state);
		const { paymentGas } = ordersSelectors.getCurrentOrder(state) || {};
		return new BN(gasPriceEstimates.average)
			.dividedBy(1000000000000000000)
			.multipliedBy(paymentGas || 0)
			.toString();
	},
	getCurrentAllowanceFeeUsd: state => {
		let fiat = fiatCurrencySelectors.getFiatCurrency(state);
		let fiatRate = pricesSelectors.getRate(state, 'ETH', fiat.fiatCurrency);
		return new BN(ordersSelectors.getCurrentAllowanceFeeEth(state))
			.multipliedBy(fiatRate)
			.toString();
	},
	getCurrentAllowanceFeeEth: state => {
		let gasPriceEstimates = ethGasStationInfoSelectors.getEthGasStationInfoWEI(state);
		const { allowanceGas } = ordersSelectors.getCurrentOrder(state) || {};
		return new BN(gasPriceEstimates.average)
			.dividedBy(1000000000000000000)
			.multipliedBy(allowanceGas || 0)
			.toString();
	},
	getAllOrders: state => {
		const { all, byId } = ordersSelectors.getRoot(state);
		return all.map(id => byId[id]);
	},
	getOrdersByApplication: (state, applicationId) =>
		ordersSelectors.getAllOrders(state).filter(order => order.applicationId === applicationId),
	getLatestActiveOrderForApplication: (state, applicationId) =>
		ordersSelectors.getOrdersByApplication(state, applicationId).reduce((acc, curr) => {
			if (
				curr.status !== orderStatus.CANCELED &&
				curr.status !== orderStatus.COMPLETE &&
				curr.updatedAt > (acc ? acc.updatedAt : 0)
			)
				return curr;
			return acc;
		}, null)
};

export { ordersSelectors, ordersReducers, ordersActions, ordersOperations };

export default reducer;
