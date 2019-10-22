import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
export const initialState = {
	all: [],
	byId: {}
};

export const countriesTypes = {
	COUNTRIES_SET: 'marketplace/countries/actions/SET',
	COUNTRIES_LOAD_OPERATION: 'marketplace/countries/operations/LOAD'
};

export const countriesActions = {
	setCountries: countries => ({
		type: countriesTypes.COUNTRIES_SET,
		payload: countries
	})
};

const loadCountriesOperation = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const countries = await ctx.marketplaceCountryService.loadCountries();
	await dispatch(countriesActions.setCountries(countries));
};

export const countriesOperations = {
	...countriesActions,
	loadCountriesOperation: createAliasedAction(
		countriesTypes.COUNTRIES_LOAD_OPERATION,
		loadCountriesOperation
	)
};

const setCountriesReducer = (state, action) => {
	const all = (action.payload || []).map(inv => inv.id);
	const byId = (action.payload || []).reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	return { ...state, all, byId };
};

export const countriesReducers = {
	setCountriesReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case countriesTypes.COUNTRIES_SET:
			return countriesReducers.setCountriesReducer(state, action);
	}
	return state;
};

export const countriesSelectors = {
	selectCountriesRoot: state => state.marketplace.countries,
	selectCountries: state =>
		countriesSelectors
			.selectCountriesRoot(state)
			.all.map(id => countriesSelectors.selectCountriesRoot(state).byId[id]),
	selectCountryByCode: (state, countryCode) =>
		countriesSelectors.selectCountries(state).find(c => c.code === countryCode.trim())
};

export default reducer;
