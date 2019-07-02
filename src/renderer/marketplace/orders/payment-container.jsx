import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MarketplacePayment } from './payment';

class MarketplacePaymentContainer extends Component {
	render() {
		return <MarketplacePayment />;
	}
}

const mapStateToPropes = state => ({});

const connectedComponent = connect(mapStateToPropes)(MarketplacePaymentContainer);

export { connectedComponent as MarketplacePaymentContainer };

export default connectedComponent;
