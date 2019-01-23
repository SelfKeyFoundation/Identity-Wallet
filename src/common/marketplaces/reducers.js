import { schema } from 'normalizr';
import { marketplacesTypes } from './types';
import { categories } from './assets.json';

export const initialState = {
	transactions: [],
	transactionsById: {},
	stakes: [],
	stakesById: {},
	currentTransaction: null,
	displayedPopup: null,
	categories: categories.map(c => c.id),
	categoriesById: categories.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {}),
	relyingParties: [],
	relyingPartiesByName: {}
};

export const transactionSchema = new schema.Entity('transactions', {}, { idAttribute: 'id' });
export const stakeSchema = new schema.Entity('stakes', {}, { idAttribute: 'id' });

export const marketplaceSchemas = {
	transaction: transactionSchema,
	stake: stakeSchema
};

export const updateStakeReducer = (state, { payload }) => {
	let serviceOwner = payload.serviceOwner || payload.serviceAddress;
	let id = payload.id || `${serviceOwner}_${payload.serviceId}`;
	let currentStake = state.stakesById[id];
	if (!currentStake) return state;
	currentStake = { ...currentStake, ...payload, id };
	state = { ...state, stakesById: { ...state.stakesById, [id]: currentStake } };
	return state;
};

export const setStakesReducer = (state, { payload }) => {
	let newState = payload.reduce(
		(acc, curr) => {
			curr.serviceOwner = curr.serviceOwner || curr.serviceAddress;
			let id = curr.id || `${curr.serviceOwner}_${curr.serviceId}`;
			acc.stakes.push(id);
			acc.stakesById[id] = { ...curr, id };
			return acc;
		},
		{ stakes: [], stakesById: {} }
	);
	return { ...state, ...newState };
};

export const addTransactionReducer = (state, { payload }) => {
	return {
		...state,
		transactions: [...state.transactions, payload.id],
		transactionsById: { ...state.transactionsById, [payload.id]: payload }
	};
};

export const setTransactionsReducer = (state, { payload }) => {
	return {
		...state,
		transactions: payload.map(t => t.id),
		transactionsById: payload.reduce((acc, t) => {
			acc[t.id] = t;
			return acc;
		}, {})
	};
};

export const updateTransactionReducer = (state, { payload }) => {
	if (!state.transactionsById[payload.id]) return state;
	state = {
		...state,
		transactionsById: {
			...state.transactionsById,
			[payload.id]: { ...state.transactionsById[payload.id], ...payload }
		}
	};
	return state;
};

export const setMarketplacePopupReducer = (state, { payload }) => {
	return { ...state, displayedPopup: payload };
};

export const setCurrentTransactionReducer = (state, { payload }) => {
	return { ...state, currentTransaction: payload };
};

export const updateCurrentTransactionReducer = (state, { payload }) => {
	return { ...state, currentTransaction: { ...state.currentTransaction, ...payload } };
};

export const clearCurrentTransactionReducer = state => {
	return { ...state, currentTransaction: null };
};

export const updateRelyingPartyReducer = (state, { error, payload }) => {
	let relyingParties = [state.relyingParties];
	let relyingPartiesByName = { ...state.relyingPartiesByName };
	if (!relyingPartiesByName[payload.name]) {
		relyingParties.push(payload.name);
	}
	relyingPartiesByName[payload.name] = { ...payload, error };
	return { ...state, relyingPartiesByName, relyingParties };
};

export const addKYCApplicationReducer = (state, { payload }) => {
	let rp = state.relyingPartiesByName[payload.name];
	rp = { ...rp, applications: [...rp.applications, payload.application] };
	return { ...state, relyingPartiesByName: { ...state.relyingPartiesByName, [rp.name]: rp } };
};

export const reducers = {
	updateStakeReducer,
	setStakesReducer,
	addTransactionReducer,
	setTransactionsReducer,
	updateTransactionReducer,
	setMarketplacePopupReducer,
	setCurrentTransactionReducer,
	updateCurrentTransactionReducer,
	clearCurrentTransactionReducer,
	updateRelyingPartyReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case marketplacesTypes.MARKETPLACE_STAKES_UPDATE_ONE:
			return reducers.updateStakeReducer(state, action);
		case marketplacesTypes.MARKETPLACE_STAKES_SET:
			return reducers.setStakesReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_ADD:
			return reducers.addTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_SET:
			return reducers.setTransactionsReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_UPDATE_ONE:
			return reducers.updateTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_POPUP_SHOW:
			return reducers.setMarketplacePopupReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_SET:
			return reducers.setCurrentTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_UPDATE:
			return reducers.updateCurrentTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_CLEAR:
			return reducers.clearCurrentTransactionReducer(state, action);
		case marketplacesTypes.MARKETPLACE_RP_UPDATE:
			return reducers.updateRelyingPartyReducer(state, action);
		case marketplacesTypes.MARKETPLACE_RP_APPLICATION_ADD:
			return reducers.addKYCApplicationReducer(state, action);
	}
	return state;
};

export default reducer;
