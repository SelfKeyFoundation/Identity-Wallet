import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MarketplacePaymentComplete } from './payment-complete';
import { ordersOperations } from '../../../common/marketplaces/orders';

class MarketplacePaymentCompleteContainer extends Component {
	handleBackClick = () => {
		this.props.dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	};
	handleContinueClick = () => {
		this.props.dispatch(ordersOperations.finishCurrentOrderOperation());
	};
	render() {
		return (
			<MarketplacePaymentComplete
				onBackClick={this.handleBackClick}
				onContinueClick={this.handleContinueClick}
				email={this.props.email}
			/>
		);
	}
}

const mapStateToPropes = (state, props) => ({
	email: 'support@flagtheory.com'
});

const connectedComponent = connect(mapStateToPropes)(MarketplacePaymentCompleteContainer);

export { connectedComponent as MarketplacePaymentCompleteContainer };

export default connectedComponent;
