import * as actions from './actions';
import EthGasStationService from 'main/blockchain/eth-gas-station-service';
import { transactionOperations } from 'common/transaction';
const ethGasStationService = new EthGasStationService();

const loadData = () => async (dispatch, getState) => {
	const data = await ethGasStationService.getInfo();
	await dispatch(actions.updateData(data));
	await dispatch(transactionOperations.setTransactionFee());
};

export default { ...actions, loadData };
