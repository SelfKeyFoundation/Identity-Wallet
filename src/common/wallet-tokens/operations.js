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
		await dispatch(updateWalletTokensWithBalance(tokens, wallet.address));
	}
);

const getWalletTokensWithBalance = (walletTokens, walletPublicKey) => {
	const promises = walletTokens.map(async walletToken => {
		const walletTokenService = getGlobalContext().walletTokenService;
		let balance = 0;
		try {
			balance = await walletTokenService.getTokenBalance(
				walletToken.address,
				walletPublicKey
			);
		} catch (error) {
			console.error(error);
		}

		return {
			...walletToken,
			balance,
			balanceInFiat: balance * walletToken.priceUSD
		};
	});

	return Promise.all(promises);
};

const updateWalletTokensWithBalance = (walletTokens, walletPublicKey) => async dispatch => {
	const tokens = await getWalletTokensWithBalance(walletTokens, walletPublicKey);
	await dispatch(actions.setWalletTokens(tokens));
};

const refreshWalletTokensBalance = () => async (dispatch, getState) => {
	const state = getState();
	await dispatch(
		actions.setWalletTokens(
			await getWalletTokensWithBalance(getTokens(state), getWallet(state).address)
		)
	);
};

const createWalletTokenOperation = createAliasedAction(
	types.WALLET_TOKENS_CREATE,
	tokenId => async (dispatch, getState) => {
		const wallet = getWallet(getState());
		await getGlobalContext().walletTokenService.createWalletToken(tokenId, wallet.id);
		await dispatch(loadWalletTokens());
	}
);

const updateWalletTokenStateOperation = createAliasedAction(
	types.WALLET_TOKENS_STATE_EDIT,
	(state, wTokenId) => async (dispatch, getState) => {
		await getGlobalContext().walletTokenService.updateState(wTokenId, state);
		await dispatch(loadWalletTokens());
	}
);

export default {
	...actions,
	updateWalletTokensWithBalance,
	refreshWalletTokensBalance,
	loadWalletTokens,
	createWalletTokenOperation,
	updateWalletTokenStateOperation
};
