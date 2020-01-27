import * as actions from './actions';
import * as types from './types';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';

const loadListingExchangesOperation = () => async (dispatch, getState) => {
	const exchangesService = getGlobalContext().exchangesService;
	const listingExchanges = await exchangesService.loadListingExchanges();
	await dispatch(actions.setListingExchanges(listingExchanges));
};

export default {
	...actions,
	loadListingExchangesOperation: createAliasedAction(
		types.LISTING_EXCHANGES_LOAD_OPERATION,
		loadListingExchangesOperation
	)
};
