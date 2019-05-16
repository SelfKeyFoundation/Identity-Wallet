import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const updateWallet = createAliasedAction(types.WALLET_UPDATE, wallet => ({
	type: types.WALLET_UPDATE,
	payload: wallet
}));

const setAssociateError = error => ({
	type: types.WALLET_ASSOCIATE_DID_ERROR_SET,
	payload: error
});

export { updateWallet, setAssociateError };
