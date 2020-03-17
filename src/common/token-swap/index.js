import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';

export const initialState = {
	tokens: []
};

export const tokenSwapTypes = {
	TOKEN_SWAP_LOAD_OPERATION: 'token-swap/operations/LOAD',
	TOKEN_SWAP_TOKENS_SET: 'token-swap/actions/TOKENS-SET'
};

export const tokenSwapActions = {
	setTokens: tokens => ({
		type: tokenSwapTypes.TOKEN_SWAP_TOKENS_SET,
		payload: tokens
	})
};

const loadTokensOperation = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const tokens = await ctx.TotleSwapService.fetchTokens();
	await dispatch(tokenSwapActions.setTokens(tokens));
};

export const tokenSwapOperations = {
	...tokenSwapActions,
	loadTokensOperation: createAliasedAction(
		tokenSwapTypes.TOKEN_SWAP_LOAD_OPERATION,
		loadTokensOperation
	)
};

const setTokensReducer = (state, action) => {
	const tokens = action.payload;
	return { ...state, tokens };
};

export const tokenSwapReducers = {
	setTokensReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case tokenSwapTypes.TOKEN_SWAP_TOKENS_SET:
			return tokenSwapReducers.setTokensReducer(state, action);
	}
	return state;
};

export const tokenSwapSelectors = {
	selectRoot: state => state.tokenSwap,
	selectTokens: state => tokenSwapSelectors.selectRoot(state).tokens
};

export default reducer;
