import _ from 'lodash';

export const getPrices = ({ prices }) => prices;
export const getBySymbol = (state, symbol) => {
	return _.find(getPrices(state).prices, coinPrice => coinPrice.symbol === symbol);
};
export const getRate = (state, symbol, fiat) => {
	let price = getBySymbol(state, symbol);
	if (!price || !fiat) {
		return 0;
	}

	const indexKey = `price${(fiat || 'usd').toUpperCase()}`;
	if (indexKey in price) {
		return price[indexKey];
	}
	return 0;
};

export const getInvRate = (state, symbol, fiat) => {
	let price = getBySymbol(state, symbol);
	if (!price || !fiat) {
		return 0;
	}
	const indexKey = `price${(fiat || 'usd').toUpperCase()}`;
	if (indexKey in price) {
		return 1 / price[indexKey];
	}
	return 0;
};
