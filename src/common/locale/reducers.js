import { combineReducers } from 'redux';
import * as types from './types';

const initialState = {
	locale: 'en'
};

const localeReducer = (state = initialState, action) => {
	console.log('REDUCER', state, action);
	switch (action.type) {
		case types.LOCALE_UPDATE:
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
