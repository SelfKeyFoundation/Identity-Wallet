import * as actions from './actions';
import { getGlobalContext } from 'common/context';

const loadData = () => async dispatch => {
	const data = await getGlobalContext().incorporationsService.loadData();
	console.log(data);
	dispatch(actions.dataLoaded(data));
};

export default { ...actions, loadData };
