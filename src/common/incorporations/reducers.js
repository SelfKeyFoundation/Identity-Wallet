import * as types from './types';

const incorporationsReducer = (state = {}, action) => {
	// console.log('reducer', action.type);
	switch (action.type) {
		case types.INCORPORATIONS_DATA_LOADED:
			return {
				...state,
				data: action.payload
			};
		case types.INCORPORATIONS_OPEN_DETAILS:
			return {
				...state,
				data: action.payload
			};
		default:
			return state;
	}
};

export default incorporationsReducer;
