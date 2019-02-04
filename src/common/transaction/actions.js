import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import TxHistory from 'main/blockchain/tx-history';

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

const signTxWithTrezor = createAliasedAction(types.TREZOR_TX_SIGN, data => ({
	type: types.TREZOR_TX_SIGN,
	payload: data
}));

const createTxHistory = createAliasedAction(types.CREATE_TX_HISTORY, data => ({
	type: types.TREZOR_TX_SIGN,
	payload: TxHistory.addOrUpdate(data)
}));

export { updateTransaction, setAddressError, signTxWithTrezor, createTxHistory };
