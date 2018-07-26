import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import EthUtils from 'common/utils/eth-utils';
const Web3Service = require('../../main/controllers/web3-service').default();
const web3Service = new Web3Service();
const balanceHex = '0x70a08231';

const generateBalanceData = (contractAddress, walletPublicKey) => {
	const data = EthUtils.getDataObj(contractAddress, balanceHex, [walletPublicKey]);
	return data;
};

const getBalanceDecimal = (balanceHex, decimal) => {
	return EthUtils.getBalanceDecimal(EthUtils.hexToDecimal(balanceHex), decimal);
};

const getWalletTokensWithBalance = (walletTokens, walletPublicKey) => {
	const promises = walletTokens.map(walletToken => {
		return web3Service
			.waitForTicket({
				method: 'call',
				args: [generateBalanceData(walletToken.address, walletPublicKey)]
			})
			.then(balanceHex => {
				walletToken.balance = getBalanceDecimal(balanceHex, walletToken.decimal);
				walletToken.balanceInFiat = walletToken.balance * walletToken.priceUSD;
				return walletToken;
			});
	});

	return Promise.all(promises);
};

const updateWalletTokens = createAliasedAction(
	types.WALLET_TOKENS_UPDATE,
	(walletTokens, walletPublicKey) => ({
		type: types.WALLET_TOKENS_UPDATE,
		payload: getWalletTokensWithBalance(walletTokens, walletPublicKey)
	})
);

export { updateWalletTokens };
