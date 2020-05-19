import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import * as actions from './actions';
import * as types from './types';

const loadExchangeRates = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const rates = await ctx.currencyService.fetchRates();
	await dispatch(actions.setExchangeRates(rates));
};

export default {
	loadExchangeRatesOperation: createAliasedAction(types.LOAD_EXCHANGE_RATES, loadExchangeRates),
	...actions
};
