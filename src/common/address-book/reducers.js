import * as types from './types';

const initialState = {
	entries: [],
	labelError: '',
	addressError: ''
};

const addressBookReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.ADRESS_BOOK_ENTRY_ADD:
			return {
				...state,
				entries: [...state.entries, action.payload]
			};
		case types.ADDRESS_BOOK_ENTRIES_LOAD:
			return {
				...state,
				entries: action.payload
			};
		case types.ADDRESS_BOOK_ENTRY_DELETE:
			return {
				...state,
				entries: state.entries.filter(entry => {
					return entry.id !== action.payload;
				})
			};
		case types.ADDRESS_BOOK_LABEL_ERROR_SET:
			return {
				...state,
				labelError: action.payload
			};
		case types.ADDRESS_BOOK_ADDRESS_ERROR_SET:
			return {
				...state,
				addressError: action.payload
			};
		default:
			return state;
	}
};

export default addressBookReducer;
