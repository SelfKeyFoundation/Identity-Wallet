import { incorporationsActions } from './actions';
import { createAliasedAction } from 'electron-redux';
import { getGlobalContext } from 'common/context';
import { incorporationsTypes } from './types';

const loadIncorporationsOperation = () => async (dispatch, getState) => {
	await dispatch(incorporationsActions.setLoadingAction(true));
	await dispatch(incorporationsActions.setErrorAction(null));
	try {
		const data = await getGlobalContext().incorporationsService.loadIncorporations();
		await dispatch(incorporationsActions.setIncorporationsAction(data.incorporations));
		await dispatch(incorporationsActions.setCorporationsAction(data.corporations));
		await dispatch(incorporationsActions.setLLCsAction(data.llcs));
		await dispatch(incorporationsActions.setFoundationsAction(data.foundations));
		await dispatch(incorporationsActions.setTaxesAction(data.taxes));
		await dispatch(incorporationsActions.setTranslationAction(data.translation));
	} catch (error) {
		console.error(error);
		await dispatch(incorporationsActions.setErrorAction(true));
	} finally {
		dispatch(incorporationsActions.setLoadingAction(false));
	}
};

export const incorporationsOperations = {
	...incorporationsActions,
	loadIncorporationsOperation: createAliasedAction(
		incorporationsTypes.INCORPORATIONS_LOAD,
		loadIncorporationsOperation
	)
};

export default incorporationsOperations;
