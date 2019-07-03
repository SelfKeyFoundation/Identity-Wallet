import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MarketplacePayment } from './payment';
import { ordersSelectors, ordersOperations } from '../../../common/marketplaces/orders';
import { walletSelectors } from '../../../common/wallet';

class MarketplacePaymentContainer extends Component {
	handleBackClick = () => {
		this.props.dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	};
	handlePayClick = () => {
		this.props.dispatch(ordersOperations.payCurrentOrderOperation());
	};
	handleLearnHowClick = () => {
		console.log('XXX learn how click');
	};
	render() {
		return (
			<MarketplacePayment
				onBackClick={this.handleBackClick}
				onPayClick={this.handlePayClick}
				priceUsd={this.props.priceUsd}
				priceKey={this.props.order.amount}
				feeETH={this.props.feeETH}
				feeUSD={this.props.feeUSD}
				did={this.props.wallet.did}
				vendorName={this.props.order.vendorName}
				onLearnHowClick={this.handleLearnHowClick}
			/>
		);
	}
}

const mapStateToPropes = (state, props) => ({
	order: ordersSelectors.getOrder(state, props.match.params.orderId),
	priceUsd: ordersSelectors.getOrderPriceUsd(state, props.match.params.orderId),
	feeUSD: ordersSelectors.getCurrentPaymentFeeUsd(state),
	feeETH: ordersSelectors.getCurrentPaymentFeeEth(state),
	wallet: walletSelectors.getWallet(state),
	currentOrder: ordersSelectors.getCurrentOrder(state)
});

const connectedComponent = connect(mapStateToPropes)(MarketplacePaymentContainer);

export { connectedComponent as MarketplacePaymentContainer };

export default connectedComponent;
