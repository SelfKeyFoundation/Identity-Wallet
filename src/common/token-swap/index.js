import config from 'common/config';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import BN from 'bignumber.js';

const toBaseUnit = (amount, decimals) => new BN(amount).times(new BN(10).pow(decimals)).toFixed(0);
const toUnit = (amount, decimals) => new BN(amount).div(new BN(10).pow(decimals)).toString(10);

export const initialState = {
	tokens: [],
	source: '',
	target: '',
	transaction: false,
	error: false,
	loading: false,
	fee: false,
	gas: false,
	rate: false
};

export const tokenSwapTypes = {
	TOKEN_SWAP_LOADING_SET: 'token-swap/loading/SET',
	TOKEN_SWAP_CLEAR_OPERATION: 'token-swap/operations/CLEAR',
	TOKEN_SWAP_TOKENS_LOAD: 'token-swap/tokens/LOAD',
	TOKEN_SWAP_TOKENS_SET: 'token-swap/tokens/SET',
	TOKEN_SWAP_SOURCE_SET: 'token-swap/source/SET',
	TOKEN_SWAP_TARGET_SET: 'token-swap/target/SET',
	TOKEN_SWAP_TRANSACTION_LOAD: 'token-swap/transaction/LOAD',
	TOKEN_SWAP_TRANSACTION_SET: 'token-swap/transaction/SET',
	TOKEN_SWAP_ERROR_SET: 'token-swap/error/SET',
	TOKEN_SWAP_ERROR_CLEAR: 'token-swap/error/CLEAR'
};

export const tokenSwapActions = {
	setTokens: tokens => ({
		type: tokenSwapTypes.TOKEN_SWAP_TOKENS_SET,
		payload: tokens
	}),
	setTransaction: data => ({
		type: tokenSwapTypes.TOKEN_SWAP_TRANSACTION_SET,
		payload: data
	}),
	clearSwap: () => ({
		type: tokenSwapTypes.TOKEN_SWAP_CLEAR_OPERATION,
		payload: false
	}),
	setError: error => ({
		type: tokenSwapTypes.TOKEN_SWAP_ERROR_SET,
		payload: error
	}),
	setSource: token => ({
		type: tokenSwapTypes.TOKEN_SWAP_SOURCE_SET,
		payload: token
	}),
	setTarget: token => ({
		type: tokenSwapTypes.TOKEN_SWAP_TARGET_SET,
		payload: token
	}),
	setLoading: status => ({
		type: tokenSwapTypes.TOKEN_SWAP_LOADING_SET,
		payload: status
	})
};

const clearOperation = () => async (dispatch, getState) => {
	await dispatch(tokenSwapActions.setTransaction(false));
	await dispatch(tokenSwapActions.setError(false));
	await dispatch(tokenSwapActions.setLoading(false));
};

const setSourceOperation = token => async (dispatch, getState) => {
	await dispatch(tokenSwapOperations.clearOperation());
	await dispatch(tokenSwapActions.setSource(token));
};

const setTargetOperation = token => async (dispatch, getState) => {
	await dispatch(tokenSwapOperations.clearOperation());
	dispatch(tokenSwapActions.setTarget(token));
};

const loadTokensOperation = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const tokens = await ctx.TotleSwapService.fetchTokens();
	await dispatch(tokenSwapActions.setTokens(tokens));
};

const swapTokensOperation = ({ address, amount, decimal }) => async (dispatch, getState) => {
	await dispatch(tokenSwapActions.setLoading(true));

	const sourceAsset = tokenSwapSelectors.selectSource(getState());
	const destinationAsset = tokenSwapSelectors.selectTarget(getState());
	const partnerContractAddress = config.totlePartnerContract;

	const ctx = getGlobalContext();
	const swapRequestPayload = {
		sourceAsset,
		destinationAsset,
		sourceAmount: toBaseUnit(amount, decimal)
	};
	const request = await ctx.TotleSwapService.swap(
		address,
		swapRequestPayload,
		partnerContractAddress
	);

	if (!request.success) {
		await dispatch(tokenSwapActions.setError(request.response.message));
	} else {
		await dispatch(tokenSwapActions.setTransaction(request.response));
	}
	await dispatch(tokenSwapActions.setLoading(false));
};

export const tokenSwapOperations = {
	...tokenSwapActions,
	loadTokensOperation: createAliasedAction(
		tokenSwapTypes.TOKEN_SWAP_TOKENS_LOAD,
		loadTokensOperation
	),
	swapTokensOperation: createAliasedAction(
		tokenSwapTypes.TOKEN_SWAP_TRANSACTION_LOAD,
		swapTokensOperation
	),
	clearOperation: createAliasedAction(tokenSwapTypes.TOKEN_SWAP_CLEAR_OPERATION, clearOperation),
	setSourceOperation: createAliasedAction(
		tokenSwapTypes.TOKEN_SWAP_SOURCE_SET,
		setSourceOperation
	),
	setTargetOperation: createAliasedAction(
		tokenSwapTypes.TOKEN_SWAP_TARGET_SET,
		setTargetOperation
	)
};

// Reducers
const setTokensReducer = (state, action) => {
	return { ...state, tokens: action.payload };
};

const setTransactionReducer = (state, action) => {
	return { ...state, transaction: action.payload };
};

const setErrorReducer = (state, action) => {
	return { ...state, error: action.payload };
};

const setSourceReducer = (state, action) => {
	return { ...state, source: action.payload };
};

const setTargetReducer = (state, action) => {
	return { ...state, target: action.payload };
};

const setLoadingReducer = (state, action) => {
	return { ...state, loading: !!action.payload };
};

export const tokenSwapReducers = {
	setTokensReducer,
	setTransactionReducer,
	setErrorReducer,
	setSourceReducer,
	setTargetReducer,
	setLoadingReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case tokenSwapTypes.TOKEN_SWAP_TOKENS_SET:
			return tokenSwapReducers.setTokensReducer(state, action);
		case tokenSwapTypes.TOKEN_SWAP_TRANSACTION_SET:
			return tokenSwapReducers.setTransactionReducer(state, action);
		case tokenSwapTypes.TOKEN_SWAP_ERROR_SET:
			return tokenSwapReducers.setErrorReducer(state, action);
		case tokenSwapTypes.TOKEN_SWAP_SOURCE_SET:
			return tokenSwapReducers.setSourceReducer(state, action);
		case tokenSwapTypes.TOKEN_SWAP_TARGET_SET:
			return tokenSwapReducers.setTargetReducer(state, action);
		case tokenSwapTypes.TOKEN_SWAP_LOADING_SET:
			return tokenSwapReducers.setLoadingReducer(state, action);
	}
	return state;
};

// Selectors
export const tokenSwapSelectors = {
	selectRoot: state => state.tokenSwap,
	selectTokens: state => tokenSwapSelectors.selectRoot(state).tokens,
	selectSource: state => tokenSwapSelectors.selectRoot(state).source,
	selectTarget: state => tokenSwapSelectors.selectRoot(state).target,
	selectError: state => tokenSwapSelectors.selectRoot(state).error,
	selectLoading: state => tokenSwapSelectors.selectRoot(state).loading,
	selectTransaction: state => tokenSwapSelectors.selectRoot(state).transaction,
	selectFee: state => {
		const transaction = tokenSwapSelectors.selectTransaction(state);
		let totleFee = 0;
		let partnerFee = 0;
		if (transaction) {
			totleFee = transaction.summary.reduce(
				(acc, curr) => acc + (curr.totleFee ? curr.totleFee.amount : 0),
				0
			);
			partnerFee = transaction.summary.reduce(
				(acc, curr) => acc + (curr.partnerFee ? curr.partnerFee.amount : 0),
				0
			);
		}
		const total = transaction ? +totleFee + +partnerFee : 0;
		return transaction ? toUnit(total, 18) : false;
	},
	selectGas: state => {
		const transaction = tokenSwapSelectors.selectTransaction(state);
		let gas = 0;
		if (transaction) {
			gas = transaction.transactions.reduce(
				(acc, curr) => acc + curr.tx.gas * curr.tx.gasPrice,
				0
			);
		}
		return transaction ? toUnit(gas, 18) : false;
	},
	selectRate: state => {
		const transaction = tokenSwapSelectors.selectTransaction(state);
		return transaction ? transaction.summary[0].market.rate : false;
	}
};

export default reducer;
