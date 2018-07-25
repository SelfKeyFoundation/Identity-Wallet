import * as types from './types';

const initialState = {
	wallet: {}
};

const walletReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.UPDATE_WALLET:
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
};

const reducer = walletReducer;

export default reducer;
