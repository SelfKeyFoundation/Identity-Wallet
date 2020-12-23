import React from 'react';
import { connect } from 'react-redux';
import { selectListingExchanges } from 'common/exchanges/selectors';
import { getWallet } from 'common/wallet/selectors';

import BuyKeyModal from './buy-key-popup-modal';
import { featureIsEnabled } from 'common/feature-flags';
import { PropTypes } from 'prop-types';
import { moonPayOperations } from '../../common/moonpay';

const handleLinkClick = e => {
	window.openExternal(e, e.target.href || e.currentTarget.href);
};

const BuyKeyPopupComponent = props => {
	const handleMoonpayClick = () => {
		props.dispatch(
			moonPayOperations.connectFlowOperation({
				cancel: '/main/dashboard',
				complete: '/main/dashboard'
			})
		);
	};
	return (
		<BuyKeyModal
			{...props}
			onMoonpayClick={featureIsEnabled('moonpay') && handleMoonpayClick}
			onCloseClick={props.closeAction}
			onLinkClick={handleLinkClick}
		/>
	);
};

const mapStateToProps = state => {
	return {
		address: getWallet(state).address,
		exchanges: selectListingExchanges(state)
	};
};

export const BuyKeyPopup = connect(mapStateToProps)(BuyKeyPopupComponent);

BuyKeyPopup.propTypes = {
	closeAction: PropTypes.func
};

export default BuyKeyPopup;
