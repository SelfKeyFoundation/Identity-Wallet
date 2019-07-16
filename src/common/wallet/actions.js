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

const setDidOriginUrl = didOriginUrl => ({
	type: types.WALLET_DID_ORIGIN_URL_SET,
	payload: didOriginUrl
});

export { updateWallet, setAssociateError, setDidOriginUrl };
