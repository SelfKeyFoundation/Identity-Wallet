import React, { useEffect } from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { LoadingModal } from '../common/loading-modal';
import { useDispatch } from 'react-redux';
import { moonPayOperations } from '../../common/moonpay';

export const MoonPayLoadingContainer = withNavFlow(
	props => {
		const dispatch = useDispatch();
		useEffect(() => {
			setTimeout(() => {
				dispatch(moonPayOperations.connectFlowNextStepOperation());
			}, 2000);
		}, []);
		return <LoadingModal {...props} title="MoonPay Connect" />;
	},
	{ next: null }
);

export default MoonPayLoadingContainer;
