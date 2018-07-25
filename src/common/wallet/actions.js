import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import EthUnits from 'common/utils/eth-units';
const Web3Service = require('../../main/controllers/web3-service').default();
const web3Service = new Web3Service();

const getWalletWithBalance = wallet => {
	return web3Service
		.waitForTicket({
			method: 'getBalance',
			args: [`0x${wallet.publicKey}`]
		})
		.then(balanceWei => {
			wallet.balance = EthUnits.toEther(balanceWei, 'wei');
			return wallet;
		});
};

const updateWallet = createAliasedAction(types.UPDATE_WALLET, wallet => ({
	type: types.UPDATE_WALLET,
	payload: getWalletWithBalance(wallet)
}));

export { updateWallet };
