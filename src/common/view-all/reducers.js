import * as types from './types';

const initialState = {
	viewAll: false
};

const toggleViewAllReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.TOGGLE_VIEW_ALL:
			const payload = !action.payload;
			console.log('toggleViewAllReducer', action, payload);
			return {
				...state,
				viewAll: payload
			};
		default:
			return state;
	}
};

const reducer = toggleViewAllReducer;

export default reducer;
