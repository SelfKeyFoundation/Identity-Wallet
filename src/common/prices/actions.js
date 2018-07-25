import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const updatePrices = createAliasedAction(types.UPDATE_PRICES, prices => ({
	type: types.UPDATE_PRICES,
	payload: prices
}));

export { updatePrices };
