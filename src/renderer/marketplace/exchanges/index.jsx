import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { ExchangesListContainer } from './exchanges-list-container.jsx';
import { ExchangesDetailsContainer } from './exchanges-details-container.jsx';

class MarketplaceExchangesContainerComponent extends Component {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}

	render() {
		const { path } = this.props.match;

		return (
			<React.Fragment>
				<Route exact path={`${path}`} component={ExchangesListContainer} />

				<Route
					path={`${path}/details/:inventoryId`}
					component={ExchangesDetailsContainer}
				/>
			</React.Fragment>
		);
	}
}

const MarketplaceExchangesContainer = connect()(MarketplaceExchangesContainerComponent);
export { MarketplaceExchangesContainer };
