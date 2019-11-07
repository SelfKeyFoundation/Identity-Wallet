import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { MarketplacePaymentPreapprove } from './preapprove';
import { ordersSelectors, ordersOperations } from '../../../common/marketplace/orders';

class MarketplacePaymentPreapproveContainer extends PureComponent {
	handleBackClick = () => {
		this.props.dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	};
	handlePayClick = () => {
		this.props.dispatch(ordersOperations.preapproveCurrentOrderOperation());
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
				feeUSD={this.props.feeUSD}
				onWhyLinkClick={this.handleWhyLinkClick}
			/>
		);
	}
}

const mapStateToPropes = (state, props) => ({
	feeUSD: ordersSelectors.getCurrentAllowanceFeeUsd(state),
	feeETH: ordersSelectors.getCurrentAllowanceFeeEth(state),
	currentOrder: ordersSelectors.getCurrentOrder(state)
});

const connectedComponent = connect(mapStateToPropes)(MarketplacePaymentPreapproveContainer);

export { connectedComponent as MarketplacePaymentPreapproveContainer };

export default connectedComponent;
