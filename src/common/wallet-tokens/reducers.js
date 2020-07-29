import * as types from './types';

const initialState = {
	tokens: [],
	topTokenListSize: 5000
};

const updateTokens = (oldTokens, newTokens) => {
	if (!oldTokens || !newTokens) {
		return [];
	}
	const concatTokens = oldTokens
		.concat(newTokens)
		.filter((value, pos, arr) => arr.map(e => e.symbol).lastIndexOf(value.symbol) === pos);
	return [...concatTokens];
};

const setWalletTokens = (state, action) => {
	return { ...state, tokens: [...action.payload] };
};

const walletTokensReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.WALLET_TOKENS_UPDATE:
			return {
				...state,
				tokens: updateTokens(state.tokens, action.payload)
			};
		case types.WALLET_TOKENS_SET:
			return setWalletTokens(state, action);
		default:
			return state;
	}
};

export default walletTokensReducer;
