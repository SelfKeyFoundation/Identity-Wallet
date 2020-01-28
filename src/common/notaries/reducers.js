import notariesTypes from './types';

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

export const notariesReducers = {
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
		case notariesTypes.NOTARIES_LOADING_SET:
			return notariesReducers.loadingSetReducer(state, action);
		case notariesTypes.NOTARIES_SET:
			return notariesReducers.mainSetReducers(state, action);
		case notariesTypes.NOTARIES_ERROR_SET:
			return notariesReducers.errorSetReducer(state, action);
		case notariesTypes.NOTARIES_JURISDICTIONS_SET:
			return notariesReducers.jurisdictionsSetReducers(state, action);
		case notariesTypes.NOTARIES_DETAILS_SET:
			return notariesReducers.detailsSetReducers(state, action);

		default:
			return state;
	}
};

export default reducer;
