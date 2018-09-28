import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const updateWalletTokens = createAliasedAction(types.WALLET_TOKENS_UPDATE, walletTokens => ({
	type: types.WALLET_TOKENS_UPDATE,
	payload: walletTokens
}));

export { updateWalletTokens };
