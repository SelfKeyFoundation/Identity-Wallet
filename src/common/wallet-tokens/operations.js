import * as actions from './actions';
import { getTokens } from './selectors';
import { getWallet } from 'common/wallet/selectors';
import { getGlobalContext } from 'common/context';
import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const loadWalletTokens = createAliasedAction(
	types.WALLET_TOKENS_LOAD,
	() => async (dispatch, getState) => {
		const walletTokenService = getGlobalContext().walletTokenService;
		const wallet = getWallet(getState());
		const tokens = await walletTokenService.getWalletTokens(wallet.id);
		await dispatch(updateWalletTokensWithBalance(tokens, wallet.publicKey));
	}
);

const getWalletTokensWithBalance = (walletTokens, walletPublicKey) => {
	const promises = walletTokens.map(async walletToken => {
		const walletTokenService = getGlobalContext().walletTokenService;
		const balance = await walletTokenService.getTokenBalance(
			walletToken.address,
			walletPublicKey
		);

		return {
			...walletToken,
			balance,
			balanceInFiat: balance * walletToken.priceUSD
		};
	});

	return Promise.all(promises);
};

const updateWalletTokensWithBalance = (walletTokens, walletPublicKey) => async dispatch => {
	await dispatch(
		actions.updateWalletTokens(getWalletTokensWithBalance(walletTokens, walletPublicKey))
	);
};

const refreshWalletTokensBalance = () => async (dispatch, getState) => {
	const state = getState();
	await dispatch(
		actions.updateWalletTokens(
			await getWalletTokensWithBalance(getTokens(state), getWallet(state).publicKey)
		)
	);
};

export default {
	...actions,
	updateWalletTokensWithBalance,
	refreshWalletTokensBalance,
	loadWalletTokens
};
