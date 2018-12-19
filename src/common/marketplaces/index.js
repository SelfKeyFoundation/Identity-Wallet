import { schema } from 'normalizr';
import _ from 'lodash';
import BN from 'bignumber.js';
import { createAliasedAction } from 'electron-redux';
import { exchangesSelectors } from '../exchanges';
import { ethGasStationInfoSelectors } from '../eth-gas-station';
import { fiatCurrencySelectors } from '../fiatCurrency';
import { pricesSelectors } from '../prices';
import { getGlobalContext } from '../context';

export const initialState = {
	transactions: [],
	transactionsById: {},
	stakes: [],
	stakesById: {},
	currentTransaction: null,
	displayedPopup: null,
	displayedState: null
};

export const transactionSchema = new schema.Entity('transactions', {}, { idAttribute: 'id' });
export const stakeSchema = new schema.Entity('stakes', {}, { idAttribute: 'id' });

export const marketplaceSchemas = {
	transaction: transactionSchema,
	stake: stakeSchema
};

export const marketplacesTypes = {
	MARKETPLACE_TRANSACTIONS_LOAD: 'marketplace/transactions/LOAD',
	MARKETPLACE_TRANSACTIONS_ADD: 'marketplace/transactions/ADD',
	MARKETPLACE_TRANSACTIONS_SET: 'marketplace/transactions/SET',
	MARKETPLACE_TRANSACTIONS_UPDATE_ONE: 'marketplace/transactions/UPDATE_ONE',
	MARKETPLACE_STAKES_LOAD: 'marketplace/stakes/LOAD',
	MARKETPLACE_STAKES_UPDATE_ONE: 'marketplace/stakes/UPDATE_ONE',
	MARKETPLACE_STAKES_SET: 'marketplace/stakes/SET',
	MARKETPLACE_STAKES_WITHDRAW: 'marketplace/stakes/WITHDRAW',
	MARKETPLACE_STAKES_PLACE: 'marketplace/stakes/PLACE',
	MARKETPLACE_TRANSACTIONS_UPDATE_STATUS: 'marketplace/transactions/UPDATE_STATUS',
	MARKETPLACE_TRANSACTIONS_STAKE_START: 'marketplace/transactions/STAKE_START',
	MARKETPLACE_TRANSACTIONS_STAKE_CONFIRM: 'marketplace/transactions/STAKE_CONFIRM',
	MARKETPLACE_TRANSACTIONS_WITHDRAW_START: 'marketplace/transactions/WITHDRAW_START',
	MARKETPLACE_TRANSACTIONS_WITHDRAW_CONFIRM: 'marketplace/transactions/WITHDRAW_CONFIRM',
	MARKETPLACE_TRANSACTIONS_CURRENT_UPDATE: 'marketplace/transactions/current/UPDATE',
	MARKETPLACE_TRANSACTIONS_CURRENT_SET: 'marketplace/transactions/current/SET',
	MARKETPLACE_TRANSACTIONS_CURRENT_CANCEL: 'marketplace/transactions/current/CANCEL',
	MARKETPLACE_TRANSACTIONS_CURRENT_CLEAR: 'marketplace/transactions/current/CLEAR',
	MARKETPLACE_POPUP_SHOW: 'marketplace/popup/show',
	MARKETPLACE_STATE_SHOW: 'marketplace/state/show'
};

export const marketplacesActions = {
	setTransactionsAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_SET, payload };
	},
	setStakesAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_STAKES_SET, payload };
	},
	updateStakeAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_STAKES_UPDATE_ONE, payload };
	},
	addTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_ADD, payload };
	},
	updateTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_UPDATE_ONE, payload };
	},
	updateCurrentTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_UPDATE, payload };
	},
	setCurrentTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_SET, payload };
	},
	clearCurrentTransactionAction() {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_CLEAR };
	},
	showMarketplacePopupAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_POPUP_SHOW, payload };
	},
	displayMarketplaceStateAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_STATE_SHOW, payload };
	}
};

export const loadTransactionsOperation = () => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	let services = marketplacesSelectors.servicesSelector(getState()) || [];
	let transactions = await Promise.all(
		services.map(service => mpService.loadTransactions(service.serviceOwner, service.serviceId))
	);

	transactions = transactions.reduce((acc, curr) => {
		return acc.concat(curr);
	}, []);
	await dispatch(marketplacesActions.setTransactionsAction(transactions));
};

export const loadStakesOperation = () => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	let services = marketplacesSelectors.servicesSelector(getState()) || [];
	let stakes = await Promise.all(
		services.map(service => mpService.loadStakingInfo(service.serviceOwner, service.serviceId))
	);
	await dispatch(marketplacesActions.setStakesAction(stakes));
};

export const placeStakeOperation = (serviceOwner, serviceId, amount, gasPrice, gasLimit) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	const newTransaction = await mpService.placeStake(
		serviceOwner,
		serviceId,
		amount,
		gasPrice,
		gasLimit
	);

	await dispatch(marketplacesActions.addTransactionAction(newTransaction));
};

export const withdrawStakeOperation = (serviceOwner, serviceId, gasPrice, gasLimit) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;

	const newTransaction = await mpService.withdrawStake(
		serviceOwner,
		serviceId,
		gasPrice,
		gasLimit
	);

	await dispatch(marketplacesActions.addTransactionAction(newTransaction));
};
export const updateTransactionStatusOperation = tx => async (dispatch, getState) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	const status = await mpService.checkMpTxStatus(tx);
	if (status === tx.lastStatus) return;

	tx = { ...tx, lastStatus: status };

	tx = await mpService.updateTransaction(tx);

	if (status === 'success') {
		let stake = await mpService.loadStakingInfo(tx.serviceOwner, tx.serviceId);
		await dispatch(marketplacesActions.updateStakeAction(stake));
	}
	await dispatch(marketplacesActions.updateTransactionAction(tx));
};

export const startStakeTransactionOperation = (serviceOwner, serviceId, amount) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	let currentTransaction = marketplacesSelectors.currentTransactionSelector(getState());
	let gasLimit = await mpService.estimateGasForStake(serviceOwner, serviceId);
	let tx = {
		action: 'placeStake',
		gasLimit,
		gasPrice: currentTransaction.gasPriceEstimates.average,
		serviceOwner,
		serviceId,
		amount
	};
	await dispatch(marketplacesActions.setCurrentTransactionAction(tx));
	await dispatch(marketplacesActions.showMarketplacePopupAction('confirmStakeTransaction'));
};

export const confirmStakeTransactionOperation = () => async (dispatch, getState) => {
	let tx = marketplacesSelectors.currentTransactionSelector(getState());
	await dispatch(
		marketplacesOperations.placeStake(
			tx.serviceOwner,
			tx.serviceId,
			tx.amount,
			tx.gasPrice,
			tx.gasLimit
		)
	);
	await dispatch(marketplacesActions.showMarketplacePopupAction('pendingTransaction'));
	await dispatch(marketplacesActions.clearCurrentTransactionAction());
};

export const startWithdrawTransactionOperation = (serviceOwner, serviceId) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	let currentTransaction = marketplacesSelectors.currentTransactionSelector(getState());
	let gasLimit = await mpService.estimateGasForWithdraw(serviceOwner, serviceId);
	let tx = {
		action: 'withdrawStake',
		gasLimit,
		gasPrice: currentTransaction.gasPriceEstimates.average,
		serviceOwner,
		serviceId
	};
	await dispatch(marketplacesActions.setCurrentTransactionAction(tx));
	await dispatch(marketplacesActions.showMarketplacePopupAction('confirmWithdrawTransaction'));
};

export const confirmWithdrawTransactionOperation = (serviceOwner, serviceId) => async (
	dispatch,
	getState
) => {
	let tx = marketplacesSelectors.currentTransactionSelector(getState());
	await dispatch(
		marketplacesOperations.withdrawStake(
			tx.serviceOwner,
			tx.serviceId,
			tx.gasPrice,
			tx.gasLimit
		)
	);
	await dispatch(marketplacesActions.showMarketplacePopupAction('pendingTransaction'));
	await dispatch(marketplacesActions.clearCurrentTransactionAction());
};

export const cancelCurrentTransactionOperation = () => async (dispatch, getState) => {
	await dispatch(marketplacesActions.clearCurrentTransactionAction());
	await dispatch(marketplacesActions.showMarketplacePopupAction(null));
};

export const marketplacesOperations = {
	...marketplacesActions,
	loadTransactions: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_LOAD,
		loadTransactionsOperation
	),
	loadStakes: createAliasedAction(marketplacesTypes.MARKETPLACE_STAKES_LOAD, loadStakesOperation),
	placeStake: createAliasedAction(
		marketplacesTypes.MARKETPLACE_STAKES_PLACE,
		placeStakeOperation
	),
	withdrawStake: createAliasedAction(
		marketplacesTypes.MARKETPLACE_STAKES_WITHDRAW,
		withdrawStakeOperation
	),
	updateTransactionStatus: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_UPDATE_STATUS,
		updateTransactionStatusOperation
	),
	startStakeTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_STAKE_START,
		startStakeTransactionOperation
	),
	confirmStakeTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_STAKE_CONFIRM,
		confirmStakeTransactionOperation
	),
	startWithdrawTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_WITHDRAW_START,
		startWithdrawTransactionOperation
	),
	confirmWithdrawTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_WITHDRAW_CONFIRM,
		confirmWithdrawTransactionOperation
	)
};

export const marketplacesSelectors = {
	marketplacesSelector(state) {
		return state.marketplaces;
	},
	servicesSelector(state) {
		let exchanges = exchangesSelectors.getExchanges(state);
		if (!exchanges) return null;
		let services = [];
		let servicesById = {};
		let data = exchanges.reduce(
			(acc, curr) => {
				let id = `${curr.serviceOwner}_${curr.serviceId}`;
				if (id in servicesById) return acc;
				let service = _.pick(curr, 'serviceOwner', 'serviceId', 'amount', 'lockPeriod');
				service.id = id;
				acc.services.push(service);
				acc.servicesById[id] = service;
				return acc;
			},
			{ services, servicesById }
		);
		return data.services;
	},
	stakeSelector(state, id) {
		return this.marketplacesSelector(state).stakesById[id];
	},
	transactionsSelector(state) {
		let { transactions, transactionsById } = this.marketplacesSelector(state);
		return transactions.map(id => transactionsById[id]);
	},
	pendingTransactionSelector(state, serviceOwner, serviceId) {
		let pendingTxs = this.transactionsSelector(state).filter(
			tx =>
				(tx.serviceOwner || tx.serviceAddress) === serviceOwner &&
				tx.serviceId === serviceId &&
				['pending', 'processing'].includes(tx.lastStatus)
		);
		return pendingTxs.length ? pendingTxs[0] : null;
	},
	currentTransactionSelector(state) {
		let gasPriceEstimates = ethGasStationInfoSelectors.getEthGasStationInfoWEI(state);
		let fiat = fiatCurrencySelectors.getFiatCurrency(state);
		let fiatRate = pricesSelectors.getRate(state, 'eth', fiat);
		let tx = this.marketplacesSelector(state).currentTransaction;
		if (!tx) tx = { action: 'none', gasLimit: 0, gasPrice: gasPriceEstimates.average };
		let fee = new BN(tx.gasPrice || 0).multipliedBy(tx.gasLimit || 0).toString();
		let feeFiat = new BN(fee).multipliedBy(fiatRate).toString();
		return { ...tx, gasPriceEstimates, fiat, fiatRate, fee, feeFiat };
	},
	displayedPopupSelector(state) {
		return this.marketplacesSelector(state).displayedPopup;
	},
	displayedCategorySelector(state) {
		return this.marketplacesSelector(state).displayedCategory;
	}
};

export const updateStakeReducer = (state, { payload }) => {
	let serviceOwner = payload.serviceOwner || payload.serviceAddress;
	let id = payload.id || `${serviceOwner}_${payload.serviceId}`;
	let currentStake = state.stakesById[id];
	if (!currentStake) return state;
	currentStake = { ...currentStake, ...payload, id };
	state = { ...state, stakesById: { ...state.stakesById, [id]: currentStake } };
	return state;
};

export const setStakesReducer = (state, { payload }) => {
	let newState = payload.reduce(
		(acc, curr) => {
			curr.serviceOwner = curr.serviceOwner || curr.serviceAddress;
			let id = curr.id || `${curr.serviceOwner}_${curr.serviceId}`;
			acc.stakes.push(id);
			acc.stakesById[id] = { ...curr, id };
			return acc;
		},
		{ stakes: [], stakesById: {} }
	);
	return { ...state, ...newState };
};

export const addTransactionReducer = (state, { payload }) => {
	return {
		...state,
		transactions: [...state.transactions, payload.id],
		transactionsById: { ...state.transactionsById, [payload.id]: payload }
	};
};

export const setTransactionsReducer = (state, { payload }) => {
	return {
		...state,
		transactions: payload.map(t => t.id),
		transactionsById: payload.reduce((acc, t) => {
			acc[t.id] = t;
			return acc;
		}, {})
	};
};

export const updateTransactionReducer = (state, { payload }) => {
	if (!state.transactionsById[payload.id]) return state;
	state = {
		...state,
		transactionsById: {
			...state.transactionsById,
			[payload.id]: { ...state.transactionsById[payload.id], ...payload }
		}
	};
	return state;
};

export const setMarketplacePopupReducer = (state, { payload }) => {
	return { ...state, displayedPopup: payload };
};

export const setMarketplaceStateReducer = (state, { payload }) => {
	return { ...state, displayedState: payload };
};

export const setCurrentTransactionReducer = (state, { payload }) => {
	return { ...state, currentTransaction: payload };
};

export const updateCurrentTransactionReducer = (state, { payload }) => {
	return { ...state, currentTransaction: { ...state.currentTransaction, ...payload } };
};

export const clearCurrentTransactionReducer = state => {
	return { ...state, currentTransaction: null };
};

export const reducers = {
	updateStakeReducer,
	setStakesReducer,
	addTransactionReducer,
	setTransactionsReducer,
	updateTransactionReducer,
	setMarketplaceStateReducer,
	setMarketplacePopupReducer,
	setCurrentTransactionReducer,
	updateCurrentTransactionReducer,
	clearCurrentTransactionReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case marketplacesTypes.MARKETPLACE_STAKES_UPDATE_ONE:
			return reducers.updateStakeReducer(state, action);
		case marketplacesTypes.MARKETPLACE_STAKES_SET:
			return reducers.setStakesReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_ADD:
			return reducers.addTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_SET:
			return reducers.setTransactionsReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_UPDATE_ONE:
			return reducers.updateTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_STATE_SHOW:
			return reducers.setMarketplaceStateReducer(state, action);
		case marketplacesTypes.MARKETPLACE_POPUP_SHOW:
			return reducers.setMarketplacePopupReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_SET:
			return reducers.setCurrentTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_UPDATE:
			return reducers.updateCurrentTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_CLEAR:
			return reducers.clearCurrentTransactionReducer(state, action);
	}
	return state;
};

export default reducer;
