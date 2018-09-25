import * as types from './types';

const updateTransaction = transaction => ({
	type: types.TRANSACTION_UPDATE,
	payload: transaction
});

const setAddressError = error => {
	return {
		type: types.ADDRESS_ERROR_UPDATE,
		payload: error
	};
};

export { updateTransaction, setAddressError };
