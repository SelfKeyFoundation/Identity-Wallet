import * as types from './types';

const initialState = {
	tokens: []
};

const tokensReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.UPDATE_TOKENS:
			return {
				...state,
				tokens: action.payload
			};
		default:
			return state;
	}
};

const reducer = tokensReducer;

export default reducer;
