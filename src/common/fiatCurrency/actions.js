import * as types from './types';

const fiatCurrencyUpdate = fiatCurrency => ({
	type: types.UPDATE_FIAT_CURRENCY,
	payload: fiatCurrency
});

export { fiatCurrencyUpdate };
