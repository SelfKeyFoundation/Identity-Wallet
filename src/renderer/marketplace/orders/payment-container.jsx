import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { MarketplacePayment } from './payment';
import { ordersSelectors, ordersOperations } from '../../../common/marketplace/orders';
import { identitySelectors } from '../../../common/identity';
import { featureIsEnabled } from 'common/feature-flags';
import config from 'common/config';

const LEARN_HOW_URL = 'https://help.selfkey.org';

class MarketplacePaymentContainer extends PureComponent {
	handleBackClick = () => {
		this.props.dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	};
	handlePayClick = () => {
		if (featureIsEnabled('paymentContract'))
			this.props.dispatch(ordersOperations.payCurrentOrderOperation());
		else {
			const { trezorAccountIndex } = this.props;

			this.props.dispatch(
				ordersOperations.directPayCurrentOrderOperation({ trezorAccountIndex })
			);
		}
	};
	handleLearnHowClick = e => {
		window.openExternal(e, LEARN_HOW_URL);
	};
	render() {
		const cryptoCurrency = this.props.order.cryptoCurrency
			? this.props.order.cryptoCurrency
			: config.constants.primaryToken;
		return (
			<MarketplacePayment
				onBackClick={this.handleBackClick}
				onPayClick={this.handlePayClick}
				priceUSD={this.props.priceUSD}
				priceCrypto={this.props.order.amount}
				feeETH={this.props.feeETH}
				feeUSD={this.props.feeUSD}
				did={this.props.identity.did}
				vendorName={this.props.order.vendorName}
				onLearnHowClick={this.handleLearnHowClick}
				cryptoCurrency={cryptoCurrency}
			/>
		);
	}
}

const mapStateToProps = (state, props) => ({
	order: ordersSelectors.getOrder(state, props.match.params.orderId),
	priceUSD: ordersSelectors.getOrderPriceUsd(state, props.match.params.orderId),
	feeUSD: ordersSelectors.getCurrentPaymentFeeUsd(state),
	feeETH: ordersSelectors.getCurrentPaymentFeeEth(state),
	identity: identitySelectors.selectIdentity(state),
	currentOrder: ordersSelectors.getCurrentOrder(state)
});

const connectedComponent = connect(mapStateToProps)(MarketplacePaymentContainer);

export { connectedComponent as MarketplacePaymentContainer };

export default connectedComponent;
