import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import IncorporationsTable from './table';
import IncorporationsDetailView from './detail';

class MarketplaceIncorporationComponent extends Component {
	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={IncorporationsTable} />
				<Route
					path={`${path}/details/:companyCode/:countryCode`}
					component={IncorporationsDetailView}
				/>
			</div>
		);
	}
}

const MarketplaceIncorporationPage = MarketplaceIncorporationComponent;
export { MarketplaceIncorporationPage };
