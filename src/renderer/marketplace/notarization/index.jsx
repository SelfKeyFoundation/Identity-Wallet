import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { NotarizationOffersContainer } from './list/notarization-offers-container';
import { NotarizationDetailsContainer } from './details/notarization-details-container';
import { RequestNotarizationContainer } from './process/request-notarization-container';
import { NotarizationTOC } from './common/toc-container';
import { NotarizationTOCdisagreement } from './common/toc-disagreement-container';
import { NotarizationPaymentContainer } from './checkout/payment-container';
import { NotarizationPaymentCompleteContainer } from './checkout/payment-complete-container';
import { NotarizationMessageContainer } from './common/message-container';

class MarketplaceNotariesComponent extends PureComponent {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}

	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={NotarizationOffersContainer} />
				<Route
					path={`${path}/detail/:templateId/:vendorId/:productId`}
					component={NotarizationDetailsContainer}
				/>
				<Route
					path={`${path}/process/:templateId/:vendorId/:productId`}
					component={RequestNotarizationContainer}
				/>
				<Route
					path={`${path}/pay/:templateId/:vendorId/:productId/:documentList?`}
					component={NotarizationPaymentContainer}
				/>

				<Route
					path={`${path}/toc/:templateId/:vendorId/:productId`}
					component={NotarizationTOC}
				/>
				<Route path={`${path}/toc-disagreement`} component={NotarizationTOCdisagreement} />

				<Route
					path={`${path}/payment-complete/:templateId/:vendorId/:productId/:orderId?`}
					component={NotarizationPaymentCompleteContainer}
				/>
				<Route path={`${path}/messages`} component={NotarizationMessageContainer} />
			</div>
		);
	}
}
const MarketplaceNotariesPage = connect()(MarketplaceNotariesComponent);
export { MarketplaceNotariesPage };
