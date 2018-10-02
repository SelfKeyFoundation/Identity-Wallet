/* istanbul ignore file */

export const initialState = {
	transactions: [],
	transactionsById: {},
	transactionsByOwnerAndId: {},
	services: [],
	servicesByOwnerAndId: {}
};

export const marketplacesActions = {
	setTransactions: transactions => {}
};

export const marketplacesOperations = {
	...marketplacesActions
};

export const marketplacesTypes = {
	MARKETPLACE_TRANSACTIONS_SET: 'app/marketplaces/transactions/SET',
	MARKETPLACE_TRANSACTIONS_SET_ONE: 'app/marketplaces/transactions/SET_ONE'
};

export const marketplacesSelectors = {};

const reducer = (state = initialState, action) => state;

export default reducer;
