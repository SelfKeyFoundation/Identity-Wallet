import React from 'react';
import { MoonpayAgreementModal } from './moonpay-agreement-modal';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { useDispatch } from 'react-redux';
import { moonPayOperations } from '../../common/moonpay';

const handleLinkClick = e => {
	window.openExternal(e, e.target.href || e.currentTarget.href);
};

const MoonpayAgreementContainer = withNavFlow(props => {
	const dispatch = useDispatch();
	const handleNext = async () => {
		await dispatch(moonPayOperations.agreeToTermsOperation());
		props.onNext();
	};

	return <MoonpayAgreementModal {...props} onNext={handleNext} onLinkClick={handleLinkClick} />;
});

export default MoonpayAgreementContainer;
