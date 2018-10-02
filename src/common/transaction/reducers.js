import * as types from './types';

const initialState = {
	address: '',
	amount: 0,
	ethFee: 0,
	usdFee: 0,
	gasPrice: 0,
	gasLimit: 0,
	nouce: 0,
	signedHex: '',
	transactionHash: '',
	addressError: false,
	sending: false,
	cryptoCurrency: ''
};

const transactionReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.TRANSACTION_UPDATE:
			return {
				...state,
				...action.payload
			};
		case types.ADDRESS_ERROR_UPDATE:
			return {
				...state,
				addressError: action.payload
			};
		case types.TREZOR_TX_SIGN:
			return {
				...state,
				signedHex: action.payload.raw,
				sending: true
			};
		default:
			return state;
	}
};

export default transactionReducer;
