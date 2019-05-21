import bankAccountsTypes from './types';

export const initialState = {
	loading: true,
	error: null,
	main: [],
	mainById: {},
	jurisdictions: [],
	jurisdictionsById: {},
	details: {},
	detailsById: {},
	translation: {}
};

export const bankAccountsReducers = {
	loadingSetReducer(state, actions) {
		return { ...state, loading: actions.payload };
	},
	errorSetReducer(state, actions) {
		return { ...state, error: actions.payload };
	},
	mainSetReducers(state, action) {
		const main = action.payload.map(item => item.id);
		const mainById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, main, mainById };
	},
	jurisdictionsSetReducers(state, action) {
		const jurisdictions = action.payload.map(jurisdiction => jurisdiction.id);
		const jurisdictionsById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, jurisdictions, jurisdictionsById };
	},
	detailsSetReducers(state, action) {
		const details = action.payload.map(d => d.id);
		const detailsById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, details, detailsById };
	}
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case bankAccountsTypes.BANKACCOUNTS_LOADING_SET:
			return bankAccountsReducers.loadingSetReducer(state, action);
		case bankAccountsTypes.BANKACCOUNTS_SET:
			return bankAccountsReducers.mainSetReducers(state, action);
		case bankAccountsTypes.BANKACCOUNTS_ERROR_SET:
			return bankAccountsReducers.errorSetReducer(state, action);
		case bankAccountsTypes.BANKACCOUNTS_JURISDICTIONS_SET:
			return bankAccountsReducers.jurisdictionsSetReducers(state, action);
		case bankAccountsTypes.BANKACCOUNTS_DETAILS_SET:
			return bankAccountsReducers.detailsSetReducers(state, action);

		default:
			return state;
	}
};

export default reducer;
