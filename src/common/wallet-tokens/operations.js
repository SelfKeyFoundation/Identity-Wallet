import * as actions from './actions';
import { getTokens } from './selectors';
import { getWallet } from 'common/wallet/selectors';
import EthUtils from '../utils/eth-utils';
import Web3Service from 'main/blockchain/web3-service';
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
				return {
					...walletToken,
					balance: getBalanceDecimal(balanceHex, walletToken.decimal),
					balanceInFiat: walletToken.balance * walletToken.priceUSD
				};
			});
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
			getWalletTokensWithBalance(getTokens(state), getWallet(state).publicKey)
		)
	);
};

export default { ...actions, updateWalletTokensWithBalance, refreshWalletTokensBalance };
