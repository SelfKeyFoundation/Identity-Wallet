import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { NotarizationDetailsContainer } from './details/notarization-details-container';
import { RequestNotarizationContainer } from './process/request-notarization-container';
import { NotarizationTOC } from './common/toc-container';
import { NotarizationTOCdisagreement } from './common/toc-disagreement-container';

class MarketplaceNotariesComponent extends PureComponent {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}

	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={NotarizationDetailsContainer} />
				<Route path={`${path}/process`} component={RequestNotarizationContainer} />
				<Route path={`${path}/toc`} component={NotarizationTOC} />
				<Route path={`${path}/tocDisagreement`} component={NotarizationTOCdisagreement} />
			</div>
		);
	}
}

const MarketplaceNotariesPage = connect()(MarketplaceNotariesComponent);
export { MarketplaceNotariesPage };
