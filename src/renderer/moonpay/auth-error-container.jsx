import React from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { useSelector, useDispatch } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import { MoonpayAuthErrorModal } from './auth-error';

export const MoonPayAuthContainer = withNavFlow(props => {
	const { onNext, ...otherProps } = props;

	const error = useSelector(moonPaySelectors.getAuthError);

	const dispatch = useDispatch();

	const handleNext = async () => {
		onNext();
		dispatch(moonPayOperations.setAuthError(null));
	};

	return <MoonpayAuthErrorModal {...otherProps} error={error} onNext={handleNext} />;
});

export default MoonPayAuthContainer;
