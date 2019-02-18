import { marketplacesTypes } from './types';

export const marketplacesActions = {
	setTransactionsAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_SET, payload };
	},
	setStakesAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_STAKES_SET, payload };
	},
	updateStakeAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_STAKES_UPDATE_ONE, payload };
	},
	addTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_ADD, payload };
	},
	updateTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_UPDATE_ONE, payload };
	},
	updateCurrentTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_UPDATE, payload };
	},
	setCurrentTransactionAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_SET, payload };
	},
	clearCurrentTransactionAction() {
		return { type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_CLEAR };
	},
	showMarketplacePopupAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_POPUP_SHOW, payload };
	},
	displayMarketplaceStateAction(payload) {
		return { type: marketplacesTypes.MARKETPLACE_STATE_SHOW, payload };
	}
};

export default marketplacesActions;
