import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonPayPhoneVerificationModal from './phone-verification-modal';

export const MoonPayPhoneVerificationContainer = withNavFlow(
	({ onNext, onCancel }) => {
		const [securityCode, setSecurityCode] = useState();
		const customer = useSelector(moonPaySelectors.getCustomer);

		const dispatch = useDispatch();

		const handleNext = async () => {
			onNext();
			dispatch(
				moonPayOperations.verifyPhoneOperation({
					phone: customer.phoneNumber,
					securityCode
				})
			);
		};

		const handleResendClick = () => {
			onNext();
			dispatch(
				moonPayOperations.resendSMSOperation({
					phone: customer.phoneNumber
				})
			);
		};

		const handleCodeChange = evt => {
			setSecurityCode(evt.target.value);
		};

		return (
			<MoonPayPhoneVerificationModal
				phone={customer.phoneNumber}
				code={securityCode}
				onCodeChange={handleCodeChange}
				onCloseClick={onCancel}
				onResendClick={handleResendClick}
				onContinueClick={handleNext}
			/>
		);
	},
	{ next: '/main/moonpay/loading' }
);

export default MoonPayPhoneVerificationContainer;
