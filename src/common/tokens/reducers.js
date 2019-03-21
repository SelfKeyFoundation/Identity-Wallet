import * as types from './types';

const initialState = {
	tokens: [],
	tokenError: ''
};

const tokensReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.TOKENS_SET:
			return {
				...state,
				tokens: action.payload
			};
		case types.TOKENS_TOKEN_ERROR_SET:
			return {
				...state,
				tokenError: action.payload
			};
		default:
			return state;
	}
};

export default tokensReducer;
