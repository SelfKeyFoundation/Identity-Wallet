import * as types from './types';

const initialState = {
	tokens: []
};

const tokensReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.TOKENS_SET:
			return {
				...state,
				tokens: action.payload
			};
		default:
			return state;
	}
};

export default tokensReducer;
