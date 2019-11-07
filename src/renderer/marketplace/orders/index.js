import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';

import { PageLoading } from '../common/page-loading';
import { MarketplacePaymentContainer } from './payment-container';
import { MarketplacePaymentPreapproveContainer } from './preapprove-container';
import { MarketplacePaymentCompleteContainer } from './payment-complete-container';
import { MarketplaceOrderTxInProgressContainer } from './tx-in-progress-container';
import { MarketplaceOrderTxErrorContainer } from './tx-error-container';

class MarketplaceOrdersPage extends PureComponent {
	render() {
		const { path } = this.props.match;
		return (
			<div>
				<Route path={`${path}/loading`} component={PageLoading} />
				<Route
					exact
					path={`${path}/:orderId/payment`}
					component={MarketplacePaymentContainer}
				/>
				<Route
					path={`${path}/:orderId/payment/in-progress`}
					component={MarketplaceOrderTxInProgressContainer}
				/>
				<Route
					path={`${path}/:orderId/payment/complete`}
					component={MarketplacePaymentCompleteContainer}
				/>
				<Route
					path={`${path}/:orderId/payment/error`}
					component={MarketplaceOrderTxErrorContainer}
				/>
				<Route
					exact
					path={`${path}/:orderId/allowance`}
					component={MarketplacePaymentPreapproveContainer}
				/>
				<Route
					path={`${path}/:orderId/allowance/in-progress`}
					component={MarketplaceOrderTxInProgressContainer}
				/>
				<Route
					path={`${path}/:orderId/allowance/error`}
					component={MarketplaceOrderTxErrorContainer}
				/>
			</div>
		);
	}
}

export default MarketplaceOrdersPage;
export { MarketplaceOrdersPage };
