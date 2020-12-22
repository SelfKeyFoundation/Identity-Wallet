import { createAliasedSlice } from '../utils/duck';
// import { createSelector } from 'reselect';
import { validate } from 'parameter-validator';

export const SLICE_NAME = 'navigation_flow';

const initialState = {
	currentFlow: null,
	flows: []
};

// const selectSelf = state => state[SLICE_NAME];

const selectors = {};

export const createSlice = (state = initialState) => {
	return createAliasedSlice({
		name: SLICE_NAME,
		initialState: state,
		reducers: {
			completeFlow(state) {
				state.currentFlow = state.flows.pop() || null;
			},
			startFlow(state, action) {
				const payload = validate(action.payload, ['completeUrl', 'cancelUrl']);
				if (state.currentFlow) {
					state.flows.push(state.currentFlow);
				}
				state.currentFlow = payload;
			},
			setNext(state, { payload }) {}
		}
	});
};

const { reducer, operations } = createSlice();

export { operations as navigationOperations, selectors as navigationSelectors };

export default reducer;
