import notariesTypes from './types';

export const notariesActions = {
	setLoadingAction(payload) {
		return {
			type: notariesTypes.NOTARIES_LOADING_SET,
			payload
		};
	},
	setErrorAction(payload) {
		return {
			type: notariesTypes.NOTARIES_ERROR_SET,
			payload
		};
	},
	setMainAction(payload) {
		return {
			type: notariesTypes.NOTARIES_SET,
			payload
		};
	},
	setJurisdictionsAction(payload) {
		return {
			type: notariesTypes.NOTARIES_JURISDICTIONS_SET,
			payload
		};
	},
	setDetailsAction(payload) {
		return {
			type: notariesTypes.NOTARIES_DETAILS_SET,
			payload
		};
	}
};

export default notariesActions;
