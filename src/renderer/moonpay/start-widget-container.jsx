import React, { useEffect } from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { LoadingModal } from '../common/loading-modal';
import { useDispatch } from 'react-redux';
import { moonPayOperations } from '../../common/moonpay';

export const MoonPayStartWidgetContainer = withNavFlow(
	props => {
		const dispatch = useDispatch();
		useEffect(() => {
			setTimeout(() => {
				props.onNext();
				// dispatch(moonPayOperations.loadTransaction('747a0084-ca7c-4e1c-ba87-c2b81cf2bb6e'));
				dispatch(moonPayOperations.openWidget());
			}, 500);
		}, []);
		return <LoadingModal {...props} title="MoonPay Connect" />;
	},
	{ next: '/main/moonpay/payment/check' }
);

export default MoonPayStartWidgetContainer;
