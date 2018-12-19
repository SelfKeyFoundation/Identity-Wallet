import * as types from './types';
import { normalize } from 'normalizr';
import { exchangeListSchema } from './schemas';

const initialState = {
	byId: {},
	allIds: []
};

const exchangesReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.EXCHANGES_UPDATE:
			const normalized = normalize(action.payload, exchangeListSchema);
			return {
				...state,
				byId: normalized.entities.exchanges,
				allIds: normalized.result
			};
		default:
			return state;
	}
};

export default exchangesReducer;
