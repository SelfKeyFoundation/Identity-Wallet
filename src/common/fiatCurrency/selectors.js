const getFiatCurrency = state => state.fiatCurrency;

const selectFiatRates = state => getFiatCurrency(state).fiatRates;

const selectExchangeRate = (state, currency) => {
	const rates = selectFiatRates(state);
	if (currency && rates[currency]) {
		return rates[currency];
	}
	return 1;
};

export { getFiatCurrency, selectFiatRates, selectExchangeRate };
