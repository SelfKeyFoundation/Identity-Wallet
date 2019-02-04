import incorporationsTypes from './types';

export const initialState = {
	loading: true,
	error: null,
	details: null,
	incorporations: [],
	incorporationsById: {},
	taxes: [],
	taxesById: {},
	llcs: [],
	llcsById: {},
	trusts: [],
	trustsById: {},
	guarantee: [],
	guaranteeById: {},
	corporations: [],
	corporationsById: {},
	foundations: [],
	foundationsById: {},
	translation: {}
};

export const incorporationsReducers = {
	loadingSetReducer(state, actions) {
		return { ...state, loading: actions.payload };
	},
	errorSetReducer(state, actions) {
		return { ...state, error: actions.payload };
	},
	incorporationsSetReducers(state, action) {
		const incorporations = action.payload.map(inc => inc.id);
		const incorporationsById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, incorporations, incorporationsById };
	},
	taxesSetReducers(state, action) {
		const taxes = action.payload.map(tax => tax.id);
		const taxesById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, taxes, taxesById };
	},
	llcsSetReducers(state, action) {
		const llcs = action.payload.map(llc => llc.id);
		const llcsById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, llcs, llcsById };
	},
	corporationsSetReducers(state, action) {
		const corporations = action.payload.map(corp => corp.id);
		const corporationsById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, corporations, corporationsById };
	},
	foundationsSetReducers(state, action) {
		const foundations = action.payload.map(fund => fund.id);
		const foundationsById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, foundations, foundationsById };
	},
	translationSetReducers(state, action) {
		const translation = action.payload.map(t => t.id);
		const translationById = action.payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		return { ...state, translation, translationById };
	},
	treatiesSetReducers(state, action) {
		// FIXME: find a clearer way to have a tax treaty property per-country
		const { countryCode, treaties: treatiesPayload } = action.payload;
		const treaties = treatiesPayload.map(t => t.id);
		const treatiesById = treatiesPayload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});
		const treatyHash = {};
		treatyHash[`treaties-${countryCode}`] = treaties;
		treatyHash[`treatiesById-${countryCode}`] = treatiesById;
		return { ...state, ...treatyHash };
	},
	countrySetReducers(state, action) {
		const { countryCode, country: countryPayload } = action.payload;
		const country = countryPayload.map(c => c.code);
		const countryById = countryPayload.reduce((acc, curr) => {
			acc[curr.code] = curr;
			return acc;
		}, {});
		const countryHash = {};
		countryHash[`country-${countryCode}`] = country;
		countryHash[`countryById-${countryCode}`] = countryById;
		return { ...state, ...countryHash };
	}
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case incorporationsTypes.INCORPORATIONS_LOADING_SET:
			return incorporationsReducers.loadingSetReducer(state, action);
		case incorporationsTypes.INCORPORATIONS_SET:
			return incorporationsReducers.incorporationsSetReducers(state, action);
		case incorporationsTypes.INCORPORATIONS_ERROR_SET:
			return incorporationsReducers.errorSetReducer(state, action);
		case incorporationsTypes.INCORPORATIONS_TAXES_SET:
			return incorporationsReducers.taxesSetReducers(state, action);
		case incorporationsTypes.INCORPORATIONS_LLCS_SET:
			return incorporationsReducers.llcsSetReducers(state, action);
		case incorporationsTypes.INCORPORATIONS_CORPORATIONS_SET:
			return incorporationsReducers.corporationsSetReducers(state, action);
		case incorporationsTypes.INCORPORATIONS_FOUNDATIONS_SET:
			return incorporationsReducers.foundationsSetReducers(state, action);
		case incorporationsTypes.INCORPORATIONS_TRANSLATION_SET:
			return incorporationsReducers.translationSetReducers(state, action);
		case incorporationsTypes.INCORPORATIONS_TREATIES_SET:
			return incorporationsReducers.treatiesSetReducers(state, action);
		case incorporationsTypes.INCORPORATIONS_COUNTRY_SET:
			return incorporationsReducers.countrySetReducers(state, action);

		default:
			return state;
	}
};

export default reducer;
