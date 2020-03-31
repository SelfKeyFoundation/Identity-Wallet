import React from 'react';
import { connect } from 'react-redux';
import { selectListingExchanges } from 'common/exchanges/selectors';
import { getWallet } from 'common/wallet/selectors';
import { Popup } from '../common';
import BuyKeyContent from './buy-key-popup-modal';

const BuyKeyPopupComponent = props => {
	return (
		<Popup closeAction={props.closeAction} text="Buy KEY from our partners.">
			<BuyKeyContent {...props} />
		</Popup>
	);
};

const mapStateToProps = state => {
	return {
		address: getWallet(state).address,
		exchanges: selectListingExchanges(state)
	};
};

export const BuyKeyPopup = connect(mapStateToProps)(BuyKeyPopupComponent);

export default BuyKeyPopup;
