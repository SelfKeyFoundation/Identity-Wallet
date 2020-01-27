import * as types from './types';

const updateExchanges = exchanges => {
	return {
		type: types.EXCHANGES_UPDATE,
		payload: exchanges
	};
};

const setListingExchanges = payload => ({
	type: types.EXCHANGES_LISTING_SET,
	payload
});

export { updateExchanges, setListingExchanges };
