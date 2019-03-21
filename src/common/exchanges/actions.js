import * as types from './types';

const updateExchanges = exchanges => {
	return {
		type: types.EXCHANGES_UPDATE,
		payload: exchanges
	};
};

export { updateExchanges };
