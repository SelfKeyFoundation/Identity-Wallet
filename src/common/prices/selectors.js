import _ from 'lodash';

export const getPrices = ({ prices }) => prices;
export const getBySymbol = (state, symbol) => {
	return _.find(getPrices(state).prices, coinPrice => coinPrice.symbol === symbol);
};
