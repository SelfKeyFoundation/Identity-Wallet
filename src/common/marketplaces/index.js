import { schema } from 'normalizr';

import { createAliasedAction } from 'electron-redux';

export const initialState = {};

export const transactionSchema = new schema.Entity('transactions');
export const stakeSchema = new schema.Entity(
	'stakes',
	{},
	{ idAttribute: stake => `${stake.serviceOwner}_${stake.serviceId}` }
);

export const marketplaceSchemas = {
	transaction: transactionSchema,
	stake: stakeSchema
};

export const marketplacesTypes = {
	MARKETPLACE_TRANSACTIONS_LOAD: 'marketplace/transactions/LOAD',
	MARKETPLACE_STAKES_LOAD: 'marketplace/stakes/LOAD',
	MARKETPLACE_STAKES_WITHDRAW: 'marketplace/stakes/withdraw',
	MARKETPLACE_STAKES_PLACE: 'marketplace/stakes/place',
	MARKETPLACE_TRANSACTIONS_CHECK_STATUS: 'marketplace/transactions/CHECK_STATUS'
};

export const marketplacesActions = {};

export const loadTransactionsOperation = () => async (dispatch, getState) => {};
export const loadStakesOperation = () => async (dispatch, getState) => {};
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

export const marketplacesSelectors = {};

export const updateServiceReducer = {};

const reducer = (state = initialState, action) => state;

export default reducer;
