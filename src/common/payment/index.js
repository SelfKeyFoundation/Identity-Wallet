import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';
import config from '../config';
import { Logger } from 'common/logger';

const log = new Logger('payment-redux');

export const initialState = {};

export const paymentTypes = {
	PAYMENT_PROCESS: 'payment/PROCESS',
	APPROVAL_PROCESS: 'payment/APPROVAL'
};

const paymentActions = {};

const processApproval = amount => async (dispatch, getState) => {
	const selfkeyService = getGlobalContext().selfkeyService;
	const wallet = walletSelectors.getWallet(getState());
	try {
		await selfkeyService.approve(wallet.publicKey, config.paymentSplitterAddress, amount);
	} catch (error) {
		log.error(error);
	}
};

const processPayment = () => async (dispatch, getState) => {};

const operations = {
	processApproval,
	processPayment
};

const paymentOperations = {
	...paymentActions,
	processPaymentOperation: createAliasedAction(
		paymentTypes.PAYMENT_PROCESS,
		operations.processPayment
	),
	processApprovalOperation: createAliasedAction(
		paymentTypes.APPROVAL_PROCESS,
		operations.processPayment
	)
};

const paymentReducers = {};

const reducer = (state = initialState, action) => {
	return state;
};

const paymentSelectors = {};

export { paymentSelectors, paymentReducers, paymentActions, paymentOperations };

export default reducer;
