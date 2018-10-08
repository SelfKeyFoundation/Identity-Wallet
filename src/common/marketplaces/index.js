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
	displayedCategory: null
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
	MARKETPLACE_TRANSACTIONS_STAKE_CONFITM: 'marketplace/transactions/STAKE_CONFIRM',
	MARKETPLACE_TRANSACTIONS_WITHDRAW_START: 'marketplace/transactions/WITHDRAW_START',
	MARKETPLACE_TRANSACTIONS_WITHDRAW_CONFIRM: 'marketplace/transactions/WITHDRAW_CONFIRM',
	MARKETPLACE_TRANSACTIONS_CURRENT_UPDATE: 'marketplace/transactions/current/UPDATE',
	MARKETPLACE_TRANSACTIONS_CURRENT_CANCEL: 'marketplace/transactions/current/CANCEL',
	MARKETPLACE_TRANSACTIONS_CURRENT_CLEAR: 'marketplace/transactions/current/CLEAR',
	MARKETPLACE_POPUP_SHOW: 'marketplace/popup/show'
};

export const marketplacesActions = {
	setTransactionsAction() {},
	setStakesAction() {}
};

export const loadTransactionsOperation = () => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplacesService;
	let services = marketplacesSelectors.servicesSelector(getState()) || [];
	let transactions = await Promise.all(
		services.map(service => mpService.loadTransactions(service.serviceOwner, service.serviceId))
	);
	await dispatch(marketplacesActions.setTransactionsAction(transactions));
};
export const loadStakesOperation = () => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplacesService;
	let services = marketplacesSelectors.servicesSelector(getState()) || [];
	let stakes = await Promise.all(
		services.map(service => mpService.loadStakingInfo(service.serviceOwner, service.serviceId))
	);
	await dispatch(marketplacesActions.setStakesAction(stakes));
};
export const placeStakeOperation = () => async (dispatch, getState) => {};
export const withdrawStakeOperation = () => async (dispatch, getState) => {};
export const updateTransactionStatusOperation = () => async (dispatch, getState) => {};

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
	widthdrawStake: createAliasedAction(
		marketplacesTypes.MARKETPLACE_STAKES_WITHDRAW,
		withdrawStakeOperation
	),
	updateTransactionStatus: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_CHECK_STATUS,
		updateTransactionStatusOperation
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
				tx.serviceOwner === serviceOwner &&
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

export const updateServiceReducer = {};

const reducer = (state = initialState, action) => state;

export default reducer;
