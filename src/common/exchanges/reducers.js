import * as types from './types';

const initialState = {
	list: []
};

const exchangesReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.EXCHANGES_UPDATE:
			console.log('Exchanges', action);
			return {
				...state,
				list: action.payload
			};
		default:
			return state;
	}
};

export default exchangesReducer;
