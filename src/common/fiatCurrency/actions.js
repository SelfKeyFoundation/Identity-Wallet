import * as types from './types';

const fiatCurrencyUpdate = fiatCurrency => ({
	type: types.FIAT_CURRENCY_UPDATE,
	payload: fiatCurrency
});

const setExchangeRates = rates => ({
	type: types.LOAD_EXCHANGE_RATES,
	payload: rates
});

export { fiatCurrencyUpdate, setExchangeRates };
