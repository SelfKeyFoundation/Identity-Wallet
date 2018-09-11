import * as actions from './actions';
import EthGasStationService from 'main/blockchain/eth-gas-station-service';
const ethGasStationService = new EthGasStationService();

const loadData = () => async (dispatch, getState) => {
	const data = await ethGasStationService.getInfo();
	await dispatch(actions.updateData(data));
};

export default { ...actions, loadData };
