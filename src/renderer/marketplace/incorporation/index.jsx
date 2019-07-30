import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { IncorporationsListContainer } from './list/incorporations-list-container';
import IncorporationsDetailView from './detail';
import {
	IncorporationCheckout,
	IncorporationProcessStarted,
	IncorporationPaymentConfirmation
} from './pay';

class MarketplaceIncorporationComponent extends Component {
	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={IncorporationsListContainer} />
				<Route
					path={`${path}/details/:companyCode/:countryCode/:templateId?`}
					component={IncorporationsDetailView}
				/>
				<Route
					path={`${path}/pay/:companyCode/:countryCode/:templateId?`}
					component={IncorporationCheckout}
				/>
				<Route
					path={`${path}/pay-confirmation/:companyCode/:countryCode/:templateId?/:confirmation?`}
					component={IncorporationPaymentConfirmation}
				/>
				<Route
					path={`${path}/process-started/:companyCode/:countryCode/:templateId?`}
					component={IncorporationProcessStarted}
				/>
			</div>
		);
	}
}

const MarketplaceIncorporationPage = MarketplaceIncorporationComponent;
export { MarketplaceIncorporationPage };
