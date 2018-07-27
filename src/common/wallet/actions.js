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
			return {
				...wallet,
				balance: EthUnits.toEther(balanceWei, 'wei')
			};
		});
};

const updateWallet = createAliasedAction(types.WALLET_UPDATE, wallet => ({
	type: types.WALLET_UPDATE,
	payload: getWalletWithBalance(wallet)
}));

export { updateWallet };
