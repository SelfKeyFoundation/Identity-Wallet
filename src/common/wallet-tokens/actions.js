import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const updateWalletTokens = createAliasedAction(types.WALLET_TOKENS_UPDATE, walletTokens => ({
	type: types.WALLET_TOKENS_UPDATE,
	payload: walletTokens
}));

const setWalletTokens = payload => ({
	type: types.WALLET_TOKENS_SET,
	payload
});

export { updateWalletTokens, setWalletTokens };
