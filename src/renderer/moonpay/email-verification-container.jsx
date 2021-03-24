import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonPayEmailVerificationModal from './email-verification-modal';

export const MoonPayEmailVerificationContainer = withNavFlow(
	({ onNext, onCancel }) => {
		const [securityCode, setSecurityCode] = useState();
		const email = useSelector(moonPaySelectors.getLoginEmail);

		const dispatch = useDispatch();

		const handleNext = async () => {
			onNext();
			dispatch(
				moonPayOperations.authOperation({
					email,
					securityCode,
					completeUrl: '/main/moonpay/loading',
					cancelUrl: '/main/moonpay/loading'
				})
			);
		};

		const handleResendClick = () => {
			onNext();
			dispatch(
				moonPayOperations.authOperation({
					email,
					securityCode,
					completeUrl: '/main/moonpay/loading',
					cancelUrl: '/main/moonpay/loading'
				})
			);
		};

		const handleCodeChange = evt => {
			setSecurityCode(evt.target.value);
		};

		return (
			<MoonPayEmailVerificationModal
				email={email}
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

export default MoonPayEmailVerificationContainer;
