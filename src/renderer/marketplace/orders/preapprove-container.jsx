import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MarketplacePaymentPreapprove } from './preapprove';
import { ordersSelectors } from '../../../common/marketplaces/orders';

class MarketplacePaymentPreapproveContainer extends Component {
	handleBackClick = () => {
		console.log('XXX back click');
	};
	handlePayClick = () => {
		console.log('XXX pay click');
	};
	handleWhyLinkClick = () => {
		console.log('XXX why link click');
	};
	render() {
		return (
			<MarketplacePaymentPreapprove
				onBackClick={this.handleBackClick}
				onPayClick={this.handlePayClick}
				feeETH={this.props.feeETH}
				feeUSD={this.props.feeETH}
				onWhyLinkClick={this.handleWhyLinkClick}
			/>
		);
	}
}

const mapStateToPropes = (state, props) => ({
	feeUSD: ordersSelectors.getCurrentPaymentFeeUsd(state),
	feeETH: ordersSelectors.getCurrentPaymentFeeEth(state),
	currentOrder: ordersSelectors.getCurrentOrder(state)
});

const connectedComponent = connect(mapStateToPropes)(MarketplacePaymentPreapproveContainer);

export { connectedComponent as MarketplacePaymentPreapproveContainer };

export default connectedComponent;
