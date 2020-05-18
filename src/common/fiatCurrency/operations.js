import { getGlobalContext } from 'common/context';
import * as actions from './actions';

const loadExchangeRatesOperation = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const rates = await ctx.CurrencyService.fetchRates();
	await dispatch(actions.setExchangeRates(rates));
};

export default { loadExchangeRatesOperation, ...actions };
