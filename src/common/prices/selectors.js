import _ from 'lodash';

export const getPrices = ({ prices }) => prices;
export const getBySymbol = (state, symbol) => {
	return _.find(getPrices(state).prices, coinPrice => coinPrice.symbol === symbol);
};
export const getRate = (state, symbol, fiat) => {
	let price = getBySymbol(state, symbol);
	let key = `price${(fiat || 'usd').toUpperCase()}`;
	if (key in price) return price[key];
	return 0;
};
