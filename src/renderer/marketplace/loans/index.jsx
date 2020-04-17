import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { LoansListContainer } from './list/list-container';

class MarketplaceLoansComponent extends PureComponent {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}
	render() {
		const { path } = this.props.match;
		return (
			<React.Fragment>
				<Route exact path={`${path}`} component={LoansListContainer} />
			</React.Fragment>
		);
	}
}

const MarketplaceLoansPage = connect()(MarketplaceLoansComponent);
export { MarketplaceLoansPage };
