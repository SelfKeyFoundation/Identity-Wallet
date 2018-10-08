import * as actions from './actions';
import { getWallet } from './selectors';
import EthUnits from 'common/utils/eth-units';
import Web3Service from 'main/blockchain/web3-service';
const web3Service = new Web3Service();

const getWalletWithBalance = async wallet => {
	const balanceWei = await web3Service.waitForTicket({
		method: 'getBalance',
		args: [`0x${wallet.publicKey}`]
	});

	return {
		...wallet,
		balance: EthUnits.toEther(balanceWei, 'wei')
	};
};

const updateWalletWithBalance = wallet => async dispatch => {
	await dispatch(actions.updateWallet(await getWalletWithBalance(wallet)));
};

const refreshWalletBalance = () => async (dispatch, getState) => {
	await dispatch(actions.updateWallet(await getWalletWithBalance(getWallet(getState()))));
};

export default { ...actions, updateWalletWithBalance, refreshWalletBalance };
