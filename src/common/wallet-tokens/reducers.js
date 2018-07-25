import * as types from './types';

const initialState = {
	tokens: [],
	topTokenListSize: 5
};

const walletTokensReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.UPDATE_WALLET_TOKENS:
			return {
				...state,
				tokens: action.payload
			};
		default:
			return state;
	}
};

const reducer = walletTokensReducer;

export default reducer;
