import React from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonpayAuthModal from './auth-modal';
import { useSelector, useDispatch } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';

export const MoonPayAuthContainer = withNavFlow(
	props => {
		const { onNext, onStepUpdate, ...otherProps } = props;

		const email = useSelector(moonPaySelectors.getLoginEmail);

		const previousAuthentication = useSelector(moonPaySelectors.hasAuthenticatedPreviously);
		const dispatch = useDispatch();

		const handleChooseDifferentEmail = async () => {
			onNext();
			dispatch(moonPayOperations.setLoginEmail(null));
		};

		const handleNext = async () => {
			onNext();
			dispatch(
				moonPayOperations.authOperation({
					email,
					completeUrl: '/main/moonpay/loading',
					cancelUrl: '/main/moonpay/loading'
				})
			);
		};

		return (
			<MoonpayAuthModal
				{...otherProps}
				email={email}
				onChooseEmail={!previousAuthentication ? handleChooseDifferentEmail : undefined}
				onNext={handleNext}
			/>
		);
	},
	{
		next: '/main/moonpay/loading'
	}
);

export default MoonPayAuthContainer;
