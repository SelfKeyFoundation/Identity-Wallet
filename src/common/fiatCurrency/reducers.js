import * as types from './types';

const initialState = {
	fiatCurrency: 'USD'
};

const fiatCurrencyReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.UPDATE_FIAT_CURRENCY:
			return {
				...state,
				...initialState,
				fiatCurrency: action.fiatCurrency
			};
		default:
			return state;
	}
};

const reducer = fiatCurrencyReducer;

export default reducer;
