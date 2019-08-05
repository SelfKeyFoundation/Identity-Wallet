import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import IncorporationsTable from './table';
import IncorporationsDetailView from './detail';
import {
	IncorporationCheckout,
	IncorporationProcessStarted,
	IncorporationPaymentConfirmation
} from './pay';

class MarketplaceIncorporationComponent extends Component {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}
	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={IncorporationsTable} />
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

const MarketplaceIncorporationPage = connect()(MarketplaceIncorporationComponent);
export { MarketplaceIncorporationPage };
