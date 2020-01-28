import { createAliasedAction } from 'electron-redux';
import { getGlobalContext } from 'common/context';
import { notariesActions } from './actions';
import { notariesTypes } from './types';

const loadNotariesOperation = () => async (dispatch, getState) => {
	await dispatch(notariesActions.setLoadingAction(true));
	await dispatch(notariesActions.setErrorAction(null));
	try {
		const data = await getGlobalContext().notariesService.loadNotaries();
		await dispatch(notariesActions.setMainAction(data.main));
		await dispatch(notariesActions.setJurisdictionsAction(data.jurisdictions));
		await dispatch(notariesActions.setDetailsAction(data.details));
	} catch (error) {
		console.error(error);
		await dispatch(notariesActions.setErrorAction(true));
	} finally {
		dispatch(notariesActions.setLoadingAction(false));
	}
};

export const notariesOperations = {
	...notariesActions,
	loadNotariesOperation: createAliasedAction(notariesTypes.NOTARIES_LOAD, loadNotariesOperation)
};

export default notariesOperations;
