import incorporationsTypes from './types';

export const incorporationsActions = {
	setLoadingAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_LOADING_SET,
			payload
		};
	},
	setErrorAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_ERROR_SET,
			payload
		};
	},
	setIncorporationsAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_SET,
			payload
		};
	},
	setCorporationsAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_CORPORATIONS_SET,
			payload
		};
	},
	setLLCsAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_LLCS_SET,
			payload
		};
	},
	setFoundationsAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_FOUNDATIONS_SET,
			payload
		};
	},
	setTaxesAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_TAXES_SET,
			payload
		};
	},
	setTranslationAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_TRANSLATION_SET,
			payload
		};
	},
	setTaxTreatiesAction(payload) {
		return {
			type: incorporationsTypes.INCORPORATIONS_TREATIES_SET,
			payload
		};
	}
};

export default incorporationsActions;
