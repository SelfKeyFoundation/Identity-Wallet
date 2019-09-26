import * as types from './types';

const initialState = {
	wallet: {}
};

const walletReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.WALLET_UPDATE:
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
};

export default walletReducer;
