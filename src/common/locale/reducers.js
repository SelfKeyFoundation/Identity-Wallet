import { combineReducers } from 'redux';
import * as types from './types';

const initialState = {
	locale: 'en'
};

const localeReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.UPDATE_LOCALE:
			return {
				...state,
				...initialState,
				locale: action.locale
			};
		default:
			return state;
	}
};

const reducer = localeReducer;

export default reducer;
