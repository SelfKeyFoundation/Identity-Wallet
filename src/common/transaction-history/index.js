import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';

export const initialState = {
	transactions: []
};

export const transactionHistoryTypes = {
	TRANSACTION_HISTORY_SET_TRANSACTIONS: 'transaction/history/set/TRANSACTIONS',
	TRANSACTION_HISTORY_LOAD_TRANSACTIONS: 'transaction/history/load/TRANSACTIONS'
};

const transactionHistoryActions = {
	setTransactionsAction: transactions => ({
		type: transactionHistoryTypes.TRANSACTION_HISTORY_SET_TRANSACTIONS,
		payload: transactions
	})
};

const loadTransactions = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState());
	const txHistoryService = getGlobalContext().txHistoryService;
	const transactions = await txHistoryService.getTransactions(wallet.publicKey);
	await dispatch(transactionHistoryActions.setTransactionsAction(transactions));
};

const operations = {
	loadTransactions
};

const transactionHistoryOperations = {
	...transactionHistoryActions,
	loadTransactionsOperation: createAliasedAction(
		transactionHistoryTypes.TRANSACTION_HISTORY_LOAD_TRANSACTIONS,
		operations.loadTransactions
	)
};

const setTransactionsReducer = (state, action) => {
	return { ...state, transactions: action.payload };
};

const transactionHistoryReducers = {
	setTransactionsReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case transactionHistoryTypes.TRANSACTION_HISTORY_SET_TRANSACTIONS:
			return transactionHistoryReducers.setTransactionsReducer(state, action);
	}
	return state;
};

const selectTransactionHistory = state => state.transactionHistory;

const transactionHistorySelectors = {
	selectTransactionHistory
};

export {
	transactionHistorySelectors,
	transactionHistoryReducers,
	transactionHistoryActions,
	transactionHistoryOperations
};

export default reducer;
