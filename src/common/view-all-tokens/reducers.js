import * as types from './types';

const initialState = {
	viewAll: false
};

const toggleViewAllReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.VIEW_ALL_TOKENS_TOOGLE:
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

export default toggleViewAllReducer;
