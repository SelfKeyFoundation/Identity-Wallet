import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const updateWallet = createAliasedAction(types.WALLET_UPDATE, wallet => ({
	type: types.WALLET_UPDATE,
	payload: wallet
}));

export { updateWallet };
