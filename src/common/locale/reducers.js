import * as types from './types';

const initialState = {
	locale: 'en'
};

const localeReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.LOCALE_UPDATE:
			return {
				...state,
				locale: action.payload
			};
		default:
			return state;
	}
};

export default localeReducer;
