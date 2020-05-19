import * as types from './types';

const initialState = {
	fiatCurrency: 'USD',
	fiatRates: {}
};

const fiatCurrencyReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.FIAT_CURRENCY_UPDATE:
			return {
				...state,
				fiatCurrency: action.payload
			};
		case types.SET_EXCHANGE_RATES:
			return {
				...state,
				fiatRates: action.payload
			};
		default:
			return state;
	}
};

export default fiatCurrencyReducer;
