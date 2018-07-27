import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const updatePrices = createAliasedAction(types.PRICES_UPDATE, prices => ({
	type: types.PRICES_UPDATE,
	payload: prices
}));

export { updatePrices };
