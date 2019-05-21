import bankAccountsTypes from './types';

export const bankAccountsActions = {
	setLoadingAction(payload) {
		return {
			type: bankAccountsTypes.BANKACCOUNTS_LOADING_SET,
			payload
		};
	},
	setErrorAction(payload) {
		return {
			type: bankAccountsTypes.BANKACCOUNTS_ERROR_SET,
			payload
		};
	},
	setMainAction(payload) {
		return {
			type: bankAccountsTypes.BANKACCOUNTS_SET,
			payload
		};
	},
	setJurisdictionsAction(payload) {
		return {
			type: bankAccountsTypes.BANKACCOUNTS_JURISDICTIONS_SET,
			payload
		};
	},
	setDetauksAction(payload) {
		return {
			type: bankAccountsTypes.BANKACCOUNTS_DETAILS_SET,
			payload
		};
	}
};

export default bankAccountsActions;
