import * as types from './types';
import { normalize } from 'normalizr';
import { exchangeListSchema } from './schemas';
import { schedulerTypes } from '../scheduler';
import { LISTING_EXCHANGES_SYNC_JOB } from '../../main/exchanges/listing-exchanges-sync-job-handler';

export const initialState = {
	byId: {},
	allIds: [],
	exchangesListingById: {},
	exchangesListingAll: []
};

const reducers = {
	setListingExchangesReducer: (state, action) => {
		const { payload = [] } = action;
		const exchangesListingAll = payload.map(exch => exch.id);
		const exchangesListingById = payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, exchangesListingAll, exchangesListingById };
	},
	finishListingExchangesJobReducer: (state, action) => {
		const { finishStatus, result = [], category } = action.payload;
		if (category !== LISTING_EXCHANGES_SYNC_JOB || finishStatus !== 'success') {
			return state;
		}
		const exchangesListingAll = result.map(exch => exch.id);
		const exchangesListingById = result.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, exchangesListingAll, exchangesListingById };
	}
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
		case types.EXCHANGES_LISTING_SET:
			return reducers.setListingExchangesReducer(state, action);
		case schedulerTypes.SCHEDULER_JOB_FINISH:
			return reducers.finishListingExchangesJobReducer(state, action);
		default:
			return state;
	}
};

export default exchangesReducer;
