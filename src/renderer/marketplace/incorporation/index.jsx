import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { IncorporationTableContainer } from './list/offers-container';
import IncorporationsDetailsContainer from './details/details-container';
import IncorporationCheckoutContainer from './checkout/checkout-container';
import IncorporationProcessStartedContainer from './process-started/process-started-container';
import IncorporationPaymentConfirmation from './checkout/payment-confirmation';

class MarketplaceIncorporationComponent extends Component {
	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={IncorporationTableContainer} />
				<Route
					path={`${path}/details/:companyCode/:countryCode/:templateId?`}
					component={IncorporationsDetailsContainer}
				/>
				<Route
					path={`${path}/pay/:companyCode/:countryCode/:templateId?`}
					component={IncorporationCheckoutContainer}
				/>
				<Route
					path={`${path}/pay-confirmation/:companyCode/:countryCode/:templateId?/:confirmation?`}
					component={IncorporationPaymentConfirmation}
				/>
				<Route
					path={`${path}/process-started/:companyCode/:countryCode/:templateId?`}
					component={IncorporationProcessStartedContainer}
				/>
			</div>
		);
	}
}

const MarketplaceIncorporationPage = MarketplaceIncorporationComponent;
export { MarketplaceIncorporationPage };
