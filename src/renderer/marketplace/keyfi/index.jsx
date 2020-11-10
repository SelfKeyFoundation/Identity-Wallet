import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { MarketplaceKeyFiContainer } from './keyfi-container.jsx';
import { MarketplaceKeyFiDetailsContainer } from './details/keyfi-details-container.jsx';
import { MarketplaceKeyFiCheckoutContainer } from './checkout/keyfi-checkout-container.jsx';
import { MarketplaceKeyFiPaymentCompleteContainer } from './checkout/keyfi-payment-complete-container.jsx';
import { MarketplaceKeyFiPayContainer } from './checkout/keyfi-pay-container';

class MarketplaceKeyFiComponent extends PureComponent {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}

	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={MarketplaceKeyFiContainer} />
				<Route
					path={`${path}/detail/:templateId/:vendorId/:productId`}
					component={MarketplaceKeyFiDetailsContainer}
				/>
				<Route
					path={`${path}/checkout/:templateId/:vendorId/:productId`}
					component={MarketplaceKeyFiCheckoutContainer}
				/>
				<Route
					path={`${path}/pay/:templateId/:vendorId/:productId/:cryptoCurrency/:orderId?`}
					component={MarketplaceKeyFiPayContainer}
				/>
				<Route
					path={`${path}/payment-complete/:templateId/:vendorId/:productId/:orderId?`}
					component={MarketplaceKeyFiPaymentCompleteContainer}
				/>
			</div>
		);
	}
}
const MarketplaceKeyFi = connect()(MarketplaceKeyFiComponent);
export { MarketplaceKeyFi };
