import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ordersSelectors } from 'common/marketplace/orders';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplacePaymentComplete } from './payment-complete';
import { ordersOperations } from '../../../common/marketplace/orders';

class MarketplacePaymentCompleteContainer extends PureComponent {
	handleBackClick = () => {
		this.props.dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	};
	handleContinueClick = () => {
		this.props.dispatch(ordersOperations.finishCurrentOrderOperation());
	};
	render() {
		const { vendor } = this.props;
		console.log(vendor);
		return (
			<MarketplacePaymentComplete
				onBackClick={this.handleBackClick}
				onContinueClick={this.handleContinueClick}
				email={vendor.contactEmail}
			/>
		);
	}
}

const mapStateToPropes = (state, props) => {
	const { orderId } = props.match.params;
	const order = ordersSelectors.getOrder(state, orderId);
	return {
		orderId,
		order,
		vendorId: order.vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, order.vendorId)
	};
};

const connectedComponent = connect(mapStateToPropes)(MarketplacePaymentCompleteContainer);

export { connectedComponent as MarketplacePaymentCompleteContainer };

export default connectedComponent;
