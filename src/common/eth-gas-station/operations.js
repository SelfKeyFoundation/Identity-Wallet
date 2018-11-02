import * as actions from './actions';
import { getGlobalContext } from 'common/context';
import { transactionOperations } from 'common/transaction';

const loadData = () => async (dispatch, getState) => {
	const data = await getGlobalContext().ethGasStationService.getInfo();
	await dispatch(actions.updateData(data));
	await dispatch(transactionOperations.setTransactionFee());
};

export default { ...actions, loadData };
