import * as types from './types';

const initialState = {
	prices: []
};

const pricesReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.UPDATE_PRICES:
			return {
				...state,
				prices: action.payload
			};
		default:
			return state;
	}
};

const reducer = pricesReducer;

export default reducer;
