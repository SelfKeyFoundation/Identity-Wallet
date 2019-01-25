import * as actions from './actions';
import { getWallet } from './selectors';
import EthUnits from 'common/utils/eth-units';
import { getGlobalContext } from 'common/context';

const getWalletWithBalance = async wallet => {
	const walletService = getGlobalContext().walletService;
	const balanceWei = await walletService.getBalance(wallet.id);

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
