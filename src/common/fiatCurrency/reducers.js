import * as types from './types';

const initialState = {
	fiatCurrency: 'USD'
};

const fiatCurrencyReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.FIAT_CURRENCY_UPDATE:
			return {
				...state,
				fiatCurrency: action.payload
			};
		default:
			return state;
	}
};

export default fiatCurrencyReducer;
