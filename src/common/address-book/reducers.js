import * as types from './types';

const initialState = {
	entries: [],
	labelError: '',
	addressError: ''
};

const addressBookReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.ADD_ADDRESS_BOOK_ENTRY:
			return {
				...state,
				entries: [...state.entries, action.payload]
			};
		case types.LOAD_ADDRESS_BOOK_ENTRIES:
			return {
				...state,
				entries: action.payload
			};
		case types.DELETE_ADDRESS_BOOK_ENTRY:
			return {
				...state,
				entries: state.entries.filter(entry => {
					return entry.id !== action.payload;
				})
			};
		case types.SET_ADDRESS_BOOK_LABEL_ERROR:
			return {
				...state,
				labelError: action.payload
			};
		case types.SET_ADDRESS_BOOK_ADDRESS_ERROR:
			return {
				...state,
				addressError: action.payload
			};
		default:
			return state;
	}
};

export default addressBookReducer;
