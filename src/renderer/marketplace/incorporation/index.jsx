import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { featureIsEnabled } from 'common/feature-flags';
import { ordersOperations } from 'common/marketplace/orders';
import { marketplaceOperations } from 'common/marketplace';
import { IncorporationsListContainer } from './list/incorporations-list-container';
import { IncorporationsDetailsContainer } from './details/incorporations-details-container';
import { IncorporationsCheckoutContainer } from './checkout/incorporations-checkout-container';
import { IncorporationsPaymentContainer } from './checkout/incorporations-payment-container';
import { IncorporationsPaymentCompleteContainer } from './checkout/incorporations-payment-complete-container';

class MarketplaceIncorporationComponent extends Component {
	async componentDidMount() {
		if (featureIsEnabled('scheduler')) {
			await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
		} else {
			await this.props.dispatch(ordersOperations.ordersLoadOperation());
		}
	}
	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={IncorporationsListContainer} />
				<Route
					path={`${path}/details/:companyCode/:countryCode/:templateId?`}
					component={IncorporationsDetailsContainer}
				/>
				<Route
					path={`${path}/checkout/:companyCode/:countryCode/:templateId?`}
					component={IncorporationsCheckoutContainer}
				/>
				<Route
					path={`${path}/pay/:companyCode/:countryCode/:templateId?/:confirmation?`}
					component={IncorporationsPaymentContainer}
				/>
				<Route
					path={`${path}/payment-complete/:companyCode/:countryCode/:templateId?`}
					component={IncorporationsPaymentCompleteContainer}
				/>
			</div>
		);
	}
}

const MarketplaceIncorporationPage = connect()(MarketplaceIncorporationComponent);
export { MarketplaceIncorporationPage };
