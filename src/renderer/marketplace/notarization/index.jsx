import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { NotarizationDetailsContainer } from './details/notarization-details-container';
import { RequestNotarization } from './process/request-notarization';

class MarketplaceNotariesComponent extends Component {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}

	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={NotarizationDetailsContainer} />
				<Route path={`${path}/process`} component={RequestNotarization} />
			</div>
		);
	}
}

const MarketplaceNotariesPage = connect()(MarketplaceNotariesComponent);
export { MarketplaceNotariesPage };
