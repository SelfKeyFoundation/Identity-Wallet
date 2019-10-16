import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { NotariesTableContainer } from './details/container';

class MarketplaceNotariesComponent extends Component {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}

	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={NotariesTableContainer} />
			</div>
		);
	}
}

const MarketplaceNotariesPage = connect()(MarketplaceNotariesComponent);
export { MarketplaceNotariesPage };
