import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { MarketplaceKeyFiContainer } from './keyfi-container.jsx';
import { MarketplaceKeyFiDetailsContainer } from './details/keyfi-details-container.jsx';

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
			</div>
		);
	}
}
const MarketplaceKeyFi = connect()(MarketplaceKeyFiComponent);
export { MarketplaceKeyFi };
