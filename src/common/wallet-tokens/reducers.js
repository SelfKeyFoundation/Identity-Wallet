import * as types from './types';

const initialState = {
	tokens: [],
	topTokenListSize: 5
};

const walletTokensReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.WALLET_TOKENS_UPDATE:
			return {
				...state,
				tokens: action.payload
			};
		default:
			return state;
	}
};

export default walletTokensReducer;
