import { createAliasedAction } from 'electron-redux';
import { getGlobalContext } from 'common/context';
import { bankAccountsActions } from './actions';
import { bankAccountsTypes } from './types';

const loadBankAccountsOperation = () => async (dispatch, getState) => {
	await dispatch(bankAccountsActions.setLoadingAction(true));
	await dispatch(bankAccountsActions.setErrorAction(null));
	try {
		const data = await getGlobalContext().bankAccountsService.loadBankAccounts();
		await dispatch(bankAccountsActions.setMainAction(data.main));
		await dispatch(bankAccountsActions.setJurisdictionsAction(data.jurisdictions));
		await dispatch(bankAccountsActions.setDetailsAction(data.details));
	} catch (error) {
		console.error(error);
		await dispatch(bankAccountsActions.setErrorAction(true));
	} finally {
		dispatch(bankAccountsActions.setLoadingAction(false));
	}
};

export const bankAccountsOperations = {
	...bankAccountsActions,
	loadBankAccountsOperation: createAliasedAction(
		bankAccountsTypes.BANKACCOUNTS_LOAD,
		loadBankAccountsOperation
	)
};

export default bankAccountsOperations;
