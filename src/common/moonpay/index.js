import moonPayAuth, { operations as authOperations, selectors as authSelectors } from './auth';
import moonPayPayment, {
	operations as paymentOperations,
	selectors as paymentSelectors
} from './payment';

const moonPayOperations = { ...authOperations, ...paymentOperations };
const moonPaySelectors = { ...authSelectors, ...paymentSelectors };

const flows = {
	default: moonPayOperations.connectFlowNextStepOperation,
	'connect-flow': moonPayOperations.connectFlowNextStepOperation,
	'payment-flow': moonPayOperations.paymentFlowNextStepOperation
};

const moonPayFlows = flow => {
	if (!flow) {
		return flows['default'];
	} else {
		return flows[flow];
	}
};

export { moonPayAuth, moonPayPayment, moonPayOperations, moonPaySelectors, moonPayFlows };
