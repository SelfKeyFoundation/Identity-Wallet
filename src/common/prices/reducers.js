import * as types from './types';

const initialState = {
	prices: []
};

const updatePrice = (oldPrices, newPrices) => {
	if (!oldPrices || !newPrices) {
		return [];
	}
	const concatPrices = oldPrices
		.concat(newPrices)
		.filter((value, pos, arr) => arr.map(e => e.symbol).lastIndexOf(value.symbol) === pos);
	return [...concatPrices];
};

const pricesReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.PRICES_UPDATE:
			return {
				...state,
				prices: updatePrice(state.prices, action.payload)
			};
		default:
			return state;
	}
};

export default pricesReducer;
