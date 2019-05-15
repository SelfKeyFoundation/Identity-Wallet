import * as types from './types';

const initialState = {
	wallet: {},
	associateError: ''
};

const walletReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.WALLET_UPDATE:
			return {
				...state,
				...action.payload
			};
		case types.WALLET_ASSOCIATE_DID_ERROR_SET:
			return {
				...state,
				associateError: action.payload
			};
		default:
			return state;
	}
};

export default walletReducer;
