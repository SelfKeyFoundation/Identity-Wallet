import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { LoadingModal } from '../common/loading-modal';
import { useDispatch } from 'react-redux';
import { moonPayFlows } from '../../common/moonpay';

export const MoonPayLoadingContainer = withNavFlow(
	props => {
		const dispatch = useDispatch();
		const { flow } = useParams();
		useEffect(() => {
			setTimeout(() => {
				dispatch(moonPayFlows(flow)());
			}, 2000);
		}, []);
		return <LoadingModal {...props} title="MoonPay Connect" />;
	},
	{ next: null }
);

export default MoonPayLoadingContainer;
