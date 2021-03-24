import { useDispatch } from 'react-redux';
import { moonPayOperations } from '../../common/moonpay';

export const MoonPayPaymentContainer = () => {
	const dispatch = useDispatch();
	dispatch(
		moonPayOperations.paymentFlowOperation({
			complete: '/main/dashboard',
			cancel: '/main/dashboard'
		})
	);
	return null;
};

export default MoonPayPaymentContainer;
