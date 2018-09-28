import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import TrezorService from 'main/blockchain/trezor-service';

let Service = TrezorService();
let trezorService = new Service();

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

const signTransaction = data => {
	return trezorService.signTransaction(data).then(res => {
		return res.raw;
	});
};

const signTxWithTrezor = createAliasedAction(types.TREZOR_TX_SIGN, data => ({
	type: types.TREZOR_TX_SIGN,
	payload: signTransaction(data)
}));

export { updateTransaction, setAddressError, signTxWithTrezor };
