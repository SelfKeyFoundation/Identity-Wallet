import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';

export const initialState = {
	transactions: [],
	processing: false
};

export const transactionHistoryTypes = {
	TRANSACTION_HISTORY_SET_TRANSACTIONS: 'transaction/history/set/TRANSACTIONS',
	TRANSACTION_HISTORY_LOAD_TRANSACTIONS: 'transaction/history/load/TRANSACTIONS',
	TRANSACTION_HISTORY_RELOAD_TRANSACTIONS: 'transaction/history/reload/TRANSACTIONS',
	TRANSACTION_HISTORY_SET_PROCESSING: 'transaction/history/set/PROCESSING'
};

const transactionHistoryActions = {
	setTransactionsAction: transactions => ({
		type: transactionHistoryTypes.TRANSACTION_HISTORY_SET_TRANSACTIONS,
		payload: transactions
	}),
	setProcessingAction: processing => ({
		type: transactionHistoryTypes.TRANSACTION_HISTORY_SET_PROCESSING,
		payload: processing
	})
};

const loadTransactions = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState());
	const txHistoryService = getGlobalContext().txHistoryService;
	const transactions = await txHistoryService.getTransactions(wallet.address);
	await dispatch(transactionHistoryActions.setTransactionsAction(transactions));
};

const reloadTransactions = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState());
	const txHistoryService = getGlobalContext().txHistoryService;
	await dispatch(transactionHistoryActions.setProcessingAction(true));
	await txHistoryService.reload(wallet);
	await dispatch(transactionHistoryActions.setProcessingAction(false));
	const transactions = await txHistoryService.getTransactions(wallet.address);
	await dispatch(transactionHistoryActions.setTransactionsAction(transactions));
};

const operations = {
	loadTransactions,
	reloadTransactions
};

const transactionHistoryOperations = {
	...transactionHistoryActions,
	loadTransactionsOperation: createAliasedAction(
		transactionHistoryTypes.TRANSACTION_HISTORY_LOAD_TRANSACTIONS,
		operations.loadTransactions
	),
	reloadTransactionsOperation: createAliasedAction(
		transactionHistoryTypes.TRANSACTION_HISTORY_RELOAD_TRANSACTIONS,
		operations.reloadTransactions
	)
};

const setTransactionsReducer = (state, action) => {
	return { ...state, transactions: action.payload };
};

const setProcessingReducer = (state, action) => {
	return { ...state, processing: action.payload };
};

const transactionHistoryReducers = {
	setTransactionsReducer,
	setProcessingReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case transactionHistoryTypes.TRANSACTION_HISTORY_SET_TRANSACTIONS:
			return transactionHistoryReducers.setTransactionsReducer(state, action);
		case transactionHistoryTypes.TRANSACTION_HISTORY_SET_PROCESSING:
			return transactionHistoryReducers.setProcessingReducer(state, action);
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
