import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
export const initialState = {
	all: [],
	byId: {}
};

export const taxTreatiesTypes = {
	TAX_TREATIES_SET: 'marketplace/taxTreaties/actions/SET',
	TAX_TREATIES_LOAD_OPERATION: 'marketplace/taxTreaties/operations/LOAD'
};

export const taxTreatiesActions = {
	setTaxTreaties: taxTreaties => ({
		type: taxTreatiesTypes.TAX_TREATIES_SET,
		payload: taxTreaties
	})
};

const loadTaxTreatiesOperation = () => async (dispatch, getState) => {
	const ctx = getGlobalContext();
	const taxTreaties = await ctx.taxTreatiesService.loadTaxTreaties();
	await dispatch(taxTreatiesActions.setTaxTreaties(taxTreaties));
};

export const taxTreatiesOperations = {
	...taxTreatiesActions,
	loadTaxTreatiesOperation: createAliasedAction(
		taxTreatiesTypes.TAX_TREATIES_LOAD_OPERATION,
		loadTaxTreatiesOperation
	)
};

const setTaxTreatiesReducer = (state, action) => {
	const all = (action.payload || []).map(inv => inv.id);
	const byId = (action.payload || []).reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	return { ...state, all, byId };
};

export const taxTreatiesReducers = {
	setTaxTreatiesReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case taxTreatiesTypes.TAX_TREATIES_SET:
			return taxTreatiesReducers.setTaxTreatiesReducer(state, action);
	}
	return state;
};

export const taxTreatiesSelectors = {
	selectTaxTreatiesRoot: state => state.marketplace.taxTreaties,
	selectTaxTreaties: state =>
		taxTreatiesSelectors
			.selectTaxTreatiesRoot(state)
			.all.map(id => taxTreatiesSelectors.selectTaxTreatiesRoot(state).byId[id]),
	selectTaxTreatiesByCountryCode: (state, countryCode) =>
		taxTreatiesSelectors.selectTaxTreaties(state).filter(t => t.countryCode === countryCode)
};

export default reducer;
