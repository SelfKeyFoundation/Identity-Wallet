import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { PageLoading } from '../common/page-loading';
import { MarketplacePaymentContainer } from './payment-container';
import { MarketplacePaymentPreapproveContainer } from './preapprove-container';

const Test = () => <div>test</div>;

class MarketplaceOrdersPage extends Component {
	render() {
		const { path } = this.props.match;
		return (
			<div>
				<Route path={`${path}/loading`} component={PageLoading} />
				<Route path={`${path}/:orderId/payment`} component={MarketplacePaymentContainer} />
				<Route path={`${path}/:orderId/payment/in-progress`} component={Test} />
				<Route path={`${path}/:orderId/payment/complete`} component={Test} />
				<Route path={`${path}/:orderId/payment/error`} component={Test} />
				<Route
					path={`${path}/:orderId/allowance`}
					component={MarketplacePaymentPreapproveContainer}
				/>
				<Route path={`${path}/:orderId/allowance/in-progress`} component={Test} />
				<Route path={`${path}/:orderId/allowance/complete`} component={Test} />
				<Route path={`${path}/:orderId/allowance/error`} component={Test} />
			</div>
		);
	}
}

export default MarketplaceOrdersPage;
export { MarketplaceOrdersPage };
